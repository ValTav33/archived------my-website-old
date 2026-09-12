import type { Metadata } from "next";
import { getRoute, type RoutePath } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * Per-page metadata, and the one rule that makes a multipage site safe to
 * build: **a page declares its own canonical, or it has none at all.**
 *
 * Next merges metadata from the root layout down into every page, and the
 * layout used to declare `alternates.canonical` and `openGraph.url` as
 * `SITE.url`. That was harmless while the site was one page and silently
 * wrong the moment it was not. Measured rather than assumed, on a throwaway
 * route with no `metadata` export of its own:
 *
 *     rel="canonical" href="http://localhost:3000"
 *     property="og:url" content="http://localhost:3000"
 *     <title>Web Development &amp; AI Automations Θεσσαλονίκη | …</title>
 *
 * All three inherited. Eleven routes would have shipped telling search
 * engines they are the homepage, with nothing on screen to give it away.
 *
 * So the layout no longer declares `alternates`, `openGraph.url`,
 * `openGraph.title`, `openGraph.description` or a `description` at all, and
 * this module is the only thing that writes them. A page that forgets to call
 * it renders with no canonical and no description — which Lighthouse fails
 * loudly on the next run. Absent is loud; inherited-and-wrong is silent.
 */

/**
 * Whether this deployment should be indexed.
 *
 * `VERCEL_ENV` is `"production"`, `"preview"` or `"development"` on Vercel and
 * **undefined everywhere else**, and the undefined case has to stay indexable
 * on purpose: Lighthouse's SEO category fails a page that is blocked from
 * indexing, and every Lighthouse run this project has managed so far was
 * against a local `next start` because preview deployments sit behind Vercel
 * Authentication. A `noindex` that triggered locally would turn the phase's
 * own SEO gate red.
 *
 * So this is an explicit deny-list of the two non-production Vercel
 * environments, not a production allow-list.
 */
export const IS_INDEXABLE =
  process.env.VERCEL_ENV !== "preview" &&
  process.env.VERCEL_ENV !== "development";

/**
 * Absolute URL for a path.
 *
 * Built by hand rather than handed to `metadataBase` resolution so the
 * homepage keeps the exact string it has shipped since Phase 0: `SITE.url`
 * with **no** trailing slash. `new URL("/", origin)` normalises to a trailing
 * slash, which would change a live canonical for no reason.
 */
export function absoluteUrl(path: string): string {
  return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export type PageSeo = {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
};

/**
 * Builds a page's `Metadata`. Takes the path as a required argument, so the
 * canonical cannot be omitted by forgetting an optional field.
 *
 * **`openGraph` and `twitter` are returned whole, including the site-wide
 * fields.** They have to be, and this cost a regression to learn: Next merges
 * metadata per top-level key and *replaces* the value rather than deep-merging
 * it. A page returning `openGraph: { url, title, description }` over a layout
 * declaring `openGraph: { type, locale, siteName }` does not get six fields —
 * it gets three, and `og:type`, `og:locale` and `og:site_name` vanish from the
 * document. `twitter` behaves the same way: dropping `card` does not inherit
 * `summary_large_image`, it falls back to `summary`, so the share card
 * silently becomes a thumbnail.
 *
 * Both blocks therefore live here and nowhere else. The root layout declares
 * neither, so there is no second writer for a page to shadow.
 *
 * The titles are also passed explicitly rather than left to fall back to
 * `title`, so what a crawler reads does not depend on Next's fallback order
 * changing between minor versions.
 */
export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle,
}: PageSeo): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },

    openGraph: {
      type: "website",
      locale: "el_GR",
      siteName: SITE.siteName,
      url,
      title,
      description,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/** `pageMetadata` for a route in the manifest. The usual form. */
export function routeMetadata(path: RoutePath): Metadata {
  return pageMetadata(getRoute(path));
}
