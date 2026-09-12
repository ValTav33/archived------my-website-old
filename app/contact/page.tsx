import AuditForm from "@/components/conversion/AuditForm";
import DirectContactCard from "@/components/conversion/DirectContactCard";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionHeader from "@/components/ui/SectionHeader";
import { routeMetadata } from "@/lib/seo";
import { AUDIT_DELIVERABLE } from "@/lib/site";

export const metadata = routeMetadata("/contact");

/**
 * `/contact` — the same form and the same channels as the homepage's
 * conversion block, with the emphasis reversed.
 *
 * On the homepage the direct channels are a narrow rail beside the form,
 * because the page's job by that point is to convert a reader who has just
 * finished an argument. Someone who navigates here has already decided to
 * make contact and wants the fastest route, so the channels come first and
 * full width, and the form follows for anyone who would rather write than
 * call. Same components, same strings, different shape — the phase spec's
 * D1 rule.
 *
 * **No copy is duplicated by hand.** The lede interpolates
 * `AUDIT_DELIVERABLE`, the one place the 15-minute call and the 24-hour
 * summary are written down, so this page physically cannot promise something
 * different from the form, the homepage or process step 01.
 *
 * The form posts to `/api/audit`, which still validates and discards. That is
 * Phase 3's to fix, and the promise stays as written until it does — see
 * *Backend is out of scope* in the Phase 1 spec.
 */
export default function ContactPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
      {/* The page's `h1`. §11.7 asks for a sentence a client would say, and
          what they get for saying it is the very next line rather than a
          claim buried below the form. */}
      <SectionHeader
        titleAs="h1"
        eyebrow="[ // ΕΠΙΚΟΙΝΩΝΙΑ ]"
        title="Πείτε μας τι θέλετε να φτιάξετε."
        lede={`Στείλτε το αίτημα και παίρνετε ${AUDIT_DELIVERABLE}. Αν προτιμάτε να μιλήσουμε κατευθείαν, τα στοιχεία είναι παρακάτω.`}
      />

      {/* --------------------- Channels, as the subject -------------------- */}
      <div className="mt-14">
        {/* An `h2` styled as a micro label — the same arrangement the footer
            uses for its column headings, so this introduces no new pattern.
            It exists so the heading order runs h1 → h2 → h3 with no skip
            once the form's success state renders its own h3. */}
        <Eyebrow as="h2" variant="label">
          Άμεση επικοινωνία
        </Eyebrow>

        <div className="mt-5">
          <DirectContactCard layout="wide" />
        </div>
      </div>

      {/* ------------------------------ The form --------------------------- */}
      <div className="mt-16 max-w-3xl">
        <Eyebrow as="h2" variant="label">
          Αίτημα δωρεάν audit
        </Eyebrow>

        <div className="mt-5">
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
