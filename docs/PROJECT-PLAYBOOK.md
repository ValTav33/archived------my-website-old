# PROJECT PLAYBOOK — tavlikos.com

**Status:** Active
**Owner:** Valsamis Tavlikos
**Repo:** `github.com/ValTav33/my-website`
**Last updated:** 2026-09-10
**Playbook version:** 1.0

---

## 0. What this document is

This is the constitution for the whole website programme, from the first fix to
long after launch. It does not contain the work itself. It contains the rules
that every piece of work follows.

There are three document types in this system, and mixing them up is the main
way projects like this rot:

| Document | Path | Lifespan | Answers |
|---|---|---|---|
| **Playbook** (this file) | `docs/PROJECT-PLAYBOOK.md` | Whole project | *How do we work? What's decided? What's the plan?* |
| **Phase spec** | `docs/phases/PHASE-N-NAME.md` | One phase | *Exactly what do I build right now, and how?* |
| **Progress tracker** | `PROGRESS.md` | Whole project | *Where are we, right this second?* |

**Rule:** the Playbook changes rarely and only by deliberate decision. Phase
specs are written once, at the start of a phase, and are read-only during it.
`PROGRESS.md` changes after every single slice.

### How to start any session

Paste the **Session Bootstrap Prompt** (§9) into a fresh Claude Code session.
It tells the model to read these three files before touching anything. Never
start a session by describing the project from memory — that's how the stale
handover document you're replacing came to exist.

---

## 1. The project in one paragraph

A Greek-first, bilingual-later marketing site for a solo operator in
Thessaloniki selling two things: custom Next.js web development, and AI
workflow automation. The visual identity is "Obsidian Minimalist Engineering" —
matte near-black, monochrome, hairline borders, terminal typography. The site's
job is to convert Greek SMB owners (clinics, short-term rentals, boutique
hospitality, B2B agencies) into a 15-minute audit call. The site currently
looks better than it is: strong design system, zero evidence. This programme
fixes that in that order — truth first, structure second, proof third, polish
last.

---

## 2. Locked decisions

These are settled. Changing one requires editing this section and noting it in
§14 (Decision log), not a passing comment in a chat.

### 2.1 Identity

| Field | Value |
|---|---|
| Public brand | **Tavlikos Systems** — confirmed and registered 2026-09-10. See §14. |
| Person | Valsamis Tavlikos |
| Domain | `tavlikossystems.com` — registered. |
| Email | `info@tavlikossystems.com` |
| Phone | +30 698 832 7654 (personal mobile, published as the business line) |
| Hours | Mon–Fri 10:00–15:00 **and** 18:30–21:00 |
| Voice | **First person plural — studio voice.** "Σχεδιάζουμε", "στήνουμε", "είμαστε διαθέσιμοι". See the guardrail below. |
| Location | Thessaloniki (Εύοσμος), serving Greece + remote |

**Voice guardrail — plural voice, singular facts.** The plural is the register,
not a claim about headcount. Never write anything that is only true with a
team: no "η ομάδα μας", no "οι developers μας", no "οι ειδικοί μας", no
department names, no "founded by" framing implying co-founders. A prospect who
reads about a team and then meets one person feels misled, and that lands at
the worst possible moment in the sale. Plural pronouns and verbs: yes.
Plural people: never.

### 2.2 The offer

| Field | Value |
|---|---|
| Pillar 1 | Custom web development (Next.js) — the fast, owned alternative to WordPress |
| Pillar 2 | AI & workflow automation (n8n, Make, voice/chat agents, data pipelines) |
| CTA | Δωρεάν Audit |
| What the CTA delivers | **15-minute call + a short written summary of the first three moves, within 24 hours** |
| Pricing on site | **None yet.** FAQ explains the *model* (fixed build fee + monthly retainer) without numbers. |
| Timeline claim | "3 ημέρες έως 2 μήνες, ανάλογα με το εύρος" — stated as a range, never a promise |
| Legal status | Not registered, and **not currently planned**. **No myDATA / τιμολόγιο / ΑΦΜ / "νόμιμο παραστατικό" claims anywhere on the site, in any phase.** Revisit only if registration actually happens. |

