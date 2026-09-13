import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { IS_INDEXABLE } from "@/lib/seo";

/**
 * `robots.txt`.
 *
 * `/api/` is disallowed because nothing under it is a page — the audit
 * endpoint answers `GET` with a correct 405 and there is nothing there to
 * index.
 *
 * **`/en` and `/blog` are not mentioned.** They arrive in Phases 6 and 7, and
 * a `Disallow` for a path that does not exist is a note to a future
 * maintainer disguised as a directive — the kind that gets left in place long
 * after it should have been removed and quietly blocks the thing it once
 * guarded.
 *
 * On a preview deployment this returns a blanket disallow to match the
 * `noindex` the pages carry (see `IS_INDEXABLE` in `lib/seo.ts`). Two signals
 * saying the same thing is the point: a preview that leaks into an index is
 * a duplicate of production competing with it.
 */
export default function robots(): MetadataRoute.Robots {
  if (!IS_INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
