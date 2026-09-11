# PHASE 0 — Closeout

**Branch:** `phase/0-closeout`
**Depends on:** Phase 0 (merged `07038ea`)
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 4 slices + manual checks

---

## Objective

Close the gaps between Phase 0's objective and what actually shipped, then install the UI UX Pro Max skill with a guardrail so it can review later phases without overriding the locked design. No new sections, no redesign, no backend.

## Findings being closed

| # | Finding | Evidence |
|---|---|---|
| 1 | Dead EL\|EN toggle | Decision log 2026-09-09 removed it, but no slice did the work. It still renders in `Navbar.tsx` on desktop and in the mobile drawer. |
| 2 | Invented numbers in the hero simulator | Phase 0's own verification grep for `LATENCY` returns `PipelineSimulator.tsx` lines 37 and 58. `score 0.91` is on line 54. They read as real telemetry, which §8.1 forbids. |
| 3 | Structured data claims English | `JsonLd.tsx` sets `inLanguage: ["el", "en"]`. No English content exists until Phase 6. |
| 4 | English label in a Greek form | `AuditForm.tsx` label "Business Email" |
| 5 | Stale backlog row | `SITE.locationLabel` row still targets Phase 0, but the value was already fixed in S0.2 |
| 6 | Manual exit-gate checks never done | `PROGRESS.md` → "Still owed by Val" |

## Exit gate

- [ ] `grep -rn "Placeholder\|yourdomain\|domain.gr\|SYS.ENG\|LATENCY" app components lib` returns nothing
- [ ] `grep -rn "Latency\|score 0\." components` returns nothing
- [ ] No EL|EN toggle renders at 375, 768, 1024 or 1440px
- [ ] `ui-ux-pro-max` installed at `.claude/skills/ui-ux-pro-max/`, its search script runs, `CLAUDE.md` committed
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all clean
- [ ] Val confirms the real-phone pass and the keyboard pass
- [ ] After merge: production serves the merge commit, Lighthouse mobile Accessibility = 100

## Explicitly NOT in this phase

Greek rewrite of the simulator copy (Phase 1) · fixing small text sizes or tap targets (log only, Phase 1) · form delivery (Phase 3) · favicon and OG image (Phase 2) · anything produced by the skill's design-system generator (never).

---

## S0.9 — Remove the dead language toggle

**Why:** two buttons with `aria-pressed` that change nothing. The decision log already says a dead toggle is worse than no toggle. It returns in Phase 6 with real `/en` routing.

**Files:** `components/layout/Navbar.tsx`, `PROGRESS.md`

**Changes:**

1. Delete the desktop EL|EN group and the EL|EN group inside the mobile drawer.
2. Delete the `Language` type and the `lang` state. Remove any imports left unused.
3. In the mobile drawer, the "Δωρεάν Audit" button stays full width in its row. Leave no empty flex wrapper behind.
4. Where the desktop toggle was, leave one comment: the language switch returns in Phase 6 with `/en` routing.

**Verify:** no EL/EN buttons at 375, 768, 1024 or 1440px. The drawer's focus trap still cycles, and Escape still returns focus to the hamburger. Lint, typecheck and build clean.

**Commit:**
```
fix(nav): remove the non-functional language toggle

The EL|EN toggle was decided removed on 2026-09-09 but never assigned to a
slice, so it kept rendering two buttons that changed nothing. It returns
in phase 6 with real locale routing.

Slice: S0.9
```

---

## S0.10 — Truth pass: numbers, structured data, labels

**Why:** the hero simulator prints invented measurements above the fold, the structured data advertises an English version that doesn't exist, and one form label breaks the one-language rule.

**Files:** `components/hero/PipelineSimulator.tsx`, `components/seo/JsonLd.tsx`, `components/conversion/AuditForm.tsx`, `PROGRESS.md`

**Changes:**

1. **PipelineSimulator:** delete `RUN_LATENCY_MS` and its comment. Delete the `Latency:` log line. Change `"Lead verified via AI · score 0.91"` to `"Lead verified via AI"`. Change nothing else — no timing, animation or wording changes (the Greek rewrite stays in the Phase 1 backlog).
2. **JsonLd:** `inLanguage` becomes `"el"`. Phase 6 adds `"en"` back.
3. **AuditForm:** label `"Business Email"` becomes `"Email"`.
4. **PROGRESS.md:** remove the `SITE.locationLabel` backlog row and note in this slice's entry that it was already fixed in S0.2. Update the PipelineSimulator backlog row: invented numbers removed in S0.10, Greek copy still Phase 1.

**Verify:** both exit-gate greps return nothing. The simulator still runs start to finish. View source on `/`: the JSON-LD shows `"inLanguage":"el"`. Lint, typecheck and build clean.

**Commit:**
```
fix(copy): remove invented simulator metrics and the false english claim

The hero simulator printed a latency and a lead score that nothing
measured, and the json-ld advertised an english version that does not
exist until phase 6.

Slice: S0.10
```

---

## S0.11 — Install UI UX Pro Max with a locked-design guardrail

**Why:** the skill activates on any UI task, and its own workflow requires generating a new design system for new pages and sections — exactly what Phases 1 and 2 build. For this site its generator proposed a light slate background, a navy/blue palette and Plus Jakarta Sans, all of which contradict playbook §2.4. It is useful as a reviewer only. `CLAUDE.md` loads automatically in every session, so the guardrail lives there.

**Files:** `.claude/skills/ui-ux-pro-max/` (new, generated), `CLAUDE.md` (new), `docs/PROJECT-PLAYBOOK.md`, `PROGRESS.md`

**Changes:**

