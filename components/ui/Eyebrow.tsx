import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * The monospace label that sits above a heading or a block of detail.
 *
 * Two forms:
 *
 *   `bracket`  ΕΝΔΕΙΚΤΙΚΑ ΣΥΣΤΗΜΑΤΑ   — a section eyebrow
 *   `label`    ΕΝΑΛΛΑΚΤΙΚΑ            — a micro label inside a block
 *
 * **The brackets and the numbers are gone as of S4.5b.** Every section eyebrow
 * on the site read `[ 04 // ΔΙΑΔΙΚΑΣΙΑ ]`, which is the register §2.4 removed
 * when it deleted `SYS.ENG` and `LATENCY: NORMAL`, wearing a different
 * costume — and the numbers additionally had to be renumbered by hand every
 * time a section was inserted, which S4.1 had just done across four files.
 *
 * Val's call: keep the label, drop the number. The `bracket` variant name is
 * kept because it is still the section-level form and renaming it would touch
 * thirty call sites to say the same thing.
 */
const VARIANT = {
  bracket: "tracking-wider",
  label: "uppercase tracking-[0.16em]",
} as const;

/* Which ground it sits on. `ink-ghost` is 1.2:1 on `paper` — invisible —
   so a light band needs its own value rather than a className override at
   every call site. Added in S4.4 with the conversion band. */
const GROUND = {
  dark: "text-ink-ghost",
  paper: "text-graphite-faint",
} as const;

type EyebrowOwnProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANT;
  ground?: keyof typeof GROUND;
  className?: string;
};

type EyebrowProps<T extends ElementType> = EyebrowOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof EyebrowOwnProps<T>>;

export default function Eyebrow<T extends ElementType = "p">({
  as,
  variant = "bracket",
  ground = "dark",
  className,
  ...rest
}: EyebrowProps<T>) {
  const Tag = (as ?? "p") as ElementType;

  return (
    <Tag
      className={cn(
        "font-mono text-mono-xs",
        GROUND[ground],
        VARIANT[variant],
        className,
      )}
      {...rest}
    />
  );
}