### 2.3 Structure

Multipage. Homepage carries highlights only; every section has a deeper page.

```
/                       Homepage — hero, proof, solutions, process, about, FAQ, audit
/websites               Pillar 1 service page   [SEO: Κατασκευή ιστοσελίδων Θεσσαλονίκη]
/automations            Pillar 2 service page   [SEO: Αυτοματισμοί AI επιχειρήσεων]
/work                   Project index
/work/[slug]            Individual case study
/process                How I work — 3 steps, in detail
/about                  Ποιος είμαι
/faq                    Technical FAQ
/contact                Audit form + direct channels
/privacy                Πολιτική Απορρήτου                   [built Phase 2, revised Phase 3]
/terms                  Όροι Χρήσης                          [built Phase 2]
/blog                   Article index                        [Phase 7]
/blog/[slug]            Article                              [Phase 7]
/en/*                   English mirror                       [Phase 6]

app/sitemap.ts          Generated sitemap
app/robots.ts           Generated robots.txt
app/icon.tsx            Favicon
app/opengraph-image.tsx Default OG card
app/not-found.tsx       404
```

**Navigation, max 5 items:** Websites · Automations · Έργα · Διαδικασία ·
[Δωρεάν Audit]. About, FAQ, Privacy and Terms live in the footer. `#services`
and `#work` as homepage anchors are **deleted**, not filled.

### 2.4 Design

| Rule | Decision |
|---|---|
| Palette | Monochrome. Emerald `#10B981` for status dots **only** — no eyebrows, no labels, no icons. |
| Terminal motif | Keep as texture, **reduce the count**. Simple over dense. Never more than two terminal surfaces visible in one viewport. |
| Accessibility | **WCAG 2.1 AA is a hard gate.** No text below 4.5:1. Decorative marks must be `aria-hidden`. |
| Motion | Moderate: scroll reveals, scroll-spy nav, hover states. No parallax, no scroll-jacking, no autoplay video. |
| Jargon | `SYS.ENG`, `SYSTEMS OPERATIONAL • LATENCY: NORMAL`, "Protocols" as a heading — **all removed.** Plain Greek. |
| Banned | Gradients, glow blobs, Web3/gamer aesthetics, full-screen video, stock photography of handshakes or generic offices. |
| ROI calculator | **Cut.** It generates a number that can't be backed up. |

### 2.5 Tech

Next.js 16 (App Router) · TypeScript · Tailwind 3 · Framer Motion · Lucide ·
Supabase (leads) · Vercel (hosting) · Vercel Analytics (cookieless, no consent
banner required).

### 2.6 Working method

| Field | Value |
|---|---|
| Executor | Claude Code (Opus 5) |
| Slice size | **One section** per prompt |
| Branching | One feature branch per phase, PR into `main`, squash merge |
| Commits | Conventional Commits |
| Tracker | `PROGRESS.md`, committed, updated after every slice |
| Doc language | English. Site copy stays Greek. |
| Priority | **Get a credible site live fast.** Completeness is subordinate to credibility. |
| Skills | ui-ux-pro-max, advisory only — see CLAUDE.md |

---

## 3. Phase map

Each phase is a branch, a spec, and a PR. Phases are sequential except where
marked. **Launch happens at the end of Phase 3.**

