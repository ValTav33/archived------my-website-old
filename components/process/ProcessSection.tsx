import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { PROCESS } from "@/lib/process";

/**
 * How the engagement runs — the **highlight**, one sentence per step.
 *
 * S2.6 moved the steps into `lib/process.ts` and the long bodies to
 * `/process`. This section now renders each step's `summary` and links out,
 * because §2.3 says the homepage carries highlights and every section has a
 * deeper page. Phase 1 built it at full length only because there was nowhere
 * else to put it.
 *
 * The two halves are disjoint by design: `summary` here, `detail` there, and
 * no sentence appears on both. A prospect who does not know what happens
 * after they click still cannot judge the risk of clicking, so the three
 * titles and one line each stay above the fold of the argument — what is
 * gone is the paragraph, not the answer.
 *
 * Step 01's summary interpolates `AUDIT_DELIVERABLE` and step 02's
 * `TIMELINE_RANGE`, so the audit description still matches the form's promise
 * character for character, which was S1.7's exit condition.
 *
 * No icons. Playbook §2.4 asks for simple over dense, and the step number
 * plus the title already carry the sequence.
 *
 * Cards in an ordered list, not a connector diagram: §2.4 caps terminal
 * surfaces at two per viewport and the showcase's architecture traces sit
 * directly above this section.
 */
export default function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="scroll-mt-24 py-14 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="process-heading"
          eyebrow="[ 04 // ΔΙΑΔΙΚΑΣΙΑ ]"
          title="Τι γίνεται μόλις επικοινωνήσετε."
          lede="Τρία βήματα. Σε κάθε ένα ξέρετε τι παίρνετε και πότε — πριν ξεκινήσει οτιδήποτε."
        />

        <ol className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PROCESS.map((step) => (
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
                {step.summary}
              </p>
            </Card>
          ))}
        </ol>

        {/* What each step needs from the visitor, and what it costs them in
            their own hours, is the half that lives on `/process`. */}
        <ArrowLink href="/process" className="mt-8">
          Πώς δουλεύουμε, αναλυτικά
        </ArrowLink>
      </div>
    </section>
  );
}
