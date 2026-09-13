import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge knows Tailwind's own font-size scale by heart, but not ours.
 * `text-mono-xs` — our 12px floor — is not in its table, so out of the box it
 * guesses the class is a TEXT COLOUR and lets any later `text-<colour>` delete
 * it: `cn("text-mono-xs", "text-zinc-400")` returned `"text-zinc-400"` alone,
 * and the element silently inherited the 16px body size instead. Every badge
 * on the page did exactly that.
 *
 * Registering the step in the `font-size` group fixes the classification: it
 * now conflicts with `text-sm` and `text-base`, which is correct, and with no
 * colour at all. Any future custom font-size step must be added here too.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["mono-xs"] }],
    },
  },
});

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier conflicting ones (e.g. `cn("px-4", "px-6")` -> `"px-6"`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Whether the visitor has asked their OS to reduce motion.
 *
 * `globals.css` sets `scroll-behavior: auto` under this media query, but that
 * only governs CSS-driven scrolling. A JavaScript `scrollIntoView` or
 * `scrollTo` with `behavior: "smooth"` ignores the query completely, so every
 * scripted scroll has to read the preference for itself.
 */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Scrolls to an element id and keeps the URL hash in sync.
 * Used by every in-page anchor (navbar links, the "Δωρεάν Audit" CTA) so the
 * behaviour is identical whether the click came from desktop nav or the
 * mobile drawer.
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  // `replaceState` avoids polluting the back-stack with anchor entries.
  window.history.replaceState(null, "", `#${id}`);
}

/** Return to the top of the page, under the same reduced-motion contract. */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
}

/**
 * Uppercases Greek text the way Greek is actually typeset.
 *
 * Monotonic Greek **drops the tonos in all-caps** — ΑΡΧΙΚΗ, not ΑΡΧΙΚΉ — but
 * keeps the dialytika, so ΐ becomes Ϊ rather than Ι. JavaScript's
 * `toUpperCase` knows none of that: it maps ή to Ή and leaves the accent
 * sitting in the middle of a capitalised word, which a Greek reader reads as
 * a mistake.
 *
 * Found in S2.10 by looking at a generated OG card and seeing «ΑΡΧΙΚΉ». The
 * same call had already shipped in S2.5, where `/work/btl-industries`
 * rendered «ΚΑΤΑΣΚΕΥΑΣΤΉΣ ΙΑΤΡΟΤΕΧΝΟΛΟΓΙΚΟΎ ΕΞΟΠΛΙΣΜΟΎ» in its eyebrow.
 *
 * Note this is only for text we uppercase **in JavaScript**. Labels that are
 * typed in capitals in the source are already correct, and labels uppercased
 * by CSS `text-transform` are the browser's business — the document is
 * `lang="el"`, which is what tells a browser to apply Greek casing rules.
 */
const GREEK_UPPER_FIXES: Readonly<Record<string, string>> = {
  "Ά": "Α",
  "Έ": "Ε",
  "Ή": "Η",
  "Ί": "Ι",
  "Ό": "Ο",
  "Ύ": "Υ",
  "Ώ": "Ω",
  /* Tonos dropped, dialytika kept. */
  "ΐ": "Ϊ",
  "ΰ": "Ϋ",
};

export function greekUpper(value: string): string {
  return value
    .toUpperCase()
    .replace(/[ΆΈΉΊΌΎΏΐΰ]/g, (ch) => GREEK_UPPER_FIXES[ch] ?? ch);
}
