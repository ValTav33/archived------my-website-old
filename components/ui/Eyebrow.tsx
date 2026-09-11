import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * The monospace label that sits above a heading or a block of detail.
 *
 * Two forms, because the page has always had two and writing either string by
 * hand is how the seventh one drifts:
 *
 *   `bracket`  [ 01 // ΕΝΔΕΙΚΤΙΚΕΣ ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ ]   — a section eyebrow
 *   `label`    ΕΝΑΛΛΑΚΤΙΚΑ                            — a micro label inside a block
 *
 * **Numbering is deliberately not automatic.** The `[ 01 // ]` numbers are
 * hand-assembled so that Phase 2 splitting sections into routes cannot
 * silently renumber them.
 */
const VARIANT = {
  bracket: "tracking-wider",
  label: "uppercase tracking-[0.16em]",
} as const;

type EyebrowOwnProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANT;
  className?: string;
};

type EyebrowProps<T extends ElementType> = EyebrowOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof EyebrowOwnProps<T>>;

export default function Eyebrow<T extends ElementType = "p">({
  as,
  variant = "bracket",
  className,
  ...rest
}: EyebrowProps<T>) {
  const Tag = (as ?? "p") as ElementType;

  return (
    <Tag
      className={cn(
        "font-mono text-mono-xs text-ink-ghost",
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  );
}
