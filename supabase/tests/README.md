# "A, B'nin verisini göremez" testi

İki yolu var; anahtarın yoksa birincisi yeterli.

## 1. SQL (API anahtarı GEREKMİYOR) — önerilen, şimdilik tek çalıştırılabilen

`rls_isolation.sql`: migration'lar (0001-0003) zaten çalıştırılmış olmalı. Dosyanın tamamını Supabase
SQL Editor'e yapıştır, Run. İki sahte kullanıcıyı Postgres'in içinde (gerçek signUp'a gerek kalmadan)
oluşturur, `request.jwt.claims`'i Supabase'in kendi önerdiği yöntemle A ve B olarak sırayla sahteler, ve:

- B, A'nın sohbetini/mesajını/profilini **göremiyor** olmalı,
- B, A'nın sohbetine mesaj **ekleyemiyor** olmalı,
- A kendi verisini **görebiliyor** olmalı (her şeyi yanlışlıkla kapatmadığımızın kontrolü).

Sonunda `BAŞARILI` notice'i ya da hangi kontrolün çaktığını söyleyen bir `BAŞARISIZ: ...` hatası görürsün.
Kendi kendini temizler (test kullanıcılarını siler). Bu dosya **henüz gerçek bir Postgres'e karşı
çalıştırılmadı** (bu ortamda psql/Supabase erişimi yok) — çalıştırıp sonucu (başarılı ya da tam hata metni)
iletirsen, bir şey çakarsa hemen düzeltirim.

## 2. HTTP (gerçek SUPABASE_URL + SUPABASE_ANON_KEY varsa) — ek doğrulama

`rls_isolation_http.mjs`: gerçek iki kullanıcı açıp (signUp+signIn) gerçek HTTP istekleriyle aynı şeyi test
eder — API katmanını da (sadece veritabanı politikasını değil) kapsar. Çalıştırma:

```bash
SUPABASE_URL=... SUPABASE_ANON_KEY=... node supabase/tests/rls_isolation_http.mjs
```

**Not:** Supabase projende "Confirm email" açıksa (varsayılan), signUp sonrası e-posta doğrulanmadan
signIn başarısız olur ve bu script patlar. Test için ya bu projede e-posta doğrulamasını kapat (Authentication
→ Providers → Email → "Confirm email"), ya da gerçek bir gelen kutusuyla doğrula.
