-- Run this in Supabase SQL Editor after migration.sql

create table if not exists public.found_children (
  id            uuid primary key default gen_random_uuid(),
  description   text not null,
  age_estimate  text,
  gender        text,
  location      text not null,
  contact       text not null,
  photo_url     text,
  status        text not null default 'searching', -- searching | matched | resolved
  found_at      timestamptz not null default now()
);

alter table public.found_children enable row level security;

create policy "anyone can report found child"  on public.found_children for insert with check (true);
create policy "anyone can read found children" on public.found_children for select using (true);
create policy "anyone can update found child"  on public.found_children for update using (true);

alter publication supabase_realtime add table public.found_children;
