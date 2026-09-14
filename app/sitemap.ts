import type { MetadataRoute } from "next";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";
import { STUDIED_PROOF } from "@/lib/site";

/**
 * The sitemap, **generated — nothing hand-listed.**
 *
 * Two sources, and both are the same sources the pages themselves use: the
 * route manifest, and the `PROOF` entries that earn a case-study page. That
 * is the whole point of `lib/routes.ts`. A hand-maintained sitemap beside a
 * hand-maintained navigation beside a hand-maintained set of pages is three
 * lists of the same paths, and the one you forget is the one that never gets
 * crawled.
 *
 * Because `STUDIED_PROOF` is the same array `generateStaticParams` filters
 * on, a case study cannot appear here without having a page — the
 * thin-content rule from S2.5 carries through to the crawl budget for free.
 *
 * `lastModified` is the build time. That is honest for a statically generated
 * site where every page is rebuilt on every deploy, and it is the only value
 * available without a per-page content date that nothing currently tracks.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const pages = ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const caseStudies = STUDIED_PROOF.map((item) => ({
    url: absoluteUrl(`/work/${item.slug}`),
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...pages, ...caseStudies];
}
