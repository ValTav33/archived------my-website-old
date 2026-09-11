import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import ProofStrip from "@/components/proof/ProofStrip";
import TechStackStrip from "@/components/showcase/TechStackStrip";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ProcessSection from "@/components/process/ProcessSection";
import AboutSection from "@/components/about/AboutSection";
import FaqSection from "@/components/faq/FaqSection";
import ConversionSection from "@/components/conversion/ConversionSection";
import Footer from "@/components/layout/Footer";

/**
 * Homepage.
 *
 * The page ends on `ConversionSection` and always will — Phase 1 inserts
 * Process, About and FAQ between the showcase and the conversion block, never
 * after it. A visitor who reaches the bottom of the page reaches the form.
 */
export default function Home() {
  return (
    <>
      <Navbar />

      {/* `tabIndex={-1}` so the skip link's target actually receives focus
          rather than only scrolling into view. */}
      <main id="main-content" tabIndex={-1}>
        <HeroSection />
        {/* Evidence before the spec sheet: a visitor who has not been given a
            reason to believe anything should meet the names first. */}
        <ProofStrip />
        <TechStackStrip />
        <ShowcaseGrid />
        <ProcessSection />
        <AboutSection />
        <FaqSection />
        <ConversionSection />
      </main>

      <Footer />
    </>
  );
}
