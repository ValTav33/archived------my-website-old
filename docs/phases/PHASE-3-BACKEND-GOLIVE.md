# PHASE 3 — Backend & Go-Live

**Branch:** `phase/3-backend`
**Depends on:** Phase 2 (`phase/2-multipage`, 14 commits) — **not yet merged**
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 8 slices + manual checks · **this is the LAUNCH phase**

> **This branch is stacked on `phase/2-multipage`, which is itself stacked on
> `phase/1-homepage`.** Three unmerged branches in a chain. The rebase order
> after the PRs merge is fixed, one step at a time:
>
> ```
> git rebase --onto main phase/1-homepage phase/2-multipage   # after PR 1
> git rebase --onto main phase/2-multipage phase/3-backend    # after PR 2
> ```
>
> Each is conflict-free for the same reason Phase 2's was: `main` is a direct
> ancestor of the branch below, so a squash merge leaves `main` with an
> identical tree and the replay has nothing to conflict with. The one file
> that will conflict is `PROGRESS.md`, because each closeout rewrites it.

> **`PROGRESS.md` is deliberately untouched by this spec's commit**, matching
> `a77f932` (Phase 1) and `5c17066` (Phase 2). S3.1's commit is the first one
> that moves the Phase 3 row.

---

## Objective

Playbook §3: *wire the form to Supabase + email. Analytics. Revise `/privacy`
in the same slice that wires delivery. Then ship.*
Exit gate: *a real submission lands in Supabase and in your inbox, **and**
`/privacy` describes what now happens to it.* **← LAUNCH**

Today a visitor fills six fields, reads «Θα επικοινωνήσουμε για την κλήση των
15 λεπτών και θα στείλουμε τη γραπτή σύνοψη εντός 24 ωρών», and the payload is
validated, handed to `deliverAuditRequest`, and **dropped**. Playbook §12 rates
this Severe and it is the only reason the site is live but not launched. Three
phases of work sit behind a form that keeps nothing.

Phase 3 closes exactly that, and nothing else. Every slice below is either the
lead path, the truth of `/privacy` about the lead path, or the go-live
checklist. Scroll reveals, the reduced-motion fix, the LCP work and the
evidence assets all stay where they are.

---

## What exists to build on

Read before writing a line — these were built to be extended by this phase and
the comments in them say so.

| File | What it already does |
|---|---|
| `app/api/audit/route.ts` | Origin allowlist (incl. `VERCEL_URL`), per-instance rate limiter, honeypot + timing gate, validation, `deliverAuditRequest` **stub** with both transports written out in a comment |
| `lib/audit.ts` | `AuditPayload`, `validateAuditPayload`, `looksAutomated`, `HONEYPOT_FIELD`, `MIN_SUBMIT_MS` — one validator, shared by form and route |
| `components/conversion/AuditForm.tsx` | Four states, client-side pre-validation with the same function, focus management, Greek error copy, a 502-ready error branch |
| `app/privacy/page.tsx` | Eight sections, every statement checked against code — **four of which this phase makes false** |
| `lib/site.ts` | `assertOrigin` — the pattern every new env var in this phase follows |

**The route's contract does not change.** `validate → deliver → respond` is
already the shape; this phase fills in `deliver` and adds `persist` behind it.

---

## The five decisions this phase has to make

Recorded with a recommendation so they are decided **once**, before a slice
touches them — the Phase 2 precedent, where D1–D3 were approved before S2.1
ran. D1, D2 and D5 are technical and reversible in one file each. **D3 and D4
are commitments Val makes to visitors and cannot be made by a session.**

### D1 — Email or database first · **recommendation: email is delivery, the database is the archive**

**The finding that forces this.** Val's Supabase organisation holds five
projects and **all five currently read `INACTIVE`** — the free tier pauses a
project after a week without traffic, and a paused project rejects writes. A
marketing site that receives a handful of leads a month is exactly the traffic
profile that pauses. Wiring the visitor's success response to an insert means
the form starts failing in week two, silently, for the same reason it works in
week one.

So the order inside the route is fixed:

```
origin → honeypot/timing → validate → rate limit → EMAIL → persist → respond
```

