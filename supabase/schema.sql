-- interks admin: run this entire file in Supabase → SQL Editor → Run
-- After: Auth → URL Configuration → add http://localhost:3000 and http://localhost:3000/admin/dashboard
-- Auth → Providers → Email: enable; for quick testing you can disable "Confirm email"

-- Tables ---------------------------------------------------------------------

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug in ('intern', 'junior', 'mid')),
  label_sq text not null,
  label_en text not null,
  sort_order int not null default 0
);

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

-- Updated-at trigger ---------------------------------------------------------

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

-- Seed categories (idempotent) -----------------------------------------------

insert into public.categories (slug, label_sq, label_en, sort_order)
values
  ('intern', 'Praktikant', 'Intern', 1),
  ('junior', 'Junior', 'Junior', 2),
  ('mid', 'Mid', 'Mid', 3)
on conflict (slug) do nothing;

-- Row level security ---------------------------------------------------------

alter table public.categories enable row level security;
alter table public.questions enable row level security;

drop policy if exists "categories_select_authenticated" on public.categories;
create policy "categories_select_authenticated"
  on public.categories
  for select
  to authenticated
  using (true);

drop policy if exists "questions_select_authenticated" on public.questions;
create policy "questions_select_authenticated"
  on public.questions
  for select
  to authenticated
  using (true);

drop policy if exists "questions_insert_authenticated" on public.questions;
create policy "questions_insert_authenticated"
  on public.questions
  for insert
  to authenticated
  with check (true);

drop policy if exists "questions_update_authenticated" on public.questions;
create policy "questions_update_authenticated"
  on public.questions
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "questions_delete_authenticated" on public.questions;
create policy "questions_delete_authenticated"
  on public.questions
  for delete
  to authenticated
  using (true);

-- Public read (learn page): anonymous visitors can list categories and questions.
-- Run this block on existing projects that already applied the policies above.

drop policy if exists "categories_select_anon" on public.categories;
create policy "categories_select_anon"
  on public.categories
  for select
  to anon
  using (true);

drop policy if exists "questions_select_anon" on public.questions;
create policy "questions_select_anon"
  on public.questions
  for select
  to anon
  using (true);
