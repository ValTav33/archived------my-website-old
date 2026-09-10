# PHASE 0 — Truth & Foundations

**Branch:** `phase/0-foundations`
**Depends on:** nothing
**Blocks:** every other phase
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 8 slices

---

## Objective

Remove everything on this site that is **false, broken, inaccessible or
insecure**. No new sections. No new pages. No visual redesign.

This phase is deliberately unglamorous. Nothing here will look impressive in a
screenshot. But every item is something a prospect, a Lighthouse audit, or a
spam bot will find within ten seconds, and none of it gets cheaper to fix once
five more sections are built on top of it.

## Exit gate

- [ ] No placeholder text renders anywhere on the site
- [ ] No placeholder data (`yourdomain.gr`, `hello@domain.gr`) exists in the codebase
- [ ] Every text colour measures ≥ 4.5:1 against its actual background
- [ ] The audit form cannot be trivially spammed
- [ ] No personally identifiable information is written to logs
- [ ] Keyboard and screen-reader users can complete every flow on the page
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` all pass clean
- [ ] Lighthouse Accessibility = 100 on the preview URL

## Explicitly NOT in this phase

Process section · About section · FAQ · service pages · screenshots ·
testimonials · scroll animations · scroll-spy nav · bento hierarchy · backend ·
English version · pricing. All of those have a later phase. If you find
yourself building one, you have left the slice.

---

## Pre-flight

```bash
git checkout main && git pull
git checkout -b phase/0-foundations
npm install
npx tsc --noEmit && npm run build   # establish a clean baseline
```

Also do these **outside** the repo, in parallel — S0.2 is blocked until they're done:

1. Buy the domain (check `tavlikos.com`, then `tavlikos.gr`, then `tavlikosv.com`)
2. Set up `hello@<domain>` — Zoho Mail free tier, or Google Workspace
3. Confirm the public brand name

---

## S0.1 — Repo hygiene & tooling

**Why:** `npm run lint` currently runs `next lint`, which was removed in Next
16, and there is no ESLint installed at all. The lint gate in the Definition of
Done is unenforceable until this exists.

**Files:** `package.json`, `eslint.config.mjs` (new), `README.md` (new),
`PROGRESS.md` (new), `docs/` (new)

**Changes:**

1. Install ESLint 9 flat config:
   ```bash
   npm i -D eslint @eslint/eslintrc eslint-config-next
   ```
2. Create `eslint.config.mjs` using the flat-config compat wrapper, extending
   `next/core-web-vitals` and `next/typescript`.
3. Replace the `lint` script: `"lint": "eslint ."`
4. Add `"lint:fix": "eslint . --fix"`.
5. Create `README.md`: one paragraph on what this is, the stack, `npm run dev`,
   and a pointer to `docs/PROJECT-PLAYBOOK.md`.
6. Create `docs/PROJECT-PLAYBOOK.md`, `docs/phases/PHASE-0-FOUNDATION.md`,
   and `PROGRESS.md` from the versions supplied.
7. Add `.eslintcache` to `.gitignore`.

**Verify:** `npm run lint` runs and reports on real files (it will surface
existing issues — that's expected; fix only ones that are trivially safe, log
the rest to Backlog).

**Commit:**
```
chore(build): add eslint 9 flat config, readme and project docs

next lint was removed in Next 16 and no eslint was installed, so the lint
gate in the definition of done could not be enforced.

Slice: S0.1
```

---

## S0.2 — Identity constants

**Why:** `lib/site.ts` falls back to `https://yourdomain.gr` and hardcodes
`hello@domain.gr`. If this deploys without `NEXT_PUBLIC_SITE_URL`, the
canonical URL, every OG tag and the JSON-LD `@id` all point at a domain you
don't own. Separately, three different brand names appear across the codebase,
and the Navbar hardcodes `"Valsamis"` instead of reading `SITE.brand`.

**Files:** `lib/site.ts`, `components/layout/Navbar.tsx`,
`components/seo/JsonLd.tsx`, `.env.example`, `package.json`

