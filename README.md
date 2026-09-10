# my-website

The marketing site for Valsamis Tavlikos — a Greek-first (bilingual later)
site selling two things: custom Next.js web development and AI workflow
automation, aimed at Greek SMB owners in and around Thessaloniki. Its single
job is to convert a visitor into a 15-minute audit call. The visual identity
is "Obsidian Minimalist Engineering": matte near-black, monochrome, hairline
borders, terminal typography.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 3 · Framer Motion ·
Lucide · Supabase (leads, from Phase 3) · Vercel (hosting + cookieless
analytics).

## Running it

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL is required
npm run dev                  # http://localhost:3000
```

| Script | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint 9 (flat config) |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run typecheck` | `tsc --noEmit` |

## How this project is run

Read [`docs/PROJECT-PLAYBOOK.md`](docs/PROJECT-PLAYBOOK.md) before changing
anything. It holds the locked decisions, the phase map, the git conventions
and the Definition of Done. [`PROGRESS.md`](PROGRESS.md) is the only source of
truth for what is done right now, and the spec for the phase in flight lives
in [`docs/phases/`](docs/phases/).
