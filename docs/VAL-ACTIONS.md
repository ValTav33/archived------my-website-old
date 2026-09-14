# VAL ACTIONS — the queue of things only Val can do

**Last synced:** 2026-09-14, after the Phase 3.5 content pass. **Nothing on this list is blocking.**

---

## What this file is

The single list of work that **requires Val personally** — because it needs a
human's eyes, a human's judgment, an account only Val can sign into, or an
asset only Val can supply.

It exists because that work kept accumulating inside phase write-ups, one
paragraph at a time, in three different documents. By the end of Phase 2 there
were fourteen such items spread across `PROGRESS.md`, the playbook's open
questions and two phase specs. A list you have to reassemble before you can
act on it is not a list.

### How it relates to the other documents

| File | Owns |
|---|---|
| `docs/PROJECT-PLAYBOOK.md` | the **rules** and the phase map |
| `PROGRESS.md` | the **state** of the work — what is built, measured, and true right now |
| **this file** | the **queue of actions that need Val**, with the exact steps |
| `docs/phases/PHASE-N-*.md` | the spec for one phase |

It does not duplicate `PROGRESS.md`. Where a claim about *state* appears in
both, `PROGRESS.md` wins — playbook §7. This file is a work queue, not a
record.

### How it is maintained

- A slice that **creates** a Val-owned item adds it here, in the same commit,
  the same way `PROGRESS.md` is updated (playbook §7.1).
- A slice that **clears** one moves it to *Done* at the bottom with the date.
  Completed items collapse; they do not disappear — §7.5.
- Items carry stable ids (`V1`, `V2`, …) so a commit message or a conversation
  can point at one without repeating it.
- **Val does not have to update this file.** Tell the session what you did and
  it moves the row.

### How to read the priority column

| | |
|---|---|
| 🔴 **Blocking** | something is waiting on it right now |
| 🟠 **Before launch** | not blocking today, must be true before Phase 3 ships |
| 🔵 **When convenient** | real, not urgent |
| ⚪ **Asset-gated** | waiting on something from the outside world |

---

## 🔴 Blocking right now

These are in the order they need doing. V1 and V2 gate the two merges, and the
merges gate Phase 3.

### V1 — Read `/privacy` and `/terms`

**Why it is yours:** this is the condition attached to decision D3, and it is
the one place on the site where a drafting error has consequences off the
website. Every sentence was written against the code rather than from a
template — `app/api/audit/route.ts` read line by line, and each claim
cross-checked against the build — but "I verified it describes the code" is a
different statement from "a human read it and is willing to stand behind it".

**How:**

```bash
npm run dev
```

Then open `/privacy` and `/terms`.

> **Phase 3 rewrote `/privacy` five times, one revision per slice, so the
> version you were first asked to read no longer exists.** Read the current
> one. `/terms` is unchanged since S2.9.
>
> **Do this before the merge, not after.** The page now describes real data
> processing — a database, two processors, a retention period — so a mistake
> in it is a mistake about what you are actually doing with people's details.
>
> **`/terms` also changed, in Phase 3.5.** Its «Σε ποιον ανήκει ο κώδικας»
> section no longer says the repository is in your name from day one — it says
> delivery and ownership are agreed in writing per project, because your
> packages differ. That is the sentence with the most legal weight on the site
> and it is the one to read most carefully.
>
> **Read both on the deployment, here** *(link works until 15 Sep, no sign-in
> needed)*:
> `https://my-website-git-phase-3-backend-valtav33s-projects.vercel.app/privacy?_vercel_share=xbn58HlVESroBMcjx5WKp0NpEQnh3iI5`

**What changed, so you can check each claim rather than re-read blind:**

| Now says | Added by |
|---|---|
| The request arrives **as an email** and is kept in a mailbox; **Resend** is a processor | S3.3 |
| A copy is **stored in a database**, in the EU (Frankfurt); **Supabase** is a processor | S3.4 |
| The **IP is not kept** — a keyed digest of it is, for one hour, in a separate table | S3.5 |
| The database copy is **deleted after 24 months**, by a job that runs daily | S3.6 |
| **Visits are measured** with Vercel Analytics, and the numbers are **not joined to the form** | S3.7 |

Four claims from the version you were first shown are **gone**, because they
became false: «δεν αποθηκεύονται σε βάση δεδομένων», «δεν καταγράφονται
πουθενά», «Δεν υπάρχουν analytics», and Vercel as the only other party. Their
absence from the rendered HTML was verified, not assumed.

**Two judgment calls in there worth your explicit yes or no:**

