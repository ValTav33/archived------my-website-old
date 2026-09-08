import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/hero/HeroSection";
import TechStackStrip from "@/components/showcase/TechStackStrip";
import ShowcaseGrid from "@/components/showcase/ShowcaseGrid";
import ConversionSection from "@/components/conversion/ConversionSection";
import Footer from "@/components/layout/Footer";

/* Placeholder anchors so every navbar link has a real scroll target while the
   remaining sections are still being built. `solutions` and `audit` are absent
   on purpose — ShowcaseGrid and ConversionSection own those ids, and a
   duplicate would break anchor navigation. */
const PLACEHOLDER_SECTIONS = [
  { id: "services", label: "Υπηρεσίες" },
  { id: "work", label: "Έργα" },
  { id: "process", label: "Διαδικασία" },
] as const;

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <HeroSection />
        <TechStackStrip />
        <ShowcaseGrid />
        <ConversionSection />

        {/* Thin stubs — present only to verify anchor navigation. */}
        {PLACEHOLDER_SECTIONS.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mx-auto max-w-7xl scroll-mt-24 border-t border-white/[0.07] px-5 py-20 sm:px-8"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-ghost">
              #{section.id}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
              {section.label}
            </h2>
            <p className="mt-3 max-w-xl text-[15px] text-zinc-400">
              Placeholder ενότητα — το περιεχόμενο προστίθεται στο επόμενο
              build.
            </p>
          </section>
        ))}
      </main>

      <Footer />
    </>
  );
}
