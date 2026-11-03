-- 0001_profiles.sql
-- ÇALIŞTIRMA SIRASI: 1/3. Supabase Dashboard → SQL Editor → bu dosyanın TAMAMINI yapıştır → Run.
-- Bu dosya tek başına çalıştırılabilir (fonksiyonlar/trigger'lar sohbetler/mesajlar tablolarına bağlı değil).
--
-- NE YAPAR:
--  - public.profiles: her kullanıcının kullanıcı adı ve doğum yılı. id = auth.users.id (Supabase Auth'un
--    kendi kullanıcı tablosu; bu projede ayrı bir şifre/kullanıcı sistemi YOK, tamamen Supabase Auth kullanılır).
--  - Kayıt (signUp) sırasında auth.users'a eklenen her satır için otomatik bir profiles satırı açan bir
--    trigger. Kullanıcı adı ve doğum yılı, signUp'ın "options.data" alanından (raw_user_meta_data) okunur.
--  - MIN_AGE=18 kontrolü: birth_year üzerinden bir CHECK constraint. Bu, istemci tarafı (JavaScript) kontrolü
--    atlatılsa bile veritabanı seviyesinde uygulanır — sahte bir doğum yılı göndermek dışında aşılamaz.
--    (JS tarafındaki MIN_AGE sabitiyle burada yazılan "18" senkron tutulmalı; biri değişirse diğeri de
--    güncellenmeli.)
--  - Row Level Security AÇIK: herkes sadece kendi profiline bakabilir/güncelleyebilir.
--  - is_username_available(): kullanıcı adı önerisinin müsait olup olmadığını, profiles tablosunun içeriğini
--    hiç açığa çıkarmadan (yalnızca true/false) kontrol eden, anonim kullanıcıların da çağırabildiği bir
--    fonksiyon — signUp'tan ÖNCE "bu kullanıcı adı uygun mu" diye sorabilmek için.

create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  birth_year integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]{3,20}$'),
  constraint profiles_birth_year_sane check (birth_year >= 1900 and birth_year <= extract(year from now())::int),
  -- MIN_AGE=18: doğum yılı, bugünün yılından en az 18 çıkarılmış olmalı.
  constraint profiles_min_age check (birth_year <= extract(year from now())::int - 18)
);

create index profiles_username_idx on public.profiles (username);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Kasıtlı olarak normal kullanıcılar için INSERT politikası YOK: profil satırı yalnızca aşağıdaki trigger
-- aracılığıyla (SECURITY DEFINER, RLS'yi bu tek kontrollü yoldan atlar) oluşturulabilir. Bir kullanıcı kendi
-- profilini elle INSERT edemez, sadece signUp akışı üzerinden oluşur.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  suggested text;
begin
  suggested := lower(regexp_replace(coalesce(new.raw_user_meta_data->>'username', ''), '[^a-zA-Z0-9_]', '', 'g'));
  if suggested is null or length(suggested) < 3 then
    -- güvenli, garanti benzersiz yedek: kullanıcının kendi id'sinden türetilir (profiles.id zaten benzersiz)
    suggested := 'kullanici_' || replace(new.id::text, '-', '');
  end if;

  -- birth_year metadata'da yoksa bilerek bir varsayılan DEĞER KOYMUYORUZ: coalesce ile 1900 gibi "güvenli"
  -- bir sahte değer atamak, frontend'de doğum yılı göndermeyi unutan bir hatayı sessizce gizlerdi. Eksikse
  -- NULL gider, NOT NULL constraint'i ihlal eder, trigger hata fırlatır, signUp başarısız olur — hata görünür
  -- kalır ve 18 yaş kontrolü de hiç atlanmaz.
  insert into public.profiles (id, username, birth_year)
  values (new.id, suggested, (new.raw_user_meta_data->>'birth_year')::int);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_username_available(candidate text)
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select not exists (
    select 1 from public.profiles where username = lower(candidate)
  );
$$;

grant execute on function public.is_username_available(text) to anon, authenticated;
