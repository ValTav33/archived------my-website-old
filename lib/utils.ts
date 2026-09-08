import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names, letting later Tailwind utilities win over
 * earlier conflicting ones (e.g. `cn("px-4", "px-6")` -> `"px-6"`).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Smooth-scrolls to an element id and keeps the URL hash in sync.
 * Used by every in-page anchor (navbar links, the "Δωρεάν Audit" CTA) so the
 * behaviour is identical whether the click came from desktop nav or the
 * mobile drawer.
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  // `replaceState` avoids polluting the back-stack with anchor entries.
  window.history.replaceState(null, "", `#${id}`);
}
