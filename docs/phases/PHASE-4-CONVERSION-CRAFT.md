# PHASE 4 — Conversion & Craft

> **Spec rewritten twice on 2026-09-15.**
>
> The first rewrite replaced playbook §3's Lighthouse-only objective after Val
> said the site reads as "a two-colour thing — not engaging, too much text,
> overwhelming."
>
> The second rewrite is this one, and it came from a sharper correction:
>
> > *"Θέλω πολύ βασικά πράγματα που βοηθάνε στο closing/conversion rate. Τα
> > υπόλοιπα και πιο αναλυτικά ανήκουν στην κάθε διαφορετική σελίδα του
> > website. Οπότε στόχος του landing page είναι το conversion rate. Πάντα."*
>
> The first draft was a plan about looking better. It contained nine slices and
> not one sentence about how a visitor becomes a lead. **The homepage's job is
> conversion; everything analytical belongs on the page that owns it.** Craft
> serves that, it is not the point of the phase. The phase is renamed
> accordingly and playbook §3's Phase 4 row is retitled in S4.0.

---

## 1. Objective

**Turn the homepage into a landing page that closes, and make it legible and
alive on a phone while doing it.**

1. The homepage carries only what helps someone decide. Depth moves to the
   page that owns it.
2. The offer stops being a footnote and becomes the loudest thing on the page.
3. There is always a way to act — on every screen, on a phone.
4. Surfaces, type, glass and motion are rebuilt in service of the above.

**Mobile-first is a hard constraint, not a review step** — Val, 2026-09-15.
Every slice is designed at 375px and opened outward.

---

## 2. Where the homepage spends its visitor today

Measured on the mobile homepage, 2026-09-15.

| Section | Phone screens | Helps close? |
|---|---|---|
| Hero | 1.6 | Yes |
| Proof — who trusted you | **0.6** | **Yes — and it is the smallest** |
| «Ενδεικτικές Αρχιτεκτονικές» | **3.4** | **No. Hypothetical work.** |
| Process | 1.4 | A little |
| About | 1.1 | A little |
| FAQ | 0.6 | Yes |
| Form | 2.2 | Yes |
| **Total** | **12.8** | |

**The largest block on the page describes systems that have not been built for
anyone.** Playbook §2.3 already says *"Homepage carries highlights only; every
section has a deeper page"* — that rule was simply never applied to the
showcase.

### The six conversion mechanics that are absent

Not design problems. Sales-machinery problems.

1. **No way to act in the middle.** Twelve screens, and the only CTAs are at
   the top and the very bottom. A phone visitor scrolls roughly **9,000px with
   nothing in reach.**
2. **The offer is a footnote.** `AUDIT_DELIVERABLE` — *«κλήση 15 λεπτών και
   σύντομη γραπτή σύνοψη με τις τρεις πρώτες κινήσεις, εντός 24 ωρών»* — is the
   entire product, and it renders as 13px grey text beside a form.
3. **The conversion heading names a topic, not an offer.** «Ας συζητήσουμε την
   υποδομή της επιχείρησής σας» tells a visitor what the subject is, never what
   they get.
4. **The form reads long.** Four required fields (`name`, `email`, `phone`,
   `intent`) plus two optional ones, all presented at equal weight.
5. **No reassurance at the decision point.** Free? Will someone call to sell me
   something? What if I do not like it?
6. **Proof appears once, at the top, and never returns** — least of all beside
   the button where the decision is actually made.

### Reference measurements from apple.com

Taken 2026-09-15 from `apple.com` and `/macbook-pro/`, because Val named Apple
as the target. Recorded so this phase argues from observation.

- Adjacent tiles alternate **`#000000` ↔ `#F5F5F7`** — about 19:1. Apple does
  **not** use "similar shades". An all-dark page tops out near 1.4:1, which is
  why one genuinely light band is in scope.
- Body text is **17px**; only **5.8%** of text nodes sit at 12px. Ours: 55%.
- **Two** font weights, **three** dominant text colours. Ours: nine colours.
- **220 images and 13 videos** on one page. Their dark sections are carried by
  bright content, not by the background.
- The global nav is **full-bleed, 48px, `border-radius: 0`**, transparent with
  `backdrop-filter: saturate(1.8) blur(20px)`. The rounded thing is the
  **button** (`border-radius: 980px`) — ours are already `rounded-full`.
