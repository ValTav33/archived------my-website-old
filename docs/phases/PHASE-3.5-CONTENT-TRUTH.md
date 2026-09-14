# PHASE 3.5 — Content Truth Pass

**Branch:** `phase/3.5-content` · branched from `main` at `b76e3f5`
**Governed by:** `docs/PROJECT-PLAYBOOK.md`
**Estimated:** 7 slices · **copy and structure only. Zero design, zero motion.**

> **Why 3.5 and not part of Phase 4.** Val's call, asked and answered before
> any slice ran. Phase 4's gate is a *measurement* — Performance ≥ 95 with
> budgets in CI — and mixing copy rewrites into that PR means a reviewer
> cannot tell a scroll-reveal regression from a sentence change, and a
> rejected paragraph drags ten design commits with it. Content first, in its
> own PR, then Phase 4 starts on copy nobody wants to change.

---

## Objective

Five corrections Val gave on 2026-09-14, after reading the live site. All five
are **truth** problems rather than polish problems, which is why they outrank
Phase 4 despite the site being, in his words, still not nice to look at.

1. **Nothing anywhere may claim the accounts end up in the client's name.**
   Packages differ, and which side holds domain/hosting depends on how much
   time the client wants to spend administering them.
2. **The surname is Ταβλίκος, not Ταυλίκος.** Shipped wrong since Phase 0.
3. **The `/about` copy needs rewriting** — it carries the typo, the ownership
   claim and a framework name in one paragraph.
4. **No technology names anywhere.** A shop owner does not care what it is
   built with; he cares what it does. A tools page may exist one day; it is
   explicitly not now.
5. **The FAQ set is wrong.** Replace it.

---

## The decisions behind this phase

### D1 — Accounts are a **choice offered**, not a transfer promised

Val: *«η επιλογή των λογαριασμών πάει ανάλογα το τι θέλει ο κάθε πελάτης, και
πόσο χρόνο και διάθεση έχει να αφιερώσει στη διαχείρισή τους.»*

So the copy does not say the accounts become the client's. It says the client
picks: **hold the keys yourself, or we hold them for you** — decided per
project and written down before work starts. That is a stronger sentence than
the one it replaces, because it is a service rather than a concession, and it
is true of every package.

### D2 — Code ownership comes **out entirely**

Val's rule: *don't mention it at all, unless every developer does it — then
say it depends on the package.*

**They do not.** In many jurisdictions copyright stays with the author unless
assigned in writing; agencies that keep a client on their own hosting
typically hand over nothing; on Wix or Shopify there is no codebase to hand
over at all. Where it happens it is negotiated, not default. So by Val's own
rule it comes out.

**The one place that cannot go silent** is `/terms`, which carries the heading
«Σε ποιον ανήκει ο κώδικας». A legal page that raises the question and
declines to answer is worse than one that never asked. Two of its three
sentences are true under any package and stay — this site's own code is ours,
and content the client supplies stays theirs. The middle sentence becomes:
**delivery and ownership are agreed in writing per project, before work
starts.** Accurate for every package, and it tells a visitor a written answer
exists.

**The consequence to handle, not hide:** the FAQ's bus-factor answer — the one
§12 names as the silent deal-killer — currently rests entirely on «ο κώδικας
και το repository είναι δικά σας από την πρώτη μέρα». Removing that guts it.
S4 rewrites the answer around what *is* true in every package: the terms are
agreed in writing before anything is built, so what the client holds at the
end is never a surprise.

### D3 — The technology strip is deleted, not replaced

Val chose deletion over substitution. The homepage gets shorter by one
section. Phase 4 owns page rhythm and starts immediately after, so a gap
between the hero and the showcase is a Phase 4 input rather than a Phase 3.5
problem.

### D4 — `/pricing` ships thin, but **true**

Val asked for a placeholder saying «σύντομα». That was argued against once and
the decision is his; what ships is the honest reading of it: **a real page
carrying the pricing model with no numbers yet.** Fixed build fee agreed
before work starts, optional monthly support, what moves the number, and a
button to the audit.

Reason for the interpretation, stated so it can be overruled: Phase 0's entire
objective was deleting placeholder text from this site, and §8 forbids
undefendable content. A page whose only content is «σύντομα» reintroduces the
exact thing Phase 0 removed, on a route people will be sent to from the FAQ.
A page that explains the model is not a placeholder — it is a finished page
missing its numbers, and it can gain them without being rewritten.

This changes §2.2, which currently reads *«Pricing on site: None yet.»* — a
§14 decision-log row is required, not a silent edit.

### D5 — Platform names go too

