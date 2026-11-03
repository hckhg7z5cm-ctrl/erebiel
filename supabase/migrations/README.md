# Migration'ları çalıştırma

Supabase Dashboard → **SQL Editor** → her dosyayı **sırayla, tam içeriğiyle** yapıştır → **Run**.
Supabase CLI kullanılmıyor; bu yüzden dosya adları zaman damgası değil, sadece sıra numarası taşıyor.

1. `0001_profiles.sql` — kullanıcı profilleri (kullanıcı adı, doğum yılı), signUp sonrası otomatik profil
   açan trigger, 18 yaş kontrolü (DB seviyesinde CHECK constraint, atlatılamaz), kullanıcı adı müsaitlik
   kontrolü (`is_username_available`). **Önce bu çalışmalı** — `auth.users` üzerine trigger kurar.
2. `0002_sohbetler_mesajlar.sql` — giriş yapmış kullanıcıların Archon/Multivac konuşmaları. Anonim
   (senkron kodlu) akışın Redis'teki geçmişine **dokunmaz**; sadece oturum açan kullanıcılar için ayrı bir
   depo açar.
3. `0003_user_memories.sql` — yeni bir özellik: karakterlerin kullanıcı hakkında oturumlar arası hatırladığı
   kısa notlar. Henüz hiçbir kod bunu okuyup yazmıyor; bu migration sadece tabloyu/RLS'yi hazırlıyor.

Üçünde de **Row Level Security açık** ve her tabloda kullanıcı sadece `auth.uid() = user_id` (ya da
`profiles.id`) olan satırları görebilir/değiştirebilir — bu, "A kullanıcısı B'nin verisini göremez" testinin
dayandığı mekanizma.

Bir dosya hata verirse (örn. tablo zaten var, trigger zaten var) dur ve hata mesajını ilet — tekrar
çalıştırmadan önce neyin çarptığına bakmak gerekir; bu dosyalar `create or replace` dışında idempotent
değildir (ör. `create table`, iki kez çalıştırılırsa hata verir).
