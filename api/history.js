// api/history.js
// Sohbet geçmişini senkron koduyla getirir, tek bir karakterin kaydını unutur (forget) ya da tümünü siler.
// Kod URL'de değil gövdede gelir (loglara düşmesin diye yalnızca POST).

import { rejectIfLimited, validCode, loadHistory, deleteHistory, forgetPersonaHistory, HISTORY_PERSONAS } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  if (await rejectIfLimited(req, res)) return;

  const { code, action, persona } = req.body || {};
  if (!validCode(code)) return res.status(400).json({ error: "Geçersiz kod" });
  if (!process.env.REDIS_URL) return res.status(503).json({ error: "Geçmiş şu an kullanılamıyor" });

  try {
    if (action === "get") return res.status(200).json({ chats: await loadHistory(code) });
    if (action === "forget") {
      if (!HISTORY_PERSONAS.includes(persona)) return res.status(400).json({ error: "Geçersiz persona" });
      await forgetPersonaHistory(code, persona);
      return res.status(200).json({ ok: true });
    }
    if (action === "delete") {
      await deleteHistory(code);
      return res.status(200).json({ ok: true });
    }
    return res.status(400).json({ error: "Geçersiz işlem" });
  } catch (e) {
    console.error("history error:", e.message);
    return res.status(503).json({ error: "Geçmiş şu an kullanılamıyor" });
  }
}
