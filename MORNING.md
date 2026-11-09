# Gece raporu — giris-sistemi

Bu dosya gece boyunca güncellenir. En güncel hâli dosyanın sonunda. Hiçbir adımda
main'e dokunulmadı, hiçbir şey canlıya alınmadı, veritabanında/Supabase'de/Vercel'de
hiçbir şey çalıştırılmadı. Her adım kendi commit'i olarak giris-sistemi'ne push'landı.

## Genel kararlar

- **Karar:** `.gitignore`'a `.DS_Store` ve `**/.DS_Store` eklendi, önceden izlenen bir
  `.DS_Store` yoktu (zaten untracked'tı) — ekstra bir "untrack" commit'i gerekmedi.
  **Neden:** istenen, risk yok.
- **Karar:** Kriz/güvenlik ve dil kuralı bölümleri olarak `api/chat.js` içindeki
  `CRISIS_GUIDE`, `CRISIS_CONDUCT`, `COMMON` (güvenlik kısmı), her persona promptunun
  `GÜVENLİK` bölümü, `CRISIS_HINT`, `pickThinking`'in kriz kısa yolu ve `systemBlocks`
  (LANGUAGE kuralı) kabul edildi. Bu dosyaya FAZ 6 (AGE_TIER) için dokunulduğunda bu
  bloklar **değiştirilmeden**, yalnızca yeni ek mantık (yaş katmanına göre ek metin)
  etrafına eklenecek; değişmediğini doğrulayan script bu dosyanın altında.
- **Karar:** FAZ 2'deki "giriş ekranı" mevcut `#auth` sayfası (Ayarlar/More menüsünden
  "signin" ile açılan) olarak yorumlandı — ayrı, anonim akışı bloke eden yeni bir tam
  ekran kapı DEĞİL. Zaten var olan "threshold" (üç sembol) ekranı anonim giriş noktası
  olarak aynen kaldı. **Neden:** "mevcut anonim akışı... bozma" talimatı; uygulamanın
  anonim-öncelikli tasarımı (Archon/Multivac/Mirror sembolleri ana ekranda) buna işaret
  ediyor.

## Yapılanlar (commit sırasıyla)

1. `a452efb` — `.gitignore`: `.DS_Store` her yerde yok sayılsın.
2. `bd50ccd` — FAZ 2: `#auth` sayfasına arkada yavaş kayan karakter kolajı
   (`assets/characters/collage-N.webp`, yoksa sessizce atlanır, `prefers-reduced-motion`'a
   uyar, `loading="lazy"`/`decoding="async"`), Archon/Multivac/Mirror kısa kartları,
   marka başlığı. Mevcut Instagram-sade form (e-posta/şifre, "Şifreni mi unuttun?",
   "Yeni hesap oluştur", çift-gönderim koruması, Türkçe/İngilizce hata mesajları —
   diğer 14 dilde otomatik İngilizceye düşer) **değiştirilmedi**, sadece üstüne
   hero+kolaj eklendi. `i18n.js`'e `auth.hero.*` ve `auth.card.*` (en/tr) eklendi.
   `assets/characters/README.md`: beklenen dosya adları (collage-1..N.webp,
   archon/multivac/mirror.webp).

## Devam ediyor / sıradaki

(Bu bölüm her adımda güncellenir.)

## Yapılamayanlar

(Atlanan adımlar buraya, nedeniyle.)

## Migration çalıştırma sırası (SEN çalıştıracaksın)

1. `0001_profiles.sql`
2. `0002_sohbetler_mesajlar.sql`
3. `0003_user_memories.sql`
(yukarıdakiler zaten FAZ 1'de yazıldı, hâlâ çalıştırılmamışsa bu sırayla.)

## Bana düşen adımlar

(Sona eklenecek.)

## Test komutları

(Sona eklenecek.)
