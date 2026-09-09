import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import TechStackStrip from "@/components/showcase/TechStackStrip";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
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

      <main>
        <HeroSection />
        <TechStackStrip />
        <ShowcaseGrid />
        <ConversionSection />
      </main>

      <Footer />
    </>
  );
}