**Changes:**

1. **Fail loudly on a missing origin.** Replace the fallback:
   ```ts
   const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
   if (!rawUrl) {
     throw new Error(
       "NEXT_PUBLIC_SITE_URL is required. Set it in .env.local and in the Vercel project.",
     );
   }
   export const SITE_URL = rawUrl.replace(/\/$/, "");
   ```
   A build that fails is strictly better than a build that ships the wrong
   canonical URL.

2. **Real email.** `email: "hello@<domain>"`.

3. **Single brand name.** Set `brand`, `siteName` and `legalName` to the
   confirmed name. Delete the second name entirely.

4. **Split opening hours.** Replace the single `OPENS`/`CLOSES` pair with:
   ```ts
   const HOURS = [
     { opens: "10:00", closes: "15:00" },
     { opens: "18:30", closes: "21:00" },
   ] as const;
   ```
   Derive from it: `hoursShort` → `"10:00–15:00 & 18:30–21:00"`,
   `hoursLong` → `"Δευτ – Παρ, 10:00–15:00 & 18:30–21:00"`,
   `openingHoursSchema` → `["Mo-Fr 10:00-15:00", "Mo-Fr 18:30-21:00"]`.

5. **JSON-LD:** emit **two** `openingHoursSpecification` entries, one per
   window. Keep the same `dayOfWeek` array in both.

6. **Navbar:** replace the hardcoded `"Valsamis"` string with `{SITE.brand}`.

7. **`.env.example`:** update with the real domain as the documented example and
   a comment that the variable is required, not optional.

8. **Rename the package** in `package.json` from `obsidian-studio` to the
   project slug.

**Verify:** `grep -rn "yourdomain\|domain.gr\|Valsamis\"" app components lib`
returns nothing. Unset `NEXT_PUBLIC_SITE_URL` and confirm `npm run build`
fails with your message. Set it and confirm the build passes. View source on
`/` and confirm the JSON-LD has two hours entries.

**Commit:**
```
feat(identity): single-source brand, domain, email and split opening hours

Removes the yourdomain.gr fallback so a missing origin fails the build
instead of shipping a wrong canonical url. Consolidates three brand names
into one and models the real split trading schedule as two windows.

Slice: S0.2
```

---

## S0.3 — Shared navigation source

**Why:** `NAV_LINKS` is defined independently in `Navbar.tsx` and
`Footer.tsx`, with different shapes and different link sets. They will drift.
`lib/site.ts` and `lib/audit.ts` already prove the single-source pattern works
in this codebase; navigation is the last holdout.

**Files:** `lib/nav.ts` (new), `components/layout/Navbar.tsx`,
`components/layout/Footer.tsx`

**Changes:**

1. Create `lib/nav.ts`:
   ```ts
   export type NavLink = {
     id: string;          // in-page anchor target
     label: string;
     href?: string;       // set once routes exist in Phase 2
   };

   /** Primary navigation. Max 5 items — see playbook §2.3. */
   export const NAV_LINKS: readonly NavLink[] = [...] as const;

   /** Footer-only links (legal, secondary). */
   export const FOOTER_LINKS: readonly NavLink[] = [...] as const;
   ```
2. Both components import from it. Delete both local definitions.
3. **Set the Phase 0 nav to only what exists:** `Λύσεις` (`#solutions`) and
   `Επικοινωνία` (`#audit`). The other three targets are being deleted in S0.4
   and their real pages arrive in Phase 2. A two-item nav that works beats a
   four-item nav where three lead nowhere.

**Verify:** every nav item in both header and footer scrolls to a section that
exists. No dead anchors.

**Commit:**
```
refactor(nav): single source for navigation links

Slice: S0.3
```

---

## S0.4 — Delete the placeholder sections and fix page order

