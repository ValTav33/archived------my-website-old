import { SCHEMA_ID, serializeJsonLd } from "@/lib/jsonld";
import { SAME_AS, SERVICE_CATALOG, SITE } from "@/lib/site";

/**
 * The site-wide schema **graph**: the business, and the website itself.
 *
 * S2.11 turned this from a lone `ProfessionalService` into an `@graph`. The
 * `@id` on the business node has existed since Phase 0 with a comment saying
 * future entries would reference it rather than redeclare it, and by now four
 * do — `Service` on both pillars, `Person` on `/about`, and this `WebSite`.
 * The name, address, phone, hours, `sameAs` and offer catalog are therefore
 * asserted **exactly once for the whole site**, which matters because search
 * engines cross-check NAP and a second, drifted copy is a genuine local-SEO
 * liability.
 *
 * **No `SearchAction`.** There is no site search, and a `potentialAction`
 * pointing at a search box that does not exist is the same class of claim as
 * a placeholder — it just happens to be invisible to everyone except a
 * crawler.
 *
 * Server component: this renders once into the HTML document and ships no
 * client JavaScript.
 */
export default function JsonLd() {
  const business = {
    "@type": "ProfessionalService",
    /* Stable node id so future graph entries (WebSite, Person, Article) can
       reference this business instead of redeclaring it. S2.3 is the first
       one to do it: `ServiceJsonLd` points its `provider` here. */
    "@id": SCHEMA_ID.business,
    name: SITE.legalName,
    alternateName: SITE.siteName,
    url: SITE.url,
    telephone: SITE.phoneTel,
    email: SITE.email,
    priceRange: "$$",
    inLanguage: "el",

    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.locality,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },

    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },

    /* Physically in Thessaloniki, contracted nationally and remotely. */
    areaServed: [
      { "@type": "City", name: "Thessaloniki" },
      { "@type": "Country", name: SITE.country },
    ],
    serviceType: "Remote / Worldwide",

    /* One specification per trading window. A single 10:00-21:00 entry would
       tell search engines we are open through the afternoon, which is the
       kind of quiet inaccuracy that sends someone to a phone that nobody
       answers. */
    openingHours: SITE.openingHoursSchema,
    openingHoursSpecification: SITE.hours.map((window) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: window.opens,
      closes: window.closes,
    })),

    /* Social profiles that identify the same business. */
    sameAs: SAME_AS,

    knowsAbout: SERVICE_CATALOG,

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development & AI Automation Services",
      itemListElement: SERVICE_CATALOG.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service },
      })),
    },
  };

  /* The site as a thing, distinct from the business that publishes it. Kept
     minimal on purpose: a `WebSite` node's job is to tie the pages to a
     publisher and declare the language, and every extra property is another
     assertion to keep true. */
  const website = {
    "@type": "WebSite",
    "@id": SCHEMA_ID.website,
    url: SITE.url,
    name: SITE.siteName,
    inLanguage: "el",
    publisher: { "@id": SCHEMA_ID.business },
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [business, website],
  };

  /* Escaping rules moved to `lib/jsonld.ts` in S2.3, when a second emitter
     appeared and §10.5 stopped allowing the copy. */
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
    />
  );
}
