# PHASE 2 — Multipage & SEO

**Branch:** `phase/2-multipage`
**Depends on:** Phase 1 (`phase/1-homepage`, 13 commits) — **not yet merged, see below**
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 12 slices + manual checks · **front end only, zero backend work**

> **This branch is stacked on `phase/1-homepage`, not on `main`.** Phase 2
> needs Phase 1's primitives, tokens and sections, and Phase 1's PR is still
> open pending Val's phone and keyboard passes. After Phase 1 squash-merges,
> rebase before the first slice:
>
> ```
> git rebase --onto main phase/1-homepage phase/2-multipage
> ```
>
> At that point this file is the only commit on the branch, so the rebase is a
> single replay with nothing to resolve. Do it **before** S2.1, not after — a
> rebase across twelve slices is a different animal.

> **`PROGRESS.md` is deliberately untouched by this spec's commit**, matching
> the Phase 1 precedent (`a77f932`). It is also the file most likely to
> conflict at the rebase above, because Phase 1's closeout rewrote it. S2.1's
> commit is the first one that moves the Phase 2 row.

---

## Objective

Playbook §3: *build the route tree in §2.3. Service pages, work index, legal
pages, sitemap, robots, OG, favicon.*

Today the whole site is one URL. Everything Phase 1 built — proof, solutions,
process, about, FAQ, the audit form — is a section of `/` with an anchor, and
a visitor who searches «κατασκευή ιστοσελίδων Θεσσαλονίκη» has exactly one
page to land on, competing on every keyword at once. Phase 2 turns one page
into a route tree where each intent has a page that can rank for it, each page
declares its own canonical, title, description and OG card, and the homepage
goes back to being what §2.3 says it is: **highlights only, with a deeper page
behind every section.**

**No backend.** `deliverAuditRequest` (`app/api/audit/route.ts`) stays a stub.
`/contact` renders the same form and makes the same 24-hour promise, because
Phase 3 owns delivery and Val's decision on that is recorded in the Phase 1
spec and in `PROGRESS.md`. Do not wire a transport, and do not soften the
promise to compensate.

---

## Target route tree

Every route below returns 200 by the end of this phase. `/en/*` (Phase 6) and
`/blog*` (Phase 7) are out.

```
/                    Homepage          highlights + deep links     EXISTS, changes
/websites            Service pillar 1  [Κατασκευή ιστοσελίδων Θεσσαλονίκη]
/automations         Service pillar 2  [Αυτοματισμοί AI επιχειρήσεων]
/work                Delivered work index
/work/[slug]         Case study — generated from PROOF entries that earn one
/process             The three steps, expanded
/about               Ποιοι είμαστε + Person schema
/faq                 All objections + FAQPage schema
/contact             Audit form + direct channels
/privacy             Πολιτική Απορρήτου
/terms               Όροι Χρήσης

app/icon.tsx             Favicon        — also closes the 404 that costs 4 BP points
app/opengraph-image.tsx  Default OG card, generated
app/not-found.tsx        404, in Greek, with a way back
app/sitemap.ts           Generated from lib/routes.ts
app/robots.ts            Generated
```

**Navigation, §2.3, max five items including the CTA:**
Websites · Automations · Έργα · Διαδικασία · **[Δωρεάν Audit]**.
About, FAQ, Privacy and Terms live in the footer.

---

## The three decisions this phase has to make

Each one changes copy or structure that an earlier phase wrote deliberately.
Recorded here with a recommendation so they are decided **once**, before a
slice touches them — not rediscovered inside S2.8 and answered in a hurry.

### D1 — The homepage sections vs their deeper pages · **recommendation: expand, never copy**

§2.3 says the homepage carries highlights. Phase 1 built full sections. If
`/process` is a verbatim copy of `ProcessSection`, the site ships four pairs of
near-duplicate URLs and asks Google to pick — which it will, and not always
the one we want.

The rule for this phase: **a deeper page expands, it never copies.** Concretely,
per section:

| Homepage section | Stays as | `/deep` page holds |
|---|---|---|
| `ProcessSection` | three steps, one line each, link out | each step expanded — what happens, what you provide, what you get, what it costs you in time |
| `AboutSection` | the short version, unchanged | the person, the location, the way of working, what we deliberately do not take on |
| `FaqSection` | **first four** entries + «Όλες οι ερωτήσεις» | all six, and it alone carries `FAQPage` schema |
| `ConversionSection` | stays whole — it is how the page ends | `/contact` adds the direct channels as the page's subject, not a rail |
| `ShowcaseGrid` | unchanged — see D2 | `/work` is delivered work, a different claim |

The homepage gets **shorter** in this phase, in two places (process, FAQ). That
is the intent, not a regression: Phase 1 built those sections at full length
because there was nowhere else to put them.

### D2 — The showcase's «Ενδεικτικές Αρχιτεκτονικές» framing · **recommendation: keep the framing, add the exit**