1. **24 months** is the retention you approved, and the page states it as a
   number interpolated from the code, so the page and the deletion cannot
   disagree. If you want 12, say so — it is one constant.
2. **The mailbox is not swept automatically, and the page says so.** The
   database copy expires; the email in your inbox does not, because an inbox
   is a conversation. Claiming otherwise would have been the easier sentence
   and an undefendable one.

**Also still worth checking:**

- The terms deliberately contain **no** forum-selection clause naming courts,
  **no** refund or cancellation schedule, and **no** limitation-of-liability
  boilerplate. None of those are written down anywhere in this repo, and
  inventing commercial terms on your behalf is not a decision a page can make
  for you. If you want any of them, they need your actual position first.
- §8.6 is swept and clean on both pages: no ΑΦΜ, no myDATA, no τιμολόγιο, no
  «εταιρεία», no ΓΕΜΗ. Keep it that way until registration is a fact.

**Done when:** you have read both and either approved them or told the session
what to change.

---

### V2 — The phone pass and the keyboard pass

**Why it is yours:** two different reasons, and only one of them is a tooling
limitation.

The **phone pass** needs a real device because a 375px devtools viewport is
not a phone — it has no thumb, no Safari chrome eating the viewport, no
address bar collapsing on scroll, and no landscape.

The **keyboard pass** is a genuine gap in what this session can see, and it
has been the same gap since Phase 1: the Browser pane reports
`visibilityState: "hidden"` and never fires `requestAnimationFrame`, so
`:focus` never matches and **no focus ring has ever been observed rendering**
in any phase. Tab order, the drawer's focus trap and the focus-ring CSS are
all verified programmatically, every time. Seeing them is what is missing.

**How — phone:** open the preview (or `npm run dev` on your machine's LAN
address) on your actual phone and walk all eleven routes, portrait and
landscape:

`/` · `/websites` · `/automations` · `/work` · `/work/btl-industries` ·
`/process` · `/about` · `/faq` · `/contact` · `/privacy` · `/terms`

**How — keyboard:** on a desktop browser, `Tab` from the top of each page.

**What to look for:**

- A **visible focus ring** on every stop. This is the one thing no automated
  check here has ever confirmed.
- The first `Tab` lands on «Μετάβαση στο περιεχόμενο» (the skip link) and it
  becomes visible when focused.
- Open the mobile drawer with the keyboard, `Tab` through it — focus must stay
  inside the panel and wrap at both ends — then `Esc` must close it and return
  focus to the hamburger.
- On `/faq` and the homepage's FAQ, `Enter` and `Space` both toggle a
  disclosure, and the chevron rotates.
- Nothing is reachable that should not be: the honeypot field is
  `aria-hidden` with `tabindex="-1"` and must never receive focus.

**Already measured programmatically, so you are confirming rather than
hunting:** 12 routes × 4 widths, 316–376 interactive elements per width, zero
under 44×44 with the smallest side exactly 44, zero horizontal overflow, zero
text below 12px, no positive `tabindex`, tab order following document order.

**Done when:** you have walked both passes and reported anything that looked
wrong.

---

### V3 — Vercel Deployment Protection 🔵 *(downgraded — no longer blocking)*

**Why it is yours:** the session's permission classifier blocked the API call,
twice. It is a settings change on your account and it stays yours.

> **Resolved a different way, 2026-09-14 — you do not have to change this
> setting.** The Vercel connector available to a session can mint a 23-hour
> bypass cookie for a protected deployment, which makes the preview both
> readable and submittable. Phase 3's whole exit gate was measured that way
> with protection left on. Flip it only if *you* want to open previews in your
> own browser without signing in.
>
> Kept on the list because the history matters: this blocked three phases, and
> the fix turned out to be a tool nobody had checked for.

The original reasoning, for the record. Phases 0, 1 **and** 2 all fell back to
a local `next start`, because anonymous requests — Lighthouse included — get
`<title>Login – Vercel</title>`. Phase 3 could not afford to fall back, for two
independent reasons measured during the phase:

1. The exit gate is *"a real submission lands in Supabase and in your inbox"*.
   That is a claim about a deployment; localhost cannot make it.
2. **Since S3.7, localhost cannot produce Best Practices = 100 at all.** The
   analytics component loads `/_vercel/insights/script.js`, a path only the
   platform serves, so a local run logs one console error and scores 96
   against a budget of 100. Measured before and after: the 404 is the entire
   difference.

**Current setting, read from the API:** project `my-website`,
`ssoProtection: { enabled: true, deploymentType: "all_except_custom_domains" }`.

