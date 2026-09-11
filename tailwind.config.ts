import type { Config } from "tailwindcss";

import { OBSIDIAN_950 } from "./lib/tokens";

/**
 * "Obsidian Minimalist Engineering".
 *
 * The palette is deliberately monochrome: a matte near-black canvas, a ramp of
 * cool greys for type, and translucent white hairlines for structure. There is
 * exactly ONE chromatic value in the system — `live` (emerald) — and it is
 * reserved for small status dots. No coloured gradients, no glow blobs.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Canvas + surfaces, darkest -> lightest. Almost black, faint slate
           tint, never saturated blue. */
        obsidian: {
          DEFAULT: OBSIDIAN_950,
          950: OBSIDIAN_950, // page background
          900: "#0B0C12", // sunken / footer
          850: "#0D0F16", // terminal card
          800: "#0F1117", // standard card surface
          775: "#12151E", // input / control fill
          750: "#141721", // raised / hovered surface
          700: "#1A1D27", // strongest elevation
        },
        /* Type ramp — pure white headings down to hairline labels.
           Every value here is TEXT and clears WCAG AA (4.5:1) against every
           surface above, worst case being obsidian-750. Ratios are quoted
           against obsidian-850, the card surface these mostly sit on. */
        ink: {
          DEFAULT: "#FFFFFF", // 21.00  headings
          bright: "#F8FAFC", // 19.13  emphasis
          muted: "#94A3B8", //  7.47  body copy + monospace
          faint: "#8B98AC", //  6.55  captions, timestamps
          ghost: "#788699", //  5.17  labels, eyebrows, line numbers
        },
        /* Decorative only — 2.53:1, nowhere near AA. Bullets, separators and
           other marks that carry no information. Every element using this
           must also carry `aria-hidden`. Never use it for text. */
        decor: {
          DEFAULT: "#475569",
        },
        /* The two hairline values, and the only two — playbook §10.3.
           `globals.css` has always declared exactly this pair as `--hairline`
           and `--hairline-strong`; these are the Tailwind side of the same
           decision, so a component can no longer invent a 0.06 or an 0.18.
           Consumed as `border-hairline` / `hover:border-hairline-strong`. */
        hairline: {
          DEFAULT: "rgba(255,255,255,0.07)",
          strong: "rgba(255,255,255,0.15)",
        },
        /* Decorative structure inside the pipeline and architecture widgets:
           window dots, dashed connectors, node rings. Cool greys on the same
           axis as the surfaces, unlike the neutral `zinc-*` these replaced.
           Named for what they draw so nobody mistakes them for a text ramp —
           none of these clears AA and every element using them is either
           `aria-hidden` or purely structural. */
        trace: {
          node: "#2A2F3B", // node ring, idle
          line: "#3F4654", // window dots, dashed connectors
          active: "#525A6B", // node ring, running or done
        },
        /* The only chromatic token in the system. Status dots only. */
        live: {
          DEFAULT: "#10B981",
          soft: "#34D399",
        },
      },
      /* Modular type scale. Every step is named; arbitrary `text-[11.5px]`
         values are not allowed back in. 12px is the floor for rendered text,
         which is why `xs` is 13 rather than Tailwind's default 12 — the two
         steps are deliberately distinct, not a rounding of each other.
         Headline sizes stay arbitrary on purpose: they are optical sizes on
         single elements, not a scale. */
      fontSize: {
        "mono-xs": ["0.75rem", { lineHeight: "1rem" }], // 12 — mono labels, eyebrows, log lines. The floor.
        xs: ["0.8125rem", { lineHeight: "1.125rem" }], // 13 — captions, chip text, footer links
        sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14 — secondary body
        base: ["1rem", { lineHeight: "1.5rem" }], // 16 — body
      },
      /* The tap-target floor, as one value in one place — playbook §6's
         Definition-of-Done rule. Deliberately NOT `44px` typed into fifteen
         components: if the bar ever moves it moves here.

         Note the correction recorded in S0.12: WCAG 2.2 AA's web requirement
         is 24×24 CSS px, which every control on this site already cleared.
         44 is our own bar, chosen for a phone-first Greek SMB audience, so
         missing it is a quality failure and not a conformance one. */
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        /* Neutral depth only — no coloured bloom anywhere in the system. */
        panel:
          "0 24px 64px -32px rgba(0,0,0,0.9), inset 0 1px 0 0 rgba(255,255,255,0.04)",
        raise: "0 8px 24px -12px rgba(0,0,0,0.8)",
      },
      backgroundImage: {
        /* 32px engineering grid at 3% white. */
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
        /* Dot matrix alternative, same 32px rhythm. */
        "dot-matrix":
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
      keyframes: {
        /* Slow breathing opacity for the live status dot's halo. */
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        /* Neutral hairline that brightens then settles — active pipeline node. */
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(255,255,255,0.10)" },
          "50%": { borderColor: "rgba(255,255,255,0.28)" },
        },
        /* Silver tracer travelling down a dashed connector. */
        "tracer-down": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "1" },
          "100%": { transform: "translateY(300%)", opacity: "0" },
        },
        /* Terminal caret. */
        "caret-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        /* Vertical settle for entering elements without framer-motion. */
        "rise-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pulse-slow": "pulse-slow 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-glow": "border-glow 1.8s ease-in-out infinite",
        "tracer-down": "tracer-down 1s ease-in-out infinite",
        "caret-blink": "caret-blink 1.1s step-end infinite",
        "rise-in": "rise-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
