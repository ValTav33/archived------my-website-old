import ServiceCta from "@/components/services/ServiceCta";
import ServiceSection from "@/components/services/ServiceSection";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { DETAIL_LABELS, PROCESS } from "@/lib/process";
import { routeMetadata } from "@/lib/seo";
import { TIMELINE_RANGE } from "@/lib/site";

export const metadata = routeMetadata("/process");

/**
 * `/process` — the three steps, expanded.
 *
 * Reads `PROCESS` from `lib/process.ts`, which the homepage section also
 * reads. The two render **disjoint halves** of each step: the homepage takes
 * `summary`, this page takes `detail`. Nothing here restates a sentence from
 * there, which is D1's rule and the reason the extraction was worth doing
 * rather than copying three cards onto a second URL.
 *
 * The fourth detail field is the one this page exists for. Every process
 * section anywhere says what the agency does; almost none say what the client
 * has to spend, which is the thing a prospect is actually trying to work out.
 */
export default function ProcessPage() {
  return (
    <PageShell>
      <SectionHeader
        titleAs="h1"
        eyebrow="[ // ΔΙΑΔΙΚΑΣΙΑ ]"
        title="Πώς δουλεύουμε, από την πρώτη κλήση μέχρι την παράδοση."
        lede={`Τρία βήματα. Σε κάθε ένα ξέρετε τι γίνεται, τι χρειάζεται από εσάς, τι παίρνετε στο τέλος του, και πόσο από τον χρόνο σας κοστίζει. Ο συνολικός χρόνος είναι ${TIMELINE_RANGE} — όχι υπόσχεση ημερομηνίας.`}
      />

      {PROCESS.map((step) => (
        <ServiceSection
          key={step.n}
          id={`step-${step.n}`}
          eyebrow={`[ ${step.n} // ΒΗΜΑ ]`}
          title={step.title}
        >
          {/* A definition list: four labelled facts about one step, which is
              what a `dl` is for. Two columns from `sm` up so the pairs read
              as pairs rather than as a long ladder. */}
          <Card className="mt-8 p-6">
            <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {DETAIL_LABELS.map(({ key, label }) => (
                <div key={key}>
                  <Eyebrow as="dt" variant="label">
                    {label}
                  </Eyebrow>
                  <dd className="mt-2.5 text-sm leading-relaxed text-zinc-400">
                    {step.detail[key]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </ServiceSection>
      ))}

      <ServiceCta id="cta" title="Ξεκινάμε από το πρώτο βήμα." />
    </PageShell>
  );
}
