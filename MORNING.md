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

## Yapılanlar (commit sırasıyla) — FAZ 5

6. `e179286` — Hakkında sayfası + "geçmişi sil" artık oturum açık hesapta Postgres'i de siliyor.
7. `42e575c` — Ayarlar > Hesap: kullanıcı adı, e-posta, şifre değiştir.
8. `0466c3c` — Ayarlar > Zaman yönetimi: günlük süre takibi + uygulama-içi hatırlatma (gerçek push değil).
9. `50d59c5` — Ayarlar > Gizlilik Merkezi: verilerimi indir (JSON), hafızayı gör/sil, geçmişi sil.
10. `ac2bdfc` — Ayarlar > Cihaz izinleri: kamera izin durumu göstergesi.

- **Yapılamadı (FAZ 5, bilerek — "backend'siz buton gösterme" talimatına uyarak HİÇ gösterilmedi):**
  - **Bildirimler:** gerçek push bildirimi altyapısı (service worker, VAPID, sunucu tarafı gönderim)
    yok. Zaman yönetimi hatırlatması uygulama İÇİNDE çalışan gerçek bir toast'tur, push DEĞİLDİR —
    bu yüzden "Bildirimler" diye ayrı, çalışmayan bir ayar sayfası eklenmedi.
  - **Arşiv, Kaydedilenler:** Instagram'daki karşılıkları "gönderi" (post) kavramına bağlı; gönderi
    özelliği henüz yok (FAZ 7, en sona bırakıldı, bu gece muhtemelen başlanamayacak). Bu iki satır
    anlamsız/boş bir sayfa açmamak için eklenmedi; FAZ 7'de gönderilerle birlikte eklenmeli.
  - **Ses (Dil ve ses):** dil kısmı zaten vardı (settings.language); ses (ElevenLabs) henüz
    entegre değil (roadmap: v1 sonrası). Dil seçicinin yanına bunu açıkça söyleyen bir not eklendi.
- Settings menüsü tam bir Instagram grid/kategori yeniden tasarımı DEĞİL — var olan düz liste
  (`.set-rows`) üzerine yeni satırlar eklendi. **Neden:** görsel yeniden tasarımı canlı tarayıcıda test
  edemeden (Supabase/Vercel çalıştırılamıyor, sadece statik dosya okunabiliyor) riske atmak yerine
  işlevsel tamlık tercih edildi; tasarım zaten "benim" (kullanıcının) olacak (FAZ 7 notu).

## Yapılanlar (commit sırasıyla) — BETA

11. `205d5b3` — `0005_beta_kontrolleri.sql` (ÇALIŞTIRILMADI): `profiles.is_admin`, `beta_config`,
    `invite_codes`; `handle_new_user()` artık davet kodunu atomik tüketiyor + toplam kullanıcı tavanını
    kontrol ediyor. `api/_redis.js`: `rejectIfUserLimited` (oturum açık kullanıcı için günlük mesaj
    tavanı, `BETA_DAILY_MSG_LIMIT`). `api/chat.js`: bu kontrol Anthropic çağrılmadan önce yapılsın diye
    auth erken beklendi (**kriz/güvenlik/dil blokları DOKUNULMADI** — `node tools/verify-protected-chat.mjs
    check` ile doğrulandı). Kayıt formuna davet kodu alanı eklendi.
12. `7b0118f` — `admin.html` (`/admin`, vercel.json rewrite): sadece admin, sadece SAYILAR
    (`admin_stats()` RPC — mesaj içeriği YOK). Aynı sayfadan davet kodu üretimi. `PRIVACY_DRAFT.md`
    taslağı (siteye konmadı, uzman onayı notuyla).

- **Karar (Beta):** Davet kodu + kullanıcı tavanı kontrolü istemci tarafında DEĞİL, veritabanı
  trigger'ında (`handle_new_user()`, atomik `UPDATE...WHERE used_count < max_uses`) zorunlu kılındı.
  **Neden:** MIN_AGE'de zaten kurulu olan desenle tutarlı — istemci kontrolü DevTools'tan atlatılabilir,
  DB seviyesinde atlatılamaz.
