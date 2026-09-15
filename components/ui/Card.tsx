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
  raised: "rounded-xl border-hairline bg-obsidian-850",
  sunken: "rounded-lg border-hairline bg-obsidian-950/70",
  glass: "rounded-xl border-hairline bg-white/[0.02]",
  /* The light ground. `paper-card` carries the fill, the rule-coloured border
     and — the part that is easy to forget — `color-scheme: light`, so native
     controls inside it are painted for a light document. Added in S4.4 for
     the audit form, which renders on `/` inside the light band and on
     `/contact` on the dark page, and needs to look right in both. */
  paper: "rounded-xl paper-card",
} as const;

/* Hover hairlines differ by ground: white on dark, ink on light. */
const INTERACTIVE = {
  raised: "hover:border-hairline-strong",
  sunken: "hover:border-hairline-strong",
  glass: "hover:border-hairline-strong",
  paper: "hover:border-rule-strong",
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
        "border",
        TONE[tone],
        interactive && cn("transition-colors duration-300", INTERACTIVE[tone]),
        className,
      )}
      {...rest}
    />
  );
}
