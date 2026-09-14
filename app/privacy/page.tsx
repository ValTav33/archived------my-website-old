import LegalDocument, {
  type LegalSection,
} from "@/components/legal/LegalDocument";
import { routeMetadata } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata = routeMetadata("/privacy");

/**
 * `/privacy` — **what the site does today, and nothing else.**
 *
 * **This page is revised in the same commit as every slice that changes what
 * happens to a submission.** Playbook §3 says to revise it *in the same slice
 * that wires delivery*; in Phase 3 delivery is not one slice — it is email
 * (S3.3), the archive (S3.4), the IP counter (S3.5) and possibly analytics
 * (S3.7), and each falsifies a different sentence here. So the rule is
 * stronger than the playbook's wording and satisfies it strictly. `UPDATED`
 * moves every time.
 *
 * The page's own last section is what makes this non-optional: it promises
 * «Αν αρχίσουμε να αποθηκεύουμε τα αιτήματα σε βάση δεδομένων… η σελίδα θα
 * ενημερωθεί ώστε να το λέει». Keeping that promise is a phase requirement,
 * not a courtesy.
 *
 * **Revision history of the facts, not of the prose:**
 *
 * *Phase 2 (S2.9)* — a submission was validated and then discarded. No
 * transport, no database, no processor but the host.
 *
 * *S3.3, this revision* — the request is now **sent as an email** and kept in
 * a mailbox, and the mail provider is named as a processor. One sentence
 * narrowed rather than deleted: name, email and phone are still absent from
 * the server's logs (verified in `app/api/audit/route.ts`, whose trace line
 * carries only a timestamp, the environment, the intent, whether a website
 * was given, and a character count) — they now live in the email instead, and
 * the page says exactly that rather than continuing to claim they exist
 * nowhere.
 *
 * *S3.4, this revision* — a **copy is now stored in a database**, in the EU,
 * and Supabase is named as a processor. «Δεν αποθηκεύονται σε βάση δεδομένων»
 * is gone, which is the sentence the page's own last section promised would
 * change if this ever happened.
 *
 * The claim that the table is unreachable from a browser is measured, not
 * assumed: row-level security is on with zero policies, the grants are
 * revoked, and `SELECT`, `INSERT` and `DELETE` were tried against the live
 * REST endpoint with both browser-safe key forms — eight of eight answered
 * `401 / 42501 permission denied`.
 *
 * **The retention period is deliberately not stated here yet.** It arrives in
 * S3.6, in the same commit as the scheduled job that enforces it. A period
 * this page promises and nothing deletes would be the one content error on
 * this site with consequences off it, and "the cron lands in twenty minutes"
 * is not a basis for writing it down now.
 *
 * Still true at this revision, and checked against the code rather than
 * assumed: no cookies, no `localStorage`, no analytics, no third-party
 * scripts, and zero requests to `fonts.gstatic` or `fonts.googleapis` because
 * `next/font` self-hosts both faces. The rate limiter still holds caller IPs
 * in one instance's memory for at most an hour — S3.5 changes that, and this
 * page with it.
 *
 * §8.6 is absolute here: no ΑΦΜ, no myDATA, no τιμολόγιο, no
 * registered-entity language. **Val re-reads this page before the Phase 3 PR
 * merges** — D3 in the Phase 2 spec made him read it once, and this phase
 * rewrites half of it.
 */
const UPDATED = "14 Σεπτεμβρίου 2026";

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
      "Μόλις στείλετε τη φόρμα, το αίτημά σας φτάνει σε εμάς ως email. Χρησιμοποιείται για να σας απαντήσουμε και για τίποτε άλλο: δεν μπαίνει σε λίστα αλληλογραφίας, δεν χρησιμοποιείται για διαφήμιση και δεν πωλείται ούτε διαβιβάζεται σε τρίτους.",
      "Κρατάμε και ένα αντίγραφο σε βάση δεδομένων, ώστε ένα αίτημα να μη χαθεί αν χαθεί ή διαγραφεί ένα email. Η βάση βρίσκεται σε διακομιστές εντός Ευρωπαϊκής Ένωσης, στη Φρανκφούρτη.",
      "Το email με το αίτημά σας μένει επίσης στο γραμματοκιβώτιό μας, όσο χρειάζεται για να απαντήσουμε και για να υπάρχει ιστορικό της συνομιλίας μας.",
      "Δεν στέλνουμε ενημερωτικά email. Αν δεν έχετε στείλει αίτημα, δεν έχουμε κανένα στοιχείο σας.",
    ],
  },
  {
    heading: "Τι καταγράφεται — και τι όχι",
    body: [
      "Στα τεχνικά αρχεία του διακομιστή καταγράφεται, για κάθε αίτημα, η ώρα, το τι σας ενδιαφέρει, το αν δώσατε website, και το μήκος του κειμένου που γράψατε. Το ονοματεπώνυμο, το email και το τηλέφωνό σας δεν καταγράφονται εκεί — υπάρχουν μόνο μέσα στο email που λαμβάνουμε και στη γραμμή της βάσης.",
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
      "Το email με το αίτημά σας στέλνεται μέσω της υπηρεσίας Resend, η οποία το παραδίδει στο γραμματοκιβώτιό μας. Για να το κάνει, το περιεχόμενο του μηνύματος — δηλαδή τα στοιχεία που συμπληρώσατε — περνά από τα συστήματά της.",
      "Το αντίγραφο του αιτήματος αποθηκεύεται στη Supabase, στην περιοχή της Φρανκφούρτης. Ο πίνακας δεν διαβάζεται από τις σελίδες του ιστότοπου και δεν είναι προσβάσιμος από κανέναν browser: γράφει σε αυτόν μόνο ο διακομιστής μας, και τον διαβάζουμε μόνο εμείς.",
      "Κανένας άλλος. Δεν υπάρχει CRM, δεν υπάρχει εργαλείο email marketing και δεν υπάρχει πλατφόρμα analytics συνδεδεμένη με αυτόν τον ιστότοπο.",
    ],
  },
  {
    heading: "Τα δικαιώματά σας",
    body: [
      `Μπορείτε να ζητήσετε να μάθετε τι στοιχεία σας έχουμε, να τα διορθώσουμε, να τα διαγράψουμε, ή να μας πείτε να μη τα χρησιμοποιήσουμε. Στείλτε ένα email στο ${SITE.email} και απαντάμε.`,
      "Πρακτικά, ένα αίτημα διαγραφής σημαίνει ότι σβήνουμε και το email από το γραμματοκιβώτιό μας και τη γραμμή από τη βάση. Δεν υπάρχει τρίτο αντίγραφο κάπου αλλού, οπότε αυτό είναι όλο — και σας το λέμε καθαρά αντί να σας στείλουμε φόρμα.",
    ],
  },
  {
    heading: "Αν αλλάξει κάτι",
    body: [
      "Αυτή η σελίδα περιγράφει τι κάνει ο ιστότοπος σήμερα, όχι τι σχεδιάζουμε. Όταν άρχισε να στέλνει τα αιτήματα με email και να τα αποθηκεύει σε βάση δεδομένων, η σελίδα ενημερώθηκε ώστε να το λέει. Το ίδιο θα γίνει με κάθε επόμενη αλλαγή — και η ημερομηνία πιο πάνω θα αλλάξει μαζί.",
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
