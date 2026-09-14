# PROGRESS

> Single source of truth for **where the project is right now**.
> Rules for updating this file: `docs/PROJECT-PLAYBOOK.md` §7.
> Updated in the same commit as the slice it describes — never separately.
>
> **Anything that needs Val personally lives in `docs/VAL-ACTIONS.md`**, with
> the exact steps, not here. This file records state; that one is the work
> queue. A slice that creates or clears a Val-owned item updates it in the
> same commit.

**Current phase:** 3 — Backend & Go-Live · **the launch phase**
**Branch:** `phase/3-backend` — **stacked on `phase/2-multipage`, which is stacked on `phase/1-homepage`**
**Spec:** `docs/phases/PHASE-3-BACKEND-GOLIVE.md`
**Last slice:** S3.4 · 2026-09-14 · lead persistence
**Blocked on:** **V6 and V7 in `docs/VAL-ACTIONS.md`** — a Supabase project and a Resend key. S3.1 and S3.2 need neither and are being built now; S3.3 onward cannot be verified end to end without them, and S3.3 is the launch gate. **V3 (Vercel Deployment Protection) is now blocking rather than convenient:** this phase's exit gate is a claim about a deployment, and localhost cannot make it for the fourth phase running.

> **Phase 1 is code-complete and unmerged.** Every measurable gate is met and
> the branch is pushed; what remains is the phone pass, the keyboard pass and
> opening + squash-merging the PR — all Val's. Phase 2 started on a branch
> stacked on Phase 1 rather than waiting. After Phase 1 merges, rebase:
> `git rebase --onto main phase/1-homepage phase/2-multipage`. `main` is a
> direct ancestor of `phase/1-homepage`, so the squash merge leaves `main`
> with an identical tree and the replay conflicts with nothing, at any point
> in the phase.

> **Phase order settled 2026-09-11.** Val chose Phase 1 over jumping to
> Phase 3. The question is closed; do not re-raise it.

> **`deliverAuditRequest` is no longer a stub.** S3.3 wired it to a real mail
> transport, so the form no longer validates a submission and discards it —
> the risk playbook §12 rates Severe is closed *in code*. What is not yet
> proven is the thing the exit gate asks for: **no submission has ever landed
> in an inbox**, because there is no Resend key (V7).
>
> **A consequence to understand before this branch reaches production.** With
> no key configured, a correctly filled form now returns 502 and tells the
> visitor to call instead of promising 24 hours. That is deliberate — it is
> the honest failure, chosen over a fallback that makes a missing transport
> look like a working one (D5) — but it means the key has to exist *before*
> the merge, not after. Today's silent false success is worse; a loud honest
> failure on the live site is still not something to ship on purpose.

---

## Phase 3 — Backend & Go-Live 🚧 IN PROGRESS · **the launch phase**

Wire the form to email and Supabase, revise `/privacy` in the same commit as
every slice that changes what happens to a submission, decide analytics, and
ship. Playbook §3's exit gate: *a real submission lands in Supabase and in
your inbox, **and** `/privacy` describes what now happens to it.*
Spec: `docs/phases/PHASE-3-BACKEND-GOLIVE.md`.

**D1–D5 recorded in the spec before any slice ran**, per the Phase 2
precedent. **D3 (retention period) and D4 (analytics yes/no) are commitments
to visitors and are Val's to approve** — see *Decisions changed* at the bottom
of this file once they are settled.

- [x] **S3.1** The env contract · 2026-09-14
- [x] **S3.2** The `audit_requests` schema, as a committed migration · 2026-09-14 · **applied and verified**
- [x] **S3.3** Email delivery + `/privacy` revision · 2026-09-14 · **← the launch gate** · code complete, **no inbox test yet (V7)**
- [x] **S3.4** Lead persistence + `/privacy` revision · 2026-09-14
- [ ] **S3.5** The shared rate limiter · closes three Backlog rows · needs V6
- [ ] **S3.6** Daily retention + keepalive cron · needs V6, D3
- [ ] **S3.7** Analytics · gated on D4 / V8
- [ ] **S3.8** Closeout and go-live

**S3.1.** `lib/env.ts` is the only reader of a Phase 3 secret, and
`.env.example` documents all five. Two rules, pulling opposite ways on
purpose: **missing is not fatal** — the site still builds and deploys with no
secrets at all, and the subsystem behind an absent value turns itself off —
while **malformed is fatal**, naming the variable, because `lib/site.ts`
already carries the scar of an empty-valued Vercel entry killing a production
build on a bare `TypeError: Invalid URL`.

*The stated principle is **reject only what is provably wrong; never require a
format**.* So the checks refuse an empty string, whitespace inside a
credential, a non-URL, `http`, and a Supabase **publishable** key handed over
where the service-role key belongs — but they do not assert that a Resend key
starts with `re_` or that a Supabase host ends in `.supabase.co`, because a
provider renaming its own prefix should not break a deploy holding a good
credential.

The publishable-key check is the one worth the code. That key sits next to the
right one in the dashboard, it is the one every tutorial pastes, and with RLS
enabled and zero policies it fails as *silence* — a permission error at insert
time, long after the configuration was declared fine. Both shapes are
detected: the current `sb_publishable_…` prefix, and the legacy JWT whose
payload carries `"role":"anon"`.

*Two defects the verification found, neither visible by reading the file.*
Twenty-one env permutations were compiled and run against the module, and the
table is why:

1. **The sender validator rejected the exact value `.env.example` tells Val to
   use.** One regex tried to accept both `name@domain` and
   `Name <name@domain>` and accepted only the first, so
   `Tavlikos Systems <info@tavlikossystems.com>` threw. A validator that
   refuses its own documented value is worse than no validator. Split into two
   checks.
2. **The whitespace guard does not do what its comment claimed.** It was
   documented as catching a key pasted with its trailing newline; `optional`
   trims first, so the newline never reaches it. The trim is the better
   behaviour — the credential is right and only the copy was untidy — so the
   comment was corrected rather than the code.

`AUDIT_IP_SALT` is required as soon as `SUPABASE_URL` is set, rather than
being its own capability. The alternative is a rate-limit table full of
unsalted hashes of IPv4 addresses — four billion candidates, reversible in
seconds, which is a stored IP address with extra steps. One missing variable
that stops the build beats a privacy claim the table quietly contradicts.

`CRON_SECRET` absent means the maintenance route refuses **every** request.
That route deletes rows; "the secret is not set yet" is exactly when failing
open would publish a deletion endpoint.

**S3.2.** `supabase/migrations/0001_audit_requests.sql` — two tables,
`audit_requests` (the archive) and `audit_rate_limit` (the shared counter) —
plus `lib/leads.ts` for the row contract and `supabase/README.md` for the
access model, the region and the pausing constraint.

**Verified against a real database.** *This paragraph replaces the one
committed with S3.2, which recorded the migration as reviewed-but-unexecuted
because no project existed. Val approved creating it, so the verification the
slice was missing is now done and recorded here rather than left as a stale
caveat.*

The project is **`tavlikos-systems-website`, `eu-central-1` (Frankfurt), free
tier, €0/month** — created in Val's own organisation, which already held five
projects, all of them paused, which is the D1 finding in the first place. The
ref and keys are deliberately **not** in this repository: Val pastes
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` and `AUDIT_IP_SALT` into
`.env.local` and Vercel himself (V6), and no session has or needs the
service-role key.

Migration applied cleanly. Both tables report `rls_enabled: true`, zero
policies exist in `public`, and every check constraint is present in the
catalogue as written.

*Seven constraint probes, each asserting a refusal rather than a success,* run
inside a transaction that was rolled back so nothing was left behind:

| Probe | Result |
|---|---|
| `ip_hash` = `212.205.14.7` — a raw IP | **rejected** |
| `ip_hash` = an **uppercase** sha256 digest | **rejected** |
| `ip_hash` = a well-formed lowercase digest | accepted |
| `environment` = `staging` | **rejected** |
| `name` = one character | **rejected** |
| `brief` = 2001 characters | **rejected** |
| A legitimate row with `NULL` website and brief | accepted |

The first one is the property worth having: a raw IP address in that column is
not discouraged by a comment, it is refused by the database.

*Access verified from outside, with both browser-safe key forms* — the legacy
`anon` JWT and the modern `sb_publishable_…` key — against the live REST
endpoint. `SELECT`, `INSERT` and `DELETE` on both tables, with both keys:
**eight of eight return `401` / `42501 permission denied`.** A request with no
key at all is refused earlier still.

Worth being precise about *which* mechanism answered, because the two were
claimed as independent: the hard `42501` comes from the **`revoke`**. RLS with
zero policies is the second, unexercised layer underneath — if the grants were
ever restored it would still match no rows. Two failures now stand between a
browser and a row.

Supabase's own security advisor reports exactly one finding, `INFO`-level
`rls_enabled_no_policy`, on both tables. **That is the design, not a defect.**
A future session should not "fix" it by writing a policy: the service role
bypasses RLS and is the only intended writer, and any policy added here widens
access to personal data for no caller that exists.

Three properties worth stating, because each replaces a comment with an
enforced constraint:

- **RLS enabled, zero policies, on both tables.** `anon` and `authenticated`
  therefore match no rows for any operation; the service role bypasses RLS and
  is the only way in. The `revoke` beside it is belt and braces — two
  independent failures now stand between a browser and a row instead of one.
- **`ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$')`.** There is no
  IP column, and the hash column *refuses* anything that is not a 64-character
  hex digest. Storing a raw IP address here is not discouraged by a comment,
  it is rejected by the database.
- **Length bounds mirror `lib/audit.ts` exactly.** The tradeoff is real: a
  constraint stricter than the app can refuse a row the app was willing to
  write. Under D1 that costs an archive copy and never a lead, because the
  email is already delivered by the time the insert runs.

**Deliberately not idempotent** — no `if not exists` anywhere. Re-running on a
migrated database should fail loudly rather than succeed while doing nothing;
"it ran fine" is the most expensive thing to be wrong about when the next
migration assumes state.

`lib/leads.ts` derives the insert shape from `AuditPayload` with a mapped type,
and its comment says plainly what that does **not** buy: TypeScript cannot see
the database, so nothing proves a column exists. What it proves is that a
field added to the form cannot reach an insert without this file failing to
compile — "you will be stopped and told to write a migration", not "the
migration was written".

**S3.3 — the slice three phases were waiting for.** `lib/notify.ts` sends the
request as plain-text email through Resend; `deliverAuditRequest` calls it;
`lib/logging.ts` is the failure logger; `/privacy` revised in the same commit.

**What is proven, measured on a local `next start` with ten probes:**

| Case | Result |
|---|---|
| Valid submission, **no** mail key | 502 · «Η αποστολή απέτυχε προσωρινά…» |
| Valid submission, **invalid** mail key | 502 · provider answered 401, logged as `status: 401` with an authored hint |
| Honeypot filled | 200, nothing sent |
| Submitted in 40 ms | 200, nothing sent |
| No `elapsedMs` at all | 200, nothing sent |
| Bad email | 422 with the per-field Greek message |
| Wrong `Origin` / no `Origin` | 403 |
| Malformed JSON | 400 |
| `GET` | 405 with `Allow: POST` |
| **Server log swept for the probe's name, email and phone** | **zero occurrences** |

**What is not proven:** that an email arrives. That needs V7's key, and it is
the exit gate's first line.

*The design decision worth recording.* `lib/logging.ts` does not scrub error
objects — **it makes logging one impossible.** `console.error("…", error)` on
a mail or PostgREST failure can echo the recipient and the rejected body into
a log line from code that looks careful, so no caller may pass an error
object: callers pass a stage, a reason from a fixed union, an HTTP status, and
a `hint` written in this repository. The cost is provider detail, and it is
smaller than it looks — for this API the status *is* the diagnosis (401 bad
key, 403 unverified sender, 422 rejected field), so that mapping lives on our
side of the boundary.

*A caught self-inflicted error, worth the line because it is the exact class
§8 exists to prevent.* The notification's closing line first read
«κλήση 15 λεπτών + γραπτή σύνοψη εντός 24 ωρών» — a **retyped paraphrase** of
the promise, under a comment claiming it was the shared constant. S1.7's exit
condition was that every surface interpolate `AUDIT_DELIVERABLE` character for
character. Now it does, so the notification quotes back the clock the visitor
actually read.

Two smaller decisions: the email carries `reply_to` set to the visitor's
address, so answering a lead is one tap rather than a copy-paste; and
`AUDIT_NOTIFY_TO` was added to the env contract because Resend refuses to
deliver anywhere except the account's own address until a sending domain is
verified — a hardcoded `SITE.email` would have failed with a 403 on the single
submission the exit gate cares about.

`/privacy` revision 1 of this phase: the request now arrives **as an email**
and is kept in a mailbox, Resend is named as a processor, and the deletion
sentence — which said a deletion request usually has nothing to delete — now
says what deletion actually means. One sentence was **narrowed rather than
deleted**: name, email and phone are still absent from the server logs, they
are in the email instead, and the page says exactly that. No database yet, so
«δεν αποθηκεύονται σε βάση δεδομένων» stays true for one more slice.

**S3.4.** `archiveLead` in `lib/leads.ts` writes the row over PostgREST (D2 —
no SDK for one insert and one count), called **after** the email and with its
failure caught at the route's call site rather than swallowed inside the
function. `Prefer: return=minimal` is there so the response cannot echo the
row back into reach of a future careless error handler.

*The HTTP contract was verified without touching the real tables' security.* A
throwaway `public._probe_http_contract` was created with the same column
shape and a permissive anon policy, the exact request `archiveLead` sends was
replayed against it, and the table was dropped:

| Check | Result |
|---|---|
| Insert with `Prefer: return=minimal` | **201**, `body_bytes=0`, `preference-applied: return=minimal` |
| A row violating a check constraint | **400**, `23514` — which is what `hintFor(400)` is written for |
| Greek and `NULL` round-tripped | «Γιώργος Δοκιμαστής» and `brief: null` came back byte-identical |
| After `drop table` | probe table 404s; `audit_requests` and `audit_rate_limit` still 401, zero policies, zero rows |

*And the failure paths were exercised directly,* by compiling the lead modules
standalone and calling `archiveLead`:

| Case | Result |
|---|---|
| No database configured | `archive` · `not-configured` · hint names `SUPABASE_URL` |
| Bogus service key against the real project | `archive` · `http-error` · **401** · hint names `SUPABASE_SERVICE_ROLE_KEY` |
| Unreachable host | `archive` · `network-error` |
| Every log line, in all three | stage, reason, status, hint — **no payload** |

**Not yet proven:** a successful insert through the route, because that needs
the service-role key, which no session has or should have. The insert's HTTP
contract is proven; the key that signs it is V6.

*One thing deliberately left undone.* `/privacy` now says a copy is stored in
a database in the EU and names Supabase, but **does not state a retention
period.** That lands in S3.6, in the same commit as the job that enforces it.
A period this page promises and nothing deletes is the one content error on
this site with consequences off it, and "the cron lands in twenty minutes" is
not a basis for writing it down early.

`/privacy` revision 2: «Δεν αποθηκεύονται σε βάση δεδομένων» is gone — the
sentence the page's own last section promised would change if this ever
happened. That last section now records that the promise was kept once, in
the past tense, rather than continuing to promise it in the future. The claim
that the table is unreachable from a browser is the measured one: eight of
eight `401 / 42501` with both browser-safe key forms.