**Why:** this is the single most damaging item in the repo. `app/page.tsx`
renders three sections whose visible copy is *"Placeholder ενότητα — το
περιεχόμενο προστίθεται στο επόμενο build"*, on a site selling engineering
rigor. Worse, the DOM order is Hero → TechStack → Solutions → **Audit** →
services → work → process, so the page **ends on three empty boxes** and the
nav scrolls visitors *past* the only conversion section to reach them.

**Files:** `app/page.tsx`

**Changes:**

1. Delete the `PLACEHOLDER_SECTIONS` constant and the `.map()` that renders it.
   All of it. Not commented out.
2. Confirm final Phase 0 page order:
   ```
   Navbar
   HeroSection          #hero
   TechStackStrip
   ShowcaseGrid         #solutions
   ConversionSection    #audit      ← last content section
   Footer
   ```
   The page must end on the CTA. Phase 1 inserts Process, About and FAQ between
   Showcase and Conversion; Conversion stays last.

**Verify:** `grep -rn "Placeholder" app components` returns nothing. Scroll the
whole page — it ends on the audit form.

**Commit:**
```
fix(content): remove placeholder sections and end the page on the cta

Three sections rendered visible "placeholder" copy and sat after the
conversion block, so the nav scrolled visitors past the form into empty
boxes. Their real pages land in phase 2.

Slice: S0.4
```

---

## S0.5 — WCAG AA colour remediation

**Why:** measured against the actual surfaces in use:

| Token | Hex | On `#08090D` | On `#0D0F16` | Uses | Status |
|---|---|---|---|---|---|
| `ink-muted` | `#94A3B8` | 7.76 | 7.47 | — | passes |
| `ink-faint` | `#64748B` | 4.18 | 4.02 | 18 | **fails** |
| `ink-ghost` | `#475569` | 2.63 | 2.53 | 26 | **fails badly** |
| `zinc-500` | `#71717A` | 4.12 | 3.96 | 4 | **fails** |
| `placeholder:zinc-600` | `#52525B` | 2.57 | 2.48 | 1 | **fails** — and these are your form placeholders |

**Files:** `tailwind.config.ts`, `app/globals.css`, and every component using
the failing tokens.

**Changes:**

1. **Split `ink-ghost` into two roles.** The reason it went so dark is that it
   serves both real labels *and* decorative bullets. Those are different jobs:
   ```ts
   ink: {
     DEFAULT: "#FFFFFF",   // 21.0  headings
     bright:  "#F8FAFC",   // 19.1  emphasis
     muted:   "#94A3B8",   //  7.47 body copy          (unchanged)
     faint:   "#8B98AC",   //  6.55 captions, timestamps   ← was #64748B
     ghost:   "#788699",   //  5.17 labels, eyebrows       ← was #475569
   },
   /* Decorative only. Never used for text. Every element using this
      must carry aria-hidden. */
   decor: {
     DEFAULT: "#475569",
   },
   ```
   Ratios above are against the card surface `#0D0F16`, the worst case.

2. **Reassign every usage.** Walk all 26 `text-ink-ghost` and 18
   `text-ink-faint` occurrences. Bullets and separators that are already
   `aria-hidden` → `text-decor`. Everything else keeps its token, which now
   passes.

3. **Placeholders:** `placeholder:text-zinc-600` → `placeholder:text-ink-ghost`
   (4.92 on the `#12151E` field background).

4. **`text-zinc-500`** (4 uses) → `text-ink-faint`.

5. **Mirror in `globals.css`:** update `--ink-faint`, add `--ink-ghost` and
   `--decor`.

6. **Audit the `*` selector.** `globals.css` sets `border-color: var(--hairline)`
   on every element. Leave the behaviour, but add a comment explaining it,
   because it silently defeats any component that sets a border width without a
   colour.

**Verify:** run a contrast check on the preview URL — Lighthouse Accessibility
must hit 100. Spot-check the footer sub-bar, form placeholders, architecture
trace line numbers, and the `SYS.ENG`-slot badge, all of which used the worst
value.

