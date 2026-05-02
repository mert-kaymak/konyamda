-- ============================================================
-- KonyamDa — Supabase Schema
-- Supabase Dashboard > SQL Editor'e yapıştırıp çalıştırın
-- ============================================================

-- ------------------------------------------------------------
-- EXTENSIONS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 1. PROFILES
-- auth.users ile 1-1 ilişki
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  full_name    text,
  avatar_url   text,
  phone        text,
  bio          text,
  is_organizer boolean not null default false,
  created_at   timestamptz not null default now()
);

-- Yeni kullanıcı kaydında profil otomatik oluştur
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------
-- 2. CATEGORIES
-- ------------------------------------------------------------
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  slug       text not null unique,
  icon       text,
  color      text,
  created_at timestamptz not null default now()
);

-- Başlangıç kategorileri
insert into public.categories (name, slug, icon, color) values
  ('Yemek & İçecek',   'yemek-icecek',  '🍽️',  '#f97316'),
  ('Kültür & Tarih',   'kultur-tarih',  '🏛️',  '#8b5cf6'),
  ('Doğa & Spor',      'doga-spor',     '🌿',  '#22c55e'),
  ('El Sanatları',     'el-sanatlari',  '🎨',  '#ec4899'),
  ('Müzik & Eğlence',  'muzik-eglence', '🎵',  '#3b82f6'),
  ('Gezi & Tur',       'gezi-tur',      '🗺️',  '#f59e0b')
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- 3. EXPERIENCES
-- ------------------------------------------------------------
create table if not exists public.experiences (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  slug                text not null unique,
  description         text,
  short_description   text,
  category_id         uuid references public.categories (id) on delete set null,
  organizer_id        uuid not null references public.profiles (id) on delete cascade,
  price               numeric(10, 2) not null default 0,
  price_type          text not null default 'kişi'
                        check (price_type in ('kişi', 'grup', 'etkinlik')),
  duration_minutes    int not null default 60,
  max_participants    int not null default 10,
  location            text,
  address             text,
  images              text[] not null default '{}',
  is_featured         boolean not null default false,
  is_active           boolean not null default true,
  created_at          timestamptz not null default now()
);

create index if not exists experiences_organizer_idx  on public.experiences (organizer_id);
create index if not exists experiences_category_idx   on public.experiences (category_id);
create index if not exists experiences_active_idx     on public.experiences (is_active);
create index if not exists experiences_featured_idx   on public.experiences (is_featured);

-- ------------------------------------------------------------
-- 4. BOOKINGS
-- ------------------------------------------------------------
create table if not exists public.bookings (
  id                uuid primary key default gen_random_uuid(),
  experience_id     uuid references public.experiences (id) on delete cascade,
  experience_slug   text,
  experience_title  text,
  user_id           uuid not null references public.profiles (id) on delete cascade,
  participant_count int not null default 1 check (participant_count > 0),
  booking_date      date not null,
  total_price       numeric(10, 2) not null,
  status            text not null default 'pending'
                      check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes             text,
  created_at        timestamptz not null default now()
);

-- ============================================================
-- MIGRATION — Mevcut DB için Supabase SQL Editor'de çalıştırın
-- ============================================================
-- ALTER TABLE public.bookings
--   ALTER COLUMN experience_id DROP NOT NULL,
--   ADD COLUMN IF NOT EXISTS experience_slug text,
--   ADD COLUMN IF NOT EXISTS experience_title text;
--
-- -- RLS policy'ler eksikse ekle:
-- DROP POLICY IF EXISTS "Giriş yapmış kullanıcı rezervasyon oluşturabilir" ON public.bookings;
-- CREATE POLICY "Giriş yapmış kullanıcı rezervasyon oluşturabilir"
--   ON public.bookings FOR INSERT
--   WITH CHECK (auth.uid() = user_id);
--
-- DROP POLICY IF EXISTS "Kullanıcı kendi rezervasyonlarını görebilir" ON public.bookings;
-- CREATE POLICY "Kullanıcı kendi rezervasyonlarını görebilir"
--   ON public.bookings FOR SELECT
--   USING (auth.uid() = user_id);

create index if not exists bookings_user_idx       on public.bookings (user_id);
create index if not exists bookings_experience_idx on public.bookings (experience_id);
create index if not exists bookings_status_idx     on public.bookings (status);

-- ------------------------------------------------------------
-- 5. REVIEWS
-- ------------------------------------------------------------
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  booking_id    uuid references public.bookings (id) on delete set null,
  rating        int not null check (rating between 1 and 5),
  comment       text,
  created_at    timestamptz not null default now(),
  -- Her kullanıcı bir deneyimi bir kez değerlendirebilir
  unique (experience_id, user_id)
);

create index if not exists reviews_experience_idx on public.reviews (experience_id);
create index if not exists reviews_user_idx       on public.reviews (user_id);

-- ------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ------------------------------------------------------------

alter table public.profiles    enable row level security;
alter table public.categories  enable row level security;
alter table public.experiences enable row level security;
alter table public.bookings    enable row level security;
alter table public.reviews     enable row level security;

-- PROFILES
create policy "Herkes profilleri görebilir"
  on public.profiles for select using (true);

create policy "Kullanıcı kendi profilini güncelleyebilir"
  on public.profiles for update using (auth.uid() = id);

-- CATEGORIES
create policy "Herkes kategorileri görebilir"
  on public.categories for select using (true);

-- EXPERIENCES
create policy "Herkes aktif deneyimleri görebilir"
  on public.experiences for select using (is_active = true);

create policy "Organizatör kendi deneyimlerini yönetebilir (select)"
  on public.experiences for select using (auth.uid() = organizer_id);

create policy "Organizatör deneyim ekleyebilir"
  on public.experiences for insert
  with check (
    auth.uid() = organizer_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_organizer = true
    )
  );

create policy "Organizatör kendi deneyimlerini güncelleyebilir"
  on public.experiences for update using (auth.uid() = organizer_id);

create policy "Organizatör kendi deneyimlerini silebilir"
  on public.experiences for delete using (auth.uid() = organizer_id);

-- BOOKINGS
create policy "Kullanıcı kendi rezervasyonlarını görebilir"
  on public.bookings for select using (auth.uid() = user_id);

create policy "Organizatör kendi deneyimine ait rezervasyonları görebilir"
  on public.bookings for select
  using (
    exists (
      select 1 from public.experiences
      where id = experience_id and organizer_id = auth.uid()
    )
  );

create policy "Giriş yapmış kullanıcı rezervasyon oluşturabilir"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Kullanıcı kendi rezervasyonunu iptal edebilir"
  on public.bookings for update
  using (auth.uid() = user_id);

-- REVIEWS
create policy "Herkes yorumları görebilir"
  on public.reviews for select using (true);

create policy "Giriş yapmış kullanıcı yorum ekleyebilir"
  on public.reviews for insert
  with check (auth.uid() = user_id);

create policy "Kullanıcı kendi yorumunu güncelleyebilir"
  on public.reviews for update using (auth.uid() = user_id);

create policy "Kullanıcı kendi yorumunu silebilir"
  on public.reviews for delete using (auth.uid() = user_id);