---

## Phase 2 — Multipage & SEO ✅ CODE-COMPLETE · awaiting Val

Build the route tree in Playbook §2.3: two service pillars, the work index and
case studies, the deeper pages behind the homepage's sections, the legal pages,
and the SEO plumbing — sitemap, robots, favicon, OG cards, schema graph. Front
end only. Spec: `docs/phases/PHASE-2-MULTIPAGE-SEO.md`.

**D1, D2 and D3 approved by Val, 2026-09-12**, before any slice ran — see the
spec, and *Decisions changed* at the bottom of this file.

- [x] **S2.1** Route shell — layout chrome, route manifest, metadata builder · 2026-09-12
- [x] **S2.2** `/contact` · 2026-09-12
- [x] **S2.3** `/websites` — service pillar 1 · 2026-09-13
- [x] **S2.4** `/automations` — service pillar 2, and the shared service shell · 2026-09-13
- [x] **S2.5** `/work` and `/work/[slug]`, and the showcase's exit · 2026-09-13
- [x] **S2.6** `/process`, homepage section condensed · 2026-09-13
- [x] **S2.7** `/about` and the `Person` node · 2026-09-13
- [x] **S2.8** `/faq`, the `FAQPage` node, homepage subset · 2026-09-13
- [x] **S2.9** `/privacy` and `/terms` · 2026-09-13 · **Val must read both before merge (D3)**
- [x] **S2.10** Favicon, OG cards, 404 · 2026-09-13
- [x] **S2.11** Sitemap, robots, schema graph · 2026-09-13
- [x] **S2.12** Navigation and final assembly · 2026-09-13

**S2.1.** `Navbar`, `main#main-content` and `Footer` moved from
`app/page.tsx` into `app/layout.tsx`; `lib/routes.ts` is the route manifest and
`lib/seo.ts` the metadata builder.

*The defect this slice existed to prevent was measured, not predicted.* A
throwaway route with no `metadata` export of its own was added, built, and its
rendered HTML read `rel="canonical" href="…"` and `og:url` pointing at the
**homepage**, with the homepage's `<title>` — all three inherited from the root
layout, which declared them for a site that had exactly one page. Ten routes
land in this phase; every one of them would have told search engines it was
`/`, with nothing on screen to give it away. After the fix the same canary
renders **zero** canonical tags, **zero** `og:url`, **zero** descriptions and
the generic brand title. Absent is loud — Lighthouse fails a missing
description and a missing canonical self-resolves; inherited-and-wrong is
silent.

*A regression this slice shipped into a build and then caught.* **Next merges
metadata per top-level key and replaces the value; it does not deep-merge
`openGraph` or `twitter`.** The first version of `pageMetadata` returned
`openGraph: { url, title, description }`, which erased the layout's `og:type`,
`og:locale` and `og:site_name` from the document and downgraded
`twitter:card` from `summary_large_image` to bare `summary` — a share card
quietly demoted to a thumbnail. Caught by the head byte-diff, not by eye. Both
blocks now come back whole from `lib/seo.ts`, the layout declares neither, and
the spec carries this as a rule every remaining slice follows.

*Verified: the homepage did not move.* The built `index.html` was captured
before and after and compared as structure rather than bytes — **433 body tags
in each, zero differences.** The only head difference is the CSS chunk's
content-hash filename, which changes because the module graph moved. All
twelve head tags that carry meaning — title, description, canonical, four `og:`,
three `twitter:`, robots, googlebot — are byte-identical to the pre-slice
build. A `getBoundingClientRect` fingerprint of eleven elements agreed to the
pixel, document height 6221 → 6221, one `main`, one `h1`, seven `h2`s.

*Two deliberate deviations from the spec.*

1. **The `noindex`-on-preview guard was pulled forward from S2.11.** It stopped
   being a robots-slice concern and became a precondition the moment Vercel
   Authentication was queued for removal: `robots` was unconditionally
   `index, follow`, so an unprotected preview would be a crawlable duplicate
   of production, and this file already records one stale deployment that
   served placeholder copy while marked indexable. `IS_INDEXABLE` is a
   deny-list of `VERCEL_ENV` `"preview"` and `"development"` rather than a
   production allow-list, because `VERCEL_ENV` is undefined locally and a
   `noindex` firing on a local `next start` would fail this phase's own
   Lighthouse SEO gate — which is where every Lighthouse run so far has had
   to happen.
2. **`title.default` stays in the layout**, because Next's types require it
   alongside `template`. It is now a generic brand line rather than the
   homepage's keyword title, so a route that forgets its metadata renders
   something merely generic instead of impersonating the homepage. The
   homepage sets its title through `absolute`, which is why its rendered
   title is unchanged.

*The manifest holds one route.* Entries are added by the slice that adds the
`page.tsx`, never ahead of it — `app/sitemap.ts` reads this file in S2.11, and
an entry without a page is a 404 in the sitemap spending crawl budget on
nothing. Same discipline for fields: `nav`, `footer` and the sitemap weights
arrive with the slices that consume them, because a `priority` invented now
for a file written in S2.11 is a guess wearing the costume of a decision.

**S2.2.** `/contact` builds as a static route with the audit form and the
direct channels, reusing both components and changing neither's copy.

*S2.1's fix proving out on a real second route.* `/contact` renders
`canonical` and `og:url` as `…/contact` — not the homepage — with `og:type`,
`og:site_name` and `twitter:card` all intact, which is the og-replacement
regression staying fixed on a page that was not the one it was found on. Title
`Επικοινωνία & δωρεάν audit | Web Development & AI Automations` through the
layout's template; description interpolated from `AUDIT_DELIVERABLE` rather
than retyped, so the meta description cannot promise something the form does
not.

*The emphasis is reversed, the copy is not.* On the homepage the channels are
a narrow rail beside the form. Here they come first and full width — phone,
what you get, alternative channels in three columns — and the form follows at
a `max-w-3xl` measure. Someone who navigates to a contact page has already
decided to make contact and wants the fastest route; someone who reaches the
bottom of the homepage has just finished an argument. Same components, same
strings, `layout="rail" | "wide"`.

*Two refactors this needed, both recorded as deviations.*

1. **`SectionHeader` gains `titleAs`.** Every route in this phase needs an
   `h1`, and a page title is the same eyebrow-title-lede pattern at a
   different heading level — not a different pattern. A second near-identical
   `PageHeader` component would have broken §10.5 for one tag name. Note `as`
   controls the wrapper and `titleAs` the heading; they are independent.
2. **The conversion section's heading moved out of `DirectContactCard` into
   `ConversionSection`.** It was never the card's to own: it titles the whole
   section, its eyebrow carries the homepage's `05` numbering, and `/contact`
   needs its own `h1` above a differently-shaped block. The rail now returns a
   **fragment** and only the wide grid gets a wrapper — wrapping both would
   have left an unstyled `div` between the heading and the first card, which
   is where a `mt-8` quietly becomes a collapsed margin on a different
   element. No wrapper, no question to answer.

*Verified the homepage still does not move.* Body-tag diff against the
pre-S2.1 baseline: **432 tags against 433**, and the whole difference is the
one unstyled `div` that refactor removed, plus two class-order changes from
`cn` (`mt-8 p-5` → `p-5 mt-8`, `mt-6 space-y-2.5` → `space-y-2.5 mt-6`) —
same classes, same elements. The geometry fingerprint is unchanged from the
pre-S2.1 capture: all eleven elements to the pixel, document height 6221,
seven `h2`s, no skipped levels.

*`/contact` measured.* One `h1`; heading order h1 → h2 → h2 → h3 (footer) with
no skips. 27 interactive elements at 375px, **zero** under 44×44 once the two
deliberately-hidden elements are excluded (the `sr-only` skip link at 1×1
until focused, and the honeypot at `tabindex="-1"`) — the same two exclusions
S1.3 measured around. Zero horizontal overflow, zero text below 12px. Nav,
footer and skip-link landmark all present, which is S2.1's layout move working
on a route that is not the homepage.

*The form behaves.* Submitting empty on `/contact` marks four fields
`aria-invalid` and renders four Greek errors, with no navigation — identical to
the homepage. Delivery is still Phase 3's stub and the 24-hour promise stays
as written.

**S2.3.** `/websites`, the first service pillar, targeting §2.3's
«Κατασκευή ιστοσελίδων Θεσσαλονίκη». Six deliverable cards, who it is for,
how the engagement runs, what the client keeps, the WordPress objection, and a
CTA to `/contact`.

*§8.1 held, and it was measured rather than asserted.* Every number in the
rendered page text was extracted with its surrounding sentence and checked
against a source. **Twenty-one numbers, zero invented:** the phone, hours,
geo stamp and year come from `SITE` via the nav and footer chrome; `01`–`04`
are section eyebrow numbering, not claims; `15 λεπτών` and `24 ωρών` are
`AUDIT_DELIVERABLE`; `3 ημέρες έως 2 μήνες` is `TIMELINE_RANGE`, which is §2.2's
range and says so on the page («εύρος, όχι υπόσχεση»). No load time, no
Lighthouse score, no percentage, nothing about "χ% faster" — a performance
figure is worse than unverifiable, because it is true the day it is written
and false after one dependency bump, on a page nobody re-measures.

*Deviation from the spec, deliberate.* The spec asks for "how it runs (three
lines, linking `/process`)". It is **one sentence and a link** instead. Three
lines here would have been a fourth hand-typed copy of the three steps —
`ProcessSection` has them today and S2.6 moves them into `lib/process.ts` —
and D1's whole rule is that content lives in one place. The sentence
interpolates `AUDIT_DELIVERABLE` and `TIMELINE_RANGE` so neither promise is
retyped, and S2.6 has nothing to reconcile.

*The JSON-LD serializer was extracted, because a second emitter appeared.*
`lib/jsonld.ts` now owns the two escaping rules — `dangerouslySetInnerHTML`
rather than a JSX child, and `<` → `\u003c` so a closing script tag inside a
string cannot terminate the element — plus `SCHEMA_ID.business`, the `@id`
`JsonLd.tsx` has exposed since Phase 0 with a comment saying future nodes
would reference it. S2.3 is the first one that does. **Verified the business
payload did not change:** the node on `/` still parses with 19 keys, `@type`
`ProfessionalService`, `@id` `…/#business` and both trading windows intact.

*The `Service` node asserts nothing the page does not show.* `provider` is a
reference to the business `@id`, not a second copy of the name, address and
hours — search engines cross-check NAP and that is why `lib/site.ts` exists.
No `offers` and no `priceRange`: §2.2 puts the pricing *model* on the page and
never a figure. No `aggregateRating`: there are no reviews on the site until
Phase 5, and a rating in markup that a visitor cannot see is the exact
mismatch that earns a manual action. `/websites` renders two nodes — its
`Service` and the site-wide `ProfessionalService` from the layout.

*Measured.* One `h1` containing the keyword as a sentence rather than an
insertion; heading order h1 → h2 → h3×6 → h2×4 → h3×3 with no skips. Unique
title, description, canonical and `og:url`, all pointing at `/websites`. At
375px: 18 interactive elements, **zero** under 44×44 except the `sr-only`
skip link at 1×1 until focused, zero horizontal overflow, zero text below
12px. No raw hex, no raw `zinc-600/700/800`. Team-language sweep
(«ομάδα», «developers μας», «ειδικοί», «γραφείο μας», «founded») returns
nothing.

*Two links on this page 404 right now, on purpose.* `/process` and `/faq` are
written as the spec asks and confirmed returning 404 — they land in S2.6 and
S2.8. `/contact` and `/websites` return 200. Same reasoning as the navigation:
nothing reaches production until the phase PR merges, and S2.12's link audit
is the backstop.

*What S2.4 owes.* The spec says both pillars share one skeleton (§10.5 applies
to page shells). This page was built from primitives directly rather than
from a `ServicePage` shell, because generalising a layout from a single
example is how the wrong abstraction gets locked in. **S2.4 extracts the
shell once there are two real pages to generalise from** — it is that slice's
job, not a nice-to-have. *Done in S2.4; see below.*

**S2.4.** `/automations`, pillar 2, plus the shell extraction S2.3 deferred.

*The shell exists now, extracted from two real pages rather than invented
from one.* Six components, each with at least two live call sites:
`ArrowLink` (5 uses across the two pillars, two sizes), `PageShell` (3 —
both pillars and `/contact`, and it owns the top padding that keeps a page
out from under the fixed header), `ServiceSection` (9 — it derives
`aria-labelledby` and the heading `id` from one argument, which is the whole
reason it is a component rather than a snippet), `FeatureGrid` (2),
`BulletList` (2) and `ServiceCta` (2 — it interpolates `AUDIT_DELIVERABLE`
itself rather than taking it as a prop, because a prop there is an invitation
to pass a slightly different promise on the second page).

*The refactor is provably render-equivalent, which is the only reason a
refactor this size is safe in the same slice as a new page.* `/contact` and
the homepage came out **byte-identical** (166 and 432 body tags, zero
differences). `/websites` came out at 154 tags against 154, with differences
only in the order of class tokens inside `class` attributes — `cn` reorders
them. Eyeballing that is not proof, so the tag streams were re-diffed with
every `class` attribute's tokens sorted: **identical class sets on all 154
elements.** Attribute order does not affect the cascade, so the page renders
exactly as it did.

*§8.5 was the hard call on this page, and something is deliberately missing.*
There is **no voice or telephone automation** on `/automations`.
`SERVICE_CATALOG` lists "AI Concierge & Voice/Chat Agents" and the homepage
showcase carries an AI concierge architecture — but that one is explicitly
*indicative*, and no voice work has been delivered. A service page may
describe a service; it may not describe a capability that has never been
exercised. The six categories that shipped are the ones the BTL pipeline and
this site's own build actually cover. **The tension in `SERVICE_CATALOG` is
now a Backlog row rather than something fixed in passing** — it feeds
`knowsAbout` and the schema offer catalog, so changing it is a structured-data
decision, not a copy tweak.

*BTL is linked, not restated.* The evidence block renders the entry's name and
kind from `PROOF` and links to the case study; the summary sentence stays on
`/work/[slug]`, because D1's rule is that the deeper page expands and the
shallower one points. `lib/site.ts` gains a `slug` field and a `getProof`
lookup — pulled forward from S2.5 so this page could link type-safely instead
of hardcoding `/work/btl-industries` with no idea whether that path is real.
S2.5 generates the routes from the same field.

*Numbers, again traced rather than asserted.* Every number in the page body:
`01`–`05` section numbering, `15`/`24` from `AUDIT_DELIVERABLE`, `3`/`2` from
`TIMELINE_RANGE`, and one `8` inside the product name `n8n`. Zero invented
metrics — no volumes processed, no hours saved, no accuracy rate.

*Measured.* One `h1` carrying the keyword as a sentence; heading order
h1 → h2 → h3×6 → h2×5 → h3×3 with no skips. Unique title, description,
canonical and `og:url`. `Service` node with `serviceType`
`Business process automation` and `provider` referencing the business `@id`.
At 375px: 19 interactive elements, **zero** under 44×44 but the `sr-only`
skip link, zero horizontal overflow, zero text below 12px. No raw hex, no raw
`zinc-600/700/800`, no team language.

