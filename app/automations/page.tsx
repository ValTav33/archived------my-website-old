import FeatureGrid, { type Feature } from "@/components/services/FeatureGrid";
import ServiceCta from "@/components/services/ServiceCta";
import ServiceSection from "@/components/services/ServiceSection";
import ShowcaseCard from "@/components/showcase/ShowcaseCard";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import ArrowLink from "@/components/ui/ArrowLink";
import BulletList from "@/components/ui/BulletList";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRoute } from "@/lib/routes";
import { routeMetadata } from "@/lib/seo";
import { showcaseFor } from "@/lib/showcase";
import { AUDIT_DELIVERABLE, TIMELINE_RANGE, getProof } from "@/lib/site";

export const metadata = routeMetadata("/automations");

const ROUTE = getRoute("/automations");
const BTL = getProof("btl");

/**
 * What gets automated. Outcome first, mechanism second (§11.4) — a business
 * owner reading "n8n webhook → Supabase" learns nothing; what stops being
 * their problem is the claim.
 *
 * **Deliberately absent: voice and telephone automation.** `SERVICE_CATALOG`
 * lists "AI Concierge & Voice/Chat Agents" and the homepage showcase carries
 * an AI concierge architecture, but that one is explicitly *indicative* and
 * no voice work has been delivered. §8.5 says a capability that cannot be
 * demonstrated does not go on the page, so the categories below are the ones
 * the BTL pipeline and this site's own build actually cover. The tension in
 * `SERVICE_CATALOG` is logged in the Backlog rather than fixed here.
 */
const CAPABILITIES: readonly Feature[] = [
  {
    title: "Παραλαβή και δρομολόγηση",
    body: "Κάθε αίτημα από φόρμα ή email μπαίνει στη σειρά, χαρακτηρίζεται και καταλήγει στο σωστό σημείο, χωρίς να το προσέξει κάποιος με το χέρι.",
  },
  {
    title: "Follow-up που δεν ξεχνιέται",
    body: "Οι υπενθυμίσεις και τα επόμενα μηνύματα φεύγουν μόνα τους, στον χρόνο που έχετε ορίσει εσείς.",
  },
  {
    title: "Εμπλουτισμός στοιχείων",
    body: "Ένα όνομα ή ένα domain γίνεται πλήρης καρτέλα: στοιχεία επικοινωνίας, επιβεβαίωση ότι ισχύουν, και το υπόβαθρο πριν την πρώτη επαφή.",
  },
  {
    title: "Σύνδεση με τα εργαλεία σας",
    body: "Οι ροές γράφουν και διαβάζουν εκεί που δουλεύετε ήδη — CRM, Google Sheets, email, βάση δεδομένων. Δεν αλλάζετε συνήθειες για να ταιριάξετε σε ένα εργαλείο.",
  },
  {
    title: "Αναφορές χωρίς συλλογή",
    body: "Τα δεδομένα μαζεύονται μόνα τους σε ένα σημείο, ώστε η αναφορά να είναι ανάγνωση και όχι δουλειά μιας ημέρας.",
  },
  {
    title: "Όταν κάτι σπάσει",
    body: "Κάθε ροή έχει καταγραφή και ειδοποίηση αποτυχίας. Μαθαίνετε ότι κάτι δεν πέρασε από εμάς, όχι από τον πελάτη σας.",
  },
];

/** What stops being done by hand. Said as the prospect would describe it. */
const BY_HAND = [
  "Αντιγράφετε στοιχεία από το email στο CRM, και από το CRM σε ένα Excel.",
  "Θυμάστε εσείς ποιον δεν προλάβατε να πάρετε τηλέφωνο.",
  "Στέλνετε το ίδιο μήνυμα ξανά και ξανά, αλλάζοντας λίγες λέξεις κάθε φορά.",
  "Μαζεύετε χειροκίνητα τα ίδια στοιχεία κάθε μήνα, για μια αναφορά που τη διαβάζει ένας.",
] as const;

