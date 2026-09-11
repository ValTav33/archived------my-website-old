import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import JsonLd from "@/components/seo/JsonLd";
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

const DESCRIPTION =
  "Σχεδιασμός high-performance web εφαρμογών (Next.js) και αυτόνομα AI pipelines για επιχειρήσεις. Μειώστε τα χειροκίνητα tasks και αυτοματοποιήστε τις λειτουργίες σας.";

const DEFAULT_TITLE =
  "Web Development & AI Automations Θεσσαλονίκη | Custom Web Apps & Workflows";

export const metadata: Metadata = {
  /* Resolves every relative OG/canonical URL below against the real origin.
     Without it Next emits a build warning and relative OG images break. */
  metadataBase: new URL(SITE.url),

  title: {
    default: DEFAULT_TITLE,
    template: "%s | Web Development & AI Automations",
  },
  description: DESCRIPTION,

  keywords: [
    "Κατασκευή ιστοσελίδων Θεσσαλονίκη",
    "Web development Θεσσαλονίκη",
    "Custom web εφαρμογές",
    "Αυτοματισμοί AI επιχειρήσεων",
    "Next.js developer Greece",
    "AI Customer Support Greece",
    "n8n automations Greece",
  ],

  authors: [{ name: SITE.siteName, url: SITE.url }],
  creator: SITE.siteName,
  publisher: SITE.siteName,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: { canonical: SITE.url },

  openGraph: {
    type: "website",
    locale: "el_GR",
    siteName: SITE.siteName,
    url: SITE.url,
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
  },

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
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:border focus:border-white/[0.15] focus:bg-obsidian-750 focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
        >
          Μετάβαση στο περιεχόμενο
        </a>

        {children}
        <JsonLd />
      </body>
    </html>
  );
}
