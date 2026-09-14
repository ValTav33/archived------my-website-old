"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ArrowLink from "@/components/ui/ArrowLink";
import Card from "@/components/ui/Card";
import { type FaqEntry } from "@/lib/faq";
import { cn } from "@/lib/utils";

/**
 * The disclosure list. **The only part of the FAQ that needs JavaScript.**
 *
 * Extracted from `FaqSection` in S2.8 so two surfaces can render the same
 * disclosure behaviour without two implementations of it: the homepage shows
 * the first four objections, `/faq` shows all six. It also pushes the client
 * boundary down one level — `FaqSection` and the `/faq` page are now server
 * components, which is S1.4's rule applied to the section that had grown a
 * second caller.
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
 * duration, same easing, and `initial={false}` so closed panels do not
 * animate on mount. One disclosure language on the page, not two.
 *
 * **Every answer is in the document, open or closed.** S2.8 found this the
 * hard way: the panels used to be conditionally rendered, so a collapsed
 * answer existed nowhere in the HTML — and the `FAQPage` node added in the
 * same slice therefore asserted six answers the document did not contain.
 * Measured before the fix: 6 questions present, **0 answers**. Google allows
 * FAQ content inside expandable sections, but not content that is absent
 * until a click. So the panel now always renders and animates its height
 * between 0 and auto, with `aria-hidden` while collapsed so a screen reader
 * still skips it. The visible/asserted mismatch this markup gets penalised
 * for is now impossible rather than merely avoided.
 */
export default function FaqList({
  entries,
  headingLevel = "h3",
  className,
}: {
  entries: readonly FaqEntry[];
  /**
   * The level of each question's heading.
   *
   * `h3` on the homepage, where the section's own `h2` sits above the list.
   * `h2` on `/faq`, where the page's `h1` does — measured as `h1 → h3` before
   * this prop existed, which is a skipped level and an exit-gate failure. The
   * questions are the top-level sections of that page, so they are `h2`
   * there; the level follows the document, not the component.
   */
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  /* A Set rather than a single id: see the note above about comparing. */
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (id: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    /* max-w-3xl keeps the answers at a readable measure; a full-width
       paragraph at 1440px is 180 characters and nobody finishes it. */
    <div className={cn("max-w-3xl space-y-3", className)}>
      {entries.map((entry) => (
        <FaqItem
          key={entry.id}
          entry={entry}
          headingLevel={headingLevel}
          isOpen={open.has(entry.id)}
          onToggle={() => toggle(entry.id)}
        />
      ))}
    </div>
  );
}

function FaqItem({
  entry,
  headingLevel,
  isOpen,
  onToggle,
}: {
  entry: FaqEntry;
  headingLevel: "h2" | "h3";
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-${entry.id}-question`;
  const panelId = `faq-${entry.id}-panel`;
  const Heading = headingLevel;

  return (
    <Card className="overflow-hidden">
      {/* The `h3` wraps the button rather than sitting beside it, so a screen
          reader's heading list carries the question itself and jumping to a
          heading lands on the control that opens it. */}
      <Heading>
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
      </Heading>

      {/* Always rendered. `aria-hidden` rather than unmounting, so the text
          is in the HTML for a crawler while a screen reader still skips a
          collapsed answer. */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!isOpen}
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <div className="px-5 pb-5">
          <p className="text-sm leading-relaxed text-zinc-400">
            {entry.answer}
          </p>

          {/* Optional, and only the money answer uses it today. Rendered
              inside the panel so it is unreachable — by pointer and by tab —
              while the answer is collapsed, which is the same reason the
              panel carries `aria-hidden`. A focusable link behind a closed
              disclosure is a keyboard trap that looks fine on screen. */}
          {entry.link && (
            <ArrowLink href={entry.link.href} size="quiet" className="mt-4">
              {entry.link.label}
            </ArrowLink>
          )}
        </div>
      </motion.div>
    </Card>
  );
}
