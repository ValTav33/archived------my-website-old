import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/* The infrastructure this studio actually builds on. Order is deliberate:
   framework -> language -> styling -> data -> orchestration -> voice -> transport. */
const STACK = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Supabase / PostgreSQL",
  "n8n Orchestration",
  "Voice AI / Vapi",
  "REST & Webhooks",
] as const;

/**
 * A quiet divider between the hero and the showcase. No card, no fill — just
 * two hairlines and a monospace line of capability, so it reads as a spec
 * sheet rather than a logo wall.
 */
export default function TechStackStrip() {
  return (
    <section
      id="tech"
      aria-labelledby="tech-heading"
      className="scroll-mt-24 border-y border-hairline py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* A real `h2`, not an `aria-label`. This was the only section whose
            name existed for assistive tech but not in the heading outline —
            a screen-reader user listing headings skipped straight from the
            proof strip to the showcase. The visible line was already the
            section's title; it just was not marked up as one. */}
        <h2
          id="tech-heading"
          className="text-center font-mono text-mono-xs font-normal uppercase tracking-widest text-ink-faint"
        >
          Η υποδομή πάνω στην οποία χτίζουμε
        </h2>

        {/*
          Mobile: a single horizontal scroll lane, bled to the screen edges so
          the row reads as continuous, with a mask fading the overflow.
          Desktop (md+): the mask and scrolling are dropped and the badges
          settle into one centred wrapped line.
        */}
        <ul
          className={cn(
            "scrollbar-slim mt-6 flex gap-2 overflow-x-auto pb-2",
            "-mx-5 px-5 [mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-1.25rem),transparent)]",
            "md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-0 md:[mask-image:none]",
          )}
        >
          {STACK.map((tech) => (
            <Badge
              as="li"
              key={tech}
              interactive
              className="shrink-0 text-zinc-400 hover:text-zinc-200"
            >
              {tech}
            </Badge>
          ))}
        </ul>
      </div>
    </section>
  );
}