Deferred to this phase on 2026-09-11 (`PROGRESS.md`, *Decisions changed*): Val
chose to settle it once `/work` exists rather than rewrite the section twice.

`/work` now exists, and that resolves it without a rewrite. The showcase is
honest as it stands — §8.2 **requires** that label for architectures that
describe capability — and BTL is already named in the proof strip. What the
section lacks is an exit: a visitor who wants delivered projects has nowhere
to go. So S2.5 adds one link to `/work`, and the `lead-engine` card, which
describes the same system BTL actually runs, links to its case study.

Nothing in the heading, the eyebrow or the thirteen Greek trace nodes changes.
The copy work S1.10's closeout did on this section is not spent twice, which
was the point of deferring.

### D3 — `/privacy` in Phase 2 or Phase 3 · **conflict in the playbook, recommendation: route now, content revised in Phase 3**

§2.3 lists `/privacy` in the route tree Phase 2 builds. §3 lists "Privacy
policy" inside Phase 3's objective. Both cannot be right.

Resolution: **build both legal routes here, describing what the site actually
does today.** The Phase 2 exit gate is "every route in §2.3 returns 200", so
the route has to exist; and a privacy policy is the one document where §8's
truth policy is also a legal exposure. Today the audit form posts to
`/api/audit`, which validates and discards — so today's policy says the data
is used to contact you about your enquiry and names no processor, because
there is no processor yet. **Phase 3 revises it in the same slice that wires
Supabase and email**, and that is added to Phase 3's scope as an explicit
checklist line, not left implicit.

Neither document invents a legal fact. §8.6 stands: no ΑΦΜ, no myDATA, no
τιμολόγιο, no registered-entity language, no "εταιρεία". **Val reads both
pages before the PR merges** — this is the one place in the phase where a
drafting error has consequences outside the website.

---

## Exit gate

- [ ] Every route in the tree above returns 200; `/work/[slug]` returns 404 for an unknown slug
- [ ] Every route has a **unique** `<title>`, meta description, canonical and OG image — measured by extracting all four from every rendered route and asserting the sets have no duplicates
- [ ] **No route inherits the homepage's canonical.** `alternates.canonical` no longer lives in the root layout
- [ ] One `h1` per route, heading order with no skips, on every route
- [ ] Navigation is exactly five items including the CTA; every header and footer link resolves to a 200
- [ ] Zero broken internal links site-wide — every `href` crawled from the rendered pages
- [ ] `app/sitemap.ts` lists every public route and **nothing** that 404s or is `noindex`
- [ ] `app/robots.ts` allows crawling and points at the sitemap
- [ ] `app/icon.tsx` resolves — no `404 /favicon.ico` in the console on any route
- [ ] `app/not-found.tsx` renders in Greek, is `noindex`, and links back into the site
- [ ] Structured data: one `ProfessionalService`, plus `WebSite`, `Person` (`/about`), `FAQPage` (`/faq` only), `BreadcrumbList` on nested routes, `Service` on both pillars. Every payload validates and **every string in it is visible on the page that carries it**
- [ ] Homepage FAQ shows four entries and carries **no** `FAQPage` schema
- [ ] `grep -rn "TODO\|FIXME\|Placeholder\|yourdomain\|domain.gr" app components lib` returns nothing
- [ ] No hardcoded hex, no raw `zinc-600/700/800`, no text below 12px on any new page
- [ ] Every interactive element ≥ 44×44px at 375px, on every new route
- [ ] Zero English in visitor copy except genuine product nouns
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` all clean
- [ ] Manual pass at 375 / 768 / 1024 / 1440px on `/`, `/websites`, `/work/[slug]`, `/contact` + a real phone
- [ ] Lighthouse mobile on `/`, `/websites`, `/work`: Perf ≥ 90 · **A11y 100** · BP ≥ 95 · SEO ≥ 95
- [ ] Val has read `/privacy` and `/terms` (D3)

### A measurement problem to fix before the gate, not during it

Phases 0 and 1 **both** failed to audit their preview URL: Vercel Deployment
Protection answers anonymous requests with `<title>Login – Vercel</title>`, so
Lighthouse measured a login page, and both phases fell back to a local
`next start`. Twelve routes is where that stops being a workaround — "every
route returns 200 with a unique title" is a claim about a deployment.

**Val, before S2.12:** disable Deployment Protection for preview deployments,
or generate a bypass token. Otherwise Phase 2's gate is measured on localhost
again and the real deployment stays unverified for a third phase.

---

## Explicitly NOT in this phase

Form delivery, Supabase, email, analytics (Phase 3 — **launch**) · scroll
reveals, scroll-spy nav, bento hierarchy, CI Lighthouse (Phase 4) ·
testimonials, screenshots, Val's photo, logo wall (Phase 5 — the slots built
here stay empty and render nothing) · `/en` and the language toggle (Phase 6) ·
`/blog` and article schema (Phase 7) · any palette, font or animation-library
change (§2.4, locked) · the nine Phase 3 and Phase 4 rows already in the
Backlog.

**One tempting thing that is out:** the `prefers-reduced-motion` fix for
Framer Motion. It is a real defect, it now affects three components, and it is
a Phase 4 Backlog row. Twelve new routes is not the change to bundle it with.

---

## S2.1 — Route shell: layout, route manifest, metadata builder

**Why:** three things make every later slice in this phase either trivial or
error-prone, and all three are wrong today.

`Navbar` and `Footer` are rendered by `app/page.tsx`, so a new page would
either repeat them or ship without them. And there is no list of routes
anywhere, so nav, sitemap and breadcrumbs would each grow their own.

**The canonical problem is measured, not predicted.** A throwaway route with
no `metadata` export of its own was added to the tree, built, and its rendered
HTML read:

```
rel="canonical" href="http://localhost:3000"
property="og:url" content="http://localhost:3000"
<title>Web Development &amp; AI Automations Θεσσαλονίκη | Custom Web Apps &amp; Workflows</title>
```

All three inherited from the root layout. So every page added in this phase
would, by default, **declare the homepage as its canonical, claim the
homepage's URL in Open Graph, and carry the homepage's title** — eleven pages
telling search engines they are `/`. It is the most damaging thing this phase
could ship and there is nothing on screen to catch it. The canary was deleted;
reproduce it in thirty seconds if you want to see it again.

**Files:** `app/layout.tsx`, `app/page.tsx`, `lib/routes.ts` (new),
`lib/seo.ts` (new)

**Changes:**

1. Move `<Navbar />`, `<main id="main-content" tabIndex={-1}>` and `<Footer />`
   into `app/layout.tsx`. `app/page.tsx` returns its sections only. The skip
   link keeps working unchanged — it targets `#main-content`, which is now in
   the layout, so it works on every route instead of one.