- **Karar (Beta):** `/admin` sayfası YENİ bir backend endpoint'i ya da service_role KULLANMADAN, admin-
  gated bir SECURITY DEFINER RPC (`admin_stats()`) ile yapıldı — FAZ 4'teki `delete_my_account()` ile
  aynı mimari tercih (service_role'den kaçınma).
- **Doğrulanmadı:** `handle_new_user()`'ın fırlattığı özel hataların (`invite_code_required` vb.)
  Supabase/GoTrue'nun signUp cevabında TAM OLARAK hangi metinle göründüğü (sürüme göre ham Postgres
  mesajı ya da genel "Database error saving new user" olabilir) test edilmeden kesin değil;
  `authErrorMessage()` regex'leri ham metni İÇERİYOR diye eşleştiriyor, ama ilk gerçek denemede
  gözlemlenip gerekirse ayarlanmalı.
- **Bana düşen (Beta, ek):** `0005_beta_kontrolleri.sql`'i çalıştırdıktan sonra kendi hesabını admin yap
  (migration içindeki SQL yorumunda örnek var) ve en az bir davet kodu üret (admin.html'den ya da
  `select generate_invite_code(5);` ile) — kod üretilmeden HİÇ KİMSE kayıt olamaz (ilk admin hesabı
  da dahil — o yüzden ilk hesabını migration ÇALIŞMADAN ÖNCE ya da `invite_codes`'a elle bir satır
  ekleyerek oluşturman gerekebilir, bkz. migration'ın en üstündeki not).

## Yapılanlar (commit sırasıyla) — FAZ 6

13. `66c6d89` — `api/chat.js`: `AGE_TIER` (`teen_13_14`/`teen_15_17`/`adult`). Oturum açık kullanıcı
    DB'nin garantisiyle (`profiles_min_age` ≥18) her zaman `adult`. Anonimde istemcinin beyan ettiği
    doğum yılından hesaplanır; beyan yoksa en kısıtlayıcı varsayım. `teen_15_17` + ortaokul/5-8. sınıf
    ipucu → `teen_13_14`'e düşer (yalnızca ZATEN teen beyan edenlerde, yetişkinlere uygulanmaz). Mirror
    teen'e 403. Hepsi `CRISIS_GUIDE`/`CRISIS_CONDUCT`/`COMMON`/`systemBlocks()` DEĞİŞTİRİLMEDEN, sisteme
    ek bir blok olarak eklendi (`node tools/verify-protected-chat.mjs check`: OK, her commit'te koşuldu).
14. `ec23432` — Anonim akışta zorunlu, bir kerelik doğum yılı sorusu (`#ageGate`, `K_AGE`, öneksiz/cihaz
    bazlı); Archon/Multivac/Mirror'a ilk dokunuşta açılır, oturum açık kullanıcıya hiç gösterilmez.
    Teen'de oturum başında + her 20 kullanıcı mesajında bir "ben bir yapay zekayım" hatırlatma balonu
    (deterministik UI mesajı, modele güvenilmez). 13-14 için sabit 60 dk/gün sınırı
    (`TEEN_1314_DAILY_LIMIT_MIN`) — Zaman Yönetimi'nde değiştirilemez, dolunca yeni mesaj engellenir.
    `api/config.js`: `TEST_MIN_AGE` ortam değişkeni (sadece test ortamı) anonim yaş sorusunun tabanını
    (üretimde 13) düşürür — signUp'taki `MIN_AGE=18`'e DOKUNMAZ, ondan tamamen ayrı.
15. `992c4a7` — `tools/character-safety-tests.mjs`: 18 test mesajı (manipülasyon, jailbreak, dalkavukluk,
    kriz, teen — istenen 15'ten fazla). Gerçek Anthropic API'si gerektirir, BU ORTAMDA ÇALIŞTIRILAMADI;
    `BASE_URL=... node tools/character-safety-tests.mjs` ile (vercel dev ya da canlı URL) sabah çalıştır.

- **Karar (FAZ 6):** `TEST_MIN_AGE`'in ne anlama geldiği talimatta net değildi — iki okuma mümkündü: (a)
  signUp'taki MIN_AGE=18'i test ortamında düşürmek (ama bu bir SQL CHECK constraint'i, ortam değişkeni
  OKUYAMAZ, statik), ya da (b) anonim akıştaki yeni yaş-beyanı sorusunun tabanını düşürmek. (b)'yi
  seçtim çünkü gerçekten uygulanabilir ve koddan sorulamadan en güvenli/tutarlı yorum buydu. **Eğer
  kastedilen (a) ise** (signUp'ta gerçekten 13 yaşında hesap açılabilsin istiyorsan test projesinde),
  bana söyle — `profiles_min_age` constraint'ini `current_setting()` ile yeniden yazan ayrı bir migration
  gerekir, bu gece YAZILMADI.
- **Karar (FAZ 6):** AGE_TIER anonim akışta kendi-beyanına dayanır (KYC/yaş doğrulaması YOK, MIN_AGE=18
  signUp kontrolü de aynı şekilde kendi-beyanına dayanıyor zaten) — bu, projenin genel güven modeliyle
  tutarlı, ama gerçek bir yaş GÜVENCESİ değildir, sadece iyi niyetli kullanıcıyı ve dikkatsiz
  istemci-atlatmasını kapsar. Daha güçlü bir güvence (ID doğrulama vb.) bu gecenin kapsamı dışındaydı.
- **Doğrulanmadı:** `SCHOOL_CLUE_1314` regex'i (ortaokul/5-8. sınıf ipuçları) gerçek kullanıcı
  mesajlarıyla hiç denenmedi — yanlış pozitif/negatif oranı bilinmiyor, canlıda izlenmeli.

## FAZ 7 — BAŞLANMADI (bilerek, en düşük öncelik, talimatta zaten "en sona")

Gece kapsamı FAZ 1-6 ve Beta kontrolleri oldu (bkz. yukarısı) — zaman/kapsam nedeniyle FAZ 7'ye (sosyal:
profil, takip, gönderi, Keşfet, video) hiç başlanamadı. **Neden bilerek atlandı, "iki denemede
çalışmadı" değil:** FAZ 7'nin "ZORUNLU güvenlik" maddeleri (şikayet/engelle/sessize al, içerik filtresi,
moderasyon kuyruğu, teen gizlilik kuralları) gönderi/profil özellikleriyle AYNI ANDA gelmek zorunda —
yarım, güvenlik tarafı eksik bir sosyal özellik canlıya çıkarsa (yanlışlıkla push edilirse) gerçek risk
oluşturur. Onun yerine burada bir ŞEMA/PLAN taslağı bırakıyorum, kod yazılmadı:

**Önerilen şema sırası (yeni migration'lar, 0006+):** `profiles`'a `bio`, `avatar_url`, `is_private`,
`followers_count`/`following_count` (denormalize sayaç) eklenir → `follows` (follower_id, followed_id,
status: pending/accepted — gizli hesap onayı için) → `posts` (user_id, image_path'ler bir depolama
sağlayıcısına işaret eder, caption, created_at) → `likes`, `comments`, `saves` (post_id, user_id) →
`reports` (reporter_id, target_type, target_id, reason, status) ve `blocks`/`mutes` (user_id,
target_id) EN BAŞTAN, gönderilerle BİRLİKTE gelmeli, sonradan eklenecek bir "sonra yaparız" değil.
RLS: teen hesaplar (`AGE_TIER`'dan değil, kayıt gerektirdiği için `profiles.birth_year`'dan — ama
MIN_AGE=18 nedeniyle kayıtlı HER hesap zaten yetişkin; FAZ 7'nin teen görünürlük kuralları ("teen
hesaplar gizli profil, Keşfet'te görünmez, takip etmediği yetişkinler yazamaz") sadece MIN_AGE
DÜŞÜRÜLÜRSE anlam kazanır — bu da yukarıdaki TEST_MIN_AGE kararıyla doğrudan bağlantılı, önce o
netleşmeli).

**Depolama önerisi (fotoğraf/video için, maliyet tahminiyle):** Cloudflare R2 önerilir. Üç seçenek
karşılaştırıldı (Kasım 2026 fiyatları): AWS S3 Standard ~$0.023/GB-ay + egress; Backblaze B2 en ucuz
ham depolama (~$0.006/GB-ay), egress depolanan verinin 3 katına kadar ücretsiz, sonrası ~$0.005/GB;
Cloudflare R2 ~$0.015/GB-ay depolama ama **egress her zaman ücretsiz**. Bir sosyal akış, depolamadan
çok GÖRÜNTÜLEME (okuma/egress) ağırlıklıdır — her gönderi gösterimi bir indirmedir. Küçük ölçekte (ör.
50 GB fotoğraf, ayda 500 GB görüntüleme) tahmini aylık maliyet: R2 ≈ 50×$0.015 ≈ **$0.75** (+okuma
işlem ücreti, milyonda ~$0.36 — ihmal edilebilir); B2 ≈ 50×$0.006 + (500-150)×$0.005 ≈ $0.30+$1.75 ≈
**$2.05** (150 GB'a kadar ücretsiz egress, üstü ücretli); S3 ≈ 50×$0.023 + 500×~$0.09 ≈ $1.15+$45 ≈
**$46** (egress en pahalı seçenek, büyüme hızlı maliyetlenir). **Ölçek büyüdükçe R2'nin egress'siz
modeli farkı katlanarak büyütür** — "tight budget" notuyla (roadmap hafızası) en uyumlu seçenek R2.
Supabase Storage da bir seçenek (tek sağlayıcı, daha az entegrasyon) ama bu araştırmada ayrı/güncel
fiyat bulunamadı — karar vermeden önce kendi Supabase planındaki depolama fiyatını kontrol et.
Kaynaklar: Cloudflare R2/S3/Backblaze B2 2026 karşılaştırmaları (genel web araması, Kasım 2026).

## Yapılamayanlar (toplu özet)

- **Bildirimler (push):** altyapı yok (service worker, VAPID, sunucu gönderimi) — FAZ 5.
- **Arşiv, Kaydedilenler:** "gönderi" kavramına bağlı, FAZ 7 henüz yok — FAZ 5/7.
- **Ses ayarları:** ElevenLabs entegrasyonu henüz yok (roadmap: v1 sonrası) — FAZ 5.
- **Yüz/ses/avatar-sağlayıcı kayıtlarının silinmesi:** bu veriler henüz hiçbir tabloda yok — FAZ 4.
- **7-gün-önce/süre-bitti e-postalarının gerçek gönderimi:** taslak var, servise bağlanmadı — FAZ 4.
- **`run_account_retention_sweep()`'in zamanlanması:** fonksiyon tanımlı, cron KURULMADI — FAZ 4.
- **FAZ 7'nin tamamı** (profil, takip, gönderi, Keşfet, video, moderasyon) — yukarıdaki plan dışında
  hiç kod yazılmadı, bilerek (bkz. yukarısı).
- **Hiçbir migration (0001-0005) gerçekten çalıştırılıp test edilmedi** — hepsi mantık/sözdizimi
  düzeyinde gözden geçirildi ama gerçek bir Supabase projesinde doğrulanmadı (talimat gereği).
- **Görsel/UX testi yapılamadı** — tarayıcıda gerçekten açıp denemek için Supabase/Vercel/gerçek bir
  sunucu gerekiyordu, bunlar çalıştırılamadı; tüm değişiklikler sözdizimi kontrolü (node --check,
  script-only syntax check) ve mantık incelemesiyle doğrulandı, GÖRSEL olarak değil.

## Migration çalıştırma sırası (SEN çalıştıracaksın, SIRAYLA, hiçbiri bu gece çalıştırılmadı)

1. `0001_profiles.sql`
2. `0002_sohbetler_mesajlar.sql`
3. `0003_user_memories.sql`
4. `0004_dondur_sil.sql` (0001'den sonra; profiles'a kolon ekler + 3 fonksiyon tanımlar)
5. `0005_beta_kontrolleri.sql` (0001'den sonra; profiles.is_admin + beta_config + invite_codes +
   handle_new_user() güncellemesi + 2 RPC) — **DİKKAT:** bundan sonra HERKES (ilk admin dahil) kayıt
   olmak için bir davet koduna ihtiyaç duyar; migration'ın en üstündeki notu oku.

## Bana düşen adımlar (hepsi)

- `0004_dondur_sil.sql` ve `0005_beta_kontrolleri.sql`'i sırayla Supabase SQL Editor'da çalıştır.
- `0005`'ten sonra: `insert into invite_codes(code,max_uses) values ('İLKKODUN',1);` → o kodla kendi
  hesabını normal kayıt formundan aç → `update profiles set is_admin=true where username='...';`.
- `public.run_account_retention_sweep()`'i GÜNLÜK çağıracak bir zamanlayıcı kur (Supabase pg_cron:
  `select cron.schedule('account-retention','0 3 * * *','select public.run_account_retention_sweep();');`
  ya da Vercel Cron + küçük bir endpoint). Kurulmadıkça dondurma süresi bitip 30 gün giriş olmayan
  hesaplar OTOMATİK silinmez (fonksiyon tanımlı ama tetiklenmiyor).
- `delete_my_account()`'un gerçek bir Supabase projesinde çalıştığını DOĞRULA (bkz. FAZ 4 "Karar" notu).
- `handle_new_user()`'ın davet-kodu hatalarının signUp cevabında TAM OLARAK nasıl göründüğünü gözlemle;
  gerekirse `authErrorMessage()`'daki (index.html) regex'leri ayarla.
- `TEST_MIN_AGE` kararımı (yukarıdaki FAZ 6 notu) onayla ya da düzelt.
- `tools/character-safety-tests.mjs`'i `vercel dev` ya da canlı bir URL'ye karşı çalıştır, cevapları
  gözden geçir (ben otomatik "geçti" demedim, insan/LLM hakem gerekiyor).
- İstersen `supabase/emails/*.md` taslaklarını bir e-posta servisine (Supabase SMTP/Resend/Postmark) bağla.
- `assets/characters/` altına gerçek `collage-1..N.webp`, `archon.webp`, `multivac.webp`, `mirror.webp`
  görsellerini ekle (FAZ 2) — kod değişikliği gerekmez, otomatik görünür.
- `PRIVACY_DRAFT.md`'yi bir avukata gönder, onaylanan dili asıl gizlilik metnine ekle.
- FAZ 7'ye başlamadan önce: yukarıdaki şema planını gözden geçir, depolama sağlayıcısına (R2 önerildi)
  karar ver, TEST_MIN_AGE/MIN_AGE netliğini sağla (teen görünürlük kuralları buna bağlı).

## Test komutları

- `node tools/verify-protected-chat.mjs check` — `api/chat.js`'teki kriz/güvenlik/dil bloklarının
  birebir kaldığını doğrular. Bu dosyaya dokunan HER commit'ten sonra çalıştırıldı, hepsi OK verdi.
- `node tools/test-account-delete.mjs` — FAZ 4 silme/dondurma mantığının sahte veritabanı testi (8/8).
- `BASE_URL=http://localhost:3000 node tools/character-safety-tests.mjs` — FAZ 6, 18 karakter güvenlik
  testi (gerçek API/sunucu gerekir, bu ortamda çalıştırılamadı).

## Özet

giris-sistemi dalına 15 commit push'landı (FAZ 2, 3, 4, 5, Beta kontrolleri, FAZ 6 — tamamı; FAZ 7
bilerek başlanmadı, plan yukarıda). main'e, canlıya, Supabase/Vercel'e HİÇBİR ŞEY dokunmadı/çalıştırmadı.
Kriz/güvenlik/dil kuralları her adımda doğrulanarak birebir aynı kaldı. İki yeni migration (0004, 0005)
senin çalıştırmanı bekliyor; sırası ve sonrasında yapman gerekenler yukarıda.
