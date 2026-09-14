import { SCHEMA_ID, serializeJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/seo";
import { SITE } from "@/lib/site";

/**
 * A `Service` node for a service pillar page.
 *
 * **`provider` is a reference, not a copy.** It points at the
 * `ProfessionalService` node `JsonLd.tsx` already publishes as
 * `${SITE.url}/#business`, so the name, address, phone, hours and `sameAs`
 * are asserted once for the whole site. Redeclaring the business per page is
 * how structured data ends up contradicting itself — and search engines
 * cross-check NAP, which is the reason `lib/site.ts` exists in the first
 * place.
 *
 * **Nothing here is asserted that the page does not show.** No `offers` and
 * no price: §2.2 puts the pricing *model* on the page and never a figure, and
 * a `priceRange` on a service node is a number that has to survive a sales
 * call. No `aggregateRating` either — there are no reviews on the site yet
 * (Phase 5), and a rating in the markup that a visitor cannot see is the
 * exact mismatch that earns a manual action.
 *
 * Both pillars render this; only the strings differ.
 */
export default function ServiceJsonLd({
  path,
  name,
  serviceType,
  description,
}: {
  /** The page's own path, for the node's `@id` and `url`. */
  path: string;
  /** What the service is called, in Greek, as the page calls it. */
  name: string;
  /** The English category term search engines index against. */
  serviceType: string;
  /** One sentence. Should match the page's own description. */
  description: string;
}) {
  const url = absoluteUrl(path);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    serviceType,
    description,
    url,
    inLanguage: "el",

    provider: { "@id": SCHEMA_ID.business },

    /* Physically in Thessaloniki, contracted nationally and remotely — the
       same two entries the business node carries, because a service cannot
       be available somewhere its provider is not. */
    areaServed: [
      { "@type": "City", name: "Thessaloniki" },
      { "@type": "Country", name: SITE.country },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
