// api/history.js
// Sohbet geçmişini senkron koduyla getirir ya da siler.
// Kod URL'de değil gövdede gelir (loglara düşmesin diye yalnızca POST).

import { rejectIfLimited, validCode, loadHistory, deleteHistory } from "./_redis.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  if (await rejectIfLimited(req, res)) return;

  const { code, action } = req.body || {};
  if (!validCode(code)) return res.status(400).json({ error: "Geçersiz kod" });
  if (!process.env.REDIS_URL) return res.status(503).json({ error: "Geçmiş şu an kullanılamıyor" });

  try {
    if (action === "get") return res.status(200).json({ chats: await loadHistory(code) });
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