**How** — Vercel → project `my-website` → **Settings → Deployment
Protection**, then either:

1. **Protection Bypass for Automation** *(narrower, preferred)* — generate a
   secret. Previews stay behind the login wall for humans; automated tools
   pass with
   `?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=<secret>`.
   Put it in `.env.local` as `VERCEL_AUTOMATION_BYPASS_SECRET` and tell the
   session it is there.
2. **Vercel Authentication → Disabled** *(simpler)* — previews become readable
   by anyone holding the URL.

**Option 2 is now safe, and was not before S2.1.** Preview deployments carry
`noindex` (`IS_INDEXABLE` in `lib/seo.ts`) **and** `robots.txt` returns a
blanket disallow on previews. Two independent signals, which is why this was
sequenced before the setting changed rather than after.

**Done when:** either option is in place, so the next phase can measure the
real deployment.

---

### V5 — After each merge, check the deployed SHA

**Why it is yours:** it needs the Vercel dashboard.

**Why it exists:** Phase 0 sat **eight commits stale** in production while
the deployed build was marked `index, follow` and served placeholder copy. It
is in the Backlog as a thing to watch for after any long local run, and the
check is thirty seconds.

**How:** Vercel → `my-website` → Deployments → confirm the Production
deployment's commit SHA equals the squash-merge commit on `main`.

**Done when:** the SHAs match. If they do not, redeploy before measuring
anything — a Lighthouse number from a stale build is worse than no number.

---

## 🔴🟠 Phase 3 — the launch blockers

### ~~V6 — Supabase credentials~~ ✅ *cleared 2026-09-14*

**The project now exists.** You approved creating it, so a session did:
**`tavlikos-systems-website`, `eu-central-1` (Frankfurt), free tier,
€0/month**, in your own organisation. Migration `0001` is applied and
verified — both tables, RLS on with zero policies, every check constraint in
the catalogue, and `SELECT`/`INSERT`/`DELETE` refused from outside with both
browser-safe key forms, eight attempts out of eight.

**What is left is yours, because it is a secret no session should hold.** Three
values, in `.env.local` **and** in Vercel for **Production and Preview** both:

| Variable | Where it comes from |
|---|---|
| `SUPABASE_URL` | Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API Keys → **`service_role`** |
| `AUDIT_IP_SALT` | `openssl rand -hex 32` |

**Three things the code will catch for you, so you do not have to be careful:**

- Pasting the **publishable/anon** key into `SUPABASE_SERVICE_ROLE_KEY` is
  rejected at config time with a message saying so. That key sits next to the
  right one in the dashboard, and with RLS on it would otherwise fail as
  *silence* — every submission delivered and archived nowhere.
- An **empty value** is treated as absent rather than as configured. That is
  the exact failure that killed a production build once already.
- A missing `AUDIT_IP_SALT` **stops the build** rather than quietly weakening
  the rate limiter. `/privacy` promises your visitors' IPs are not stored; the
  salt is what makes the stored digest irreversible.

**Done when:** all three are set in both environments and a submission on the
deployment produces one row.

---

### ~~V7 — The Resend key~~ ✅ *cleared 2026-09-14 — a real submission was delivered and archived locally*

**Why it is yours:** an account and an API key.

**What changed:** `deliverAuditRequest` is no longer a stub — S3.3 wired it to
Resend. Every failure path is measured (no key → 502, bad key → 502 logging
status 401, honeypot and timing paths → 200 with nothing sent). **The one
thing never tested is a successful send,** because that needs the key, and it
is the first line of this phase's exit gate.

**Understand this before the merge:** with no key configured, a correctly
filled form now returns 502 and tells the visitor to **call instead** of
promising 24 hours. That is deliberate — the honest failure, chosen over a
fallback that makes a missing transport look like it worked — but it means the
key has to be in place *before* this branch reaches production, not after.

**Two values:**

| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | resend.com → API Keys → Create. Sending permission is enough. |
| `AUDIT_NOTIFY_TO` | **Set this, at least at first.** Until a sending domain is verified, Resend delivers only to the address the Resend account was opened with. Aimed at `info@tavlikossystems.com` it comes back 403 — on the single submission the gate cares about. Put the account address here and delete the line once the domain is verified. |

**Done when:** a submission on the deployment arrives in your inbox with all
six fields and Greek intact, and you can hit reply and reach the visitor
(`reply_to` is set to their address).

---

### V21 — Merge the Phase 3.5 PR 🔴

