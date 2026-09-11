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
 * Primary navigation — header and footer. Playbook §2.3 caps this at five
 * items **including the CTA**, so three text links plus `CTA_LINK` is four.
 *
 * "Επικοινωνία" is gone. It pointed at `#audit`, the same destination as the
 * Δωρεάν Audit button sitting beside it — two controls, one place, and the
 * visitor has to guess whether they differ.
 *
 * Every id here resolves to a section that exists on the page. Phase 2 turns
 * these into routes by filling in `href`; nothing else has to change.
 */
export const NAV_LINKS: readonly NavLink[] = [
  { id: "solutions", label: "Λύσεις" },
  { id: "process", label: "Διαδικασία" },
  { id: "faq", label: "Ερωτήσεις" },
] as const;

/**
 * The call to action, kept separate because it is styled as a button and
 * appears in three places — the header, the mobile drawer and the footer's
 * navigation column. One definition, so the label and the destination cannot
 * drift apart across them.
 */
export const CTA_LINK: NavLink = { id: "audit", label: "Δωρεάν Audit" };

/**
 * Footer-only links, rendered after the primary nav. §2.3 puts About, FAQ,
 * Privacy and Terms in the footer; About joins here now that the section
 * exists, and `/privacy` and `/terms` join in Phase 2.
 */
export const FOOTER_LINKS: readonly NavLink[] = [
  { id: "hero", label: "Αρχική" },
  { id: "about", label: "Ποιοι είμαστε" },
  { id: "phone", label: SITE.phoneDisplay, href: `tel:${SITE.phoneTel}` },
] as const;

/** Resolves a link to an `href` a plain anchor can use. */
export function navHref(link: NavLink): string {
  return link.href ?? `#${link.id}`;
}
