-- interks personal learning workspace
-- Supabase → SQL Editor → Run this file
-- Auth → URL Configuration: add http://localhost:3000, /login, /profile, /dashboard, /learn
-- Auth → Providers → Email: enable; for local testing you can disable "Confirm email"

-- Tables ---------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_profiles_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_profiles_updated_at ();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Categories (per-user topics / decks)
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  label_sq text not null,
  label_en text not null,
  sort_order int not null default 0
);

alter table public.categories add column if not exists user_id uuid references auth.users (id) on delete cascade;

alter table public.categories drop constraint if exists categories_slug_key;
drop index if exists categories_slug_key;

delete from public.questions where category_id in (select id from public.categories where user_id is null);
delete from public.categories where user_id is null;

alter table public.categories alter column user_id set not null;

create unique index if not exists categories_user_slug_uq on public.categories (user_id, slug);

alter table public.categories drop constraint if exists categories_slug_check;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories (id) on delete cascade,
  question_sq text not null default '',
  question_en text not null default '',
  answer_sq text not null default '',
  answer_en text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_category_sort_idx
  on public.questions (category_id, sort_order, created_at);

create or replace function public.handle_questions_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
  before update on public.questions
  for each row
  execute function public.handle_questions_updated_at ();

-- Personal study notes (short reference text)
create table if not exists public.study_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  body text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists study_notes_user_sort_idx on public.study_notes (user_id, sort_order, created_at);

create or replace function public.handle_study_notes_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists study_notes_set_updated_at on public.study_notes;
create trigger study_notes_set_updated_at
  before update on public.study_notes
  for each row
  execute function public.handle_study_notes_updated_at ();

-- Legacy public submissions (removed product-wide queue)
drop table if exists public.question_submissions cascade;

-- Row level security ---------------------------------------------------------

alter table public.categories enable row level security;
alter table public.questions enable row level security;
alter table public.study_notes enable row level security;

-- Drop legacy policies
drop policy if exists "categories_select_authenticated" on public.categories;
drop policy if exists "categories_insert_authenticated" on public.categories;
drop policy if exists "categories_update_authenticated" on public.categories;
drop policy if exists "categories_delete_authenticated" on public.categories;
drop policy if exists "categories_select_anon" on public.categories;

drop policy if exists "questions_select_authenticated" on public.questions;
drop policy if exists "questions_insert_authenticated" on public.questions;
drop policy if exists "questions_update_authenticated" on public.questions;
drop policy if exists "questions_delete_authenticated" on public.questions;
drop policy if exists "questions_select_anon" on public.questions;

-- Categories: own rows only
drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own"
  on public.categories
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "categories_insert_own" on public.categories;
create policy "categories_insert_own"
  on public.categories
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "categories_update_own" on public.categories;
create policy "categories_update_own"
  on public.categories
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "categories_delete_own" on public.categories;
create policy "categories_delete_own"
  on public.categories
  for delete
  to authenticated
  using (user_id = auth.uid());

-- Questions: only inside own categories
drop policy if exists "questions_select_own" on public.questions;
create policy "questions_select_own"
  on public.questions
  for select
  to authenticated
  using (
    exists (
      select 1 from public.categories c
      where c.id = questions.category_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "questions_insert_own" on public.questions;
create policy "questions_insert_own"
  on public.questions
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.categories c
      where c.id = questions.category_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "questions_update_own" on public.questions;
create policy "questions_update_own"
  on public.questions
  for update
  to authenticated
  using (
    exists (
      select 1 from public.categories c
      where c.id = questions.category_id and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.categories c
      where c.id = questions.category_id and c.user_id = auth.uid()
    )
  );

drop policy if exists "questions_delete_own" on public.questions;
create policy "questions_delete_own"
  on public.questions
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.categories c
      where c.id = questions.category_id and c.user_id = auth.uid()
    )
  );

-- Study notes: own rows only
drop policy if exists "study_notes_select_own" on public.study_notes;
create policy "study_notes_select_own"
  on public.study_notes
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "study_notes_insert_own" on public.study_notes;
create policy "study_notes_insert_own"
  on public.study_notes
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "study_notes_update_own" on public.study_notes;
create policy "study_notes_update_own"
  on public.study_notes
  for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "study_notes_delete_own" on public.study_notes;
create policy "study_notes_delete_own"
  on public.study_notes
  for delete
  to authenticated
  using (user_id = auth.uid());
