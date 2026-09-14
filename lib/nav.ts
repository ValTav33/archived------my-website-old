import { getRoute, type RoutePath } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Single source of truth for site navigation.
 *
 * `Navbar` and `Footer` both read from here. They used to declare their own
 * link arrays, with different shapes and different link sets, which is a
 * guaranteed drift.
 *
 * **S2.12 turned these from in-page anchors into routes.** Through Phase 1
 * every entry was a section id on a single page; `href` was an escape hatch
 * marked "set once routes exist in Phase 2". The routes exist, so the escape
 * hatch is now the only shape — a nav entry is a path, full stop. Labels come
 * from the route manifest rather than being retyped, so the header and the
 * page cannot disagree about what a page is called.
 */
export type NavLink = {
  /** A route path, or an external/`tel:` URL. */
  href: string;
  label: string;
};

/** A nav entry for a manifest route, label included. */
function link(path: RoutePath): NavLink {
  return { href: path, label: getRoute(path).label };
}

/**
 * Primary navigation — header and footer. Playbook §2.3 caps this at five
 * items **including the CTA**, and names them:
 * Websites · Automations · Έργα · Διαδικασία · [Δωρεάν Audit].
 *
 * That is exactly four here plus `CTA_LINK`. The single «Λύσεις» anchor split
 * into the two service pillars, and «Ερωτήσεις» moved to the footer, which is
 * where §2.3 puts FAQ.
 */
export const NAV_LINKS: readonly NavLink[] = [
  link("/websites"),
  link("/automations"),
  link("/work"),
  link("/process"),
] as const;

/**
 * The call to action, kept separate because it is styled as a button and
 * appears in three places — the header, the mobile drawer and the footer's
 * navigation column. One definition, so the label and the destination cannot
 * drift apart across them.
 *
 * Its label is **not** the route's manifest label. `/contact` is titled
 * «Επικοινωνία» as a page; as a button it is the offer, and the offer is what
 * makes someone press it.
 */
export const CTA_LINK: NavLink = { href: "/contact", label: "Δωρεάν Audit" };

/**
 * Footer-only links. §2.3 puts About, FAQ, Privacy and Terms in the footer,
 * which is the one surface allowed to exceed five — it is the site's index,
 * and a footer that cannot reach the legal pages is a footer that fails the
 * only job it has beyond navigation.
 */
export const FOOTER_LINKS: readonly NavLink[] = [
  link("/about"),
  link("/faq"),
  link("/privacy"),
  link("/terms"),
  { href: `tel:${SITE.phoneTel}`, label: SITE.phoneDisplay },
] as const;

/** True for links that leave the site or open an app rather than navigating. */
export function isExternal(href: string): boolean {
  return /^(https?:|tel:|mailto:)/.test(href);
}
