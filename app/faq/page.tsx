import FaqList from "@/components/faq/FaqList";
import ServiceCta from "@/components/services/ServiceCta";
import FaqJsonLd from "@/components/seo/FaqJsonLd";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import { FAQ } from "@/lib/faq";
import { routeMetadata } from "@/lib/seo";

export const metadata = routeMetadata("/faq");

/**
 * `/faq` — all six objections, and the one page that carries `FAQPage`.
 *
 * The Phase 1 spec deferred that schema to "the `/faq` route that owns it",
 * and `lib/faq.ts` has said since S1.9 that Phase 2 would build both and that
 * both would read the array. This is that.
 *
 * Unlike `/process` and `/about`, this page and its homepage section render
 * the **same** sentences — the homepage simply shows four of the six. That is
 * not a D1 violation: D1 forbids a deeper page that copies a shallower one,
 * and an FAQ answer cannot be split into a highlight and an expansion without
 * becoming a worse answer in both places. The subset *is* the highlight, and
 * the canonical set lives here, which is why the schema is here too.
 */
export default function FaqPage() {
  return (
    <>
      <FaqJsonLd />

      <PageShell>
        <SectionHeader
          titleAs="h1"
          eyebrow="[ // ΕΡΩΤΗΣΕΙΣ ]"
          title="Αυτά που ρωτούν όλοι, πριν το ρωτήσετε."
          lede="Οι ερωτήσεις με τη σειρά που τις ακούμε. Η πρώτη είναι αυτή που δεν ρωτά κανείς δυνατά."
        />

        <FaqList entries={FAQ} headingLevel="h2" className="mt-12" />

        <ServiceCta id="cta" title="Έμεινε κάτι αναπάντητο;" />
      </PageShell>
    </>
  );
}
