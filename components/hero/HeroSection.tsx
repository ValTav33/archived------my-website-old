import { ArrowRight, Phone } from "lucide-react";
import Dust from "@/components/hero/Dust";
import PipelineSimulator from "@/components/hero/PipelineSimulator";
import Badge from "@/components/ui/Badge";
import ScrollLink from "@/components/ui/ScrollLink";
import StatusDot from "@/components/ui/StatusDot";
import { SITE } from "@/lib/site";

/* What the client walks away with, not what the build lacks. Each of these
   is demonstrable today — see playbook §11.5.

   The first point used to read «Ο κώδικας παραδίδεται δικός σας». S3.5 S2
   removed it under D2: it is not true of every package, and it sat in the
   hero of every visit. What replaces it is demonstrable in the same breath —
   process step 02 is literally "we agree the scope in writing first". */
const TRUST_POINTS = [
  "Γραπτό εύρος πριν την κατασκευή",
  "Ταχύτητα χωρίς βαριά πρόσθετα",
  "Απάντηση εντός 24 ωρών",
] as const;

/*
 * The hero entrance is deliberately CSS-driven (`animate-rise-in`) rather than
 * framer-motion. This block is the LCP element: a JS-driven entrance would
 * ship the headline at `opacity: 0` and leave it invisible until hydration
 * finishes — or permanently, if the bundle fails. A stylesheet animation
 * paints on first frame, needs no hydration, and the global
 * `prefers-reduced-motion` rule collapses it to its end state.
 *
 * Stagger is expressed as an animation-delay per element instead of a parent
 * orchestrator, so the column still assembles top-to-bottom.
 */
const RISE = "animate-rise-in";
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-14 pt-20 sm:pb-28 sm:pt-32 lg:pb-36 lg:pt-40"
    >
      {/* 32px engineering grid at 3% white, masked so it dissolves outward.
          This is the only background decoration — no glow blobs, no washes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-grid [mask-image:radial-gradient(65%_55%_at_50%_20%,black,transparent)]"
      />

      {/* Sparse, slow, hero only, `transform`/`opacity` only, gone entirely
          under reduced motion — playbook §2.4's particles row, which permits
          this on exactly those conditions and on holding the perf budget. */}
      <Dust />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Three grid children, and the order is the whole trick.

            On a phone this is one column, so they stack in source order:
            proposition, simulator, trust points. The simulator used to start
            at **777px on an 812px screen** — a 35px sliver of the only thing
            on this site that demonstrates rather than describes. Moving the
            trust list below it lifts it into view without an `order-*` class
            anywhere.

            At `lg` the twelve-column grid auto-places them back into the
            original layout: 7 + 5 on the first row, and the trust list
            returning to 7 on the second, directly under the actions. */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-16">
          {/* ================= Left: value proposition ================= */}
          {/* Centred on a phone, left-aligned from `lg`. D6, and the Apple
              measurement behind it: their headings are left-aligned 33 times
              and centred 7 — the big moments only, never the body. */}
          <div className="text-center lg:col-span-7 lg:text-left">
            {/* ---- Live availability pill ---- */}
            <div className={`${RISE} flex justify-center lg:justify-start`} style={delay(0)}>
              <Badge variant="status">
                {/* The single chromatic element in the layout: a live dot. */}
                <StatusDot />
                {SITE.availability}
                <span className="text-ink-ghost">•</span>
                <span className="text-ink-faint">Θεσσαλονίκη &amp; Remote</span>
              </Badge>
            </div>

            {/* ---- Headline: solid white, no gradient mask ---- */}
            <h1
              className={`${RISE} mt-7 text-[2.1rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.07]`}
              style={delay(80)}
            >
              Σύγχρονα Web Apps &amp; Αυτοματοποιημένα Συστήματα.
            </h1>

            {/* ---- Subheadline ---- */}
            <p
              className={`${RISE} mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg lg:mx-0`}
              style={delay(160)}
            >
              Φτιάχνουμε ιστοσελίδες και web εφαρμογές που φορτώνουν
              γρήγορα, και αναλαμβάνουμε με αυτοματισμούς τη δουλειά ρουτίνας
              που σήμερα τρώει τις ώρες σας.
            </p>

            {/* ---- Action group ---- */}
            <div
              className={`${RISE} mt-7 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start`}
              style={delay(240)}
            >
              {/* Primary: solid white, arrow revealed on hover. */}
              <ScrollLink
                to="audit"
                className="btn-primary group gap-1 px-6 py-3.5 text-sm"
              >
                Ζητήστε Δωρεάν Audit
                <span className="flex w-0 items-center overflow-hidden opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </span>
              </ScrollLink>

              {/* Secondary: matte glass card with the direct line + hours. */}
              <a
                href={`tel:${SITE.phoneTel}`}
                className="btn-secondary group gap-3 px-5 py-2.5 hover:border-hairline-strong"
              >
                <Phone
                  className="h-4 w-4 shrink-0 text-ink-faint transition-colors duration-200 group-hover:text-zinc-300"
                  strokeWidth={1.8}
                />
                <span className="flex flex-col text-left">
                  <span className="font-mono text-sm text-white tabular-nums">
                    Κλήση: {SITE.phoneDisplay}
                  </span>
                  <span className="text-sm text-ink-faint">
                    {SITE.hoursShort}
                  </span>
                </span>
              </a>
            </div>

          </div>

          {/* ================= Telemetry widget ================= */}
          {/* Second on a phone — directly under the actions — and the right
              rail from `lg`. */}
          <div className={`${RISE} lg:col-span-5`} style={delay(400)}>
            <PipelineSimulator />
          </div>

          {/* ================= Micro-trust footer ================= */}
          <div className="lg:col-span-7">
            <ul
              className={`${RISE} flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-ink-faint lg:justify-start`}
              style={delay(320)}
            >
              {TRUST_POINTS.map((point, index) => (
                <li key={point} className="flex items-center gap-3">
                  {point}
                  {index < TRUST_POINTS.length - 1 && (
                    <span aria-hidden className="text-decor">
                      •
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