- **Email failing is a failed submission.** Return 502, store nothing. The
  visitor sees the Greek retry-or-call message the form already renders, and a
  retry creates no duplicate row because there is no row yet.
- **Persistence failing is not.** Return success, log the failure without the
  payload. Val has the lead in his inbox; the archive is lossy and says so.

Degradation runs in one direction only: the lead can lose its archive copy, it
can never lose its delivery. S3.6 adds a daily cron that keeps the project
awake, so the paused-project case should not arise — but the ordering holds
even when it does.

### D2 — Supabase access: PostgREST over `fetch`, or `@supabase/supabase-js` · **recommendation: `fetch`**

Two queries exist in this whole phase: one insert, one count. The SDK pulls
auth, realtime and storage to serve them, becomes a monthly `npm outdated` row
under §13, and hides a plain HTTP call behind a client whose errors we would
have to scrub anyway (see the PII rule below). PostgREST's insert contract is
stable and documented, the route is server-only so nothing reaches the browser
bundle, and the whole wrapper is under forty lines in one file.

**Reversible:** if it ever needs the SDK, `lib/leads.ts` is the only file that
changes. §2.5 locks *Supabase*, the product — it does not name a client.

### D3 — Retention: how long a lead is kept · **recommendation: 24 months, and enforce it**

`/privacy` cannot state a retention period the site does not enforce — that is
§8 with consequences off the website. So the number and its enforcement land
together, or neither does.

24 months: long enough that a prospect who comes back in a year is recognised,
short enough to be a real limit. Enforced by the S3.6 cron, which deletes rows
past it — the same cron whose write keeps the project from pausing. One
mechanism, two reasons.

**Val's to approve.** A different number is a one-line change in one file; a
number nobody enforces is not on the table.

### D4 — Analytics: yes or no · **recommendation: yes, Vercel Analytics** — V8

§2.5 names Vercel Analytics as cookieless and needing no consent banner, and
§13's weekly cadence says *skim Vercel Analytics for the top entry page* — a
cadence that currently describes a tool that is not installed.

Two honest costs: it adds a processor to `/privacy`, and it adds a deferred
script to every page while Phase 4's budget is Perf ≥ 95 and `/` currently
measures 93. So S3.7 measures Lighthouse before and after and **writes both
numbers down**, rather than handing Phase 4 an unexplained point.

**Val's to decide.** If the answer is no, S3.7 is dropped from the phase, not
faked, and `/privacy` keeps saying there is no analytics — which stays true.

### D5 — Transport: Resend, not n8n · **recommendation: Resend, single path** — V7

The stub's comment offers both. Pick one:

- **Resend** is one HTTPS POST from the route to a mail API. One hop, nothing
  to keep alive.
- **n8n** puts a second always-on system between the form and the inbox. For a
  one-hop notification it adds a failure mode and buys nothing today.

Building both to "let the configured one win" was considered and rejected: the
unconfigured path would ship having never run once, and the exit gate can only
exercise the one with a credential.

**Two consequences worth stating before S3.3, not after:**

1. **No visitor confirmation email in this phase.** Sending *to* the visitor
   needs a verified sending domain (DNS records on `tavlikossystems.com`).
   Sending *to Val's own account address* does not. Keeping the launch off the
   DNS critical path is worth more than a second confirmation the success card
   already gives. Domain verification is logged as a Val action and recommended
   for deliverability, but it does not block the phase.
2. **The moment S3.3 merges without a key, the form starts telling visitors to
   call instead of promising 24 hours.** That is the correct failure — it is
   honest where today's silent success is not — but it means the key has to
   exist before this branch reaches production. There is no fallback that makes
   a missing transport look like a working one.

**Swap point if Val prefers n8n:** `deliver()` in `lib/notify.ts`, one
function, one env var.

---

## The rule every slice in this phase follows

### `/privacy` is revised in the same commit, every time

§3 says *revise `/privacy` in the same slice that wires delivery*. Delivery is
not one slice here — it is email (S3.3), storage (S3.4), the IP counter (S3.5)
and possibly analytics (S3.7), and each of those falsifies a different sentence
on that page. So the rule is stronger than the playbook's wording and satisfies
it strictly:

> **Any slice that changes what happens to a submission edits
> `app/privacy/page.tsx` in the same commit, and bumps `UPDATED`.**

