import LegalDocument, {
  type LegalSection,
} from "@/components/legal/LegalDocument";
import { routeMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = routeMetadata("/privacy");

/**
 * `/privacy` — **what the site does today, and nothing else.**
 *
 * D3 in the phase spec records why this route ships in Phase 2 while the
 * playbook's §3 puts the privacy policy in Phase 3: §2.3 lists it in the
 * route tree Phase 2 builds, so the route has to exist, and Phase 3 revises
 * this text in the same slice that wires delivery.
 *
 * Every statement below was checked against the code rather than written from
 * a template. `app/api/audit/route.ts` was read line by line:
 *
 *   - the form's fields are the seven `audit-*` inputs, one of which is a
 *     honeypot a human never sees
 *   - a submission is origin-checked, rate-limited, validated, and then
 *     passed to `deliverAuditRequest`, which is a stub
 *   - that stub logs **only** non-identifying metadata: a timestamp, the
 *     chosen intent, whether a website was supplied, and the character
 *     length of the brief. Name, email and phone never reach a log line, and
 *     the code carries a comment explaining that Vercel logs are retained and
 *     searchable
 *   - the rate limiter holds caller IPs in one instance's memory for at most
 *     one hour
 *
 * And verified against the build: **no cookies, no `localStorage`, no
 * analytics, no third-party scripts**, and zero requests to `fonts.gstatic`
 * or `fonts.googleapis` because `next/font` self-hosts both faces.
 *
 * §8.6 is absolute here: no ΑΦΜ, no myDATA, no τιμολόγιο, no
 * registered-entity language. Val reads this page before the phase PR
 * merges — it is the one document on the site where a drafting error has
 * consequences off the website.
 */
const UPDATED = "13 Σεπτεμβρίου 2026";

const SECTIONS: readonly LegalSection[] = [
  {
    heading: "Ποιος διαχειρίζεται τα στοιχεία",
    body: [
      `Ο ιστότοπος ${SITE.url.replace(/^https?:\/\//, "")} λειτουργεί από το ${SITE.brand} — ${SITE.person}, με έδρα τη Θεσσαλονίκη. Για κάθε ερώτημα σχετικά με τα στοιχεία σας: ${SITE.email}.`,
    ],
  },
  {
    heading: "Τι στοιχεία συλλέγουμε",
    body: [
      "Μόνο όσα συμπληρώνετε μόνοι σας στη φόρμα αιτήματος. Δεν υπάρχει άλλος τρόπος να δώσετε στοιχεία σε αυτόν τον ιστότοπο.",
    ],
    list: [
      "Ονοματεπώνυμο",
      "Email",
      "Τηλέφωνο",
      "Τρέχον website, αν έχετε και θέλετε να το δώσετε — προαιρετικό",
      "Τι σας ενδιαφέρει κυρίως",
      "Μια σύντομη περιγραφή του τι θέλετε να γίνει",
    ],
  },
  {
    heading: "Τι γίνεται με αυτά",
    body: [
      "Χρησιμοποιούνται για να απαντήσουμε στο δικό σας αίτημα και για τίποτε άλλο. Δεν αποθηκεύονται σε βάση δεδομένων, δεν μπαίνουν σε λίστα αλληλογραφίας, δεν χρησιμοποιούνται για διαφήμιση και δεν πωλούνται ούτε διαβιβάζονται σε τρίτους.",
      "Δεν στέλνουμε ενημερωτικά email. Αν δεν έχετε στείλει αίτημα, δεν έχουμε κανένα στοιχείο σας.",
    ],
  },
  {
    heading: "Τι καταγράφεται — και τι όχι",
    body: [
      "Όταν φτάνει ένα αίτημα, καταγράφεται η ώρα, το τι σας ενδιαφέρει, το αν δώσατε website, και το μήκος του κειμένου που γράψατε. Το ονοματεπώνυμο, το email και το τηλέφωνό σας δεν καταγράφονται πουθενά.",
      "Η διεύθυνση IP από την οποία στάλθηκε το αίτημα κρατείται προσωρινά στη μνήμη του διακομιστή, για μία ώρα κατά το μέγιστο, και μόνο για να μην μπορεί κάποιος να στείλει αυτόματα εκατοντάδες αιτήματα. Δεν συνδέεται με το περιεχόμενο του αιτήματος και δεν αποθηκεύεται μόνιμα.",
    ],
  },
  {
    heading: "Cookies και παρακολούθηση",
    body: [
      "Αυτός ο ιστότοπος δεν χρησιμοποιεί cookies. Δεν υπάρχουν analytics, δεν υπάρχουν pixels, δεν υπάρχουν trackers και δεν αποθηκεύεται τίποτα στον browser σας. Γι' αυτό δεν θα δείτε μπάνερ συγκατάθεσης — δεν υπάρχει κάτι για το οποίο να συναινέσετε.",
      "Οι γραμματοσειρές σερβίρονται από τον ίδιο τον ιστότοπο, όχι από την Google, οπότε η επίσκεψή σας εδώ δεν ενημερώνει κανέναν άλλον ότι ήρθατε.",
    ],
  },
  {
    heading: "Ποιοι άλλοι εμπλέκονται",
    body: [
      "Ο ιστότοπος φιλοξενείται στη Vercel. Όπως κάθε πάροχος φιλοξενίας, η Vercel βλέπει τα τεχνικά στοιχεία κάθε αιτήματος — διεύθυνση IP, πρόγραμμα περιήγησης, σελίδα — για να μπορέσει να σας σερβίρει τη σελίδα.",
      "Κανένας άλλος. Δεν υπάρχει CRM, δεν υπάρχει εργαλείο email marketing και δεν υπάρχει πλατφόρμα analytics συνδεδεμένη με αυτόν τον ιστότοπο.",
    ],
  },
  {
    heading: "Τα δικαιώματά σας",
    body: [
      `Μπορείτε να ζητήσετε να μάθετε τι στοιχεία σας έχουμε, να τα διορθώσουμε, να τα διαγράψουμε, ή να μας πείτε να μη τα χρησιμοποιήσουμε. Στείλτε ένα email στο ${SITE.email} και απαντάμε.`,
      "Επειδή δεν κρατάμε αρχείο των αιτημάτων, ένα αίτημα διαγραφής συνήθως δεν έχει τι να διαγράψει — και αυτό σας το λέμε καθαρά αντί να σας στείλουμε φόρμα.",
    ],
  },
  {
    heading: "Αν αλλάξει κάτι",
    body: [
      "Αυτή η σελίδα περιγράφει τι κάνει ο ιστότοπος σήμερα, όχι τι σχεδιάζουμε. Αν αρχίσουμε να αποθηκεύουμε τα αιτήματα σε βάση δεδομένων, να τα στέλνουμε σε email, ή να χρησιμοποιούμε οποιοδήποτε εργαλείο μέτρησης επισκεψιμότητας, η σελίδα θα ενημερωθεί ώστε να το λέει — και η ημερομηνία πιο πάνω θα αλλάξει.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalDocument
      title="Πολιτική Απορρήτου"
      lede="Τι στοιχεία δίνετε, τι γίνεται με αυτά, και τι δεν κάνουμε. Γραμμένη για να διαβαστεί, όχι για να καλύψει."
      updated={UPDATED}
      sections={SECTIONS}
    />
  );
}
