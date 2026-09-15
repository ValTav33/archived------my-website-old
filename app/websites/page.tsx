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
import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

export const metadata = routeMetadata("/websites");

const ROUTE = getRoute("/websites");

/**
 * What the client actually receives. Every line is something that exists on a
 * delivered project or on this site, which is §8.5 read strictly: a service
 * page is allowed to describe a service, but not to describe a capability
 * that has never been exercised.
 *
 * **No numbers anywhere in this file.** Not a load time, not a Lighthouse
 * score, not a percentage. §8.1's test is whether the figure survives a
 * prospect asking where it came from, and a performance number is worse than
 * unverifiable — it is true on the day it is written and false after one
 * dependency bump, on a page nobody thinks to re-measure.
 */
const DELIVERABLES: readonly Feature[] = [
  {
    title: "Φτιαγμένο από την αρχή για εσάς",
    body: "Χωρίς έτοιμα πρότυπα και χωρίς πρόσθετα τρίτων για να λειτουργήσει — άρα λιγότερα πράγματα που μπορούν να χαλάσουν.",
  },
  {
    title: "Σωστό σε κινητό πρώτα",
    body: "Δουλεύει σε κινητό, tablet και υπολογιστή, και ελέγχεται σε κάθε ένα από αυτά πριν την παράδοση.",
  },
  {
    title: "Preview URL σε κάθε στάδιο",
    body: "Ένας σύνδεσμος που ανοίγετε και βλέπετε τι έχει γίνει, όσο γίνεται — όχι screenshot σε email.",
  },
  {
    title: "Τεχνικό SEO από την αρχή",
    body: "Μοναδικοί τίτλοι και περιγραφές, sitemap, structured data και OG κάρτες για όταν μοιράζεται ο σύνδεσμος.",
  },
  {
    title: "Προσβασιμότητα, όχι εκ των υστέρων",
    body: "Αντιθέσεις, πλοήγηση με πληκτρολόγιο και σωστή σήμανση — ελέγχονται καθώς κατασκευάζεται, όχι σε δεύτερη φάση.",
  },
  {
    title: "Ξεκάθαρο τι παραδίδεται",
    body: "Τι παίρνετε στο τέλος, πού ζει το έργο και ποιος κρατά τους λογαριασμούς — γραμμένα πριν ξεκινήσει η κατασκευή, όχι μετά.",
  },
];

/** Who this is for, said the way the prospect would describe themselves. */
const AUDIENCE = [
  "Έχετε site και έχει γίνει βάρος — αργεί, χαλάει, και κάθε αλλαγή περνά από κάποιον άλλον.",
  "Δεν έχετε site και δεν θέλετε να το φτιάξετε δύο φορές.",
  "Θέλετε κάτι περισσότερο από σελίδα παρουσίασης: λογαριασμούς χρηστών, portal πελατών, διαχείριση από μέσα.",
] as const;