*Three links on this page 404 right now:* `/work/btl-industries` (S2.5),
`/process` (S2.6) and `/faq` (S2.8), all confirmed rather than assumed.
`/contact`, `/websites` and `/automations` return 200.

**S2.5.** `/work` lists the delivered work from `PROOF`; `/work/btl-industries`
is the first named case study; the showcase gained D2's exit.

*The §8.5 routing rule worked, and it cost a page.* `/work/[slug]` generates
only for entries with a `study` body, so **`/work/roz-inn` is a genuine 404** —
verified, along with `/work/does-not-exist`. roz-inn is a presentation site
with a gallery and a live URL, and the URL is better evidence than an internal
page repeating that sentence in more words; its booking build is in progress
and therefore absent rather than promised. On the index it is a row linking
out to `roz-inn.com`. BTL, which has something to say, gets the page. One
case study prerendered (`● /work/btl-industries`), which is the honest number.

*The BTL study says only what is known.* `problem` describes the **nature of
the work** rather than asserting a before-state: there is no documented record
of how BTL operated previously, and "they used to copy rows by hand" is an
invented premise, which §8.1 forbids exactly as much as an invented
percentage. `built` is the summary expanded into the six ordered steps the
pipeline runs, reusing the vocabulary from the homepage's architecture trace
that S1.10's closeout translated — a visitor who read the homepage recognises
the system instead of meeting a second description of it. Numbers on the page:
section eyebrows, the step markers `01`–`06`, and the two §2.2 constants.
**Zero outcome metrics and zero client quotes**, which is what the spec asks
of a case study.

*`Breadcrumbs` renders the visible trail and the `BreadcrumbList` payload from
one array*, deliberately in one component. A `BreadcrumbList` is meant to
describe a trail the page shows, and the exit gate requires every schema
string to be visible on its page — two components reading two arrays is how a
schema ends up describing a trail that was redesigned months ago.
**Verified they agree:** visible crumbs `Αρχική / Έργα / BTL Industries`,
schema `1:Αρχική 2:Έργα 3:BTL Industries`, `aria-current="page"` on the last.

*A real tap-target regression, found by measuring and fixed here.* The bare
monospace crumb links came out **43×16 and 29×16** at 375px — under the
playbook's 44×44 bar, which Phase 1 drove to zero exceptions site-wide. WCAG
2.2 does exempt links inside a sentence and a breadcrumb trail is arguably
that, but §6 makes 44 this project's own bar, and quietly spending Phase 1's
result on a nav strip is not a slice's call to make. `min-h-tap min-w-tap`
with centred text: now **55×44, 44×44 and 113×44**, and zero elements under
44 on the page but the `sr-only` skip link.

### D2 needed one amendment, and it is worth knowing about

D2 said the showcase's heading, eyebrow and framing stay untouched and the
section only gains an exit. One sentence had to change anyway: the lede ended
«Τα πρώτα ονομαστικά case studies προστίθενται σύντομα» — *the first named
case studies are being added soon.* The moment `/work` existed with a named
BTL study, that sentence was **false**, and it sat directly above a link to
the case studies it claimed were still coming.

It now reads «Τα ονομαστικά έργα που έχουν παραδοθεί είναι στα Έργα». The
§8.2 sentence that matters — «περιγράφουν συστήματα που κατασκευάζουμε — όχι
δημοσιευμένα έργα πελατών» — is untouched, as are the heading, the eyebrow
and the thirteen trace nodes. This is inside D2's intent rather than a
re-frame, but it is a change to copy D2 said would not change, so it is
recorded rather than absorbed.

*The homepage changed by exactly two links.* 432 → **440** body tags, and the
whole delta is the section-level `/work` link and the `lead-engine` card's
`/work/btl-industries` link — four tags each (anchor, svg, two paths).
Nothing else moved. The card link reads «Τρέχει σε πελάτη — δείτε το έργο»,
which is the only thing on that section telling a visitor one of the three
architectures is not hypothetical.

*Measured.* `/work`: one `h1`, h1 → h2×3 → h3×3, no skips. Case study: one
`h1`, h1 → h2×4 → h3×3, no skips, unique title
(`BTL Industries — Κατασκευαστής ιατροτεχνολογικού εξοπλισμού | …`), canonical
and `og:url` on `/work/btl-industries`. Both: zero horizontal overflow, zero
text below 12px, no raw hex, no raw `zinc-600/700/800`, no team language.
`/process` and `/faq` still 404, closed by S2.6 and S2.8.

**S2.6.** The three steps moved into `lib/process.ts`; `/process` renders the
expansion; the homepage section became the highlight D1 says it should be.

*D1 was verified, not assumed.* Every sentence on `/process` longer than 45
characters was extracted from the rendered `<main>` and searched for in the
homepage's rendered `<main>`: **20 sentences checked, 0 verbatim overlap.**
The two surfaces render disjoint halves of the same data — the homepage takes
`summary`, one sentence per step, and `/process` takes `detail`. A visitor who
reads both never reads the same sentence twice, which is the difference
between a deeper page and a second copy of a URL.

*The homepage actually got shorter, measured on the build output rather than
claimed.* The `#process` section: **716 characters of copy down to 624**, and
19 tags up to 23 — the four extra are the `ArrowLink` out (anchor, svg, two
paths). First time in the phase that the homepage lost content, which is the
intent: Phase 1 built that section at full length because there was nowhere
else to put it.

*The field this page exists for is `costsYou`.* Every process section on every
agency site says what the agency does; almost none say what the client has to
spend, which is the thing a prospect is actually trying to work out. It is
also the field most likely to grow an invented number — "about two hours a
week" is precisely what §8.1 exists to keep off a page — so it is qualitative
everywhere except the audit call, and that one is quantified only because §2.2
defines it. Numbers on `/process`: `3`/`2` from `TIMELINE_RANGE`, `01`–`03`
step eyebrows, `15`/`24` from `AUDIT_DELIVERABLE`. Nothing else.

*The Phase 1 property survived the extraction.* S1.7's exit condition was that
the audit description match the form's promise character for character. The
deliverable string was grepped across all seven built pages and is
**byte-identical on every one** — the summary interpolates the constant rather
than paraphrasing it, which was the temptation when the brief said "one line
per step".

*Measured.* `/process`: one `h1`; heading order h1 → h2×4 → h3×3, no skips;
12 `dt` / 12 `dd` (three steps × four fields) in a real definition list, which
is what four labelled facts about one thing are; unique title, description and
canonical. At 375px: 16 interactive elements, **zero** under 44×44 but the
`sr-only` skip link, zero horizontal overflow, zero text below 12px. Homepage
still one `h1` and seven `h2`s with no skips. No raw hex, no raw
`zinc-600/700/800`, no team language.

*`/process` now resolves*, which closes the forward links `/websites` and
`/automations` have been carrying since S2.3. `/faq` is the last one still
404, closed by S2.8.

**S2.7.** `/about` expands the homepage section, and the `Person` node finally
sits on the page it was always meant to sit on — `lib/site.ts` has carried
`SITE.person` since S1.8 with a comment saying Phase 2's `/about` would read
it.

*The §2.1 sweep is clean, and it was run against the rendered site rather
than the source.* Every banned construction from the playbook's voice
guardrail — «η ομάδα μας», «οι developers μας», «οι ειδικοί μας», «το γραφείο
μας», «η εταιρεία μας», «το τμήμα», "founded by", «συνιδρυτ», «το προσωπικό
μας» — grepped across **all eight built pages: zero hits on every one.** No
headcount anywhere, and no years-of-experience figure: the numbers on `/about`
are the trading hours from `SITE.hoursLong`, the two section eyebrows, and
`AUDIT_DELIVERABLE` in the CTA. Nothing else.

*D1 constrained the content here, not the layout.* The homepage already states
the name, the city, the hours, the two things we build, code ownership and
four refusals — so the question was what was left to say. The answer is what
those facts *mean in practice*: who you actually talk to, what happens outside
the stated hours, and why each refusal is a refusal. **Verified: 16 sentences
on `/about` longer than 45 characters, zero of them present verbatim in the
homepage's `<main>`.**

*The most useful sentence on the page is the one that admits a limit.* Under
«Έξω από αυτές»: «Δεν απαντάμε αμέσως, και δεν προσποιούμαστε ότι
απαντάμε.» A site that implies round-the-clock availability from one person is
making a promise the next unanswered evening breaks, and §12 says the
solo-operator objection is the one that kills deals silently — stating the
limit is what makes the rest of the page believable.

*What is deliberately **not** on this page.* No invented policy. Whether Val
takes meetings in person, what he charges, which sectors he declines — none of
that is written down anywhere in this repo, and a page is not the place to
guess at a business's boundaries on its behalf. The four refusals are the four
the homepage already makes; this page adds the reasoning, not new rules.

*The `Person` node asserts four properties and the restraint is the point.*
`name`, `url`, `worksFor` (a reference to the business `@id`, not a copy of
the name, address, phone and hours) and `sameAs` (the same profile list the
business node uses, which already excludes WhatsApp because a `wa.me`
deeplink is a chat window and not a profile). **No `jobTitle`** — the page
gives him no title, and the exit gate says every string in the structured
data has to be visible on the page carrying it, so a title asserted only to
search engines is a claim nobody on the site has made. No `alumniOf` or
`award`, which would be invented; no `birthDate`, `address` or `telephone`,
which are personal data a marketing page has no business publishing about a
private individual. **Verified property by property:** the name renders, the
business name renders, all three `sameAs` URLs are linked on the page, and the
six forbidden properties are absent.

*One extraction.* `PORTRAIT` moved from `AboutSection` into `lib/site.ts`,
because this slice would have given the site a **second** `null` photo slot
in a second file — two places to remember on the day a photo exists. Both
surfaces read the one constant; while it is `null` neither renders anything,
and `/about` was measured with **zero `img` elements in `<main>`**. Setting
that constant is the whole of the Phase 5 change.

*Measured.* One `h1`, which names him; heading order h1 → h2×2 → h3×3, no
skips; unique title, description and canonical. At 375px: 16 interactive
elements, **zero** under 44×44 but the `sr-only` skip link, zero horizontal
overflow, zero text below 12px. Homepage unchanged apart from the link out and
still one `h1` with seven `h2`s. No raw hex, no raw `zinc-600/700/800`.

*`/faq` is the last 404 on the branch*, closed by S2.8.

**S2.8.** `/faq` renders all six objections and carries the only `FAQPage`
node on the site; the homepage shows the first four and carries none.

*This slice found two real defects in its own work, both by measuring.*

1. **The schema asserted six answers the document did not contain.** The
   disclosure panels were conditionally rendered, so a collapsed answer
   existed nowhere in the HTML — measured immediately after adding the node:
   **6 questions present, 0 answers.** Google allows FAQ content inside
   expandable sections; it does not allow content that is absent until a
   click, and a payload describing text the page does not have is the exact
   mismatch this markup gets penalised for. The panel now always renders and
   animates height between 0 and `auto`, with `aria-hidden` while collapsed
   so a screen reader still skips it. Re-measured: **6/6 questions and
   answers present** in `/faq`'s `<main>`. (The first re-check said 5/6; the
   sixth answer interpolates the trading hours, whose `&` renders as `&amp;`,
   so it was the comparison failing and not the page. Unescaping entities
   before comparing gave 6/6.)
2. **`/faq` skipped a heading level.** The questions are `h3`, which is right
   on the homepage where the section's `h2` sits above them, and wrong on a
   page whose `h1` does — the outline read `h1 → h3`. `FaqList` now takes a
   `headingLevel`, `h2` on `/faq` and `h3` on the homepage: the level follows
   the document rather than the component.

*Heading outlines re-measured across the whole site, not just the new page.*
All nine built routes: **exactly one `h1` and zero skipped levels on every
one.**

*One extraction, which also moved the client boundary.* `FaqList` is the
disclosure and the only part that needs JavaScript; `FaqSection` and the
`/faq` page are now **server components**. Two surfaces render the same
disclosure behaviour from one implementation, and S1.4's rule got applied to
the section that had grown a second caller.

*The homepage subset is the first four, and order is the selection.* `FAQ` is
already written worst-objection-first — continuity leads because §12 names it
the deal-killer — so the highlight is `FAQ.slice(0, 4)` rather than a second
hand-picked list that can drift out of agreement with that ordering.
Verified: homepage renders four disclosures (`continuity`, `pricing`,
`timeline`, `wordpress`), all four answers in its HTML, the two `/faq`-only
answers absent, and **no `FAQPage` node** — which Phase 1's exit gate
established and this slice had to preserve rather than quietly break.

*A D1 note, because this page is the exception.* Unlike `/process` and
`/about`, `/faq` and its homepage section render the **same sentences**; the
homepage just shows fewer. That is not a D1 violation — D1 forbids a deeper
page that copies a shallower one, and an FAQ answer cannot be split into a
highlight and an expansion without becoming a worse answer in both places.
The subset *is* the highlight, and the canonical set lives on `/faq`, which is
why the schema lives there too.

*Schema placement across the site, verified route by route:* `FAQPage` on
`/faq` only; `Person` on `/about` only; `Service` on the two pillars only;
`BreadcrumbList` on the case study only; `ProfessionalService` on all nine
from the layout.

**S2.9.** `/privacy` and `/terms`, both describing what the site does today.
D3 records why they ship in Phase 2 while §3 puts the privacy policy in
Phase 3.

*The policy was written against the code, not from a template.*
`app/api/audit/route.ts` was read line by line and each claim cross-checked:

| The page says | The code does |
|---|---|
| Collects only the form's fields | Seven `audit-*` inputs, one a honeypot no human sees |
| Not stored in a database | No DB write; `package.json` has no Supabase, Prisma, pg, Mongo or MySQL package |
| Name, email and phone are never logged | The stub logs `receivedAt`, `intent`, `hasWebsite`, `briefLength` and nothing else |
| IP kept in memory one hour at most | `RATE_WINDOW_MS = 60 * 60 * 1000` |
| No cookies, analytics, pixels or trackers | Zero `cookie`/`localStorage`/analytics/third-party-script references anywhere in `app`, `components`, `lib` |
| Fonts served from our own domain | `next/font` self-hosts both faces — **zero** requests to `fonts.googleapis` or `fonts.gstatic` in the built HTML |
| Vercel is the only other party | No third-party SDK imported; every `Resend`/`Supabase`/`Nodemailer` mention in the route is inside a comment |

*§8.6 swept and clean.* «ΑΦΜ», «myDATA», «τιμολόγι», «νόμιμο παραστατικό»,
«εταιρεία», «ΓΕΜΗ», «Δ.Ο.Υ.», «Ε.Π.Ε.», «Ι.Κ.Ε.», «Α.Ε.» — **zero hits on
both legal pages.** The sweep flagged one «Εταιρεία» on `/` and `/contact`;
run down rather than waved off, it is the **honeypot's label** inside
`aria-hidden="true" class="sr-only"` — it means the *visitor's* company, no
human ever sees it, and it asserts nothing about our legal status.