| # | Phase | Objective | Exit gate |
|---|---|---|---|
| **0** | **Truth & Foundations** | Remove everything on the site that is false, broken, inaccessible or insecure. No new sections. | Zero placeholder text, zero placeholder data, AA contrast throughout, form can't be spammed, no PII in logs, lint + typecheck + build all green |
| **1** | **Homepage Restructure** | Correct the funnel order and add the sections that carry credibility: Process, About, FAQ. Extract UI primitives. | Homepage reads top-to-bottom as one argument ending in the CTA. `Badge`/`Card`/`SectionHeader` primitives exist and are used. |
| **2** | **Multipage & SEO** | Build the route tree in §2.3. Service pages, work index, legal pages, sitemap, robots, OG, favicon. | Every route in §2.3 (minus Phase 6/7 items) returns 200 with unique title, description and OG image |
| **3** | **Backend & Go-Live** | Wire the form to Supabase + email. Analytics. **Revise `/privacy` in the same slice that wires delivery** — it currently states that submissions are not stored, which stops being true the moment they are. Then ship. | A real submission lands in Supabase and in your inbox, **and `/privacy` describes what now happens to it**. **← LAUNCH** |
| **4** | **Craft & Motion** | Scroll reveals, scroll-spy nav, real bento hierarchy, ESLint/CI, Lighthouse budgets in CI. | Lighthouse Perf ≥ 95, A11y = 100, SEO = 100 on `/` and `/websites` |
| **5** | **Evidence** *(asset-gated, can start any time)* | Named clients (BTL Industries), the roz-inn.com live link, Fiverr testimonials, screenshots, your photo, one live demo. **No registration/invoicing markers — see §2.2.** | At least one named client, one live link, one testimonial, one photo on the site |
| **6** | **English** | `/en` mirror with proper `hreflang` and locale routing. Re-enable the EL\|EN toggle. | Both locales pass Phase 4's Lighthouse gate |
| **7** | **Blog** | `/blog` index + article route, MDX, article schema. | Three articles published, indexed in sitemap |
| **8** | **Operate** *(ongoing)* | Monthly: dependency updates, Lighthouse re-run, broken-link check, lead-flow test, content refresh. | N/A — recurring |

### Why this order

Phase 0 before anything else because a visitor who reads "Placeholder ενότητα"
on a site selling engineering rigor is gone, and no amount of Phase 4 polish
recovers them. Phase 3 before Phase 4 because a form that silently discards
leads is worse than no form, and polish on an unlaunched site earns nothing.
Phase 5 is asset-gated and deliberately parallel — the moment you get a
screenshot or a testimonial, it goes in, regardless of which phase is open.

---

## 4. The slice loop

Every unit of work follows this loop. No exceptions, including for "quick" fixes.

```
1. READ      PROGRESS.md → current phase, next slice, open blockers
2. READ      docs/phases/PHASE-N-*.md → the slice spec
3. CONFIRM   State the slice ID and what you're about to change. Wait for go.
4. BUILD     Implement only that slice. Do not fix adjacent things you notice.
5. VERIFY    Run the Definition of Done (§6)
6. COMMIT    Conventional Commit, one commit per slice
7. UPDATE    Mark the slice done in PROGRESS.md, in the same commit
8. REPORT    One paragraph: what changed, what you noticed, what's next
```

**Step 4 is the one that gets violated.** If you notice a real problem outside
the current slice, do not fix it. Add it to the **Backlog** section of
`PROGRESS.md` and keep going. Scope creep inside a slice is what makes a PR
unreviewable and a rollback impossible.

**Step 3 exists** because a wrong slice caught before implementation costs
thirty seconds, and after implementation costs a revert.

---

## 5. Git conventions

### Branches

```
phase/0-foundations
phase/1-homepage
phase/2-multipage
phase/3-backend
...
```

One branch per phase. Slices are commits on that branch. Never commit directly
to `main`.

### Commits — Conventional Commits

```
<type>(<scope>): <subject in imperative mood, lowercase, no trailing period>

<body: why, not what — the diff already says what>

Slice: S0.4
```

**Types:** `feat` · `fix` · `refactor` · `style` · `docs` · `chore` · `perf` ·
`test` · `build` · `ci`

**Scopes:** `identity` · `nav` · `tokens` · `hero` · `showcase` · `form` ·
`footer` · `seo` · `a11y` · `security` · `copy` · `content` · `deps`

Examples:

```
fix(tokens): raise muted text ramp to WCAG AA

ink-faint at 4.02:1 and ink-ghost at 2.53:1 both failed AA on the card
surface. Split ink-ghost into a text role and a decorative role so
aria-hidden marks can stay dim without failing an audit.

Slice: S0.4
```

```
feat(security): add honeypot and submit-timing check to audit form

Slice: S0.6
```

### Pull requests

