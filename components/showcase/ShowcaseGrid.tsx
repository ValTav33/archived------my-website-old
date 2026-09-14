import ShowcaseCard, {
  type ShowcaseCase,
} from "@/components/showcase/ShowcaseCard";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import ScrollLink from "@/components/ui/ScrollLink";
import SectionHeader from "@/components/ui/SectionHeader";
import { getProof } from "@/lib/site";

/* ------------------------------------------------------------------ */
/*  Case data                                                          */
/* ------------------------------------------------------------------ */

const CASES: readonly ShowcaseCase[] = [
  {
    id: "ai-concierge",
    category: "Αυτοματισμοί AI • Φιλοξενία & Ιατρεία",
    title: "Αυτόνομο portal εξυπηρέτησης με AI, 24/7",
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

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ShowcaseGrid() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* ---------------------------- Header --------------------------- */}
        {/* Emerald is reserved for live status dots — playbook §2.4. Both
            section eyebrows use the neutral label token.

            Named "ενδεικτικές" on purpose. These describe systems we build,
            not projects we have shipped and can name — content truth policy
            §8.2. The heading has to say so before the cards do. */}
        <SectionHeader
          id="solutions-heading"
          eyebrow="[ 01 // ΕΝΔΕΙΚΤΙΚΕΣ ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ ]"
          title="Ενδεικτικές Αρχιτεκτονικές."
          lede="Οι αρχιτεκτονικές που ακολουθούν περιγράφουν συστήματα που κατασκευάζουμε — όχι δημοσιευμένα έργα πελατών. Τα ονομαστικά έργα που έχουν παραδοθεί είναι στα Έργα."
        />

        {/* D2's exit. The framing above stays exactly as Phase 0 wrote it —
            §8.2 requires it — but a visitor who wants delivered work now has
            somewhere to go. Before `/work` existed there was nowhere, which
            is why the lede promised case studies "σύντομα"; that sentence
            became false the moment this link had a destination. */}
        <ArrowLink href="/work" className="mt-6">
          Δείτε τα ονομαστικά έργα
        </ArrowLink>

        {/* ----------------------------- Grid ---------------------------- */}
        {/* Cards stretch to a common row height, so every "View Architecture"
            button pins to the same baseline (that is what `justify-between`
            on the card is for). Expanding one panel grows the row, which is
            the expected behaviour for an accordion inside a grid. */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>

        {/* --------------------- Transition banner ----------------------- */}
        <Card
          tone="glass"
          className="mt-14 flex flex-col items-start justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-zinc-400 sm:text-base">
            Χρειάζεστε ένα custom σύστημα προσαρμοσμένο στις δικές σας
            λειτουργίες;
          </p>

          <ScrollLink
            to="audit"
            className="btn-primary min-h-tap shrink-0 px-5 py-3 text-xs"
          >
            Σχεδιάστε τη λύση σας — Κλείστε ένα 15-λεπτο Audit
          </ScrollLink>
        </Card>
      </div>
    </section>
  );
}
