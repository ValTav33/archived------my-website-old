import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCtaBar from "@/components/conversion/MobileCtaBar";
import JsonLd from "@/components/seo/JsonLd";
import { IS_INDEXABLE } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { OBSIDIAN_950 } from "@/lib/tokens";
import "./globals.css";

/* Variable Inter for UI copy; JetBrains Mono for terminal/telemetry surfaces. */
const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "greek"],
  variable: "--font-mono",
  display: "swap",
});

/**
 * Site-wide metadata only.
 *
 * Everything that identifies a *page* — title, description, canonical,
 * `og:url` — now comes from `lib/seo.ts`, because Next merges this object
 * into every route below it. The homepage's own title and description moved
 * into the route manifest; `alternates` and `openGraph.url` are gone entirely
 * rather than moved, since an inherited canonical is worse than a missing one.
 * The reasoning, and the measurement behind it, is in `lib/seo.ts`.
 */
export const metadata: Metadata = {
  /* Resolves every relative OG/canonical URL below against the real origin.
     Without it Next emits a build warning and relative OG images break. */
  metadataBase: new URL(SITE.url),

  title: {
    /* Deliberately generic, and deliberately **not** the homepage's title.
       Next's types require a `default` alongside a `template`, so this value
       is what a route that forgets its own metadata would render. Making it
       the homepage's keyword title would mean a forgotten page quietly
       impersonates the homepage; making it the brand line means it is merely
       generic, visibly identical across any offenders, and caught by the
       phase's title-uniqueness check. */
    default: `${SITE.brand} — Κατασκευή ιστοσελίδων & αυτοματισμοί AI`,
    template: "%s | Web Development & AI Automations",
  },

  keywords: [
    "Κατασκευή ιστοσελίδων Θεσσαλονίκη",
    "Web development Θεσσαλονίκη",
    "Custom web εφαρμογές",
    "Αυτοματισμοί AI επιχειρήσεων",
    "AI Customer Support Greece",
  ],

  authors: [{ name: SITE.siteName, url: SITE.url }],
  creator: SITE.siteName,
  publisher: SITE.siteName,

  /* Preview deployments must not be indexed. Vercel Authentication has kept
     them private so far, but the moment it is lifted so that Lighthouse can
     reach a preview, an unconditional `index, follow` turns every preview
     into a crawlable duplicate of the production site — and PROGRESS.md
     already records one stale deployment serving placeholder copy while
     marked indexable. `IS_INDEXABLE` stays true locally on purpose; see
     `lib/seo.ts`. */
  robots: IS_INDEXABLE
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },

  /* No `openGraph` and no `twitter` block here on purpose. Next replaces
     these keys rather than deep-merging them, so a layout-level `og:type` and
     `og:site_name` are silently erased by any page that sets `og:url` — which
     every page in this phase does. `lib/seo.ts` returns both blocks whole and
     is the only writer. */

  category: "technology",
};

export const viewport: Viewport = {
  /* Same literal Tailwind paints the page with, so the mobile browser chrome
     can never show a seam against the top of the page. */
  themeColor: OBSIDIAN_950,
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="el" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="surface-obsidian min-h-dvh font-sans antialiased">
        {/* First stop in the tab order: lets a keyboard user jump the fixed
            header and the whole hero instead of tabbing through them on every
            page load. Invisible until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:min-h-tap focus:items-center focus:rounded-lg focus:border focus:border-hairline-strong focus:bg-obsidian-750 focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
        >
          Μετάβαση στο περιεχόμενο
        </a>

        {/* The chrome lives here rather than in `app/page.tsx`, which owned it
            while the site was a single URL. Ten routes arrive in this phase
            and every one of them needs a header, a footer and a landmark for
            the skip link to target — repeated eleven times, or declared once.
            `#main-content` moving up here is what makes the skip link work on
            every route instead of only the homepage.

            `tabIndex={-1}` so the skip link's target actually receives focus
            rather than only scrolling into view. */}
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />

        {/* S4.3. Phones only, and it lives in the layout rather than on the
            homepage because every route should offer a way to act — the
            homepage is simply where the gap was measured at ~9,000px. It
            suppresses itself on `/contact` and while the audit form is on
            screen. */}
        <MobileCtaBar />

        <JsonLd />

        {/* Vercel Analytics — §2.5, and D4 in the Phase 3 spec, approved by
            Val. Cookieless and identifying no visitor, which is why
            `/privacy` can name it and still say there is no consent banner
            and nothing stored in the browser.

            Deliberately bare. No custom events, no goals, no second provider:
            the cadence in §13 asks for the top entry page once a week, and
            that is what this answers. Anything more is a tracking decision,
            and tracking decisions are Val's.

            **It reports nothing locally.** The component injects a script from
            `/_vercel/insights/script.js`, a path only the platform serves, so
            a local `next start` gets a 404 for it and no data goes anywhere.
            That matters for measurement, not for behaviour — see the
            Lighthouse numbers recorded for S3.7. */}
        <Analytics />
      </body>
    </html>
  );
}