2. `lib/routes.ts` — **one manifest, every route.** Per entry: `path`, Greek
   `label`, `title`, `description`, whether it is in the primary nav, the
   footer, the sitemap, and its `changeFrequency` / `priority`. `NAV_LINKS`,
   `FOOTER_LINKS`, `app/sitemap.ts` and the breadcrumbs all read this. A route
   that exists and is not in the manifest must be impossible to ship: the
   sitemap test in S2.12 diffs the manifest against the built route list.
3. `lib/seo.ts` — `pageMetadata({ route })` returning a `Metadata` object with
   title, description, **absolute canonical**, and OG/Twitter blocks. Canonical
   is not optional and has no default: every call passes a route, or it does
   not compile.
4. Strip `alternates`, `openGraph.url`, `openGraph.title` and the page-level
   `title.default`/`description` duties from the root layout down to
   `app/page.tsx` via `pageMetadata`. The layout keeps only what is genuinely
   site-wide: `metadataBase`, `title.template`, `robots`, `authors`, `creator`,
   `publisher`, `keywords`, `category`, `openGraph.siteName`,
   `openGraph.locale`, `openGraph.type`, `twitter.card`.

**Verify:** `/` renders identically — capture a `getBoundingClientRect`
fingerprint of ten elements before and after, as S1.2 did, because moving the
nav and footer across a layout boundary is exactly the kind of change that
shifts a wrapper's margin silently. `<link rel="canonical">` on `/` still
points at the origin. `"use client"` count stays at six.

**Commit:**
```
refactor(nav): move the chrome into the root layout and add a route manifest

Navbar, main and Footer were owned by the homepage, and the root layout
declared a canonical that every future page would have inherited — eleven
pages claiming to be the homepage. lib/routes.ts becomes the one list nav,
sitemap and breadcrumbs read, and lib/seo.ts makes a page's canonical
impossible to omit.

Slice: S2.1
```

---

## S2.2 — `/contact`

**Why:** first, because it is the CTA's destination and every other page in
this phase links to it. §2.3: *audit form + direct channels*.

**Files:** `app/contact/page.tsx` (new), `components/conversion/*` (reuse)

**Changes:**

1. `AuditForm` and `DirectContactCard` are reused **as they are**. No copy
   changes, and the 24-hour promise stays word for word — it interpolates
   `AUDIT_DELIVERABLE`, so it cannot drift from the homepage or from process
   step 01.
2. On `/contact` the direct channels are the page's subject, not a rail:
   phone, email, WhatsApp, Telegram, hours from `SITE.hoursLong`, and the
   locality. On the homepage they stay a narrow column beside the form. Same
   components, different emphasis — the layout differs, the copy does not.
3. `h1` states what happens when you send it, not «Επικοινωνία» — §11.7.
4. The homepage's `ConversionSection` keeps `id="audit"` and stays whole (D1).
   The form therefore renders on two URLs. Mitigation: `/contact` has its own
   `h1`, title, description and canonical, and `#audit` is not a URL. No
   `noindex`, no `rel=canonical` cross-claim — they are different pages.