One PR per phase. Title: `Phase 0 — Truth & Foundations`. Body uses the
template at the end of each phase spec. Squash merge. Delete the branch after.

**Review the Vercel preview URL before merging.** That's the entire point of
branching — you get a real deployed URL per phase.

### Rollback

Because every slice is one commit and every phase is one squashed merge:

- Bad slice, not yet pushed → `git reset --hard HEAD~1`
- Bad slice, pushed → `git revert <sha>`, new commit, note it in PROGRESS.md
- Bad phase, already merged → `git revert -m 1 <merge-sha>`
- Production on fire → Vercel dashboard → Deployments → previous → *Promote to Production*. Fix forward after, never under pressure.

---

## 6. Definition of Done

A slice is not done until **every** line passes.

### Every slice

- [ ] `npx tsc --noEmit` — clean
- [ ] `npm run lint` — clean
- [ ] `npm run build` — clean, zero warnings
- [ ] Manual check at 375px, 768px, 1024px and 1440px
- [ ] New or changed interactive elements have a tap target of at least 44×44px
- [ ] Keyboard-only pass: every new interactive element reachable, visible focus ring, logical order
- [ ] No new hardcoded hex values in components — tokens only
- [ ] No new text colour below 4.5:1
- [ ] No `console.log` left behind
- [ ] `PROGRESS.md` updated in the same commit

### Every phase, before the PR

- [ ] All slices done
- [ ] Lighthouse on the preview URL meets the budget below
- [ ] `grep -rn "TODO\|FIXME\|Placeholder\|yourdomain\|domain.gr" app components lib` returns nothing unexpected
- [ ] Preview URL opened on a real phone, not just devtools
- [ ] Phase exit gate from §3 demonstrably met

### Lighthouse budget

| Metric | Phase 0–2 | Phase 3+ | Hard floor |
|---|---|---|---|
| Performance | ≥ 90 | ≥ 95 | 85 |
| Accessibility | **100** | **100** | 100 |
| Best Practices | ≥ 95 | 100 | 95 |
| SEO | ≥ 95 | 100 | 95 |

Accessibility has no tolerance band. You are selling technical quality; a
failing audit on your own site is the cheapest possible way to lose a
technical buyer.

---

## 7. PROGRESS.md protocol

`PROGRESS.md` lives at the repo root and is the **only** source of truth for
current state. If it disagrees with this playbook, PROGRESS.md is right about
*state* and the playbook is right about *rules*.

### Update rules

1. Updated in the **same commit** as the slice it describes. Never a separate
   "update progress" commit.
2. Slices move `[ ]` → `[x]` with the date and the commit short SHA.
3. Anything discovered but out of scope goes to **Backlog** immediately, with
   enough context to act on it three weeks later.
4. Blockers get an owner and a date. A blocker with no owner is a wish.
5. Never delete history. Completed phases collapse into a one-line summary,
   they don't disappear.

### Structure

```markdown
# PROGRESS

**Current phase:** 0 — Truth & Foundations
**Branch:** phase/0-foundations
**Last slice:** S0.3 · 2026-09-10 · a1b2c3d
**Blocked on:** Domain purchase (Val, by 2026-09-12)

## Phase 0 — Truth & Foundations
- [x] S0.1 Repo hygiene & tooling · 2026-09-10 · a1b2c3d
- [ ] S0.2 Identity constants
- [ ] S0.3 Shared navigation source
...

## Completed phases
_(none yet)_

## Backlog
- ArchitectureTrace dashed connector uses a raw zinc-700; move to a token. Found in S0.4.

## Decisions changed since the playbook was written
_(none)_
```

---

## 8. Content truth policy

This is the rule the whole site's credibility rests on. It is not negotiable
and it applies to every phase.

1. **No number appears on the site unless it can be defended in a sales call.**
   If a prospect asks "where does 40% come from?" and there's no answer, the
   number doesn't ship.
2. **Illustrative content must be labelled illustrative.** Architecture
   diagrams that describe capability rather than a delivered project go under
   "Ενδεικτικές Αρχιτεκτονικές", never under a heading implying case studies.
