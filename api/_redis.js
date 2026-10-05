// api/_redis.js
// Ortak modül (alt çizgiyle başladığı için Vercel bunu ayrı bir uç nokta yapmaz):
// Redis bağlantısı, rate limit ve sohbet geçmişi. api/chat.js ve api/history.js kullanır.

import { createClient } from "redis";
import { createHash } from "crypto";

// ---- Rate limit ----
// IP başına dakikalık ve günlük sınır; Redis varsa ayrıca tüm site için günlük tavan.
// Değerler Vercel ortam değişkenleriyle değiştirilebilir.
const PER_MINUTE = Number(process.env.RATE_PER_MINUTE) || 12;
const PER_DAY = Number(process.env.RATE_PER_DAY) || 150;
const GLOBAL_PER_DAY = Number(process.env.RATE_GLOBAL_PER_DAY) || 3000;

// REDIS_URL (Redis Cloud entegrasyonu) tanımlıysa sayaçlar tüm sunucu kopyalarında ortaktır.
// Tanımlı değilse ya da Redis'e ulaşılamazsa her kopya kendi hafızasında sayar
// (en iyi çaba: kopyalar arasında paylaşılmaz, soğuk başlangıçta sıfırlanır).
const REDIS_URL = process.env.REDIS_URL;
const REDIS_TIMEOUT_MS = 1500;
const REDIS_COOLDOWN_MS = 30000; // bir hatadan sonra Redis'i bu süre boyunca denemeden hafızaya geç
let redisDownUntil = 0;

const memory = new Map();

export function clientIp(req) {
  const real = req.headers["x-real-ip"];
  if (real) return String(real).trim();
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return String(fwd).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

// Tek bağlantı, sıcak fonksiyon çağrıları arasında yeniden kullanılır; kopmuşsa yeniden kurulur.
let redisClient = null;
let redisConnecting = null;
export async function getRedis() {
  if (redisClient && redisClient.isReady) return redisClient;
  if (!redisConnecting) {
    const client = createClient({
      url: REDIS_URL,
      socket: { connectTimeout: REDIS_TIMEOUT_MS, reconnectStrategy: (retries) => (retries > 2 ? false : 200) },
    });
    client.on("error", (e) => console.error("redis:", e.message));
    redisConnecting = client
      .connect()
      .then(() => { redisClient = client; return client; })
      .finally(() => { redisConnecting = null; });
  }
  return redisConnecting;
}

export function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("redis timeout")), ms); }),
  ]).finally(() => clearTimeout(timer));
}

async function countWithRedis(keys) {
  // keys: [[key, ttlSeconds], ...] → tek MULTI içinde her biri için INCR + EXPIRE; artmış değerleri döndürür
  const client = await withTimeout(getRedis(), REDIS_TIMEOUT_MS);
  const tx = client.multi();
  for (const [k, ttl] of keys) tx.incr(k).expire(k, ttl);
  const out = await withTimeout(tx.exec(), REDIS_TIMEOUT_MS);
  return keys.map((_, i) => Number(out[i * 2]));
}

function countInMemory(keys) {
  const now = Date.now();
  if (memory.size > 5000) for (const [k, v] of memory) if (v.until < now) memory.delete(k);
  return keys.map(([k, ttl]) => {
    const e = memory.get(k);
    if (!e || e.until < now) { memory.set(k, { n: 1, until: now + ttl * 1000 }); return 1; }
    e.n += 1;
    return e.n;
  });
}

// null → izin var; sayı → kaç saniye sonra tekrar denenebilir
export async function rateLimit(ip, res) {
  const now = Date.now();
  const minute = Math.floor(now / 60000);
  const day = new Date(now).toISOString().slice(0, 10);
  const keys = [[`rl:m:${ip}:${minute}`, 70], [`rl:d:${ip}:${day}`, 90000]];
  let counts;
  let shared = false;
  if (REDIS_URL && now >= redisDownUntil) {
    try {
      counts = await countWithRedis([...keys, [`rl:g:${day}`, 90000]]);
      shared = true;
    } catch (e) {
      redisDownUntil = now + REDIS_COOLDOWN_MS;
      console.error("rate limit: redis unavailable, using in-memory counter for 30s:", e.message);
    }
  }
  if (!counts) counts = countInMemory(keys);
  res.setHeader("X-RateLimit-Store", shared ? "redis" : "memory");
  const [perMinute, perDay, global] = counts;
  const secondsToMidnight = Math.ceil((Date.parse(day + "T00:00:00Z") + 86400000 - now) / 1000);
  if (perMinute > PER_MINUTE) return 60 - (Math.floor(now / 1000) % 60);
  if (perDay > PER_DAY) return secondsToMidnight;
  if (shared && global > GLOBAL_PER_DAY) return secondsToMidnight;
  return null;
}

