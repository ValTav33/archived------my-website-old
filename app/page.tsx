import HeroSection from "@/components/hero/HeroSection";
import ProofStrip from "@/components/proof/ProofStrip";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ProcessSection from "@/components/process/ProcessSection";
import AboutSection from "@/components/about/AboutSection";
import FaqSection from "@/components/faq/FaqSection";
import ConversionSection from "@/components/conversion/ConversionSection";
import { routeMetadata } from "@/lib/seo";

/**
 * The homepage now declares its own title, description and canonical instead
 * of inheriting them from the root layout. The rendered values are unchanged
 * — verified by diffing the built `<head>` against the previous build — but
 * they are now stated by the page that means them rather than by a layout
 * that would have lent them to ten other routes.
 */
export const metadata = routeMetadata("/");

/**
 * Homepage.
 *
 * `Navbar`, `main` and `Footer` moved to `app/layout.tsx` in S2.1; this file
 * is the homepage's sections and nothing else.
 *
 * The page ends on `ConversionSection` and always will — Phase 1 inserted
 * Process, About and FAQ between the showcase and the conversion block, never
 * after it. A visitor who reaches the bottom of the page reaches the form.
 */
export default function Home() {
  return (
    <>
      <HeroSection />
      {/* Evidence before the spec sheet: a visitor who has not been given a
          reason to believe anything should meet the names first. */}
      <ProofStrip />
      <ShowcaseGrid />
      <ProcessSection />
      <AboutSection />
      <FaqSection />
      <ConversionSection />
    </>
  );
}
