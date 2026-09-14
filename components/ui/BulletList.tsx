import { cn } from "@/lib/utils";

/**
 * A list of plain sentences, each marked with a decorative bullet.
 *
 * The bullet is `aria-hidden` and uses the decorative grey token: it is a
 * mark, not content, and a screen reader already announces list items
 * without being told "•" six times.
 */
export default function BulletList({
  items,
  className,
}: {
  items: readonly string[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="flex items-baseline gap-3 text-sm leading-relaxed text-zinc-400"
        >
          <span aria-hidden className="shrink-0 text-decor">
            •
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
