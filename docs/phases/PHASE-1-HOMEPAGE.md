# PHASE 1 — Homepage Restructure

**Branch:** `phase/1-homepage`
**Depends on:** Phase 0 (`07038ea`) and Phase 0 Closeout (`9a23cbc`)
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 10 slices + manual checks · **front end only, zero backend work**

---

## Objective

Playbook §3: *correct the funnel order and add the sections that carry
credibility — Process, About, FAQ. Extract UI primitives.*

Today the homepage is four blocks: hero, a stack strip, three indicative
architectures, and the form. It states a promise and then asks for a lead
without ever answering *who are you*, *how does this work*, or *what happens if
I lose you*. Phase 1 turns four blocks into one argument that ends on the CTA,
and pays down the design-system debt the Phase 0 audit logged against this
phase — primitives, tokens, tap targets, type scale.

**No new routes.** Every section built here is a homepage section with an
anchor. Phase 2 promotes them to real pages.

---

## Target page order

```
Navbar
  hero        Hero                 the promise
  proof       ProofStrip     NEW   evidence, before any claim is expanded
  tech        TechStackStrip       the infrastructure (quiet divider)
  solutions   ShowcaseGrid         what we build
  process     ProcessSection NEW   how it runs, and what you get at each step
  about       AboutSection   NEW   who you are actually dealing with
  faq         FaqSection     NEW   the objections, answered on the page
  audit       ConversionSection    the CTA
Footer
```

Read top to bottom: *here is what we do → here is proof we have done it → here
is the machinery → here is exactly what we build → here is how the engagement
runs → here is who we are → here is the answer to what worries you → book the
call.* The page ends on `#audit` and always will (`app/page.tsx` already
carries that comment).

`ProofStrip` sits above the stack strip because a visitor who has not yet been
given a reason to believe anything should meet evidence before spec sheets —
the landing-pattern search agrees (`trust-authority-conversion`: Hero → Proof →
Solution → CTA), and this is the finding S0.12 logged as "1 structure ·
5 assets".

---

## Exit gate

- [ ] Page order matches the block above; `#audit` is the last section
- [ ] `components/ui/` exports `Badge`, `Card`, `SectionHeader`, `Eyebrow`, `StatusDot` and every section uses them
- [ ] `grep -rn "#0D0F16\|#12151E\|#08090D" app/*.tsx components --include="*.tsx"` returns nothing
- [ ] `grep -rn "zinc-600\|zinc-700\|zinc-800" app components --include="*.tsx"` returns nothing
- [ ] `grep -rno "text-\[1[01]\(\.5\)\?px\]" app components --include="*.tsx"` returns nothing — no rendered text below 12px
- [ ] Every interactive element measures ≥ 44×44px at 375px (`getBoundingClientRect`, not class names)
- [ ] One `h1`; heading order runs h1 → h2 → h3 with no skips (7 sections, 7 `h2`s)
- [ ] `HeroSection` and the `ShowcaseGrid` shell render as Server Components; `"use client"` appears only on interactive leaves
- [ ] `NAV_LINKS` resolves to section ids that exist; every anchor in header and footer lands somewhere
- [ ] Zero English strings in visitor-facing copy except genuine product nouns (Next.js, n8n, audit, dashboard, email)
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean
- [ ] Manual pass at 375 / 768 / 1024 / 1440px, plus a real phone
- [ ] Lighthouse mobile on the preview: Perf ≥ 90 · **A11y 100** · BP ≥ 95 · SEO ≥ 95

### Open question for Val, raised in S1.6

The showcase's third card, `lead-engine`, describes the BTL system and currently
sits under the heading "Ενδεικτικές Αρχιτεκτονικές" — *indicative* architectures,
explicitly "συστήματα που κατασκευάζουμε — όχι δημοσιευμένα έργα πελατών". That
framing was correct when nothing could be named. BTL is now cleared and named,
which makes it the first real case study on the site and makes that card an
understatement of your own work. Options: leave the section as is and let the
proof strip carry the name; split the delivered project out of the indicative
set; or re-frame the section once `/work` exists in Phase 2. **Do not decide
this inside a slice** — it changes a heading Phase 0 deliberately wrote.

---

## Explicitly NOT in this phase

