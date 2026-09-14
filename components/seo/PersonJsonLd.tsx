import { SCHEMA_ID, serializeJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/seo";
import { SAME_AS, SITE } from "@/lib/site";

/**
 * The `Person` node. Rendered only on `/about`, the one page that shows him.
 *
 * `lib/site.ts` has carried `SITE.person` since S1.8 with a comment saying
 * Phase 2's `/about` route and its `Person` schema would read it. This is
 * that.
 *
 * **Four properties, and the restraint is the point.** No `jobTitle`, because
 * the page does not give him one and the phase's exit gate says every string
 * in the structured data has to be visible on the page carrying it — a title
 * asserted only to search engines is a claim nobody on the site has made. No
 * `alumniOf`, no `award`, no `birthDate`, no `address`: the first two would be
 * invented, and the last two are personal data that a marketing page has no
 * business publishing about a private individual.
 *
 * `worksFor` is a reference to the business node rather than a copy of it, so
 * the name, address, phone and hours stay asserted exactly once for the whole
 * site. `sameAs` reuses the same profile list the business node uses —
 * `lib/site.ts` already excludes WhatsApp from it, because a `wa.me` deeplink
 * is a chat window, not a profile, and does not belong in an identity claim.
 */
export default function PersonJsonLd({ path }: { path: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": SCHEMA_ID.person,
    name: SITE.person,
    url: absoluteUrl(path),
    worksFor: { "@id": SCHEMA_ID.business },
    sameAs: SAME_AS,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