export default function WebsitesPage() {
  return (
    <>
      <ServiceJsonLd
        path={ROUTE.path}
        name="Κατασκευή ιστοσελίδων και web εφαρμογών"
        serviceType="Web development"
        description={ROUTE.description}
      />

      <PageShell>
        {/* ------------------------------ Intent ----------------------------- */}
        {/* The keyword is in the h1 because that is the phrase someone typed to
            arrive here, and §11.7 wants a heading that is a sentence rather
            than a label — so it carries the clause that matters most to them
            instead of standing alone as a category name. */}
        <SectionHeader
          titleAs="h1"
          eyebrow="[ // ΚΑΤΑΣΚΕΥΗ ΙΣΤΟΣΕΛΙΔΩΝ ]"
          title="Κατασκευή ιστοσελίδων στη Θεσσαλονίκη, που φορτώνουν γρήγορα και κάνουν δουλειά."
          lede="Σχεδιάζουμε και κατασκευάζουμε ιστοσελίδες και web εφαρμογές για επιχειρήσεις στη Θεσσαλονίκη και σε όλη την Ελλάδα. Φτιαγμένες από την αρχή για αυτό που κάνει η δική σας, και έτσι φορτώνουν γρήγορα και αλλάζουν εύκολα όταν αλλάζει κάτι."
        />

        <ServiceSection
          id="deliverables"
          eyebrow="[ 01 // ΤΙ ΠΑΙΡΝΕΤΕ ]"
          title="Τι παραδίδεται, συγκεκριμένα."
        >
          <FeatureGrid items={DELIVERABLES} />
        </ServiceSection>

        <ServiceSection
          id="audience"
          eyebrow="[ 02 // ΓΙΑ ΠΟΙΟΥΣ ]"
          title="Πότε αξίζει να μιλήσουμε."
        >
          <BulletList items={AUDIENCE} className="mt-8 max-w-3xl" />
        </ServiceSection>

        {/* --------------------------- Architectures ------------------------- */}
        {/* Moved here from the homepage in S4.1. The homepage carries one line
            per system and links in; this is where the problem, the solution
            and the data flow belong — in front of a reader who followed that
            link and has therefore asked for the detail.

            «Ενδεικτικά» is required by §8.2 and is in the eyebrow, the title
            and the lede. These describe systems we build; the one that
            actually runs for a named client is at `/work`. */}
        <ServiceSection
          id="architectures"
          eyebrow="[ 03 // ΕΝΔΕΙΚΤΙΚΑ ΣΥΣΤΗΜΑΤΑ ]"
          title="Πώς δουλεύει ένα τέτοιο σύστημα."
          lede="Ενδεικτικό — περιγράφει σύστημα που κατασκευάζουμε, όχι δημοσιευμένο έργο πελάτη."
        >
          <div className="mt-8 max-w-2xl">
            {showcaseFor("websites").map((item) => (
              <ShowcaseCard key={item.id} item={item} />
            ))}
          </div>
        </ServiceSection>

        {/* ---------------------------- How it runs -------------------------- */}
        {/* One sentence and a link, not a restatement of the three steps. The
            steps live in `ProcessSection` today and move to `lib/process.ts`
            in S2.6; writing them out here would have made a fourth
            hand-typed copy of a promise that is supposed to exist once. The
            two constants below are interpolated for the same reason. */}
        <ServiceSection
          id="how"
          eyebrow="[ 04 // ΠΩΣ ΤΡΕΧΕΙ ]"
          title="Πώς φτάνουμε από τη συζήτηση στο site."
          lede={`Ξεκινάμε με ένα δωρεάν audit — παίρνετε ${AUDIT_DELIVERABLE}. Μετά συμφωνούμε το εύρος πριν γραφτεί γραμμή κώδικα, και η κατασκευή παραδίδεται σε στάδια, με preview URL σε κάθε ένα. Ο χρόνος είναι ${TIMELINE_RANGE} — όχι υπόσχεση ημερομηνίας.`}
        >
          <ArrowLink href="/process" className="mt-6">
            Η διαδικασία, αναλυτικά
          </ArrowLink>
        </ServiceSection>

        {/* -------------------------- What you keep -------------------------- */}
        <ServiceSection
          id="ownership"
          eyebrow="[ 05 // ΤΙ ΣΑΣ ΜΕΝΕΙ ]"
          title="Τι έχετε στο χέρι σας στο τέλος."
          lede="Τεκμηρίωση για το πώς δουλεύει, μια διαδρομή μέσα από το έργο, και γραπτή συμφωνία για το ποιος κρατά τι. Τους λογαριασμούς όπου ζει το site μπορείτε να τους κρατάτε εσείς ή να τους αναλαμβάνουμε εμείς — αποφασίζεται ανάλογα με πόσο θέλετε να ασχολείστε, και συμφωνείται πριν την παράδοση. Η μηνιαία υποστήριξη είναι προαιρετική, όχι προϋπόθεση για να μείνει το site όρθιο."
        >
          {/* §11.6: the objection gets answered here in structure, and the
              full answer lives in the FAQ rather than in two places. */}
          <Card tone="glass" className="mt-8 max-w-3xl p-5">
            <Eyebrow variant="label">Γιατί custom</Eyebrow>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Μια έτοιμη πλατφόρμα σας δίνει ό,τι έχει προβλέψει για όλους.
              Όταν το site πρέπει να κάνει κάτι συγκεκριμένο — να συνδεθεί με
              τα εργαλεία που ήδη χρησιμοποιείτε, να έχει λογαριασμούς
              χρηστών, να δείχνει τα δικά σας δεδομένα — το custom βγαίνει
              πιο γρήγορο και αλλάζει πιο εύκολα. Αν αυτό που θέλετε δεν το
              χρειάζεται, θα σας το πούμε.
            </p>

            <ArrowLink href="/faq" size="quiet" className="mt-4">
              Οι υπόλοιπες ερωτήσεις
            </ArrowLink>
          </Card>
        </ServiceSection>

        <ServiceCta id="cta" title="Πείτε μας τι θέλετε να φτιάξετε." />
      </PageShell>
    </>
  );
}
