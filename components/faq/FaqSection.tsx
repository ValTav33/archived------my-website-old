import ArrowLink from "@/components/ui/ArrowLink";
import SectionHeader from "@/components/ui/SectionHeader";
import FaqList from "@/components/faq/FaqList";
import { HOMEPAGE_FAQ, FAQ } from "@/lib/faq";

/**
 * The objections, answered on the page — the **highlight**.
 *
 * S2.8 cut this to `HOMEPAGE_FAQ`, the first four, with the rest on `/faq`.
 * §2.3 says the homepage carries highlights, and continuity stays first here
 * as it does there because §12 names it the objection that kills deals
 * silently.
 *
 * **No `FAQPage` JSON-LD here, and that is now load-bearing rather than
 * pending.** The schema ships on `/faq`, which renders all six. Marking up
 * six answers on a page that shows four is precisely the visible/asserted
 * mismatch search engines penalise, and Phase 1's exit gate verified this
 * page carries no such node — keep it that way.
 *
 * A server component since S2.8: the disclosure state moved into `FaqList`.
 */
export default function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 pb-14 sm:pb-28 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="faq-heading"
          eyebrow="[ 06 // ΕΡΩΤΗΣΕΙΣ ]"
          title="Αυτά που ρωτούν όλοι, πριν το ρωτήσετε."
        />

        <FaqList entries={HOMEPAGE_FAQ} className="mt-10" />

        <ArrowLink href="/faq" className="mt-8">
          {`Όλες οι ερωτήσεις (${FAQ.length})`}
        </ArrowLink>
      </div>
    </section>
  );
}