**Verify:** submit with a blank form, a bad email and a valid payload on
`/contact`; validation, `aria-live`, the disabled state, focus management and
the success state all behave exactly as on `/`. Both routes' copies of the
deliverable sentence are identical strings.

**Commit:**
```
feat(content): add the contact route

Same form and same channels as the homepage block, with the channels
promoted from a rail to the subject. The 24-hour promise is the shared
constant, so the two pages cannot disagree.

Slice: S2.2
```

---

## S2.3 — `/websites` — service pillar 1

**Why:** §2.3 names it and assigns it the keyword «Κατασκευή ιστοσελίδων
Θεσσαλονίκη». The homepage currently competes for this against every other
intent on the site.

**Files:** `app/websites/page.tsx` (new), `components/services/*` (new as
needed), `lib/routes.ts`

**Changes:**

1. Structure: `h1` answering the search intent in a client's words → what you
   get → who it is for → how it runs (three lines, linking `/process`) →
   what you own at the end → the objection «γιατί όχι WordPress» answered in
   two sentences, linking `/faq` → CTA to `/contact`.
2. **Every claim is demonstrable this week (§8.5).** Next.js, TypeScript,
   Tailwind, Supabase, preview URLs, a repo you own, documented deployment —
   all true. No numbers of any kind (§8.1): no load times, no Lighthouse
   scores, no "x% faster". A score that is true today and false after one
   dependency bump is not a claim, it is a liability.
3. One `Service` schema node, `provider` referencing `${SITE.url}/#business`
   — the `@id` `JsonLd` already exposes for exactly this.
4. Primitives only: `SectionHeader`, `Card`, `Badge`, `Eyebrow`. No new shell
   patterns. If a layout needs a pattern that does not exist, it goes in
   `components/ui/` (§10.5) and both pillars use it.
5. §2.4: at most two terminal surfaces in one viewport. This page has none —
   the pipeline simulator and the architecture traces live on `/`.

**Verify:** keyword appears in `h1`, title, description and the opening
paragraph, and reads as a sentence in all four — not as a keyword insertion.
`grep` for team language returns nothing (§2.1). One `h1`, `h2`s below it.
Reads at 375px without a horizontal scrollbar.

**Commit:**
```
feat(content): add the websites service page

Pillar 1 gets a page that can rank for the intent instead of sharing the
homepage with everything else. No performance numbers anywhere on it --
a figure that survives today and not the next dependency bump is a
liability, not a claim.

Slice: S2.3
```

---

## S2.4 — `/automations` — service pillar 2

**Why:** §2.3, keyword «Αυτοματισμοί AI επιχειρήσεων».

**Files:** `app/automations/page.tsx` (new), `lib/routes.ts`

**Changes:**

1. Same skeleton as S2.3 — deliberately. Two service pages that argue
   differently are two designs to maintain; §10.5 applies to page shells too.
2. Content is the automation pillar: what gets automated (intake, follow-up,
   enrichment, routing, reporting), what the client stops doing by hand, what
   happens when a workflow fails, and who owns the account the workflow runs
   in. n8n, Supabase, webhooks and LLM calls are named as mechanism, **after**
   the outcome (§11.4).
3. The BTL system is the honest example here, and it is cleared for naming.
   Link to its case study rather than restating it — one description of that
   system, on `/work/btl-industries`.
4. `Service` schema as in S2.3.

**Verify:** as S2.3. Cross-check that nothing on this page claims an
integration the site cannot show: the stack row on the BTL case study is the
bound on what can be named.

**Commit:**
```
feat(content): add the automations service page

Pillar 2, same shell as the websites page. The BTL system is linked
rather than re-described, so one delivered system has exactly one
description on the site.

Slice: S2.4
```

---

## S2.5 — `/work` index, `/work/[slug]` case studies, and the showcase's exit

**Why:** §2.3, and D2. Two named references currently live in `lib/site.ts`
with a comment saying Phase 2's `/work` index reads this array rather than
forking the copy. This is that slice.

**Files:** `app/work/page.tsx` (new), `app/work/[slug]/page.tsx` (new),
`lib/site.ts` (extend `ProofItem`), `components/showcase/ShowcaseGrid.tsx`,
`lib/routes.ts`

**Changes:**

1. `ProofItem` gains `slug` and an **optional** `study` body: the problem in
   the client's terms, what was built, what the client can see or do now, and
   the stack. `href` and `stack` stay as they are.
