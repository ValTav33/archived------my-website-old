import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { serializeJsonLd } from "@/lib/jsonld";
import { absoluteUrl } from "@/lib/seo";

export type Crumb = {
  name: string;
  /** Path from the origin. The last crumb is the current page. */
  path: string;
};

/**
 * The visible breadcrumb trail **and** its `BreadcrumbList` payload, from one
 * array.
 *
 * These are deliberately the same component. A `BreadcrumbList` is supposed
 * to describe a trail the page actually shows, and the phase's exit gate says
 * every string in the structured data has to be visible on the page carrying
 * it. Two components reading two arrays is how a schema ends up describing a
 * trail that was redesigned six months ago — so there is one array, rendered
 * twice, and disagreeing with itself is not expressible.
 *
 * The last crumb is the current page: rendered as plain text with
 * `aria-current`, not as a link to where the visitor already is.
 *
 * **The links carry `min-h-tap min-w-tap`, and that is not decoration.**
 * Measured at 375px, a bare monospace crumb is 43×16 and 29×16 — under the
 * playbook's 44×44 bar, which Phase 1 drove to zero exceptions across the
 * whole site. WCAG 2.2 does exempt links inside a sentence, and a breadcrumb
 * trail is arguably that; §6 makes 44 the project's own bar regardless, and
 * quietly spending Phase 1's result on a nav strip is not this slice's call
 * to make. The cost is a slightly airier trail, which is better under a
 * thumb anyway.
 */
export default function Breadcrumbs({ items }: { items: readonly Crumb[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };

  const last = items.length - 1;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}
      />

      <nav aria-label="Διαδρομή">
        <ol className="flex flex-wrap items-center font-mono text-mono-xs text-ink-faint">
          {items.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  aria-hidden
                  className="h-3 w-3 text-decor"
                  strokeWidth={2}
                />
              )}

              {index === last ? (
                <span
                  aria-current="page"
                  className="inline-flex min-h-tap items-center px-1.5 text-zinc-400"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="inline-flex min-h-tap min-w-tap items-center justify-center px-1.5 transition-colors duration-200 hover:text-white"
                >
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