// Rate limit uygular; sınır aşıldıysa 429 yanıtını yazar ve true döner.
export async function rejectIfLimited(req, res) {
  const retryAfter = await rateLimit(clientIp(req), res);
  if (retryAfter === null) return false;
  res.setHeader("Retry-After", String(retryAfter));
  res.status(429).json({ error: "Çok fazla istek. Biraz bekleyip tekrar dene.", retryAfter });
  return true;
}

// ---- Sohbet geçmişi ----
// Kimlik: tarayıcının ürettiği gizli senkron kodu (Crockford base32, 20 karakter ≈ 100 bit).
// Redis'te kodun kendisi değil SHA-256 özeti anahtar olur. Son kullanımdan 90 gün sonra silinir.
// Yapı: hist:<özet> hash'i → alan başına (archon / multivac) {api:[...], ts} JSON.
export const HISTORY_PERSONAS = ["archon", "multivac"]; // Ayna iz bırakmaz, saklanmaz
const HISTORY_TTL = 90 * 24 * 60 * 60;
const HISTORY_MAX_MESSAGES = 40;
const HISTORY_MAX_BYTES = 120000;
const CODE_RE = /^[0-9A-HJKMNP-TV-Z]{4}(-[0-9A-HJKMNP-TV-Z]{4}){4}$/;

export function validCode(code) {
  return typeof code === "string" && CODE_RE.test(code);
}

function historyKey(code) {
  return "hist:" + createHash("sha256").update(code).digest("hex");
}

export async function saveHistory(code, persona, messages) {
  let api = messages.slice(-HISTORY_MAX_MESSAGES);
  while (api.length && api[0].role !== "user") api.shift();
  // boyut sınırı: çok uzunsa en eski mesajlardan kırp
  while (api.length > 2 && Buffer.byteLength(JSON.stringify(api)) > HISTORY_MAX_BYTES) {
    api = api.slice(2);
    while (api.length && api[0].role !== "user") api.shift();
  }
  if (!api.length) return;
  const client = await withTimeout(getRedis(), 1500);
  const key = historyKey(code);
  await withTimeout(
    client.multi().hSet(key, persona, JSON.stringify({ api, ts: Date.now() })).expire(key, HISTORY_TTL).exec(),
    1500
  );
}

export async function loadHistory(code) {
  const client = await withTimeout(getRedis(), 1500);
  const key = historyKey(code);
  const [reply] = await withTimeout(client.multi().hGetAll(key).expire(key, HISTORY_TTL).exec(), 1500);
  // MULTI içinde node-redis HGETALL'ı nesne değil düz dizi ([alan, değer, ...]) olarak döndürüyor
  const raw = Array.isArray(reply)
    ? Object.fromEntries(reply.flatMap((v, i, a) => (i % 2 ? [] : [[v, a[i + 1]]])))
    : reply;
  const chats = {};
  for (const p of HISTORY_PERSONAS) {
    if (!raw || !raw[p]) continue;
    try { chats[p] = JSON.parse(raw[p]); } catch (e) { /* bozuk kayıt: yok say */ }
  }
  return chats;
}

// forget a single persona's stored conversation (the user deleted it from their list)
export async function forgetPersonaHistory(code, persona) {
  const client = await withTimeout(getRedis(), 1500);
  await withTimeout(client.hDel(historyKey(code), persona), 1500);
}

export async function deleteHistory(code) {
  const client = await withTimeout(getRedis(), 1500);
  await withTimeout(client.del(historyKey(code)), 1500);
}
