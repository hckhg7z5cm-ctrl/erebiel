-- 0004_dondur_sil.sql
-- ÇALIŞTIRMA SIRASI: 4. 0001_profiles.sql'den SONRA çalıştır (profiles tablosuna kolon ekler).
--
-- NE YAPAR (FAZ 4 — Ayarlar > Hesabı yönet: dondur/sil):
--  - profiles.frozen_until: NULL = dondurulmamış; gelecekte bir zaman damgasıysa o zamana kadar dondurulmuş.
--    Dondurma süreleri (1 ay/1 yıl/10 yıl) FRONTEND'de tek bir sabitte tutulur (index.html, FREEZE_DURATIONS);
--    bu kolon sadece hedef zamanı saklar, süreyi DB'de tekrar tanımlamaz.
--  - profiles.freeze_notice_7d_sent_at / freeze_notice_expired_sent_at: ileride e-posta gönderimi
--    bağlandığında "zaten gönderildi" tekrarını önlemek için. Bu migration e-posta GÖNDERMEZ, sadece
--    kolonları açar (taslak şablonlar: supabase/emails/freeze-7d-before.md, freeze-expired.md).
--  - public.account_data_counts(target uuid): kullanıcının kendi (ya da service_role'ün herhangi bir)
--    hesabına ait kayıt SAYILARINI döner (içerik değil) — "silinecekler listesi" önizlemesi VE silme
--    sonrası "kalan kayıt sayısı 0" doğrulaması için kullanılır (ikisi de aynı fonksiyon, aynı call).
--  - public.delete_my_account(): oturum açmış kullanıcının KENDİ auth.users satırını siler. profiles,
--    sohbetler, mesajlar, user_memories hepsi "references auth.users(id) on delete cascade" ile
--    tanımlı (0001-0003) — bu satır silinince hepsi otomatik ve kalıcı silinir. service_role/Admin API
--    GEREKMEZ (bu projede kasıtlı olarak kullanılmıyor, bkz. api/_supabase.js'teki not); SECURITY DEFINER
--    fonksiyon, onu oluşturan rolün (Supabase SQL Editor'da normalde "postgres") auth şemasındaki yetkisiyle
--    çalışır. "Hemen sil" akışı (frontend): 1) account_data_counts() ile listeyi göster, 2) şifreyi
--    signInWithPassword ile doğrula, 3) "SİL" yazıldıysa rpc('delete_my_account'), 4) account_data_counts()
--    tekrar çağrılır — hepsi 0 dönmeli (JWT silme sonrası bir süre daha geçerli kalır, bu kontrolü yapmaya
--    yeter).
--  - ÖNEMLİ KURAL (ileride yüz/ses/avatar sağlayıcı kayıtları gibi yeni, hesaba bağlı tablolar eklendiğinde):
--    o tablo da "user_id uuid references auth.users(id) on delete cascade" ile tanımlanmalı. Öyle
--    tanımlanırsa delete_my_account() DEĞİŞMEDEN o tabloyu da otomatik temizler (cascade şema üzerinden
--    çalışır, fonksiyonun tablo adlarını bilmesi gerekmez) — account_data_counts()'a ise o tabloyu da
--    saymak için elle bir satır eklenmesi gerekir (aşağıdaki fonksiyonu güncelle).

alter table public.profiles
  add column frozen_until timestamptz,
  add column freeze_notice_7d_sent_at timestamptz,
  add column freeze_notice_expired_sent_at timestamptz;

create or replace function public.account_data_counts(target uuid default auth.uid())
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
begin
  if target is null or (auth.uid() is distinct from target and auth.role() <> 'service_role') then
    raise exception 'not authorized';
  end if;
  return jsonb_build_object(
    'profiles', (select count(*) from public.profiles where id = target),
    'sohbetler', (select count(*) from public.sohbetler where user_id = target),
    'mesajlar', (select count(*) from public.mesajlar where user_id = target),
    'user_memories', (select count(*) from public.user_memories where user_id = target)
  );
end;
$$;

grant execute on function public.account_data_counts(uuid) to authenticated;

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

grant execute on function public.delete_my_account() to authenticated;

-- ---- Dondurma süresi bitip 30 gün giriş yapılmadıysa kalıcı silme (TARAYICIDA ÇALIŞMAZ — bir zamanlayıcı
-- gerektirir; bu migration onu KURMAZ, sadece fonksiyonu tanımlar). "30 gün giriş yoksa" kontrolü
-- auth.users.last_sign_in_at ile yapılır: kullanıcı frozen_until geçtikten SONRA tekrar giriş yaparsa
-- last_sign_in_at frozen_until'dan büyük olur ve aday listesinden çıkar (dondurmayı açmasa bile — "girişte
-- tek dokunuşla geri açılır" uyarısı her girişte tekrar gösterilir, bkz. frontend). ------------------------
-- KURULMADI: Supabase Dashboard → Database → Cron (pg_cron) ya da Vercel Cron ile GÜNLÜK çalıştırılmalı:
--   select public.run_account_retention_sweep();
-- Bu dosya SADECE fonksiyonu tanımlar; cron'u SEN kuracaksın (bkz. MORNING.md "bana düşen adımlar").
create or replace function public.run_account_retention_sweep()
returns setof uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  dead uuid;
begin
  if auth.role() <> 'service_role' and current_user <> 'postgres' then
    raise exception 'not authorized';
  end if;
  for dead in
    select p.id from public.profiles p
    join auth.users u on u.id = p.id
    where p.frozen_until is not null
      and p.frozen_until < now() - interval '30 days'
      and (u.last_sign_in_at is null or u.last_sign_in_at < p.frozen_until)
  loop
    delete from auth.users where id = dead;
    return next dead;
  end loop;
  return;
end;
$$;
