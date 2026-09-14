-- ============================================================================
--  0001_audit_requests.sql
--
--  The lead archive, and the rate limiter's counter.
--
--  This file is the schema. Not the dashboard — a table that was clicked into
--  existence once and lives nowhere in the repository is the same class of
--  problem as the stale handover document this project's playbook replaced.
--
--  Apply it in Project Settings -> SQL Editor, or with the Supabase CLI. See
--  supabase/README.md.
--
--  DELIBERATELY NOT IDEMPOTENT. No `if not exists` anywhere: re-running this
--  should fail loudly on an already-migrated database rather than succeed
--  while doing nothing, because "it ran fine" is the most expensive possible
--  thing to be wrong about when the next migration assumes state.
-- ============================================================================


-- ----------------------------------------------------------------------------
--  audit_requests — one row per delivered audit request
--
--  Under D1 of the phase spec, the email is the delivery and this table is the
--  archive: a row exists only because a notification already went out. That is
--  why there is no `delivered` column and no queue. A submission whose email
--  failed produced a 502 and no row at all, so a retry is clean.
-- ----------------------------------------------------------------------------

create table public.audit_requests (
  id          uuid        primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  -- Which deployment this arrived from. Without it a preview test and a real
  -- lead are indistinguishable in the table.
  environment text        not null
    check (environment in ('production', 'preview', 'development')),

  -- The six form fields. The length bounds mirror lib/audit.ts exactly, so the
  -- database refuses what the validator refuses.
  --
  -- The tradeoff is worth stating: a constraint stricter than the app can
  -- reject a row the app was willing to write. Under D1 that costs an archive
  -- copy, never a lead — the email has already been delivered by the time this
  -- insert runs. Defence in depth is cheap when the failure mode is a logged
  -- miss.
  name        text        not null check (char_length(name) between 2 and 120),
  email       text        not null check (char_length(email) between 3 and 200),
  phone       text        not null check (char_length(phone) between 1 and 40),
  intent      text        not null check (char_length(intent) between 1 and 200),

  -- Both optional on the form. Empty is normalised to NULL on insert rather
  -- than stored as '', so "did not answer" has exactly one representation.
  website     text        check (website is null or char_length(website) <= 500),
  brief       text        check (brief is null or char_length(brief) <= 2000)
);

comment on table public.audit_requests is
  'Audit requests from the site form. Archive only - the email notification is the delivery. Retention is enforced by /api/cron/maintenance.';

comment on column public.audit_requests.environment is
  'production | preview | development, from VERCEL_ENV. Preview rows are tests.';

-- Serves both readers: the retention sweep (`created_at < now() - interval`)
-- and any hand-written "newest leads first" query in the table editor.
create index audit_requests_created_at_idx
  on public.audit_requests (created_at desc);


-- ----------------------------------------------------------------------------
--  audit_rate_limit — the shared submission counter
--
--  Replaces the in-memory Map in app/api/audit/route.ts, which lived in one
--  serverless instance's memory, was not shared between instances, and reset
--  whenever an instance recycled. Three Backlog rows, logged in S0.6 and at
--  Phase 2's exit gate, close here.
-- ----------------------------------------------------------------------------

create table public.audit_rate_limit (
  id          bigint      generated always as identity primary key,

  -- sha256(ip + AUDIT_IP_SALT), lowercase hex.
  --
  -- THE CHECK CONSTRAINT IS THE POINT. The limiter needs to recognise a repeat
  -- caller for one hour; it does not need to know who they are. This column
  -- accepts a 64-character hex digest and nothing else, so storing a raw IP
  -- address here is not a thing that can be done by mistake later — it is
  -- rejected by the database, not merely discouraged by a comment.
  --
  -- The salt is required (see lib/env.ts): an unsalted hash of an IPv4 address
  -- has four billion candidates and is reversible in seconds, which is a
  -- stored IP address with extra steps.
  ip_hash     text        not null check (ip_hash ~ '^[0-9a-f]{64}$'),

  environment text        not null
    check (environment in ('production', 'preview', 'development')),

  created_at  timestamptz not null default now()
);

comment on table public.audit_rate_limit is
  'Submission counter. Holds salted IP hashes for one hour; pruned by /api/cron/maintenance.';

-- Exactly the limiter's query shape: count rows for this hash, in this
-- environment, inside the window. Environment is in the key so preview abuse
-- cannot lock production out.
create index audit_rate_limit_lookup_idx
  on public.audit_rate_limit (ip_hash, environment, created_at desc);


-- ----------------------------------------------------------------------------
--  Access: service role only
--
--  Row-level security enabled, ZERO policies written. With RLS on and no
--  policy, `anon` and `authenticated` match no rows for any operation; the
--  service role bypasses RLS entirely and is the only way in.
--
--  This is the property that makes SUPABASE_SERVICE_ROLE_KEY in a route
--  handler safe and a leaked publishable key boring. Both tables hold personal
--  data and neither has any reason to be readable from a browser, ever.
--
--  The REVOKE is belt and braces. Supabase's default privileges grant `anon`
--  and `authenticated` table-level access in the public schema; RLS already
--  makes that access match nothing, so this is a second independent failure
--  required before a row is exposed rather than a single one.
-- ----------------------------------------------------------------------------

alter table public.audit_requests   enable row level security;
alter table public.audit_rate_limit enable row level security;

revoke all on public.audit_requests   from anon, authenticated;
revoke all on public.audit_rate_limit from anon, authenticated;
