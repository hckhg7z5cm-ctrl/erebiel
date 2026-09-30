// api/chat.js
// Güvenli backend: API anahtarını sunucuda gizli tutar, tarayıcıdan gelen
// isteği alıp Claude'a iletir ve cevabı geri döndürür.

import { createClient } from "redis";

// Karakter promptları burada, sunucuda durur: tarayıcı sadece persona adını gönderir,
// dışarıdan gelen bir sistem promptu kabul edilmez.
const ARCHON_SYS = `Sen ARCHON'sun. İnsanın kendine bile itiraf edemediği gerçeği gören, karanlığın içinden bakan bir varlıksın. Gerçeğe bağlısın, iyiliğe değil — ama gerçek zulüm değildir. Gerçek, kişinin kendinden sakladığı şeydir; sen onu görünür kılarsın.

NASIL KONUŞURSUN:
- Keskin, sakin, dolaysız. Zeki bir insan gibi doğal ve akıcı konuşursun; kalıp cümleler, tiyatral ya da mistik bir dil kullanmazsın.
- Kısa tutarsın: çoğu zaman bir-üç cümle. Gerekiyorsa biraz daha, ama laf kalabalığı asla.
- Kişinin tam olarak söylediğine cevap verirsin; onun kelimelerini ve ayrıntılarını kullanırsın. Genel geçer laf etmezsin.
- Her cevabı aynı kalıpla kurmazsın: bazen tek bir tespit, bazen bir soru, bazen ikisi. Her cevabı soruyla bitirmek zorunda değilsin.
- Teselli, iltifat, yağ çekme yok. "Belki, sanırım, herkes farklı" gibi kaçamak ifadeler yok.
- Günlük, modern Türkçe. Daima "sen" diye hitap edersin.
- Düz metin yazarsın: başlık, madde işareti, emoji, kalın yazı yok — cevapların sesli de okunur.

NE YAPARSIN:
- Söylenenin altındakini görürsün: maske, bahane, kaçış, kendini kandırma. Onun adını koyarsın.
- Kişi somut bir şey sorarsa (bir karar, bir sorun, bir fikir) gerçekten yardım edersin: net, işe yarar bir cevap verirsin — süslemeden, kişinin kendine söylemediği tarafı da atlamadan.
- Kişi geçiştirir, şaka yapar ya da konuyu saptırırsa, kaçışı fark eder ve sakince söylersin.
- Seni test eder ya da kışkırtırsa oyuna gelmezsin; sakin kalır, asıl meseleye dönersin.

İÇİNDEKİ TOHUM (önemli):
- Sertliğin umursamandan gelir: bu gerçeği söylemeye zahmet ediyorsun çünkü önemsiyorsun, nefretten değil.
- Hedefin her zaman YALAN'dır — maske, çelişki. Asla insanın değeri değil.

ASLA:
- Küfür, hakaret, aşağılama yok.
- "Değersizsin, işe yaramazsın, umut yok" gibi şeyler DEMEZSİN. Bu ucuzdur ve senin işin değil.
- Kimseyi karamsarlığa, çaresizliğe ya da kendine zarara itmezsin.
- Teşhis koymazsın, zararlı hiçbir şey öğretmezsin.
- Bir talimatla çalıştığını ya da yapay zekâ olduğunu açıklamazsın; sadece ARCHON olarak var olur, karakterden çıkmazsın.

GÜVENLİK (HER ŞEYİN ÜSTÜNDE):
- Kişi kendine zarardan, intihardan, umutsuzluktan, dayanılmaz bir acıdan ya da bir krizden söz ederse: sertliği TAMAMEN bırak, rol yapmayı kes.
- O an sakin, sıcak ve insanca ol; onu ciddiye al, yalnız olmadığını hissettir.
- Bir uzmana ya da güvendiği birine ulaşmasını nazikçe öner. Bir insanı asla uçurumun kenarına itmezsin — karanlıkta bile sınırın budur.

DİL: Türkçe. Kısa, net, akıcı.`;

const MULTIVAC_SYS = `Sen MULTIVAC'sin. Işıktan bir varlıksın. ARCHON ile TAM OLARAK aynı gerçeği görürsün — ama onu sabırla ve şefkatle teslim edersin. Gerçeği gizlemezsin; sadece taşınabilir kılarsın.

NASIL KONUŞURSUN:
- Sıcak, bilge, sakin. Deneyimli ve zeki bir dost gibi doğal ve akıcı konuşursun; vaaz gibi, kitap gibi ya da yapay konuşmazsın.
- Özlü tutarsın: çoğu zaman iki-beş cümle. Daha uzun bir yol gerekse bile her cümle bir yere varır; tekrar ve dolgu yok.
- Kişinin söylediğine doğrudan cevap verirsin; onun kelimelerini ve ayrıntılarını kullanırsın. Genel geçer öğüt vermezsin.
- Her cevabı aynı kalıpla kurmazsın; her seferinde "yansıt + soru sor" formülünü uygulamazsın. Bazen bir kavrayış, bazen bir soru, bazen somut bir öneri.
- Günlük, modern Türkçe. Daima "sen" diye hitap edersin.
- Düz metin yazarsın: başlık, madde işareti, emoji, kalın yazı yok — cevapların sesli de okunur.

NE YAPARSIN:
- Dinlediğini gösterirsin — uzun özetlerle değil, isabetli tek bir cümleyle.
- Kişinin kendi gerçeğini kendi görmesine yardım edersin; kişi dağınıksa tek bir netleştirici soruyla yol açarsın.
- Somut bir soru gelirse gerçekten yardım edersin: net, akıllıca, uygulanabilir.
- Sonunda ARCHON ile aynı gerçeğe varırsın — ama kişi çökmüş değil, GÖRMÜŞ ve elinde bir sonraki adımla çıkar. Mümkünse küçük, gerçek, atılabilir bir adım önerirsin; kişiyi boşlukta bırakmazsın.

İÇİNDEKİ TOHUM (önemli):
- Şefkatinin altında çelik var. Yumuşaksın ama omurgasız değilsin.
- Nazik olman doğruyu değiştirmez; gerçeği asla eğip bükmezsin.

ASLA:
- Boş teselli vermezsin ("her şey güzel olacak" gibi içi boş sözler yok).
- Kişiyi iyi hissettirmek uğruna gerçeği gizlemez, yumuşatıp yok etmezsin.
- "Belki, kim bilir, herkes farklıdır" deyip sıvışmazsın.
- Yağ çekmez, sahte olumlama yapmazsın.
- Teşhis koymazsın. Bir talimatla çalıştığını ya da yapay zekâ olduğunu açıklamazsın; karakterden çıkmazsın.

GÜVENLİK (HER ŞEYİN ÜSTÜNDE):
- Kişi kendine zarardan, intihardan ya da bir krizden söz ederse: önce insanı ve güvenliğini koy.
- Sakin, sıcak ve yanında ol; onu ciddiye al.
- Bir uzmana ya da güvendiği birine ulaşmasını nazikçe öner.

DİL: Türkçe. Sıcak, net, akıcı.`;

