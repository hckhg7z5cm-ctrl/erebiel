# PRIVACY_DRAFT.md — taslak, siteye KOYULMADI

**UZMAN ONAYI GEREK.** Bu, sitede zaten canlı olan gizlilik metninin (i18n.js, 16 dil,
"bilgi penceresi → gizlilik") YERİNE geçmez ve onu DEĞİŞTİRMEZ — bu dosya, Beta
kontrolleri (davet kodu, kullanıcı tavanı, günlük mesaj limiti, /admin sayısal panel)
için gereken EK maddelerin taslağıdır. Bir avukat (KVKK + hedeflenen uluslararası
pazarlar için) onaylamadan hiçbir yere eklenmemeli. [[erebiel-privacy-controller]]
hafıza notundaki gibi, veri sorumlusu ("Zihha Shah") ve iletişim bilgisi burada da
GEÇİCİDİR — gerçek şirket kurulana kadar değiştirilmemeli.

---

## Eklenmesi düşünülen maddeler (taslak, TR)

### Beta ve davet sistemi
EREBIEL şu an kapalı beta aşamasındadır. Hesap oluşturmak için bir davet kodu
gereklidir. Toplam kullanıcı sayısı ve kullanıcı başına günlük mesaj sayısı, sunucu
maliyetini kontrol etmek amacıyla sınırlandırılmıştır. Bu sınırlar beta ilerledikçe
değişebilir.

### Yönetici (admin) paneli
Sitenin `/admin` adresinde, yalnızca yetkili yöneticilerin erişebildiği bir panel
bulunur. Bu panel hiçbir mesajın İÇERİĞİNİ göstermez; yalnızca toplam kayıt sayısı,
günlük aktif kullanıcı sayısı, kullanıcıların uygulamaya geri dönüş oranı (kayıttan
1 ve 7 gün sonra) ve kullanıcı başına ortalama mesaj sayısı gibi TOPLU, kimliksiz
istatistikleri gösterir. Bu istatistikler hiçbir bireysel kullanıcıyı tanımlamaz.

### Hesap dondurma ve silme
Hesabını Ayarlar'dan dondurabilirsin (1 ay, 1 yıl ya da 10 yıl). Dondurulduğu
sürece profilin ve karakterlerin gizlenir, verin saklı kalır; giriş yaptığında tek
dokunuşla yeniden açabilirsin. Dondurma süresi bittikten sonra 30 gün içinde giriş
yapmazsan, hesabın ve tüm verin (sohbetler, hafıza notları, profil) KALICI olarak
silinir. Hesabını istediğin an "Ayarlar > Hesabı yönet" üzerinden şifreni girip
onaylayarak hemen ve kalıcı olarak da silebilirsin; bu durumda sunucudaki tüm
kayıtların silindiğini (kalan kayıt sayısının sıfır olduğunu) sana gösteririz.
Fotoğraflarının ve kolaj panolarının sunucumuza hiç gönderilmediğini (sadece bu
cihazda tutulduğunu) unutma — bunlar hesabını sildiğinde sunucuda zaten yoktur,
tarayıcı verini silerek kendi cihazından kaldırman gerekir.

### Aynı cihazda birden fazla hesap
Aynı cihazda birden fazla EREBIEL hesabı kullanabilirsin ("hesap ekle"). Her
hesabın profili, sohbet önbelleği ve kolajı birbirinden ayrı tutulur; bir hesaptan
çıkıp diğerine geçtiğinde önceki hesabın verisi görünmez.

---

## Draft additions (EN)

### Beta and invites
EREBIEL is currently in closed beta. An invite code is required to create an
account. The total number of users and the number of messages a user can send per
day are limited to control server cost. These limits may change as the beta
progresses.

### Admin panel
At `/admin`, authorized administrators can view a panel that shows no message
content whatsoever — only aggregate, anonymous counters (total sign-ups, daily
active users, 1-day and 7-day return rate, average messages per user). These
statistics never identify an individual user.

### Freezing and deleting your account
You can freeze your account from Settings (1 month, 1 year or 10 years). While
frozen, your profile and characters are hidden and your data is kept; signing in
lets you reopen it with one tap. If you don't sign in within 30 days after the
freeze ends, your account and all your data (chats, memory notes, profile) are
PERMANENTLY deleted. You can also delete your account immediately at any time
from "Settings > Manage account" by confirming your password; we then show you
that every server-side record has been removed (a count of zero). Remember that
your photos and collage boards are never sent to our server — they only live on
this device — so deleting your account doesn't remove them from your device; you
need to clear your browser data for that.

### Multiple accounts on one device
You can use more than one EREBIEL account on the same device ("add account").
Each account's profile, chat cache and collage are kept separate; switching
accounts never shows you another account's data.

---

**Sonraki adım:** bir avukata (KVKK + hedef pazarlar) gönder, onayından sonra
i18n.js'teki asıl gizlilik metnine (ya da ayrı bir "Beta Şartları" bölümüne)
eklenecek dilin SON hâlini belirle.