3. **Named clients need permission.** Check the contract before publishing a
   name. "Κατασκευαστής ιατροτεχνολογικού εξοπλισμού" is a legitimate fallback
   and still beats nothing.
4. **Testimonials are attributed** — name, or role + sector + city. Anonymous
   praise reads as invented, because usually it is.
5. **No capability claims you can't demonstrate this week.** If it isn't built,
   it's not on the page.
6. **Legal and compliance claims require the legal fact first.** No myDATA, no
   τιμολόγιο, no ΑΦΜ until registration completes.

---

## 9. Session bootstrap prompt

Paste this into every new Claude Code session, verbatim.

*Gained a fourth file on 2026-09-13: `docs/VAL-ACTIONS.md`. By the end of
Phase 2, work that needed Val personally was scattered across phase
write-ups, §15's open questions and PROGRESS.md — fourteen items in three
places. A session that has not read it will either block on something that is
not its to do, re-raise a settled question, or helpfully do something that
was deliberately left to Val.*

```
Read these four files before doing anything:

1. docs/PROJECT-PLAYBOOK.md — the rules and the phase map
2. PROGRESS.md — where we are right now
3. docs/phases/PHASE-<N>-<NAME>.md — the current phase spec
4. docs/VAL-ACTIONS.md — what is waiting on me, so you don't re-raise it

Then:
- Tell me the current phase and the next unchecked slice.
- Tell me what that slice changes, in two sentences.
- Wait for my go before writing any code.

Follow the slice loop in §4 of the playbook. One slice per turn. Do not fix
things outside the current slice — add them to the Backlog in PROGRESS.md
instead. Run the Definition of Done in §6 before every commit. Update
PROGRESS.md in the same commit as the slice.
```

---

## 10. Design system non-negotiables

Carried into every phase. A slice that violates one of these fails review even
if it works.

1. **Tokens only.** No raw hex in components. If a value isn't in
   `tailwind.config.ts`, add it there first.
2. **One accent.** Emerald is for live status dots. Nothing else, ever.
3. **Hairlines, not borders.** `border-white/[0.07]` structural,
   `border-white/[0.15]` on hover. Two values, not sixteen.
4. **Text ≥ 4.5:1.** Decorative marks get `aria-hidden` and may go dimmer.
5. **One primitive per pattern.** Badge, Card, SectionHeader, Eyebrow. If you
   write the same class string twice, extract it.
6. **Motion degrades.** Everything respects `prefers-reduced-motion`, including
   JavaScript-driven scrolling.
7. **LCP ships without JavaScript.** The hero headline animates in CSS. Never
   convert it to a Framer Motion entrance.
8. **Terminal surfaces are rationed.** Maximum two visible at once.

---

## 11. Copy & communications rules

The audience is a Greek business owner, not an engineer. The aesthetic can be
technical; the language can't.

1. **First person plural — but singular facts.** The studio voice is "we"
   (`σχεδιάζουμε`, `στήνουμε`). Never a claim that requires more than one
   person to be true: no team, no departments, no "our specialists". See the
   guardrail in §2.1.
2. **Plain Greek nouns beat English tech nouns** where a plain one exists.
   Keep the English terms that Greek professionals genuinely use (Next.js,
   automation, dashboard). Drop the ones that are decoration (`SYS.ENG`,
   `Protocols`, `LATENCY: NORMAL`).
3. **One language per list.** Never mix "0s Χρόνος Απόκρισης" and "Zero Manual
   Data Entry" in the same three-item list.
4. **Outcome before mechanism.** "Οι πελάτες σας απαντιούνται στις 3 το πρωί"
   before "n8n webhook → Supabase".
5. **Every claim answers "so what for my business?"** "100% Custom Code" fails
   this. "Ο κώδικας είναι δικός σας — μπορείτε να τον πάρετε και να φύγετε"
   passes.
6. **Objections get answered on the page**, not deflected. The big one for a
   solo operator is "τι γίνεται αν σε χάσω". Answer it in the FAQ, directly:
   code ownership, repo handover, documented deployment.
7. **Headings are sentences a client would say**, not section labels.

