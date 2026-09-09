import { SITE } from "@/lib/site";

/**
 * Single source of truth for site navigation.
 *
 * `Navbar` and `Footer` both read from here. They used to declare their own
 * link arrays, with different shapes and different link sets, which is a
 * guaranteed drift.
 */
export type NavLink = {
  /** In-page anchor target. Rendered as `#{id}` unless `href` overrides it. */
  id: string;
  label: string;
  /** Absolute or external destination. Set once routes exist in Phase 2. */
  href?: string;
};

/**
 * Primary navigation — header and footer. Max 5 items, see playbook §2.3.
 *
 * Phase 0 lists only the sections that actually exist on the page. The
 * `#services`, `#work` and `#process` anchors are deleted in S0.4 and return
 * as real routes in Phase 2; a two-item nav that works beats a four-item nav
 * where three lead nowhere.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { id: "solutions", label: "Λύσεις" },
  { id: "audit", label: "Επικοινωνία" },
] as const;

/**
 * Footer-only links, rendered after the primary nav. `/privacy` and `/terms`
 * join this list in Phase 2.
 */
export const FOOTER_LINKS: readonly NavLink[] = [
  { id: "hero", label: "Αρχική" },
  { id: "phone", label: SITE.phoneDisplay, href: `tel:${SITE.phoneTel}` },
] as const;

/** Resolves a link to an `href` a plain anchor can use. */
export function navHref(link: NavLink): string {
  return link.href ?? `#${link.id}`;
}