**Commit:**
```
fix(tokens): raise the muted text ramp to wcag aa

ink-faint measured 4.02:1 and ink-ghost 2.53:1 on the card surface, both
under the 4.5:1 floor, across 44 usages including form placeholders. Splits
ink-ghost into a text role and an aria-hidden decorative role so dim marks
stay dim without failing an audit.

Slice: S0.5
```

---

## S0.6 — Form security and PII hygiene

**Why:** `/api/audit` has no bot protection and will collect spam within weeks
of being indexed. Separately, `deliverAuditRequest` writes the submitter's
name, email and phone into Vercel logs in plaintext — the code comment already
flags this, and under GDPR it's a real exposure with no lawful basis recorded.

**Files:** `lib/audit.ts`, `app/api/audit/route.ts`,
`components/conversion/AuditForm.tsx`

**Changes:**

1. **Honeypot.** Add an optional `company` field to `AuditPayload` — a name
   bots love. Render it visually hidden (`sr-only`, `tabIndex={-1}`,
   `autoComplete="off"`, `aria-hidden`). Non-empty on the server → return the
   normal `200 { success: true }` and deliver nothing. Never tell a bot it
   failed.

2. **Submit-timing check.** Client stamps `renderedAt` on mount and sends the
   elapsed milliseconds. Server rejects anything under 2500ms the same silent
   way. Humans cannot fill six fields in under two and a half seconds.

3. **Rate limit.** In-memory `Map` keyed on the IP from `x-forwarded-for`, five
   submissions per hour, with a periodic sweep of stale entries. Return `429`
   with a Greek message. **Document the limitation in a comment:** serverless
   instances don't share memory, so this is a speed bump, not a wall. Phase 3
   replaces it with a Supabase-backed counter.

4. **Strip PII from logs.** Replace the `console.info` payload spread with a
   non-identifying record only:
   ```ts
   console.info("[audit] request accepted", {
     receivedAt: new Date().toISOString(),
     intent: payload.intent,
     hasWebsite: Boolean(payload.website),
     briefLength: payload.brief.length,
   });
   ```
   Name, email and phone never reach a log line.

5. **Origin check.** Reject POSTs whose `origin` header doesn't match
   `SITE_URL` in production. Cheap CSRF mitigation for a public form.

**Verify:** submit normally → 200. Fill the honeypot via devtools → 200 with
nothing delivered. Submit in under 2.5s → silently dropped. Six submissions in
an hour → 429. Check the terminal: no email or phone appears in any log line.

**Commit:**
```
feat(security): add honeypot, timing gate, rate limit and pii-safe logging

The audit endpoint had no bot protection and logged submitter name, email
and phone in plaintext. Rate limiting is per-instance and therefore a speed
bump until phase 3 moves the counter to supabase.

Slice: S0.6
```

---

## S0.7 — Accessibility: focus, motion, semantics

**Why:** three separate defects, all of which Lighthouse or a keyboard user
finds immediately.

**Files:** `lib/utils.ts`, `components/layout/Navbar.tsx`,
`components/conversion/AuditForm.tsx`,
`components/conversion/ConversionSection.tsx`,
`components/conversion/DirectContactCard.tsx`, `components/layout/Footer.tsx`

**Changes:**

1. **Reduced-motion bug in `scrollToId`.** `globals.css` sets
   `html { scroll-behavior: auto }` under `prefers-reduced-motion`, but
   `scrollToId` calls `scrollIntoView({ behavior: "smooth" })` in JavaScript,
   which ignores the media query entirely. Fix:
   ```ts
   const prefersReduced = window.matchMedia(
     "(prefers-reduced-motion: reduce)",
   ).matches;
   target.scrollIntoView({
     behavior: prefersReduced ? "auto" : "smooth",
     block: "start",
   });
   ```

2. **Mobile drawer focus.** The drawer traps nothing and restores nothing.
   Add: focus moves to the first link on open; Tab cycles within the panel;
   Escape closes (already works) **and returns focus to the hamburger**. Store
   the trigger in a ref.