- The bar Val liked is the **local nav**: `position: sticky`, 48px, carrying
  page name + section links + a Buy pill.
- `scroll-behavior` is **`auto`**, not `smooth`. Ours is `smooth`.
- **27** `prefers-reduced-motion` rules.
- Headings are left-aligned **33** times, centred **7**. Apple centres the big
  moments only.

### The material findings from our own build

| Finding | Measured |
|---|---|
| Surface ramp invisible | Seven surface tokens span **1.00 → 1.18**; a card is **1.04:1** against the page |
| Type on the floor | **59 of 108** text elements at 12px; the scale jumps 14px → 30px |
| Mostly monospace | **61 of 108** text elements in JetBrains Mono, including every form label |
| Dimmest token used for body | `ink-ghost` on 28 elements, `ink-muted` on 4 |
| Nothing shown | **0 images, 0 video** — glass has nothing to blur |
| Token drift | **60 raw `text-zinc-*` utilities across 27 files**, §10.1 violation since Phase 1 |
| The lock is already inaccurate | The form ships `text-red-300` errors while §10.2 says "emerald… nothing else, ever" |

---

## 3. Decisions taken in the 2026-09-15 conversation

| # | Question | Val's answer |
|---|---|---|
| D1 | Unlock the design? | **Yes**, with one condition: *«τα χρώματα να μείνουν τα ίδια»* |
| D2 | Light band for the form? | **Yes** |
| D3 | Bigger type? | **Yes**, within sensible limits, mobile-first |
| D4 | Photography? | **No.** The seven-shot list was declined: *«όχι τέτοιες φωτογραφίες τότε. Ίσως βάλουμε animated στοιχεία»* |
| D5 | Liquid glass as the signature material? | **Yes**, and do whatever is needed so it does not read as a grey box |
| D6 | Centre things? | Yes — resolved as *the big moments only*, per the Apple measurement |
| D7 | The showcase | **Stays on the homepage, but small** — three cards, one line each; full text moves to the deep pages |
| D8 | Sticky mobile bar contents | **«Δωρεάν Audit» + phone** |

---

## 4. What is unlocked, and what is not

The palette is **not** unlocked — D1. These go into playbook §14 in the S4.0
commit, with §2.4, §10 and §3 edited to match.

| Rule | After |
|---|---|
| Palette — monochrome, emerald for status dots only | **Unchanged in substance.** Two corrections for accuracy: the error red already shipping in the form is documented, and it is stated that **monochrome includes light surfaces** — white carries no hue and is inside the rule. |
| Motion — "no parallax, no scroll-jacking" | **Amended.** `position: sticky` choreography is permitted. **Scroll-jacking — intercepting or retiming the user's scroll — remains banned.** Parallax remains banned. |
| Banned — "gradients, glow blobs" | **Amended to "coloured gradients, glow blobs".** Neutral luminance gradients permitted for depth, glass edge-light and section transitions. |
| Fonts — Inter + JetBrains Mono | **Unchanged as a set.** The lock names which fonts, never the proportion. Mono drops from ~56% of text nodes to ≤20%. |
| Terminal surfaces — max two per viewport | **Unchanged.** |
| Animation library — Framer Motion | **Unchanged.** No GSAP, per CLAUDE.md. |
| WCAG 2.1 AA | **Unchanged**, re-verified per slice including on the new light surface. |
| — | **New: particles permitted under stated limits** — see S4.5. |

Never locked, and therefore free: type scale, text volume, section order,
alignment, nav shape, surface values, CTA placement.

---

## 5. The no-photography constraint

Val declined the shot list on 2026-09-15. **This phase ships zero photographs,
and animated elements do the job photography would have done.**

- **Glass needs something bright behind it.** Without imagery, the only bright
  things are the light band (S4.4) and the animated elements. Both are
  load-bearing, not decorative.
- **Every animated element must be honest.** §8 applies unchanged: an abstract
  animated schematic labelled «ενδεικτικό» is permitted — the showcase already
  carries «Ενδεικτικές Αρχιτεκτονικές» — but nothing may be drawn to resemble a
  screenshot of delivered client work.