---

## 12. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Site launches with a form that discards leads | Medium | Severe | Phase 3 gate is a real end-to-end submission, not a code review |
| Placeholder domain ships to production | Medium | Severe | S0.2 removes the fallback so a missing env var fails the build loudly |
| Never getting evidence assets | **High** | **Severe** | Phase 5 is parallel and asset-gated; chase BTL permission and roz-inn.com in week one |
| Scope creep inside slices | High | Medium | Backlog discipline in §4 step 4 |
| Playbook goes stale like the last handover doc | Medium | High | §14 decision log; PROGRESS.md is the state, this file is only the rules |
| Solo-operator objection kills deals silently | High | High | Answer it explicitly in the FAQ (§11.6) |
| Plural voice drifts into headcount claims | Medium | High | §2.1 guardrail; S0.8 and every later copy slice sweep for team language |

---

## 13. Post-launch operating cadence

**Weekly (15 min):** check leads landed, reply within your stated 24h,
skim Vercel Analytics for the top entry page.

**Monthly (1 hr):** `npm outdated` and patch; re-run Lighthouse on `/` and
`/websites`; broken-link check; submit a test lead end-to-end; add one piece of
evidence (screenshot, testimonial, case study line).

**Quarterly (half day):** review copy against what prospects actually asked you
in calls; update the FAQ with the real objections you heard; review this
playbook and bump its version.

---

## 14. Decision log

Append here whenever a locked decision in §2 changes. Never edit §2 silently.

| Date | Decision | Was | Reason |
|---|---|---|---|
| 2026-09-09 | Playbook v1.0 established | — | Baseline |
| 2026-09-09 | Cut ROI calculator | Planned in handover doc | Generates unverifiable numbers, conflicts with §8 |
| 2026-09-09 | EL\|EN toggle removed until Phase 6 | Present but non-functional | A dead toggle is worse than no toggle |
| 2026-09-09 | Audit deliverable defined | Undefined "free audit" | Vague promise; now 15-min call + written summary in 24h |
| 2026-09-09 | **Voice reversed to first person plural** | First person singular | Val's decision. Studio register. Guardrail added in §2.1: plural voice, singular facts. |
| 2026-09-09 | Brand set to bare **Tavlikos** + category tagline | "Tavlikos Systems" | "Systems" read cold, "Studio" undersells automation; bare surname sidesteps both and matches the domain |
| 2026-09-09 | Registration markers dropped from all phases | Staged for Phase 5 | Registration not planned; a claim with no legal fact behind it violates §8.6 |
| 2026-09-09 | BTL Industries cleared for naming | Unverified | Freelance engagement, no NDA in force |
| 2026-09-09 | roz-inn.com cleared as a live reference | Unverified | Confirmed live and permitted |
| 2026-09-10 | **Brand set to Tavlikos Systems; domain `tavlikossystems.com`; email `info@tavlikossystems.com`** | Bare "Tavlikos" on `tavlikos.com` with `hello@` | Val registered the domain and mailbox. This reverses the 2026-09-09 brand entry above — "Systems" is back. The name follows the domain, not the other way round. Q1 and Q6 closed; S0.2 unblocked. |
| 2026-09-11 | **ui-ux-pro-max installed as an advisory reviewer.** Its design-system generator is banned: the generator's output for this site (light slate background, navy/blue palette, Plus Jakarta Sans) contradicts §2.4. The skill is restricted to `ux`, `landing`, `icons` and `nextjs` searches, and the playbook outranks it on any conflict. Guardrail lives in `CLAUDE.md`, which loads in every session. | No skills installed | The skill activates on any UI task and its own workflow wants to generate a design system for new pages — exactly what Phases 1 and 2 build. Useful as a reviewer, dangerous as a designer. |
| 2026-09-11 | **Definition of Done gains a 1024px manual check and a 44×44px tap-target rule** (§6) | 375 / 768 / 1440 only, no tap-target line | The hero and nav both change layout at 1024px, which the three-width check stepped over; the mobile menu button is 36×36px, below the AA target size. |

---

