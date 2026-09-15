import { Phone } from "lucide-react";
import AuditForm from "@/components/conversion/AuditForm";
import ArrowLink from "@/components/ui/ArrowLink";
import SectionHeader from "@/components/ui/SectionHeader";
import { AUDIT_DELIVERABLE, PROOF, SITE } from "@/lib/site";

/**
 * The conversion block. Owns `id="audit"` — every CTA on the page scrolls
 * here, so this id must stay unique in the document.
 *
 * ## S4.4 rebuilt it, and three things changed for three different reasons
 *
 * **It is the light band.** Full-bleed `paper` against an `obsidian` page is
 * **18.4:1** — the largest value step available anywhere on this site, and
 * the answer to "it's a two-colour thing" that costs no hue at all. Two
 * adjacent dark bands top out near 1.4:1; this is the one place the page gets
 * to shout. Apple alternates its tiles at roughly 19:1 for the same reason,
 * measured 2026-09-15.
 *
 * **The heading is the offer, not the topic.** It used to read «Ας
 * συζητήσουμε την υποδομή της επιχείρησής σας» — a subject line. What a
 * visitor needs at the moment of deciding is what they *get*, and that was
 * rendering as 13px grey beside the form. `AUDIT_DELIVERABLE` is now the
 * largest sentence in the section, still interpolated from the single
 * constant so the promise cannot drift from the one `/process` and
 * `/websites` make.
 *
 * **The proof comes back.** The client names appear at the top of the page
 * and then vanish for eleven screens. They belong next to the button, which
 * is where the doubt is.
 *
 * `DirectContactCard` deliberately does **not** render here any more. The
 * full channel rail — email, WhatsApp, Telegram, the response-time list —
 * lives on `/contact`, which is the page that owns it (§2.3, D1). A landing
 * page's conversion block sells one thing; a menu of four ways to reach
 * someone is what you show a visitor who has already decided *how* they want
 * to get in touch.
 */
export default function ConversionSection() {
  return (
    <section
      id="audit"
      aria-labelledby="audit-heading"
      className="surface-paper scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* ------------------------- The offer ------------------------- */}
          <div className="lg:col-span-5">
            <SectionHeader
              as="div"
              id="audit-heading"
              ground="paper"
              eyebrow="ΔΩΡΕΑΝ AUDIT"
              title="Δείτε τι θα άλλαζε, πριν αποφασίσετε."
            />

            {/* The deliverable, at the size it deserves. One constant, so
                this sentence and the form's confirmation cannot disagree. */}
            <p className="mt-6 text-xl font-medium leading-snug text-graphite sm:text-2xl">
              Θα λάβετε {AUDIT_DELIVERABLE}.
            </p>

            {/* Calling is a conversion action, not a fallback — the thing
                being sold is a phone call. */}
            <a
              href={`tel:${SITE.phoneTel}`}
              className="mt-7 inline-flex min-h-tap items-center gap-3 rounded-full border border-rule bg-paper-raised px-5 py-3 transition-colors duration-200 hover:border-rule-strong"
            >
              <Phone
                className="h-4 w-4 shrink-0 text-graphite-faint"
                strokeWidth={1.8}
                aria-hidden
              />
              <span className="flex flex-col text-left">
                <span className="font-mono text-base font-medium tabular-nums text-graphite">
                  {SITE.phoneDisplay}
                </span>
                <span className="text-sm text-graphite-faint">
                  {SITE.hoursShort}
                </span>
              </span>
            </a>

            {/* ------------------------- Proof ------------------------- */}
            <div className="mt-9 border-t border-rule pt-6">
              <p className="text-sm font-medium text-graphite">
                Έχουμε ήδη παραδώσει για:
              </p>
              <ul className="mt-3 space-y-1.5">
                {PROOF.map((item) => (
                  <li key={item.id} className="text-base text-graphite-muted">
                    <span className="font-medium text-graphite">
                      {item.name}
                    </span>
                    {" — "}
                    {item.kind}
                  </li>
                ))}
              </ul>

              <ArrowLink href="/contact" className="mt-5">
                Άλλοι τρόποι επικοινωνίας
              </ArrowLink>
            </div>
          </div>

          {/* -------------------------- The form ------------------------- */}
          <div className="lg:col-span-7">
            <AuditForm />
          </div>
        </div>
      </div>
    </section>
  );
}
