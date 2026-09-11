# PROGRESS

> Single source of truth for **where the project is right now**.
> Rules for updating this file: `docs/PROJECT-PLAYBOOK.md` §7.
> Updated in the same commit as the slice it describes — never separately.

**Current phase:** 0 — Closeout
**Branch:** `phase/0-closeout`
**Spec:** `docs/phases/PHASE-0-CLOSEOUT.md`
**Last slice:** S0.12 · 2026-09-11 (first skill review — 9 findings logged, 5 rejected)
**Blocked on:** nothing.

> **The site is live but NOT launched.** `deliverAuditRequest` is still a stub:
> a submitted form is validated and then discarded, while the visitor is told
> they will hear back within 24 hours. Phase 3 wires delivery and is the real
> launch gate. Playbook §12 rates this Severe — consider bringing Phase 3
> forward ahead of Phases 1 and 2, since the site is already public and
> indexable, which is not what the phase order assumed.

---

## Phase 0 — Closeout 🔄 IN PROGRESS

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
- [ ] Closeout — Val's phone + keyboard passes, merge, production check, Lighthouse

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
| 1 | Homepage Restructure | Not started |
| 2 | Multipage & SEO | Not started |
| 3 | Backend & Go-Live | Not started · **← LAUNCH** |
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

---

## Backlog

Discovered outside the current slice. Do not fix in place — log here, schedule later.

| Item | Found in | Target phase |
|---|---|---|
| Extract `Badge` / `Card` / `SectionHeader` / `Eyebrow` primitives — pill class strings duplicated ~16× with drifting opacity | Audit | 1 |
| 11 hardcoded hex values in components (`#0D0F16`, `#12151E`, `#08090D`) should be tokens | Audit | 1 |
| `ArchitectureTrace` dashed connector uses raw `zinc-700` — tokenise | Audit | 1 |
| `PipelineSimulator` node ring uses raw `border-zinc-600` / `border-zinc-800` — tokenise alongside the trace connector | S0.5 | 1 |
| `PipelineSimulator` copy is entirely English (`Trigger: Form & Inbound Lead`, `Inbound payload received`) on a Greek page. The invented numbers were removed in S0.10; the Greek rewrite is what remains | S0.8 | 1 |
| Footer uses plain anchors, Navbar uses `scrollToId` — two nav mechanisms, unify | Audit | 2 |
| Showcase cards carry ~9 elements each at equal weight — needs real hierarchy | Audit | 4 |
| Rate limiting is per-instance on serverless — move counter to Supabase | S0.6 | 3 |
| Preview deployments share the production rate-limit and origin rules; if preview traffic ever matters, key the limiter per deployment | Exit gate | 3 |
| Rate limit counts requests before validation, so a failed submit consumes a slot. Harmless today (the client validates with the same function first) but revisit with the Supabase counter | S0.6 | 3 |
| Honeypot `company` is wrapped in `sr-only` **without** `aria-hidden="true"`, so a screen-reader user can reach and fill it and have their enquiry silently discarded. Add `aria-hidden` (it is already `tabindex="-1"`) | S0.12 | 3 |
| Mobile menu button renders 36×36px — under the 44×44px DoD rule (passes WCAG 2.2 AA's 24px web minimum) | S0.12 | 1 |
| Nine footer links render 15px tall ("Επιστροφή στην αρχή" 17px) — under the 44×44px rule. They clear WCAG 2.2 AA only via the spacing exception: 19px gaps give 34px centre-to-centre, over the 24px circle | S0.12 | 1 |
| Three "Τεχνική αρχιτεκτονική" buttons at 39px and the simulator run button at 38px — a few pixels under 44 | S0.12 | 1 |
| Contact card: phone link 28px tall, email 34px, WhatsApp and Telegram 34px each — all under 44 | S0.12 | 1 |
| Brand button in the header is 168×20px — 20px tall, under both 44 and 24 | S0.12 | 1 |
| 28 usages of 10–11.5px text across 7 files (Footer 8, ShowcaseGrid 5, PipelineSimulator 4, AuditForm 4, DirectContactCard 3, Navbar 2, HeroSection 2). Contrast passes; size is the issue | S0.12 | 1 |
| Nav flips at exactly 1024px and the phone pill only appears at 1280px (`xl`), so 1024–1279 is a third nav state the old 375/768/1440 check never exercised. The new DoD 1024px check now covers it | S0.12 | 1 |
| Landing pattern puts Proof (logos, stats, case studies) between hero and solution; the homepage has no proof section at all | S0.12 | 1 structure · 5 assets |
| `.claude/launch.json` is committed — decide whether to keep tracked | Audit | any |
| Vercel production still served `867f6a1` while eight Phase 0 commits sat unpushed, and that build was marked `index, follow` with placeholder copy live. Watch for stale-deploy drift again after any long local run | Deploy | 8 |
| Project lives in an iCloud-synced folder; sync creates `* 2.ts` / `* 2.json` duplicates inside `.next` that break `tsc --noEmit` until the cache is cleared. Consider moving the repo outside iCloud | S0.7 | any |
| `.DS_Store` files are tracked-adjacent clutter in the working tree; `.gitignore` covers them but stray copies exist | S0.1 | any |
| Footer "Back to top" still uses a bare `href="#"` while the nav list now resolves `#hero` — unify when the two nav mechanisms merge | S0.3 | 2 |

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
