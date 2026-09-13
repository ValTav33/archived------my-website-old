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
 * It is on `/faq` and nowhere else because that is the only page showing all
 * six. The homepage shows four; marking up six there would assert answers a
 * visitor cannot see, which is the mismatch this markup gets penalised for.
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
