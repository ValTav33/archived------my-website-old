import { SAME_AS, SERVICE_CATALOG, SITE } from "@/lib/site";

/**
 * Schema.org `ProfessionalService` payload for local + national visibility.
 *
 * Server component: this renders once into the HTML document and ships no
 * client JavaScript.
 */
export default function JsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    /* Stable node id so future graph entries (WebSite, Person, Article) can
       reference this business instead of redeclaring it. */
    "@id": `${SITE.url}/#business`,
    name: SITE.legalName,
    alternateName: SITE.siteName,
    url: SITE.url,
    telephone: SITE.phoneTel,
    email: SITE.email,
    priceRange: "$$",
    inLanguage: ["el", "en"],

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

    openingHours: SITE.openingHoursSchema,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],

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

  /*
   * Two escaping rules matter here:
   *
   * 1. The JSON must go in via `dangerouslySetInnerHTML`. Rendering it as a
   *    JSX child would HTML-escape the quotes into `&quot;`, which every
   *    JSON-LD parser rejects.
   * 2. Every `<` becomes the JSON escape sequence backslash-u003c, so a
   *    literal closing script tag inside any string can never terminate the
   *    element early. Still valid JSON, inert as markup.
   */
  const payload = JSON.stringify(schema).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}
