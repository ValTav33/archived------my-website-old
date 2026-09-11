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
