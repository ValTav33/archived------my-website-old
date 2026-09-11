import ShowcaseCard, {
  type ShowcaseCase,
} from "@/components/showcase/ShowcaseCard";
import Card from "@/components/ui/Card";
import ScrollLink from "@/components/ui/ScrollLink";
import SectionHeader from "@/components/ui/SectionHeader";

/* ------------------------------------------------------------------ */
/*  Case data                                                          */
/* ------------------------------------------------------------------ */

const CASES: readonly ShowcaseCase[] = [
  {
    id: "ai-concierge",
    category: "Αυτοματισμοί AI • Φιλοξενία & Ιατρεία",
    title: "Αυτόνομο AI Concierge Portal & 24/7 Εξυπηρέτηση",
    problem:
      "Χιλιάδες επαναλαμβανόμενες ερωτήσεις επισκεπτών (κρατήσεις, οδηγίες, check-in) δεσμεύουν ώρες καθημερινής ανθρώπινης επικοινωνίας και προκαλούν καθυστερήσεις.",
    solution:
      "Ανάπτυξη custom web portal με ενσωματωμένο πολύγλωσσο Voice & Text AI agent, συνδεδεμένο σε πραγματικό χρόνο με τη βάση γνώσεων και το σύστημα κρατήσεων της επιχείρησης.",
    stack: ["Next.js", "Voice AI / Vapi", "n8n", "Supabase"],
    metrics: [
      "Άμεση απόκριση, χωρίς αναμονή",
      "Αυτόνομη λειτουργία 24/7",
      "Check-in χωρίς ανθρώπινη παρέμβαση",
    ],
    architecture: [
      "Client Audio/Text",
      "Vapi LLM",
      "n8n Webhook",
      "Supabase DB",
      "Instant Dynamic Response",
    ],
  },
  {
    id: "client-portal",
    category: "Κατασκευή web εφαρμογών • Ιατρικά & Συμβουλευτική",
    title: "Custom Web Application & Ενοποιημένο Client Portal",
    problem:
      "Κατακερματισμένα δεδομένα σε emails και WhatsApp. Χάσιμο χρόνου σε χειροκίνητη αποστολή φορμών, ερασιτεχνική εικόνα προς τους πελάτες και έλλειψη κεντρικού ελέγχου.",
    solution:
      "Κατασκευή bespoke web εφαρμογής με ασφαλές περιβάλλον διαχείρισης (Admin Dashboard), ρόλους χρηστών, αυτόματο onboarding και κεντρική αποθήκευση εγγράφων.",
    stack: ["Next.js", "Tailwind CSS", "Secure Auth", "PostgreSQL"],
    metrics: [
      "Όλα τα δεδομένα σε ένα σημείο",
      "Τα αρχεία βρίσκονται χωρίς αναζήτηση",
      "Επαγγελματικό περιβάλλον χρήσης",
    ],
    architecture: [
      "Secure Auth",
      "Role Gate (Admin/Client)",
      "S3/Cloud Storage",
      "Real-time Status Sync",
    ],
  },
  {
    id: "lead-engine",
    category: "Υποδομή δεδομένων • B2B agencies",
    title: "Αυτοματοποιημένο Pipeline Συλλογής & Εμπλουτισμού Leads",
    problem:
      "Χειροκίνητο copy-paste από spreadsheets, ανεπιβεβαίωτα emails που καταλήγουν στα spam και αργή δρομολόγηση νέων ευκαιριών.",
    solution:
      "End-to-end αυτοματοποιημένο pipeline που αναζητά, επικυρώνει (waterfall verification), βαθμολογεί με AI και τροφοδοτεί άμεσα τα κατάλληλα leads στο CRM.",
    stack: ["n8n / Make", "Enrichment APIs", "AI Scoring", "CRM Sync"],
    metrics: [
      "Χωρίς χειροκίνητη καταχώριση δεδομένων",
      "Αυτόματη αξιολόγηση και καθαρισμός leads",
      "Άμεση κλιμάκωση του όγκου επικοινωνίας",
    ],
    architecture: [
      "Inbound/List Trigger",
      "Waterfall Verification",
      "AI Relevancy Filter",
      "CRM / Outreach Tool",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ShowcaseGrid() {
  return (
    <section
      id="solutions"
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
          eyebrow="[ 01 // ΕΝΔΕΙΚΤΙΚΕΣ ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ ]"
          title="Ενδεικτικές Αρχιτεκτονικές."
          lede="Οι αρχιτεκτονικές που ακολουθούν περιγράφουν συστήματα που κατασκευάζουμε — όχι δημοσιευμένα έργα πελατών. Τα πρώτα ονομαστικά case studies προστίθενται σύντομα."
        />

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