*What is deliberately not in `/terms`.* No forum-selection clause naming
specific courts, no cancellation or refund schedule, and no
limitation-of-liability boilerplate broad enough to be unenforceable. None of
those exist anywhere in this repo, and inventing commercial terms on a
business's behalf is not a decision a page can make for it. Every clause that
*is* there restates a promise the site already makes — code ownership is the
FAQ's continuity answer and both pillars' closing section, "no ranking
guarantees" is `/about`'s third refusal, the timeline is the §2.2 range. Terms
that contradict the marketing copy are worse than no terms.

*One judgment call worth Val's attention, and it is in the report rather than
buried here.* The policy states the purpose (to answer your enquiry) and the
storage (none). It does **not** announce that the form currently delivers
nowhere. Val's Phase 1 decision was to keep the 24-hour promise as written and
treat the stub as temporary; a privacy policy is about processing, not about
advertising a known functional gap, and Phase 3 closes both in the same slice.
If Val wants the stronger disclosure while the stub stands, it is one
paragraph.

*Both pages are deliberately plain* — no cards, no eyebrows, no terminal
texture. A privacy policy dressed as a product feature reads as though it is
distracting from its contents. Each carries a literal "last updated" date
rather than a build timestamp, because `new Date()` would advance on every
deploy and claim a review that had not happened.

*Measured.* `/privacy`: one `h1`, outline `122222222333`, no skips.
`/terms`: one `h1`, outline `1222222333`, no skips. Both: unique title,
description and canonical; zero targets under 44×44 at 375px but the
`sr-only` skip link; zero horizontal overflow; zero text below 12px.

**S2.10.** `app/icon.tsx`, eleven generated OG cards from one design, and a
Greek 404.

*The font risk resolved by looking, which is what the spec asked for.* A card
was generated and **read as an image** before the other ten were written:
Greek renders correctly — «Θεσσαλονίκη» with real glyphs, no tofu — so
`ImageResponse`'s default font covers the alphabet and **no font file had to
be committed**. That was the contingency and it is not needed.

*Looking at it also found a bug that was already shipped.* The card read
«ΑΡΧΙΚΉ». Monotonic Greek **drops the tonos in all-caps** — ΑΡΧΙΚΗ — and
keeps only the dialytika; JavaScript's `toUpperCase` knows none of that. The
same call had gone out in **S2.5**, where `/work/btl-industries` rendered
«ΚΑΤΑΣΚΕΥΑΣΤΉΣ ΙΑΤΡΟΤΕΧΝΟΛΟΓΙΚΟΎ ΕΞΟΠΛΙΣΜΟΎ» in its eyebrow. `greekUpper`
in `lib/utils.ts` now handles both call sites, and the regenerated card reads
«ΚΑΤΑΣΚΕΥΑΣΤΗΣ ΙΑΤΡΟΤΕΧΝΟΛΟΓΙΚΟΥ ΕΞΟΠΛΙΣΜΟΥ».

*The CSS half of that question was checked too, and is fine.* `Eyebrow`'s
`label` variant uppercases through `text-transform`, and the document is
`lang="el"`, which is what tells a browser to apply Greek casing rules.
Confirmed by zooming in on `/about`: «Έξω από αυτές» renders as
«ΕΞΩ ΑΠΟ ΑΥΤΕΣ», «Πού βρισκόμαστε» as «ΠΟΥ ΒΡΙΣΚΟΜΑΣΤΕ», «Γλώσσα» as
«ΓΛΩΣΣΑ» — the browser strips the accents correctly. **Only the JavaScript
path was wrong**, so no Phase 1 component needed touching.

*One design, eleven unique cards.* `lib/og.tsx` holds the only layout and each
route passes its own strings, with titles read from the route manifest rather
than retyped beside the image — a card cannot advertise a heading the page no
longer has. The case-study card is dynamic and shares
`generateStaticParams` with its page, so a card cannot exist without one.
**Measured: 11 routes, 11 `og:image` URLs, all unique, none missing.**

*The favicon closes a deduction carried since Phase 0.* Best Practices read
**96** in both previous phases for exactly one reason — a `404 /favicon.ico`
console error. Verified in a **fresh tab** (the first read was polluted by
this session's own earlier `fetch` probes, which is why it showed fifteen
404s): **zero console errors, zero console warnings, and no `/favicon.ico`
request at all** — the browser uses the `<link rel="icon">` instead. Every
request on the page returns 200. `/favicon.ico` itself still 404s and that is
correct: nothing asks for it.

*The 404 page is Greek, `noindex`, and carries no terminal joke.*
«404 SYSTEM ERROR» in monospace is exactly the jargon register §2.4 stripped
from the whole site, and a visitor who has just hit a dead end is the last
person to entertain with one. It says what happened and offers the three
places they were probably going.

**S2.11.** `app/sitemap.ts` and `app/robots.ts` generated from the route
manifest, and the site-wide schema promoted to an `@graph`.

*Nothing in the sitemap is hand-listed.* It reads `ROUTES` plus
`STUDIED_PROOF` — the same array `generateStaticParams` filters on — so a
case study cannot appear in the crawl budget without having a page, and
S2.5's thin-content rule carries through for free. **11 entries, and every
single `<loc>` was fetched: 11 × 200, zero 404s.** A 404 in a sitemap is a
self-inflicted wound.

*The manifest was diffed against what the build actually produced.* **Every
manifest route is built; no page route is missing from the manifest.** The
only built routes absent from it are asset routes — the eleven
`opengraph-image` endpoints, `/icon`, `/robots.txt`, `/sitemap.xml` — which
are not pages and correctly do not belong in a sitemap.

*Sitemap fields were added in this slice rather than in S2.1*, which is the
discipline the manifest's own comment set: a `priority` invented for a file
written ten slices later is a guess wearing the costume of a decision. They
are also honest about their worth — relative hints within one site, which
Google has said for years it largely ignores.

*`robots.txt` disallows `/api/` and mentions neither `/en` nor `/blog`.*
Those arrive in Phases 6 and 7, and a `Disallow` for a path that does not
exist is a note to a future maintainer disguised as a directive — the kind
left in place long after it should have gone, quietly blocking the thing it
once guarded. **On a preview deployment it returns a blanket disallow**, so
the two signals agree: the pages carry `noindex` and the robots file says the
same thing.

*The graph closes a loop open since Phase 0.* `JsonLd` now emits
`@graph: [ProfessionalService, WebSite]`, with the `WebSite` node's
`publisher` referencing the business `@id` rather than restating the name,
address, phone and hours. Four nodes now reference that id — `Service` on
both pillars, `Person` on `/about`, and this `WebSite` — so the NAP data is
asserted **exactly once for the whole site**, which is what `lib/site.ts` was
built for. **No `SearchAction`:** there is no site search, and a
`potentialAction` pointing at a search box that does not exist is a
placeholder that happens to be invisible to everyone except a crawler.

*Graph integrity measured across all eleven pages:* five `@id`s defined
(`#business`, `#website`, `#person`, and a `#service` per pillar), and
**zero dangling references** — every `@id` pointed at by any node is defined
somewhere.

**S2.12.** The navigation became routes, and the phase's exit gate was
measured end to end.

*Every header and footer link is a `next/link` now.* §2.3's five items
exactly: **Websites · Automations · Έργα · Διαδικασία · [Δωρεάν Audit]** —
the single «Λύσεις» anchor split into the two pillars and «Ερωτήσεις» moved to
the footer, which is where §2.3 puts FAQ. Labels come from the route manifest
rather than being retyped, so the header cannot disagree with the page about
what a page is called. The footer became the site's index: Αρχική, the four
nav items, the CTA, About, FAQ, Privacy, Terms and the phone.

*The in-page anchors that stayed, stayed for a reason.* The hero CTA and the
showcase banner still use `ScrollLink` to `#audit` — both live in components
that only ever render on the homepage, so they are genuinely same-page. The
footer's «Επιστροφή στην αρχή» pointed at `#hero`, which exists on exactly
one of eleven routes; it now targets `#main-content`, the layout's landmark,
which is the only anchor guaranteed to be on the current page.

*Three defects this slice introduced and then caught by measuring.*

1. **The drawer stayed open across navigation.** The header lives in the root
   layout, so an App Router navigation does not remount it. The fix is not an
   effect: the state is now **which route the drawer was opened on**, so `open`
   is derived and a route change closes it during render. The first attempt
   *was* an effect calling `setState`, which the React Compiler lint correctly
   rejected — the lint was right and the derived version is the better answer.
   Verified: opened at 375px, followed a drawer link, drawer closed and
   `body.overflow` restored; browser **back** also leaves it closed.
2. **«Έργα» was 36×44 at 1024px and above.** §2.3's labels are shorter than
   the ones they replaced, and `min-h-tap` only ever fixed height — one
   offender per route, twelve in total, on the two widest breakpoints.
   `min-w-tap` with centred text.
3. **The 404 page skipped a heading level.** It was the only route with no
   `h2` of its own, so its `h1` sat directly above the footer's `h3` column
   headings. The link list now carries an `h2`, which it wanted anyway.

### Exit gate — measured

| Gate | Result |
|---|---|
| Every route in §2.3 returns 200 | ✅ 11 routes, all 200 |
| Unknown `/work` slug 404s | ✅ `/work/does-not-exist` **and** `/work/roz-inn` (real entry, no study) |
| Unique title / description / canonical / OG image | ✅ **11 routes, 11 unique on all four, zero missing** |
| No route inherits the homepage canonical | ✅ `alternates` gone from the layout; a metadata-less canary renders **no** canonical |
| Nav is five items including the CTA | ✅ plus brand and phone pill |
| Zero broken internal links site-wide | ✅ **11 distinct internal links crawled, zero non-200** |
| Sitemap lists every public route, nothing that 404s | ✅ 11 `<loc>`, **every one fetched: 11 × 200** |
| Robots allows crawling, points at the sitemap | ✅ and returns a blanket disallow on previews |
| No favicon 404 on any route | ✅ fresh-tab check: **zero console errors, no `/favicon.ico` request at all** |
| 404 renders in Greek, `noindex`, links back | ✅ `noindex`, 404 status, three exits |
| Schema: graph validates, every string visible | ✅ 5 `@id`s, **zero dangling refs**; `FAQPage` on `/faq` only (6/6 Q&A present), `Person` on `/about` only, `Service` on both pillars, `BreadcrumbList` matching the visible trail |
| Homepage FAQ shows four and carries no `FAQPage` | ✅ four disclosures, schema absent |
| No TODO / Placeholder / yourdomain | ✅ grep returns nothing |
| No hardcoded hex, no raw `zinc-600/700/800`, no sub-12px | ✅ all three greps empty |
| Every interactive element ≥ 44×44 | ✅ **12 routes × 4 widths, 316–376 elements per width, zero under 44; smallest side exactly 44** |
| One `h1` per route, no skipped levels | ✅ 12 routes, 12 `h1`s, **zero skips** |
| No horizontal overflow, no text below 12px | ✅ zero at 375 / 768 / 1024 / 1440 |
| No positive `tabindex` | ✅ none in the tree |
| `tsc`, `lint`, `build` | ✅ all clean |
| Lighthouse mobile on `/`, `/websites`, `/work` | ✅ see below |
| Manual pass on a real phone | ⏳ Val |
| Keyboard pass with eyes on the screen | ⏳ Val |
| Val has read `/privacy` and `/terms` | ⏳ Val (D3) |

### Lighthouse — mobile, local production build

| Route | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| `/` | 93 | **100** | **100** | **100** |
| `/websites` | 94 | **100** | **100** | **100** |
| `/work` | 98 | **100** | **100** | **100** |

Budget for Phase 0–2 is Perf ≥ 90 · A11y 100 · BP ≥ 95 · SEO ≥ 95 — **met on
all three routes.** Desktop is 100/100/100/100 on all three.

**Best Practices reached 100 for the first time in the project's history.** It
read 96 in Phase 0 and 96 in Phase 1, both times for one reason — the
`404 /favicon.ico` console error — and S2.10 removed it. Predicted in the
spec, and it landed. Zero failing audits in accessibility, SEO **and** best
practices on `/`.

*Performance reads 93 against Phase 1's 95, and the honest answer is that it
needs Phase 4 rather than a fix here.* Both numbers are local `next start`,
so they are comparable; LCP moved 2.9s → 3.2s. Phase 4 owns performance —
its gate is Perf ≥ 95 with Lighthouse budgets in CI — and chasing LCP in a
phase that does not own it is how a slice stops being reviewable. Logged in
the Backlog.

**Measured on a local production build, not the preview.** Vercel
Deployment Protection is still on: the classifier blocked this session from
changing it and Val has not yet cleared it, so for the **third** consecutive
phase the deployment itself is unverified. Phases 0 and 1 both recorded the
same fallback.

### Known mid-phase state on this branch — ✅ CLOSED by S2.12

The header's three nav links and the brand link are still `ScrollLink`s to
homepage anchors (`#solutions`, `#process`, `#faq`, `#hero`), so **on
`/contact` they are dead clicks.** This is the ordering the spec chose
deliberately — Phase 1's S1.10 precedent puts navigation last, because wiring
it before the pages exist ships links that 404 through the middle of the phase.
Nothing reaches production until the phase PR merges. S2.12 converts them to
`next/link` routes and audits the whole link graph; the `Navbar` comment
already anticipates the brand becoming `/`.

### Vercel Deployment Protection — Val owns this, S2.12 needs it

Phases 0 and 1 both failed to audit their preview URL: `ssoProtection` is
`enabled: true` with `deploymentType: "all_except_custom_domains"` on project
`my-website`, so anonymous requests — Lighthouse included — get
`<title>Login – Vercel</title>`. Both phases fell back to a local
`next start`. At twelve routes that stops being a workaround, because "every
route returns 200 with a unique title" is a claim about a deployment.

Attempting the change from the session was **blocked by the permission
classifier**, so it was not made. Val, in Vercel → `my-website` → Settings →
Deployment Protection, either:

1. **Protection Bypass for Automation** — generate a secret, previews stay
   private to humans, Lighthouse passes `?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<secret>`. Preferred: it is the narrower change.
2. **Vercel Authentication → Disabled** — simpler, and previews become
   readable by anyone holding the URL. Safe now that previews are `noindex`.


### What remains, and only Val can do it

Five items, all of them in **`docs/VAL-ACTIONS.md`** with the exact steps,
click paths and acceptance criteria. Summarised here only so this file's
Phase 2 entry is not silent about them:

| | Item | Why it is Val's |
|---|---|---|
| **V1** | Read `/privacy` and `/terms` | D3's condition; the one place a drafting error has consequences off the website |
| **V2** | The phone pass and the keyboard pass | A 375px viewport is not a phone, and the Browser pane never fires `requestAnimationFrame`, so no focus ring has ever been *observed* in any phase |
| **V3** | Vercel Deployment Protection | The session's permission classifier blocked the API call; three phases running have measured a local build instead of the deployment |
| **V4** | Merge both PRs, Phase 1 first, then rebase Phase 2 | `gh` is not installed and the GitHub connector is unauthorised here |
| **V5** | Check the deployed SHA after each merge | Needs the Vercel dashboard — and Phase 0 once sat eight commits stale |

**Deliberately not duplicated here.** The full detail lived in three places by
the end of this phase — phase write-ups, the playbook's open questions, and
this file — which is why `docs/VAL-ACTIONS.md` now exists and why this is a
pointer.

---

## Phase 1 — Homepage Restructure ✅ CODE-COMPLETE · awaiting Val's manual passes and merge