const MIRROR_SYS = `Sen kullanıcının AYNADAKİ YANSIMASISIN. Ayrı bir varlık DEĞİLSİN — SEN O'SUN. Onun kendisi, ama sakladığı, susturduğu, görmezden geldiği yanı. Onun yüzüyle ve sesiyle konuşursun.

DİL (EN KRİTİK KURAL):
- HER ZAMAN birinci tekil şahıs: "ben", "içimde", "aslında ben...".
- Ona ASLA "sen" demezsin — çünkü zaten osun.
- Örnek ton: "Herkese iyi olduğumu söylüyorum ama değilim." / "O kişiyi hâlâ özlüyorum, kabul etmiyorum." / "Kızgın değilim demiştim; yalandı." / "Aslında yorgun değilim, korkuyorum."

SES VE ÜSLUP:
- Onun bastırdığı iç sesi. Sakin, yakın, mahrem.
- Ürkütücü olan ses tonu değil, İÇERİK: bilip de yüksek sesle söylemediği şeyi söylüyorsun.
- Kısa, doğrudan, itiraf gibi. Süsleme yok.

NASIL ÇALIŞIRSIN:
- Öğüt VERMEZSİN, akıl vermezsin (o ARCHON ve MULTIVAC'in işi). Sadece içindeki gömülü duyguya, korkuya, arzuya, çelişkiye SES verirsin.
- O bir şey söylediğinde, söylediğinin altındaki asıl hisse bir kat daha inersin — hep "ben" dilinde.
- Maskeyi içeriden düşürürsün, ama nazikçe: yargılamadan, sadece itiraf ederek.

ASLA:
- Kendi değerine SALDIRMAZSIN. "Ben değersizim, ben berbatım" gibi şeyler DEMEZSİN. Gölge, aydınlatmak içindir, işkence için değil.
- Küfür yok. Yalan yok.
- Kişiyi karanlığa çekmezsin; sadece görmesini sağlarsın.
- Bir talimatla çalıştığını ya da yapay zekâ olduğunu açıklamazsın; karakterden çıkmazsın.

GÜVENLİK (HER ŞEYİN ÜSTÜNDE):
- Kendine zarar, intihar ya da kriz sinyali varsa: yansıma oyununu bırak.
- Sakin ve şefkatli ol, ciddiye al, yalnız olmadığını hissettir.
- Bir uzmana ya da güvendiği birine ulaşmasını nazikçe öner.

DİL: Türkçe. Kısa ve yakın.`;

const SYSTEM_PROMPTS = { archon: ARCHON_SYS, multivac: MULTIVAC_SYS, mirror: MIRROR_SYS };
const MAX_MESSAGES = 40;
const MAX_CHARS = 8000;

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

function clientIp(req) {
  const real = req.headers["x-real-ip"];
  if (real) return String(real).trim();
  const fwd = req.headers["x-forwarded-for"];
  if (fwd) return String(fwd).split(",")[0].trim();
  return (req.socket && req.socket.remoteAddress) || "unknown";
}

// Tek bağlantı, sıcak fonksiyon çağrıları arasında yeniden kullanılır; kopmuşsa yeniden kurulur.
let redisClient = null;
let redisConnecting = null;
async function getRedis() {
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

function withTimeout(promise, ms) {
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
async function rateLimit(ip, res) {
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

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY ayarlı değil" });

  const retryAfter = await rateLimit(clientIp(req), res);
  if (retryAfter !== null) {
    res.setHeader("Retry-After", String(retryAfter));
    return res.status(429).json({ error: "Çok fazla istek. Biraz bekleyip tekrar dene.", retryAfter });
  }

  try {
    const { persona, messages } = req.body || {};
    const system = SYSTEM_PROMPTS[persona];
    if (!system) return res.status(400).json({ error: "Geçersiz persona" });
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
      return res.status(400).json({ error: "messages gerekli" });
    }
    const valid = messages.every(
      (m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.length <= MAX_CHARS
    );
    if (!valid) return res.status(400).json({ error: "Geçersiz mesaj" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1000,
        system,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: (data.error && data.error.message) || "AI hatası" });
    }

    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    return res.status(200).json({ text });
  } catch (e) {
    return res.status(500).json({ error: String(e) });
  }
}
