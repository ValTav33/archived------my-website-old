import { getProof } from "@/lib/site";

/**
 * The indicative architectures, in one place.
 *
 * They lived inside `ShowcaseGrid` until S4.1, which was fine while the
 * homepage was the only thing that rendered them. It stopped being fine when
 * the homepage kept a one-line summary and the service pages took the full
 * body: two renderings of the same system from two copies of the text is how
 * a site ends up promising a voice agent in one place and a chat widget in
 * another.
 *
 * **«Ενδεικτικές» is load-bearing and is not a hedge.** Content truth policy
 * §8.2: these describe systems we build, not projects delivered and nameable.
 * `lead-engine` is the one exception and carries `caseStudy` because the BTL
 * system actually runs and BTL is cleared for naming.
 */
export type ShowcaseCase = {
  id: string;
  category: string;
  title: string;
  /**
   * The homepage line — one sentence, the outcome, in the owner's words.
   *
   * Deliberately NOT a truncation of `problem`. §11.4 puts the outcome before
   * the mechanism, and a landing page has one sentence to earn the click
   * through to the page that explains how.
   */
  oneLiner: string;
  /** Which service page carries the full version. */
  pillar: "websites" | "automations";
  problem: string;
  solution: string;
  metrics: readonly string[];
  /* Ordered hops of the system's data flow, rendered as a terminal trace. */
  architecture: readonly string[];
  /** Set only when this architecture describes a system that actually runs. */
  caseStudy?: string;
};

export const SHOWCASE: readonly ShowcaseCase[] = [
  {
    id: "ai-concierge",
    category: "Αυτοματισμοί AI • Φιλοξενία & Ιατρεία",
    title: "Αυτόνομο portal εξυπηρέτησης με AI, 24/7",
    oneLiner:
      "Απαντά στις ερωτήσεις των πελατών σας όλο το εικοσιτετράωρο, χωρίς να σηκώσετε τηλέφωνο.",
    pillar: "automations",
    problem:
      "Χιλιάδες επαναλαμβανόμενες ερωτήσεις επισκεπτών (κρατήσεις, οδηγίες, check-in) δεσμεύουν ώρες καθημερινής ανθρώπινης επικοινωνίας και προκαλούν καθυστερήσεις.",
    solution:
      "Ανάπτυξη custom web portal με ενσωματωμένο πολύγλωσσο AI agent, φωνητικό και γραπτό, συνδεδεμένο σε πραγματικό χρόνο με τη βάση γνώσεων και το σύστημα κρατήσεων της επιχείρησης.",
    metrics: [
      "Άμεση απόκριση, χωρίς αναμονή",
      "Αυτόνομη λειτουργία 24/7",
      "Check-in χωρίς ανθρώπινη παρέμβαση",
    ],
    architecture: [
      "Φωνή ή κείμενο πελάτη",
      "Κατανόηση αιτήματος",
      "Έλεγχος στα δεδομένα σας",
      "Καταγραφή",
      "Άμεση απάντηση",
    ],
  },
  {
    id: "client-portal",
    category: "Κατασκευή web εφαρμογών • Ιατρικά & Συμβουλευτική",
    title: "Web εφαρμογή και ενιαίο portal πελατών",
    oneLiner:
      "Τα αρχεία και τα στοιχεία των πελατών σας σε ένα σημείο, αντί για emails και WhatsApp.",
    pillar: "websites",
    problem:
      "Κατακερματισμένα δεδομένα σε emails και WhatsApp. Χάσιμο χρόνου σε χειροκίνητη αποστολή φορμών, ερασιτεχνική εικόνα προς τους πελάτες και έλλειψη κεντρικού ελέγχου.",
    solution:
      "Κατασκευή custom web εφαρμογής με ασφαλές dashboard διαχείρισης, ρόλους χρηστών, αυτόματο onboarding και κεντρική αποθήκευση εγγράφων.",
    metrics: [
      "Όλα τα δεδομένα σε ένα σημείο",
      "Τα αρχεία βρίσκονται χωρίς αναζήτηση",
      "Επαγγελματικό περιβάλλον χρήσης",
    ],
    architecture: [
      "Ασφαλής σύνδεση",
      "Έλεγχος ρόλων χρήστη",
      "Αποθήκευση αρχείων",
      "Συγχρονισμός σε πραγματικό χρόνο",
    ],
  },
  {
    id: "lead-engine",
    category: "Υποδομή δεδομένων • B2B agencies",
    title: "Αυτοματοποιημένη συλλογή και εμπλουτισμός leads",
    oneLiner:
      "Βρίσκει και ελέγχει νέους υποψήφιους πελάτες, χωρίς χειροκίνητη καταχώριση.",
    pillar: "automations",
    problem:
      "Χειροκίνητη αντιγραφή από υπολογιστικά φύλλα, ανεπιβεβαίωτα emails που καταλήγουν στα spam και αργή δρομολόγηση νέων ευκαιριών.",
    solution:
      "Πλήρως αυτοματοποιημένη ροή που αναζητά, επαληθεύει κλιμακωτά, αξιολογεί με AI και τροφοδοτεί άμεσα τα κατάλληλα leads στο CRM.",
    metrics: [
      "Χωρίς χειροκίνητη καταχώριση δεδομένων",
      "Αυτόματη αξιολόγηση και καθαρισμός leads",
      "Άμεση κλιμάκωση του όγκου επικοινωνίας",
    ],
    architecture: [
      "Είσοδος από λίστα ή φόρμα",
      "Κλιμακωτή επαλήθευση",
      "Φίλτρο καταλληλότητας AI",
      "CRM ή καμπάνια email",
    ],
    caseStudy: `/work/${getProof("btl").slug}`,
  },
] as const;

/** The cases whose full body belongs on a given service page. */
export const showcaseFor = (pillar: ShowcaseCase["pillar"]) =>
  SHOWCASE.filter((c) => c.pillar === pillar);
