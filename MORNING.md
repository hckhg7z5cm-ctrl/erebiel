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

- **Karar (FAZ 3):** Hesaplar arası geçiş, çıkış yapmadan (`sb.auth.signOut` ÇAĞRILMADAN)
  `sb.auth.setSession({access_token,refresh_token})` ile yapılıyor — her başarılı oturum
  olayında (`onAuthStateChange`) o hesabın token'ları `erebiel-session:<uid>` altına
  kaydediliyor. **Neden:** `signOut()`'un `scope` parametresine göre refresh token'ı
  sunucuda geçersiz kılıp kılmadığı (supabase-js v2.118) çevrimdışı doğrulanamadı; geçiş
  sırasında hiç `signOut` çağırmamak bu riski tamamen ortadan kaldırıyor. Kayıtlı token
  geçersiz/süresi geçmişse geçiş sessizce başka bir şeye düşmez: o hesap için normal giriş
  formu (e-posta önceden dolu) açılır. **Doğrulanmadı:** gerçek bir Supabase projesi
  olmadan `setSession`/`signOut({scope})` davranışı test edilemedi — ilk gerçek denemede
  dikkatle izlenmeli.
- **Karar (FAZ 3):** Yerel veri ayrımı yalnızca üç anahtar için: `erebiel-profile`,
  `erebiel-chats`, `erebiel-chats-deleted` → oturum açık kullanıcıda `acct:<uid>:` önekiyle;
  `erebiel-last-visit` ve `erebiel-sync-code` kasıtlı olarak ÖNEKSİZ (cihaz bazlı, anonim
  akışa özel). IndexedDB'de `images`/`boards` kayıtları bir `scope` alanıyla etiketlendi
  (`"anon"` ya da `"u:<uid>"`); etiketsiz eski kayıtlar `"anon"` sayılır. Kolaj tahtasının
  sabit `id:"main"`'i yalnızca anonimde aynen kaldı (çakışma yoktu); her hesap artık kendi
  `"main:u:<uid>"` satırını kullanıyor (aksi hâlde tüm hesaplar tek "main" satırını paylaşıp
  üzerine yazardı — IndexedDB'de `id` birincil anahtar). **Neden:** anonim kullanıcının
  mevcut verisi birebir aynı okunabilir kalsın (talimat), ama aynı cihazda iki hesap profil/
  kolaj/sohbet-önbelleğini karıştırmasın (talimat). **Not:** FAZ 1'den beri olası, gerçek
  kullanıcısı olmayan test hesapları varsa onların eski `id:"main"` kolajı artık görünmez
  olur (yeni boş tahtayla başlar) — henüz canlı kullanıcı yok (roadmap: v1 henüz çıkmadı),
  bu kabul edilebilir görüldü.
- **Karar (FAZ 3):** "Bu cihazdan çıkış" (`scope:"local"`) o hesabın kayıtlı hızlı-geçiş
  token'ını siler (bir sonraki seçimde normal giriş formu açılır) ama hesabı listeden
  SİLMEZ — "tüm cihazlardan çıkış" (`scope:"global"`) hem token'ı hem listedeki kaydı siler.
  **Neden:** Instagram'daki gibi "listede kalsın, sadece tekrar şifre sorsun" davranışı en
  sezgisel görüldü; sorulamadı, en makul varsayım bu.

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
3. `554b63f` — Araç: `tools/verify-protected-chat.mjs` + taban — `api/chat.js`'teki
   kriz/güvenlik/dil bloklarının birebir kaldığını doğrular (FAZ 6'dan önce taban alındı).
4. (bu commit) — FAZ 3: hesap ekle/değiştir/çıkış. `#auth` → signed-in görünümüne hesap
   listesi (`acctList`, tıkla-geç), "Hesap ekle", "Bu cihazdan çıkış", "Tüm cihazlardan
   çıkış" eklendi. Yerel veri ayrımı (localStorage anahtar öneki + IndexedDB `scope`
   alanı) yukarıdaki kararlarda. **Test:** `node tools/verify-protected-chat.mjs check`
   dokunulmadı (bu adım `api/chat.js`'e dokunmadı, zaten gerekmiyordu).

## Devam ediyor / sıradaki

FAZ 4 (dondur/sil) — sıradaki.

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
