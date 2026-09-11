import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * The card shell — six copies of the same string before this existed.
 *
 * Three tones, which is what the page actually uses rather than what a card
 * component usually offers. The radius rides along with the tone on purpose:
 * a `sunken` panel is always nested inside something else, and the tighter
 * corner is what makes it read that way.
 *
 *   `raised`  the standard card on the terminal surface
 *   `sunken`  an inner panel — the success receipt, the architecture trace
 *   `glass`   a translucent band over the page, not a surface of its own
 *
 * Hairlines come from the `hairline` tokens: playbook §10.3's two values, and
 * the pair `globals.css` has always declared as `--hairline` /
 * `--hairline-strong`. There is no third.
 */
const TONE = {
  raised: "rounded-xl bg-obsidian-850",
  sunken: "rounded-lg bg-obsidian-950/70",
  glass: "rounded-xl bg-white/[0.02]",
} as const;

type CardOwnProps<T extends ElementType> = {
  as?: T;
  tone?: keyof typeof TONE;
  /** Adds the single hover hairline. For cards that respond to a pointer. */
  interactive?: boolean;
  className?: string;
};

type CardProps<T extends ElementType> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

export default function Card<T extends ElementType = "div">({
  as,
  tone = "raised",
  interactive = false,
  className,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={cn(
        "border border-hairline",
        TONE[tone],
        interactive &&
          "transition-colors duration-300 hover:border-hairline-strong",
        className,
      )}
      {...rest}
    />
  );
}
