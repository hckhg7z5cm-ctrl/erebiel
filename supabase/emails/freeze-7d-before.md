# Taslak e-posta — dondurma süresi bitmeden 7 gün önce

**DURUM: taslak. Gönderime BAĞLANMADI.** Hangi servisle (Supabase'in kendi SMTP'si,
Resend, Postmark, …) gönderileceğine karar verilip bağlanana kadar hiçbir yere
gitmiyor. `profiles.freeze_notice_7d_sent_at` kolonu, bağlandığında "bu kullanıcıya
zaten gönderildi mi" kontrolü için hazır (bkz. 0004_dondur_sil.sql).

Değişkenler: `{username}`, `{unfreezeDate}` (ör. "17 Aralık 2026").

---

## Konu (TR)
EREBIEL hesabın 7 gün sonra dondurulmuş kalmaya devam edecek

## Gövde (TR)
Merhaba {username},

EREBIEL hesabını dondurdun. Dondurma süren **{unfreezeDate}** tarihinde bitiyor.

O tarihten sonra 30 gün içinde giriş yapmazsan hesabın ve verilerin (sohbetler,
hafıza notları, profil) **kalıcı olarak silinir** — bu işlem geri alınamaz.

Hesabını bu süre boyunca açık tutmak istiyorsan, giriş yapıp tek dokunuşla
dondurmayı kaldırabilirsin. Hiçbir şey yapmazsan hesabın dondurulmuş kalır.

— EREBIEL

---

## Subject (EN)
Your EREBIEL account stays frozen for 7 more days

## Body (EN)
Hi {username},

Your EREBIEL account is frozen. The freeze ends on **{unfreezeDate}**.

If you don't sign in within 30 days after that date, your account and your data
(chats, memory notes, profile) will be **permanently deleted** — this cannot be
undone.

If you'd like to keep your account, sign in and reopen it with one tap. If you do
nothing, the account stays frozen.

— EREBIEL
