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
        /* S4.0 widened this ramp. It previously spanned 1.00 -> 1.18 against
           the page, which meant a card sat at 1.04:1 and the eye read seven
           named surfaces as one. The values below span 1.00 -> 1.63 along the
           same cool-slate axis, so an elevation step is something a person can
           actually see. Ratios are against obsidian-950 and were solved for,
           not chosen by eye. */
        obsidian: {
          DEFAULT: OBSIDIAN_950,
          950: OBSIDIAN_950, // 1.00  page background
          900: "#13161E", // 1.10  alternating band / footer
          850: "#1C202A", // 1.22  the default Card surface
          800: "#222632", // 1.32  raised card
          775: "#262B39", // 1.41  input / control fill
          750: "#2A303F", // 1.51  hovered surface
          700: "#2F3545", // 1.63  strongest elevation — the AA worst case
        },
        /* Type ramp — pure white headings down to hairline labels.
           Every value here is TEXT and clears WCAG AA (4.5:1) against every
           surface above, worst case being obsidian-750. Ratios are quoted
           against obsidian-850, the card surface these mostly sit on. */
        /* Lifted in S4.0 together with the surfaces. Ratios below are quoted
           against obsidian-700 — the LIGHTEST surface in the system and
           therefore the worst case — not against a mid card. Every value
           clears AA there, which means it clears AA everywhere. The old ramp
           would not have: ink-ghost fell to 4.07:1 on the new card surface.

           ink-ghost is also the token this site over-used for body copy (28
           elements to ink-muted's 4). Brightening it is damage control until
           the components are corrected in a later slice. */
        ink: {
          DEFAULT: "#FFFFFF", // 21.00  headings
          bright: "#F8FAFC", // 19.13  emphasis
          muted: "#BBC4D2", //  6.96  body copy
          faint: "#AAB4C2", //  5.84  captions, timestamps
          ghost: "#99A3B2", //  4.80  labels, eyebrows, line numbers
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
          node: "#39404F", // node ring, idle
          line: "#4E5768", // window dots, dashed connectors
          active: "#616B7F", // node ring, running or done
        },
        /* The second chromatic value, and the last. It has shipped in the form
           since Phase 0 while §10.2 claimed emerald was the only one; S4.4
           makes it a token so it is documented rather than spreading as raw
           `red-500` classes. `ink` is the variant for the light ground —
           `red-400` on white is 2.1:1 and unreadable. Ratios: 6.04:1 on
           `paper`, 6.54:1 on `paper-raised`, 5.48:1 on `paper-sunken`. */
        alert: {
          DEFAULT: "#F87171", // error text on dark surfaces
          ink: "#B3261E", // error text on the light ground
        },
        /* The only chromatic token in the system. Status dots only. */
        live: {
          DEFAULT: "#10B981",
          soft: "#34D399",
        },

        /* ------------------------------------------------------------------
           LIGHT SURFACES — added in S4.0, and still monochrome.

           "Monochrome" locks the hue, not the brightness: white carries no
           hue at all, so a near-white band is inside playbook 2.4 rather than
           an exception to it. This is the single move that gives the site the
           value range an all-dark page physically cannot reach — two adjacent
           dark bands top out around 1.4:1, `paper` against the page is 18.4:1.

           Used deliberately and rarely. One band, the conversion section.
           ------------------------------------------------------------------ */
        paper: {
          DEFAULT: "#F5F6F8", // the light ground
          raised: "#FFFFFF", // a card sitting on that ground
          sunken: "#E9EBEF", // an input well on that ground
        },
        /* The type ramp FOR the light ground. Ratios against `paper`. Never
           use an `ink-*` value on `paper` or the reverse — they are two
           separate systems and mixing them is how a light band ends up with
           4% contrast text. */
        graphite: {
          DEFAULT: "#0A0B0F", // 18.19  headings
          muted: "#434B59", //  8.13  body copy
          faint: "#545D6D", //  6.14  captions, labels
        },
        /* Hairlines for the light ground — the dark pair inverted. */
        rule: {
          DEFAULT: "rgba(10,11,15,0.10)",
          strong: "rgba(10,11,15,0.22)",
        },
      },
      /* Modular type scale. Every step is named; arbitrary `text-[11.5px]`
         values are not allowed back in. 12px is the floor for rendered text,
         which is why `xs` is 13 rather than Tailwind's default 12 — the two
         steps are deliberately distinct, not a rounding of each other.
         Headline sizes stay arbitrary on purpose: they are optical sizes on
         single elements, not a scale. */
      /* Raised across the board in S4.0.

         The measured problem was not that the scale lacked steps — Tailwind's
         own xl/2xl/3xl were sitting there unused. It was that the page only
         ever reached for the bottom three: 89 of 108 text elements on the
         mobile homepage were 14px or smaller, and 59 of them sat on the 12px
         floor. So the bottom of the scale moves up and `lg` closes the gap to
         `xl`; everything from `xl` upward is Tailwind's default, untouched.

         For reference, apple.com sets body copy at 17px and puts only 5.8% of
         its text nodes at 12px. `base` is 17 for that reason.

         `mono-xs` stays at 12 and stays the floor — but it is for genuine
         micro-labels now, not for form labels and body copy. */
      fontSize: {
        "mono-xs": ["0.75rem", { lineHeight: "1.1rem" }], // 12 — the floor. Micro-labels only.
        xs: ["0.875rem", { lineHeight: "1.35rem" }], // 14 — captions, chip text, footer links
        sm: ["0.9375rem", { lineHeight: "1.45rem" }], // 15 — secondary body
        base: ["1.0625rem", { lineHeight: "1.65rem" }], // 17 — body. The default.
        lg: ["1.1875rem", { lineHeight: "1.7rem" }], // 19 — section ledes
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
        /* The edge-light. This inset top highlight is the single thing that
           makes a translucent surface read as GLASS rather than as a grey
           box: it is the lit top bevel your eye uses to place the material in
           front of what is behind it. Paired with `backdrop-filter` in the
           `.glass` classes in globals.css — neither works alone. */
        glass:
          "inset 0 1.5px 0.5px -1px rgba(255,255,255,0.45), inset 1.5px 0 1px -1px rgba(255,255,255,0.16), inset -1.5px 0 1px -1px rgba(255,255,255,0.16), inset 0 -1.5px 1px -1px rgba(255,255,255,0.10), inset 0 0 12px 2px rgba(255,255,255,0.025), 0 10px 36px -20px rgba(0,0,0,0.95)",
        "glass-strong":
          "inset 0 2px 0.5px -1px rgba(255,255,255,0.55), inset 2px 0 1px -1px rgba(255,255,255,0.20), inset -2px 0 1px -1px rgba(255,255,255,0.20), inset 0 -2px 1px -1px rgba(255,255,255,0.13), inset 0 0 14px 2px rgba(255,255,255,0.035), 0 16px 48px -22px rgba(0,0,0,0.95)",
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
