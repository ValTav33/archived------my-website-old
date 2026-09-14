import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * The pill.
 *
 * This class string was written fourteen times across seven files, with four
 * different border/fill opacity combinations that nothing had chosen
 * deliberately (`0.06`/`0.08` against `0.02`/`0.03`/`0.04`). One border value
 * and one fill value per variant now, and **no call site sets either**.
 *
 * Hairlines come from the `hairline` tokens, which are playbook §10.3's two
 * values and the same pair `globals.css` has always declared as `--hairline`
 * and `--hairline-strong`.
 *
 * `shape` carries the geometry the page already used, so extracting this
 * primitive moved nothing: `pill` is the rounded-full chip, `tag` the squarer
 * showcase label, `chip` the tight status badge in the simulator's chrome.
 */
const SHAPE = {
  pill: "rounded-full px-3 py-1",
  tag: "rounded-md px-2.5 py-1",
  chip: "rounded px-1.5 py-0.5",
} as const;

const VARIANT = {
  /** Category, stack and navigation chips. */
  default: "bg-white/[0.03] text-zinc-300",
  /** The stacked impact rows — recessed, because a card carries three at once. */
  metric: "bg-white/[0.02] text-zinc-400",
  /** Wraps a `StatusDot` plus its label. Same surface as `default`. */
  status: "bg-white/[0.03] text-zinc-400",
} as const;

type BadgeOwnProps<T extends ElementType> = {
  as?: T;
  variant?: keyof typeof VARIANT;
  shape?: keyof typeof SHAPE;
  /** Adds the single hover hairline. For badges that are links or buttons. */
  interactive?: boolean;
  className?: string;
};

type BadgeProps<T extends ElementType> = BadgeOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BadgeOwnProps<T>>;

export default function Badge<T extends ElementType = "span">({
  as,
  variant = "default",
  shape = "pill",
  interactive = false,
  className,
  ...rest
}: BadgeProps<T>) {
  const Tag = (as ?? "span") as ElementType;

  return (
    <Tag
      className={cn(
        "inline-flex items-center gap-2 border border-hairline font-mono text-mono-xs",
        SHAPE[shape],
        VARIANT[variant],
        interactive &&
          "transition-colors duration-200 hover:border-hairline-strong",
        className,
      )}
      {...rest}
    />
  );
}
