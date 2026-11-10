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

- **Karar (FAZ 4):** "Hemen sil" service_role/Admin API KULLANMADAN yapıldı: `delete_my_account()`
  SECURITY DEFINER bir Postgres fonksiyonu kendi `auth.users` satırını siler, `profiles`/`sohbetler`/
  `mesajlar`/`user_memories` zaten `on delete cascade` ile tanımlı (0001-0003), otomatik ve kalıcı silinir.
  **Neden:** `api/_supabase.js`'teki mevcut tasarım kuralı ("service_role anahtarı bu akışta gerekmiyor,
  sızma riski bu dosyada yok") ile tutarlı — yeni bir sunucu endpoint'i ve SERVICE_ROLE_KEY'in koda
  girmesi gerekmedi. **Doğrulanmadı:** fonksiyonu oluşturan rolün (Supabase SQL Editor'da normalde
  "postgres") `auth.users`'da DELETE yetkisi olduğu varsayıldı — yaygın/belgeli bir desen ama BU
  Supabase projesinde migration çalıştırılıp gerçekten denenmeden kesin değil. Çalışmazsa alternatif:
  Admin API + service_role ile bir `api/account.js` endpoint'i (yazılmadı, gerekirse eklenir).
- **Karar (FAZ 4):** "Silinecekler listesi" ve silme sonrası "kalan kayıt sayısı 0" kontrolü AYNI
  fonksiyonla (`account_data_counts`) yapılıyor: silme sonrası JWT bir süre daha geçerli kaldığından
  (satır gitmiş olsa da) aynı çağrı tekrar yapılabiliyor ve gerçek sayıları (0) döndürüyor.
- **Karar (FAZ 4):** Dondurma süresi bitip 30 gün giriş yoksa kalıcı silme kuralı `auth.users.
  last_sign_in_at` ile ölçülüyor (frozen_until'dan SONRA giriş varsa aday listesinden çıkar, dondurmayı
  açmasa bile) — ekstra bir "son giriş" kolonu gerekmedi. **Bana düşen:** bu, `run_account_retention_
  sweep()` fonksiyonunu GÜNLÜK çalıştıracak bir cron (Supabase pg_cron ya da Vercel Cron) kurulumu
  gerektiriyor; migration sadece fonksiyonu tanımlıyor, zamanlamayı KURMUYOR (talimat: hiçbir şey
  çalıştırılmayacak/kurulmayacaktı).
- **Karar (FAZ 4):** "SİL"/"DELETE" onay kelimesi dile göre sabit metne gömüldü (`acctManage.delete.
  confirmLabel`), `{değişken}` olarak DEĞİL — çünkü `data-i18n-attr` placeholder'ları değişken
  geçirmiyor (yalnızca `t(key)`, vars'sız çağrılıyor); aksi hâlde kullanıcı literal "{word}" görürdü.
- **Yapılamadı (FAZ 4, bilerek):** Yüz/ses/avatar-sağlayıcı kayıtlarının silinmesi — bu veriler henüz
  HİÇBİR TABLODA saklanmıyor (ElevenLabs/avatar entegrasyonu roadmap'te v1 sonrası). "Silinecekler
  listesi" bunu kullanıcıya açıkça söylüyor (acctManage.delete.note). İleride o tablolar eklenince
  `auth.users(id) on delete cascade` kuralına uyarlarsa `delete_my_account()` DEĞİŞMEDEN onları da siler;
  sadece `account_data_counts()`'a elle bir satır eklenmesi gerekir (migration'da not var).
- **Yapılamadı (FAZ 4):** 7-gün-önce ve süre-bitti e-postalarının gerçek gönderimi — taslaklar
  `supabase/emails/freeze-7d-before.md` ve `freeze-expired.md`'de, gönderime bağlanmadı (talimat:
  "gönderimi bağlama").

## Yapılanlar (commit sırasıyla) — devamı

5. (bu commit) — FAZ 4: Ayarlar > "Hesabı yönet" sayfası — dondur (1 ay/1 yıl/10 yıl, `FREEZE_DURATIONS`
   tek sabit), girişte tek-dokunuşla-aç kakışır penceresi (frozen hesapla girişte otomatik), hemen sil
   (şifre + "SİL"/"DELETE" onayı, silinecekler listesi, silme sonrası kalan-sayı-0 gösterimi, yerel
   profil/kolaj/sohbet önbelleğini de temizler). `supabase/migrations/0004_dondur_sil.sql` (ÇALIŞTIRILMADI
   — bkz. aşağıdaki migration sırası), `supabase/emails/*.md` taslakları, `tools/test-account-delete.mjs`
   (sahte veritabanı testi, 8/8 geçti — `node tools/test-account-delete.mjs`).

## Devam ediyor / sıradaki

FAZ 5 (Ayarlar/Instagram menüsü) — sıradaki.

## Yapılamayanlar

(Atlanan adımlar buraya, nedeniyle.)

## Migration çalıştırma sırası (SEN çalıştıracaksın)

1. `0001_profiles.sql`
2. `0002_sohbetler_mesajlar.sql`
3. `0003_user_memories.sql`
4. `0004_dondur_sil.sql` (0001'den sonra; profiles'a kolon ekler + 3 fonksiyon tanımlar)
(hiçbiri bu gece ÇALIŞTIRILMADI — hepsi SQL Editor'da sırayla senin çalıştırmanı bekliyor.)

## Bana düşen adımlar

- `0004_dondur_sil.sql`'i Supabase SQL Editor'da çalıştır (0001'den sonra).
- `public.run_account_retention_sweep()`'i GÜNLÜK çağıracak bir zamanlayıcı kur (Supabase pg_cron:
  `select cron.schedule('account-retention','0 3 * * *','select public.run_account_retention_sweep();');`
  ya da Vercel Cron + küçük bir endpoint). Kurulmadıkça dondurma süresi bitip 30 gün giriş olmayan
  hesaplar OTOMATİK silinmez (fonksiyon tanımlı ama tetiklenmiyor).
- `delete_my_account()`'un gerçek bir Supabase projesinde çalıştığını DOĞRULA (bkz. yukarıdaki "Karar"
  notu — `auth.users` üzerinde DELETE yetkisi varsayıldı, test edilmedi).
- İstersen `supabase/emails/*.md` taslaklarını bir e-posta servisine (Supabase SMTP/Resend/Postmark) bağla.
- `assets/characters/` altına gerçek `collage-1..N.webp`, `archon.webp`, `multivac.webp`, `mirror.webp`
  görsellerini ekle (FAZ 2) — kod değişikliği gerekmez, otomatik görünür.

## Test komutları

- `node tools/verify-protected-chat.mjs check` — `api/chat.js`'teki kriz/güvenlik/dil bloklarının
  birebir kaldığını doğrular. Bu dosyaya dokunan HER commit'ten sonra çalıştırılmalı.
- `node tools/test-account-delete.mjs` — FAZ 4 silme/dondurma mantığının sahte veritabanı testi (8 test).
