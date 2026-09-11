import type { ElementType, ReactNode } from "react";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/**
 * Eyebrow + `h2` + optional lede, with the measure and the spacing baked in.
 *
 * Phase 1 adds four sections to this page. Without one header component each
 * of them invents its own heading size, its own gap and its own max-width,
 * and the page stops reading as one argument. That is the whole reason this
 * exists.
 *
 * `id` lands on the `h2` so a section can point `aria-labelledby` at its own
 * visible title rather than repeating it in an `aria-label`.
 *
 * The measure on `section` is §11's line-length guidance: `max-w-3xl` keeps
 * the lede near 65–75 characters. `compact` is for a header inside a column
 * that is already narrow, where a second constraint would fight the grid.
 */
const TITLE = {
  section:
    "text-3xl leading-[1.15] tracking-[-0.025em] sm:text-4xl lg:text-[2.75rem]",
  compact: "text-2xl leading-snug tracking-[-0.02em] sm:text-3xl",
} as const;

export default function SectionHeader({
  as,
  id,
  eyebrow,
  title,
  lede,
  size = "section",
  className,
}: {
  as?: ElementType;
  /** Applied to the `h2`, for the section's `aria-labelledby`. */
  id?: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  size?: keyof typeof TITLE;
  className?: string;
}) {
  const Tag = (as ?? "header") as ElementType;

  return (
    <Tag className={cn(size === "section" && "max-w-3xl", className)}>
      <Eyebrow>{eyebrow}</Eyebrow>

      <h2 id={id} className={cn("mt-4 font-semibold text-white", TITLE[size])}>
        {title}
      </h2>

      {lede && (
        <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
          {lede}
        </p>
      )}
    </Tag>
  );
}
