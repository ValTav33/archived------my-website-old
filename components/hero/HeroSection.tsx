"use client";

import { ArrowRight, Phone } from "lucide-react";
import PipelineSimulator from "@/components/hero/PipelineSimulator";
import { SITE } from "@/lib/site";
import { scrollToId } from "@/lib/utils";

/* What the client walks away with, not what the build lacks. Each of these
   is demonstrable today — see playbook §11.5. */
const TRUST_POINTS = [
  "Ο κώδικας παραδίδεται δικός σας",
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
      className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32 lg:pb-36 lg:pt-40"
    >
      {/* 32px engineering grid at 3% white, masked so it dissolves outward.
          This is the only background decoration — no glow blobs, no washes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grid-faint bg-grid [mask-image:radial-gradient(65%_55%_at_50%_20%,black,transparent)]"
      />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16">
          {/* ================= Left: value proposition ================= */}
          <div className="lg:col-span-7">
            {/* ---- Live availability pill ---- */}
            <div className={RISE} style={delay(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-mono text-xs text-zinc-400">
                {/* The single chromatic element in the layout: a live dot. */}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-pulse-slow rounded-full bg-live" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
                </span>
                Διαθέσιμοι για νέα projects
                <span className="text-ink-ghost">•</span>
                <span className="text-ink-faint">Θεσσαλονίκη &amp; Remote</span>
              </span>
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
              className={`${RISE} mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg`}
              style={delay(160)}
            >
              Σχεδιάζουμε high-performance web συστήματα στο Next.js και
              στήνουμε αυτόνομα workflows που μειώνουν τα χειροκίνητα tasks και
              αυξάνουν τα έσοδά σας.
            </p>

            {/* ---- Action group ---- */}
            <div
              className={`${RISE} mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center`}
              style={delay(240)}
            >
              {/* Primary: solid white, arrow revealed on hover. */}
              <button
                type="button"
                onClick={() => scrollToId("audit")}
                className="btn-primary group gap-1 px-6 py-3.5 text-sm"
              >
                Ζητήστε Δωρεάν Audit
                <span className="flex w-0 items-center overflow-hidden opacity-0 transition-all duration-300 group-hover:w-5 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                </span>
              </button>

              {/* Secondary: matte glass card with the direct line + hours. */}
              <a
                href={`tel:${SITE.phoneTel}`}
                className="btn-secondary group gap-3 px-5 py-2.5 hover:border-white/[0.15]"
              >
                <Phone
                  className="h-4 w-4 shrink-0 text-ink-faint transition-colors duration-200 group-hover:text-zinc-300"
                  strokeWidth={1.8}
                />
                <span className="flex flex-col text-left">
                  <span className="font-mono text-[13.5px] text-white tabular-nums">
                    Κλήση: {SITE.phoneDisplay}
                  </span>
                  <span className="font-mono text-[11px] text-ink-faint">
                    {SITE.hoursShort}
                  </span>
                </span>
              </a>
            </div>

            {/* ---- Micro-trust footer ---- */}
            <ul
              className={`${RISE} mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-faint`}
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

          {/* ================= Right: telemetry widget ================= */}
          <div className={`${RISE} lg:col-span-5`} style={delay(400)}>
            <PipelineSimulator />
          </div>
        </div>
      </div>
    </section>
  );
}
