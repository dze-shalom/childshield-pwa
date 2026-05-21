-- Run this in Supabase SQL Editor

alter table public.alerts add column if not exists resolved_at timestamptz;
