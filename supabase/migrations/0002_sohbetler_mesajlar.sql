-- 0002_sohbetler_mesajlar.sql
-- ÇALIŞTIRMA SIRASI: 2/3. 0001_profiles.sql'den SONRA çalıştır (auth.users zaten var olmalı; profiles'a
-- bağımlılığı yok ama okuma sırası tutarlılık için böyle).
--
-- NE YAPAR:
--  - public.sohbetler: giriş yapmış bir kullanıcının Archon/Multivac konuşmaları (Mirror burada da yok —
--    Mirror hiçbir zaman saklanmaz, anonim akışta da öyleydi; bu davranış hesaplı kullanıcılar için de aynen
--    korunuyor).
--  - public.mesajlar: her sohbetin mesajları (user/assistant).
--  - Bu tablolar MEVCUT Redis/senkron-kod akışının YERİNE geçmez: anonim kullanıcılar (Authorization header
--    göndermeyenler) eskisi gibi Redis'i kullanmaya devam eder. Bu tablolar sadece GİRİŞ YAPMIŞ kullanıcılar
--    için kullanılır (api/chat.js, Authorization varsa).
--  - Row Level Security AÇIK: bir kullanıcı sadece kendi sohbetini/mesajını görebilir, ekleyebilir, silebilir.
--    mesajlar.user_id, sohbetler.user_id ile aynı olmak zorundadır (aşağıdaki WITH CHECK) — biri kendi
--    user_id'siyle ama başkasının sohbet_id'sine mesaj ekleyemez.

create table public.sohbetler (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  persona text not null check (persona in ('archon', 'multivac')),
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sohbetler_user_id_idx on public.sohbetler (user_id, updated_at desc);

alter table public.sohbetler enable row level security;

create policy "sohbetler_select_own" on public.sohbetler
  for select using (auth.uid() = user_id);
create policy "sohbetler_insert_own" on public.sohbetler
  for insert with check (auth.uid() = user_id);
create policy "sohbetler_update_own" on public.sohbetler
  for update using (auth.uid() = user_id);
create policy "sohbetler_delete_own" on public.sohbetler
  for delete using (auth.uid() = user_id);

create table public.mesajlar (
  id uuid primary key default gen_random_uuid(),
  sohbet_id uuid not null references public.sohbetler(id) on delete cascade,
  -- user_id burada tekrar edilir (denormalize): her satırda sohbetler'e JOIN yapmadan tek bir sütun
  -- karşılaştırmasıyla RLS kontrolü yapılabilsin diye — Postgres/Supabase'de önerilen, performanslı desen.
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index mesajlar_sohbet_id_idx on public.mesajlar (sohbet_id, created_at);
create index mesajlar_user_id_idx on public.mesajlar (user_id);

alter table public.mesajlar enable row level security;

create policy "mesajlar_select_own" on public.mesajlar
  for select using (auth.uid() = user_id);

create policy "mesajlar_insert_own" on public.mesajlar
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.sohbetler s
      where s.id = sohbet_id and s.user_id = auth.uid()
    )
  );

create policy "mesajlar_delete_own" on public.mesajlar
  for delete using (auth.uid() = user_id);

-- mesajlar için kasıtlı olarak UPDATE politikası yok: gönderilen bir mesaj değiştirilemez (anonim akıştaki
-- davranışla aynı — geçmiş sadece eklenir, düzenlenmez).