3. **Form success focus.** When `status === "success"` the entire form unmounts
   and is replaced by the confirmation card. A screen reader user hears
   nothing. Add `role="status"` and `aria-live="polite"` to the card, plus a
   ref on its heading with `tabIndex={-1}` and a `useEffect` that focuses it on
   mount.

4. **Heading hierarchy.** `ConversionSection` has no `h2`; `DirectContactCard`
   opens at `h3`. Add a visually-hidden `h2` to the section, or promote the
   card's heading. Separately, `Footer` uses `h2` for "Υπηρεσίες", "Πλοήγηση"
   and "Protocols", which compete with page content — demote to `h3` or
   `<p>` with the same styling.

5. **Skip link.** Add a `sr-only focus:not-sr-only` skip-to-content link as the
   first element in `<body>`, targeting `<main>`.

**Verify:** Tab through the entire page — focus is always visible and never
escapes the open drawer. Submit the form with a screen reader running and
confirm the confirmation is announced. Set OS reduced-motion and confirm nav
clicks jump instantly. Lighthouse Accessibility = 100.

**Commit:**
```
fix(a11y): focus management, reduced-motion scroll and heading hierarchy

scrollToId forced smooth behaviour in js, overriding the reduced-motion
rule in css. The drawer had no focus trap and the form success card
replaced the form with no announcement.

Slice: S0.7
```

---

## S0.8 — Copy truth pass

**Why:** the copy currently contains two kinds of falsehood — factual drift
(version numbers) and unverifiable metrics presented as delivered outcomes —
plus jargon aimed at engineers when the buyers are clinic managers and
hoteliers. The plural voice is **correct and stays**; this slice only makes
sure it never hardens into a claim about team size.

**Files:** `components/showcase/TechStackStrip.tsx`,
`components/showcase/ShowcaseGrid.tsx`, `components/hero/HeroSection.tsx`,
`components/layout/Footer.tsx`, `components/layout/Navbar.tsx`,
`components/conversion/DirectContactCard.tsx`

**Changes:**

1. **Version drift.** `TechStackStrip` and the client-portal case both say
   "Next.js 15"; `package.json` is on 16. Use bare `"Next.js"` — it can't go
   stale.

2. **Relabel the metrics.** Per playbook §8, `0s Χρόνος Απόκρισης`,
   `100% Zero-Touch Check-in Support` and `Zero Manual Data Entry` are
   capability descriptions, not delivered outcomes. Rename the showcase
   section heading to **"Ενδεικτικές Αρχιτεκτονικές"** and add one line under
   it stating these are architectures you build, with named case studies
   arriving. Honesty here is a selling point; an unverifiable number probed in
   a sales call is not.

3. **One language per list.** Every metric list is currently mixed Greek and
   English. Make each list wholly Greek.

4. **Voice — keep the plural, audit the claims.** The studio voice is first
   person plural and the existing copy (`σχεδιάζουμε`, `στήνουμε`, `είμαστε
   διαθέσιμοι`) is already correct. **Do not convert it to singular.** What
   this slice does instead is sweep for language that claims *headcount*
   rather than register: "η ομάδα μας", "οι developers μας", "οι ειδικοί μας",
   department names, anything implying co-founders. Plural pronouns stay;
   plural people go. See playbook §2.1 guardrail.

5. **Kill the costume jargon.** Remove the `SYS.ENG` badge from Navbar and
   Footer. Remove `SYSTEMS OPERATIONAL • LATENCY: NORMAL` — you have no uptime
   obligation and a technical buyer will clock it. Replace the footer
   "Protocols" heading with "Επικοινωνία".

6. **Eyebrow consistency.** `ShowcaseGrid` renders `[ 01 // ... ]` in
   `text-live-soft` while `DirectContactCard` renders `[ 02 // ... ]` in
   `text-zinc-500`. Emerald is status-dots-only per playbook §2.4. Both become
   `text-ink-ghost`.

7. **Rewrite the hero trust points.** `Zero Slow Plugins` and `100% Custom
   Code` describe an absence and fail the "so what for my business" test. Aim
   for ownership, speed and the response commitment, phrased as what the client
   gets.