The four statements currently on the page that this phase falsifies:

| Today's claim | Falsified by |
|---|---|
| «Δεν αποθηκεύονται σε βάση δεδομένων» | S3.4 |
| «Το ονοματεπώνυμο, το email και το τηλέφωνό σας δεν καταγράφονται πουθενά» | S3.3 — they go in an email, and that email sits in a mailbox |
| «Δεν υπάρχουν analytics… δεν αποθηκεύεται τίποτα στον browser σας» | S3.7, if D4 is yes |
| «Ο ιστότοπος φιλοξενείται στη Vercel… Κανένας άλλος» | S3.3 and S3.4 — Resend and Supabase are processors |

The page's own last section already promises this: *«Αν αρχίσουμε να
αποθηκεύουμε τα αιτήματα σε βάση δεδομένων… η σελίδα θα ενημερωθεί ώστε να το
λέει»*. Keeping that promise is a phase requirement, not a courtesy.

**Val re-reads `/privacy` before this PR merges.** D3 in the Phase 2 spec made
him read it once; this phase rewrites half of it.

### No PII in a log line — including error objects

The existing rule is that name, email and phone never reach a log line, because
Vercel logs are retained, searchable, and shared with anyone holding project
access. Two new ways to break it arrive with this phase, and both are the
default behaviour of the obvious code:

- `console.error("[audit] persist failed", error)` — a PostgREST error body
  can echo the row that failed to insert.
- The same for a mail API's 4xx response, which can echo the recipient and
  body it rejected.

**So:** every catch in this phase logs `status`, a short `code`/`message` and
nothing else, through one helper, and never the error object whole. The exit
gate verifies this by submitting a real lead and reading the deployment's
runtime logs — measured, not asserted.

### The IP is hashed, not stored

The shared rate limiter needs to recognise a repeat caller for one hour. It does
not need to know who they are. Rows hold `sha256(ip + AUDIT_IP_SALT)`, so the
counter works and the table holds no linkable identifier. An unsalted hash of
an IPv4 address is reversible by brute force in seconds, which is why the salt
is required rather than optional.

---

## Slices

### S3.1 — The env contract

**Why:** every slice after this one reads a secret, and the project has exactly
one precedent for how that is done: `lib/site.ts`, which throws a sentence
naming the variable because an entry whose key existed and whose value was
empty once killed a production build on a bare `TypeError: Invalid URL`. Four
more variables arrive in this phase. They get the same treatment, once, in one
place, before anything depends on them.

**Files:** `lib/env.ts` (new), `.env.example`

**Changes:**

1. `lib/env.ts` reads and validates the server-side secrets, and exports a
   **capability predicate per subsystem** — `MAIL_CONFIGURED`,
   `LEADS_CONFIGURED`, `CRON_CONFIGURED` — rather than raw strings scattered
   through the route.
2. **Missing is not fatal; malformed is.** The site must still build and deploy
   with no secrets at all, because it does today and because a preview without
   them must not fail to build. But a `SUPABASE_URL` that is not a URL, or a
   key that is an empty string, throws at first read with a sentence naming the
   variable — the `assertOrigin` lesson, applied to four more names.
3. Server-only. No `NEXT_PUBLIC_` prefix on any of them; a service-role key in
   a client bundle is the single worst outcome available in this phase.
4. `.env.example` documents every variable: what it is, where it comes from,
   which Vercel environments need it, and what breaks without it.

**Verify:** `tsc`, `lint`, `build` clean with an empty `.env.local` beyond
`NEXT_PUBLIC_SITE_URL`. Each predicate false. Then a deliberately malformed
value for each variable, one at a time, and confirm the thrown message names it.
`grep -rn "SUPABASE\|RESEND\|AUDIT_IP_SALT\|CRON_SECRET" app components` returns
nothing outside `lib/` and the API route.

**Commit:** `feat(config): add the server env contract for phase 3`

---

### S3.2 — The leads schema, as a committed migration

**Why:** the table is part of the repository, not a thing that was clicked in a
dashboard once and is now undocumented. A schema nobody can rebuild from the
repo is the same class of problem as the handover document this playbook
replaced.

