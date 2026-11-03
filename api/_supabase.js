// api/_supabase.js
// Oturum (giriş yapmış kullanıcı) için ortak yardımcı. api/chat.js ve api/history.js kullanır.
//
// ÖNEMLİ: Bu modül SUPABASE_SERVICE_ROLE_KEY'e HİÇ dokunmaz. RLS'yi atlamamıza gerek yok: her istek,
// kullanıcının kendi erişim token'ıyla (JWT) kurulan bir Supabase istemcisi kullanıyor; Postgres'teki RLS
// politikaları auth.uid() üzerinden kullanıcıyı zaten kendi satırlarıyla sınırlıyor. service_role anahtarı
// bu akışta gerekmiyor, dolayısıyla burada import edilmiyor bile — sızma riski bu dosyada yok.
//
// Token yoksa (Authorization header boş): anonim istek demektir, eski senkron-kod/Redis akışı dokunulmadan
// çalışmaya devam eder (api/chat.js'de böyle kullanılıyor). Bu, hesap sistemini MEVCUT akışın yanına ekler,
// yerine koymaz.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export function bearerToken(req) {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || typeof h !== "string" || !h.startsWith("Bearer ")) return null;
  const token = h.slice(7).trim();
  return token || null;
}

// token yoksa ya da geçersizse null döner. Geçerliyse { client, user } döner: client, RLS'nin otomatik
// uygulanması için bu kullanıcının token'ıyla kurulmuştur — client.from(...) sorguları yalnızca auth.uid()'in
// kendi satırlarını görür/değiştirir.
export async function userClient(req) {
  const token = bearerToken(req);
  if (!token || !SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  try {
    const { data, error } = await client.auth.getUser(token);
    if (error || !data?.user) return null;
    return { client, user: data.user };
  } catch (e) {
    console.error("supabase auth.getUser failed:", e.message);
    return null;
  }
}
