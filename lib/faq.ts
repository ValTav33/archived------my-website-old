import type { RoutePath } from "@/lib/routes";
import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

/**
 * The five objections, answered on the page rather than deflected (§11.6).
 *
 * **Data, not markup.** The `/faq` route and the `FAQPage` structured data
 * both read this array. A schema whose text has drifted from the visible
 * answer is a markup problem that search engines notice and visitors do not,
 * which is the worst combination.
 *
 * Answers interpolate shared constants rather than restating them — the audit
 * deliverable and the timeline range. Those are the site's only concrete
 * promises and they exist once each. `SITE` dropped out of the imports with
 * the Thessaloniki question, which was the only answer quoting the hours.
 *
 * §2.2 governs the money answer: the **model**, never a figure. A price on
 * the page is a number that has to survive a sales call, and there is no
 * price that survives every scope. `/pricing` carries the model at length and
 * is linked from that answer.
 *
 * **S3.5 S4 replaced the set on Val's instruction** — *«τα faqs
 * απαράδεκτα»*. Two came out: «Δουλεύετε εκτός Θεσσαλονίκης;», which he
 * called irrelevant and was, and «Γιατί όχι WordPress;», because naming a
 * competitor platform positions us against a tool rather than for a result
 * (D5). The speed-and-flexibility argument that question carried survives
 * inside the new `scope` answer, where it belongs.
 *
 * The order is a sales order, not an alphabet: what you build, what it costs,
 * how long, what happens if I lose you, what the free thing actually is. The
 * homepage shows the first three.
 */
export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  /**
   * An optional route the answer points at.
   *
   * Deliberately typed as `RoutePath` rather than `string`: an answer cannot
   * link to a page nobody registered, it fails to compile instead. That is
   * also why `/pricing` had to be built before this slice rather than after —
   * the type system enforced the order.
   *
   * **Not part of the schema `text`.** `FaqJsonLd` asserts `answer` only, so
   * the label below never becomes a string the structured data claims and the
   * page does not show.
   */
  link?: { href: RoutePath; label: string };
};

export const FAQ: readonly FaqEntry[] = [
  {
    id: "scope",
    /* Val's first topic, and the right opener: a visitor who cannot tell what
       we sell cannot have any of the other four objections yet. */
    question: "Τι ακριβώς φτιάχνετε;",
    answer:
      "Δύο πράγματα. Ιστοσελίδες και web εφαρμογές φτιαγμένες από την αρχή για τη δική σας δουλειά — και έτσι φορτώνουν γρήγορα και αλλάζουν εύκολα, αντί να παλεύετε με ό,τι έχει προβλέψει μια έτοιμη πλατφόρμα για όλους. Και αυτοματισμούς: δουλειά ρουτίνας που σήμερα γίνεται με το χέρι — καταχωρήσεις, follow-up, αναφορές — που αρχίζει να γίνεται μόνη της.",
  },
  {
    id: "pricing",
    question: "Πόσο κοστίζει;",
    answer:
      "Σταθερή αμοιβή για την κατασκευή, συμφωνημένη πριν ξεκινήσουμε, και προαιρετική μηνιαία υποστήριξη μετά την παράδοση. Το ακριβές νούμερο εξαρτάται από το εύρος και δεν το δίνουμε πριν το δούμε — μια τιμή χωρίς εύρος είναι μάντεμα, και το πληρώνει πάντα ο πελάτης.",
    link: { href: "/pricing", label: "Πώς τιμολογούμε" },
  },
  {
    id: "timeline",
    /* Unchanged. Val read it and said «σωστά». */
    question: "Πόσο θα πάρει;",
    answer: `${TIMELINE_RANGE.charAt(0).toUpperCase()}${TIMELINE_RANGE.slice(1)}. Μια σελίδα παρουσίασης είναι ημέρες· μια εφαρμογή με ρόλους χρηστών και πληρωμές είναι εβδομάδες. Το εύρος συμφωνείται πριν ξεκινήσει η κατασκευή, οπότε ξέρετε τι περιμένετε.`,
  },
  {
    id: "continuity",
    /* The one §12 names as the deal-killer, and the one D2 gutted: it used to
       rest entirely on «ο κώδικας και το repository είναι δικά σας από την
       πρώτη μέρα», which is not true of every package. Answered now from what
       holds in all of them — and answered flat, because a hedge here reads as
       a confession. */
    question: "Τι γίνεται αν σας χάσω;",
    answer:
      "Ό,τι αφορά την παράδοση συμφωνείται γραπτά πριν ξεκινήσουμε: τι παίρνετε στο τέλος, πού ζει το έργο, ποιος κρατά τους λογαριασμούς. Δεν είναι κάτι που το ανακαλύπτετε στο τέλος, και το βλέπετε πριν συμφωνήσετε.",
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
 * **Three of five, and order is the selection.** `FAQ` is written in the
 * order a prospect thinks — what do you build, what does it cost, how long —
 * so the highlight is a prefix rather than a second hand-picked list that can
 * drift out of agreement with the ordering above.
 *
 * S4 moved this from four of six to three of five. Four of five would have
 * made `/faq` almost pointless, which is the failure mode D1 exists to
 * prevent: a deeper page has to be worth opening.
 *
 * The two kept for `/faq` only are the ones a visitor seeks out rather than
 * stumbles over. That includes «Τι γίνεται αν σας χάσω;», which §11.6
 * requires be answered explicitly *in the FAQ* — and `/faq` is the FAQ. It is
 * also answered structurally in process step 03 and on `/about`, so nothing
 * is being hidden by keeping it off the homepage.
 */
const HOMEPAGE_FAQ_COUNT = 3;

export const HOMEPAGE_FAQ = FAQ.slice(0, HOMEPAGE_FAQ_COUNT);