«Γιατί όχι WordPress» comes out: the FAQ entry, the `/websites` block, the
`/faq` meta description, and the form's placeholder. The *argument* survives
without the name — custom means it loads faster and bends to what the business
actually does. The form's placeholder becomes platform-neutral («το site μας
αργεί») rather than naming a competitor in words we put in a visitor's mouth.

---

## Slices

### S1 — The surname

**Files:** `lib/site.ts`

One line. `SITE.person` is read by `/about`, the footer, the `Person` JSON-LD
node and the generated OG cards, so one edit corrects every surface — the
Phase 0 decision to keep identity in one constant paying for itself.

**Verify:** `grep -rn "Ταυλίκος"` returns nothing in `app`, `components`,
`lib`. The string is absent from every rendered route's HTML, and present
correctly on `/about` and in the `Person` node.

**Commit:** `fix(content): correct the surname to Ταβλίκος`

---

### S2 — Accounts and ownership · 8 files

**Files:** `lib/process.ts`, `lib/faq.ts`, `app/terms/page.tsx`,
`app/about/page.tsx`, `app/websites/page.tsx`, `app/automations/page.tsx`,
`components/about/AboutSection.tsx`, `lib/routes.ts`

Three distinct claims live in these files today and they are currently
conflated. All three are addressed per D1 and D2:

| Claim | Action |
|---|---|
| domain/hosting end up in the client's name | **replaced** by the choice in D1 |
| the code and repository are the client's | **removed** |
| «δεν κρατάμε τον κώδικά σας όμηρο», zero lock-in | **removed** — it only means something next to the claim above |

`lib/process.ts` step 03 is the largest rewrite: its `provides`, `gets` and
`what` all assert transfer. `/terms` gets the D2 treatment exactly.

**Verify:** zero occurrences of repository/code-ownership claims across
`app`, `components`, `lib`. `/terms` still answers its own heading. Every page
that mentioned accounts now describes a choice. `tsc`, `lint`, `build` clean.

**Commit:** `fix(content): stop promising account and code transfer`

---

### S3 — Remove the technology names · 11 files

**Files:** `components/showcase/TechStackStrip.tsx` (deleted), `app/page.tsx`,
`components/hero/HeroSection.tsx`, `components/about/AboutSection.tsx`,
`components/conversion/ConversionSection.tsx`, `components/layout/Footer.tsx`,
`components/showcase/ShowcaseGrid.tsx`, `app/websites/page.tsx`,
`app/websites/opengraph-image.tsx`, `lib/routes.ts`, `lib/site.ts`

1. `TechStackStrip` deleted outright, and its `<TechStackStrip />` removed from
   the homepage (D3). Its `#tech` anchor is not referenced by navigation —
   confirmed before deleting, not after.
2. Framework and tooling names removed from every visible string, including
   the two SEO descriptions in `lib/routes.ts` and the `/websites` OG card.
3. **`SERVICE_CATALOG` rewritten in outcomes rather than tools.** This feeds
   `knowsAbout` and the schema offer catalogue, so leaving it would break the
   Phase 2 property that every string in the structured data is visible on the
   page carrying it.
4. **V10 closes here.** That array is where «AI Concierge & Voice/Chat
   Agents» lives — a capability never delivered, logged as a Backlog row since
   S2.4 and a Val decision since the Phase 2 closeout. Rewriting the array for
   D4 removes it as a side effect, which is the cheapest it will ever be.
5. The case study's «Εργαλεία που χρησιμοποιήθηκαν» badges removed, and the
   `stack` arrays with them.

**Verify:** `grep -rniE "next\.?js|typescript|tailwind|supabase|postgres|n8n|vapi|webhook"` returns nothing in visible copy across `app` and `components`. Every JSON-LD payload still validates and every string in it is visible on its page. No route 404s from the deleted section. Homepage still has exactly one `h1` and no heading skips — the strip carried an `h2`.

**Commit:** `refactor(content): remove technology names from visitor copy`

---

### S4 — The FAQ

**Files:** `lib/faq.ts`, `lib/routes.ts`, `components/faq/FaqSection.tsx`

Five entries, down from six:

| id | Question | Status |
|---|---|---|
| `continuity` | Τι γίνεται αν σας χάσω; | **rewritten** — D2 removed its foundation. §11.6 makes it mandatory, so it is answered from what stays true: written terms before work starts |
| `scope` | Τι ακριβώς φτιάχνετε; | **new** — Val's first topic. Custom sites and automated systems, in outcome language, absorbing D5's speed-and-flexibility argument |
| `pricing` | Πόσο κοστίζει; | **rewritten** — the model, and a link to `/pricing` |
| `timeline` | Πόσο θα πάρει; | **unchanged** — Val: «σωστά» |
| `audit` | Τι παίρνω από το δωρεάν audit; | **unchanged** — defines the CTA, interpolates `AUDIT_DELIVERABLE` |