1. **Preconditions.** Run `node --version` (needs 20+) and `python3 --version` (needs 3.x). If Python is missing, stop and tell Val. Do not install it.
2. **Dry run** from the repo root:
   ```bash
   npx ui-ux-pro-max-cli@latest init --ai claude --dry-run
   ```
   Show Val the planned actions. If anything would be written outside `.claude/skills/ui-ux-pro-max/`, stop and report.
3. **Install:** the same command without `--dry-run`. Do not use `--global`. Do not use the `/plugin marketplace` install — it loads six additional skills this site doesn't need.
4. **Smoke test:**
   ```bash
   python3 .claude/skills/ui-ux-pro-max/scripts/search.py "form submit feedback" --domain ux -n 1
   ```
   It must return a result. Record the installed version in `PROGRESS.md`.
5. **Create `CLAUDE.md`** at the repo root with exactly this content:

   ```markdown
   # CLAUDE.md — Tavlikos Systems website

   Greek-first marketing site. Before any work, read:

   1. `docs/PROJECT-PLAYBOOK.md` — rules, locked decisions, phase map
   2. `PROGRESS.md` — current state
   3. The current phase spec in `docs/phases/`

   When sources disagree: Val's instruction in the session → the playbook → `PROGRESS.md` (for state) → skills and their output.

   ## The design is locked

   The visual system in playbook §2.4 and §10 is final: monochrome near-black surfaces, hairline borders, Inter + JetBrains Mono, emerald only for live status dots, tokens only (no raw hex), WCAG AA. Do not change the palette, fonts, spacing scale or animation library (Framer Motion) unless Val asks and §14 is updated.

   ## UI UX Pro Max skill — reviewer, not designer

   `.claude/skills/ui-ux-pro-max/` is installed for UX guidance only.

   - Never run it with `--design-system` or `--persist`, and never create a `design-system/` folder.
   - Allowed searches: `--domain ux`, `--domain landing`, `--domain icons` (Lucide only), `--stack nextjs`.
   - If a result conflicts with the playbook, the playbook wins. Tell Val about the conflict; do not apply it.
   - Never add GSAP, new fonts, gradients or stock photography because a result suggests it.
   - Findings outside the current slice go to the `PROGRESS.md` Backlog, not into code.
   ```

6. **Playbook edits:**
   - §2.6 Working method: add a row `| Skills | ui-ux-pro-max, advisory only — see CLAUDE.md |`
   - §6 Every slice: change `Manual check at 375px, 768px and 1440px` to `Manual check at 375px, 768px, 1024px and 1440px`, and add `- [ ] New or changed interactive elements have a tap target of at least 44×44px`
   - §14 Decision log: add today's entry — ui-ux-pro-max installed as an advisory reviewer; its design-system generator is banned because its output contradicts §2.4; DoD gains the 1024px check and the 44×44px tap-target rule.

**Verify:** `git status` shows new files only in `.claude/skills/ui-ux-pro-max/` and `CLAUDE.md`, plus the playbook and PROGRESS edits. Lint, typecheck and build are still clean — if ESLint picks up files under `.claude/`, add `.claude/**` to the ignores in `eslint.config.mjs`.

**Commit:**
```
chore(tooling): install ui-ux-pro-max as an advisory reviewer

Adds the skill at project level with a CLAUDE.md guardrail. Its
design-system generator proposed a palette and typography that contradict
playbook §2.4, so it is restricted to ux, landing, icons and nextjs
searches. The definition of done gains a 1024px check and a 44px tap
target rule.

Slice: S0.11
```

---

## S0.12 — First skill review (read-only)

**Why:** the skill's first real job — review the live homepage and turn its findings into scheduled Backlog items, not code.

**Files:** `PROGRESS.md` only

**Changes:**

1. Run targeted searches only. No `--design-system`, no `--persist`. For example:
   - `"touch target size" --domain ux`
   - `"small text readability" --domain ux`
   - `"trust proof section" --domain landing`
   - `"form validation accessibility" --stack nextjs`
2. Compare the results with the current homepage. Known candidates to check: the mobile menu button is 36×36px; there are about 30 usages of 10–11.5px text; the hero and nav change layout at 1024px.
3. Add each real finding to the Backlog with a target phase (text size and tap targets → 1, form → 3, motion → 4). List any recommendation that conflicts with playbook §2.4 under Notes as rejected, with one line on why.

**Verify:** `git diff` touches only `PROGRESS.md`.

**Commit:**
```
docs(progress): log findings from the first ui-ux-pro-max review

Slice: S0.12
```

---

## Closeout

1. **Hand Val the manual checklist and wait for his confirmation:**
   - **Phone** (portrait, then landscape) on `https://tavlikossystems.com`: scroll the whole page; nothing is cut off and nothing scrolls sideways; open the menu and tap each link; tap the phone number and confirm it opens the dialer.
   - **Keyboard** (laptop, mouse untouched): click the address bar and press Tab. The first stop is the "Μετάβαση στο περιεχόμενο" link, and it becomes visible. Keep pressing Tab through the page — every stop shows a visible outline and the order makes sense. Narrow the window until the hamburger appears, reach it with Tab, open it with Enter, confirm Tab stays inside the menu, then press Escape and confirm focus lands back on the hamburger.
2. After Val confirms: squash-merge `phase/0-closeout` into `main` and push.
3. Confirm Vercel production is serving the merge commit — not an older build (see the stale-deploy item in the Backlog).
4. Run Lighthouse mobile on `https://tavlikossystems.com`. Accessibility must be 100; the other scores must stay within the Phase 0 budget. Record the results in `PROGRESS.md`.
5. `PROGRESS.md`: mark Phase 0 complete, including the manual checks. Set the current phase to "between phases" and leave the next phase undecided — Val is choosing whether Phase 3 runs before Phases 1 and 2.
