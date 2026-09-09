# PROGRESS

> Single source of truth for **where the project is right now**.
> Rules for updating this file: `docs/PROJECT-PLAYBOOK.md` §7.
> Updated in the same commit as the slice it describes — never separately.

**Current phase:** 0 — Truth & Foundations
**Branch:** `phase/0-foundations`
**Spec:** `docs/phases/PHASE-0-FOUNDATION.md`
**Last slice:** S0.7 · 2026-09-09
**Blocked on:** Brand name + domain + business email (Val) → blocks S0.2 only.
Every other Phase 0 slice can proceed.

---

## Phase 0 — Truth & Foundations

Remove everything false, broken, inaccessible or insecure. No new sections.

- [x] **S0.1** Repo hygiene & tooling — ESLint 9, README, docs · 2026-09-09
- [ ] **S0.2** Identity constants — domain, email, brand, split hours ⛔ *blocked*
- [x] **S0.3** Shared navigation source — `lib/nav.ts` · 2026-09-09
- [x] **S0.4** Delete placeholder sections, fix page order · 2026-09-09
- [x] **S0.5** WCAG AA colour remediation · 2026-09-09
- [x] **S0.6** Form security & PII hygiene · 2026-09-09
- [x] **S0.7** Accessibility — focus, motion, semantics · 2026-09-09
- [ ] **S0.8** Copy truth pass

**Exit gate:** no placeholders, no placeholder data, all text ≥ 4.5:1, form
spam-resistant, no PII in logs, keyboard + screen-reader complete, lint +
typecheck + build clean, Lighthouse A11y = 100.

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

_(none yet)_

---

## Backlog

Discovered outside the current slice. Do not fix in place — log here, schedule later.

| Item | Found in | Target phase |
|---|---|---|
| Extract `Badge` / `Card` / `SectionHeader` / `Eyebrow` primitives — pill class strings duplicated ~16× with drifting opacity | Audit | 1 |
| 11 hardcoded hex values in components (`#0D0F16`, `#12151E`, `#08090D`) should be tokens | Audit | 1 |
| `ArchitectureTrace` dashed connector uses raw `zinc-700` — tokenise | Audit | 1 |
| `PipelineSimulator` node ring uses raw `border-zinc-600` / `border-zinc-800` — tokenise alongside the trace connector | S0.5 | 1 |
| Footer uses plain anchors, Navbar uses `scrollToId` — two nav mechanisms, unify | Audit | 2 |
| Showcase cards carry ~9 elements each at equal weight — needs real hierarchy | Audit | 4 |
| Rate limiting is per-instance on serverless — move counter to Supabase | S0.6 | 3 |
| Rate limit counts requests before validation, so a failed submit consumes a slot. Harmless today (the client validates with the same function first) but revisit with the Supabase counter | S0.6 | 3 |
| `.claude/launch.json` is committed — decide whether to keep tracked | Audit | any |
| Project lives in an iCloud-synced folder; sync creates `* 2.ts` / `* 2.json` duplicates inside `.next` that break `tsc --noEmit` until the cache is cleared. Consider moving the repo outside iCloud | S0.7 | any |
| `.DS_Store` files are tracked-adjacent clutter in the working tree; `.gitignore` covers them but stray copies exist | S0.1 | any |
| Footer "Back to top" still uses a bare `href="#"` while the nav list now resolves `#hero` — unify when the two nav mechanisms merge | S0.3 | 2 |

---

## Blockers

| Blocker | Blocks | Owner | Due |
|---|---|---|---|
| **Brand name + domain** — one decision, not two. Recommendation: bare `Tavlikos` + category tagline, domain `tavlikos.com` (+ `.gr` if free). | S0.2, all of Phase 2 | Val | — |
| Business email not set up — Zoho free tier or Google Workspace, **not Gmail** | S0.2 | Val | — |
| Fiverr review quotes not selected | Phase 5 | Val | — |

### Resolved

- ~~BTL Industries naming permission~~ — cleared, freelance engagement, no NDA
- ~~`roz-inn.com` live and linkable~~ — confirmed yes; currently your only live client URL
- ~~ΑΦΜ / registration~~ — not planned; all invoicing and compliance claims removed from every phase

---

## Decisions changed since the playbook was written

- **2026-09-09 — Voice reversed to first person plural.** The site speaks as
  "we". Guardrail: plural voice, singular facts — no team, department or
  headcount claims. Playbook §2.1 and §11.1.
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
