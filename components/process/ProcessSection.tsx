import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

/**
 * How the engagement runs.
 *
 * A prospect who does not know what happens after they click cannot judge the
 * risk of clicking, so this section exists to remove that unknown before the
 * FAQ and the form ask for anything.
 *
 * Two of the three steps quote shared constants rather than their own copy:
 * step 01 interpolates the same `AUDIT_DELIVERABLE` the form prints under its
 * submit button, and step 02 the same `TIMELINE_RANGE` the FAQ will answer
 * «Πόσο θα πάρει;» with. A promise that is retyped is a promise that drifts.
 *
 * No icons. Playbook §2.4 asks for simple over dense, and the step number plus
 * the title already carry the sequence — a Lucide glyph beside each would be
 * decoration, which §2.5's own guidance says not to add.
 *
 * Cards in an ordered list, not a connector diagram: §2.4 caps terminal
 * surfaces at two per viewport and the showcase's architecture traces sit
 * directly above this section.
 */
const STEPS = [
  {
    n: "01",
    title: "Δωρεάν audit",
    body: `Παίρνετε ${AUDIT_DELIVERABLE}. Χωρίς κόστος και χωρίς δέσμευση να συνεχίσετε.`,
  },
  {
    n: "02",
    title: "Σχεδιασμός & κατασκευή",
    body: `Συμφωνούμε το εύρος και χτίζουμε σε στάδια. Σε κάθε στάδιο έχετε ένα preview URL που μπορείτε να ανοίξετε και να δείτε πού βρισκόμαστε. Ο χρόνος: ${TIMELINE_RANGE}.`,
  },
  {
    n: "03",
    title: "Παράδοση & υποστήριξη",
    /* The solo-operator objection (§11.6, §12) answered in structure, before
       the FAQ answers it in words. Note "άλλος developer" — another one, an
       outsider. §2.1's guardrail is plural voice, singular facts, so the copy
       never implies staff; the repo-wide sweep for staff language has to stay
       clean in comments too, or it stops being a useful sweep. */
    body: "Ο κώδικας και το repository είναι δικά σας. Η εγκατάσταση είναι τεκμηριωμένη, ώστε να μπορεί να τη συνεχίσει άλλος developer χωρίς εμάς. Μηνιαία υποστήριξη μόνο αν τη θέλετε.",
  },
] as const;

export default function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="process-heading"
          eyebrow="[ 02 // ΔΙΑΔΙΚΑΣΙΑ ]"
          title="Τι γίνεται μόλις επικοινωνήσετε."
          lede="Τρία βήματα. Σε κάθε ένα ξέρετε τι παίρνετε και πότε — πριν ξεκινήσει οτιδήποτε."
        />

        <ol className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {STEPS.map((step) => (
            <Card as="li" key={step.n} className="flex flex-col p-6">
              {/* The number is decorative sequencing — the `<ol>` already
                  tells assistive tech this is step N of three. */}
              <span
                aria-hidden
                className="font-mono text-mono-xs tabular-nums text-ink-ghost"
              >
                {step.n}
              </span>

              <h3 className="mt-3 text-lg font-semibold leading-snug text-zinc-100">
                {step.title}
              </h3>

              {/* max-w-prose keeps the line near 65–75 characters at the
                  single-column width, where the card is widest. */}
              <p className="mt-3 max-w-prose text-sm leading-relaxed text-zinc-400">
                {step.body}
              </p>
            </Card>
          ))}
        </ol>
      </div>
    </section>
  );
}