**Why it is yours:** the same three walls as V4. `gh` is not installed, the
GitHub connector is unauthorised in this session, and a local merge onto
`main` is refused by the permission classifier as *Merge Without Review* —
which is playbook §5 enforced by tooling rather than by discipline.

**One PR, one branch.** `phase/3.5-content`, branched cleanly from `main`, so
there is no stack and no rebase this time.

```
https://github.com/ValTav33/my-website/compare/main...phase/3.5-content?expand=1
```

Title, then paste the body a session hands you, then **Squash and merge**.

**What this changes on the live site:** the surname, every ownership and
account claim, every technology name, the FAQ set, the homepage's about
paragraphs, and a new `/pricing` route. No backend behaviour changes at all —
the form, the database and the cron are untouched by this phase.

**Done when:** `main` carries it and production serves the new SHA.

---

### V19 — `CRON_SECRET` 🟠 *(generated locally; still needs setting in Vercel)*

**Why it is yours:** a generated secret, same reason as the rest.

S3.6 added a daily job at 04:00 UTC that deletes expired leads and keeps the
free-tier project from pausing. Vercel sends `Authorization: Bearer
$CRON_SECRET` on scheduled invocations.

```bash
openssl rand -hex 32
```

**With no value set, that route refuses every request, including one carrying
the correct secret** — verified in both configurations. It deletes rows, and
"the secret is not set yet" is precisely when failing open would publish a
public deletion endpoint on a site holding other people's personal data.

**The consequence of leaving it unset is not cosmetic.** Nothing prunes, so
`/privacy`'s 24-month promise is unenforced, and nothing keeps the project
awake, so the archive stops accepting writes after about a week of quiet.

**Done when:** set in Vercel for Production, and the Cron tab shows a
successful run.

---

### V20 — Verify the Resend sending domain 🟠 *(upgraded: do this soon)*

Three DNS records on `tavlikossystems.com`. **Measured 2026-09-14:** sending
from `info@tavlikossystems.com` returns
`403 — The tavlikossystems.com domain is not verified`, so until this is done
every notification goes out from Resend's sandbox address. That is deliverable
but spam-prone, which is why this moved up the list.

Your DNS is on **Cloudflare**, so it is three records in a panel you already
use. Resend scopes its records to a `send.` subdomain plus a
`resend._domainkey` TXT, so it should not collide with the root `MX` records
Cloudflare Email Routing uses for `info@tavlikossystems.com` — confirm that on
Resend's domain page as you add them rather than taking my word for it.

Still not on the launch path — that was deliberate, so DNS could not hold up
the phase — but worth doing soon:

- Notifications would come **from** `info@tavlikossystems.com` instead of
  Resend's sandbox sender, which is better for deliverability and stops your
  own lead notifications looking like someone else's mail.
- `AUDIT_NOTIFY_TO` (V7) can then be deleted, and notifications go to the real
  business mailbox rather than wherever the Resend account was opened.
- It is also the prerequisite for ever sending the **visitor** a confirmation
  email, which this phase records as a deliberate non-goal rather than an
  omission.

**Done when:** the domain shows verified in Resend and `AUDIT_MAIL_FROM` is
set to `Tavlikos Systems <info@tavlikossystems.com>`.

---

### V9 — The BTL agreement, one glance

Playbook §15 Q2 cleared BTL for naming (freelance engagement, no NDA in
force) and adds: *worth a glance at any signed agreement before it goes live.*
BTL is now named in the proof strip, on `/automations`, on `/work` and on its
own case study at `/work/btl-industries`. Worth the glance before `main`
reaches production.

---

## Decisions only you can make

Each of these has a recommendation and a real consequence either way. None is
blocking today.

### V12 — `.claude/launch.json` is committed 🔵

Tracked in git. Decide whether it stays. It is genuinely useful to a session
(it is how the dev server gets started) and genuinely a local-tooling file.
**Recommendation:** keep it tracked. It has no secrets and it makes the repo
self-describing.

---

## ⚪ Asset-gated (Phase 5, can start the day an asset exists)

Phase 5 is deliberately parallel — playbook §3: *the moment you get a
screenshot or a testimonial, it goes in, regardless of which phase is open.*
Every slot below is **built and renders nothing while empty**. Phase 0 spent
eight slices removing placeholders, so none of these grew a skeleton or a grey
box.

### V13 — Fiverr testimonial quotes

The one entry in `PROGRESS.md`'s Blockers table, and playbook §15 Q4. Pick the
specific quotes. Each needs attribution per §8.4 — **a name, or role + sector
+ city**; anonymous praise reads as invented. `TESTIMONIALS` in `lib/site.ts`
is an empty array and `ProofStrip` renders nothing at all while it is empty.

