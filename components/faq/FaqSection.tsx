"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { FAQ, type FaqEntry } from "@/lib/faq";
import { cn } from "@/lib/utils";

/**
 * The objections, answered on the page.
 *
 * Hand-built rather than pulled from a library, because the accessible
 * disclosure pattern is about fifteen lines and a dependency here would ship
 * more JavaScript than the whole section's copy weighs.
 *
 * **Several panels can be open at once, deliberately.** An accordion that
 * closes the previous answer stops a visitor comparing "what if I lose you"
 * against "what does it cost" — which is exactly the comparison someone makes
 * before they call.
 *
 * Motion matches `ShowcaseCard` exactly — same height/opacity pair, same
 * duration, same easing, same `initial={false}` so closed panels do not
 * animate on mount. One disclosure language on the page, not two.
 *
 * **No `FAQPage` JSON-LD here.** It ships in Phase 2 with the `/faq` route
 * that owns the canonical copy; two schemas describing one body of text is a
 * duplicate-markup problem, not a bonus.
 */
export default function FaqSection() {
  /* A Set rather than a single id: see the note above about comparing. */
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 pb-20 sm:pb-28 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="faq-heading"
          eyebrow="[ 04 // ΕΡΩΤΗΣΕΙΣ ]"
          title="Αυτά που ρωτούν όλοι, πριν το ρωτήσετε."
        />

        {/* max-w-3xl keeps the answers at a readable measure; a full-width
            paragraph at 1440px is 180 characters and nobody finishes it. */}
        <div className="mt-10 max-w-3xl space-y-3">
          {FAQ.map((entry) => (
            <FaqItem
              key={entry.id}
              entry={entry}
              isOpen={open.has(entry.id)}
              onToggle={() => toggle(entry.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqItem({
  entry,
  isOpen,
  onToggle,
}: {
  entry: FaqEntry;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-${entry.id}-question`;
  const panelId = `faq-${entry.id}-panel`;

  return (
    <Card className="overflow-hidden">
      {/* The `h3` wraps the button rather than sitting beside it, so a screen
          reader's heading list carries the question itself and jumping to a
          heading lands on the control that opens it. */}
      <h3>
        <button
          id={buttonId}
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex min-h-tap w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-zinc-100 transition-colors duration-200 hover:text-white sm:text-base"
        >
          {entry.question}

          {/* Decorative. The state is already carried by `aria-expanded`, by
              the panel's presence and by the rotation — never by colour
              alone, which is the accessibility guideline this section was
              flagged against. */}
          <ChevronDown
            aria-hidden
            className={cn(
              "h-4 w-4 shrink-0 text-ink-faint transition-transform duration-300",
              isOpen && "rotate-180",
            )}
            strokeWidth={2}
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            key="panel"
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-400">
              {entry.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
