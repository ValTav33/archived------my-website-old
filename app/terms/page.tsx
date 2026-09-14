import LegalDocument, {
  type LegalSection,
} from "@/components/legal/LegalDocument";
import { routeMetadata } from "@/lib/seo";
import { SITE, TIMELINE_RANGE } from "@/lib/site";

export const metadata = routeMetadata("/terms");

/**
 * `/terms` — what this site is, and what it is not.
 *
 * **§8.6 is absolute.** No ΑΦΜ, no myDATA, no τιμολόγιο, no
 * registered-entity language, no «εταιρεία» — registration is not planned
 * (playbook §2.2 and the §14 decision log) and a legal claim without the
 * legal fact behind it is the one §8 violation with consequences off the
 * website.
 *
 * Every clause restates a promise the site already makes elsewhere rather
 * than inventing a new one: code ownership is the FAQ's continuity answer and
 * both pillar pages' closing section; "no ranking guarantees" is `/about`'s
 * third refusal; the timeline is the §2.2 range. Terms that contradict the
 * marketing copy are worse than no terms.
 *
 * Deliberately **not** here: a forum-selection clause naming specific courts,
 * a cancellation or refund schedule, and any limitation-of-liability
 * boilerplate broad enough to be unenforceable. None of those are written
 * down anywhere in this repo, and inventing commercial terms on a business's
 * behalf is not a drafting decision a page can make for it. Val reads this
 * before the phase PR merges.
 */
const UPDATED = "13 Σεπτεμβρίου 2026";

const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Τι είναι αυτός ο ιστότοπος",
    body: [
      `Ο ${SITE.url.replace(/^https?:\/\//, "")} παρουσιάζει τις υπηρεσίες του ${SITE.brand} και δίνει έναν τρόπο να επικοινωνήσετε. Δεν είναι κατάστημα: δεν γίνονται αγορές, δεν γίνονται πληρωμές και δεν δημιουργούνται λογαριασμοί χρηστών.`,
    ],
  },
  {
    heading: "Τι δεν αποτελεί δεσμευτική προσφορά",
    body: [
      "Τίποτα σε αυτόν τον ιστότοπο δεν είναι προσφορά ή τιμολόγηση. Το εύρος και η αμοιβή κάθε έργου συμφωνούνται γραπτά πριν ξεκινήσει η κατασκευή, και μόνο αυτή η συμφωνία δεσμεύει.",
      `Ο χρόνος παράδοσης που αναφέρεται στον ιστότοπο — ${TIMELINE_RANGE} — είναι εύρος που περιγράφει το τι έχει συμβεί στην πράξη, όχι υπόσχεση για το δικό σας έργο.`,
      "Οι αρχιτεκτονικές που παρουσιάζονται ως ενδεικτικές περιγράφουν συστήματα που κατασκευάζουμε. Όπου αναφέρεται ονομαστικά πελάτης, υπάρχει η συγκατάθεσή του.",
    ],
  },
  {
    heading: "Σε ποιον ανήκει ο κώδικας",
    body: [
      "Το περιεχόμενο και ο κώδικας αυτού του ιστότοπου ανήκουν σε εμάς.",
      "Ο κώδικας κάθε έργου πελάτη ανήκει στον πελάτη. Το repository είναι στο όνομά σας από την πρώτη μέρα και η εγκατάσταση παραδίδεται τεκμηριωμένη, ώστε το έργο να μπορεί να συνεχιστεί χωρίς εμάς. Δεν κρατάμε τον κώδικα ως μοχλό.",
      "Το περιεχόμενο που μας δίνετε — κείμενα, φωτογραφίες, λογότυπο — παραμένει δικό σας, και μας το εμπιστεύεστε μόνο για να το χρησιμοποιήσουμε στο έργο σας.",
    ],
  },
  {
    heading: "Σύνδεσμοι προς άλλους ιστότοπους",
    body: [
      "Ο ιστότοπος περιέχει συνδέσμους προς ιστοσελίδα πελάτη και προς προφίλ κοινωνικών δικτύων. Το περιεχόμενο και η πολιτική τους δεν είναι στον έλεγχό μας.",
    ],
  },
  {
    heading: "Τι δεν υποσχόμαστε",
    body: [
      "Δεν υποσχόμαστε θέσεις ή κατάταξη σε μηχανές αναζήτησης. Κανείς δεν ελέγχει την κατάταξη· ελέγχουμε την ταχύτητα, τη δομή και το τι μπορεί να διαβάσει ένας crawler.",
      "Δεν εγγυόμαστε ότι αυτός ο ιστότοπος θα είναι διαθέσιμος αδιάλειπτα. Για ό,τι είναι επείγον, το τηλέφωνο και το email στη σελίδα επικοινωνίας δουλεύουν ανεξάρτητα από αυτόν.",
    ],
  },
  {
    heading: "Εφαρμοστέο δίκαιο και επικοινωνία",
    body: [
      "Εφαρμόζεται το ελληνικό δίκαιο.",
      `Για οτιδήποτε σχετικό με αυτούς τους όρους: ${SITE.email}, ή ${SITE.phoneDisplay} τις ώρες ${SITE.hoursShort}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDocument
      title="Όροι Χρήσης"
      lede="Τι είναι αυτός ο ιστότοπος, τι δεσμεύει και τι δεν δεσμεύει, και σε ποιον ανήκει ο κώδικας."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
