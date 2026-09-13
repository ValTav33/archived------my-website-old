# VAL ACTIONS — the queue of things only Val can do

**Last synced:** 2026-09-13, at the Phase 2 closeout.

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

**What to look for, specifically:**

- The privacy page says submissions are **not stored**, that name, email and
  phone are **never logged**, that there are **no cookies, no analytics and no
  trackers**, and that **Vercel is the only other party**. All four are true
  today. All four stop being true in Phase 3.
- It does **not** announce that the form currently delivers nowhere. That was
  a judgment call, not an oversight: your Phase 1 decision was to keep the
  24-hour promise as written and treat the stub as temporary, and a privacy
  policy is about processing rather than about advertising a known functional
  gap. **If you want it stated outright while the stub stands, say so — it is
  one paragraph.**
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

### V3 — Vercel Deployment Protection

**Why it is yours:** the session's permission classifier blocked the API call,
twice. It is a settings change on your account and it stays yours.

**Why it matters more each phase:** Phases 0, 1 **and** 2 all failed to audit
their preview URL, because anonymous requests — Lighthouse included — get
`<title>Login – Vercel</title>`. All three fell back to a local
`next start`. At eleven routes, "every route returns 200 with a unique title"
is a claim about a deployment, and the deployment is the thing that has never
been checked.

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

### V4 — Merge both PRs, in this order

**Why it is yours:** `gh` is not installed on this machine and the GitHub
connector is unauthorised in this session. The PR bodies are written and
waiting.

Two branches are open and **Phase 2 is stacked on Phase 1**, so the order
matters.

**1. Phase 1 — Homepage Restructure.** Branch `phase/1-homepage`, 13 commits,
pushed. PR body: the template at the end of
`docs/phases/PHASE-1-HOMEPAGE.md`. Squash merge, then delete the branch.

**2. Rebase Phase 2 onto the new `main`:**

```bash
git rebase --onto main phase/1-homepage phase/2-multipage
```

This conflicts with nothing, whatever the commit count. `main` is a direct
ancestor of `phase/1-homepage` (`git merge-base` returns `main`'s own HEAD),
so a squash merge leaves `main` with a tree **identical** to
`phase/1-homepage`, and replaying Phase 2's commits onto an identical tree has
nothing to resolve. *(An earlier note of mine said the rebase had to happen
before the first Phase 2 slice. That was overcautious and is corrected here
and in the Phase 2 spec.)*

**3. Phase 2 — Multipage & SEO.** Branch `phase/2-multipage`, 13 commits.
PR body: the template at the end of `docs/phases/PHASE-2-MULTIPAGE-SEO.md`.
Squash merge, delete the branch.

**Review the Vercel preview URL before merging each one** — playbook §5 says
that is the entire point of branching, and V3 is what makes it possible.

**Done when:** both are merged and `main` contains Phases 1 and 2.

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

## 🟠 Before launch (Phase 3)

### V6 — Supabase project and credentials

Phase 3 wires the form to Supabase and moves the rate limiter there. Needs a
project, its URL and keys, in `.env.local` and in the Vercel project for
**every** environment. Note the Vercel lesson already in the decision log: an
entry whose key exists with an **empty value** killed a production build on a
bare `TypeError: Invalid URL`, which is why `lib/site.ts` now validates rather
than checking presence.

### V7 — Email transport, and a decision on which

`deliverAuditRequest` in `app/api/audit/route.ts` is a stub with both options
written out in its comment: **Resend** (an API key) or an **n8n webhook** (a
URL). Pick one and supply the credential. This is the actual launch gate —
playbook §12 rates a form that discards leads as Severe, and a real end-to-end
submission is Phase 3's exit condition.

### V8 — Analytics: yes or no

Playbook §2.5 names Vercel Analytics as cookieless and needing no consent
banner. **It is not installed** — no analytics package is in `package.json`,
which is why `/privacy` can currently say there is no tracking at all. If you
want it, Phase 3 installs it **and** revises `/privacy` in the same slice.

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

### V10 — `SERVICE_CATALOG` claims voice agents that have not shipped 🟠

`lib/site.ts` lists **"AI Concierge & Voice/Chat Agents"**, and that array
feeds both `knowsAbout` and the schema offer catalog on every page. No voice
work has been delivered — the homepage's concierge architecture is explicitly
labelled *indicative*.

S2.4 therefore left voice off `/automations` under §8.5, and deliberately did
**not** edit the catalog: changing it is a structured-data decision, not a copy
tweak.

**Two ways out:** remove the claim, or have Phase 5 supply something that backs
it. **Recommendation:** remove it until there is a delivered example. It is the
only line in the catalog with nothing behind it, and it sits in markup where a
visitor cannot see it and cannot contradict it.

### V11 — Should `/privacy` say the form delivers nowhere? 🟠

Covered in V1. Listed separately because it is a decision rather than a review
step. **Recommendation:** leave it as written, and let Phase 3 close the gap
rather than documenting it — but it is your call, and it is one paragraph
either way.

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