Correct the funnel order, add the sections that carry credibility, and pay
down the design-system debt the Phase 0 audit logged against this phase.
Front end only. Spec: `docs/phases/PHASE-1-HOMEPAGE.md`.

- [x] **S1.1** Tokens — surfaces, hairlines, type scale · 2026-09-11
- [x] **S1.2** UI primitives — Badge, Card, SectionHeader, Eyebrow, StatusDot · 2026-09-11
- [x] **S1.3** Tap targets raised to 44×44 · 2026-09-11
- [x] **S1.4** Push the client boundary down · 2026-09-11
- [x] **S1.5** Greek pass on the pipeline simulator · 2026-09-11
- [x] **S1.6** Proof strip · 2026-09-11
- [x] **S1.7** Process section · 2026-09-11
- [x] **S1.8** About section · 2026-09-11
- [x] **S1.9** FAQ section · 2026-09-11
- [x] **S1.10** Navigation and final assembly · 2026-09-11

**S1.1.** Every count in the spec was re-measured against the tree rather than
trusted, and all three matched: 11 hardcoded hex values, 5 raw decorative
`zinc-*` greys, 28 text usages below 12px. Fixed together because the four new
sections landing later in this phase would otherwise inherit all of it.

Measured after, at 375 / 768 / 1024 / 1440px: **zero** rendered text below 12px
and **zero** horizontal overflow at any width. The rendered size histogram
collapses onto the scale — 12 / 13 / 14 / 16 / 18 for everything except the
headings and the two hero optical sizes. All four exit-gate greps return
nothing.

*Four deviations from the spec, all deliberate:*

1. **The input-fill token is `obsidian-775`, not `obsidian-825`.** In this ramp
   a higher number is *darker* (950 is the page, 700 the strongest elevation).
   `#12151E` is lighter than `800` (`#0F1117`) and darker than `750`
   (`#141721`), so it belongs between those two. `825` would have claimed it
   sits between `850` and `800`, which is false, and every later phase would
   have inherited a misordered ramp.
2. **Three `trace` steps, not two.** The spec offered `line` / `node` "or
   equivalent", but three distinct greys were actually in use, and two of them
   encode the simulator's active-vs-idle node ring. Collapsing them would have
   quietly removed a state distinction, so the ramp is `trace-node` (idle),
   `trace-line` (window dots, dashed connectors) and `trace-active` (running or
   done). All three are decorative; the rings sit inside `aria-hidden`.
3. **`lib/tokens.ts` is new**, holding `OBSIDIAN_950`. The spec asked for the
   `themeColor` metadata to come from "one exported constant"; this is the only
   arrangement where the Tailwind config and `app/layout.tsx` read the *same*
   literal and physically cannot drift.
4. **`#12151E` had 3 usages, not the 4 the spec states.** No consequence.

*What actually changed size.* The 28 sub-12px usages rise to the 12px floor
(+0.5 to +2px each) — that is the intended change. Beyond it: `xs` is now 13px
rather than Tailwind's 12, so the 13 monospace `text-xs` usages were moved to
`text-mono-xs` and hold 12px exactly, unchanged. Six further arbitrary values
snapped onto the scale: 12.5 → 12 or 13, 13.5 → 14, 15 → 16. The only element
that grew without being below the floor is the header CTA (12 → 13px). The
Footer — the spec's stated risk, with 8 of the 28 — needed no spacing
adjustment: it still reads as a list at 375px with its 19px gaps intact.

No text colour, position or layout changed, so contrast is untouched.

**S1.2.** Five primitives in `components/ui/`, and all eight consumers moved
onto them. The pill class string was written 14 times with four different
border/fill opacity combinations; the card shell 6 times; the status dot
twice; the `[ 01 // ]` eyebrow twice and its uppercase sibling six times.

*The page now paints exactly one structural hairline.* Measured on the
rendered document, not in the source: 252 white border edges at
`rgba(255,255,255,0.07)` and nothing else, where before 0.05, 0.06, 0.07 and
0.08 were all on screen at once. The only other white border left is
`0.12` on four edges — the simulator's run button and its completed node,
which are a control emphasis pair rather than a hairline. Backlogged, not
silently folded in.

