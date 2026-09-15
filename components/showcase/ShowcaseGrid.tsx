import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import ScrollLink from "@/components/ui/ScrollLink";
import SectionHeader from "@/components/ui/SectionHeader";
import { SHOWCASE } from "@/lib/showcase";

/**
 * The indicative architectures — the **highlight**, one line each.
 *
 * This section used to be the largest thing on the homepage: three cards
 * carrying a problem paragraph, a solution paragraph, three metrics and a
 * disclosure holding a terminal trace, measuring **3.4 phone screens**. On a
 * page whose job is conversion that is a lot of room for systems that have
 * not been built for anyone — while the proof strip, the only credibility on
 * the page, was the smallest section at 0.6.
 *
 * S4.1 applies §2.3 here, which had never been applied to this section: the
 * homepage carries the highlight, the deeper page carries the body. The full
 * problem/solution/architecture now renders on `/websites` and `/automations`
 * from the same `SHOWCASE` constant, so the two cannot drift.
 *
 * **Now a Server Component.** The disclosure state was the only reason
 * `ShowcaseCard` needed the client, and nothing here holds state any more.
 * The card still exists and is still used — on the service pages.
 *
 * **«Ενδεικτικά» stays, and stays prominent.** §8.2 requires the label for
 * architectures describing capability rather than delivered work. What moved
 * is where it sits: the heading is now a sentence an owner would say (§11.7)
 * and the qualifier carries in the eyebrow and the lede, which is where a
 * reader actually takes it in.
 */
export default function ShowcaseGrid() {
  return (
    <section
      id="solutions"
      aria-labelledby="solutions-heading"
      className="scroll-mt-24 py-14 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="solutions-heading"
          eyebrow="[ 03 // ΕΝΔΕΙΚΤΙΚΑ ΣΥΣΤΗΜΑΤΑ ]"
          title="Τι μπορεί να αναλάβει ένα σύστημα για εσάς."
          lede="Ενδεικτικά — περιγράφουν συστήματα που κατασκευάζουμε, όχι δημοσιευμένα έργα πελατών."
        />

        <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {SHOWCASE.map((item) => (
            <Card as="li" key={item.id} interactive className="p-6">
              <h3 className="text-base font-semibold leading-snug text-white">
                {item.title}
              </h3>

              {/* The outcome, in the owner's terms. §11.4 — outcome before
                  mechanism, and the mechanism is one click away. */}
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {item.oneLiner}
              </p>

              <ArrowLink
                href={`/${item.pillar}#architectures`}
                className="mt-5"
              >
                Πώς δουλεύει
              </ArrowLink>
            </Card>
          ))}
        </ul>

        {/* The one mid-page CTA that exists today. It stays, and it matters
            more now than it did: this section sits high on the page, so this
            is the first chance to act after the hero. */}
        <Card
          tone="glass"
          className="mt-10 flex flex-col items-start justify-between gap-5 px-6 py-6 sm:flex-row sm:items-center"
        >
          <p className="text-sm text-ink-muted">
            Θέλετε κάτι φτιαγμένο για τη δική σας δουλειά;
          </p>

          <ScrollLink
            to="audit"
            className="btn-primary min-h-tap shrink-0 px-5 py-3 text-sm"
          >
            Κλείστε ένα 15λεπτο audit
          </ScrollLink>
        </Card>

        <ArrowLink href="/work" className="mt-8">
          Δείτε τα ονομαστικά έργα
        </ArrowLink>
      </div>
    </section>
  );
}
