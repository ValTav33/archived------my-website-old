import ServiceCta from "@/components/services/ServiceCta";
import ServiceSection from "@/components/services/ServiceSection";
import BulletList from "@/components/ui/BulletList";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { routeMetadata } from "@/lib/seo";
import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

export const metadata = routeMetadata("/pricing");

/**
 * `/pricing` — the model, with no figures.
 *
 * **D4, and the interpretation is on the record.** Val asked for a
 * placeholder saying «σύντομα». What ships is the honest reading of that: a
 * real page carrying the pricing *model*, because Phase 0's entire objective
 * was deleting placeholder text from this site and §8 forbids content that
 * cannot be defended. A page whose only content is «σύντομα» reintroduces
 * exactly what Phase 0 removed — on a route the FAQ now sends people to.
 *
 * This page is finished except for its numbers. When they exist they drop
 * into one section; nothing here has to be rewritten to accommodate them.
 *
 * **Zero figures, deliberately, and that is the thing to check on review.**
 * §2.2 is the rule: the FAQ explains the model without numbers, and a number
 * on this page that is not defensible is worse than no page at all. The
 * closest this comes is `TIMELINE_RANGE`, which is a range the playbook
 * defines and interpolates rather than a price.
 */

/** What actually moves the number. Each one is a question, not a feature. */
const DRIVERS = [
  "Πόσες σελίδες ή οθόνες χρειάζονται, και πόσες από αυτές κάνουν κάτι αντί να δείχνουν κάτι.",
  "Αν το έργο χρειάζεται λογαριασμούς χρηστών, ρόλους, πληρωμές ή διαχείριση από μέσα.",
  "Με πόσα συστήματα που ήδη χρησιμοποιείτε πρέπει να συνδεθεί.",
  "Αν το περιεχόμενο — κείμενα και φωτογραφίες — υπάρχει ή πρέπει να φτιαχτεί.",
  "Πόσα βήματα έχει η ροή που θέλετε να σταματήσει να γίνεται με το χέρι.",
];

/** What the monthly covers, when someone wants it. */
const SUPPORT = [
  "Ενημερώσεις και παρακολούθηση, ώστε να μην το θυμηθείτε εσείς.",
  "Αλλαγές και προσθήκες μέσα σε συμφωνημένο χρόνο κάθε μήνα.",
  "Διαχείριση των λογαριασμών όπου ζει το έργο, αν δεν θέλετε να ασχολείστε.",
];

export default function PricingPage() {
  return (
    <PageShell>
      <SectionHeader
        titleAs="h1"
        eyebrow="[ // ΤΙΜΟΛΟΓΗΣΗ ]"
        title="Πόσο κοστίζει, και από τι εξαρτάται."
        lede="Σταθερή αμοιβή για την κατασκευή, συμφωνημένη γραπτά πριν ξεκινήσουμε, και προαιρετική μηνιαία υποστήριξη μετά την παράδοση. Παρακάτω είναι τι περιλαμβάνει κάθε ένα από τα δύο και τι μετακινεί το νούμερο."
      />

      <ServiceSection
        id="model"
        eyebrow="[ 01 // ΤΟ ΜΟΝΤΕΛΟ ]"
        title="Μία τιμή για την κατασκευή, συμφωνημένη από την αρχή."
        lede={`Δεν χρεώνουμε με την ώρα. Συμφωνούμε τι μπαίνει και τι δεν μπαίνει, βγαίνει μία τιμή, και αυτή είναι η τιμή — ακόμα και αν η δουλειά μας πάρει περισσότερο από όσο υπολογίσαμε. Ο χρόνος παράδοσης είναι ${TIMELINE_RANGE}, ανάλογα με το εύρος.`}
      >
        <Card tone="glass" className="mt-8 max-w-3xl p-5">
          <Eyebrow variant="label">Τι σημαίνει αυτό πρακτικά</Eyebrow>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Αν κάτι προστεθεί στην πορεία, το συζητάμε και το τιμολογούμε
            ξεχωριστά πριν γίνει — δεν εμφανίζεται στον τελικό λογαριασμό. Και
            αν κάτι βγει από το εύρος, δεν το πληρώνετε.
          </p>
        </Card>
      </ServiceSection>

      <ServiceSection
        id="drivers"
        eyebrow="[ 02 // ΤΙ ΜΕΤΑΚΙΝΕΙ ΤΟ ΝΟΥΜΕΡΟ ]"
        title="Γιατί δύο site δεν κοστίζουν το ίδιο."
        lede="Το εύρος είναι το μόνο πράγμα που καθορίζει την τιμή. Αυτά είναι τα ερωτήματα που την κινούν, και είναι τα ίδια που ρωτάμε στην πρώτη κλήση."
      >
        <BulletList items={DRIVERS} className="mt-8 max-w-3xl" />
      </ServiceSection>

      <ServiceSection
        id="support"
        eyebrow="[ 03 // ΜΗΝΙΑΙΑ ΥΠΟΣΤΗΡΙΞΗ ]"
        title="Προαιρετική, και το εννοούμε."
        lede="Το έργο δεν χρειάζεται συνδρομή για να μείνει όρθιο. Η μηνιαία υπάρχει για όποιον προτιμά να μην ασχολείται καθόλου, και μπορεί να σταματήσει."
      >
        <BulletList items={SUPPORT} className="mt-8 max-w-3xl" />
      </ServiceSection>

      <ServiceSection
        id="numbers"
        eyebrow="[ 04 // ΓΙΑΤΙ ΔΕΝ ΒΛΕΠΕΤΕ ΤΙΜΕΣ ΕΔΩ ]"
        title="Ακόμα."
        lede="Τα πακέτα με συγκεκριμένα νούμερα ανεβαίνουν σε αυτή τη σελίδα. Μέχρι τότε, μια τιμή χωρίς εύρος είναι μάντεμα — και το μάντεμα το πληρώνει πάντα ο πελάτης, είτε επειδή βγήκε ακριβότερο απ' όσο έπρεπε, είτε επειδή κόπηκε δουλειά για να βγει το νούμερο."
      >
        <Card tone="glass" className="mt-8 max-w-3xl p-5">
          <Eyebrow variant="label">Πώς παίρνετε νούμερο σήμερα</Eyebrow>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Με το δωρεάν audit. Παίρνετε {AUDIT_DELIVERABLE} — και μέσα σε
            αυτό, εκτίμηση κόστους για αυτό που περιγράψατε. Χωρίς κόστος και
            χωρίς δέσμευση να συνεχίσετε.
          </p>
        </Card>
      </ServiceSection>

      <ServiceCta id="cta" title="Πείτε μας τι θέλετε, και σας λέμε τι κοστίζει." />
    </PageShell>
  );
}
