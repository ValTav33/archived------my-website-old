# PROGRESS

> Single source of truth for **where the project is right now**.
> Rules for updating this file: `docs/PROJECT-PLAYBOOK.md` §7.
> Updated in the same commit as the slice it describes — never separately.

**Current phase:** 2 — Multipage & SEO
**Branch:** `phase/2-multipage` — **stacked on `phase/1-homepage`, not on `main`**
**Spec:** `docs/phases/PHASE-2-MULTIPAGE-SEO.md`
**Last slice:** S2.2 · 2026-09-12
**Blocked on:** nothing for S2.3–S2.11. **Two things Val owns:** Phase 1's PR (below), and Vercel Deployment Protection, which S2.12 needs.

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

> **The site is live but NOT launched.** `deliverAuditRequest` is still a stub:
> a submitted form is validated and then discarded, while the visitor is told
> they will hear back within 24 hours. Phase 3 wires delivery and is the real
> launch gate, and Playbook §12 rates the stub Severe. Phase 1 is deliberately
> front end only — see *Backend is out of scope* in the phase spec, which
> records Val's decision verbatim. **Do not "helpfully" wire a transport.**

---

## Phase 2 — Multipage & SEO 🚧 IN PROGRESS

Build the route tree in Playbook §2.3: two service pillars, the work index and
case studies, the deeper pages behind the homepage's sections, the legal pages,
and the SEO plumbing — sitemap, robots, favicon, OG cards, schema graph. Front
end only. Spec: `docs/phases/PHASE-2-MULTIPAGE-SEO.md`.

**D1, D2 and D3 approved by Val, 2026-09-12**, before any slice ran — see the
spec, and *Decisions changed* at the bottom of this file.

- [x] **S2.1** Route shell — layout chrome, route manifest, metadata builder · 2026-09-12
- [x] **S2.2** `/contact` · 2026-09-12
- [ ] **S2.3** `/websites` — service pillar 1
- [ ] **S2.4** `/automations` — service pillar 2
- [ ] **S2.5** `/work` and `/work/[slug]`, and the showcase's exit
- [ ] **S2.6** `/process`, homepage section condensed
- [ ] **S2.7** `/about` and the `Person` node
- [ ] **S2.8** `/faq`, the `FAQPage` node, homepage subset
- [ ] **S2.9** `/privacy` and `/terms`
- [ ] **S2.10** Favicon, OG cards, 404
- [ ] **S2.11** Sitemap, robots, schema graph
- [ ] **S2.12** Navigation and final assembly

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

### Known mid-phase state on this branch, closed by S2.12

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
| 2 | Multipage & SEO | **2/12 slices done** · in progress |
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
| Showcase cards carry ~9 elements each at equal weight — needs real hierarchy | Audit | 4 |
| Rate limiting is per-instance on serverless — move counter to Supabase | S0.6 | 3 |
| Preview deployments share the production rate-limit and origin rules; if preview traffic ever matters, key the limiter per deployment | Exit gate | 3 |
| Rate limit counts requests before validation, so a failed submit consumes a slot. Harmless today (the client validates with the same function first) but revisit with the Supabase counter | S0.6 | 3 |
| Proof strip ships with two named references and an empty testimonial slot. The **assets** half is still open: Fiverr quotes, screenshots and Val's photo | S0.12 · structure closed S1.6 | 5 |
| Framer Motion ignores `prefers-reduced-motion`: `globals.css` collapses CSS animation and transition durations under the media query, but height/opacity driven through JS never sees it. Affects the FAQ disclosure, `ShowcaseCard` and the `Navbar` drawer — fix all three together with `useReducedMotion`, since fixing one leaves the page with two behaviours | S1.9 | 4 |
| `PipelineSimulator` run button (`0.12` / hover `0.22`), its completed node (`0.12`) and the form field's focus border (`0.25`) sit outside the two-value hairline system. All three are control emphasis or focus states rather than structural hairlines, so S1.2 left them raw — decide in Phase 4 whether they become a named `emphasis` ramp | S1.2 | 4 |
| 36 raw `zinc-100/200/300/400` **text** colours across the components, plus `hover:bg-zinc-200` in `globals.css` — a second text ramp competing with the documented `ink` ramp. All clear AA, so this is token discipline, not contrast. S1.1 was scoped to the five decorative `zinc-600/700/800` greys only | S1.1 | 1 |
| `.claude/launch.json` is committed — decide whether to keep tracked | Audit | any |
| Vercel production still served `867f6a1` while eight Phase 0 commits sat unpushed, and that build was marked `index, follow` with placeholder copy live. Watch for stale-deploy drift again after any long local run | Deploy | 8 |
| Project lives in an iCloud-synced folder; sync creates `* 2.ts` / `* 2.json` duplicates inside `.next` that break `tsc --noEmit` until the cache is cleared. Consider moving the repo outside iCloud | S0.7 | any |
| `.DS_Store` files are tracked-adjacent clutter in the working tree; `.gitignore` covers them but stray copies exist | S0.1 | any |

### Closed during Phase 2

| Item | Found in | Closed by |
|---|---|---|
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
