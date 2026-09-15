import { notFound } from "next/navigation";
import ServiceCta from "@/components/services/ServiceCta";
import ServiceSection from "@/components/services/ServiceSection";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { pageMetadata } from "@/lib/seo";
import { STUDIED_PROOF, getProofBySlug } from "@/lib/site";
import { greekUpper } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

/**
 * **Only studied entries get a page.** An entry in `PROOF` without a `study`
 * is not a route at all, so `/work/roz-inn` is a genuine 404 rather than a
 * page apologising for being empty. §8.5 as routing.
 */
export function generateStaticParams() {
  return STUDIED_PROOF.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const item = getProofBySlug(slug);

  /* Unstudied and unknown slugs both fall through to `notFound` in the page
     below; metadata for them is never rendered, so an empty object is the
     honest return rather than an invented title. */
  if (!item?.study) return {};

  return pageMetadata({
    path: `/work/${item.slug}`,
    title: `${item.name} — ${item.kind}`,
    description: item.summary,
  });
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const item = getProofBySlug(slug);

  /* Both branches: a slug nobody has heard of, and a real entry that has no
     study to show. The second is the one worth being strict about — serving
     a near-empty page for it would be the thin-content problem this rule
     exists to avoid. */
  if (!item?.study) notFound();

  const { study } = item;

  return (
    <PageShell>
      <Breadcrumbs
        items={[
          { name: "Αρχική", path: "/" },
          { name: "Έργα", path: "/work" },
          { name: item.name, path: `/work/${item.slug}` },
        ]}
      />

      <SectionHeader
        titleAs="h1"
        eyebrow={`[ // ${greekUpper(item.kind)} ]`}
        title={item.name}
        lede={item.summary}
        className="mt-8"
      />

      <ServiceSection
        id="problem"
        eyebrow="ΤΟ ΖΗΤΟΥΜΕΝΟ"
        title="Τι χρειαζόταν."
        lede={study.problem}
      />

      <ServiceSection
        id="built"
        eyebrow="ΤΙ ΚΑΤΑΣΚΕΥΑΣΤΗΚΕ"
        title="Τι κάνει η ροή, με τη σειρά."
      >
        {/* An ordered list because the order is the system: each step consumes
            what the previous one produced. A bulleted list would lose that. */}
        <ol className="mt-8 max-w-3xl space-y-3">
          {study.built.map((step, index) => (
            <li
              key={step}
              className="flex items-baseline gap-3.5 text-sm leading-relaxed text-zinc-400"
            >
              <span
                aria-hidden
                className="shrink-0 font-mono text-mono-xs text-ink-ghost tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </ServiceSection>

      <ServiceSection
        id="now"
        eyebrow="ΠΟΥ ΦΤΑΝΕΙ"
        title="Τι φτάνει στα χέρια του πελάτη."
        lede={study.now}
      >
      </ServiceSection>

      <ServiceCta id="cta" title="Θέλετε κάτι αντίστοιχο στη δική σας δουλειά;" />
    </PageShell>
  );
}
