import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import Reveal from "@/components/ui/Reveal";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * The two things we sell, on the homepage, in two lines each.
 *
 * **New in S4.1, and it closes a real gap.** Until now a visitor could read
 * the whole landing page without ever meeting a plain statement of the two
 * offers: the hero implied them, the showcase hinted at them through category
 * badges, and the only sentence that actually said them out loud was the
 * second paragraph of the About section — three quarters of the way down.
 *
 * That sentence is the source of these two, and it has been **removed from
 * `AboutSection` in the same commit** rather than copied. D1's rule cuts both
 * ways: no claim renders twice on the same page.
 *
 * Outcome first, mechanism nowhere (§11.4), no technology names (§2.2), and
 * each block is a door to the page that carries the detail (§2.3).
 */
const PILLARS = [
  {
    href: "/websites",
    title: "Ιστοσελίδες & web εφαρμογές",
    body: "Φτιαγμένες από την αρχή για τη δική σας δουλειά — χωρίς έτοιμα πρότυπα και χωρίς πρόσθετα που σπάνε.",
    cta: "Τι παραδίδεται",
  },
  {
    href: "/automations",
    title: "Αυτοματισμοί",
    body: "Αναλαμβάνουν τη δουλειά ρουτίνας που σήμερα γίνεται με το χέρι και τρώει τις ώρες σας.",
    cta: "Τι αυτοματοποιείται",
  },
] as const;

export default function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-24 pt-14 sm:pt-28 lg:pt-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="services-heading"
          eyebrow="ΤΙ ΚΑΝΟΥΜΕ"
          title="Δύο πράγματα, και τα δύο φτιαγμένα για εσάς."
        />

        <Reveal>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {PILLARS.map((pillar) => (
              <Card as="li" key={pillar.href} interactive className="p-6 sm:p-8">
                <h3 className="text-xl font-semibold leading-snug text-white">
                  {pillar.title}
                </h3>

                <p className="mt-3 max-w-prose text-base leading-relaxed text-ink-muted">
                  {pillar.body}
                </p>

                <ArrowLink href={pillar.href} className="mt-6">
                  {pillar.cta}
                </ArrowLink>
              </Card>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