export default function AutomationsPage() {
  return (
    <>
      <ServiceJsonLd
        path={ROUTE.path}
        name="Αυτοματισμοί διαδικασιών και AI για επιχειρήσεις"
        serviceType="Business process automation"
        description={ROUTE.description}
      />

      <PageShell>
        {/* ------------------------------ Intent ----------------------------- */}
        <SectionHeader
          titleAs="h1"
          eyebrow="[ // ΑΥΤΟΜΑΤΙΣΜΟΙ AI ]"
          title="Αυτοματισμοί AI για επιχειρήσεις που έχουν βαρεθεί τη χειροκίνητη δουλειά."
          lede="Στήνουμε ροές που τρέχουν μόνες τους: παραλαμβάνουν αιτήματα, απαντούν, συμπληρώνουν στοιχεία και ενημερώνουν τα εργαλεία που ήδη χρησιμοποιείτε. Εσείς βλέπετε το αποτέλεσμα, όχι τη διαδικασία."
        />

        <ServiceSection
          id="capabilities"
          eyebrow="[ 01 // ΤΙ ΑΥΤΟΜΑΤΟΠΟΙΕΙΤΑΙ ]"
          title="Τι αναλαμβάνει η ροή."
        >
          <FeatureGrid items={CAPABILITIES} />
        </ServiceSection>

        {/* ------------------------- What stops being work ------------------- */}
        <ServiceSection
          id="by-hand"
          eyebrow="[ 02 // ΤΙ ΣΤΑΜΑΤΑΤΕ ΝΑ ΚΑΝΕΤΕ ]"
          title="Πότε αξίζει να μιλήσουμε."
        >
          <BulletList items={BY_HAND} className="mt-8 max-w-3xl" />
        </ServiceSection>

        {/* ----------------------------- Evidence ---------------------------- */}
        {/* Named, cleared and delivered — the one system on this page that is
            not a description of what we could build. The summary deliberately
            stays on the case study rather than being repeated here: D1's rule
            is that a deeper page expands and the shallower one points. */}
        <ServiceSection
          id="evidence"
          eyebrow="[ 03 // ΕΝΑ ΠΟΥ ΤΡΕΧΕΙ ]"
          title="Μια ροή που δουλεύει σήμερα."
        >
          <Card className="mt-8 max-w-3xl p-5">
            <p className="text-base font-semibold text-white">{BTL.name}</p>
            <p className="mt-1.5 text-xs text-zinc-400">{BTL.kind}</p>

            <ArrowLink href={`/work/${BTL.slug}`} className="mt-4">
              Δείτε τι κάνει
            </ArrowLink>
          </Card>
        </ServiceSection>

        {/* --------------------------- Architectures ------------------------- */}
        {/* Moved here from the homepage in S4.1, and placed deliberately after
            the delivered flow above: what actually runs first, what we could
            build second. «Ενδεικτικά» is §8.2 and is in the eyebrow, the
            title and the lede. */}
        <ServiceSection
          id="architectures"
          eyebrow="[ 04 // ΕΝΔΕΙΚΤΙΚΑ ΣΥΣΤΗΜΑΤΑ ]"
          title="Πώς δουλεύουν τέτοια συστήματα."
          lede="Ενδεικτικά — περιγράφουν συστήματα που κατασκευάζουμε, όχι δημοσιευμένα έργα πελατών."
        >
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {showcaseFor("automations").map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))}
          </div>
        </ServiceSection>

        {/* ---------------------------- How it runs -------------------------- */}
        {/* One sentence and a link, as on `/websites` and for the same reason:
            the three steps live in one place and S2.6 is where that place
            becomes a module. Both constants are interpolated. */}
        <ServiceSection
          id="how"
          eyebrow="[ 05 // ΠΩΣ ΤΡΕΧΕΙ ]"
          title="Πώς φτάνουμε από τη συζήτηση στη ροή."
          lede={`Ξεκινάμε με ένα δωρεάν audit — παίρνετε ${AUDIT_DELIVERABLE}. Μετά συμφωνούμε ποια διαδικασία αυτοματοποιείται πρώτη, και η κατασκευή παραδίδεται σε στάδια. Ο χρόνος είναι ${TIMELINE_RANGE} — όχι υπόσχεση ημερομηνίας.`}
        >
          <ArrowLink href="/process" className="mt-6">
            Η διαδικασία, αναλυτικά
          </ArrowLink>
        </ServiceSection>

        {/* ----------------------------- Control ----------------------------- */}
        <ServiceSection
          id="control"
          eyebrow="[ 06 // ΠΟΙΟΣ ΕΧΕΙ ΤΟΝ ΕΛΕΓΧΟ ]"
          title="Σε ποιανού τα χέρια τρέχουν οι ροές."
          lede="Σε λογαριασμούς που συμφωνούνται από την αρχή: δικούς σας, ή διαχειριζόμενους από εμάς αν δεν θέλετε να ασχολείστε. Τα δεδομένα και τα κλειδιά μένουν εκεί, και ξέρετε ανά πάσα στιγμή πού βρίσκονται και ποιος έχει πρόσβαση."
        >
          <Card tone="glass" className="mt-8 max-w-3xl p-5">
            <Eyebrow variant="label">Και αν σπάσει κάτι όταν λείπετε</Eyebrow>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Κάθε ροή καταγράφει τι έκανε και ειδοποιεί όταν κάτι αποτύχει,
              οπότε το μαθαίνετε πριν το μάθει ο πελάτης σας. Η τεκμηρίωση
              παραδίδεται μαζί με τη ροή, ώστε να μπορεί να μπει οποιοσδήποτε
              τεχνικός και να δει τι τρέχει.
            </p>

            <ArrowLink href="/faq" size="quiet" className="mt-4">
              Οι υπόλοιπες ερωτήσεις
            </ArrowLink>
          </Card>
        </ServiceSection>

        <ServiceCta
          id="cta"
          title="Πείτε μας ποια διαδικασία σας τρώει τον χρόνο."
        />
      </PageShell>
    </>
  );
}
