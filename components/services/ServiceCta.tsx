import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Card from "@/components/ui/Card";
import { AUDIT_DELIVERABLE } from "@/lib/site";

/**
 * The block that ends a service page.
 *
 * The offer sentence interpolates `AUDIT_DELIVERABLE` rather than taking it
 * as a prop, because there is exactly one free audit and every surface that
 * describes it must describe the same one. A prop here would be an invitation
 * to pass a slightly different promise on the second page.
 *
 * Not an `ArrowLink`: this is the solid white primary button, a different
 * pattern from a text link with an arrow.
 */
export default function ServiceCta({
  id,
  title,
}: {
  /** Unique per page, for the heading's `aria-labelledby`. */
  id: string;
  title: string;
}) {
  const headingId = `${id}-heading`;

  return (
    <section aria-labelledby={headingId} className="mt-20">
      <Card className="p-6 sm:p-8">
        <h2
          id={headingId}
          className="max-w-2xl text-2xl font-semibold leading-snug text-white sm:text-3xl"
        >
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {`Δωρεάν audit: ${AUDIT_DELIVERABLE}.`}
        </p>

        <Link
          href="/contact"
          className="btn-primary mt-7 inline-flex min-h-tap items-center gap-1.5 px-5 py-2.5 text-sm"
        >
          Ζητήστε δωρεάν audit
          <ArrowRight aria-hidden className="h-4 w-4" strokeWidth={2} />
        </Link>
      </Card>
    </section>
  );
}