Routes and pages (Phase 2) · favicon, OG image, sitemap, robots, FAQPage schema
(Phase 2 — the schema ships with the `/faq` route that owns it) · form delivery to Supabase,
email or any webhook (Phase 3 — see *Backend is out of scope* below) · scroll reveals and scroll-spy
nav (Phase 4) · testimonials, screenshots, Val's photo, logo wall (Phase 5,
asset-gated — slots are built here, filled there) · English (Phase 6) · any
palette, font or animation-library change (§2.4 locked).

---

## Backend is out of scope — decided by Val, 2026-09-11

**Do not re-raise this.** It was raised twice during planning and answered.

Phase 1 is **front end only**. No n8n, no Supabase, no third-party APIs, no
email transport, no new dependencies. `deliverAuditRequest`
(`app/api/audit/route.ts:126`) stays exactly as it is: a stub that validates a
submission and discards it.

Val's decision, verbatim: *"We do not care if currently the forms don't work. We
only want the front end to be nice and everything working (front end)."*

What that means concretely:

- The audit form keeps its current copy, including the 24-hour promise at
  `AuditForm.tsx:167`, `:174` and `:397`. **Do not soften it** — that was the
  fallback offered alongside the delivery fix, and both were declined together.
- The form must still *behave* perfectly: validation, error states, the success
  state, disabled-while-submitting, focus management, `aria-live`. All of that
  is front end and all of it is in scope for this phase.
- Lead delivery, the Supabase-backed rate limiter and the four Phase 3 Backlog
  rows all stay in Phase 3, at the end of the queue.

This paragraph exists so a later session reading the §12 risk register does not
treat the stub as an oversight and "helpfully" wire a transport.

---

## S1.1 — Tokens: surfaces, hairlines, type scale

**Why:** eleven hardcoded hex values and five raw `zinc-*` greys sit in
components, which §10.1 forbids outright, and 28 usages of arbitrary 10–11.5px
text sit below the 12px body floor. Every section added later in this phase
would copy those strings. Tokens first, then build on them.

**Files:** `tailwind.config.ts`, `app/globals.css`, `components/layout/Navbar.tsx`,
`components/conversion/DirectContactCard.tsx`, `components/conversion/AuditForm.tsx`,
`components/hero/PipelineSimulator.tsx`, `components/showcase/ShowcaseGrid.tsx`,
`app/layout.tsx`, `PROGRESS.md`

**Changes:**

1. **Surfaces.** `#0D0F16` is already `obsidian-850` and `#08090D` is already
   `obsidian-950` — these are pure substitutions, no new token needed. `#12151E`
   (the form input fill, 4 usages) has no token: add `obsidian-825: "#12151E"`
   with a comment saying it is the input/control fill, sitting between the
   terminal card and the raised surface.
2. **Decorative greys.** Add `trace: { line: "#3F4654", node: "#2A2F3B" }` or
   equivalent under a clearly decorative name, replacing `zinc-700` (three
   window dots, one dashed connector), `zinc-600` and `zinc-800` (pipeline node
   rings). Every one of these is `aria-hidden` or purely structural, so the
   decorative ramp is correct; name them so nobody later mistakes them for text
   colours.
3. **Type scale.** The skill's Typography/Font Size Scale guideline is explicit:
   a consistent modular scale, not arbitrary sizes. Define named steps in
   `fontSize` and map every existing arbitrary value onto them:

   | Token | px | Use |
   |---|---|---|
   | `mono-xs` | 12 | monospace labels, eyebrows, timestamps — **the floor** |
   | `xs` | 13 | captions, chip text, footer links |
   | `sm` | 14 | secondary body |
   | `base` | 16 | body |

   The headline steps (`2.1rem` / `3.35rem`) stay as they are — they are
   deliberate optical sizes on one element, not drift.
