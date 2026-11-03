-- 0003_user_memories.sql
-- ÇALIŞTIRMA SIRASI: 3/3. 0001_profiles.sql'den SONRA çalıştır (auth.users'a bağımlı).
--
-- NE YAPAR:
--  - public.user_memories: "hafıza" — karakterlerin kullanıcı hakkında OTURUMLAR ARASI hatırladığı kısa
--    notlar/özetler (örn. "kahve sever", "İzmir'de yaşıyor"). Bu, sohbetler/mesajlar'daki ham konuşma kaydı
--    DEĞİL; yeni bir özellik olarak eklendi (henüz hiçbir karakter bunu okumuyor/yazmıyor — bu migration
--    sadece depoyu açar, kullanan kodu sonraki bir adımda gelecek).
--  - persona 'mirror' dahil edildi: Mirror'ın kendisi hâlâ hiçbir konuşmayı saklamıyor (sohbetler/mesajlar'da
--    yok), ama "kullanıcı hakkında hatırlanan tek satırlık notlar" ayrı bir şey sayıldı ve varsayım olarak
--    üçüne de açık tutuldu. Bu bir varsayımdır — Mirror'ın hafızaya hiç dahil olmaması isteniyorsa persona
--    check'inden 'mirror' çıkarılıp bu satırdaki mevcut notlar silinmelidir.
--  - Row Level Security AÇIK: bir kullanıcı sadece kendi notlarını görebilir/değiştirebilir/silebilir.

create table public.user_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  persona text not null check (persona in ('archon', 'multivac', 'mirror')),
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_memories_user_id_idx on public.user_memories (user_id, persona);

alter table public.user_memories enable row level security;

create policy "user_memories_select_own" on public.user_memories
  for select using (auth.uid() = user_id);
create policy "user_memories_insert_own" on public.user_memories
  for insert with check (auth.uid() = user_id);
create policy "user_memories_update_own" on public.user_memories
  for update using (auth.uid() = user_id);
create policy "user_memories_delete_own" on public.user_memories
  for delete using (auth.uid() = user_id);
