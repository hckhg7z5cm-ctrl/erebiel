-- supabase/tests/rls_isolation.sql
-- "A kullanıcısı B'nin verisini göremez" testi. API ANAHTARI GEREKMEZ: gerçek bir signUp yapmadan, Postgres'in
-- kendi RLS motorunu SQL Editor'de doğrudan test eder (Supabase'in resmi, dokümante edilmiş yöntemi:
-- request.jwt.claims'i set_config ile sahteleyip role'ü authenticated'a çevirmek).
--
-- GEREKSİNİM: 0001/0002/0003 migration'ları zaten çalıştırılmış olmalı.
-- ÇALIŞTIRMA: Bu dosyanın TAMAMINI SQL Editor'e yapıştır → Run. Sonunda ya "BAŞARILI" notice'i görürsün,
-- ya da bir "BAŞARISIZ: ..." hatasıyla DURUR (hangi kontrol çaktıysa onu söyler).
-- Test kendi kendini temizler (sonunda iki test kullanıcısını siler, cascade ile profiles/sohbetler/mesajlar
-- de gider) — başarısız olsa bile `delete from auth.users where email like 'rls-test-%@example.com';` ile
-- elle temizleyebilirsin.

do $$
declare
  user_a uuid := gen_random_uuid();
  user_b uuid := gen_random_uuid();
  sohbet_a uuid;
  n int;
begin
  -- İki test kullanıcısı: auth.users'a direkt satır, gerçek signUp'ın GoTrue üzerinden yaptığının elle
  -- taklidi. Bu satır, 0001'deki handle_new_user trigger'ını da tetikler (profiles satırları otomatik açılır).
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token
  ) values
    ('00000000-0000-0000-0000-000000000000', user_a, 'authenticated', 'authenticated', 'rls-test-a@example.com',
     crypt('rls-test-not-a-real-password', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', jsonb_build_object('username','rlstesta','birth_year',1990),
     now(), now(), '', ''),
    ('00000000-0000-0000-0000-000000000000', user_b, 'authenticated', 'authenticated', 'rls-test-b@example.com',
     crypt('rls-test-not-a-real-password', gen_salt('bf')), now(),
     '{"provider":"email","providers":["email"]}', jsonb_build_object('username','rlstestb','birth_year',1990),
     now(), now(), '', '');

  -- ---- A olarak: bir sohbet + bir mesaj oluştur ----
  set local role authenticated;
  perform set_config('request.jwt.claims', json_build_object('sub', user_a::text, 'role', 'authenticated')::text, true);

  insert into public.sohbetler (user_id, persona, title) values (user_a, 'archon', 'A''nın sohbeti')
    returning id into sohbet_a;
  insert into public.mesajlar (sohbet_id, user_id, role, content) values (sohbet_a, user_a, 'user', 'A''nın mesajı');

  -- A kendi sohbetini görebilmeli (pozitif kontrol — her şeyi yanlışlıkla kapatmadığımızdan emin olmak için)
  select count(*) into n from public.sohbetler where id = sohbet_a;
  if n <> 1 then raise exception 'BAŞARISIZ: A kendi sohbetini göremiyor (RLS gereğinden sıkı)'; end if;

  -- ---- B olarak bak: A'nın hiçbir satırını görmemeli ----
  perform set_config('request.jwt.claims', json_build_object('sub', user_b::text, 'role', 'authenticated')::text, true);

  select count(*) into n from public.sohbetler where id = sohbet_a;
  if n <> 0 then raise exception 'BAŞARISIZ: B, A''nın sohbetini görebiliyor (sohbetler RLS çalışmıyor)'; end if;

  select count(*) into n from public.mesajlar where sohbet_id = sohbet_a;
  if n <> 0 then raise exception 'BAŞARISIZ: B, A''nın mesajlarını görebiliyor (mesajlar RLS çalışmıyor)'; end if;

  select count(*) into n from public.profiles where id = user_a;
  if n <> 0 then raise exception 'BAŞARISIZ: B, A''nın profilini görebiliyor (profiles RLS çalışmıyor)'; end if;

  -- B, A'nın sohbetine kendi user_id'siyle mesaj EKLEYEMEMELİ (mesajlar_insert_own'daki EXISTS kontrolü).
  -- Burada kendi "başarısız" hatamızı try/catch'in İÇİNDE fırlatmıyoruz — kendi exception handler'ımız onu
  -- da yutar diye (RLS'nin engellemesiyle bizim assertion'ımızı birbirine karıştırmamak için bayrak kullanıyoruz).
  declare insert_engellendi boolean := false;
  begin
    begin
      insert into public.mesajlar (sohbet_id, user_id, role, content) values (sohbet_a, user_b, 'user', 'sizma-denemesi');
    exception when others then
      insert_engellendi := true; -- beklenen: RLS reddetti
    end;
    if not insert_engellendi then
      raise exception 'BAŞARISIZ: B, A''nın sohbetine mesaj ekleyebildi (insert RLS çalışmıyor)';
    end if;
  end;
  select count(*) into n from public.mesajlar where sohbet_id = sohbet_a and content = 'sizma-denemesi';
  if n <> 0 then raise exception 'BAŞARISIZ: B''nin sızma mesajı tabloda bulundu — insert RLS çalışmıyor'; end if;

  reset role;
  raise notice 'BAŞARILI: A ve B birbirinin verisini göremiyor/değiştiremiyor, kendi verisini görebiliyor.';

  -- temizlik
  delete from auth.users where id in (user_a, user_b);
end $$;
