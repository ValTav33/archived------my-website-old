# PROGRESS

> Single source of truth for **where the project is right now**.
> Rules for updating this file: `docs/PROJECT-PLAYBOOK.md` §7.
> Updated in the same commit as the slice it describes — never separately.

**Current phase:** 1 — Homepage Restructure
**Branch:** `phase/1-homepage`
**Spec:** `docs/phases/PHASE-1-HOMEPAGE.md`
**Last slice:** S1.4 · 2026-09-11 (client boundary — hero and showcase shells now render on the server)
**Blocked on:** nothing.

> **Phase order settled 2026-09-11.** Val chose Phase 1 over jumping to
> Phase 3. The question is closed; do not re-raise it.

> **The site is live but NOT launched.** `deliverAuditRequest` is still a stub:
> a submitted form is validated and then discarded, while the visitor is told
> they will hear back within 24 hours. Phase 3 wires delivery and is the real
> launch gate, and Playbook §12 rates the stub Severe. Phase 1 is deliberately
> front end only — see *Backend is out of scope* in the phase spec, which
> records Val's decision verbatim. **Do not "helpfully" wire a transport.**

---

## Phase 1 — Homepage Restructure 🚧 IN PROGRESS

Correct the funnel order, add the sections that carry credibility, and pay
down the design-system debt the Phase 0 audit logged against this phase.
Front end only. Spec: `docs/phases/PHASE-1-HOMEPAGE.md`.

- [x] **S1.1** Tokens — surfaces, hairlines, type scale · 2026-09-11
- [x] **S1.2** UI primitives — Badge, Card, SectionHeader, Eyebrow, StatusDot · 2026-09-11
- [x] **S1.3** Tap targets raised to 44×44 · 2026-09-11
- [x] **S1.4** Push the client boundary down · 2026-09-11
- [ ] **S1.5** Greek pass on the pipeline simulator
- [ ] **S1.6** Proof strip
- [ ] **S1.7** Process section
- [ ] **S1.8** About section
- [ ] **S1.9** FAQ section
- [ ] **S1.10** Navigation and final assembly

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
| 1 | Homepage Restructure | **In progress** · 4/10 slices |
| 2 | Multipage & SEO | Not started |
| 3 | Backend & Go-Live | Not started · **← LAUNCH** · stays after Phase 2 (decided 2026-09-11) |
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
| `PipelineSimulator` copy is entirely English (`Trigger: Form & Inbound Lead`, `Inbound payload received`) on a Greek page. The invented numbers were removed in S0.10; the Greek rewrite is what remains | S0.8 | 1 |
| Navbar still renders nav links as `<button onClick>`: announced as buttons, not links, and dead without JS. S1.4 gave the footer and both section CTAs a shared `ScrollLink`; the navbar is the remaining half, and S1.10 rebuilds that markup anyway | Audit · half-closed S1.4 | 1 · S1.10 |
| Showcase cards carry ~9 elements each at equal weight — needs real hierarchy | Audit | 4 |
| Rate limiting is per-instance on serverless — move counter to Supabase | S0.6 | 3 |
| Preview deployments share the production rate-limit and origin rules; if preview traffic ever matters, key the limiter per deployment | Exit gate | 3 |
| Rate limit counts requests before validation, so a failed submit consumes a slot. Harmless today (the client validates with the same function first) but revisit with the Supabase counter | S0.6 | 3 |
| Honeypot `company` is wrapped in `sr-only` **without** `aria-hidden="true"`, so a screen-reader user can reach and fill it and have their enquiry silently discarded. Add `aria-hidden` (it is already `tabindex="-1"`) | S0.12 | 3 |
| Nav flips at exactly 1024px and the phone pill only appears at 1280px (`xl`), so 1024–1279 is a third nav state the old 375/768/1440 check never exercised. The new DoD 1024px check now covers it | S0.12 | 1 |
| Landing pattern puts Proof (logos, stats, case studies) between hero and solution; the homepage has no proof section at all | S0.12 | 1 structure · 5 assets |
| `PipelineSimulator` run button (`0.12` / hover `0.22`), its completed node (`0.12`) and the form field's focus border (`0.25`) sit outside the two-value hairline system. All three are control emphasis or focus states rather than structural hairlines, so S1.2 left them raw — decide in Phase 4 whether they become a named `emphasis` ramp | S1.2 | 4 |
| 36 raw `zinc-100/200/300/400` **text** colours across the components, plus `hover:bg-zinc-200` in `globals.css` — a second text ramp competing with the documented `ink` ramp. All clear AA, so this is token discipline, not contrast. S1.1 was scoped to the five decorative `zinc-600/700/800` greys only | S1.1 | 1 |
| `.claude/launch.json` is committed — decide whether to keep tracked | Audit | any |
| Vercel production still served `867f6a1` while eight Phase 0 commits sat unpushed, and that build was marked `index, follow` with placeholder copy live. Watch for stale-deploy drift again after any long local run | Deploy | 8 |
| Project lives in an iCloud-synced folder; sync creates `* 2.ts` / `* 2.json` duplicates inside `.next` that break `tsc --noEmit` until the cache is cleared. Consider moving the repo outside iCloud | S0.7 | any |
| `.DS_Store` files are tracked-adjacent clutter in the working tree; `.gitignore` covers them but stray copies exist | S0.1 | any |

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
| `ArchitectureTrace` dashed connector uses raw `zinc-700` | Audit | S1.1 |
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
