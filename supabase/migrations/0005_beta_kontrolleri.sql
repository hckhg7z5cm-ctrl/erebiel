-- 0005_beta_kontrolleri.sql
-- ÇALIŞTIRMA SIRASI: 5. 0001_profiles.sql'den SONRA çalıştır (profiles'a kolon ekler, handle_new_user()
-- fonksiyonunu DEĞİŞTİRİR — mevcut davranışı korur, üstüne iki kontrol ekler).
--
-- NE YAPAR (BETA KONTROLLERİ):
--  - profiles.is_admin: /admin sayfasını görebilecek kullanıcılar. HİÇBİR satırda otomatik TRUE olmaz —
--    bu migration'dan sonra SEN kendi hesabını elle admin yapmalısın:
--      update public.profiles set is_admin = true where username = '<kendi kullanıcı adın>';
--  - public.beta_config: tek satırlık ayarlar (key/value jsonb). Bu migration iki satır ekler:
--    'max_users' (toplam kullanıcı tavanı) ve 'daily_message_limit' (SADECE GÖRÜNTÜLEME/admin paneli
--    içindir — gerçek uygulanan sınır api/_redis.js'teki BETA_DAILY_MSG_LIMIT ortam değişkenidir/sabitidir;
--    İKİSİ DE DEĞİŞİRSE EL İLE SENKRON TUTULMALI, MIN_AGE'deki gibi).
--  - public.invite_codes: davet kodları. Her kod en fazla max_uses kişi tarafından kullanılabilir
--    (used_count, max_uses'a ulaşınca kod tükenir). public.generate_invite_code() ile üretilir.
--  - handle_new_user() (0001'de tanımlı) GÜNCELLENDİ: artık kayıt sırasında (a) toplam kullanıcı
--    tavanını VE (b) geçerli, tükenmemiş bir davet kodunu (raw_user_meta_data->>'invite_code') ZORUNLU
--    kılıyor. İkisinden biri sağlanmazsa TÜM signUp işlemi başarısız olur (transaction rollback) — istemci
--    tarafı kontrolü atlatılsa bile (DevTools'tan) sunucuda/veritabanında engellenir, MIN_AGE'deki gibi.
--    Davet kodu kontrolü ATOMIK'tir (UPDATE...WHERE used_count < max_uses) — aynı anda iki kayıt aynı
--    kodu son hakkıyla kullanmaya çalışırsa sadece biri kazanır, kodun fazladan kullanılması engellenir.
--  - public.generate_invite_code(p_max_uses int): SADECE admin (is_admin=true) çağırabilir. Rastgele
--    8 karakterlik bir kod üretir, invite_codes'a ekler, kodu döner.
--  - public.admin_stats(): SADECE admin çağırabilir. /admin sayfası için SAYILARI döner — kayıt sayısı,
--    günlük aktif kullanıcı, 1. ve 7. gün geri dönüş oranı, kullanıcı başına ORTALAMA mesaj sayısı.
--    HİÇBİR mesaj İÇERİĞİ, e-posta ya da kullanıcı adı döndürmez — kişisel içerik toplamaz, sadece sayar.

alter table public.profiles add column is_admin boolean not null default false;

create table public.beta_config (
  key text primary key,
  value jsonb not null
);
insert into public.beta_config (key, value) values
  ('max_users', '500'),
  ('daily_message_limit', '40');
alter table public.beta_config enable row level security;
-- Kasıtlı olarak HİÇBİR politika yok: normal kullanıcılar/anon bu tabloyu hiç okuyamaz/değiştiremez.
-- SECURITY DEFINER fonksiyonlar (aşağıda) RLS'yi kendi kontrolleriyle atlayarak okur. Admin paneli sayıları
-- admin_stats() üzerinden alır, bu tabloyu DOĞRUDAN sorgulamaz.

create table public.invite_codes (
  code text primary key,
  max_uses int not null default 1 check (max_uses > 0),
  used_count int not null default 0 check (used_count >= 0),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);
alter table public.invite_codes enable row level security;
-- Burada da politika yok — kodlar yalnızca SECURITY DEFINER fonksiyonlar (generate_invite_code,
-- handle_new_user) üzerinden okunur/yazılır; kullanıcılar kod listesini asla doğrudan çekemez.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  suggested text;
  invite text;
  cap_max_users int;
  current_count int;
  consumed boolean;
begin
  -- (a) Toplam kullanıcı tavanı — bu AFTER INSERT trigger çalıştığında satır ZATEN eklenmiş sayılır,
  -- o yüzden "aşıldı mı" kontrolü current_count > cap_max_users'tır (eşitlik tavana TAM ulaşmak demektir,
  -- hâlâ izinli; bir fazlası reddedilir).
  select (value::text)::int into cap_max_users from public.beta_config where key = 'max_users';
  if cap_max_users is not null then
    select count(*) into current_count from auth.users;
    if current_count > cap_max_users then
      raise exception 'beta_user_cap_reached';
    end if;
  end if;

  -- (b) Davet kodu zorunlu ve atomik olarak tüketilir.
  invite := new.raw_user_meta_data->>'invite_code';
  if invite is null or length(trim(invite)) = 0 then
    raise exception 'invite_code_required';
  end if;
  update public.invite_codes
    set used_count = used_count + 1
    where code = upper(trim(invite)) and used_count < invite_codes.max_uses
    returning true into consumed;
  if consumed is not true then
    raise exception 'invite_code_invalid';
  end if;

  -- ---- aşağısı 0001_profiles.sql'deki ORİJİNAL davranış, DEĞİŞTİRİLMEDİ ----
  suggested := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', ''), '[^a-zA-Z0-9_]', '', 'g'));
  if suggested is null or length(suggested) < 3 then
    suggested := 'kullanici_' || replace(new.id::text, '-', '');
  end if;

  insert into public.profiles (id, username, birth_year)
  values (new.id, suggested, (new.raw_user_meta_data->>'birth_year')::int);

  return new;
end;
$$;

create or replace function public.generate_invite_code(p_max_uses int default 1)
returns text
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_code text;
  tries int := 0;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  if p_max_uses is null or p_max_uses < 1 then
    raise exception 'p_max_uses must be >= 1';
  end if;
  loop
    tries := tries + 1;
    -- 8 karakter, Crockford base32'ye yakın (karışan 0/O, 1/I/L yok) — elle yazılması/okunması kolay olsun.
    new_code := (
      select string_agg(substr('0123456789ABCDEFGHJKMNPQRSTVWXYZ', (random() * 32)::int + 1, 1), '')
      from generate_series(1, 8)
    );
    begin
      insert into public.invite_codes (code, max_uses, created_by) values (new_code, p_max_uses, auth.uid());
      return new_code;
    exception when unique_violation then
      if tries > 5 then raise exception 'could not generate a unique code, try again'; end if;
    end;
  end loop;
end;
$$;

grant execute on function public.generate_invite_code(int) to authenticated;

create or replace function public.admin_stats()
returns jsonb
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  result jsonb;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin) then
    raise exception 'not authorized';
  end if;
  select jsonb_build_object(
    'totalUsers', (select count(*) from auth.users),
    'dailyActiveUsers', (
      select count(distinct u.id) from auth.users u
      where u.last_sign_in_at::date = current_date
         or exists (select 1 from public.mesajlar m where m.user_id = u.id and m.created_at::date = current_date)
    ),
    -- gün-1 geri dönüş: tam olarak dün kayıt olanlardan, bugün (kayıttan 1 gün sonra) giriş/mesajı olanların oranı
    'day1RetentionPct', (
      select case when count(*) = 0 then null else round(100.0 * count(*) filter (
        where u.last_sign_in_at > u.created_at + interval '1 day'
           or exists (select 1 from public.mesajlar m where m.user_id = u.id and m.created_at > u.created_at + interval '1 day')
      ) / count(*), 1) end
      from auth.users u where u.created_at::date = current_date - interval '1 day'
    ),
    'day7RetentionPct', (
      select case when count(*) = 0 then null else round(100.0 * count(*) filter (
        where u.last_sign_in_at > u.created_at + interval '7 days'
           or exists (select 1 from public.mesajlar m where m.user_id = u.id and m.created_at > u.created_at + interval '7 days')
      ) / count(*), 1) end
      from auth.users u where u.created_at::date = current_date - interval '7 days'
    ),
    'avgMessagesPerUser', (
      select case when (select count(*) from auth.users) = 0 then 0
        else round((select count(*)::numeric from public.mesajlar where role = 'user') / (select count(*) from auth.users), 1)
      end
    ),
    'generatedAt', now()
  ) into result;
  return result;
end;
$$;

grant execute on function public.admin_stats() to authenticated;
