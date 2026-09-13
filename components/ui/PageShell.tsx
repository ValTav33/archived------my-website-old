import type { ElementType } from "react";
import { cn } from "@/lib/utils";

/**
 * The container every route below the homepage sits in.
 *
 * Three pages typed this same string before it was extracted, and the top
 * padding is the part worth centralising: the header is `fixed`, so a page
 * whose content starts at the top of `main` renders underneath it. The
 * homepage never needed this because its hero carries its own generous
 * padding; every other route does, and getting it wrong is invisible until
 * someone lands on the page directly rather than clicking through.
 *
 * `as` because some pages are one `section` and others wrap several.
 */
export default function PageShell({
  as,
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={cn(
        "mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
