import { serializeJsonLd } from "@/lib/jsonld";
import { FAQ } from "@/lib/faq";

/**
 * The `FAQPage` node. **Rendered only on `/faq`.**
 *
 * Built from the same `FAQ` array the visible answers render from, which is
 * the entire reason `lib/faq.ts` is data rather than markup — a payload and a
 * paragraph maintained separately is a mismatch search engines notice and
 * visitors do not, which is the worst combination.
 *
 * It is on `/faq` and nowhere else because that is the only page showing the
 * whole set. The homepage shows a prefix of it — three of five since S3.5 S4
 * — and marking up five there would assert answers a visitor cannot see,
 * which is the mismatch this markup gets penalised for.
 *
 * The counts are deliberately not hardcoded anywhere but this sentence: the
 * node maps over `FAQ`, so adding an entry updates the payload without
 * touching this file.
 */
export default function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
