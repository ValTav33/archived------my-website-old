"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ArrowLink from "@/components/ui/ArrowLink";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";
import type { ShowcaseCase } from "@/lib/showcase";

/**
 * One showcase case, and the only part of the section that needs JavaScript.
 *
 * `ShowcaseGrid` used to be a Client Component purely because of the
 * disclosure state that lives here, which dragged the section shell, its
 * header and the whole `CASES` array into the bundle with it. Splitting the
 * card out leaves the shell on the server and ships only this.
 *
 * **S4.1 moved where this renders, not what it is.** The homepage now shows
 * a one-line summary per system and this full card — problem, solution,
 * metrics, and the architecture trace behind a disclosure — renders on
 * `/websites` and `/automations`, where a reader who followed the link has
 * already asked for the detail. The homepage section was 3.4 phone screens;
 * a landing page cannot spend that on systems built for nobody.
 */
/* The shape lives in `lib/showcase.ts`, which is what both this card and
   the homepage's one-line version read from — S4.1. */
export type { ShowcaseCase };

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

export default function ShowcaseCard({ item }: { item: ShowcaseCase }) {
  /* Each card owns its disclosure state, so opening one architecture panel
     never collapses another — visitors can compare two systems side by side. */
  const [open, setOpen] = useState(false);
  const panelId = `${item.id}-architecture`;

  return (
    <Card
      as="article"
      interactive
      className="flex flex-col justify-between p-6"
    >
      <div>
        {/* Category */}
        <Badge shape="tag">{item.category}</Badge>

        <h3 className="mt-5 text-lg font-semibold leading-snug text-zinc-100">
          {item.title}
        </h3>

        {/* Problem / solution, labelled like an engineering brief. */}
        <div className="mt-5 space-y-4">
          <Field label="Πρόβλημα" body={item.problem} />
          <Field label="Λύση" body={item.solution} />
        </div>

        {/* When this describes a system that is actually running, say so and
            link to it. Without this the visitor reads "indicative" and has
            no way to learn that one of the three is not. */}
        {item.caseStudy && (
          <ArrowLink href={item.caseStudy} size="quiet" className="mt-4">
            Τρέχει σε πελάτη — δείτε το έργο
          </ArrowLink>
        )}

        {/* Impact — stacked rather than inline, so long Greek metrics stay on
            one line each instead of wrapping mid-phrase. */}
        <ul className="mt-5 flex flex-col items-start gap-1.5">
          {item.metrics.map((metric) => (
            <Badge
              as="li"
              key={metric}
              variant="metric"
              shape="tag"
              className="items-baseline gap-1.5"
            >
              <span aria-hidden className="text-decor">
                •
              </span>
              {metric}
            </Badge>
          ))}
        </ul>
      </div>

      {/* --------------------- Architecture disclosure -------------------- */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-tap w-full items-center justify-between gap-2 rounded-lg border border-hairline bg-white/[0.02] px-3.5 py-2.5 font-mono text-mono-xs text-zinc-300 transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.05] hover:text-white"
        >
          Τεχνική αρχιτεκτονική
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-300",
              open && "rotate-180",
            )}
            strokeWidth={2}
          />
        </button>

        {/* `initial={false}` stops every card from animating its (closed)
            panel on mount — only real user toggles animate. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ArchitectureTrace nodes={item.architecture} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Card internals                                                     */
/* ------------------------------------------------------------------ */

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <Eyebrow variant="label">{label}</Eyebrow>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

/**
 * The data flow rendered as a terminal trace. Uses the same dashed-connector
 * language as the hero's pipeline monitor so both widgets read as one system.
 */
function ArchitectureTrace({ nodes }: { nodes: readonly string[] }) {
  return (
    <Card tone="sunken" className="mt-3 p-3.5">
      <Eyebrow variant="label">$ trace --flow</Eyebrow>

      <ol className="mt-3">
        {nodes.map((node, index) => (
          <li key={node}>
            <div className="flex items-baseline gap-2.5 font-mono text-mono-xs">
              <span className="shrink-0 text-ink-ghost tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-zinc-300">{node}</span>
            </div>

            {index < nodes.length - 1 && (
              <div
                aria-hidden
                className="my-1 ml-[7px] h-3 w-px border-l border-dashed border-trace-line"
              />
            )}
          </li>
        ))}
      </ol>
    </Card>
  );
}
