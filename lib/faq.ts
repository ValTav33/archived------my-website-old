import { AUDIT_DELIVERABLE, SITE, TIMELINE_RANGE } from "@/lib/site";

/**
 * The six objections, answered on the page rather than deflected (§11.6).
 *
 * **Data, not markup.** Phase 2 builds a `/faq` route and the `FAQPage`
 * structured data that belongs with it; both read this array. A schema whose
 * text has drifted from the visible answer is a markup problem that search
 * engines notice and visitors do not, which is the worst combination.
 *
 * Three answers interpolate shared constants rather than restating them —
 * the audit deliverable, the timeline range and the trading hours. Those are
 * the site's only concrete promises and they exist once each.
 *
 * §2.2 governs the money answer: the **model**, never a figure. A price on
 * the page is a number that has to survive a sales call, and there is no
 * price that survives every scope.
 */
export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export const FAQ: readonly FaqEntry[] = [
  {
    id: "continuity",
    /* The one the §12 risk register names as the deal-killer. Answered first
       and answered flat: a hedge here reads as a confession. */
    question: "Τι γίνεται αν σας χάσω;",
    answer:
      "Ό,τι αφορά την παράδοση συμφωνείται γραπτά πριν ξεκινήσουμε: τι παίρνετε στο τέλος, πού ζει το έργο, ποιος κρατά τους λογαριασμούς. Δεν είναι κάτι που το ανακαλύπτετε στο τέλος, και το βλέπετε πριν συμφωνήσετε.",
  },
  {
    id: "pricing",
    question: "Πόσο κοστίζει;",
    answer:
      "Το μοντέλο είναι σταθερή αμοιβή για την κατασκευή, συμφωνημένη πριν ξεκινήσουμε, και προαιρετική μηνιαία υποστήριξη μετά την παράδοση. Δεν δίνουμε τιμή πριν δούμε το εύρος — μια τιμή χωρίς εύρος είναι μάντεμα, και το πληρώνει πάντα ο πελάτης.",
  },
  {
    id: "timeline",
    question: "Πόσο θα πάρει;",
    answer: `${TIMELINE_RANGE.charAt(0).toUpperCase()}${TIMELINE_RANGE.slice(1)}. Μια σελίδα παρουσίασης είναι ημέρες· μια εφαρμογή με ρόλους χρηστών και πληρωμές είναι εβδομάδες. Το εύρος συμφωνείται πριν ξεκινήσει η κατασκευή, οπότε ξέρετε τι περιμένετε.`,
  },
  {
    id: "wordpress",
    question: "Γιατί όχι WordPress;",
    answer:
      "Γιατί το site φορτώνει πιο γρήγορα, δεν σπάει επειδή ενημερώθηκε κάποιο plugin, και δεν χρειάζεται μηνιαία συντήρηση για να παραμείνει ασφαλές. Αν το WordPress είναι το σωστό εργαλείο για αυτό που θέλετε, θα σας το πούμε.",
  },
  {
    id: "remote",
    question: "Δουλεύετε εκτός Θεσσαλονίκης;",
    answer: `Ναι. Εξυπηρετούμε όλη την Ελλάδα remote — κλήσεις, preview URL σε κάθε στάδιο και παράδοση εξ αποστάσεως. Οι ώρες είναι ${SITE.hoursLong}, και μέσα σε αυτές απαντάμε.`,
  },
  {
    id: "audit",
    question: "Τι ακριβώς παίρνω από το δωρεάν audit;",
    /* Word for word with the form and with process step 01, because all
       three interpolate the same constant. */
    answer: `${AUDIT_DELIVERABLE.charAt(0).toUpperCase()}${AUDIT_DELIVERABLE.slice(1)}. Χωρίς κόστος και χωρίς δέσμευση να συνεχίσετε. Αν δεν έχουμε κάτι χρήσιμο να προτείνουμε, θα σας το πούμε και αυτό.`,
  },
] as const;

/**
 * The subset the homepage shows.
 *
 * Four of six, and **order is the selection**: `FAQ` is already written
 * worst-objection-first — continuity leads because §12's risk register names
 * it the one that kills deals silently — so the highlight is the first four
 * rather than a second hand-picked list that can drift out of agreement with
 * the ordering above.
 *
 * The two that move to `/faq` only are the ones a visitor seeks out rather
 * than stumbles over: whether we work outside Thessaloniki, and what exactly
 * the free audit contains. The second is also stated in full by the form and
 * by process step 01, so the homepage is not hiding it.
 */
const HOMEPAGE_FAQ_COUNT = 4;

export const HOMEPAGE_FAQ = FAQ.slice(0, HOMEPAGE_FAQ_COUNT);
