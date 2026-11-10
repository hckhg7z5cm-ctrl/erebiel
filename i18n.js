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
      "add.title": "Add",
      "add.photo": "Photo",
      "add.photoSub": "From your gallery, in any shape",
      "add.sticker": "Stickers",
      "add.stickerSub": "6 sets · 48 stickers",
      "add.music": "Music card",
      "add.musicSub": "Vinyl, cassette or now playing",
      "add.book": "Book card",
      "add.bookSub": "Cover, spine or open book",
      "stickers.sky": "Sky",
      "stickers.flora": "Flora",
      "stickers.love": "Love",
      "stickers.vintage": "Vintage",
      "stickers.words": "Words",
      "stickers.erebiel": "Erebiel",
      "stickers.added": "{n} added",
      "card.songTitle": "Song title",
      "card.artist": "Artist",
      "card.bookTitle": "Book title",
      "card.author": "Author",
      "card.cover": "Add cover photo",
      "card.coverChange": "Change cover photo",
      "card.coverRemove": "Remove cover",
      "card.add": "Add to page",
      "card.edit": "Edit card",
      "card.style.vinyl": "Vinyl",
      "card.style.cassette": "Cassette",
      "card.style.player": "Now playing",
      "card.style.cover": "Cover",
      "card.style.spine": "Spine",
      "card.style.open": "Open book",
      "card.color.cream": "Cream",
      "card.color.ink": "Ink",
      "card.color.rose": "Rose",
      "card.color.sage": "Sage",
      "card.color.sky": "Sky",
      "card.color.gold": "Gold",
      "card.color.wine": "Wine",
      "pos.editAvatar": "Position profile photo",
      "pos.editCover": "Position cover",
      "collage.label": "Collage page",
      "collage.edit": "Edit",
      "collage.done": "Done",
      "collage.undo": "Undo",
      "collage.redo": "Redo",
      "collage.empty": "Add your first photo",
      "sheet.title": "Choose a shape",
      "sheet.applyAll": "Apply to all",
      "sheet.count": "Photo {i} of {n}",
      "shape.oval": "Oval",
      "shape.triangle": "Triangle",
      "shape.flower": "Flower",
      "shape.torn": "Torn paper",
      "shape.original": "Original",
      "shape.lasso": "Free cut",
      "item.outline": "White edge",
      "item.outlineWidth": "Edge width",
      "item.duplicate": "Duplicate",
      "item.flip": "Flip",
      "item.confirmDelete": "Delete this photo from your page?",
      "lasso.redraw": "Redraw",
      "lasso.tooSmall": "That area is too small — draw a bigger shape.",
      "pos.coverTitle": "Position cover",
      "pos.avatarTitle": "Position photo",
      "pos.hint": "Drag to position · pinch, scroll or use the slider to zoom",
      "pos.zoom": "Zoom",
      "pos.save": "Save",
      "pos.cancel": "Cancel",
      "pos.edit": "reposition",
      "profile.coverPhoto": "Cover photo",
      "profile.avatarAlt": "Profile photo",
      "photos.grid": "Grid",
      "photos.collage": "Collage",
      "photos.alt": "Photo from {date}",
      "photos.errFormat": "This file type isn't supported.",
      "photos.errCorrupt": "This image couldn't be opened.",
      "photos.errTooBig": "This photo is over 20 MB — try a smaller version.",
      "photos.errFailed": "Upload failed — please try again.",
      "photos.nearlyFull": "Storage on this device is almost full ({n}%).",
      "photos.adding": "Adding photos… {i}/{n}",
      "photos.confirmDelete": "Delete this photo? It will also be removed from your boards. This can't be undone.",
      "board.new": "New board",
      "board.untitled": "Untitled board",
      "board.titlePlaceholder": "Board title",
      "board.notePlaceholder": "A note for this page…",
      "board.delete": "Delete board",
      "board.confirmDelete": "Delete this board? Your photos stay in your library.",
      "board.empty": "Add photos, then drag, resize and rotate them freely.",
      "board.fromLibrary": "Add from your photos",
      "board.tint": "Tint",
      "board.label": "Collage board",
      "item.label": "Photo on the board",
      "item.shape": "Shape",
      "item.crop": "Crop",
      "item.lasso": "Cut out",
      "item.lock": "Lock ratio",
      "item.front": "Forward",
      "item.back": "Backward",
      "item.note": "Note",
      "item.notePlaceholder": "A note about this photo…",
      "item.remove": "Remove",
      "item.confirmRemove": "Remove from this board?",
      "shape.rect": "Rectangle",
      "shape.square": "Square",
      "shape.rounded": "Rounded square",
      "shape.circle": "Circle",
      "shape.heart": "Heart",
      "shape.star": "Star",
      "shape.blob": "Organic",
      "lasso.hint": "Draw around the part you want to keep with your finger or mouse.",
      "lasso.feather": "Soft edge",
      "lasso.clear": "Clear",
      "profile.namePlaceholder": "Your name",
      "profile.aiOf": "{name}'s AI",
      "profile.aiYours": "your AI",
      "profile.crest": "Your AIs",
      "profile.talkTo": "New chat with {ai}",
      "photos.title": "Photos",
      "photos.add": "Add photo",
      "photos.count": "{n} photos",
      "photos.emptyTitle": "Start your digital journal",
      "photos.emptyText": "Add photos, crop them any way you like and build your own aesthetic — a place you'll want to come back to.",
      "photos.bgAdd": "add a large background",
      "photos.bgChange": "change background",
      "photos.bgRemove": "remove background",
      "photos.captionPlaceholder": "Write a note about this moment…",
      "photos.makeCover": "Use as cover",
      "photos.moveEarlier": "Move earlier",
      "photos.moveLater": "Move later",
      "photos.delete": "Delete",
      "photos.deleted": "Photo deleted",
      "photos.full": "Storage on this device is full — remove some photos to add new ones.",
      "photos.close": "Close",
      "photos.prev": "Previous",
      "photos.next": "Next",
      "photos.coverSet": "Cover updated",
      "history.title": "chats",
      "history.empty": "No conversations yet.",
      "history.new": "new chat",
      "history.messages": "{n} messages",
      "history.rename": "Rename",
      "history.delete": "Delete",
      "history.more": "More options",
      "history.cancel": "Cancel",
      "history.confirmDelete": "Delete this chat? This can't be undone.",
      "editor.title": "EDIT PHOTO",
      "editor.hint": "Drag the frame or its corners to crop freely",
      "editor.original": "Original",
      "editor.bright": "Bright",
      "editor.contrast": "Contrast",
      "editor.bw": "B&W",
      "editor.sepia": "Sepia",
      "editor.reset": "Reset",
      "editor.cancel": "Cancel",
      "editor.apply": "Apply",
      "history.deleted": "Chat deleted",
      "history.deleteAll": "Delete all chats",
      "history.confirmDeleteAll": "Delete your entire chat history? This can't be undone.",
      "history.deletedAll": "All chats deleted",
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
      "auth.title.signin": "Sign in",
      "auth.title.signup": "Create account",
      "auth.title.forgot": "Reset password",
      "auth.title.signedin": "Signed in",
      "auth.email": "Email",
      "auth.password": "Password",
      "auth.username": "Username",
      "auth.birthYear": "Birth year",
      "auth.submit.signin": "Sign in",
      "auth.submit.signup": "Create account",
      "auth.submit.forgot": "Send reset link",
      "auth.switch.toSignup": "No account? Create one",
      "auth.switch.toSignin": "Already have an account? Sign in",
      "auth.switch.toForgot": "Forgot your password?",
      "auth.loading": "Working…",
      "auth.signedInAs": "Signed in as {u}",
      "auth.signOut": "Sign out of this device",
      "auth.signOutAll": "Sign out of all devices",
      "auth.addAccount": "Add account",
      "auth.switchAccount": "Switch to {u}",
      "auth.currentAccount": "Current",
      "auth.switchFailed": "Couldn't switch accounts — sign in again.",
      "settings.manageAccount": "Manage account",
      "acctManage.title": "Manage account",
      "acctManage.freeze.title": "Freeze account",
      "acctManage.freeze.note": "While frozen, your profile and characters are hidden; your data is kept. Sign in any time to reopen with one tap. If you don't sign in within 30 days after the freeze ends, your account and all your data are permanently deleted — this cannot be undone.",
      "acctManage.freeze.1m": "1 month",
      "acctManage.freeze.1y": "1 year",
      "acctManage.freeze.10y": "10 years",
      "acctManage.freeze.active": "Frozen until {date}.",
      "acctManage.freeze.reopenNow": "Reopen now",
      "acctManage.freeze.done": "Account frozen.",
      "acctManage.freeze.reopened": "Account reopened.",
      "acctManage.delete.title": "Delete account",
      "acctManage.delete.note": "This permanently deletes your account on our server: chats, memory notes and profile. Voice, face and avatar-provider records aren't stored yet in this version — once they are, they'll be included here too. This cannot be undone.",
      "acctManage.delete.start": "Delete now",
      "acctManage.delete.willDelete": "This will delete:",
      "acctManage.delete.countsLine": "{sohbetler} chats, {mesajlar} messages, {memories} memory notes, {profiles} profile.",
      "acctManage.delete.confirmWord": "DELETE",
      "acctManage.delete.confirmLabel": "Type DELETE to confirm",
      "acctManage.delete.submit": "Permanently delete",
      "acctManage.delete.cancel": "Cancel",
      "acctManage.delete.success": "Account deleted. Remaining records: {n}.",
      "acctManage.delete.wrongPassword": "Wrong password.",
      "acctManage.delete.wrongConfirm": "Type the word exactly as shown to confirm.",
      "acctManage.delete.error": "Something went wrong. Try again.",
      "freeze.overlay.title": "Your account is frozen",
      "freeze.overlay.body": "Frozen until {date}. Reopen now with one tap, or come back later — nothing is lost while frozen.",
      "freeze.overlay.reopen": "Reopen now",
      "freeze.overlay.dismiss": "Not now",
      "settings.voiceNote": "Voice isn't available yet — coming with the voice feature.",
      "settings.about": "About",
      "settings.privacyCenter": "Privacy center",
      "settings.timeManagement": "Time management",
      "settings.devicePermissions": "Device permissions",
      "settings.accountSettings": "Account",
      "about.title": "About",
      "about.body": "EREBIEL — three presences, one truth. Archon, Multivac and the Mirror.",
      "about.privacy": "Privacy notice",
      "auth.resetSent": "If that email has an account, a reset link is on its way.",
      "auth.confirmSent": "Check your email to confirm your account, then sign in.",
      "auth.err.generic": "Something went wrong. Try again.",
      "auth.err.underage": "You must be at least {age} to create an account.",
      "auth.err.usernameInvalid": "Username: 3–20 characters, lowercase letters, numbers and _ only.",
      "auth.err.usernameTaken": "That username is taken — try another.",
      "auth.err.required": "Fill in every field.",
      "auth.hint": "Your email is used only to sign in and for password reset. Only you can see your own data.",
      "auth.hero.title": "EREBIEL",
      "auth.hero.subtitle": "Three presences, one truth.",
      "auth.card.archon": "Sharp, honest clarity.",
      "auth.card.multivac": "Wise, patient guidance.",
      "auth.card.mirror": "Your own reflection.",
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
      "chat.retry": "Try again",
      "err.maintenance": "Chat is under maintenance right now. We will be back soon.",
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
        <p>Your browser's storage on this device keeps: your theme, accent and language preferences, the time of your last visit, your conversations with Archon and Multivac (up to the 40 most recent), your profile — name, profile photo, background colour or photo, Vision text, and your photos and collage boards with their notes and dates — and your sync code. Your profile and photos are never sent to our server. Clearing your browser data removes all of this.</p>
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
        <p class="muted">Last updated: 7 October 2026. If this notice changes, it is updated in this window.</p>`,
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
      "nav.chat": "Chat",
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
      "add.title": "Ekle",
      "add.photo": "Fotoğraf",
      "add.photoSub": "Galerinden, istediğin şekilde",
      "add.sticker": "Sticker",
      "add.stickerSub": "6 set · 48 sticker",
      "add.music": "Müzik kartı",
      "add.musicSub": "Plak, kaset ya da çalıyor",
      "add.book": "Kitap kartı",
      "add.bookSub": "Kapak, sırt ya da açık kitap",
      "stickers.sky": "Gökyüzü",
      "stickers.flora": "Çiçekler",
      "stickers.love": "Sevgi",
      "stickers.vintage": "Vintage",
      "stickers.words": "Sözler",
      "stickers.erebiel": "Erebiel",
      "stickers.added": "{n} eklendi",
      "card.songTitle": "Şarkı adı",
      "card.artist": "Sanatçı",
      "card.bookTitle": "Kitap adı",
      "card.author": "Yazar",
      "card.cover": "Kapak fotoğrafı ekle",
      "card.coverChange": "Kapak fotoğrafını değiştir",
      "card.coverRemove": "Kapağı kaldır",
      "card.add": "Sayfaya ekle",
      "card.edit": "Kartı düzenle",
      "card.style.vinyl": "Plak",
      "card.style.cassette": "Kaset",
      "card.style.player": "Çalıyor",
      "card.style.cover": "Kapak",
      "card.style.spine": "Sırt",
      "card.style.open": "Açık kitap",
      "card.color.cream": "Krem",
      "card.color.ink": "Mürekkep",
      "card.color.rose": "Gül",
      "card.color.sage": "Adaçayı",
      "card.color.sky": "Gök",
      "card.color.gold": "Altın",
      "card.color.wine": "Şarap",
      "pos.editAvatar": "Profil fotoğrafını konumlandır",
      "pos.editCover": "Kapağı konumlandır",
      "collage.label": "Kolaj sayfası",
      "collage.edit": "Düzenle",
      "collage.done": "Bitti",
      "collage.undo": "Geri al",
      "collage.redo": "Yinele",
      "collage.empty": "İlk fotoğrafını ekle",
      "sheet.title": "Bir şekil seç",
      "sheet.applyAll": "Hepsine uygula",
      "sheet.count": "{n} fotoğraftan {i}.",
      "shape.oval": "Oval",
      "shape.triangle": "Üçgen",
      "shape.flower": "Çiçek",
      "shape.torn": "Yırtık kağıt",
      "shape.original": "Orijinal",
      "shape.lasso": "Serbest kırp",
      "item.outline": "Beyaz kenar",
      "item.outlineWidth": "Kenar kalınlığı",
      "item.duplicate": "Çoğalt",
      "item.flip": "Çevir",
      "item.confirmDelete": "Bu fotoğraf sayfadan silinsin mi?",
      "lasso.redraw": "Yeniden çiz",
      "lasso.tooSmall": "Bu alan çok küçük — daha büyük bir şekil çiz.",
      "pos.coverTitle": "Kapağı konumlandır",
      "pos.avatarTitle": "Fotoğrafı konumlandır",
      "pos.hint": "Sürükleyerek konumlandır · yakınlaştırmak için iki parmakla büyüt, kaydır ya da kaydırıcıyı kullan",
      "pos.zoom": "Yakınlaştır",
      "pos.save": "Kaydet",
      "pos.cancel": "Vazgeç",
      "pos.edit": "konumlandır",
      "profile.coverPhoto": "Kapak fotoğrafı",
      "profile.avatarAlt": "Profil fotoğrafı",
      "photos.grid": "Izgara",
      "photos.collage": "Kolaj",
      "photos.alt": "{date} tarihli fotoğraf",
      "photos.errFormat": "Bu dosya türü desteklenmiyor.",
      "photos.errCorrupt": "Bu görsel açılamadı.",
      "photos.errTooBig": "Bu fotoğraf 20 MB'tan büyük — daha küçük bir sürümünü dene.",
      "photos.errFailed": "Yükleme başarısız oldu, tekrar dene.",
      "photos.nearlyFull": "Bu cihazdaki depolama dolmak üzere (%{n}).",
      "photos.adding": "Fotoğraflar ekleniyor… {i}/{n}",
      "photos.confirmDelete": "Bu fotoğraf silinsin mi? Panolarından da kaldırılır. Geri alınamaz.",
      "board.new": "Yeni pano",
      "board.untitled": "Adsız pano",
      "board.titlePlaceholder": "Pano başlığı",
      "board.notePlaceholder": "Bu sayfaya bir not…",
      "board.delete": "Panoyu sil",
      "board.confirmDelete": "Bu pano silinsin mi? Fotoğrafların silinmez.",
      "board.empty": "Fotoğraf ekle; sürükle, büyüt ve dilediğin gibi döndür.",
      "board.fromLibrary": "Fotoğraflarından ekle",
      "board.tint": "Ton",
      "board.label": "Kolaj panosu",
      "item.label": "Panodaki fotoğraf",
      "item.shape": "Şekil",
      "item.crop": "Kırp",
      "item.lasso": "Serbest kes",
      "item.lock": "Oranı kilitle",
      "item.front": "Öne al",
      "item.back": "Arkaya al",
      "item.note": "Not",
      "item.notePlaceholder": "Bu fotoğrafa bir not…",
      "item.remove": "Kaldır",
      "item.confirmRemove": "Panodan kaldırılsın mı?",
      "shape.rect": "Dikdörtgen",
      "shape.square": "Kare",
      "shape.rounded": "Yuvarlak kare",
      "shape.circle": "Daire",
      "shape.heart": "Kalp",
      "shape.star": "Yıldız",
      "shape.blob": "Organik",
      "lasso.hint": "Parmağınla ya da fareyle saklamak istediğin alanın çevresini çiz.",
      "lasso.feather": "Kenarı yumuşat",
      "lasso.clear": "Temizle",
      "profile.namePlaceholder": "Adın",
      "profile.aiOf": "{name} yapay zekası",
      "profile.aiYours": "yapay zekan",
      "profile.crest": "Yapay zekaların",
      "profile.talkTo": "{ai} ile yeni sohbet",
      "photos.title": "Fotoğraflar",
      "photos.add": "Fotoğraf ekle",
      "photos.count": "{n} fotoğraf",
      "photos.emptyTitle": "Dijital günlüğünü başlat",
      "photos.emptyText": "Fotoğraflarını ekle, dilediğin gibi kırp ve kendi estetiğini yarat — tekrar tekrar bakmak isteyeceğin bir yer.",
      "photos.bgAdd": "büyük arka plan ekle",
      "photos.bgChange": "arka planı değiştir",
      "photos.bgRemove": "arka planı kaldır",
      "photos.captionPlaceholder": "Bu ana bir not yaz…",
      "photos.makeCover": "Kapak yap",
      "photos.moveEarlier": "Öne al",
      "photos.moveLater": "Geriye al",
      "photos.delete": "Sil",
      "photos.deleted": "Fotoğraf silindi",
      "photos.full": "Bu cihazdaki depolama dolu — yenilerini eklemek için birkaç fotoğraf sil.",
      "photos.close": "Kapat",
      "photos.prev": "Önceki",
      "photos.next": "Sonraki",
      "photos.coverSet": "Kapak güncellendi",
      "history.title": "chats",
      "history.empty": "Henüz sohbet yok.",
      "history.new": "yeni sohbet",
      "history.messages": "{n} mesaj",
      "history.rename": "Yeniden adlandır",
      "history.delete": "Sil",
      "history.more": "Diğer seçenekler",
      "history.cancel": "Vazgeç",
      "history.confirmDelete": "Bu sohbet silinsin mi? Geri alınamaz.",
      "editor.title": "FOTOĞRAFI DÜZENLE",
      "editor.hint": "Serbestçe kırpmak için çerçeveyi ya da köşelerini sürükle",
      "editor.original": "Orijinal",
      "editor.bright": "Parlak",
      "editor.contrast": "Kontrast",
      "editor.bw": "S/B",
      "editor.sepia": "Sepya",
      "editor.reset": "Sıfırla",
      "editor.cancel": "Vazgeç",
      "editor.apply": "Uygula",
      "history.deleted": "Sohbet silindi",
      "history.deleteAll": "Tüm sohbetleri sil",
      "history.confirmDeleteAll": "Tüm sohbet geçmişin silinsin mi? Geri alınamaz.",
      "history.deletedAll": "Tüm sohbetler silindi",
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
      "auth.title.signin": "Giriş yap",
      "auth.title.signup": "Hesap oluştur",
      "auth.title.forgot": "Şifreni sıfırla",
      "auth.title.signedin": "Giriş yapıldı",
      "auth.email": "E-posta",
      "auth.password": "Şifre",
      "auth.username": "Kullanıcı adı",
      "auth.birthYear": "Doğum yılı",
      "auth.submit.signin": "Giriş yap",
      "auth.submit.signup": "Hesap oluştur",
      "auth.submit.forgot": "Sıfırlama bağlantısı gönder",
      "auth.switch.toSignup": "Hesabın yok mu? Oluştur",
      "auth.switch.toSignin": "Zaten hesabın var mı? Giriş yap",
      "auth.switch.toForgot": "Şifreni mi unuttun?",
      "auth.loading": "İşleniyor…",
      "auth.signedInAs": "{u} olarak giriş yaptın",
      "auth.signOut": "Bu cihazdan çıkış yap",
      "auth.signOutAll": "Tüm cihazlardan çıkış yap",
      "auth.addAccount": "Hesap ekle",
      "auth.switchAccount": "{u} hesabına geç",
      "auth.currentAccount": "Şu anki",
      "auth.switchFailed": "Hesap değiştirilemedi — tekrar giriş yap.",
      "settings.manageAccount": "Hesabı yönet",
      "acctManage.title": "Hesabı yönet",
      "acctManage.freeze.title": "Hesabı dondur",
      "acctManage.freeze.note": "Donduruldukça profilin ve karakterlerin gizlenir; verin saklı kalır. İstediğin zaman giriş yapıp tek dokunuşla geri açabilirsin. Dondurma süresi bittikten sonra 30 gün içinde giriş yapmazsan hesabın ve tüm verin kalıcı olarak silinir — bu işlem geri alınamaz.",
      "acctManage.freeze.1m": "1 ay",
      "acctManage.freeze.1y": "1 yıl",
      "acctManage.freeze.10y": "10 yıl",
      "acctManage.freeze.active": "{date}'e kadar dondurulmuş.",
      "acctManage.freeze.reopenNow": "Şimdi aç",
      "acctManage.freeze.done": "Hesap donduruldu.",
      "acctManage.freeze.reopened": "Hesap yeniden açıldı.",
      "acctManage.delete.title": "Hesabı sil",
      "acctManage.delete.note": "Bu, sunucudaki hesabını kalıcı olarak siler: sohbetler, hafıza notları ve profil. Ses, yüz ve avatar sağlayıcı kayıtları bu sürümde henüz saklanmıyor — eklendiğinde bunlar da bu listeye dahil edilecek. Bu işlem geri alınamaz.",
      "acctManage.delete.start": "Hemen sil",
      "acctManage.delete.willDelete": "Bunlar silinecek:",
      "acctManage.delete.countsLine": "{sohbetler} sohbet, {mesajlar} mesaj, {memories} hafıza notu, {profiles} profil.",
      "acctManage.delete.confirmWord": "SİL",
      "acctManage.delete.confirmLabel": "Onaylamak için SİL yaz",
      "acctManage.delete.submit": "Kalıcı olarak sil",
      "acctManage.delete.cancel": "Vazgeç",
      "acctManage.delete.success": "Hesabın silindi. Kalan kayıt: {n}.",
      "acctManage.delete.wrongPassword": "Şifre yanlış.",
      "acctManage.delete.wrongConfirm": "Onaylamak için kelimeyi tam olarak yukarıdaki gibi yaz.",
      "acctManage.delete.error": "Bir şeyler ters gitti. Tekrar dene.",
      "freeze.overlay.title": "Hesabın dondurulmuş",
      "freeze.overlay.body": "{date}'e kadar dondurulmuş. Tek dokunuşla şimdi açabilir ya da sonra dönebilirsin — dondurulu kaldığı sürece hiçbir şey kaybolmaz.",
      "freeze.overlay.reopen": "Şimdi aç",
      "freeze.overlay.dismiss": "Şimdi değil",
      "settings.voiceNote": "Ses henüz yok — ses özelliğiyle birlikte gelecek.",
      "settings.about": "Hakkında",
      "settings.privacyCenter": "Gizlilik merkezi",
      "settings.timeManagement": "Zaman yönetimi",
      "settings.devicePermissions": "Cihaz izinleri",
      "settings.accountSettings": "Hesap",
      "about.title": "Hakkında",
      "about.body": "EREBIEL — üç varlık, tek gerçek. Archon, Multivac ve Ayna.",
      "about.privacy": "Gizlilik metni",
      "auth.resetSent": "Bu e-postaya ait bir hesap varsa, sıfırlama bağlantısı gönderildi.",
      "auth.confirmSent": "Hesabını doğrulamak için e-postana bak, sonra giriş yap.",
      "auth.err.generic": "Bir şeyler ters gitti. Tekrar dene.",
      "auth.err.underage": "Hesap açmak için en az {age} yaşında olman gerekiyor.",
      "auth.err.usernameInvalid": "Kullanıcı adı: 3-20 karakter, küçük harf, sayı ve _ dışında bir şey olmaz.",
      "auth.err.usernameTaken": "Bu kullanıcı adı alınmış — başka bir ad dene.",
      "auth.err.required": "Her alanı doldur.",
      "auth.hint": "E-postan sadece giriş yapmak ve şifre sıfırlamak için kullanılır. Kendi verini sadece sen görebilirsin.",
      "auth.hero.title": "EREBIEL",
      "auth.hero.subtitle": "Üç varlık, tek gerçek.",
      "auth.card.archon": "Keskin, dürüst netlik.",
      "auth.card.multivac": "Bilge, sabırlı yol gösterici.",
      "auth.card.mirror": "Kendi yansıman.",
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
      "chat.retry": "Tekrar dene",
      "err.maintenance": "Şu an sohbet bakımda, yakında döneceğiz.",
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
        <p>Tarayıcının bu cihazdaki depolamasında şunlar durur: tema, vurgu rengi ve dil tercihin, son ziyaret zamanın, Archon ve Multivac ile sohbetlerin (en son 40 sohbet), profilin — adın, profil fotoğrafın, arka plan rengi ya da fotoğrafı, Vision metni ve not ile tarihleriyle birlikte fotoğrafların ve kolaj panoların — ve senkron kodun. Profilin ve fotoğrafların sunucumuza hiç gönderilmez. Tarayıcı verilerini silersen bunların hepsi silinir.</p>
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
        <p class="muted">Son güncelleme: 7 Ekim 2026. Bu metin değişirse bu pencerede güncellenir.</p>`,
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
