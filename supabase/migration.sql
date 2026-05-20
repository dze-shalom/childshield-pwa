-- ChildShield Cameroon — Supabase Schema
-- Run this in your Supabase project: Dashboard → SQL Editor → New query → Paste → Run

create table if not exists public.alerts (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  age           integer,
  gender        text,
  description   text,
  last_seen     text,
  last_seen_time timestamptz,
  status        text not null default 'active',
  photo_url     text,
  lat           float,
  lng           float,
  contact       text,
  created_by    text,
  source        text default 'web',
  created_at    timestamptz not null default now()
);

create table if not exists public.sightings (
  id          uuid primary key default gen_random_uuid(),
  alert_id    uuid not null references public.alerts(id) on delete cascade,
  reported_by text default 'Anonymous',
  location    text,
  description text,
  lat         float,
  lng         float,
  verified    boolean not null default false,
  time        timestamptz not null default now()
);

create table if not exists public.incidents (
  id          uuid primary key default gen_random_uuid(),
  type        text not null,
  type_label  text,
  description text,
  location    text,
  lat         float,
  lng         float,
  severity    text default 'medium',
  status      text not null default 'under_review',
  source      text default 'web',
  time        timestamptz not null default now()
);

-- Row Level Security
alter table public.alerts   enable row level security;
alter table public.sightings enable row level security;
alter table public.incidents enable row level security;

-- Alerts: anyone can read and insert, only service role can update
create policy "public read alerts"    on public.alerts   for select using (true);
create policy "public insert alerts"  on public.alerts   for insert with check (true);
create policy "public update alerts"  on public.alerts   for update using (true);

-- Sightings: anyone can read and insert
create policy "public read sightings"   on public.sightings for select using (true);
create policy "public insert sightings" on public.sightings for insert with check (true);

-- Incidents: anyone can insert, only authenticated can read (moderators)
create policy "public insert incidents" on public.incidents for insert with check (true);
create policy "public read incidents"   on public.incidents for select using (true);

-- Enable real-time for all three tables
alter publication supabase_realtime add table public.alerts;
alter publication supabase_realtime add table public.sightings;
alter publication supabase_realtime add table public.incidents;