**Files:** `supabase/migrations/0001_audit_requests.sql` (new),
`supabase/README.md` (new), `lib/leads.ts` (types only in this slice)

**Changes:**

1. `public.audit_requests` — `id uuid`, `created_at timestamptz`, the six form
   fields (`website` and `brief` nullable, the rest `not null`), plus
   `environment text not null` so a preview submission is never confused with a
   real lead. No `delivered` column: under D1 a row only exists if the email
   already went out.
2. `public.audit_rate_limit` — `ip_hash text`, `environment text`,
   `created_at timestamptz`, with an index on `(ip_hash, environment,
   created_at desc)`. No raw IP column exists, so one cannot be filled in later
   by accident.
3. **RLS enabled on both tables with zero policies.** Anon and authenticated
   therefore have no access at all; the service role bypasses RLS and is the
   only way in. This is the property that makes a `SUPABASE_SERVICE_ROLE_KEY`
   in the route safe and a leaked anon key boring.
4. Row types in `lib/leads.ts`, hand-written from the migration and derived from
   `AuditPayload` where the shapes overlap, so a field added to the form without
   a column is a type error.
5. `supabase/README.md`: how to apply the migration (dashboard SQL editor or
   CLI), the region to create the project in, and why the region is not a
   preference — see below.

**Region: `eu-central-1` (Frankfurt).** Leads are personal data from Greek
businesses; keeping them in the EU keeps the privacy page's processor section
short and true. It also matches every existing project in Val's organisation.

**Verify:** the SQL applies cleanly to a fresh database and is idempotent on
re-run where it can be (`create table if not exists` is not used — a migration
that silently does nothing is worse than one that errors). `tsc` clean. No
runtime code reads the tables yet, so nothing to exercise; this slice is a
schema and a contract.

**Commit:** `feat(data): add the audit_requests schema as a migration`

---

### S3.3 — Email delivery, and the first `/privacy` revision · **the launch gate**

**Why:** this is the slice the whole programme has been waiting for. After it,
a submitted form reaches a human.

**Files:** `lib/notify.ts` (new), `app/api/audit/route.ts`,
`app/privacy/page.tsx`

**Changes:**

1. `lib/notify.ts` — `deliver(payload)`: one POST to the mail API, `from` the
   account address, `to` `SITE.email`, subject naming the intent so the inbox
   is sortable, and a plain-text body carrying **every** field, so Val can reply
   from a phone without opening anything else. Plain text, not HTML: it renders
   everywhere, it cannot leak a tracking pixel into a message about privacy,
   and Greek needs no markup to be legible.
2. `deliverAuditRequest` in the route calls it. The stub's `console.info` of
   non-identifying metadata **stays** — it is the only trace of a submission
   that is safe to keep, and it is how the exit gate proves a request arrived
   without proving who sent it.