2. **`/work/[slug]` generates a page only for entries that have a `study`.**
   The index lists every entry; entries without a study render as a row that
   does not link anywhere. This is §8.5 as a routing rule: a case study with
   nothing to say is a thin page that harms the two that do, and «σε εξέλιξη»
   is padding (`lib/site.ts` already says so about roz-inn's booking build).
3. `generateStaticParams` from the studied entries; `notFound()` for anything
   else; `generateMetadata` per case through `pageMetadata`.
4. **No numbers, no outcome metrics, no client quotes** (§8.1, §8.4). BTL:
   what the pipeline does, in the order it does it — the thirteen trace nodes
   S1.10's closeout translated are the vocabulary. roz-inn: a presentation
   site with a gallery, plus a live link. That is all either can honestly say
   today, and it is enough for two real pages.
5. `BreadcrumbList` schema on `/work/[slug]`: Αρχική → Έργα → case.
6. **D2, the showcase's exit:** one link to `/work` in `ShowcaseGrid`, and the
   `lead-engine` card links to `/work/btl-industries`. The heading, the
   eyebrow, the framing and the thirteen nodes are untouched.

**Verify:** `/work/does-not-exist` returns a real 404 with the Greek 404 page.
Every stack badge on a case study names a tool genuinely used — cross-checked
against the `PROOF` entry, which is the record. `roz-inn.com` still answers
200 before its link ships (it did on 2026-09-11). No case-study string is
duplicated verbatim on `/` or on a pillar page.

**Commit:**
```
feat(content): add the work index and case study routes

Reads the PROOF array rather than forking its copy. A case study is
generated only for an entry that has something to say -- a thin page
harms the two real ones, and "in progress" is padding. The showcase keeps
its indicative framing and gains the exit it was missing.

Slice: S2.5
```

---

## S2.6 — `/process`, and the homepage section condensed

**Why:** §2.3, and D1. `ProcessSection` is the full argument today and it is
the deeper page's content, not the highlight's.

**Files:** `app/process/page.tsx` (new), `components/process/ProcessSection.tsx`,
`lib/process.ts` (new), `lib/routes.ts`

**Changes:**

1. Extract the three steps into `lib/process.ts` — the same move `lib/faq.ts`
   made, and for the same reason: two surfaces, one source. Step 01 keeps
   interpolating `AUDIT_DELIVERABLE`; step 02 keeps interpolating
   `TIMELINE_RANGE`. Neither string is retyped in this phase.
2. `/process` expands each step: what happens, what the client provides, what
   they get at the end of it, and how long it takes them (their hours, not
   ours — an audit call costs the client fifteen minutes and that is worth
   saying). Then a CTA to `/contact`.
3. The homepage section condenses to the three steps at one line each, plus
   «Πώς δουλεύουμε, αναλυτικά» to `/process`. It stops being a full section.
4. The timeline stays a **range**, on both surfaces, forever (§2.2, §8.1).

**Verify:** the deliverable sentence is character-identical across
`/process`, `/`, `/contact` and the form — one grep, four hits, one string.
Homepage document height drops; confirm the page still reads as one argument
at 375px and that nothing below the section shifted into a worse position.

**Commit:**
```
feat(content): add the process route and condense the homepage section

The three steps move into lib/process.ts so the page and the homepage
read one source. The homepage keeps one line per step -- section 2.3 says
it carries highlights, and phase 1 only built it at full length because
there was nowhere else to put it.

Slice: S2.6
```

---

## S2.7 — `/about` and the `Person` node

**Why:** §2.3, and `SITE.person` exists specifically for this
(`lib/site.ts`: *Phase 2's `/about` route and its `Person` schema read this*).

**Files:** `app/about/page.tsx` (new), `components/seo/JsonLd.tsx` or a new
`components/seo/PersonJsonLd.tsx`, `lib/routes.ts`

**Changes:**

1. Expands the homepage section: who you are dealing with (named — the
   decision is logged, 2026-09-11), where (Θεσσαλονίκη / Εύοσμος, Greece and
   remote), how the work runs, what we deliberately do not take on, and the
   availability status via `StatusDot`. Hours from `SITE.hoursLong`.
2. **§2.1's guardrail is the review bar for this page, as it was for S1.8.**
   Forbidden, hard fail: «η ομάδα μας», «οι developers μας», «οι ειδικοί
   μας», «το γραφείο μας», any department, any headcount, any years-of-
   experience figure that is not exactly true, any «εταιρεία».
3. `Person` schema: `name` from `SITE.person`, `worksFor` referencing
   `${SITE.url}/#business`, `sameAs` from `SAME_AS`. **No `jobTitle`,
   `alumniOf` or `award` invented** — the graph says only what the page says.
4. Photo slot built, empty, rendering nothing (Phase 5). Same discipline as
   S1.8: no placeholder, no skeleton, no grey box.
5. The homepage's `AboutSection` is unchanged except for a link out. It is
   already short.

**Verify:** `grep -niE "ομάδα|developers μας|ειδικοί|γραφείο μας|εταιρεία|founded"
app/about components/about` returns nothing. Every string in the `Person`
payload is visible on the page. No photo placeholder renders.

**Commit:**
```
feat(content): add the about route and the person node

Expands the homepage section and gives the Person schema the page it was
always meant to sit on. Plural voice, singular facts -- the schema asserts
nothing the page does not show.

Slice: S2.7
```

---

## S2.8 — `/faq`, the `FAQPage` node, and the homepage subset

**Why:** §2.3, D1, and a commitment made twice: the Phase 1 spec defers
`FAQPage` schema to "the `/faq` route that owns it", and `lib/faq.ts` says
Phase 2 builds both and that both read the array.

**Files:** `app/faq/page.tsx` (new), `components/faq/FaqSection.tsx`,
`components/seo/FaqJsonLd.tsx` (new), `lib/routes.ts`

**Changes:**

1. `/faq` renders all six entries and carries the `FAQPage` schema, built from
   `FAQ` — the same array the visible answers render from, so the payload
   physically cannot drift from the text. This is why `lib/faq.ts` is data.
2. The homepage section renders the **first four** — continuity, pricing,
   timeline, wordpress — and links «Όλες οι ερωτήσεις» to `/faq`. Continuity
   stays first on both surfaces: §12 names it the deal-killer.
3. **The homepage carries no `FAQPage` schema.** Marking up six answers where
   four are visible is exactly the mismatch Google penalises, and the Phase 1
   exit gate verified no `FAQPage` schema was present — keep it that way on `/`.
4. The disclosure behaviour is unchanged. Note that the Framer Motion
   `prefers-reduced-motion` defect now renders on two routes instead of one;
   the Backlog row stands and the fix stays in Phase 4. **Do not fix it here.**

**Verify:** extract the schema from `/faq` and diff every `acceptedAnswer`
against the rendered answer text — six for six. `/` has four disclosures and
no `FAQPage` node. Both routes keep one `h1`.

**Commit:**
```
feat(content): add the faq route with the faqpage schema

The schema is built from the same array the answers render from, so the
markup cannot drift from the text. The homepage keeps the four objections
that matter most and no schema at all -- marking up six answers where
four are visible is the mismatch that gets pages penalised.

Slice: S2.8
```

---

## S2.9 — `/privacy` and `/terms`

**Why:** §2.3, and D3. Read D3 before starting — it records the playbook
conflict and how it is resolved.

**Files:** `app/privacy/page.tsx` (new), `app/terms/page.tsx` (new),
`lib/routes.ts`

**Changes:**

1. **Both describe what the site does today, not what Phase 3 will do.**
   Today: the audit form collects the fields it visibly collects, posts them
   to `/api/audit`, and they are used to reply to the enquiry. There is no
   database, no email transport, no third-party processor and no tracking
   beyond what Vercel serves the page with. Name no processor that is not
   wired, and describe no retention period that nothing enforces.
2. §8.6 holds absolutely: no ΑΦΜ, no myDATA, no τιμολόγιο, no registered-
   entity language, no «εταιρεία». The contact point is `SITE.email`.
3. GDPR rights are stated as what a visitor can do — ask what you hold, ask
   you to delete it — with the email that reaches a human. Rights are the
   visitor's by law and stating them invents nothing.
4. `/terms`: scope of what the site is, that content and code ownership pass
   to the client on delivery (already promised in the FAQ and on both pillar
   pages — one claim, four surfaces, no drift), no guarantee language that
   §8.5 cannot support.
5. Both in the footer, both in the sitemap, both a plain single-column read at
   a comfortable measure. No cards, no eyebrows, no terminal texture.
6. **Phase 3's spec gains a line in this slice's commit body**, so the revision
   is scheduled rather than remembered.

**Verify:** every sentence maps to something the code actually does — walk
`app/api/audit/route.ts` line by line against the policy. `grep -niE
"ΑΦΜ|myDATA|τιμολόγι|εταιρεία|Α\.Φ\.Μ"` returns nothing. **Then stop and
hand both pages to Val** (D3) before the phase PR merges.

**Commit:**
```
feat(content): add the privacy and terms routes

Both describe what the site does today: a form that is validated and
discarded, no database, no processor, no tracking. Phase 3 revises the
privacy page in the same slice that wires delivery -- a policy naming a
processor that does not exist yet is the one drafting error here with
consequences off the website.

Slice: S2.9
```

---

## S2.10 — Favicon, OG images, 404

**Why:** §2.3 names all three. The favicon also closes a measured defect:
Best Practices has read 96 in **both** previous phases for one reason, a
`404 /favicon.ico` console error. This is the slice that makes it 100.

**Files:** `app/icon.tsx` (new), `app/opengraph-image.tsx` (new),
`lib/og.tsx` (new), `app/not-found.tsx` (new), one OG route per page

**Changes:**

1. `app/icon.tsx` — generated with `ImageResponse`, monochrome, the mark on
   `OBSIDIAN_950` so it reads on a dark tab strip. No new colour (§10.2).
2. `lib/og.tsx` — **one** OG card design, taking a title and an eyebrow, so
   each route gets a unique image from a single layout. Then a thin
   `opengraph-image.tsx` per route passing its own strings. Uniqueness is
   required by the exit gate; eleven designs are not.
3. **The font is the risk in this slice, and it is Greek.** `next/font/google`
   cannot hand bytes to `ImageResponse`, and `ImageResponse`'s default font
   may render Greek as tofu. Verify by eye on a generated card **before**
   writing the other ten. If it fails: commit an Inter Greek-subset file under
   `app/fonts/`, read it with `fs` on the Node runtime, and pass it in `fonts`.
   Do not ship a card with boxes in the title, and do not silently switch the
   card to Latin to dodge it.
4. `app/not-found.tsx` — Greek, `robots: { index: false }`, links to `/`,
   `/work` and `/contact`. No terminal joke, no «404 SYSTEM ERROR» (§2.4 bans
   the jargon register).
5. Every OG image is referenced by absolute URL through `metadataBase`.

**Verify:** open each generated card as an image and read it — Greek glyphs
present, text inside the safe area, nothing clipped at 1200×630. `curl -I`
the icon on three routes: 200, correct content type. Console on every route:
zero `404`. Re-run Lighthouse on `/` and confirm Best Practices reaches 100 —
this is the first phase where it should.

**Commit:**
```
feat(seo): add the favicon, generated og cards and the 404 page

One card design parameterised per route, so every page has a unique image
without eleven layouts. The favicon closes the 404 console error that has
cost four best-practices points since phase 0.

Slice: S2.10
```

---

## S2.11 — Sitemap, robots, and the schema graph

**Why:** §2.3 names both files, and the exit gate turns them into assertions
about the route manifest rather than hand-maintained lists.

**Files:** `app/sitemap.ts` (new), `app/robots.ts` (new),
`components/seo/JsonLd.tsx`, `lib/routes.ts`

**Changes:**

1. `app/sitemap.ts` — generated from `lib/routes.ts` plus the studied `PROOF`
   slugs. Nothing hand-listed. A route in the manifest that 404s, or a built
   route missing from the manifest, is a build-time mismatch S2.12 measures.
2. `app/robots.ts` — allow all, point at `/sitemap.xml`, disallow `/api/`.
   `/en` and `/blog` do not exist yet and are therefore not mentioned.
3. Promote the structured data to a **graph**: `@graph` with the existing
   `ProfessionalService` (`#business`, unchanged), a `WebSite` node
   (`#website`, `publisher` → `#business`, `inLanguage: "el"`), and the
   per-page `Person`, `Service`, `FAQPage` and `BreadcrumbList` nodes
   referencing those `@id`s instead of redeclaring the business. The `@id`
   comment in `JsonLd.tsx` has been waiting for this since Phase 0.
4. **No `SearchAction`.** There is no site search, and a `potentialAction`
   pointing at a search that does not exist is the same class of lie as a
   placeholder.
5. Hours, address, geo, `sameAs`, `knowsAbout` and the offer catalog keep
   coming from `SITE` and `SERVICE_CATALOG`. Nothing is retyped into a graph.

**Verify:** `/sitemap.xml` and `/robots.txt` both 200. Every `<loc>` fetched
and asserted 200 — the sitemap is the crawl budget and a 404 in it is a
self-inflicted wound. Every `@id` referenced in the graph is defined
somewhere in it. Validate each route's payload; no node asserts a string the
page does not render.

**Commit:**
```
feat(seo): generate the sitemap and robots, and join the schema into a graph

Both files read the route manifest, so a new route cannot be forgotten in
one of them. The business node stops being redeclared per page: the
website, person, service and faq nodes reference the @id that has been
sitting in JsonLd since phase 0.

Slice: S2.11
```

---

## S2.12 — Navigation and final assembly

**Why:** last, deliberately — the Phase 1 precedent (S1.10). Wiring the nav
before the pages exist means shipping links that 404 through the middle of the
phase, and no honest way to test the full link graph until the end.

**Files:** `lib/nav.ts`, `components/layout/Navbar.tsx`,
`components/layout/Footer.tsx`, homepage sections (links out), `lib/routes.ts`

**Changes:**

1. `NAV_LINKS` becomes routes, exactly §2.3's five including the CTA:
   **Websites · Automations · Έργα · Διαδικασία · [Δωρεάν Audit → `/contact`]**.
   `Λύσεις` and `Ερωτήσεις` leave the header; FAQ goes to the footer, and the
   two pillars replace the single `#solutions` anchor.
2. `FOOTER_LINKS` gains `/about`, `/faq`, `/privacy`, `/terms` alongside the
   phone. The footer becomes the site's full index — it is the only surface
   §2.3 lets exceed five.
3. **In-page vs cross-page links.** `ScrollLink` is for anchors on the current
   page and nothing else; a route link is a `next/link`. `navHref` already
   resolves both shapes, so the mechanism exists — the rule is which component
   renders it. A `ScrollLink` to a section that is not on the current route is
   a silent dead click, and after this phase most sections are not.
4. The homepage's links out (`/process`, `/faq`, `/work`) land in their own
   slices; this slice audits that every one of them exists and resolves.
5. The active route is marked in the nav — `aria-current="page"`, and a visual
   state that is not a new colour (§10.2).
6. Mobile drawer: the five items, the focus trap unchanged, and it must close
   on navigation. A drawer that stays open across a route change is the classic
   App Router nav bug and it is invisible in devtools at desktop width.
7. Full exit-gate sweep. Title / description / canonical / OG extracted from
   every route and asserted unique; every internal `href` crawled and asserted
   200; heading outline per route; tap targets at 375px on every new page;
   Lighthouse on `/`, `/websites`, `/work` — on the **preview URL** if Val has
   cleared Deployment Protection, otherwise on a local production build with
   that stated plainly, as Phases 0 and 1 both had to.

**Verify:** the header has five items at 1024px and above, and the drawer has
the same five at 375px. Zero broken internal links. `aria-current` on exactly
one item per route. Tab order follows document order on every route with no
positive `tabindex`. The drawer closes when a link is followed.

**Commit:**
```
feat(nav): wire the route tree into the navigation

Five items including the CTA, per section 2.3: the two pillars replace the
solutions anchor and FAQ moves to the footer. ScrollLink is now for
same-page anchors only -- after this phase most sections live on another
route, where a scroll link is a silent dead click.

Slice: S2.12
```

---

## Closeout

1. Full exit gate re-measured on the branch, with every number written into
   `PROGRESS.md` — counts and measurements, not adjectives.
2. Lighthouse mobile on `/`, `/websites`, `/work`. Best Practices should reach
   **100** for the first time (S2.10). If it does not, find the reason before
   writing the number down; Phases 0 and 1 both confirmed the cause rather
   than assuming it.
3. `PROGRESS.md`: Phase 2 to done, the Phase 2 Backlog rows folded in, the
   D1–D3 decisions copied into *Decisions changed since the playbook was
   written* with their dates.
4. **Playbook edits this phase earns** (§14 requires a decision-log row, never
   a silent §2 edit):
   - D3's resolution — `/privacy` and `/terms` are built in Phase 2 and the
     privacy page is revised in Phase 3. §2.3 and §3 currently disagree.
   - Phase 3's scope gains an explicit "revise `/privacy` when delivery is
     wired" line.
5. PR opened with the template below. **Val reads `/privacy` and `/terms` on
   the preview before merging** (D3).

---

## UI UX Pro Max — allowed searches for this phase

`CLAUDE.md` restricts the skill to `--domain ux`, `--domain landing`,
`--domain icons` (Lucide only) and `--stack nextjs`, advisory only, playbook
wins every conflict. For this phase the useful searches are service-page
structure, pricing-objection handling and breadcrumb/navigation patterns.

**Expect the same five rejections `PROGRESS.md` already logs** — the landing
domain will recommend a trust-blue accent, light testimonial surfaces, gold
stars and a rotating logo carousel. All five are already rejected with reasons.
Do not re-litigate them, and do not apply them because a second search
repeated them. Anything genuinely new and out of slice goes to the Backlog.

---

## PR template

```markdown
## Phase 2 — Multipage & SEO

Eleven routes, a generated sitemap and robots, a schema graph, a favicon and
per-route OG cards. The homepage goes back to carrying highlights.

### Slices
- S2.1 Route shell — layout chrome, route manifest, metadata builder
- S2.2 /contact
- S2.3 /websites
- S2.4 /automations
- S2.5 /work and /work/[slug], and the showcase's exit
- S2.6 /process, homepage section condensed
- S2.7 /about and the Person node
- S2.8 /faq, the FAQPage node, homepage subset
- S2.9 /privacy and /terms
- S2.10 Favicon, OG cards, 404
- S2.11 Sitemap, robots, schema graph
- S2.12 Navigation and final assembly

### Exit gate
- [ ] Every route 200; unknown /work slug 404s
- [ ] Unique title, description, canonical and OG image per route
- [ ] No route inherits the homepage canonical
- [ ] Five nav items including the CTA; zero broken internal links
- [ ] Sitemap and robots generated from the route manifest
- [ ] Schema graph validates; every asserted string is visible on its page
- [ ] No favicon 404 on any route
- [ ] Lighthouse mobile on /, /websites, /work: Perf >= 90 / A11y 100 / BP >= 95 / SEO >= 95
- [ ] 375 / 768 / 1024 / 1440 + real phone + keyboard pass
- [ ] Val has read /privacy and /terms

### Deliberately not here
Form delivery, analytics (3) · scroll reveals and scroll-spy (4) ·
reduced-motion fix for Framer Motion (4) · testimonials, photo, screenshots
(5) · English (6) · blog (7)
```
