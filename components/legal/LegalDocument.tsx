import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";

export type LegalSection = {
  heading: string;
  /** Paragraphs, or a bulleted list when the item is a list of things. */
  body: readonly string[];
  list?: readonly string[];
};

/**
 * The shell both legal documents share.
 *
 * **Deliberately plain.** No cards, no eyebrows, no terminal texture, no
 * badges. These are documents someone reads because they need to, and a
 * privacy policy dressed as a product feature reads as though it is trying
 * to distract from its contents. A single column at a comfortable measure is
 * the whole design.
 *
 * `updated` is rendered because a legal document without a date is a document
 * nobody can tell is current. It is a literal per page rather than a build
 * timestamp: `new Date()` would advance the date on every deploy and claim
 * the text had been reviewed when it had not.
 */
export default function LegalDocument({
  title,
  lede,
  updated,
  sections,
}: {
  title: string;
  lede: string;
  updated: string;
  sections: readonly LegalSection[];
}) {
  return (
    <PageShell className="max-w-3xl">
      <SectionHeader titleAs="h1" eyebrow="[ // ΝΟΜΙΚΑ ]" title={title} lede={lede} />

      <p className="mt-6 font-mono text-mono-xs text-ink-faint">
        {`Τελευταία ενημέρωση: ${updated}`}
      </p>

      <div className="mt-12 space-y-10">
        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-white">
              {section.heading}
            </h2>

            <div className="mt-3 space-y-3">
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-sm leading-relaxed text-zinc-400"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {section.list && (
              <ul className="mt-3 space-y-2">
                {section.list.map((item) => (
                  <li
                    key={item}
                    className="flex items-baseline gap-3 text-sm leading-relaxed text-zinc-400"
                  >
                    <span aria-hidden className="shrink-0 text-decor">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
