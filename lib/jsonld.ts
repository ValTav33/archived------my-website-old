import { SITE } from "@/lib/site";

/**
 * Stable `@id`s for the structured-data nodes.
 *
 * S2.11 joins every node into one `@graph`, and the only thing that makes that
 * possible is nodes referencing each other by id instead of redeclaring the
 * business on every page. `JsonLd.tsx` has exposed `#business` since Phase 0
 * with a comment saying exactly that; these are the rest.
 */
export const SCHEMA_ID = {
  business: `${SITE.url}/#business`,
  /* The one person behind the business. Declared on `/about`, which is the
     only page that shows him, and referenced from there by `worksFor`. */
  person: `${SITE.url}/#person`,
  /* The site itself, as distinct from the business publishing it. */
  website: `${SITE.url}/#website`,
} as const;

/**
 * Serialises a JSON-LD payload for `dangerouslySetInnerHTML`.
 *
 * Extracted in S2.3, when a second emitter appeared and §10.5 stopped
 * allowing the copy. Two escaping rules matter, and both are easy to get
 * wrong once each emitter owns its own version:
 *
 * 1. The JSON must go in through `dangerouslySetInnerHTML`. Rendered as a JSX
 *    child, React would HTML-escape the quotes into `&quot;`, which every
 *    JSON-LD parser rejects.
 * 2. Every `<` becomes the JSON escape sequence `<`, so a literal
 *    closing script tag inside any string can never terminate the element
 *    early. Still valid JSON, inert as markup.
 */
export function serializeJsonLd(schema: unknown): string {
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
