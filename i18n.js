// i18n.js — EREBIEL arayüz metinleri (İngilizce / Türkçe).
// Dil seçimi: Ayarlar'da seçilen dil → tarayıcının tercih ettiği dillerden çevirisi olan ilki (tam etiket, sonra ana dil) → İngilizce.
// en ve tr bu dosyada; diğer 14 dil locales/<kod>.js dosyalarından gerektiğinde yüklenir.
// HTML'de: data-i18n="anahtar" (metin), data-i18n-html="anahtar" (bizim yazdığımız biçimli metin),
// data-i18n-attr="aria-label:anahtar;placeholder:anahtar" (öznitelikler). JS'te: i18n.t("anahtar", {n: 3}).
(function () {
  // ===== Gizlilik metnindeki veri sorumlusu ve iletişim — TEK DEĞİŞİKLİK YERİ (16 dilin hepsi buradan okur) =====
  // Geçici: uluslararası şirket kurulduğunda CONTROLLER şirket adıyla, CONTACT_EMAIL gerçek adresle güncellenecek.
  const CONTROLLER = "Zihha Shah";
  const CONTACT_EMAIL = ""; // boşken her dilde "iletişim bilgisi yakında eklenecek" metni ("privacy.contactSoon") gösterilir

  const STRINGS = {
    en: {
      // home
      invite: "choose a presence",
      "aria.home": "Home screen",
      "aria.mirror": "Mirror",
      "aria.characters": "Characters",
      "aria.theme": "Theme",
      "aria.accent": "Accent colour: {c}",
      "aria.info": "Info",
      "aria.back": "Back",
      "aria.close": "Close",
      "aria.sound": "Sound",
      "aria.send": "Send",
      "aria.menu": "Menu",
      "aria.more": "More",
      "aria.syncInput": "Enter sync code",
      // navigation
      "nav.home": "Home",
      "nav.premium": "Premium",
      "nav.create": "Create Character",
      "nav.chat": "Chat",
      "nav.mix": "Mix",
      "nav.settings": "Settings",
      "nav.signin": "Sign In",
      "nav.signout": "Sign Out",
      "nav.profile": "Profile",
      "profile.cover": "Change cover photo",
      "profile.photo": "Change profile photo",
      "profile.followers": "followers",
      "profile.following": "following",
      "profile.vision": "Vision",
      "profile.uploadPhoto": "Upload photo",
      "profile.background": "background",
      "profile.bgPhoto": "choose photo",
      "profile.color": "Colour",
      "profile.visionPlaceholder": "Write what you're moving toward…",
      "profile.saved": "saved",
      "profile.tooLarge": "Couldn't save this image — try a smaller one.",
      "profile.localNote": "Your profile is stored only on this device.",
      "history.title": "chats",
      "history.empty": "No conversations yet.",
      "history.new": "new chat",
      "history.messages": "{n} messages",
      "premium.subtitle": "Choose how deep you want to go.",
      "premium.free": "Free",
      "premium.perMonth": "/month",
      "premium.recommended": "Recommended",
      "premium.current": "current plan",
      "premium.f.free1": "5 minutes of chat per day",
      "premium.f.member1": "Unlimited chat",
      "premium.f.member2": "Basic voice",
      "premium.f.eclipse0": "Everything in Member",
      "premium.f.eclipse2": "Advanced voice",
      "premium.f.eclipse3": "Priority access",
      "premium.f.horizon0": "Everything in Eclipse",
      "premium.f.horizon1": "Character creation",
      "premium.f.horizon2": "Game studio",
      "premium.f.horizon3": "All features",
      // placeholder pages
      "page.premium": "premium",
      "page.create": "create character",
      "page.mix": "mix",
      "page.signin": "sign in",
      "page.characters": "characters",
      soon: "coming soon",
      // settings
      "settings.title": "settings",
      "settings.language": "language",
      "settings.theme": "theme",
      "settings.dark": "dark",
      "settings.light": "light",
      "settings.accent": "accent",
      gold: "gold",
      silver: "silver",
      "settings.syncCode": "sync code",
      "settings.copy": "copy",
      "settings.load": "load",
      "settings.history": "history",
      "settings.delete": "delete my history",
      "settings.deleteConfirm": "are you sure? tap again",
      "settings.noCode": "— (created with your first chat)",
      "settings.hint": "Your Archon and Multivac chats are stored on our server under this code and deleted 90 days after you last use them. Enter the code on another device to open your chats there. Never share it.",
      "note.noCode": "no code yet — it is created with your first chat",
      "note.copied": "code copied",
      "note.copyFailed": "couldn't copy — select the code and copy it",
      "note.invalid": "invalid code — it must be 20 characters",
      "note.loading": "loading…",
      "note.loaded": "history loaded · {name}",
      "note.empty": "code saved · no chats for this code",
      "note.tooMany": "too many attempts — wait a moment",
      "note.loadFailed": "couldn't load right now, try again later",
      "note.deleteFailed": "couldn't delete the history on the server, try again later",
      "note.deleted": "history deleted",
      // resume card
      "resume.eyebrow": "Pick up where you left off",
      "resume.continue": "Continue",
      "ago.now": "just now",
      "ago.min": "{n} min ago",
      "ago.hour1": "1 hour ago",
      "ago.hours": "{n} hours ago",
      "ago.yesterday": "yesterday",
      "ago.days": "{n} days ago",
      // chat
      "greet.archon": "Hello, welcome to Archon. How can I help you?",
      "greet.multivac": "Hello, welcome to Multivac. How can I help you?",
      "greet.mirror": "Hello, welcome to the Mirror.",
      "err.rate.archon": "Slow down. Wait a moment, then we'll continue.",
      "err.rate.multivac": "Let's take a breath. Write again in a moment — I'm here.",
      "err.net.archon": "The connection broke. The dark doesn't always speak. Try again.",
      "err.net.multivac": "I couldn't connect just now. Wait a moment, then try again.",
      "mirror.dark": "The mirror is dark — camera access may be blocked. Your reflection appears on a secure (https) site.",
      "mirror.fallback": [
        "I tell everyone I'm fine. I'm not.",
        "I don't believe the story I tell myself anymore.",
        "I keep saying I'll change. But I never start.",
        "I'm not tired. I'm afraid to put down what I'm carrying.",
        "What I fear most is that no one really sees me.",
        "I can run from them. I can't run from myself.",
      ],
      // info overlay
      "safety.line1": "This is a reflective experience. It does not replace professional support. If you're struggling, reach out to a professional or someone you trust.",
      "safety.line2": "Your Archon and Multivac chats are kept for 90 days under a code that is yours alone; you can delete them in Settings. The Mirror leaves no trace.",
      "safety.privacy": "privacy",
      "safety.hidePrivacy": "hide privacy",
      "safety.close": "close",
      // the English notice is the original, so it carries no translation note
      "privacy.note": "",
      "privacy.contactSoon": "contact details will be added soon",
      "privacy.html": `
        <h3>Privacy and personal data</h3>
        <p>This notice explains which data is processed when you use EREBIEL (erebiel.vercel.app), where it is kept and for how long. Data controller: <b>{controller}</b> · Contact: <b>{contact}</b></p>
        <h3>No account</h3>
        <p>EREBIEL has no sign-up; we don't ask for your name, email or phone number. The only thing that identifies you is the random <b>sync code</b> your browser creates for you.</p>
        <h3>Your chats</h3>
        <ul>
          <li>Messages you write to Archon, Multivac and the Mirror are sent to our AI provider <b>Anthropic</b> (Claude, USA) so a reply can be generated. Anthropic processes this data under its own privacy policy.</li>
          <li>The latest state of your <b>Archon and Multivac</b> chats (at most the last 40 messages per character) is stored on our server (Redis Cloud), linked to your sync code. The code itself is not stored; only an irreversible digest of it is used as the key.</li>
          <li>These records are deleted automatically <b>90 days after your last use</b>. You can delete them at any time under Settings → "delete my history".</li>
          <li><b>Mirror</b> chats are not stored on the server.</li>
          <li>Chats are used only to reply to you, to let you continue where you left off and to open them on another device with your code. They are not sold and not used for advertising.</li>
        </ul>
        <h3>Sensitive content</h3>
        <p>In your conversations you may talk about your feelings, your health or your private life. Sharing this is your choice; if you do, it is processed and stored as described above. We recommend not writing anything you don't want to share, and deleting your history if you did.</p>
        <h3>Camera and sound</h3>
        <ul>
          <li>The Mirror uses your camera only to show your image on screen. The image is <b>not recorded and not sent anywhere</b>; the camera stops when the Mirror closes.</li>
          <li>Read-aloud uses your browser's built-in speech and is off by default. Some browsers may send the text to their own servers to speak it.</li>
        </ul>
        <h3>Technical data</h3>
        <ul>
          <li><b>IP address:</b> To prevent abuse, messages are counted per IP address. These counters are kept for about 25 hours at most and used for nothing else.</li>
          <li><b>Hosting:</b> The site is hosted on Vercel; Vercel keeps technical request logs (IP, time, requested page) under its own policy.</li>
          <li><b>Font:</b> The heading font is loaded from Google Fonts; Google sees your IP address while doing so.</li>
          <li>No cookies, advertising or analytics/tracking tools are used.</li>
        </ul>
        <h3>Stored on your device</h3>
        <p>Your browser's local storage keeps: your theme, accent and language preferences, the time of your last visit, your conversations with Archon and Multivac (up to the 40 most recent), your profile — profile photo, background colour or photo, and Vision text — and your sync code. Your profile is never sent to our server. Clearing your browser data removes all of this.</p>
        <h3>Sync code</h3>
        <p>The code works like a password: anyone who knows it can open those chats. Don't share it. If you lose the code and also clear your browser data, your chats on the server can no longer be reached; they are deleted automatically after 90 days.</p>
        <h3>Transfers abroad</h3>
        <p>The servers of Anthropic, Vercel and Redis Cloud may be located outside Türkiye. By using the service you give explicit consent to your messages being transferred to these providers.</p>
        <h3>Your rights</h3>
        <p>Under Article 11 of the Turkish Personal Data Protection Law No. 6698 (KVKK) you have the right to learn whether your data is processed, request information, and ask for correction, deletion or object. You can delete your chat history yourself in Settings; for other requests contact us (contact: <b>{contact}</b>). We may ask for your sync code with your request, since we have no other way to identify you.</p>
        <h3>Age</h3>
        <p>EREBIEL is not designed for people under 18.</p>
        <h3>Not a support service</h3>
        <p>EREBIEL is a reflective experience; it does not replace professional psychological support, diagnosis or treatment. In a crisis, contact your local emergency number, a professional or someone you trust.</p>
        <p class="muted">Last updated: 5 October 2026. If this notice changes, it is updated in this window.</p>`,
    },

    tr: {
      invite: "bir varlık seç",
      "aria.home": "Ana ekran",
      "aria.mirror": "Ayna",
      "aria.characters": "Karakterler",
      "aria.theme": "Tema",
      "aria.accent": "Vurgu rengi: {c}",
      "aria.info": "Bilgi",
      "aria.back": "Geri",
      "aria.close": "Kapat",
      "aria.sound": "Ses",
      "aria.send": "Gönder",
      "aria.menu": "Menü",
      "aria.more": "Daha fazla",
      "aria.syncInput": "Senkron kodu gir",
      "nav.home": "Ana Sayfa",
      "nav.premium": "Premium",
      "nav.create": "Karakter Oluştur",
      "nav.chat": "Sohbet",
      "nav.mix": "Mix",
      "nav.settings": "Ayarlar",
      "nav.signin": "Giriş Yap",
      "nav.signout": "Çıkış Yap",
      "nav.profile": "Profil",
      "profile.cover": "Kapak fotoğrafını değiştir",
      "profile.photo": "Profil fotoğrafını değiştir",
      "profile.followers": "takipçi",
      "profile.following": "takip edilen",
      "profile.vision": "Vision",
      "profile.uploadPhoto": "Fotoğraf yükle",
      "profile.background": "arka plan",
      "profile.bgPhoto": "fotoğraf seç",
      "profile.color": "Renk",
      "profile.visionPlaceholder": "Neye doğru ilerlediğini yaz…",
      "profile.saved": "kaydedildi",
      "profile.tooLarge": "Bu görsel kaydedilemedi — daha küçük bir görsel dene.",
      "profile.localNote": "Profilin yalnızca bu cihazda saklanır.",
      "history.title": "sohbetler",
      "history.empty": "Henüz sohbet yok.",
      "history.new": "yeni sohbet",
      "history.messages": "{n} mesaj",
      "premium.subtitle": "Ne kadar derine inmek istediğini seç.",
      "premium.free": "Ücretsiz",
      "premium.perMonth": "/ay",
      "premium.recommended": "Önerilen",
      "premium.current": "mevcut plan",
      "premium.f.free1": "Günde 5 dakika sohbet",
      "premium.f.member1": "Sınırsız sohbet",
      "premium.f.member2": "Temel ses",
      "premium.f.eclipse0": "Member'daki her şey",
      "premium.f.eclipse2": "Gelişmiş ses",
      "premium.f.eclipse3": "Öncelikli erişim",
      "premium.f.horizon0": "Eclipse'teki her şey",
      "premium.f.horizon1": "Karakter yaratma",
      "premium.f.horizon2": "Oyun stüdyosu",
      "premium.f.horizon3": "Tüm özellikler",
      "page.premium": "premium",
      "page.create": "karakter oluştur",
      "page.mix": "mix",
      "page.signin": "giriş yap",
      "page.characters": "karakterler",
      soon: "yakında",
      "settings.title": "ayarlar",
      "settings.language": "dil",
      "settings.theme": "tema",
      "settings.dark": "karanlık",
      "settings.light": "aydınlık",
      "settings.accent": "vurgu",
      gold: "altın",
      silver: "gümüş",
      "settings.syncCode": "senkron kodu",
      "settings.copy": "kopyala",
      "settings.load": "yükle",
      "settings.history": "geçmiş",
      "settings.delete": "geçmişimi sil",
      "settings.deleteConfirm": "emin misin? tekrar bas",
      "settings.noCode": "— (ilk sohbette oluşur)",
      "settings.hint": "Archon ve Multivac sohbetlerin bu kodla sunucuda saklanır, son kullanımdan 90 gün sonra silinir. Kodu başka bir cihazda girersen sohbetlerin orada da açılır. Kodu kimseyle paylaşma.",
      "note.noCode": "henüz kod yok — ilk sohbette oluşur",
      "note.copied": "kod kopyalandı",
      "note.copyFailed": "kopyalanamadı — kodu seçip kopyala",
      "note.invalid": "kod geçersiz — 20 karakter olmalı",
      "note.loading": "yükleniyor…",
      "note.loaded": "geçmiş yüklendi · {name}",
      "note.empty": "kod kaydedildi · bu kodla sohbet yok",
      "note.tooMany": "çok fazla deneme — biraz bekle",
      "note.loadFailed": "şu an yüklenemedi, sonra tekrar dene",
      "note.deleteFailed": "sunucudaki geçmiş silinemedi, sonra tekrar dene",
      "note.deleted": "geçmiş silindi",
      "resume.eyebrow": "Kaldığın yerden",
      "resume.continue": "Devam et",
      "ago.now": "az önce",
      "ago.min": "{n} dakika önce",
      "ago.hour1": "1 saat önce",
      "ago.hours": "{n} saat önce",
      "ago.yesterday": "dün",
      "ago.days": "{n} gün önce",
      "greet.archon": "Merhaba, Archon'a hoş geldin. Sana nasıl yardımcı olabilirim?",
      "greet.multivac": "Merhaba, Multivac'a hoş geldin. Sana nasıl yardımcı olabilirim?",
      "greet.mirror": "Merhaba, Ayna'ya hoş geldin.",
      "err.rate.archon": "Yavaşla. Biraz bekle, sonra devam ederiz.",
      "err.rate.multivac": "Biraz soluklanalım. Birazdan tekrar yaz, buradayım.",
      "err.net.archon": "Bağlantı koptu. Karanlık her zaman konuşmaz. Tekrar dene.",
      "err.net.multivac": "Şu an bağlantı kurulamadı. Bir an bekle, sonra tekrar dene.",
      "mirror.dark": "Ayna karanlıkta — kamera erişimi engellenmiş olabilir. Güvenli (https) bir sitede yansıman belirir.",
      "mirror.fallback": [
        "Herkese iyi olduğumu söylüyorum. Değilim.",
        "Kendime anlattığım hikâyeye artık ben de inanmıyorum.",
        "Değişeceğimi söyleyip duruyorum. Ama başlamıyorum.",
        "Yorgun değilim. Taşıdığım şeyi bırakmaktan korkuyorum.",
        "En çok, kimsenin beni gerçekten görmemesinden korkuyorum.",
        "Ondan kaçabilirim. Kendimden kaçamam.",
      ],
      "safety.line1": "Bu bir yansıma deneyimi. Profesyonel destek yerine geçmez. Zorlanıyorsan bir uzmana ya da güvendiğin birine ulaş.",
      "safety.line2": "Archon ve Multivac sohbetlerin sana özel bir kodla 90 gün saklanır; Ayarlar'dan silebilirsin. Ayna iz bırakmaz.",
      "safety.privacy": "gizlilik",
      "safety.hidePrivacy": "gizliliği gizle",
      "safety.close": "kapat",
      "privacy.contactSoon": "iletişim bilgisi yakında eklenecektir",
      "privacy.note": "Bu metin bilgilendirme amacıyla çevrilmiştir; hukuki bir anlaşmazlık durumunda İngilizce orijinal metin esas alınır.",
      "privacy.html": `
        <h3>Gizlilik ve kişisel veriler</h3>
        <p>Bu metin, EREBIEL'i (erebiel.vercel.app) kullanırken hangi verilerin işlendiğini, nerede ve ne kadar süre tutulduğunu anlatır. Veri sorumlusu: <b>{controller}</b> · İletişim: <b>{contact}</b></p>
        <h3>Hesap yok</h3>
        <p>EREBIEL'de üyelik yoktur; adın, e-postan ya da telefonun istenmez. Seni tanımlayan tek şey, tarayıcının senin için ürettiği rastgele <b>senkron kodudur</b>.</p>
        <h3>Sohbetlerin</h3>
        <ul>
          <li>Archon, Multivac ve Ayna'ya yazdığın mesajlar, cevap üretilmesi için yapay zekâ sağlayıcımız <b>Anthropic</b>'e (Claude, ABD) gönderilir. Anthropic bu verileri kendi gizlilik politikasına göre işler.</li>
          <li><b>Archon ve Multivac</b> sohbetlerinin son hâli (karakter başına en fazla son 40 mesaj), senkron kodunla eşleştirilerek sunucumuzda (Redis Cloud) saklanır. Kodun kendisi saklanmaz; yalnızca geri çevrilemez bir özeti anahtar olarak kullanılır.</li>
          <li>Bu kayıtlar <b>son kullanımdan 90 gün sonra</b> kendiliğinden silinir. Ayarlar → "geçmişimi sil" ile istediğin an silebilirsin.</li>
          <li><b>Ayna</b> sohbetleri sunucuda saklanmaz.</li>
          <li>Sohbetler; sana cevap vermek, kaldığın yerden devam etmeni ve kodunla başka bir cihazda açmanı sağlamak dışında bir amaçla kullanılmaz, satılmaz, reklam için işlenmez.</li>
        </ul>
        <h3>Hassas içerik</h3>
        <p>Konuşmalarında duygularından, sağlığından ya da özel hayatından söz edebilirsin. Bu bilgileri paylaşmak senin tercihin; paylaşırsan yukarıdaki şekilde işlenir ve saklanır. Paylaşmak istemediğin bir şeyi yazmamanı, yazdıysan geçmişini silmeni öneririz.</p>
        <h3>Kamera ve ses</h3>
        <ul>
          <li>Ayna kamerayı yalnızca görüntünü ekranda göstermek için kullanır. Görüntü <b>kaydedilmez ve hiçbir yere gönderilmez</b>; Ayna kapanınca kamera durur.</li>
          <li>Sesli okuma tarayıcının kendi özelliğiyle yapılır ve varsayılan olarak kapalıdır. Bazı tarayıcılar bu seslendirme için metni kendi sunucularına gönderebilir.</li>
        </ul>
        <h3>Teknik veriler</h3>
        <ul>
          <li><b>IP adresi:</b> Kötüye kullanımı önlemek için mesaj sayısı IP adresine göre sayılır. Bu sayaçlar en fazla yaklaşık 25 saat tutulur ve başka amaçla kullanılmaz.</li>
          <li><b>Barındırma:</b> Site Vercel'de barındırılır; Vercel isteklerin teknik kayıtlarını (IP, zaman, istenen sayfa) kendi politikasına göre tutar.</li>
          <li><b>Yazı tipi:</b> Başlık yazı tipi Google Fonts'tan yüklenir; bu sırada Google IP adresini görür.</li>
          <li>Çerez, reklam ya da analiz/izleme aracı kullanılmaz.</li>
        </ul>
        <h3>Cihazında tutulanlar</h3>
        <p>Tarayıcının yerel belleğinde şunlar durur: tema, vurgu rengi ve dil tercihin, son ziyaret zamanın, Archon ve Multivac ile sohbetlerin (en son 40 sohbet), profilin — profil fotoğrafı, arka plan rengi ya da fotoğrafı ve Vision metni — ve senkron kodun. Profilin sunucumuza hiç gönderilmez. Tarayıcı verilerini silersen bunların hepsi silinir.</p>
        <h3>Senkron kodu</h3>
        <p>Kod bir şifre gibidir: bilen herkes o sohbetleri açabilir. Kimseyle paylaşma. Kodu kaybeder ve tarayıcı verilerini de silersen, sunucudaki sohbetlerine bir daha ulaşılamaz; 90 gün sonunda kendiliğinden silinirler.</p>
        <h3>Yurt dışına aktarım</h3>
        <p>Anthropic, Vercel ve Redis Cloud'un sunucuları Türkiye dışında bulunabilir. Hizmeti kullanarak mesajlarının bu sağlayıcılara aktarılmasına açık rıza vermiş olursun.</p>
        <h3>Hakların</h3>
        <p>6698 sayılı KVKK'nın 11. maddesi kapsamında verilerinin işlenip işlenmediğini öğrenme, bilgi isteme, düzeltme, silme ve itiraz etme hakların vardır. Sohbet geçmişini Ayarlar'dan kendin silebilirsin; diğer talepler için bize ulaşabilirsin (iletişim: <b>{contact}</b>). Talebinde senkron kodunu paylaşmanı isteyebiliriz, çünkü seni başka türlü tanıyamayız.</p>
        <h3>Yaş</h3>
        <p>EREBIEL 18 yaşından küçükler için tasarlanmamıştır.</p>
        <h3>Destek değildir</h3>
        <p>EREBIEL bir yansıma deneyimidir; profesyonel psikolojik destek, tanı ya da tedavi yerine geçmez. Kriz anında bir uzmana ya da güvendiğin birine ulaş.</p>
        <p class="muted">Son güncelleme: 5 Ekim 2026. Bu metin değişirse bu pencerede güncellenir.</p>`,
    },
  };

  const KEY = "erebiel-lang";
  // Every language the interface speaks, in picker order, with its name in its own language.
  // English and Turkish live in this file; the rest load on demand from locales/<code>.js,
  // which call i18n.register(code, strings). Add a language: one entry here + one locale file.
  const LANGUAGES = [
    ["en", "English"], ["tr", "Türkçe"], ["es", "Español"], ["fr", "Français"], ["de", "Deutsch"],
    ["pt", "Português"], ["it", "Italiano"], ["nl", "Nederlands"], ["pl", "Polski"], ["ru", "Русский"],
    ["ar", "العربية"], ["hi", "हिन्दी"], ["id", "Bahasa Indonesia"], ["zh-CN", "简体中文"], ["ja", "日本語"], ["ko", "한국어"],
  ];
  const SUPPORTED = LANGUAGES.map((l) => l[0]);
  const NAMES = Object.fromEntries(LANGUAGES);
  const RTL = ["ar"];

  // Closest available translation for a BCP 47 tag: exact tag ("zh-CN"), then its base language ("pt-BR" → "pt", "zh-SG" → "zh-CN").
  function match(tag) {
    if (typeof tag !== "string" || !tag) return null;
    const lower = tag.toLowerCase();
    const exact = SUPPORTED.find((l) => l.toLowerCase() === lower);
    if (exact) return exact;
    const base = lower.split("-")[0];
    return SUPPORTED.find((l) => l.toLowerCase() === base || l.toLowerCase().split("-")[0] === base) || null;
  }

  // saved choice → the browser's preferred languages in order → English
  function detect() {
    try {
      const saved = match(localStorage.getItem(KEY));
      if (saved) return saved;
    } catch (e) {}
    const prefs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language]).filter(Boolean);
    for (const tag of prefs) {
      const m = match(tag);
      if (m) return m;
    }
    return "en";
  }

  function setDocumentLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL.includes(lang) ? "rtl" : "ltr";
  }

  // Load locales/<code>.js once. While the page is still being parsed (first paint), write the tag
  // synchronously so the right language is in place before anything renders — no English flash.
  const loading = {};
  function load(lang) {
    if (STRINGS[lang]) return Promise.resolve();
    if (!loading[lang]) {
      const src = "locales/" + lang + ".js";
      if (document.readyState === "loading" && !document.body) {
        document.write('<script src="' + src + '"><\/script>');
        loading[lang] = Promise.resolve();
      } else {
        loading[lang] = new Promise((resolve, reject) => {
          const el = document.createElement("script");
          el.src = src;
          el.onload = resolve;
          el.onerror = () => { delete loading[lang]; reject(new Error("locale " + lang)); };
          document.head.appendChild(el);
        });
      }
    }
    return loading[lang];
  }

  function register(lang, strings) {
    STRINGS[lang] = strings;
    // a locale that arrives after first render (rare) re-applies itself
    if (lang === current && document.body) { apply(); document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } })); }
  }

  let current = detect();
  setDocumentLang(current);
  load(current);

  function t(key, vars) {
    const table = STRINGS[current] || STRINGS.en;
    let v = table[key];
    if (v === undefined) v = STRINGS.en[key];
    if (v === undefined) return key;
    if (typeof v === "string" && /\{(controller|contact)\}/.test(v)) {
      const contact = CONTACT_EMAIL || t("privacy.contactSoon");
      v = v.replace(/\{controller\}/g, escapeHtml(CONTROLLER)).replace(/\{contact\}/g, escapeHtml(contact));
    }
    if (typeof v === "string" && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return v;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  }

  function apply(root) {
    root = root || document;
    root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    root.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr").split(";").forEach((pair) => {
        const [attr, key] = pair.split(":").map((s) => s.trim());
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  async function setLang(lang) {
    if (!SUPPORTED.includes(lang) || lang === current) return;
    try { await load(lang); } catch (e) { return; } // offline / missing file: stay on the current language
    current = lang;
    setDocumentLang(lang);
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang } }));
  }

  function nativeName(code) { return NAMES[code] || code; }

  window.i18n = { t, apply, setLang, register, lang: () => current, supported: SUPPORTED, match, nativeName };
})();
