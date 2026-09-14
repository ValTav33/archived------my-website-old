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

  /**
   * Sitemap weighting. Added in S2.11, the slice that reads it — a `priority`
   * invented earlier for a file written later is a guess wearing the costume
   * of a decision.
   *
   * These are relative hints within one site and nothing more. Google has
   * said for years that it largely ignores them; they are here so the
   * ordering is at least deliberate rather than accidental.
   */
  priority: number;
  changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
};

export const ROUTES = [
  {
    path: "/",
    label: "Αρχική",
    title:
      "Web Development & AI Automations Θεσσαλονίκη | Custom Web Apps & Workflows",
    description:
      "Κατασκευή ιστοσελίδων και web εφαρμογών, και αυτοματισμοί που αναλαμβάνουν τη δουλειά ρουτίνας. Για επιχειρήσεις στη Θεσσαλονίκη και σε όλη την Ελλάδα.",
    absoluteTitle: true,
    priority: 1,
    changeFrequency: "monthly",
  },
  {
    path: "/websites",
    label: "Websites",
    /* The §2.3 keyword, verbatim, and it has to read as a sentence in the
       title, the h1, the description and the opening paragraph rather than
       as four insertions of the same phrase. */
    title: "Κατασκευή ιστοσελίδων Θεσσαλονίκη",
    description:
      "Κατασκευή ιστοσελίδων και web εφαρμογών από τη Θεσσαλονίκη: γρήγορες, προσβάσιμες, και φτιαγμένες γύρω από αυτό που κάνει η επιχείρησή σας.",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/automations",
    label: "Automations",
    title: "Αυτοματισμοί AI επιχειρήσεων",
    description:
      "Αυτοματισμοί AI για επιχειρήσεις: παραλαβή αιτημάτων, follow-up, εμπλουτισμός στοιχείων και αναφορές — δουλειά ρουτίνας που σταματά να γίνεται με το χέρι.",
    priority: 0.9,
    changeFrequency: "monthly",
  },
  {
    path: "/faq",
    label: "Ερωτήσεις",
    title: "Συχνές ερωτήσεις",
    description:
      "Τι γίνεται αν μας χάσετε, τι ακριβώς φτιάχνουμε, πόσο κοστίζει, πόσο θα πάρει, και τι παίρνετε από το δωρεάν audit.",
    priority: 0.7,
    changeFrequency: "monthly",
  },
  {
    path: "/about",
    label: "Ποιοι είμαστε",
    title: "Ποιοι είμαστε",
    description:
      "Πίσω από το Tavlikos Systems υπάρχει ένα πρόσωπο, στη Θεσσαλονίκη. Πώς επικοινωνούμε, πότε απαντάμε, και ποια δουλειά δεν αναλαμβάνουμε.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/process",
    label: "Διαδικασία",
    title: "Η διαδικασία",
    description:
      "Πώς τρέχει μια συνεργασία: δωρεάν audit, συμφωνημένο εύρος και κατασκευή σε στάδια, και ξεκάθαρη παράδοση. Τι χρειάζεται από εσάς σε κάθε βήμα.",
    priority: 0.7,
    changeFrequency: "yearly",
  },
  {
    path: "/work",
    label: "Έργα",
    title: "Έργα",
    /* No count in here. "Δύο έργα" would be true today, wrong the day a
       third lands, and nobody re-reads a meta description. */
    description:
      "Ονομαστικά έργα που έχουν παραδοθεί: ένα αυτοματοποιημένο pipeline εμπλουτισμού και επικοινωνίας, και ένας ζωντανός ιστότοπος πελάτη.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/pricing",
    label: "Τιμολόγηση",
    title: "Πόσο κοστίζει",
    /* No figures in the description either. A meta description promising a
       price and a page that does not carry one is the worst version of this
       page — the click happens and the disappointment happens on our side of
       it. */
    description:
      "Πώς τιμολογούμε: σταθερή αμοιβή για την κατασκευή, συμφωνημένη πριν ξεκινήσουμε, και προαιρετική μηνιαία υποστήριξη. Τι μετακινεί το κόστος και τι χρειάζεται για να σας δώσουμε νούμερο.",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/privacy",
    label: "Πολιτική Απορρήτου",
    title: "Πολιτική Απορρήτου",
    description:
      "Τι στοιχεία συλλέγει η φόρμα, τι γίνεται με αυτά, τι καταγράφεται και τι όχι. Χωρίς cookies, χωρίς analytics, χωρίς trackers.",
    priority: 0.3,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    label: "Όροι Χρήσης",
    title: "Όροι Χρήσης",
    description:
      "Τι είναι αυτός ο ιστότοπος, τι δεν αποτελεί δεσμευτική προσφορά, τι ισχύει για την ιδιοκτησία και την παράδοση κάθε έργου, και ποιο δίκαιο εφαρμόζεται.",
    priority: 0.3,
    changeFrequency: "yearly",
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
    priority: 0.8,
    changeFrequency: "yearly",
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