### V14 — Your photo

`PORTRAIT` in `lib/site.ts` is `null`. Setting it is the entire change: both
`/about` and the homepage's about section read that one constant, and
`/about` currently renders **zero** `img` elements. One photo, and a sentence
of alt text describing what is in it.

### V15 — Screenshots of delivered work

The `/work` index and `/work/btl-industries` are text-only. Screenshots are
the cheapest credibility on the site. BTL is a pipeline, so a screenshot of
the workflow or the enriched sheet; roz-inn is a live site, so its own URL is
already doing that job.

### V16 — A second case study

`/work/[slug]` generates a page **only** for a `PROOF` entry with a `study`
body, which is why `/work/roz-inn` is a genuine 404 today: a presentation site
with a gallery and a live URL has nothing to expand into. The day roz-inn's
booking and payment build ships, it earns a page. Anything else delivered and
nameable does too.

---

## 🔵 Environment housekeeping

### V17 — The repo lives in an iCloud-synced folder

`~/Documents/My Website` is synced, and sync writes duplicate files like
`routes.d 3.ts` into `.next/types`, which breaks `npx tsc --noEmit` until the
cache is cleared. **It bit again during S2.9** — four duplicate files, two
spurious type errors — and the fix is always `rm -rf .next/types`.

It is noise rather than damage, but it makes every clean typecheck one step
longer and it will eventually be mistaken for a real error.
**Recommendation:** move the repo outside iCloud, e.g. `~/dev/tavlikos`. Git
is the backup; iCloud is adding nothing here.

### V18 — Stray `.DS_Store` files

`.gitignore` covers them; stray copies exist in the working tree. Harmless,
one command, listed only so it stops being rediscovered.

---

## Done

Kept so the history is legible, per §7.5. Completed items collapse to one
line.

| id | Item | Cleared |
|---|---|---|
| — | Brand name, domain and business email decided | 2026-09-10 — `Tavlikos Systems` / `tavlikossystems.com` / `info@` |
| — | BTL Industries cleared for naming | 2026-09-09 — freelance engagement, no NDA (glance at the agreement is V9) |
| — | `roz-inn.com` confirmed live and linkable | 2026-09-09, re-checked 2026-09-11 |
| — | Registration / ΑΦΜ question | 2026-09-09 — not planned; all invoicing and compliance claims removed from every phase |
| — | Vercel deploy failure | 2026-09-11 — `NEXT_PUBLIC_SITE_URL` existed with an empty value; fixed in Vercel and the guard now validates |
| — | Phase order — Phase 1 before Phase 3 | 2026-09-11 — closed, do not re-raise |
| — | D1, D2, D3 approved | 2026-09-12 — before any Phase 2 slice ran |
| — | Supabase **project** created | 2026-09-14 — `tavlikos-systems-website`, `eu-central-1`, free tier, €0/month; migration applied and verified. The **credentials** are still V6 |
| V8 | Analytics: yes or no | 2026-09-14 — **yes**, Vercel Analytics, installed in S3.7. Measured: Performance unchanged at 93, Best Practices 100 → 96 **locally only**, from the insights-script 404 that the platform serves |
| V11 | Should `/privacy` say the form delivers nowhere? | 2026-09-14 — **moot.** S3.3 made the form deliver, so there is no gap to disclose. The page now describes what actually happens, five revisions deep |
| V10 | `SERVICE_CATALOG` claimed voice agents | 2026-09-14 — **closed by S3.5 S3**, and it was in two places, not one: the catalogue *and* the footer's service list, which renders on all eleven routes. Both gone. The showcase's AI-concierge card stays, because it is labelled «Ενδεικτικές Αρχιτεκτονικές» and §8.2 permits that |
| V4 | Merge the Phase 1-3 PRs | 2026-09-14 — merged as one squash commit `b76e3f5`, PR `#1`. Production verified by SHA |
| V5 | Check the deployed SHA after merge | 2026-09-14 — production serves `b76e3f5`, tree byte-identical to the verified branch |
| V19 | `CRON_SECRET` | 2026-09-14 — set in Vercel; the cron route answers 401 without it on production |
| V3 | Vercel Deployment Protection | 2026-09-14 — **not needed.** Protected previews turned out to be measurable via the connector's bypass cookie. Setting left on |
| — | D3 — lead retention period | 2026-09-14 — **24 months**, enforced by the S3.6 job, interpolated into `/privacy` from the code |
