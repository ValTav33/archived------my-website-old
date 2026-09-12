import { AUDIT_DELIVERABLE } from "@/lib/site";

/**
 * The route manifest — one list of every page the site serves.
 *
 * Before this file, navigation was the only place a route was written down,
 * and it only knew about in-page anchors. Phase 2 adds ten routes and four
 * surfaces that each need to know the full set: the header, the footer, the
 * sitemap and the breadcrumbs. Four hand-maintained lists of the same eleven
 * paths is four opportunities to forget one, and the one you forget is the one
 * that never gets crawled.
 *
 * **Every entry here corresponds to a page that exists.** A route is added in
 * the same slice that adds its `page.tsx`, never before. That is §8.5 applied
 * to configuration: `app/sitemap.ts` reads this file in S2.11, so an entry
 * added ahead of its page would put a 404 in the sitemap and spend crawl
 * budget on nothing.
 *
 * Fields are added when a slice actually consumes them, for the same reason —
 * a `priority` invented in S2.1 for a sitemap written in S2.11 is a guess
 * wearing the costume of a decision.
 */
export type Route = {
  /**
   * Path from the origin, with a leading slash and **no** trailing slash —
   * `next.config.ts` leaves `trailingSlash` at its default of `false`, so
   * this is the form that actually resolves, and the form the canonical must
   * use.
   */
  path: string;

  /** Greek label, for the navigation surfaces that render this route. */
  label: string;

  /** The `<title>`, before the root layout's template is applied to it. */
  title: string;

  /** The meta description. Written per route; never inherited (see `lib/seo.ts`). */
  description: string;

  /**
   * Render `title` verbatim instead of appending the layout's
   * `"%s | Web Development & AI Automations"` template.
   *
   * Set on the homepage only. Its title already ends in a second clause
   * ("… | Custom Web Apps & Workflows") and is the one title on the site with
   * live search history behind it, so it ships byte-identical to what Phase 0
   * shipped. Every other route takes the template.
   */
  absoluteTitle?: boolean;
};

export const ROUTES = [
  {
    path: "/",
    label: "Αρχική",
    title:
      "Web Development & AI Automations Θεσσαλονίκη | Custom Web Apps & Workflows",
    description:
      "Σχεδιασμός high-performance web εφαρμογών (Next.js) και αυτόνομα AI pipelines για επιχειρήσεις. Μειώστε τα χειροκίνητα tasks και αυτοματοποιήστε τις λειτουργίες σας.",
    absoluteTitle: true,
  },
  {
    path: "/contact",
    label: "Επικοινωνία",
    title: "Επικοινωνία & δωρεάν audit",
    /* Interpolated rather than retyped. The deliverable is the site's only
       concrete promise and it exists once, in `lib/site.ts`; a meta
       description is exactly the kind of surface where a hand-written second
       copy goes unnoticed for months. */
    description: `Ζητήστε δωρεάν audit — παίρνετε ${AUDIT_DELIVERABLE}. Τηλέφωνο, email, WhatsApp ή Telegram, Θεσσαλονίκη και remote.`,
  },
] as const satisfies readonly Route[];

/**
 * Every path in the manifest, as a union.
 *
 * This is the type `routeMetadata` accepts, which means a page cannot ask for
 * metadata for a route that is not declared here — it fails to compile rather
 * than shipping a canonical pointing at a path nobody registered. The union
 * widens on its own as slices append entries.
 */
export type RoutePath = (typeof ROUTES)[number]["path"];

/** Looks up a declared route. Throws rather than returning `undefined`. */
export function getRoute(path: RoutePath): Route {
  const route = ROUTES.find((candidate) => candidate.path === path);

  /* Unreachable through `RoutePath`, and kept anyway: the day someone widens
     the parameter to `string` for a dynamic route, this is the difference
     between a build that stops and a page that silently ships without a
     title. */
  if (!route) {
    throw new Error(`Route ${JSON.stringify(path)} is not in the manifest.`);
  }

  return route;
}