- **`PORTRAIT` stays `null`** and `/about` keeps rendering zero `img` elements.
  **V14 stays open in `VAL-ACTIONS.md`**; it is not closed, just not depended
  on. The day a real asset exists it replaces an animated placeholder rather
  than being added beside it.

---

## 6. Sequencing

**Resolved 2026-09-15.** Val merged the Phase 3.5 PR; `origin/main` carries
`75d2f39 Phase 3.5 — Content Truth Pass (#2)`. V21 is cleared. An earlier claim
in this repo that 3.5 was unmerged was read from a stale local `main` and was
wrong.

```
git fetch origin && git checkout main && git pull
git checkout -b phase/4-conversion
```

No stack, no rebase.

---

## 7. Slices

Seven. Conversion work lands first; craft follows. Playbook §4's loop applies
to each: confirm, build only that slice, run §6's Definition of Done, one
Conventional Commit, `PROGRESS.md` updated in the same commit.

**Approval gate, per Val:** at the end of every slice the session stops and
asks for explicit approval before starting the next. No slice begins on assumed
consent.

---

### S4.0 — The materials

Everything else is built out of these. No section is redesigned here.

- **Widen the surface ramp** so a card is genuinely distinguishable from the
  page — roughly 1.3–1.4:1 for the raised plane instead of 1.04. Every text
  token re-verified for AA on every new surface.
- **Add the missing type steps** (the 18–28px middle) and raise the body
  default. `mono-xs` stops being the default label size.
- **Add the light-surface tokens** — a near-white ground with its own AA-verified
  text ramp — so S4.4 has something to stand on.
- **Add the glass primitive**: blurred translucent surface plus the hairline
  edge-light that makes glass legible as glass. One primitive, per §10.5.
- Set the global body size and default text colour so the whole site moves from
  one commit.
- Edit playbook §2.4, §10, §3's Phase 4 row; append §4's entries to §14.

**This is conversion work, not decoration:** unreadable type and an invisible
form are conversion defects before they are aesthetic ones.

**Done when:** the site visibly changes everywhere from one commit; tsc, lint
and build clean; AA holds on every surface old and new; no raw hex in a
component.

---

### S4.1 — The new homepage structure

The slice that answers Val's correction. Structure and the text cut together,
because splitting them produces an intermediate state that reads as neither.

Target order:

```
1. Hero            — what you do, for whom, one CTA
2. Proof           — who trusted you, immediately
3. What you get    — the offer, large                    ← NEW
4. What we do      — two blocks, two lines each → deep pages
5. Showcase        — three cards, one line each (D7)
6. Three steps     — one line each
7. Two objections  — answered
8. Form            — light band
```

- **The showcase shrinks to three one-line cards** (D7). Its problem/solution
  bodies move to `/websites` and `/automations`, which already own that
  material. Nothing is deleted — it relocates.
- Process, About and FAQ compress to their highlight and link out, which is
  what playbook D1 (2026-09-13) already requires.
- ~~Homepage from ~956 words toward ≤ 600 and from 12.8 phone screens to
  ≤ 7.~~ **Withdrawn 2026-09-15, after S4.1 measured what it would cost** —
  see §8. Landed at 817 words and 12.1 screens. The cause is mobile card
  stacking rather than prose, and Val chose to keep every section and add
  more later.
- §8 content truth and §11 copy rules unchanged. Nothing true is removed to
  save space; repetition and hedging are.

**Done when:** the order above renders, the word and height targets are met, no
claim changed meaning, and every relocated paragraph exists on its destination
page.

---

### S4.2 — Put the offer in front

- **A dedicated «Τι παίρνετε» section** built from `AUDIT_DELIVERABLE` — the
  15-minute call and the written summary of the first three moves within 24
  hours — at headline weight, not as a caption. One constant, still, so the
  promise cannot drift.
- **The conversion heading is rewritten** from a topic into an offer.
- **Proof returns beside the form.** The names that appear at the top reappear
  at the decision point.
- **Reassurance beside the button:** free, no obligation, what happens next,
  and when. Only claims that are already true.

**Done when:** the offer is visible above the form at heading size, the promise
still interpolates from one constant, and every reassurance sentence is
defensible.

---

### S4.3 — Somewhere to act, always

- **A sticky bottom bar on mobile: «Δωρεάν Audit» + a call button** (D8).
  Appears once the hero is passed, never covers the form's submit, respects the
  safe area on a notched phone.