4. **Migrate.** Replace all 28 sub-12px usages with `mono-xs` or `xs`. Nothing
   moves position; this is a size floor, not a redesign. Where a component
   visibly breaks at 12px (Footer's 8 usages are the risk), adjust spacing, not
   the size.
5. `app/layout.tsx:83` `themeColor: "#08090D"` is metadata, not a component
   class. Leave the value but source it from one exported constant so it cannot
   drift from `obsidian-950`.

**Verify:** all three exit-gate greps return nothing. Diff the rendered page
before and after at 375 and 1440px — the only intended visual change is that
the smallest text is now 12px. Lint, typecheck, build clean.

**Commit:**
```
refactor(tokens): tokenise surfaces and greys, add a type scale floor

Eleven hex values and five raw zinc greys were living in components
against §10.1, and 28 text usages sat at 10-11.5px, below the readable
floor. Phase 1 adds four new sections; without this they would inherit
the drift.

Slice: S1.1
```

---

## S1.2 — UI primitives

**Why:** the exit gate names them. The pill class string appears **14 times**
with drifting border and fill opacities (`0.06`/`0.08` and `0.02`/`0.03`/`0.04`
in combinations that nothing chose deliberately), the card shell six times, and
the live status dot twice. §10.5: write a class string twice, extract it.

**Files:** `components/ui/Badge.tsx`, `components/ui/Card.tsx`,
`components/ui/SectionHeader.tsx`, `components/ui/Eyebrow.tsx`,
`components/ui/StatusDot.tsx` (all new), then every consumer:
`HeroSection`, `PipelineSimulator`, `TechStackStrip`, `ShowcaseGrid`,
`DirectContactCard`, `AuditForm`, `Navbar`, `Footer`

**Changes:**

1. **`Badge`** — the pill. Variants: `default` (category, stack, nav chips),
   `metric` (the stacked impact rows), `status` (wraps `StatusDot` plus label).
   One border value, one fill value per variant. No per-call-site opacity.
2. **`Card`** — `rounded-xl border border-white/[0.08] bg-obsidian-850`, with an
   `interactive` prop adding the `hover:border-white/[0.18]` state. §10.3 allows
   two hairline values; the card currently uses a third (`0.18`) — keep it as
   the single hover value and make it the only one.
3. **`SectionHeader`** — `eyebrow` + `h2` + optional lede, with the max-width
   and spacing baked in. Phase 1 adds four sections; this is what stops them
   from each inventing their own header. Takes an `id` so the `h2` can be the
   section's `aria-labelledby` target.
4. **`Eyebrow`** — the `[ 01 // LABEL ]` mono line. Auto-numbering is
   deliberately **not** built in: the numbers must stay hand-assigned so the
   Phase 2 route split does not silently renumber them.
5. **`StatusDot`** — the pulsing live dot, `aria-hidden`, used by the hero pill
   and the footer pill. The one place emerald is allowed (§2.4).
6. Refactor all consumers. Delete every duplicated string. This slice must not
   change a single rendered pixel except where a drifted opacity is normalised.

**Verify:** `grep -rn "border border-white/\[0\.0" components --include="*.tsx"`
returns only the primitive files. Screenshot 375 and 1440 before and after and
compare. Lint, typecheck, build clean.

**Commit:**
```
refactor(ui): extract Badge, Card, SectionHeader, Eyebrow and StatusDot

The pill class string appeared 14 times with four different opacity
combinations and the card shell six times. Four new sections land in
this phase; they build on the primitives instead of the drift.

Slice: S1.2
```

---

## S1.3 — Tap targets and the 44px rule

**Why:** seven Backlog rows from S0.12, all targeted at this phase, all measured
at 375px rather than guessed. Playbook §6 makes 44×44 a Definition-of-Done rule.
Note the correction recorded in S0.12: WCAG 2.2 AA's web requirement is
**24×24 CSS px**, so none of these is a conformance failure. 44 is our own bar,
and it is the right bar for a phone-first Greek SMB audience.

**Files:** `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`,
`components/showcase/ShowcaseGrid.tsx`, `components/hero/PipelineSimulator.tsx`,
`components/conversion/DirectContactCard.tsx`

**Changes:**

| Element | Now | Fix |
|---|---|---|
| Mobile menu button | 36×36 | `h-11 w-11`, keep the icon at 18px |
| Brand button (header) | 168×20 | vertical padding to 44 tall; the hit area grows, the type does not |
| 9 footer links | 15px tall (17 for "Επιστροφή στην αρχή") | `py-2.5` + `inline-flex items-center`; keep the 19px gaps |
| 3 "Τεχνική αρχιτεκτονική" buttons | 39 | `py-3` |
| Simulator run button | 38 | `py-3` |
| Contact card: phone / email / WhatsApp / Telegram | 28 / 34 / 34 / 34 | `py-2.5`, full-row hit area |

Grow padding and hit areas only. Do not change type sizes (S1.1 owns those) and
do not change layout.

**Verify:** a `getBoundingClientRect()` sweep over every `a`, `button`,
`input`, `select` and `textarea` at 375px reports no box below 44 in either
axis. Re-run at 768 and 1024. Check the footer still reads as a list and has not
become a stack of buttons. Lint, typecheck, build clean.

**Commit:**
```
fix(a11y): raise every interactive target to 44x44

Seven backlog rows from the S0.12 review, all measured at 375px. WCAG
2.2 AA's web minimum is 24px and all of these already cleared it; 44 is
the playbook §6 bar and the right one for a phone-first audience.

Slice: S1.3
```

---

## S1.4 — Push the client boundary down

**Why:** `HeroSection` is a Client Component for one reason — an `onClick` that
calls `scrollToId`. That drags the **LCP element** and the entire trust list
behind hydration. `ShowcaseGrid` is client for the same shape of reason: the
per-card accordion. The Next.js stack guidance is unambiguous (Rendering /
"Push Client Components down", severity High), and playbook §10.7 already says
the LCP ships without JavaScript.

**Files:** `components/ui/ScrollLink.tsx` (new),
`components/hero/HeroSection.tsx`, `components/showcase/ShowcaseGrid.tsx`,
`components/layout/Footer.tsx`

**Changes:**

1. **`ScrollLink`** — a `"use client"` leaf that renders an anchor calling
   `scrollToId`, with the reduced-motion contract already in `lib/utils.ts`. It
   renders a real `<a href="#id">`, not a `<button>`, so it works before
   hydration and appears in the accessibility tree as a link. This also closes
   the Backlog row about the footer and navbar using two different nav
   mechanisms — one component now, ahead of the Phase 2 unification.
2. `HeroSection` drops `"use client"`. Its CTA becomes `ScrollLink`. The phone
   link is already an anchor. `PipelineSimulator` stays a client leaf.
3. `ShowcaseGrid` drops `"use client"`; the section shell, header and banner
   render on the server. `ShowcaseCard` becomes a `"use client"` leaf carrying
   the disclosure state.
4. Footer's `href="#"` back-to-top becomes `#hero` (Backlog row, S0.3).

**Verify:** `grep -rln "use client" components` lists only genuine leaves.
`npm run build` shows the hero and showcase shells as static. Disable JavaScript
in the browser: the hero renders fully and the CTA still navigates to `#audit`.
With JS on, smooth scrolling and the accordion still work, and reduced motion
still collapses the scroll. Lint, typecheck, build clean.

**Commit:**
```
perf(hero): render the hero and showcase shells on the server

Both were client components because of one onClick each, which put the
LCP element behind hydration against §10.7. The scroll behaviour moves
into a ScrollLink leaf that degrades to a plain anchor.

Slice: S1.4
```

---

## S1.5 — Greek pass on the pipeline simulator

**Why:** the last English block on a Greek page, and it sits above the fold.
`Trigger: Form & Inbound Lead`, `Inbound payload received · source=web_form`,
`Normalizing fields → queue:validation`, `CAPTURING`, `QUEUED`, `RUNNING`.
Playbook §11.2 and §11.3: plain Greek nouns where a plain one exists, one
language per list. Backlog row from S0.8.

**Files:** `components/hero/PipelineSimulator.tsx`

**Changes:**

1. Stage titles and log lines to Greek. Keep the genuine product nouns a Greek
   professional actually uses — `webhook`, `CRM`, `AI agent`, `n8n` — and
   translate everything that is decoration. `exit 0` stays: it is a terminal
   convention, not a word.
2. Status labels: `READY` → `ΕΤΟΙΜΟ`, `RUNNING` → `ΣΕ ΕΞΕΛΙΞΗ`, `DONE` →
   `ΟΛΟΚΛΗΡΩΘΗΚΕ`, `QUEUED` → `ΣΕ ΑΝΑΜΟΝΗ`, and the per-stage active labels
   likewise.
3. Longer Greek strings will change the widget's width behaviour. Check the log
   lane does not introduce horizontal scroll at 375px and that the status badge
   does not wrap (the skill's Content / Compact Label Overflow guideline,
   severity High: a pill label stays on one line).
4. **No new numbers.** S0.10 removed the invented latency and lead score; do not
   reintroduce a measurement of any kind (§8.1).

**Verify:** run the simulation start to finish. Six log lines, ending on
`ΟΛΟΚΛΗΡΩΘΗΚΕ`/`exit 0`. No Latin-script sentence remains in the widget except
product nouns. No overflow at 375px. `aria-live` still announces stage changes.

**Commit:**
```
fix(copy): translate the pipeline simulator to greek

The last english block on the page, sitting above the fold. Product
nouns stay; the decoration does not.

Slice: S1.5
```

---

## S1.6 — Proof strip

**Why:** S0.12's structural finding. The homepage makes claims and then asks for
a lead, with nothing between them. Two assets are **already cleared** in the
decision log — BTL Industries is cleared for naming, `roz-inn.com` is confirmed
live and linkable — and playbook §3 says Phase 5 evidence goes in the moment it
exists, regardless of which phase is open.

**Facts supplied by Val, 2026-09-11 — this slice is unblocked:**

**BTL Industries** — a custom lead-generation pipeline. Data collection and
waterfall enrichment across FullEnrich, BetterContact, ZoomInfo, LinkedIn and
Google Sheets APIs, recovering direct phone numbers plus work and personal
emails. AI research per lead (Perplexity), then a generated personalised
icebreaker and email per lead (OpenAI API), pushed into an Instantly campaign.

**roz-inn.com** — a house gallery website, live today. A full production site
with a booking and payment system and multiple pages is **in progress, not
shipped**.

**How those become on-page copy:**

1. **BTL is a real delivered project — the first one on this site.** The
   showcase's `lead-engine` card describes exactly this system under
   "Ενδεικτικές Αρχιτεκτονικές", i.e. as a capability we could build. It is not
   indicative. It was delivered, for a named and cleared client, and it should
   stop being filed as a hypothesis. The proof strip names BTL; whether the
   showcase card is also re-labelled is a judgement call for S1.6 — flag it to
   Val rather than deciding it inside the slice.
2. **Outcome before mechanism (§11.4).** The visitor is a Greek clinic or rental
   owner, not a growth engineer; "FullEnrich, BetterContact, ZoomInfo,
   Instantly" means nothing to them and reads as name-dropping someone else's
   vendors. The proof line states what the system does — finds and verifies
   contacts, researches each lead, writes a personalised opener, loads the
   campaign. The tool names belong in a `Badge` stack row, which is already the
   site's established language for exactly this.
3. **roz-inn.com ships as the gallery site only.** The booking and payment build
   is not live, and §8.5 is explicit: if it isn't built, it isn't on the page.
   It goes on the site the day it ships, as a Phase 5 update — not now, and not
   as "σε εξέλιξη", which reads as padding.
4. **No numbers.** Not leads processed, not emails sent, not match rates (§8.1).
   Nothing in what Val supplied is a number, and nothing should become one.

**Files:** `components/proof/ProofStrip.tsx` (new), `app/page.tsx`, `lib/site.ts`

**Changes:**

1. A compact band directly under the hero — not a section with a big header.
   Three items on desktop, stacked on mobile, built from `Card` and `Badge`:
   - **BTL Industries** — named client, sector, one plain-Greek line on what
     the pipeline does, plus a `Badge` stack row for the tooling
   - **roz-inn.com** — live link, `target="_blank" rel="noopener noreferrer"`,
     one line: gallery site. The booking build is not mentioned until it ships
   - **A testimonial slot**, rendered only when content exists. Ships empty
     (nothing renders) until Q4 closes in Phase 5. No skeleton, no "coming
     soon", no placeholder — Phase 0 spent eight slices removing those.
2. Reference data goes in `lib/site.ts` beside the other facts, so Phase 2's
   `/work` index reads the same source rather than forking it.
3. No logos. A logo needs permission separate from a name, and BTL's is not
   cleared. Typeset names only.
4. No metrics. Nothing here gets a percentage (§8.1).

**Verify:** every claim traces to a decision-log row or to Val's sentence in
this slice. The external link opens in a new tab with `rel` set. No placeholder
renders when the testimonial slot is empty. Contrast and tap targets hold.

**Commit:**
```
feat(content): add the proof strip under the hero

The page asked for a lead with no evidence between the claim and the
form. BTL Industries and roz-inn.com were both cleared in the decision
log; the testimonial slot stays empty until phase 5 fills it.

Slice: S1.6
```

---

## S1.7 — Process section

**Why:** playbook §3 names it. A prospect who does not know what happens after
they click cannot evaluate the risk of clicking. The `funnel-3-step-conversion`
landing pattern's **section order** (problem → solution → action) is a fit; its
colour strategy is not — see *Conflicts* below.

**Files:** `components/process/ProcessSection.tsx` (new), `app/page.tsx`

**Changes:**

1. Three steps, numbered, built from `SectionHeader` + `Card`:
   - **01 · Audit** — 15-minute call, then a written summary of the first three
     moves within 24 hours. This is the §2.2 definition, verbatim; it must match
     the form's promise exactly (`AuditForm.tsx:397`), word for word.
   - **02 · Σχεδιασμός & κατασκευή** — agreed scope, staged delivery, a preview
     URL you can open at each stage. The timeline is a **range**, never a
     promise: "3 ημέρες έως 2 μήνες, ανάλογα με το εύρος" (§2.2).
   - **03 · Παράδοση & υποστήριξη** — the repo is yours, deployment is
     documented, optional monthly retainer. This is the §11.6 objection answered
     in structure before the FAQ answers it in words.
2. No dates, no percentages, no "average delivery time" (§8.1).
3. Steps are `Card`s in an ordered list, not a connector diagram. §2.4 caps
   terminal surfaces at two per viewport and the showcase's architecture traces
   already sit above this section.
4. Lucide icons only if they add meaning; `aria-hidden` beside visible text. The
   icons search recommends Phosphor/Heroicons — rejected, §2.5 locks Lucide.

**Verify:** the audit description matches the form's copy character for
character. Heading order holds (`h2` for the section, `h3` per step). Reads
correctly at 375px stacked and 1024px in three columns.

**Commit:**
```
feat(content): add the process section

Three steps: what the audit delivers, how the build runs, what you own
at the end. The timeline stays a range and the audit description matches
the form's promise word for word.

Slice: S1.7
```

---

## S1.8 — About section

**Why:** playbook §3 names it, and §2.1's voice guardrail makes this the highest
risk section in the phase. "We" is the register; one person is the fact. The
section has to feel substantial without a single sentence that is only true with
a team.

**Files:** `components/about/AboutSection.tsx` (new), `app/page.tsx`

**Changes:**

1. Short. Four or five sentences, `SectionHeader` + one `Card`. Who we are,
   where we are (Θεσσαλονίκη / Εύοσμος, serving Greece and remote), what we
   build, and what we deliberately do not do.
2. **Forbidden, hard fail on review:** «η ομάδα μας», «οι developers μας», «οι
   ειδικοί μας», «το γραφείο μας», any department name, any "founded by"
   framing, any headcount, any "years of experience" number that is not exactly
   true (§8.1).
3. Photo slot built but **not filled** — Val's photo is a Phase 5 asset. Build
   the layout so the photo can drop in without a redesign, and ship it with the
   text column at full width until then. Nothing renders when the slot is empty.
4. Working hours come from `SITE.hoursLong`, never retyped.
5. Availability status: reuse `StatusDot` via `Badge` variant `status`. It
   states availability for work, which is a fact we control.

**Verify:** `grep -niE "ομάδα|developers μας|ειδικοί|γραφείο μας|founded"
components/about` returns nothing. Read it aloud as if you were the prospect who
then meets one person — nothing in it should feel like a bait-and-switch. No
photo placeholder renders.

**Commit:**
```
feat(content): add the about section

Plural voice, singular facts per §2.1 — no team, no departments, no
headcount. The photo slot stays empty until phase 5 supplies one.

Slice: S1.8
```

---

## S1.9 — FAQ section

**Why:** playbook §11.6 and the §12 risk register both say the solo-operator
objection kills deals silently unless the page answers it. This is where it gets
answered.

**Files:** `components/faq/FaqSection.tsx` (new), `lib/faq.ts` (new),
`app/page.tsx`

**Changes:**

1. Six questions in `lib/faq.ts` as data, so the Phase 2 `/faq` route and its
   `FAQPage` schema read the same array instead of forking the copy:
   1. **«Τι γίνεται αν σας χάσω;»** — the repo is yours, the deployment is
      documented, another developer can pick it up. Answer it directly, without
      softening; a deflection here reads as a confirmation.
   2. **«Πόσο κοστίζει;»** — the *model*: fixed build fee plus an optional
      monthly retainer. **No numbers** (§2.2).
   3. **«Πόσο θα πάρει;»** — "3 ημέρες έως 2 μήνες, ανάλογα με το εύρος",
      stated as a range.
   4. **«Γιατί όχι WordPress;»** — speed, ownership, no plugin dependency chain.
      Outcome before mechanism (§11.4).
   5. **«Δουλεύετε εκτός Θεσσαλονίκης;»** — yes, remote, with the real hours.
   6. **«Τι ακριβώς παίρνω από το δωρεάν audit;»** — the §2.2 deliverable, again
      matching the form and S1.7 word for word.
2. Accessible disclosure, hand-built, no library: each question is an `h3`
   wrapping a `<button aria-expanded aria-controls>`, the panel is a region with
   `id` and `role="region" aria-labelledby`. Chevron rotation is decorative and
   `aria-hidden`. State is not conveyed by colour alone (the skill's
   Accessibility / Color Only guideline, severity High) — `aria-expanded` plus
   the visible chevron plus the panel itself carry it.
3. Animate with Framer Motion exactly as `ShowcaseCard` does, `initial={false}`
   so closed panels do not animate on mount. Same easing, same duration — one
   disclosure language on the page.
4. One panel open at a time is **not** enforced; visitors comparing two answers
   should be able to.
5. **No `FAQPage` JSON-LD here.** It ships in Phase 2 with the `/faq` route that
   owns the canonical copy; two FAQ schemas for one body of text is a duplicate
   markup problem, not a bonus.

**Verify:** keyboard only — Tab to each question, Enter and Space both toggle,
focus stays on the button, `aria-expanded` flips. Screen-reader pass: each
question announces its expanded state. No `FAQPage` schema in the page source.
Heading order holds. No number appears anywhere in an answer.

**Commit:**
```
feat(content): add the faq section

Six objections answered on the page, including "what if I lose you" —
§11.6 and the §12 risk register both name it as the one that kills deals
silently. Questions live in lib/faq.ts so phase 2's /faq route shares them.

Slice: S1.9
```

---

## S1.10 — Navigation and final assembly

**Why:** the nav still lists the two sections that existed in Phase 0. Four new
ones have landed, and the header currently offers "Επικοινωνία" and "Δωρεάν
Audit" as two controls pointing at the same anchor.

**Files:** `lib/nav.ts`, `components/layout/Navbar.tsx`,
`components/layout/Footer.tsx`, `app/page.tsx`, `PROGRESS.md`

**Changes:**

1. `NAV_LINKS` becomes four items, all real anchors, inside the §2.3 cap of
   five: **Λύσεις · Διαδικασία · Ερωτήσεις** plus the **Δωρεάν Audit** CTA. Drop
   "Επικοινωνία" — it duplicated the CTA's destination.
2. About goes to `FOOTER_LINKS` (§2.3 puts it in the footer), joining the
   existing Αρχική and phone entries.
3. `app/page.tsx` assembles the final order from the target block above. Confirm
   `ConversionSection` is last.
4. Every new section gets `scroll-mt-24` so anchors clear the fixed header, and
   `aria-labelledby` pointing at its own `h2`.
5. The 1024–1279px nav state (Backlog, S0.12): the desktop links appear at
   `lg` but the phone pill only at `xl`, so that band is a third layout. With
   four links instead of two it needs a real check, not an assumption.
6. `PROGRESS.md`: mark the phase complete, move the ten closed Backlog rows out,
   record what the review rejected.

**Verify:** click every header and footer link at 375, 768, 1024 and 1440 —
every one lands on a section that exists, with the heading clear of the header.
No horizontal overflow in any of the four widths. Heading order: one `h1`, seven
`h2`s, no skips. Keyboard pass through the whole page in document order. Lint,
typecheck, build clean.

**Commit:**
```
feat(nav): wire the four new sections into the navigation

The nav still listed the two sections that existed in phase 0, and
offered two controls pointing at the same anchor. Four links now, inside
the §2.3 cap of five.

Slice: S1.10
```

---

## Closeout

1. All ten slices done, each its own commit.
2. Exit-gate greps, the 44px sweep and the heading-order check all run and
   recorded in `PROGRESS.md`.
3. Manual pass at 375 / 768 / 1024 / 1440, plus a real phone — **and this time
   against the build being shipped**, not the previous one.
4. Keyboard-only pass with eyes on the screen. The Browser pane runs hidden, so
   `:focus` never matches and no focus ring is ever observed rendering; this
   check cannot be automated from here.
5. Lighthouse mobile on the preview URL: Perf ≥ 90 · A11y 100 · BP ≥ 95 ·
   SEO ≥ 95. Best Practices stays at 96 until Phase 2 ships the favicon.
6. PR `Phase 1 — Homepage Restructure`, squash merge, delete the branch.
7. After merge: confirm the production deployment's commit SHA matches the merge
   commit before measuring anything (Phase 0 sat eight commits stale).

---

## UI UX Pro Max — searches run, and what was rejected

Eight searches, restricted per `CLAUDE.md` to `ux`, `landing`, `icons` and
`--stack nextjs`. No `--design-system`, no `--persist`.

**Applied:**

| Finding | Where |
|---|---|
| `trust-authority-conversion` section order: Hero → Proof → Solution → CTA | Target page order, S1.6 |
| Rendering / "Push Client Components down", severity High | S1.4 |
| Typography / Font Size Scale — a modular scale, not arbitrary sizes | S1.1 |
| Accessibility / Target Size (Minimum) — 24px is the web requirement, 44 is ours | S1.3, and the correction is recorded |
| Content / Compact Label Overflow, severity High — a pill label stays on one line | S1.5 |
| Accessibility / Color Only, severity High — state is never colour alone | S1.9 |
| Accessibility / Heading Hierarchy — sequential levels | Exit gate, S1.10 |
| Typography / Line Length — 65–75 characters | S1.7, S1.8 body copy |

**Rejected — playbook wins (`CLAUDE.md`):**

| Recommendation | Source | Why |
|---|---|---|
| Step colours: 1 red / 2 orange / 3 green | `landing` → funnel-3-step-conversion | §2.4 locks monochrome; emerald is status dots only. The *section order* from this pattern is used; the palette is not |
| Card backgrounds `#F5F5F7` or glass, vibrant brand icon colours, dark text | `landing` → bento-grid-showcase | Light surfaces and a second accent contradict §2.4 and §10.2; raw hex contradicts §10.1 |
| Phosphor as the primary icon library, Heroicons as fallback | `icons` → icon-context-accessibility | §2.5 locks Lucide. The *accessibility* half of that entry — decorative icons get `aria-hidden`, interactive ones get an accessible name — is applied |
| Masonry project grid, filter by category | `landing` → portfolio-grid | There is no body of work to filter yet, and `/work` is a Phase 2 route |

**Logged, not actioned:** the skill's Animation / Continuous Animation guideline
(infinite animations are for loading indicators, not decoration) points at
`animate-pulse-slow` on the live dot in the hero and footer. The dot is a status
indicator rather than decoration, and §2.4 locks it, so it stays — but it is
worth a deliberate look in Phase 4 rather than being rediscovered as a finding.

---

## PR template

```markdown
## Phase 1 — Homepage Restructure

Four new sections, five primitives, and the design-system debt from the
phase 0 audit paid down.

### Slices
- S1.1 Tokens: surfaces, hairlines, type scale
- S1.2 UI primitives — Badge, Card, SectionHeader, Eyebrow, StatusDot
- S1.3 Tap targets raised to 44x44
- S1.4 Client boundary pushed down — hero and showcase shells render on the server
- S1.5 Greek pass on the pipeline simulator
- S1.6 Proof strip
- S1.7 Process section
- S1.8 About section
- S1.9 FAQ section
- S1.10 Navigation and final assembly

### Exit gate
- [ ] Page order: hero > proof > tech > solutions > process > about > faq > audit
- [ ] Primitives exist and every section uses them
- [ ] Zero hardcoded hex, zero raw zinc, zero text below 12px
- [ ] Every interactive target >= 44x44 at 375px
- [ ] One h1, seven h2s, no skipped levels
- [ ] Lighthouse mobile: Perf >= 90 / A11y 100 / BP >= 95 / SEO >= 95
- [ ] 375 / 768 / 1024 / 1440 + real phone + keyboard pass

### Deliberately not here
Routes (2) · favicon and OG (2) · FAQPage schema (2) · form delivery (3) ·
scroll reveals and scroll-spy (4) · testimonials, photo, screenshots (5) ·
English (6)
```
