// api/config.js
// Frontend'in Supabase'e bağlanması için gereken İKİ KAMUYA AÇIK değeri döner: proje URL'si ve anon anahtar.
// Bu ikisi tasarım gereği herkese açıktır (Supabase dokümanı: "anon key is safe to expose"); gerçek erişim
// kontrolü veritabanındaki Row Level Security politikalarındadır, bu anahtarın gizliliğinde değil.
// service_role anahtarı burada YOK ve asla buraya eklenmeyecek — o anahtar RLS'yi atlar, sadece sunucu
// tarafında (varsa) kullanılır, frontend'e hiç gönderilmez.
// Bu sayede SUPABASE_URL/ANON_KEY repoya gömülmez; Vercel ortam değişkeninden okunur, oradan değiştirilebilir.

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  // tarayıcı önbelleğe alabilir ama kısa tutalım: anahtar rotasyonu olursa uzun önbellek gecikme yaratır
  res.setHeader("Cache-Control", "public, max-age=60");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Sadece GET" });

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) return res.status(500).json({ error: "SUPABASE_URL / SUPABASE_ANON_KEY ayarlı değil" });

  // FAZ 6: anonim akıştaki (hesapsız) zorunlu yaş beyanının tabanı normalde 13'tür (AGE_TIER'ın en genç
  // katmanı). TEST_MIN_AGE ortam değişkeni SADECE test/staging ortamlarında bu tabanı düşürmek için —
  // ekip, çocuk test kullanıcısı olmadan çok genç/kenar durumları (ör. teen_13_14 akışını) deneyebilsin.
  // Vercel'de tanımlı DEĞİLSE (üretimde olmamalı) alan hiç gönderilmez, istemci varsayılan 13'ü kullanır.
  // Hesap oluşturma (signUp) MIN_AGE=18 kısıtı bundan AYRIDIR ve bu bayraktan HİÇ etkilenmez.
  const out = { supabaseUrl: url, supabaseAnonKey: anonKey };
  const testMinAge = Number(process.env.TEST_MIN_AGE);
  if (Number.isFinite(testMinAge) && testMinAge > 0) out.testMinAge = testMinAge;

  return res.status(200).json(out);
}