- **A mid-page CTA** so the ~9,000px dead stretch stops existing.
- **The header becomes glass and contracts into a floating rounded bar** once
  the hero is passed — Val's "circular edges", earned as a transition rather
  than applied as a default.
- The drawer's accessibility is preserved exactly: focus trap, Escape, focus
  restored to the hamburger, route-change close. **This must not regress** — it
  is the most carefully built component in the repo.

**Done when:** no scroll position on a phone leaves the visitor without a CTA
in reach; the keyboard pass is unchanged; transitions are `transform`/`opacity`
only.

---

### S4.4 — The form, on the light band

The single biggest visual event on the page, and the answer to both "δίχρωμο"
and "η φόρμα να είναι πιο high contrast".

- Full-bleed near-white ground, dark text: the highest contrast available and
  the most credible treatment a form can have.
- **Fields go to at least 16px.** They are 14px today, which makes Safari on
  iPhone zoom the page on focus — a real defect on a phone-first site.
- Labels stop being 12px uppercase mono in the second-dimmest grey.
- **Perceived length drops without touching the database.** `name`, `email`,
  `phone` and `intent` are all `not null` in `0001_audit_requests.sql`; making
  one optional is a migration, and this phase changes no backend. Instead the
  two already-optional fields (`website`, `brief`) collapse behind a
  «προσθέστε λεπτομέρειες (προαιρετικό)» disclosure, so the form presents as
  four fields rather than six. **Phone stays required on purpose** — the
  deliverable is a phone call.

**Done when:** AA holds on the light surface for every text role, no iOS zoom
on focus, and a real submission still reaches the inbox and the database.

---

### S4.5 — The hero, and motion

- Centred headline and sub-headline on mobile; body text stays left (D6).
- **`PipelineSimulator` is promoted.** It is the only element that demonstrates
  rather than describes, and it currently sits ~700px below the fold on a
  phone. It must be visible without scrolling, or on the first scroll.
- Entrance reveals on `transform`/`opacity`, **1–2 elements per viewport**,
  once — not on every re-entry.
- **Animated elements in place of photography** (§5): a schematic per showcase
  card that draws on entry, a connecting line across the three steps, a
  response in the existing 32px grid, and a slow light sweep across the glass —
  which is what finally makes the material read.
- **Particles, under limits:** sparse, slow, hero only, `transform`/`opacity`
  only, paused off-screen, absent under reduced motion, and **kept only if
  S4.6's Lighthouse run holds Performance ≥ 95.** If it costs the budget it is
  cut, not negotiated.
- The CSS-only hero entrance stays CSS-only — §10.7, the LCP element never
  becomes JavaScript-driven.
- `scroll-behavior: smooth` is re-evaluated against Apple's `auto`.
- The `[ 0N // ΕΤΙΚΕΤΑ ]` eyebrow is reconsidered: it is §2.4's banned jargon
  register in a different costume, on every section.

**Done when:** the first phone screen carries the headline, one CTA and
evidence of motion; the reveal budget per viewport is respected; everything
degrades under reduced motion; LCP has not regressed.

---

### S4.6 — Measure, and close

- Lighthouse on the preview deployment, mobile, against §6's budget.
- Re-run every measurement in §2 and record before/after in `PROGRESS.md`.
- Backlog the raw-`zinc` sweep if it has not been absorbed — 60 utilities in 27
  files is its own slice, not a drive-by.
- Update `PROGRESS.md`, `VAL-ACTIONS.md` and the PR body.

---

## 8. Exit gate

The original gate was three Lighthouse numbers, which a site could pass without
changing anything Val complained about. This one tests conversion mechanics
first, craft second, and keeps the old numbers as a floor.

### Conversion

| | Gate |
|---|---|
| Ways to act | From **2** to **≥ 5** on the mobile journey, with one always in reach |
| Longest stretch with no CTA | From **~9,000px** to **0** |
| The offer | Visible at heading size **above** the form, sourced from `AUDIT_DELIVERABLE` |
| Form | Presents as **≤ 4** fields; every field **≥ 16px**; no iOS zoom on focus |
| Reassurance | Present beside the submit button, every sentence defensible |
| Proof | Visible in the first 1.5 screens **and** beside the form |