8. **Define the audit.** In `DirectContactCard` and the form's submit area,
   state the deliverable explicitly: 15-minute call plus a short written
   summary of the first three moves, within 24 hours.

9. **Remove invoicing and compliance claims permanently.** No myDATA,
   τιμολόγιο, ΑΦΜ or "νόμιμο παραστατικό" anywhere. Registration is not
   planned, so this is a deletion, not a deferral — it does not return in
   Phase 5. Replace the trust slot with something you can demonstrate today:
   code ownership, no vendor lock-in, the 24-hour response commitment.

**Verify:** read the whole page aloud in Greek. Every claim is either
demonstrable today or labelled as illustrative. The voice is consistently
plural, and nothing on the page would only be true with a team.

**Commit:**
```
refactor(copy): honest labels, plain language, no headcount claims

Relabels capability metrics as indicative architectures per the content
truth policy, drops version numbers that go stale, and removes engineer-
facing jargon aimed at a non-engineer audience. Keeps the plural studio
voice but strips any language implying a team.

Slice: S0.8
```

---

## Phase verification

Run before opening the PR.

```bash
npx tsc --noEmit
npm run lint
npm run build

# nothing should come back
grep -rn "Placeholder\|yourdomain\|domain.gr\|SYS.ENG\|LATENCY" app components lib
grep -rn "text-zinc-500\|text-zinc-600\|Next.js 15" app components
grep -rn "console.log" app components lib
```

Then, on the Vercel preview URL:

- [ ] Lighthouse mobile: Perf ≥ 90, **A11y = 100**, Best Practices ≥ 95, SEO ≥ 95
- [ ] Keyboard-only traversal of the whole page, including the mobile drawer
- [ ] Form: normal submit, honeypot submit, fast submit, rate-limit trip
- [ ] Real phone, portrait and landscape
- [ ] View source: JSON-LD has the correct domain and two hours entries
- [ ] Page ends on the audit form

---

## Pull request

**Title:** `Phase 0 — Truth & Foundations`

```markdown
## What

Removes everything on the site that was false, broken, inaccessible or
insecure. No new sections, no redesign.

## Slices

- S0.1 ESLint 9 flat config, README, project docs
- S0.2 Single-source identity; build now fails on a missing origin
- S0.3 Shared navigation source
- S0.4 Placeholder sections deleted; page now ends on the CTA
- S0.5 WCAG AA colour remediation across 44 usages
- S0.6 Honeypot, timing gate, rate limit, PII-safe logging
- S0.7 Focus management, reduced-motion scroll, heading hierarchy
- S0.8 Copy truth pass

## Exit gate

- [ ] No placeholder text or data anywhere
- [ ] All text ≥ 4.5:1
- [ ] Form spam-resistant, no PII in logs
- [ ] Keyboard and screen-reader complete
- [ ] lint + typecheck + build clean
- [ ] Lighthouse A11y = 100

## Preview

<vercel url>

## Notes

<anything discovered and pushed to Backlog>
```

---

## Backlog seeded by this phase

Move these into `PROGRESS.md` under Backlog at the start of the phase:

- Extract `Badge`, `Card`, `SectionHeader`, `Eyebrow` primitives — pill class strings are duplicated ~16 times with drifting opacity values (**Phase 1**)
- 11 hardcoded hex values remain in components (`#0D0F16`, `#12151E`, `#08090D`) — should be tokens (**Phase 1**)
- Showcase cards carry ~9 discrete elements each at equal visual weight; needs real hierarchy, not just varied cell size (**Phase 4**)
- Footer and Navbar use two different navigation mechanisms (anchors vs `scrollToId`) — unify (**Phase 2**, once real routes exist)
- `ArchitectureTrace` dashed connector uses raw `zinc-700` — tokenise (**Phase 1**)
- Rate limiting is per-instance and therefore weak on serverless — move the counter to Supabase (**Phase 3**)
- `.claude/launch.json` is committed — decide whether to keep it tracked
