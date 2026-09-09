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
      aria-label="Τεχνολογίες"
      className="border-y border-white/[0.07] py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-ink-faint">
          Η υποδομή πάνω στην οποία χτίζουμε
        </p>

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
            <li
              key={tech}
              className="shrink-0 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1 font-mono text-xs text-zinc-400 transition-colors duration-200 hover:border-white/[0.15] hover:text-zinc-200"
            >
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