| 2026-09-13 | **`/privacy` and `/terms` are built in Phase 2; the privacy page is revised in Phase 3.** §2.3 listed both in the route tree Phase 2 builds while §3 listed "Privacy policy" inside Phase 3's objective — the playbook contradicted itself. Resolution: the routes ship in Phase 2 describing what the site actually does today (a submission validated and discarded, no database, no processor, no cookies, no analytics), and Phase 3 revises the privacy page in the same slice that wires delivery. §3's Phase 3 row and §2.3's route tree are both updated above. | §2.3 said Phase 2, §3 said Phase 3 | Val approved D1–D3 on 2026-09-12 before any Phase 2 slice ran. The route had to exist for Phase 2's exit gate ("every route in §2.3 returns 200"), and a policy naming a processor that does not exist yet is the one §8 violation with consequences off the website. |
| 2026-09-13 | **A deeper page expands its homepage section; it never copies it (D1).** `/process` and `/faq` hold the full content and the homepage keeps a highlight plus a link. The homepage therefore got *shorter* in Phase 2, in two places, on purpose. `/faq` is the stated exception: an FAQ answer cannot be split into a highlight and an expansion without becoming a worse answer in both places, so the homepage shows four of the six and `/faq` carries the canonical set and the only `FAQPage` node. | Undefined — §2.3 said "homepage carries highlights" without saying what happened to Phase 1's full-length sections | Verified per page rather than asserted: zero verbatim sentence overlap between `/process` and `/`, and between `/about` and `/`. |
| 2026-09-13 | **The showcase keeps «Ενδεικτικές Αρχιτεκτονικές» and gains an exit (D2).** §8.2 requires that label for architectures describing capability, so the framing stays; the section gains one link to `/work` and the `lead-engine` card links to the BTL case study. **One amendment:** the lede's «Τα πρώτα ονομαστικά case studies προστίθενται σύντομα» became false the moment `/work` shipped with a named study, so it now points at `/work`. Heading, eyebrow and the thirteen translated trace nodes are untouched. | Open question raised in S1.6, deferred 2026-09-11 | Val chose to settle it once `/work` existed rather than rewrite the section twice; this is that, and it cost no re-translation. |
| 2026-09-13 | **Greek text uppercased in JavaScript must go through `greekUpper`.** Monotonic Greek drops the tonos in all-caps (ΑΡΧΙΚΗ, not ΑΡΧΙΚΉ) and keeps only the dialytika; `String.prototype.toUpperCase` does neither. CSS `text-transform: uppercase` is fine and needs no helper — the document is `lang="el"`, which is what tells a browser to apply Greek casing rules, and this was confirmed by inspection. | Not previously stated | Found by generating an OG card and looking at it. The same call had already shipped a Greek typography error in S2.5's case-study eyebrow. |

---

## 15. Open questions

Carried forward until answered. Each blocks something specific.

| # | Question | Status | Blocks | Owner |
|---|---|---|---|---|
| Q1 | Domain registration | **Resolved 2026-09-10 — `tavlikossystems.com` registered**, with `info@` live. | — | — |
| Q2 | BTL Industries naming permission | **Resolved — cleared.** Freelance engagement, no NDA in force. Worth a glance at any signed agreement before it goes live. | — | — |
| Q3 | `roz-inn.com` live and linkable | **Resolved — yes.** Your only live client URL; it carries Phase 5 on its own until screenshots exist. | — | — |
| Q4 | Fiverr reviews usable as testimonials | **Deferred.** Val supplies the specific quotes during Phase 5, with attribution per §8.4. | Phase 5 | Val |
| Q5 | Registration (ΑΦΜ) timeline | **Resolved — not planned.** All invoicing/compliance claims removed from every phase. See §2.2. | — | — |
| Q6 | Brand name | **Resolved 2026-09-10 — Tavlikos Systems**, matching the registered domain. | — | — |

**Both closed on 2026-09-10.** The name, the domain and the mailbox landed
together, which unblocked S0.2 and with it the whole of Phase 2. What remains
open is Q4 — the Fiverr testimonial quotes — which gates Phase 5 only.
