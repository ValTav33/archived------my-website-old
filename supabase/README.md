# Supabase

The lead archive for `tavlikossystems.com`. Two tables, both written only by
`app/api/audit/route.ts` and `app/api/cron/maintenance/route.ts`, both
unreadable from a browser.

## Creating the project

**Region: `eu-central-1` (Frankfurt).** Not a preference. Leads are personal
data belonging to Greek businesses; keeping them in the EU is what lets
`/privacy` describe the processor in two sentences instead of explaining a
transfer mechanism. It also matches every existing project in the
organisation.

Free tier is fine for this volume, with one caveat that shaped the whole
phase — see *Pausing* below.

## Applying the migration

Either route works; the file is the same.

**Dashboard:** SQL Editor → paste `migrations/0001_audit_requests.sql` → Run.

**CLI:**

```bash
supabase link --project-ref <ref>
supabase db push
```

The migration is **deliberately not idempotent** — no `if not exists`
anywhere. Re-running it on a migrated database fails loudly instead of
succeeding while doing nothing, because "it ran fine" is the most expensive
thing to be wrong about when the next migration assumes state.

## Access model

Row-level security is enabled on both tables with **zero policies**. With RLS
on and no policy, `anon` and `authenticated` match no rows for any operation.
The service role bypasses RLS and is the only way in.

That is what makes `SUPABASE_SERVICE_ROLE_KEY` in a route handler safe, and a
leaked publishable key boring. It also means pasting the publishable key into
`SUPABASE_SERVICE_ROLE_KEY` fails as **silence** rather than as an error —
`lib/env.ts` detects and rejects that specific mistake at config time for
exactly this reason.

Neither table has any reason to be readable from a browser, ever. If a future
phase needs one to be, that is a policy written deliberately in a migration,
not a grant loosened in the dashboard.

## Pausing — the constraint that shaped the lead path

**The free tier pauses a project after about a week without traffic, and a
paused project rejects writes.** Every project in this organisation was
`INACTIVE` when Phase 3 was specced, for exactly that reason.

A marketing site receiving a handful of leads a month has precisely the
traffic profile that pauses. So:

1. **The email is the delivery; this database is the archive** (D1 in the
   phase spec). A visitor's success response never depends on an insert. A
   failed insert is a logged miss; a failed email is a 502 and no row.
2. **`/api/cron/maintenance` runs daily and writes**, which is what keeps the
   project awake. It is also what enforces the retention period, so the
   keepalive cannot be removed without the retention promise on `/privacy`
   visibly breaking at the same time.

## Retention

Enforced by the daily cron, not by a comment. `/privacy` states the period, so
the deletion has to be real — a stated retention nobody enforces is the one
kind of content error on this site with consequences off it.

## Reading leads

The inbox is the working surface. This table is the archive — open the
dashboard's table editor when you need history, filtered to
`environment = 'production'` so preview tests stay out of the way.

There is deliberately no admin UI. One did not exist at launch and building
one before there are leads to read would be the wrong order.