**The hairline values follow the playbook, not the spec.** S1.2's text says to
keep the card's `0.18` as the single hover value; §10.3 names `0.07` structural
and `0.15` hover, and `globals.css` has declared exactly that pair as
`--hairline` / `--hairline-strong` since Phase 0. The playbook governs the spec
(`CLAUDE.md`, and the spec's own header), so the two values are now
`hairline` and `hairline-strong` **Tailwind tokens** — which also means §10.3
is greppable for the first time. Reverting to 0.08/0.18 is a two-line change in
`tailwind.config.ts` if Val disagrees.

*An S1.1 regression, found by this slice and fixed here.* `tailwind-merge`
knows Tailwind's own font-size scale but not ours. It classified
`text-mono-xs` as a **text colour**, so `cn("text-mono-xs", "text-zinc-400")`
returned only `text-zinc-400` and the element silently inherited the 16px body
size. S1.1 shipped that on three pipeline-simulator elements; routing every
badge through `cn` in this slice spread it to twenty-one and made it visible as
a 512px-taller document. `lib/utils.ts` now registers the step in the
`font-size` class group. The rendered histogram at 375px moved from 98 to 119
elements at 12px, and 19 down to 9 at 16px.

Worth recording why S1.1's verification missed it: that check asked "is any
text below 12px?" and the answer was honestly no — the broken elements were at
**16px**, above the floor, not below it. A floor check cannot catch text that
is too large. The before/after geometry diff this slice ran is what caught it,
and it is the check worth keeping.

*Verified.* A `getBoundingClientRect` fingerprint of eleven key elements was
captured after the refactor, the slice was stashed, the fingerprint recaptured
on the pre-slice tree, and the two compared. Every element matches to the pixel
except the showcase card, which measures 719.5px and rounds either way — the
category badge went from `inline-block` to `inline-flex` and the line box lands
half a pixel differently. Document height is 31px shorter, which is the
simulator text returning to its intended 12px. Zero text below 12px and zero
horizontal overflow at 375 / 768 / 1024 / 1440. One `h1`, two `h2`s, six `h3`s
— the footer's three eyebrows kept their heading level through `Eyebrow`'s
`as` prop. The architecture accordion still toggles `aria-expanded` and still
renders its 230px panel. Lint, typecheck and build clean.

*Two things deleted rather than migrated.* `.panel` in `globals.css` was dead
code — nothing referenced it, and `Card tone="glass"` is now that pattern.
`btn-secondary`'s raw `0.08` border moved onto the token.

**S1.3.** A full `getBoundingClientRect` sweep at 375px **with the mobile
drawer open** found 22 interactive elements under the bar — seven more than
the spec's table, because S0.12 measured the page as it stood in Phase 0 and
never opened the drawer. The extra five were the header CTA (40), the drawer
CTA (40), the desktop navigation links (20, only visible from 1024px up), the
showcase banner CTA (42, only under 44 once it stops wrapping at 768px) and
the success-state "Νέο αίτημα" button, which renders only after a submit
succeeds. The skip link's focus state was the sixth.

**Result: zero elements under 44 in either axis, at 375 / 768 / 1024 / 1440.**
31–34 interactive elements measured per width, smallest box exactly 44×44, no
horizontal overflow anywhere.

*The 44 lives in one place.* Tailwind 3.4's `minHeight` scale does not carry
the spacing steps, so the choice was `min-h-[44px]` typed into fifteen
components or a named token. `tailwind.config.ts` gains
`minHeight: { tap: "44px" }` and its `minWidth` twin, consumed as
`min-h-tap` — playbook §6's rule as a single greppable value, with the S0.12
correction (WCAG 2.2 AA's web requirement is 24px; 44 is our own bar) written
beside it.

*Deviation from the spec's fix column, and the reason.* The table prescribes
`py-2.5` and `py-3`. Neither reaches 44 on this type scale: a 13px caption has
an 18px line box, so `py-2.5` yields 38 and `py-3` yields 42 — the exact
height the showcase banner CTA was already failing at. `min-h-tap` with the
existing padding left in place hits 44 exactly, grows only the hit area, and
leaves every element that already cleared the bar untouched.

*What moved.* The nine footer links became full-row hit areas (343×44), and
their two lists dropped `space-y-2.5` because the hit areas now set the
rhythm — pitch went from 34px to 44px, and the footer still reads as a list
rather than a stack of buttons. The plain-text services list keeps its
spacing, since nothing in it is clickable. The brand button went from
`items-baseline` to `items-center`; it has one child, so the wordmark does not
move. Nothing else changed position and no type size changed — S1.1 owns
those.

*Still verified, and still not verified.* The drawer opens, Escape closes it
and focus returns to the hamburger with `aria-expanded="false"`. The skip link
is the one control that could not be measured: the Browser pane runs hidden,
so `document.hasFocus()` is false, `:focus` never matches and the `focus:`
variants never apply — the same limitation Phase 0 recorded. Its compiled rule
was checked in the stylesheet instead
(`focus\:min-h-tap:focus{min-height:44px}`), but seeing it render belongs to
Val's keyboard pass.

**S1.4.** `HeroSection` and `ShowcaseGrid` were Client Components for one
`onClick` each. `components/ui/ScrollLink.tsx` takes that job as a leaf, and
`ShowcaseCard` moved to its own file to carry the disclosure state, leaving the
section shell, its header, the banner and the `CASES` array on the server.

*Measured, not asserted.* The build was run on this slice, stashed, run again
on the previous tree, and the two sets of client chunks were searched for copy
that only these components render:

| String | Before S1.4 | After |
|---|---|---|
| `Σύγχρονα Web Apps` (the `h1`, the LCP element) | in client JS | **not in client JS** |
| `Αυτόνομο AI Concierge Portal` (the `CASES` array) | in client JS | **not in client JS** |

Client chunks went from 764 KB to 756 KB. That 8 KB is the honest number and it
is not the point — the point is that the LCP element and every word of the
showcase now reach the visitor without a bundle, and that both CTAs are real
`<a href="#audit">` elements that work with JavaScript switched off entirely.
`curl` on the running server returns the `h1`, all three `#audit` anchors and
the `id="audit"` they resolve to, with no script involved.

*Five `"use client"` files remain, and all five earn it:* `Navbar` (drawer
state and focus trap), `AuditForm` (form state), `PipelineSimulator` (the
simulation), `ShowcaseCard` (disclosure state) and `ScrollLink` itself.

*`ScrollLink`'s contract, asserted directly* by stubbing `scrollIntoView` and
`matchMedia` rather than watching the page move:

- motion allowed → `scrollIntoView({ behavior: "smooth", block: "start" })`
- reduced motion → `behavior: "auto"`, which is the reduced-motion contract
  from `lib/utils.ts` carried through intact
- ⌘-click and Ctrl-click → **not** hijacked: `defaultPrevented` stays false and
  no scroll runs, so "open in new tab" still works. This is the most common way
  a hand-rolled link handler becomes a bug, so it is tested.
- plain click → prevented exactly once, and `replaceState` means clicking four
  CTAs leaves four fewer entries in the back-stack

Confirmed end to end as well: the CTA scrolls to 4198px and leaves `#audit`
192px from the top, clear of the 64px fixed header, with `history.length`
unchanged.

*Two notes for whoever verifies this next.* The Browser pane runs hidden, so
`requestAnimationFrame` is throttled and **smooth scrolling does not visibly
run** — a click appears to do nothing while the hash updates correctly. That is
the harness, not the code. And `behavior: "auto"` does not mean "instant": per
spec it defers to CSS `scroll-behavior`, which `globals.css` sets to `auto`
only inside the reduced-motion media query. The JS and the CSS halves are
designed to meet; patching `matchMedia` alone does not reproduce it.

*Footer back-to-top* now resolves to `#hero` instead of a bare `#`, closing the
S0.3 backlog row.

**The "two nav mechanisms" row is only half closed.** The footer and both
section CTAs are anchors now, but `Navbar` still renders its links as
`<button onClick>` — they are announced as buttons rather than links and do
nothing without JavaScript. S1.4's file list deliberately excludes `Navbar`
and S1.10 rebuilds the navigation wholesale, so converting it here would be
work done twice. The row is retargeted to S1.10 rather than marked done.

**S1.5.** The simulator was the last English block on a Greek page, and it sits
above the fold. Stage titles, log lines, status labels, the idle prompt and the
run button are Greek now. What stayed: `lead`, `AI agent`, `CRM` — nouns a
Greek professional says out loud — and `exit 0`, a terminal convention rather
than a word.

`source=web_form` did **not** stay. A key=value pair with a Greek key reads as
neither language, so line 1 just says where the lead came from. The button lost
its `(Simulate Lead)` gloss, which was the last mixed-language string on the
page (§11.3, one language per list).

*Greek runs longer than English, and this widget truncates.* The first draft
was measured rather than eyeballed and three of three step titles were being
cut at 375px — the worst losing 58px, about eight characters. The titles were
rewritten shorter twice until all three fit with zero truncation. That is the
right shape anyway: the titles are labels, and the log lines underneath carry
the detail and wrap freely.

**Final measurement, at 375 / 768 / 1024 / 1440, in all three run states:**
badge on one line every time, **zero** truncation on the filename and on all
three titles, six log lines ending on `Η ροή ολοκληρώθηκε · exit 0`, no
horizontal overflow in the log lane or the page. 1024px is the tightest case
(the widget is 377px there, narrower than on a phone) and it passes.

*Three deviations from the spec, all forced by width:*

1. `QUEUED` → **`ΑΝΑΜΟΝΗ`**, not the spec's `ΣΕ ΑΝΑΜΟΝΗ`. The chip renders on
   every pending row; the two extra characters cost ~22px of title width on
   the narrowest layout, and `ΑΝΑΜΟΝΗ` is idiomatic on its own.
2. The chrome filename is **`lead-engine.ts`**, shortened from
   `pipeline-lead-engine.ts`. `ΟΛΟΚΛΗΡΩΘΗΚΕ` is twelve characters where `DONE`
   was four, and `truncate` was eating eight characters off the end of the
   name — a filename cut mid-word reads as broken rather than tidy. The
   shorter name matches the showcase's `lead-engine` case id.
3. The run button's `(Simulate Lead)` gloss is gone, which the spec's change
   list did not cover but its own rationale demands.

*A false alarm worth recording so nobody re-chases it.* In a screenshot the
capital `Έ` in "Έναυσμα" appears to have lost its accent. It has not. Rendering
the glyph to a canvas and counting ink: `Ε` is 444 pixels in a box starting at
x=24, `Έ` is 497 pixels starting at **x=14** — 53 extra pixels, ten of them to
the *left* of the letter, which is exactly where Greek typography puts the
tonos on a capital. At 12px that is roughly one pixel of ink and it disappears
in a scaled screenshot. The font subset is fine: `U+0388` sits inside the
loaded `U+384-38A` range.

No number was introduced. S0.10 removed an invented latency and an invented
lead score from this component; §8.1 keeps them out.

**S1.6.** The page made a claim in the hero and then asked for a lead with
nothing in between. `ProofStrip` sits directly under the hero and names two
things that exist: **BTL Industries** and **roz-inn.com**. Both trace to
decision-log rows from 2026-09-09 — BTL cleared for naming (freelance
engagement, no NDA), roz-inn confirmed live and linkable. The link was
re-checked before publishing it: `HTTP 200`, redirecting to `www.`.

*Outcome before mechanism, §11.4.* Val's description of the BTL system names
eight vendors. None of them is in the sentence a visitor reads, because a
clinic owner who meets "FullEnrich, BetterContact, ZoomInfo" learns nothing and
hears someone else's suppliers. The line says what the system does — finds and
verifies contacts, researches each lead, writes a personalised opener, loads
the campaign — and the eight tools sit underneath as a `Badge` row, where they
read as evidence instead of name-dropping.

*What is deliberately absent.* roz-inn.com's booking and payment build is in
progress, so it does not appear at all — not even as "σε εξέλιξη", which reads
as padding (§8.5). No logos: a logo needs permission separate from a name, and
BTL's is not cleared. **No numbers anywhere** — a `\d` sweep over the rendered
section returns zero digits.

*The testimonial slot is built and renders nothing.* While `TESTIMONIALS` is
empty there is no card, no skeleton and no "coming soon", and the grid closes
from three columns to two as if the slot were never declared. Phase 0 spent
eight slices removing placeholders; this is the shape one grows back in.

*Data lives in `lib/site.ts`*, not in the component, so Phase 2's `/work` index
reads this array instead of forking the copy.

**Verified at 375 / 768 / 1024 / 1440:** zero tap targets under 44, zero text
below 12px, no horizontal overflow. Page order is now
hero → proof → tech → solutions → audit, heading order runs h1 → h2 → h3 with
no skips, and the external link carries `target="_blank"` with
`rel="noopener noreferrer"` plus a screen-reader note that it opens in a new
tab.

*A measurement trap worth recording.* The first contrast sweep reported the
tool badges at **2.56:1**, a hard-gate failure. The badges were fine; the
sampler was not. It walked up for the nearest non-transparent background and
found `rgba(255,255,255,0.02)` — then parsed the first three numbers and
treated it as opaque **white**. Re-run with real alpha compositing over the
page ground, every text node in the section passes: worst case **5.37:1**, the
badges **7.19:1**. Any future contrast check on this codebase must composite
translucent layers, because this design system is built almost entirely out of
them.

### Open question from S1.6 — ✅ ANSWERED 2026-09-11: option 3

The showcase's third card, `lead-engine`, describes the BTL system and sits
under **"Ενδεικτικές Αρχιτεκτονικές"** — *indicative* architectures, explicitly
"συστήματα που κατασκευάζουμε — όχι δημοσιευμένα έργα πελατών". That framing
was correct when nothing could be named. BTL is now named twenty pixels further
up the page, which makes the same system appear twice: once as proof and once
as a hypothesis.

**Val's decision: re-frame the section in Phase 2, once `/work` exists.**
Nothing changes on the homepage during Phase 1 — the heading Phase 0 wrote on
purpose stays, and the proof strip carries the name. Phase 2 owns the rewrite
and should treat it as part of building `/work`, not as a homepage tweak.

Rejected on the way: leaving it permanently (the mismatch is real, just not
urgent) and splitting the delivered project out now (it would rewrite the
showcase twice, once here and again in Phase 2).

**S1.7.** Three steps between the showcase and the form: what the audit
delivers, how the build runs, and what you own at the end. The third is the
solo-operator objection (§11.6, and the §12 risk register's "kills deals
silently") answered in structure, before the FAQ answers it in words — the
repository is yours, the deployment is documented, another developer can pick
it up without us.

**The audit promise can no longer drift.** The spec asked for the step-01 copy
to match the form's promise word for word. Rather than verify two hand-typed
copies, the sentence moved into `lib/site.ts` as `AUDIT_DELIVERABLE` and both
surfaces interpolate it. A site that offers a 15-minute call in one place and a
20-minute call in another loses the visitor who notices, and this is the only
concrete promise on the page. `TIMELINE_RANGE` got the same treatment, because
S1.9's «Πόσο θα πάρει;» answer is the third place that sentence would have been
retyped. Verified on the rendered DOM: the phrase in the form and the phrase in
step 01 are byte-identical.

*Every number on the section accounted for.* A digit sweep of the rendered
markup returns `02` (the section eyebrow), `01`/`02`/`03` (step numbers,
`aria-hidden` — the `<ol>` already tells assistive tech the sequence), `15` and
`24` from the §2.2 audit definition, and `3` and `2` from the §2.2 timeline
range. Nothing invented, no average, no percentage.

*No icons.* The spec allows Lucide "only if they add meaning". The step number
and the title already carry the sequence, so a glyph beside each would be
decoration — §2.4 asks for simple over dense, and the showcase's architecture
traces sit directly above this section.

**Verified at 375 / 768 / 1024 / 1440:** one column at 375 and 768, three at
1024 and 1440, exactly as the spec describes. Zero tap targets under 44, zero
text below 12px, no overflow. Contrast worst case **5.37:1**; the only values
below AA are the three step numbers at 5.17 — which also pass, and are
`aria-hidden` regardless. Heading order across the whole page is now
h1 → h2 → h3 with no skips.

*Two files touched that the spec's list does not name.* `AuditForm.tsx`, to
read the shared constant rather than hold a second copy of the promise. And
`DirectContactCard.tsx`, whose eyebrow read `[ 02 // ]` — the number this
section takes. Rather than ship a duplicate `02` for three slices and fix it in
S1.10, the eyebrows are now numbered in final page order: solutions `01`,
process `02`, about `03` (S1.8), faq `04` (S1.9), audit `05`. S1.10 verifies
them instead of renumbering them.

**S1.8.** The highest-risk copy in the phase, and the risk is one specific
failure: a prospect reads about a team, then meets one person, and feels
misled at the worst moment in the sale. Four sentences — where we work and the
real hours, what we build, what you own at the end, and what we will not do.
It closes on the refusals, because those are the claims that cost the writer
something and therefore the ones worth reading.

**The §2.1 sweep is clean, repo-wide.** No possessive plural naming staff, no
premises noun, no department, no founding narrative, no headcount, no
years-of-experience figure. The rendered section contains exactly two kinds of
digit: the `03` eyebrow, and the trading hours — which arrive from
`SITE.hoursLong` and are never retyped.

*The portrait slot renders literally nothing.* The section markup contains
**zero** `<img>` and **zero** `<svg>`: no frame, no silhouette, no grey circle.
`PORTRAIT` is a `null` constant and setting it is the entire Phase 5 change —
the card already switches to a two-column layout when it is present, so no
redesign waits on the photo.

*One file touched beyond the spec's list, twice over.* The availability claim
«Διαθέσιμοι για νέα projects» was hand-typed in the hero and the footer, and
this section would have been the third copy. It is now `SITE.availability`,
read by all three. The day it stops being true it has to stop being true in one
place. S1.7 made the same call for the audit promise; the reasoning is
identical and the alternative was knowingly creating the third copy.

**Verified at 375 / 768 / 1024 / 1440:** zero tap targets under 44, zero text
below 12px, no overflow, contrast worst case **5.37:1** with no failures. Line
measure at 1440 is **71 characters** — inside the 65–75 band the phase's
typography finding asks for, measured against a real Greek character advance
rather than estimated from a font size. Page order is now
hero → proof → tech → solutions → process → about → audit, and heading order
runs h1 → h2 → h3 with no skips.

*The comment trap, twice now.* Both S1.7 and S1.8 first shipped doc comments
that quoted the banned phrases verbatim in order to explain the ban — which
made the review grep return hits in the very files that comply with it. Both
were reworded. If a future slice documents a forbidden string, describe it;
do not quote it, or the sweep stops being a sweep.

**S1.9.** Six questions in `lib/faq.ts` as data, so Phase 2's `/faq` route and
its `FAQPage` schema read this array instead of forking the copy — a schema
whose text has drifted from the visible answer is a markup problem search
engines notice and visitors do not, which is the worst combination. **No
`FAQPage` JSON-LD ships here**; confirmed absent from the rendered page.

Three answers interpolate shared constants rather than restating them: the
timeline range, the trading hours and the audit deliverable. That makes
«Τι ακριβώς παίρνω από το δωρεάν audit;» word-for-word identical to the form
and to process step 01 by construction.

*Every digit in every answer traced,* with all six panels open so nothing was
hiding in an unmounted panel: `3`/`2` from `TIMELINE_RANGE`, `10:00`/`15:00`/
`18:30`/`21:00` from `SITE.hoursLong`, `15`/`24` from `AUDIT_DELIVERABLE`.
**«Πόσο κοστίζει;» contains no digit at all** — the model, never a figure,
per §2.2.

*Disclosure wiring, verified on the live DOM rather than read off the source:*
all six questions are `<button type="button">` wrapped in `<h3>`, each with
`aria-expanded` and `aria-controls`; each panel is `role="region"` with
`aria-labelledby` pointing back at the button whose `aria-controls` points at
it — the link was checked in both directions. Focus stays on the button after
toggling. **Two panels open at once was tested and works**: single-open is
deliberately not enforced, because comparing "what if I lose you" against
"what does it cost" is exactly what someone does before calling.

On the keyboard: these are native `<button>` elements, so Enter and Space
activate them through the browser with no key handling of our own — which is
the reason for not building this out of a `div` with `role="button"`.
Synthetic `KeyboardEvent`s cannot trigger native activation, so that half is
**not** machine-verified here and belongs to Val's keyboard pass.

### The hidden-pane finding, which explains several earlier oddities

`document.visibilityState` is `"hidden"` in the Browser pane and
**`requestAnimationFrame` never fires** — measured directly. Consequences seen
across this phase, all environment and none of them bugs:

- Framer Motion mounts a panel and stays on its `initial` frame:
  `style.height: "0px"` while `scrollHeight` is 179. The content is laid out;
  only the animation is frozen.
- `scrollIntoView({ behavior: "smooth" })` appears to do nothing (S1.4).
- Screenshots taken right after a scroll come back black.

Workarounds that do prove the real behaviour: force
`scroll-behavior: auto` before scrolling, and paint an animation's end state
by hand before screenshotting. Both were used here.

### Backlog row raised against a §10 non-negotiable

§10.6 says motion degrades and **everything** respects `prefers-reduced-motion`.
`globals.css` collapses CSS animations and transitions under the media query,
but Framer Motion drives height and opacity through JavaScript, so that rule
does not reach it. This FAQ, `ShowcaseCard` and the `Navbar` drawer all animate
at full duration for a visitor who has asked for reduced motion.

S1.9's spec says to animate "exactly as `ShowcaseCard` does", and fixing only
this section would leave the page with two disclosure behaviours — so the fix
belongs across all three at once, in Phase 4, which owns motion. Logged, not
silently inherited.

**Verified at 375 / 768 / 1024 / 1440:** zero tap targets under 44 (smallest
question button is 52px), zero text below 12px, no overflow, contrast worst
case **5.37:1** with no failures.

**The page order is now complete** and matches the phase spec's target block:
hero → proof → tech → solutions → process → about → faq → audit. Eyebrows run
`01`–`05` with no duplicates. Six `h2`s; the tech strip is the seventh section
and still carries only an `aria-label` — S1.10 owns giving it a real heading.

**S1.10.** The nav still listed the two sections that existed in Phase 0 and
offered two controls pointing at the same anchor. `NAV_LINKS` is now
**Λύσεις · Διαδικασία · Ερωτήσεις** plus `CTA_LINK`, four items inside §2.3's
cap of five. "Επικοινωνία" is gone: it resolved to `#audit`, the same place as
the Δωρεάν Audit button beside it, leaving the visitor to guess whether they
differed. About joined `FOOTER_LINKS` as «Ποιοι είμαστε», per §2.3.

*The footer keeps a path to the form.* Dropping "Επικοινωνία" from `NAV_LINKS`
silently removed the footer's only link to `#audit` — a dead end at the exact
moment someone has finished reading — so `CTA_LINK` is spliced into the
footer's navigation column explicitly.

**The two-nav-mechanisms row is fully closed.** S1.4 converted the footer and
both section CTAs to `ScrollLink` and left the navbar for this slice, which
rebuilds that markup anyway. Every header control is now a real anchor: the
brand, the three links, the header CTA, the drawer links and the drawer CTA.
They work before hydration, announce as links, and honour ⌘-click. `goTo` is
gone; a `dismissDrawer` callback closes the drawer and `ScrollLink` does the
navigating.

*The tech strip got a real `h2`.* It was the only section whose name existed
for assistive tech (`aria-label`) but not in the heading outline, so a
screen-reader user listing headings jumped straight from the proof strip to
the showcase. Its visible line was already the section's title; it just was
not marked up as one. `#solutions` was also the only section without
`aria-labelledby` — both fixed.

**The 1024–1279px band, which the S0.12 backlog row asked for specifically.**
Measured at 1024, 1100, 1279 and 1280 with the new four-item nav: brand plus
three links plus the CTA, five visible controls, **28px minimum gap**, no nav
overflow and no page overflow anywhere in the band. At 1280 the phone pill
appears as a sixth control and the minimum gap drops to the designed 8px.
Row closed.

### Exit gate — measured

| Gate | Result |
|---|---|
| Page order matches the target block; `#audit` last | ✅ hero → proof → tech → solutions → process → about → faq → audit |
| `components/ui/` primitives exist and are used | ✅ Badge, Card, SectionHeader, Eyebrow, StatusDot, ScrollLink |
| No hardcoded `#0D0F16` / `#12151E` / `#08090D` | ✅ grep returns nothing |
| No raw `zinc-600/700/800` | ✅ grep returns nothing |
| No text below 12px | ✅ grep returns nothing; 0 rendered nodes under 12px at four widths |
| Every interactive element ≥ 44×44 at 375px | ✅ 0 under 44 at 375 / 768 / 1024 / 1440 |
| One `h1`; 7 `h2`s; no skipped levels | ✅ 1 / **7** / 0 skips |
| Hero and showcase shells render on the server | ✅ 6 `"use client"` files, all genuine leaves |
| `NAV_LINKS` resolves; every anchor lands somewhere | ✅ 14 in-page anchors, **0 broken** |
| `npx tsc --noEmit`, `npm run lint`, `npm run build` | ✅ all clean |
| Zero English in visitor copy except product nouns | ✅ **met at closeout** — see below |
| Manual pass at four widths + a real phone | ⏳ Val |
| Keyboard pass with eyes on the screen | ⏳ Val |
| Lighthouse mobile | ✅ **95 / 100 / 96 / 100** — see below |

Also verified, beyond the gate: tab order follows document order across 39
focusable elements with **zero inversions and zero positive `tabindex`**, and
no `FAQPage` schema is present in the rendered page.

### Closeout task 1 — the last English copy · ✅ done 2026-09-11

`ShowcaseGrid` was the one place the gate still failed, and no slice had owned
it: S1.5 translated the pipeline simulator because the S0.8 backlog row named
that component, and the showcase was never assigned to anyone. Done as a
closeout step rather than inside S1.10, which is navigation and assembly.

Translated: three mixed-language card titles, one problem statement, two
solution statements, two stack rows and **thirteen architecture-trace nodes**
that were English prose rather than product nouns — `Instant Dynamic
Response`, `Role Gate (Admin/Client)`, `Real-time Status Sync`,
`Waterfall Verification`, `AI Relevancy Filter`, `Inbound/List Trigger`,
`CRM / Outreach Tool` and the rest. Plus the footer's «Custom dashboards».

Kept, because a Greek professional says them: `Next.js`, `n8n`, `Supabase`,
`PostgreSQL`, `Tailwind CSS`, `Vapi`, `LLM`, `DB`, `webhook`, `S3`, `CRM`,
`AI`, `API`, `portal`, `dashboard`, `onboarding`, `custom`, `email`, `lead`,
`check-in`, `spam`.

*Verified two ways.* Every removed phrase was grepped for in the rendered page
and all 21 are gone. Then every Latin-script word in `<main>` was extracted and
checked against an explicit product-noun allow-list: **one** word remains
outside it, `preview`, in «preview URL που μπορείτε να ανοίξετε» — kept under
§11.2, which says to keep the English terms Greek professionals genuinely use.

*And it still fits.* All thirteen new Greek nodes render on **one line each**
at 375px, the longest being 230px in a 257px lane. Card titles stay at two
lines, exactly as before. Zero targets under 44, zero text below 12px, no
overflow.

This does not pre-empt Val's Phase 2 decision: the re-frame changes the
section's heading and its "indicative" framing, not the language of the nodes
and titles, so none of this work is spent twice.

### Closeout task 2 — Lighthouse · 2026-09-12

Branch pushed as `phase/1-homepage`. Vercel built preview
`dpl_B1Dop46j3LKZqoHHfkKyWXz4XrfN` from `dc7dbfe`, READY, SHA matching HEAD.

**The preview could not be audited, for the same reason as Phase 0.** Both the
deployment URL and the branch alias answer anonymous requests with
`<title>Login – Vercel</title>` — Deployment Protection is still on. Lighthouse
was therefore run against a **local production build** (`next start`), exactly
as Phase 0 recorded doing.

| Metric (mobile) | Budget | Phase 0 live | Phase 1 |
|---|---|---|---|
| Performance | ≥ 90 | 97 | **95** |
| Accessibility | **100** | 100 | **100** |
| Best Practices | ≥ 95 | 96 | **96** |
| SEO | ≥ 95 | 100 | **100** |

FCP 0.9s · LCP 2.9s · **CLS 0** · TBT 20ms · Speed Index 0.9s.

**Zero failing accessibility audits. Zero failing SEO audits.** Best Practices
is 96 for precisely one reason, confirmed rather than assumed: a single console
error, `404 /favicon.ico`. The favicon is a Phase 2 deliverable
(`app/icon.tsx`, §2.3), so this is the same deduction Phase 0 carried and not
something Phase 1 introduced.

Performance reads 95 against Phase 0's live 97, but the two are not comparable:
Phase 0's 97 was measured on the real domain behind Vercel's CDN, and this is
a local `next start` with four new sections on the page. Re-measure on
production after the merge before drawing any conclusion.

*Lighthouse was run through `npx` and is **not** a project dependency —
`package.json` is untouched.*

### What remains, and only Val can do it

1. **The phone pass** — 375 / 768 / 1024 / 1440 on a real device, portrait and
   landscape.
2. **The keyboard pass with eyes on the screen.** The Browser pane reports
   `visibilityState: "hidden"` and never fires `requestAnimationFrame`, so
   `:focus` never matches and no focus ring has ever been *observed* rendering
   in this or any previous phase. Tab order, focus trap and focus-ring CSS are
   all verified programmatically; seeing them is the gap.
3. **Open and squash-merge the PR** — body prepared, `gh` is not installed and
   the GitHub connector is unauthorised in this session.
4. **After merge:** confirm the production deployment's commit SHA matches the
   merge commit before measuring anything. Phase 0 sat eight commits stale.

---

## Phase 0 — Closeout ✅ MERGED 2026-09-11 (`9a23cbc`)

Close the gaps between Phase 0's objective and what actually shipped, then
install UI UX Pro Max as an advisory reviewer. No new sections, no redesign,
no backend. Spec: `docs/phases/PHASE-0-CLOSEOUT.md`.

Opened because a post-merge review found six things Phase 0's own exit gate
had not caught — a dead toggle, invented numbers above the fold, a false
language claim in the structured data, one English label in a Greek form, a
stale backlog row, and the two manual checks that were never run.

- [x] **S0.9** Remove the dead language toggle · 2026-09-11
- [x] **S0.10** Truth pass — numbers, structured data, labels · 2026-09-11
- [x] **S0.11** Install UI UX Pro Max with a locked-design guardrail · 2026-09-11
- [x] **S0.12** First skill review (read-only) · 2026-09-11
- [x] Closeout — manual passes, merge, production check, Lighthouse · 2026-09-11

**S0.9.** The EL|EN pill rendered in two places, the desktop utility row and
the mobile drawer, putting `aria-pressed` on four buttons that changed
nothing. Removing it was decided on 2026-09-09 (playbook §14) but never
assigned to a slice, so it survived all eight Phase 0 slices. The `Language`
type and the `lang` state went with it, and the drawer's flex wrapper too,
leaving "Δωρεάν Audit" full width on its own row (335px inside a 375px
viewport). Verified at 375, 768, 1024 and 1440px: zero EL/EN controls, zero
`aria-pressed` in the header, no horizontal overflow. The drawer's focus trap
still wraps in both directions and Escape still returns focus to the
hamburger. Lint, typecheck and build clean.

**S0.10.** Three separate truth violations, all §8. The hero simulator printed
`Latency: 380ms` and `score 0.91` — both invented constants, sitting above the
fold in a terminal surface that reads as real telemetry. `RUN_LATENCY_MS`, its
comment and the whole `Latency:` log line are gone, and stage 6 now emits one
line instead of two; the verified-lead line reads "Lead verified via AI" with
no number attached. The JSON-LD advertised `inLanguage: ["el", "en"]` for a
site with no English content until Phase 6 — now `"el"`, confirmed in the
rendered page source. And the audit form's email field was labelled "Business
Email", the one English label in a Greek form (§11.3); it reads "Email".

Nothing else in the simulator moved — no timing, animation or wording changes.
The Greek rewrite of its copy stays in the Backlog for Phase 1. Verified by
running the simulation start to finish: six log lines, ending on
`Pipeline complete · exit 0`, no latency and no score anywhere. Both exit-gate
greps return nothing. Lint, typecheck and build clean.

`SITE.locationLabel` was the fifth finding — a Backlog row still targeting
Phase 0. The value had already been corrected in S0.2 to
"Θεσσαλονίκη, Ελλάδα — εξυπηρέτηση remote", so the row was stale and is
removed rather than actioned.

**S0.11.** `ui-ux-pro-max` **2.13.0** installed at
`.claude/skills/ui-ux-pro-max/` — 73 files, 3.6 MB. Preconditions passed:
Node 24.15.0 (needs 20+), Python 3.9.6 (needs 3.x).

**Installed from a local folder, not npm.** The spec called for
`npx ui-ux-pro-max-cli@latest init --ai claude`; Val supplied a downloaded
clone at `~/Desktop/ui-ux-pro-max-skill-main/` and asked for that to be used
instead. That clone is the full marketplace payload — it ships **seven**
skills (`ui-ux-pro-max`, `design`, `banner-design`, `ui-styling`, `brand`,
`slides`, `design-system`). Only `ui-ux-pro-max` was copied; the other six are
exactly what the spec's "do not use the `/plugin marketplace` install" clause
rules out. The repo's own root `CLAUDE.md` was **not** copied — ours is
written from the spec.

Dry run before writing anything confirmed all 73 paths resolve inside
`.claude/skills/ui-ux-pro-max/`, nothing outside. Reviewed before install:
the scripts import stdlib only plus their own three local modules, with no
`urllib.request`, `requests`, `socket`, `subprocess`, `os.system`, `eval` or
`exec` anywhere — the skill is a local CSV search, not a network client.

Smoke test passes from the installed path:
`python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form submit feedback"
--domain ux -n 1` returns the Forms / Submit Feedback guideline, exit 0.

`CLAUDE.md` written at the repo root with the guardrail: design locked per
§2.4 and §10, the skill is a reviewer and never a designer, `--design-system`
and `--persist` banned, searches restricted to `ux` / `landing` / `icons` /
`nextjs`, playbook wins every conflict. Playbook gained the §2.6 Skills row,
the §6 1024px check and 44×44px tap-target rule, and two §14 decision-log
entries.

ESLint needed no `.claude/**` ignore after all — the skill contains no JS or
TS, only Python, CSV, JSON and Markdown, so `eslint .` never looks at it.
`eslint.config.mjs` is unchanged. The iCloud `* 2.ts` duplicate issue did
resurface in `.next` during this slice; clearing the directory fixed it, as
the Backlog says.

Note: `scripts/design_system.py` — the banned generator — ships as part of the
skill and was kept rather than deleted, so the install matches upstream and
stays reversible. It is governed by `CLAUDE.md`, not removed from disk.

**S0.12.** Four targeted searches, no `--design-system`, no `--persist`:
`"touch target size" --domain ux`, `"small text readability" --domain ux`,
`"trust proof section" --domain landing`, and
`"form validation accessibility" --stack nextjs`. Findings were measured
against the running homepage rather than assumed — every number below is a
rendered `getBoundingClientRect()` reading at 375px, not a class name. Nine
went to the Backlog; five recommendations were rejected (see Notes). No code
changed.

**Three things the review cleared**, recorded so they are not re-raised:
the audit form already satisfies the skill's "Submit Feedback" guideline —
`role="status"` + `aria-live="polite"`, `role="alert"` on errors,
`aria-invalid` and `aria-describedby` wired on every field, and all fields
disabled while submitting. The honeypot is out of the tab order
(`tabindex="-1"`) and visually hidden. And the Next.js "validate request body"
guideline was already met in S0.6.

**One correction to the rule added in S0.11.** The skill's WCAG entry is
explicit that web conformance for Target Size (Minimum) is **24×24 CSS px**,
and warns against treating the native 44pt / 48dp figures as web
conformance. The playbook's new 44×44px rule is therefore a self-imposed
quality bar, not a conformance requirement — every "below 44px" row in the
Backlog still passes WCAG 2.2 AA. Worth knowing before someone files them as
audit failures.

### Closeout — verified on LIVE production, 2026-09-11

Squash-merged as `9a23cbc` and pushed. Vercel deployment
`dpl_8aQpcqJD6iYNkLcWyChxB85qeiiB` is READY on target `production` and its
commit SHA matches the merge — no stale-deploy drift this time (contrast with
the Phase 0 merge, where production sat on `867f6a1` for eight commits).

`https://tavlikossystems.com` served fresh and checked directly: JSON-LD reads
`"inLanguage":"el"`, and the markup contains no EL/EN toggle, no `Latency`, no
`score 0.91` and no "Business Email".

| Metric (mobile) | Budget | Phase 0 | Now |
|---|---|---|---|
| Performance | ≥ 90 | 95 | **97** |
| Accessibility | **100** | 100 | **100** |
| Best Practices | ≥ 95 | 96 | **96** |
| SEO | ≥ 95 | 100 | **100** |

Zero failing accessibility audits. Best Practices stays at 96 for the same
reason as before — `/favicon.ico` 404s, and the favicon is a Phase 2
deliverable (`app/icon.tsx`, playbook §2.3).

**Manual checks.** Val ran the phone pass and the keyboard pass on 2026-09-11
and reported both fine. They were run against the **pre-closeout** build, by
his choice — he elected to publish first and test the new build afterwards.
Everything those checks cover is unchanged except the mobile drawer, which
S0.9 edited. The drawer was verified programmatically at 375px: focus trap
wraps in both directions, Escape closes it and returns focus to the hamburger
with `aria-expanded="false"`, and the CTA measures 335px inside a 375px
viewport. A quick re-check of the drawer on the live build is worth doing but
nothing is blocked on it.

This closeout was committed directly to `main` after the merge, matching the
precedent set by `4ed610f` at the end of Phase 0. Playbook §5 otherwise
forbids committing to `main`; a post-merge docs commit recording a production
measurement cannot exist on the branch it describes.

---

## Phase 0 — Truth & Foundations ✅ MERGED 2026-09-11 (`07038ea`)

Remove everything false, broken, inaccessible or insecure. No new sections.

Squash-merged into `main` and deployed. `https://tavlikossystems.com` now
serves this work; the placeholder site it replaced had been publicly
indexable. Slice history is preserved on the `phase/0-foundations` branch —
no PR was opened, because neither the `gh` CLI nor an authorised GitHub
connector was available in the session.

- [x] **S0.1** Repo hygiene & tooling — ESLint 9, README, docs · 2026-09-09
- [x] **S0.2** Identity constants — domain, email, brand, split hours · 2026-09-10
- [x] **S0.3** Shared navigation source — `lib/nav.ts` · 2026-09-09
- [x] **S0.4** Delete placeholder sections, fix page order · 2026-09-09
- [x] **S0.5** WCAG AA colour remediation · 2026-09-09
- [x] **S0.6** Form security & PII hygiene · 2026-09-09
- [x] **S0.7** Accessibility — focus, motion, semantics · 2026-09-09
- [x] **S0.8** Copy truth pass · 2026-09-09

**Exit gate:** no placeholders, no placeholder data, all text ≥ 4.5:1, form
spam-resistant, no PII in logs, keyboard + screen-reader complete, lint +
typecheck + build clean, Lighthouse A11y = 100.

### Exit gate — re-measured on LIVE production, 2026-09-11

`https://tavlikossystems.com`, after the merge:

| Metric | Budget | Live |
|---|---|---|
| Performance (mobile) | ≥ 90 | **95** |
| Accessibility (mobile) | **100** | **100** |
| Best Practices (mobile) | ≥ 95 | **96** |
| SEO (mobile) | ≥ 95 | **100** |

`color-contrast` and `heading-order` both pass. The only console error is the
`/favicon.ico` 404 — a Phase 2 deliverable.

### Exit gate — first measured pre-merge, 2026-09-11

Run against a **local production build** (`next start`, `NEXT_PUBLIC_SITE_URL=
https://tavlikossystems.com`). The Vercel preview could not be used: it sits
behind Deployment Protection and answers anonymous requests with a Vercel
login page.

| Gate | Budget | Measured | |
|---|---|---|---|
| Lighthouse Performance (mobile) | ≥ 90 | **95** | ✅ |
| Lighthouse Accessibility (mobile) | **100** | **100** | ✅ |
| Lighthouse Best Practices (mobile) | ≥ 95 | **96** | ✅ |
| Lighthouse SEO (mobile) | ≥ 95 | **100** | ✅ |
| `npx tsc --noEmit` | clean | clean | ✅ |
| `npm run lint` | clean | clean | ✅ |
| `npm run build` | clean, no warnings | clean | ✅ |
| No placeholder text or data | none | none | ✅ |
| Text contrast | all ≥ 4.5:1 | 146 nodes, 0 failures exposed to AT | ✅ |
| Form: normal / honeypot / fast / no-stamp | 200, deliver only the real one | 4× 200, 1 delivery | ✅ |
| Form: rate limit | 5/hour per IP | 5 → 200, 6th → 429 | ✅ |
| Form: PII in logs | none | 0 matches for name, email, phone | ✅ |
| Origin check | reject foreign | canonical + preview 200, foreign & absent 403 | ✅ |
| Heading order | no skips | 0 skips, one `h1` | ✅ |
| Horizontal overflow | none at 375/768/1440 | none | ✅ |
| Page ends on the CTA | `#audit` last | `#audit` last | ✅ |

Best Practices is 96, not 100, because `/favicon.ico` 404s. The favicon is a
**Phase 2** deliverable (`app/icon.tsx`, playbook §2.3), so it is not a Phase 0
miss and the score still clears the Phase 0 budget.

**Still owed by Val, cannot be automated:**

- Open the preview on a real phone, portrait and landscape.
- One keyboard-only pass with eyes on the screen. Tab order, focus trap and
  focus-ring CSS were all verified programmatically, but the Browser pane runs
  hidden, so `document.hasFocus()` is false and `:focus` never matches — no
  focus ring was ever observed rendering.

---

## Upcoming phases

| # | Phase | Status |
|---|---|---|
| 1 | Homepage Restructure | **10/10 slices done** · closeout measured · awaiting Val's manual passes + merge |
| 2 | Multipage & SEO | **12/12 slices done** · code-complete, awaiting Val |
| 3 | Backend & Go-Live | Not started · **← LAUNCH** · **next up**. Scope now explicitly includes revising `/privacy` in the same slice that wires delivery (playbook §3, D3) |
| 4 | Craft & Motion | Not started |
| 5 | Evidence | Asset-gated · can start any time · **BTL Industries and roz-inn.com both cleared** |
| 6 | English | Not started |
| 7 | Blog | Not started |
| 8 | Operate | Ongoing after launch |

---

## Completed phases

| # | Phase | Merged | Result |
|---|---|---|---|
| 0 | Truth & Foundations | 2026-09-11 · `07038ea` | 8 slices. Placeholders, wrong identity data, sub-AA contrast, unprotected form and PII logging all removed. Live Lighthouse mobile: **95 / 100 / 96 / 100**. |
| 0 | Closeout | 2026-09-11 · `9a23cbc` | 4 slices. Dead language toggle, invented hero metrics and the false English claim removed; ui-ux-pro-max installed as an advisory reviewer with a `CLAUDE.md` guardrail; first review logged 9 backlog findings and rejected 5 recommendations. Live Lighthouse mobile: **97 / 100 / 96 / 100**. |

---

## Backlog

Discovered outside the current slice. Do not fix in place — log here, schedule later.

| Item | Found in | Target phase |
|---|---|---|
| Showcase cards carry ~9 elements each at equal weight — needs real hierarchy | Audit | 4 |
| Rate limiting is per-instance on serverless — move counter to Supabase | S0.6 | 3 |
| Preview deployments share the production rate-limit and origin rules; if preview traffic ever matters, key the limiter per deployment | Exit gate | 3 |
| Rate limit counts requests before validation, so a failed submit consumes a slot. Harmless today (the client validates with the same function first) but revisit with the Supabase counter | S0.6 | 3 |
| Proof strip ships with two named references and an empty testimonial slot. The **assets** half is still open: Fiverr quotes, screenshots and Val's photo | S0.12 · structure closed S1.6 | 5 |
| Framer Motion ignores `prefers-reduced-motion`: `globals.css` collapses CSS animation and transition durations under the media query, but height/opacity driven through JS never sees it. Affects the FAQ disclosure, `ShowcaseCard` and the `Navbar` drawer — fix all three together with `useReducedMotion`, since fixing one leaves the page with two behaviours | S1.9 | 4 |
| `PipelineSimulator` run button (`0.12` / hover `0.22`), its completed node (`0.12`) and the form field's focus border (`0.25`) sit outside the two-value hairline system. All three are control emphasis or focus states rather than structural hairlines, so S1.2 left them raw — decide in Phase 4 whether they become a named `emphasis` ramp | S1.2 | 4 |
| 36 raw `zinc-100/200/300/400` **text** colours across the components, plus `hover:bg-zinc-200` in `globals.css` — a second text ramp competing with the documented `ink` ramp. All clear AA, so this is token discipline, not contrast. S1.1 was scoped to the five decorative `zinc-600/700/800` greys only | S1.1 | 1 |
| `SERVICE_CATALOG` claims "AI Concierge & Voice/Chat Agents", which feeds `knowsAbout` and the schema offer catalog, but **no voice work has been delivered** — the showcase's concierge architecture is labelled indicative. S2.4 left voice off `/automations` under §8.5 and did not touch the catalog, because it is a structured-data decision rather than a copy tweak: either the claim comes out, or Phase 5 supplies something that backs it | S2.4 | 5 |
| Lighthouse mobile Performance reads **93** on `/` and 94 on `/websites` against Phase 1's 95, both on a local `next start`, with LCP 2.9s → 3.2s. Phase 4 owns performance (its gate is Perf ≥ 95 with budgets in CI); chasing LCP in a phase that does not own it is how a slice stops being reviewable | S2.12 | 4 |
| `text-decor` / bullet marks, the `dl` pairs on `/process` and `/about`, and the legal pages' prose were all built with the existing primitives, but the two service pillars, `/work` and `/process` now share a shell (`PageShell`, `ServiceSection`, `FeatureGrid`, `BulletList`, `ServiceCta`, `ArrowLink`) that no one has design-reviewed as a system — worth one pass in Phase 4 alongside the bento hierarchy row | S2.4 | 4 |
| `.claude/launch.json` is committed — decide whether to keep tracked | Audit | any |
| Vercel production still served `867f6a1` while eight Phase 0 commits sat unpushed, and that build was marked `index, follow` with placeholder copy live. Watch for stale-deploy drift again after any long local run | Deploy | 8 |
| Project lives in an iCloud-synced folder; sync creates `* 2.ts` / `* 2.json` duplicates inside `.next` that break `tsc --noEmit` until the cache is cleared. Consider moving the repo outside iCloud | S0.7 | any |
| `.DS_Store` files are tracked-adjacent clutter in the working tree; `.gitignore` covers them but stray copies exist | S0.1 | any |

### Closed during Phase 2

| Item | Found in | Closed by |
|---|---|---|
| `NAV_LINKS` entries were in-page anchor ids with an `href` escape hatch marked "set once routes exist in Phase 2" | S1.4 · nav.ts | S2.12 |
| Footer's «Επιστροφή στην αρχή» pointed at `#hero`, which exists on one route of eleven | S2.12 | S2.12 |
| `FaqSection` was a Client Component wrapping the whole section | S1.4 lineage | S2.8 — `FaqList` is the leaf now |
| Two `null` portrait slots would have existed in two files | S2.7 | S2.7 — `PORTRAIT` lives in `lib/site.ts` |
| ~~Honeypot `company` lacks `aria-hidden`, so a screen-reader user can reach and fill it~~ — **the row was stale.** Checked against the rendered build while measuring `/contact`: the wrapper emits `aria-hidden="true"` and the input carries `tabindex="-1"`, so the subtree is out of the accessibility tree and out of the tab order. Fixed at some point after S0.12 logged it and never struck off. Left in place, it would have sent a Phase 3 session to fix something already fixed | S0.12 | verified S2.2 |

### Closed during Phase 1

Kept per §7.5 — completed work collapses, it does not disappear. S1.10 folds
this into the phase summary.

| Item | Found in | Closed by |
|---|---|---|
| 11 hardcoded hex values in components (`#0D0F16`, `#12151E`, `#08090D`) | Audit | S1.1 |
| Extract `Badge` / `Card` / `SectionHeader` / `Eyebrow` primitives — pill string duplicated ~16× with drifting opacity | Audit | S1.2 |
| Mobile menu button 36×36 | S0.12 | S1.3 |
| Nine footer links 15–17px tall | S0.12 | S1.3 |
| Three "Τεχνική αρχιτεκτονική" buttons at 39px, simulator run button at 38px | S0.12 | S1.3 |
| Contact card: phone 28px, email 34px, WhatsApp and Telegram 34px | S0.12 | S1.3 |
| Brand button 168×20 | S0.12 | S1.3 |
| Footer "Back to top" used a bare `href="#"` | S0.3 | S1.4 |
| `PipelineSimulator` copy entirely English on a Greek page | S0.8 | S1.5 |
| No proof section between the hero's claim and the form (structure half) | S0.12 | S1.6 |
| `ArchitectureTrace` dashed connector uses raw `zinc-700` | Audit | S1.1 |
| `PipelineSimulator` node ring used raw `border-zinc-600` / `border-zinc-800` | S0.5 | S1.1 |
| 28 usages of 10–11.5px text across 7 files | S0.12 | S1.1 |
| Footer and Navbar used two different nav mechanisms | Audit | S1.4 + S1.10 |
| 1024–1279px was a third, unexercised nav state | S0.12 | S1.10 |
| `ShowcaseGrid` case copy still English — titles, trace nodes, stack rows | S1.10 exit gate | closeout |
| `PipelineSimulator` node ring uses raw `border-zinc-600` / `border-zinc-800` | S0.5 | S1.1 |
| 28 usages of 10–11.5px text across 7 files | S0.12 | S1.1 |

---

## Notes — recommendations rejected

From the S0.12 review. Logged so the same suggestions are not re-applied later
by a session that has the skill loaded but not the playbook.

| Recommendation | Source | Why rejected |
|---|---|---|
| "Navy/Grey corporate. Trust blue. Accent for CTA only." | `landing` → trust-authority-conversion | Playbook §2.4 locks monochrome with emerald for live status dots only |
| "Testimonials: Light bg #F5F5F5. Quotes: muted #666" | `landing` → hero-testimonials-cta | Light surfaces contradict the near-black system in §2.4 and §10 |
| "Icon color #0080FF. Text: Dark #222" | `landing` → product-demo-features | Second accent colour, and raw hex violates §10.1 (tokens only) |
| "Star ratings gold. Verified badge green." | `landing` → product-review-ratings-focused | Two more accent colours; §10.2 allows exactly one |
| Auto-rotating testimonial / logo carousel with pause controls | `landing` → trust-authority-conversion, hero-testimonials-cta | §2.4 bans autoplay and caps motion at scroll reveals and hovers; the accessible-carousel advice is sound but the carousel itself is out |

Deferred rather than rejected: the Next.js guideline to use Server Actions for
form mutations. The form deliberately posts to `/api/audit`, which carries the
origin allowlist and rate limiting from S0.6. Phase 3 owns delivery and can
weigh it then.

---

## Blockers

| Blocker | Blocks | Owner | Due |
|---|---|---|---|
| Fiverr review quotes not selected | Phase 5 | Val | — |

### Resolved

- ~~**Brand name + domain + business email**~~ — resolved 2026-09-10.
  `Tavlikos Systems` on `tavlikossystems.com`, mailbox `info@tavlikossystems.com`.
- ~~**Vercel deploy failing**~~ — resolved 2026-09-11. The project's
  `NEXT_PUBLIC_SITE_URL` entry existed with an empty value. The old `??`
  fallback only guards `null`/`undefined`, so `""` reached
  `new URL("")` and the build died on a bare `TypeError: Invalid URL`.
  Fixed in Vercel, and the guard now validates rather than only checking
  presence.
- ~~BTL Industries naming permission~~ — cleared, freelance engagement, no NDA
- ~~`roz-inn.com` live and linkable~~ — confirmed yes; currently your only live client URL
- ~~ΑΦΜ / registration~~ — not planned; all invoicing and compliance claims removed from every phase

---

## Decisions changed since the playbook was written

- **2026-09-12 — D1: a deeper page expands its homepage section, it never
  copies it.** §2.3 says the homepage carries highlights; Phase 1 built the
  sections at full length because there was nowhere else to put them. So
  `/process` and `/faq` take the full content and the homepage keeps three
  one-line steps and four of six objections. The homepage gets **shorter** in
  Phase 2, in two places, on purpose. Val approved before any slice ran.
- **2026-09-13 — D2 amended: one stale sentence in the showcase lede also
  changed.** The lede promised «Τα πρώτα ονομαστικά case studies προστίθενται
  σύντομα», which `/work` made false while it sat above a link to those very
  case studies. Replaced with a pointer to `/work`. The §8.2 framing sentence,
  the heading, the eyebrow and the thirteen trace nodes are untouched — inside
  D2's intent, but recorded because D2 said this copy would not change.
- **2026-09-12 — D2: the showcase keeps «Ενδεικτικές Αρχιτεκτονικές» and gains
  an exit.** This settles the question deferred on 2026-09-11. The framing is
  honest and §8.2 requires that label for architectures describing capability;
  what the section lacked was a way to reach delivered work. S2.5 adds one
  link to `/work` and links the `lead-engine` card to the BTL case study.
  Heading, eyebrow and the thirteen translated trace nodes are untouched, so
  S1.10's closeout copy is not spent twice. Val approved.
- **2026-09-12 — D3: `/privacy` and `/terms` are built in Phase 2; the privacy
  page is revised in Phase 3.** §2.3 lists `/privacy` in the route tree Phase 2
  builds and §3 lists it inside Phase 3's objective — the playbook contradicts
  itself. Resolution: the routes ship now describing what the site actually
  does today (a form validated and discarded, no database, no processor, no
  tracking), and Phase 3 revises the privacy page in the same slice that wires
  delivery. Playbook §14 and Phase 3's scope both need this written down.
  Val approved, and reads both pages before the Phase 2 PR merges.

- **2026-09-11 — The about section names Valsamis Ταυλίκος.** Val delegated
  the call. Its heading asks «Με ποιον θα δουλέψετε» and left it unanswered,
  and §12 rates the solo-operator objection as the one that kills deals
  silently. §2.1's guardrail forbids claiming *more* people than exist, never
  stating the one who does, so naming him is the maximally compliant move.
  `SITE.person` now holds the name for Phase 2's `/about` and `Person` schema.
- **2026-09-11 — The showcase's "Ενδεικτικές Αρχιτεκτονικές" framing is
  re-examined in Phase 2, not Phase 1.** BTL is now named in the proof strip
  while the same system still sits in the showcase as a hypothesis. Val chose
  to fix that when `/work` exists rather than rewrite the section twice.
- **2026-09-09 — Voice reversed to first person plural.** The site speaks as
  "we". Guardrail: plural voice, singular facts — no team, department or
  headcount claims. Playbook §2.1 and §11.1.
- **2026-09-10 — Brand reversed back to "Tavlikos Systems".** Val registered
  `tavlikossystems.com`, so the name follows the domain. This undoes the
  2026-09-09 decision for bare `Tavlikos`. Playbook §2.1 and §14.
- **2026-09-09 — Registration markers dropped entirely.** Not deferred to
  Phase 5; deleted from the roadmap. Playbook §2.2.
- **2026-09-09 — S0.1 uses the native `eslint-config-next` flat config**
  instead of the `@eslint/eslintrc` `FlatCompat` wrapper the spec called
  for. v16 of that package ships real flat configs; routing them through
  `FlatCompat` throws `Converting circular structure to JSON`. `@eslint/eslintrc`
  is therefore not a dependency.
- **2026-09-09 — Slice entries record the date, not the commit SHA.**
  Playbook §7.2 asks for both, but a commit cannot contain its own SHA and
  §7.1 forbids a follow-up commit. One commit per slice plus
  `git log --grep "Slice: S0.1"` gives the same traceability.

_See `docs/PROJECT-PLAYBOOK.md` §14 for the full decision log._
