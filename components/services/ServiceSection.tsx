import SectionHeader from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";

/**
 * One numbered block of a service page: a compact header, and whatever the
 * section is made of underneath it.
 *
 * Four of these per pillar page, and the two pillars must argue in the same
 * shape — two service pages with different structures are two designs to
 * maintain, which is §10.5 applied to page shells rather than to class
 * strings.
 *
 * The `id` wiring is the reason this is a component and not a snippet. Every
 * section needs `aria-labelledby` pointing at its own visible heading, which
 * means an id written twice, in two places, correctly. Here it is derived
 * from one argument and cannot drift.
 */
export default function ServiceSection({
  id,
  eyebrow,
  title,
  lede,
  className,
  children,
}: {
  /** Unique per page. `-heading` is appended for the heading's own id. */
  id: string;
  eyebrow: string;
  title: string;
  lede?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className={cn("mt-20", className)}>
      <SectionHeader
        as="div"
        id={headingId}
        size="compact"
        eyebrow={eyebrow}
        title={title}
        lede={lede}
      />
      {children}
    </section>
  );
}