### Craft

| | Gate |
|---|---|
| Length | **No cap — withdrawn 2026-09-15.** Val, asked whether to drop sections to reach ≤ 7 phone screens: *«κρατάμε αυτές που έχει και βάζουμε περισσότερες ενότητες στο μέλλον.»* The homepage is meant to grow, so a cap on total length fights the plan for the page. The two rows below replace it, and the **Longest stretch with no CTA** row above becomes the load-bearing one. |
| Every section earns its place | Each homepage section either links to the page that owns its detail, or carries a CTA. No section is a dead end. |
| Density | No claim renders twice on the page — playbook D1 applied *within* the homepage, not only across pages |
| Type | **≤ 20%** of text nodes at the 12px floor (from 55%); **≤ 20%** monospace (from 56%) |
| Surfaces | Adjacent sections distinct at arm's length on a phone; **one light band** ships; glass reads as glass on ≥ 3 surfaces |
| Motion | `transform`/`opacity` only; **1–2** animated elements per viewport; **≥ 4** respond to scroll; the hero shows motion on a phone **without scrolling**; all of it degrades under `prefers-reduced-motion` |

### Nothing regressed

Lighthouse **Perf ≥ 95, A11y 100, Best Practices 100, SEO 100**; 44×44 tap
targets hold; AA holds on every surface including the new light one; a real
submission still reaches the inbox and the database.

### After the merge

Conversion rate cannot be measured inside a phase. Vercel Analytics is already
installed, and §13's weekly cadence already asks for it. **Thirty days after
the merge, compare submissions per visit against the pre-merge baseline** and
record the result in `PROGRESS.md`. That is the only honest test of this
phase's objective.

---

## 9. Non-goals

- **No photography.** Val declined it, 2026-09-15. V14 stays open.
- **No second hue.** *«Τα χρώματα να μείνουν τα ίδια.»*
- **No backend change.** The form path, the database and the cron are untouched
  — which is precisely why S4.4 shortens the form's appearance rather than its
  required fields.
- **No GSAP, no new fonts, no stock photography** — CLAUDE.md, unchanged.
- **No scroll-jacking and no parallax**, whatever the Apple reference suggests.
- **No English mirror, no blog.** Phases 6 and 7.
- **No raw-`zinc` sweep inside a visual slice.** Backlog it.
- **No pricing figures.** §2.2 — `/pricing` explains the model, not the number.

---

## 10. Risks

| Risk | Mitigation |
|---|---|
| Particles and choreography cost the Performance budget | S4.6 measures before the PR; particles are the declared first thing cut |
| The sticky bar reads as cheap, or covers content | One bar, two actions, appears only after the hero, never over the submit button; reviewed on a real phone at S4.3's gate |
| The light band stops the site feeling like "Obsidian" | One band, not several. Reviewed on a phone before any second one is considered |
| Glass still reads as a grey box | Explicitly dependent on S4.0's wider ramp and S4.4's light band. If both ship and it still fails, the material is wrong and we say so |
| The header rewrite regresses the drawer's focus trap | Named in S4.3's Done-when. The keyboard pass is V2 and **no focus ring has ever been observed rendering in any phase** — treat with suspicion |
| Moving showcase copy to the deep pages breaks their SEO or duplicates content | S4.1 verifies each relocated paragraph exists once, on its destination page, per playbook D1 |
| Bigger type undoes the length cut | S4.1 runs after S4.0, so the cut is made against the real new length |

---

## 11. PR template

```
Phase 4 — Conversion & Craft

Objective rewritten 2026-09-15 after Val's review. Homepage restructured for
conversion; palette unchanged; §2.4 motion and gradient rules amended,
§14 updated in S4.0.

Conversion, before → after:
- ways to act (mobile):      2 → N
- longest no-CTA stretch: ~9000 → N px
- offer above the form:     no → yes
- form fields shown:          6 → N

Craft, before → after (mobile homepage):
- words:            956 → NNN
- height:        10,406 → N,NNN px
- 12px text:        55% → NN%
- monospace:        56% → NN%
- light surfaces:     0 → 1
- scroll-driven:      0 → N

Lighthouse (mobile, preview): Perf NN · A11y NNN · BP NNN · SEO NNN

Slices: S4.0 … S4.6
```
