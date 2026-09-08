import DirectContactCard from "@/components/conversion/DirectContactCard";
import AuditForm from "@/components/conversion/AuditForm";

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
      className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <DirectContactCard />
        </div>

        <div className="lg:col-span-7">
          <AuditForm />
        </div>
      </div>
    </section>
  );
}
