import DirectContactCard from "@/components/conversion/DirectContactCard";
import AuditForm from "@/components/conversion/AuditForm";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * The conversion block. Owns `id="audit"` — every CTA on the page (navbar,
 * hero, showcase banner) scrolls here, so this id must stay unique in the
 * document.
 *
 * `items-start` keeps the contact rail pinned to the top instead of being
 * vertically centred against the much taller form.
 */
export default function ConversionSection() {
  return (
    <section
      id="audit"
      aria-labelledby="audit-heading"
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {/* The section's own heading, moved here from `DirectContactCard`
              in S2.2. An h2 rather than an h3 because nothing above it in the
              section carries one, and it titles the section rather than the
              form beside it. `compact` because the grid has already narrowed
              this column. It lives here, not in the card, because `/contact`
              reuses that card under its own `h1` and this eyebrow's `05`
              belongs to the homepage's section numbering. */}
          <SectionHeader
            as="div"
            id="audit-heading"
            size="compact"
            eyebrow="[ 07 // ΑΜΕΣΗ ΕΠΙΚΟΙΝΩΝΙΑ ]"
            title="Ας συζητήσουμε την υποδομή της επιχείρησής σας."
            lede="Είτε θέλετε να ξαναφτιάξετε την ιστοσελίδα σας, είτε να σταματήσει η καθημερινή δουλειά ρουτίνας να γίνεται με το χέρι — ας το δούμε μαζί."
          />
          <DirectContactCard />
        </div>

        <div className="lg:col-span-7">
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