3. **No transport configured → the delivery throws → the route returns 502**
   and the form shows the retry-or-call message. Explicitly not a silent
   success (today's behaviour) and explicitly not a fallback that pretends.
4. All error logging goes through the scrubbing helper from the PII rule above.
5. `/privacy` revised in this commit: the request is now sent by email to a
   mailbox and the mail provider is named as a processor, «Κανένας άλλος»
   becomes a real list, and the claim that the three identifying fields are
   «δεν καταγράφονται πουθενά» narrows to what stays true — they are not
   written to server logs. `UPDATED` bumped.

**Verify:** a real submission from a deployed URL lands in Val's inbox with all
six fields intact and Greek unmangled (this needs V7's credential). A submission
with a deliberately broken key returns 502, shows the Greek message, and logs a
status code with no payload. The honeypot and the sub-2.5s timing path still
return 200 and send nothing. Runtime logs read after a real submission contain
no name, email or phone.

**Commit:** `feat(api): deliver audit requests by email`

---

### S3.4 — Lead persistence, and the second `/privacy` revision

**Why:** the exit gate names Supabase, and an inbox is not an archive — a
deleted mail is a deleted lead.

**Files:** `lib/leads.ts`, `app/api/audit/route.ts`, `app/privacy/page.tsx`

**Changes:**

1. `insertLead(payload)` — one PostgREST POST with the service-role key
   (D2), `Prefer: return=minimal` so the response body never echoes the row
   back into our error paths, and `environment` stamped from `VERCEL_ENV`.
2. Called **after** `deliver` succeeds (D1), inside its own try/catch. A
   failure logs a status code and returns success to the visitor.
3. `/privacy` revised in this commit: leads **are** stored, in a database, in
   the EU, with the retention period from D3 and how it is enforced, and the
   database provider named as a processor. The page's own «Αν αλλάξει κάτι»
   promise is what this satisfies. `UPDATED` bumped.

**Verify:** a real submission produces exactly one row with all fields intact
and Greek unmangled; `environment` reads `preview` on a preview. A submission
with a deliberately broken Supabase key still delivers the email and still
returns success, with a scrubbed log line — the D1 property, tested rather than
assumed. A submission from the honeypot path writes no row.

**Commit:** `feat(api): archive audit requests in supabase`

---

### S3.5 — The shared rate limiter

**Why:** closes three Backlog rows at once, all logged in S0.6 and at Phase 2's
exit gate: the counter lives in one instance's memory, preview traffic shares
production's limit, and a failed submission consumes a slot.

**Files:** `app/api/audit/route.ts`, `lib/leads.ts`, `app/privacy/page.tsx`

**Changes:**

1. The in-memory `Map`, `sweep`, and `isRateLimited` are **deleted**, not kept
   alongside. Its own comment calls it a speed bump; two limiters with different
   scopes is a thing nobody can reason about later.
2. The counter is a count of rows in `audit_rate_limit` for this `ip_hash` and
   `environment` inside the window, so it is shared across instances and keyed
   per environment — preview abuse cannot lock production out.
3. **Counted after validation**, so a mistyped email no longer costs a slot.
4. **Fails open.** If the count query fails, the submission proceeds. The
   honeypot, the timing gate and the origin check all still run, and losing a
   real lead to protect against a hypothetical bot is the wrong trade in a phase
   whose whole purpose is to stop losing leads. Logged when it happens.
5. `/privacy` revised in this commit: the IP is no longer «στη μνήμη του
   διακομιστή» — it is a salted hash in a database row, for one hour, and the
   page says so plainly. `UPDATED` bumped.

**Verify:** six submissions inside the window from one origin — the sixth
returns 429 with the Greek message. The counter survives a redeploy, which is
the property the old one did not have. A failed validation does not increment.
The table contains no value resembling an IP address.

**Commit:** `refactor(api): move the rate limiter to supabase`

---

### S3.6 — The daily cron: retention and keepalive

**Why:** two things that have to be true and are not: the retention period in
D3 has to be enforced or `/privacy` is lying, and the project has to stay awake
or S3.4 stops working in week two (D1's finding).

**Files:** `app/api/cron/maintenance/route.ts` (new), `vercel.json` (new),
`lib/leads.ts`

**Changes:**

1. One scheduled route, once a day (the Hobby plan's cron ceiling), which
   deletes `audit_requests` past the retention period and `audit_rate_limit`
   rows older than the window.
2. **That delete is also the keepalive.** A daily write is what stops the free
   tier pausing the project. One mechanism for both, so neither can be removed
   without the other becoming visible.
3. Authenticated with `CRON_SECRET`: a bearer token Vercel sends on scheduled
   invocations. Any unauthenticated request gets a 401 — this route deletes
   rows, and a public deletion endpoint is not a thing this site ships.
4. Returns counts, never rows. Logs counts, never rows.

**Verify:** an unauthenticated request returns 401. A request with the secret
returns the counts. Rows seeded past the boundary are deleted and rows inside it
are not — tested on both tables, at the boundary, not just far from it.

**Commit:** `feat(api): add the daily retention and keepalive job`

---

### S3.7 — Analytics · **gated on D4 / V8**

**Why:** §13's weekly cadence describes reading Vercel Analytics. Either that
becomes possible or the cadence gets corrected — one of the two, not neither.

**Files:** `app/layout.tsx`, `app/privacy/page.tsx`, `package.json`

**Changes:**

1. `@vercel/analytics` in the root layout. Nothing else — no custom events, no
   goals, no second provider.
2. `/privacy` revised in this commit: what it measures, that it sets no cookie
   and identifies no visitor, why there is still no consent banner, and the
   provider named. If the wording cannot be made both true and short, that is a
   signal about the tool, not about the wording. `UPDATED` bumped.
3. **Lighthouse mobile on `/` before and after, both numbers into
   `PROGRESS.md`.** `/` measures 93 against Phase 4's budget of 95; this phase
   does not get to make that worse without recording it.

**If D4 is no:** this slice is dropped, `PROGRESS.md` records that it was
dropped and why, and playbook §13's weekly line gets corrected in the closeout.
It does not sit as an unchecked box forever.

**Commit:** `feat(analytics): add vercel analytics`

---

### S3.8 — Closeout and go-live

**Why:** launch is a checklist, and the last three phases all proved that the
gap between "works on the branch" and "works on the deployment" is where this
project loses time.

**Files:** `PROGRESS.md`, `docs/PROJECT-PLAYBOOK.md`, `docs/VAL-ACTIONS.md`

**Changes:**

1. Full exit gate re-measured **on a deployment**, not localhost. Every number
   written into `PROGRESS.md` — counts and measurements, not adjectives.
2. Lighthouse mobile on `/`, `/websites`, `/contact` against the Phase 3+
   budget: Perf ≥ 95 · A11y 100 · BP 100 · SEO 100. **`/` currently measures 93
   on Performance.** If it still does, that is a Phase 4 Backlog row with a
   number attached and a stated reason — not a quietly lowered bar and not a
   number nobody wrote down.
3. `PROGRESS.md`: Phase 3 to done, the closed Backlog rows struck with the
   slice that closed them, D1–D5 copied into *Decisions changed since the
   playbook was written*.
4. Playbook edits this phase earns, each as a §14 decision-log row:
   - D1's ordering — email is delivery, the database is the archive — and the
     free-tier pausing finding behind it.
   - D3's retention number, with §2.2 gaining the retention commitment.
   - D4's outcome, and §2.5's Vercel Analytics line either confirmed or
     corrected.
   - D5's transport, and the visitor-confirmation email recorded as a non-goal
     rather than an omission.
5. `docs/VAL-ACTIONS.md`: V6, V7 and V8 move to the Done archive as they clear,
   and the go-live items are added with exact steps — production env vars for
   every environment, Search Console verification and sitemap submission, the
   `/privacy` re-read, and the first weekly lead-flow check from §13.
6. PR opened with the template below.

**Commit:** `docs(progress): close out phase 3 and record the decisions`

---

## Exit gate

Measured on a deployment, not a local `next start`. Val-owned rows are marked.

- [ ] **A real submission from the deployed URL lands in Val's inbox**, with all six fields intact, Greek unmangled, and the intent in the subject
- [ ] **The same submission is one row in `audit_requests`**, all fields intact, `environment` correct
- [ ] `/privacy` describes storage, every processor, the retention period and how it is enforced — and **every statement on the page is checked against the code**, the way the Phase 2 version was
- [ ] Runtime logs for that submission contain **no** name, email or phone — read, not assumed
- [ ] Broken mail credential → 502, Greek retry-or-call message, no row written, scrubbed log
- [ ] Broken database credential → email still delivered, visitor still sees success, scrubbed log (D1)
- [ ] Honeypot and sub-2.5s submissions → 200, no email, no row
- [ ] Sixth submission in the window → 429; the counter survives a redeploy
- [ ] A failed validation does not consume a rate-limit slot
- [ ] `audit_rate_limit` holds no value resembling an IP address
- [ ] RLS on both tables: the anon key can read nothing and write nothing — tested with the anon key, not inferred from the migration
- [ ] Cron route: 401 unauthenticated, correct counts authenticated, boundary rows handled correctly
- [ ] Analytics installed and `/privacy` names it — **or** D4 was no, and that is recorded with §13 corrected
- [ ] `grep -rn "TODO\|FIXME\|Placeholder" app components lib` returns nothing unexpected
- [ ] No `console.log`; every `console.error` in the lead path goes through the scrubber
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean
- [ ] Lighthouse mobile on `/`, `/websites`, `/contact`: Perf ≥ 95 · **A11y 100** · BP 100 · SEO 100 — or the shortfall recorded with a number and a reason
- [ ] Manual pass at 375 / 768 / 1024 / 1440 plus a real phone on `/contact` — **Val**
- [ ] Keyboard-only pass through the form to the success card — **Val**
- [ ] Val has re-read `/privacy` after the rewrite — **Val**
- [ ] Production `NEXT_PUBLIC_SITE_URL`, and every Phase 3 secret, set for Production **and** Preview — **Val**

### The measurement problem, for the fourth time

Phases 0, 1 and 2 all fell back to a local `next start` because Vercel
Deployment Protection answers anonymous requests with `<title>Login –
Vercel</title>`. This phase **cannot** fall back: "a real submission lands in
Supabase and in your inbox" is a claim about a deployment, and localhost cannot
make it. The origin allowlist already accounts for preview domains
(`VERCEL_URL`, `VERCEL_BRANCH_URL`), so the only thing in the way is the
protection setting.

**V3 is now blocking, not convenient.** Disable Deployment Protection for
previews or generate a bypass token before S3.3's verification.

---

## Explicitly NOT in this phase

A visitor confirmation email and sending-domain verification (D5 — needs DNS,
deliberately off the launch path) · n8n, CRM, or any second lead sink (D5) ·
an admin UI for reading leads — the inbox and the Supabase table editor are
the UI · lead scoring, enrichment, or auto-replies · scroll reveals, scroll-spy,
bento hierarchy, CI Lighthouse budgets and the mobile LCP work (Phase 4) · the
`prefers-reduced-motion` fix for Framer Motion, still a Phase 4 row affecting
three components · testimonials, screenshots, Val's photo (Phase 5) ·
`SERVICE_CATALOG`'s unshipped voice-agent claim, which is V10 and Phase 5 ·
`/en` (Phase 6) · `/blog` (Phase 7) · any palette, font or animation-library
change (§2.4, locked).

**The tempting one:** Server Actions. `PROGRESS.md` logs it as deferred rather
than rejected, and this is the phase that owns the form's server side. It stays
deferred. The route already carries the origin allowlist and the rate limiter,
Phase 0 built both deliberately, and swapping the transport mechanism in the
same phase that first makes the form actually work would mean a failed
submission has two candidate causes instead of one.

---

## UI UX Pro Max — allowed searches for this phase

Almost nothing here is UI. The form's states were designed in Phase 0 and
refined in Phase 1, and the only visual change this phase can earn is a copy
change on `/privacy`. If the skill is consulted at all, it is `--domain ux` on
form error and success states — advisory, playbook wins, and the five logged
rejections stay rejected.

---

## PR template

```markdown
## Phase 3 — Backend & Go-Live

The form keeps what people put in it. Email is the delivery, Supabase is the
archive, /privacy says so, and the site launches.

### Slices
- S3.1 The env contract
- S3.2 The audit_requests schema, as a migration
- S3.3 Email delivery + /privacy revision  ← the launch gate
- S3.4 Lead persistence + /privacy revision
- S3.5 Shared rate limiter (closes three Backlog rows)
- S3.6 Daily retention + keepalive cron
- S3.7 Analytics (or dropped, recorded)
- S3.8 Closeout and go-live

### Exit gate
- [ ] Real submission → Val's inbox, all six fields, Greek intact
- [ ] Same submission → one row in audit_requests
- [ ] /privacy describes storage, processors, retention and enforcement
- [ ] No PII in runtime logs, read from the deployment
- [ ] Broken mail key → 502, no row; broken DB key → email still sent
- [ ] Honeypot and timing paths → 200, nothing delivered, nothing stored
- [ ] Sixth submission → 429, counter survives a redeploy
- [ ] RLS verified with the anon key
- [ ] Cron: 401 unauthenticated, correct counts authenticated
- [ ] Lighthouse mobile: Perf >= 95 / A11y 100 / BP 100 / SEO 100, or recorded
- [ ] 375 / 768 / 1024 / 1440 + real phone + keyboard pass
- [ ] Val has re-read /privacy after the rewrite

### Deliberately not here
Visitor confirmation email and DNS verification · n8n and any second sink ·
admin UI for leads · Server Actions (still deferred, with a reason) ·
scroll reveals, reduced-motion fix, LCP work (4) · evidence assets (5) ·
English (6) · blog (7)
```