Deleted: `remote` («Δουλεύετε εκτός Θεσσαλονίκης;») as irrelevant, and
`wordpress` per D5.

The homepage shows a subset via `HOMEPAGE_FAQ_COUNT`; with five entries the
count needs revisiting so the homepage does not show all of them and make
`/faq` pointless.

**Copy goes to Val before commit.** These are five sales arguments, not five
strings.

**Verify:** `FAQPage` JSON-LD carries exactly the five, every answer visible in
the HTML including collapsed panels (the S2.8 fix), homepage subset smaller
than the full set, `/faq` meta description updated.

**Commit:** `feat(content): replace the FAQ set`

---

### S5 — `/about`

**Files:** `components/about/AboutSection.tsx`, `app/about/page.tsx`

The four paragraphs Val quoted, rewritten: correct surname, no framework
names, no ownership claim, and the work described by what it solves rather
than what it is. D1's phrasing on the homepage section too — `/about` expands
the homepage rather than repeating it (Phase 2's D1), so the two must stay
disjoint.

**Draft goes to Val before commit**, as promised.

**Verify:** zero verbatim sentence overlap between `/about` and `/`, the
property Phase 2 measured. `Person` node still references `#business` and
asserts nothing invisible.

**Commit:** `feat(content): rewrite the about copy`

---

### S6 — `/pricing`

**Files:** `app/pricing/page.tsx` (new),
`app/pricing/opengraph-image.tsx` (new), `lib/routes.ts`,
`components/layout/Footer.tsx`

The model per D4: fixed build fee agreed before work starts, optional monthly
support, what moves the number, and the audit as the way to get one. No
figures.

Registered in `lib/routes.ts` — which makes it a compile error to forget the
canonical, and puts it in the sitemap automatically. Footer link, not
navigation: §2.3 caps navigation at five items and that cap has held for two
phases.

**Verify:** route returns 200 with its own title, description, canonical and OG
image; appears in `sitemap.xml`; reachable from the footer and from the FAQ;
one `h1`, no heading skips; 44×44 on the CTA; zero numbers on the page.

**Commit:** `feat(content): add the pricing route`

---

### S7 — Closeout

`PROGRESS.md`, and the playbook edits this phase earns as §14 rows:

- **§2.2** — pricing: a page now exists explaining the model without numbers
- **§2.3** — the route tree gains `/pricing`
- **§2.2 / §11** — no account or code transfer is promised anywhere (D1, D2)
- **§11.6** — the solo-operator answer no longer rests on code ownership
- A row recording that technology names are out of visitor copy (D3), and that
  a tools page is deferred rather than rejected

`docs/VAL-ACTIONS.md`: V10 moves to Done, closed by S3.

**Commit:** `docs(progress): close out phase 3.5`

---

## Exit gate

- [ ] `grep -rn "Ταυλίκος"` — nothing, in source and in every rendered route
- [ ] Zero claims that accounts, code or repositories transfer to the client
- [ ] `/terms` answers its own «Σε ποιον ανήκει ο κώδικας» heading accurately for every package
- [ ] Zero technology or framework names in visitor-facing copy, including meta descriptions and OG cards
- [ ] `SERVICE_CATALOG` contains no undelivered capability — V10 closed
- [ ] Every string in every JSON-LD payload is visible on the page carrying it
- [ ] FAQ is the five entries above; homepage shows a strict subset
- [ ] `/pricing` 200, in the sitemap, linked from footer and FAQ, zero figures
- [ ] Zero verbatim sentence overlap between `/about` and `/`
- [ ] One `h1` per route, no heading skips — the deleted strip carried an `h2`
- [ ] `grep -rn "TODO\|FIXME\|Placeholder"` — nothing
- [ ] `npx tsc --noEmit`, `npm run lint`, `npm run build` clean
- [ ] Lighthouse on the live domain must not regress: A11y 100, BP 100, SEO 100
- [ ] Val has approved the FAQ copy (S4) and the `/about` draft (S5)

---

## Explicitly NOT in this phase

Scroll reveals, scroll-spy, the showcase card hierarchy, the
`prefers-reduced-motion` fix, CI budgets, and the 92 → 95 Performance work —
**all Phase 4, which starts the moment this merges.** Pricing *figures*. A
tools/technology page (deferred, not rejected — Val's words: «ίσως στο μέλλον…
αυτό είναι το λιγότερο σημαντικό αυτή τη στιγμή»). Testimonials, photo,
screenshots (Phase 5). English (6). Blog (7).

**The tempting one that is out:** making the homepage look better. It is the
thing Val actually complained about, and it is Phase 4's entire job. Doing it
here would put design changes in a copy PR and leave both unreviewable.
