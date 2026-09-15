import ServiceCta from "@/components/services/ServiceCta";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { routeMetadata } from "@/lib/seo";
import { PROOF } from "@/lib/site";

export const metadata = routeMetadata("/work");

/**
 * `/work` — the delivered work, with names.
 *
 * Every row comes from `PROOF` in `lib/site.ts`, which is where the two
 * cleared references have lived since Phase 1 with a comment saying this
 * index would read the array rather than fork its copy. This is that.
 *
 * **A row links to a case study only if it has one.** BTL has a `study` and
 * gets `/work/btl-industries`; `roz-inn` has a live URL instead, and the URL
 * is better evidence than an internal page repeating the same sentence. A row
 * with neither would link nowhere rather than to a page with nothing on it.
 *
 * The homepage's showcase carries the *indicative* architectures, which is a
 * different claim — capability, honestly labelled (§8.2). The lede points
 * there so a visitor who wants breadth is not left thinking two rows is the
 * whole of what we can build.
 */
export default function WorkPage() {
  return (
    <PageShell>
      <SectionHeader
        titleAs="h1"
        eyebrow="ΕΡΓΑ"
        title="Δουλειές που έχουν παραδοθεί, με ονόματα."
        lede="Ονομαστικά έργα, με τη συγκατάθεση του πελάτη. Για τα συστήματα που κατασκευάζουμε αλλά δεν έχουμε ακόμη δημοσιευμένο έργο, οι ενδεικτικές αρχιτεκτονικές είναι στην αρχική."
      />

      <ul className="mt-14 space-y-4">
        {PROOF.map((item) => (
          <Card as="li" key={item.id} className="p-6">
            <h2 className="text-lg font-semibold text-white">{item.name}</h2>
            <p className="mt-1.5 text-xs text-zinc-400">{item.kind}</p>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">
              {item.summary}
            </p>

            {/* Internal when there is a study to read, external when the live
                site is the evidence, absent when there is neither. */}
            {item.study ? (
              <ArrowLink href={`/work/${item.slug}`} className="mt-5">
                Δείτε τι κάνει
              </ArrowLink>
            ) : (
              item.href && (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-tap items-center text-sm text-zinc-300 transition-colors duration-200 hover:text-white"
                >
                  {`Ανοίξτε το ${item.name}`}
                </a>
              )
            )}
          </Card>
        ))}
      </ul>

      <ServiceCta id="cta" title="Πείτε μας τι θέλετε να φτιάξετε." />
    </PageShell>
  );
}
