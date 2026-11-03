// api/history.js
// Sohbet geçmişini senkron koduyla getirir, tek bir karakterin kaydını unutur (forget) ya da tümünü siler.
// Kod URL'de değil gövdede gelir (loglara düşmesin diye yalnızca POST).
//
// Oturum (Authorization: Bearer <jwt>) varsa: Postgres'teki sohbetler/mesajlar üzerinde çalışır (RLS,
// kullanıcı sadece kendi satırlarını görür/siler). Şekli anonim {chats:{archon:{api:[...]}, ...}} yanıtından
// FARKLI (kasıtlı — iki model birbirini taklit etmiyor): {sohbetler:[{id,persona,title,updated_at}, ...]}.
// Bu, mevcut geçmiş sayfasının (index.html) henüz Postgres'i GÖSTERMEDİĞİ anlamına gelir — bu uç nokta şimdilik
// sadece RLS'nin API seviyesinde de doğru izole ettiğini test etmek ve ileride UI'ya bağlanmak için var.

import { rejectIfLimited, validCode, loadHistory, deleteHistory, forgetPersonaHistory, HISTORY_PERSONAS } from "./_redis.js";
import { userClient } from "./_supabase.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  if (await rejectIfLimited(req, res)) return;

  const { code, action, persona, sohbetId } = req.body || {};

  const auth = await userClient(req);
  if (auth) {
    try {
      if (action === "get") {
        const { data, error } = await auth.client
          .from("sohbetler")
          .select("id, persona, title, updated_at")
          .order("updated_at", { ascending: false });
        if (error) throw error;
        return res.status(200).json({ sohbetler: data });
      }
      if (action === "delete") {
        // sohbetId verilmişse tek sohbet (mesajlar cascade ile gider); verilmemişse kullanıcının TÜM
        // sohbetlerini siler (anonim "delete"in — tüm geçmişi sil — karşılığı).
        let q = auth.client.from("sohbetler").delete();
        q = sohbetId ? q.eq("id", sohbetId) : q.eq("user_id", auth.user.id);
        const { error } = await q;
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      if (action === "forget") {
        if (!HISTORY_PERSONAS.includes(persona)) return res.status(400).json({ error: "Geçersiz persona" });
        const { error } = await auth.client.from("sohbetler").delete().eq("persona", persona);
        if (error) throw error;
        return res.status(200).json({ ok: true });
      }
      return res.status(400).json({ error: "Geçersiz işlem" });
    } catch (e) {
      console.error("history (postgres) error:", e.message);
      return res.status(503).json({ error: "Geçmiş şu an kullanılamıyor" });
    }
  }

  // Oturum yoksa (anonim): eskisi gibi senkron kod + Redis.
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
