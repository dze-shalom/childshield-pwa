-- Add user_id to alerts so only the reporter can mark a child as found.
-- Nullable because alerts created before this migration (or via WhatsApp bot)
-- won't have an associated auth user.

alter table alerts
  add column if not exists user_id uuid references auth.users(id) on delete set null;

-- Index for fast ownership lookups (e.g. "show my alerts" view)
create index if not exists alerts_user_id_idx on alerts(user_id);
