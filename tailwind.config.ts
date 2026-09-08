import type { Config } from "tailwindcss";

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
          DEFAULT: "#08090D",
          950: "#08090D", // page background
          900: "#0B0C12", // sunken / footer
          850: "#0D0F16", // terminal card
          800: "#0F1117", // standard card surface
          750: "#141721", // raised / hovered surface
          700: "#1A1D27", // strongest elevation
        },
        /* Type ramp — pure white headings down to hairline labels. */
        ink: {
          DEFAULT: "#FFFFFF",
          bright: "#F8FAFC",
          muted: "#94A3B8", // body copy + monospace
          faint: "#64748B", // captions, timestamps
          ghost: "#475569", // disabled / queued states
        },
        /* The only chromatic token in the system. Status dots only. */
        live: {
          DEFAULT: "#10B981",
          soft: "#34D399",
        },
      },
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
