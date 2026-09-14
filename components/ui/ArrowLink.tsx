import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A route link with a trailing arrow that nudges on hover.
 *
 * Written three times on `/websites` alone before this existed, in two sizes,
 * and both pillars plus `/work`, `/process` and `/faq` all need it. §10.5:
 * write the same class string twice and extract it.
 *
 * Two sizes, because the page genuinely has two — a standalone link that
 * ends a section, and a quieter monospace one inside a card where it sits
 * under a paragraph rather than beside it.
 *
 * The arrow is `aria-hidden`: it is a direction, not a word, and a screen
 * reader announcing "arrow right" after every link is noise.
 */
const SIZE = {
  default: {
    link: "text-sm text-zinc-300",
    icon: "h-4 w-4",
    stroke: 1.8,
  },
  quiet: {
    link: "font-mono text-mono-xs text-ink-faint",
    icon: "h-3 w-3",
    stroke: 2,
  },
} as const;

export default function ArrowLink({
  href,
  size = "default",
  className,
  children,
}: {
  href: string;
  size?: keyof typeof SIZE;
  className?: string;
  children: React.ReactNode;
}) {
  const style = SIZE[size];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-tap items-center gap-1.5 transition-colors duration-200 hover:text-white",
        style.link,
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden
        className={cn(
          "transition-transform duration-200 group-hover:translate-x-0.5",
          style.icon,
        )}
        strokeWidth={style.stroke}
      />
    </Link>
  );
}
