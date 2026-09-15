import { ArrowUpRight } from "lucide-react";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { PROOF, TESTIMONIALS, type ProofItem } from "@/lib/site";

/**
 * Evidence, placed between the promise and everything that expands it.
 *
 * Before this the page made a claim in the hero and then asked for a lead,
 * with nothing in between — the structural finding from the S0.12 review, and
 * what the landing-pattern research calls Hero → Proof → Solution → CTA.
 *
 * Deliberately a band and not a section: a compact row of cards under the
 * hero, with a quiet label rather than a headline. The argument here is the
 * names, not the typography.
 *
 * **Nothing renders that is not real.** The testimonial slot is built and sits
 * empty until Phase 5 supplies an attributed quote; while `TESTIMONIALS` is
 * empty no card, skeleton or "coming soon" appears, and the grid closes up as
 * if the slot were never there.
 */
export default function ProofStrip() {
  const hasTestimonial = TESTIMONIALS.length > 0;
  const columns = PROOF.length + (hasTestimonial ? 1 : 0);

  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="scroll-mt-24 pb-16 sm:pb-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* An `h2` because the page's heading order runs h1 → h2 per section,
            but styled as a label: this band earns its place with the names in
            it, not with a headline competing against the hero above it. */}
        <Eyebrow as="h2" id="proof-heading" variant="label">
          Τι έχουμε παραδώσει
        </Eyebrow>

        <div
          className={
            columns >= 3
              ? "mt-5 grid gap-4 md:grid-cols-3"
              : "mt-5 grid gap-4 md:grid-cols-2"
          }
        >
          {PROOF.map((item) => (
            <ProofCard key={item.id} item={item} />
          ))}

          {hasTestimonial && (
            <Card className="flex flex-col justify-between p-5">
              <blockquote className="text-sm leading-relaxed text-zinc-300">
                {TESTIMONIALS[0].quote}
              </blockquote>
              <figcaption className="mt-4 text-sm text-ink-faint">
                — {TESTIMONIALS[0].attribution}
              </figcaption>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}

function ProofCard({ item }: { item: ProofItem }) {
  return (
    <Card className="flex flex-col p-5">
      {/* The name is the link when there is somewhere to go, and plain text
          when there is not. BTL's pipeline runs inside someone else's
          business; there is no URL to hand a visitor, and inventing one that
          goes nowhere would undo the point of the section. */}
      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group -my-2 inline-flex min-h-tap items-center gap-1.5 self-start py-2 text-base font-semibold text-white transition-colors duration-200 hover:text-zinc-300"
        >
          {item.name}
          <ArrowUpRight
            aria-hidden
            className="h-4 w-4 shrink-0 text-ink-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
          <span className="sr-only">(ανοίγει σε νέα καρτέλα)</span>
        </a>
      ) : (
        <p className="text-base font-semibold text-white">{item.name}</p>
      )}

      <p className="mt-1 text-sm text-ink-faint">{item.kind}</p>

      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
        {item.summary}
      </p>

    </Card>
  );
}
