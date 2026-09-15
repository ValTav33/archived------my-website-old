"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Phone } from "lucide-react";
import ScrollLink from "@/components/ui/ScrollLink";
import { CTA_LINK } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The always-available call to action, on phones.
 *
 * **The defect this closes.** The homepage is twelve phone screens and its
 * only CTAs are in the hero and at the very bottom, which leaves roughly
 * **9,000px where a visitor who has decided cannot act on it**. Val's answer
 * to whether sections should be cut to shorten the page was to keep them all
 * and add more over time, so that gap grows with every section unless
 * something is always in reach. This is that something, and every future
 * section inherits it.
 *
 * Two actions, per Val: the audit, and the phone. The phone is not decoration
 * — the thing being sold is a fifteen-minute call, and a Greek SMB owner who
 * is ready will often rather dial than fill in a form.
 *
 * ## The rules it has to obey, and how
 *
 * - **It must never cover the thing it points at.** It hides while the audit
 *   section is on screen, and it does not render on `/contact` at all, where
 *   the form *is* the page.
 * - **It must not appear over the hero**, which already carries both actions
 *   at full size. It waits until the hero has left.
 * - **It must not be reachable while hidden.** `inert` plus `aria-hidden`,
 *   not merely translated off-screen — an off-screen element that still takes
 *   Tab is the exact bug S3.5 fixed on the collapsed FAQ panel.
 * - **Motion is `transform` only**, and the global `prefers-reduced-motion`
 *   rule collapses the transition to nothing.
 * - **Safe area.** `env(safe-area-inset-bottom)` keeps it above the home
 *   indicator on a notched phone rather than under it.
 * - Phones only. At `lg` the header's own CTA is always visible.
 */
export default function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  /* `/contact` is the form. A floating button pointing at the page you are
     already on is noise, and on a short page it would sit over the submit. */
  const suppressed = pathname === CTA_LINK.href;

  /* The homepage owns `#audit`; every other route sends the visitor to the
     contact page instead of scrolling to a section that is not there. */
  const isHome = pathname === "/";

  useEffect(() => {
    if (suppressed) return;

    const hero = document.getElementById("hero");
    const audit = document.getElementById("audit");

    /* Two independent facts, combined on every change rather than raced:
       past the hero, and not currently looking at the form. A single
       observer cannot express that, and a scroll handler would run on every
       frame to answer a question that changes twice per visit. */
    let pastHero = !hero;
    let atForm = false;
    const sync = () => setVisible(pastHero && !atForm);

    const observers: IntersectionObserver[] = [];

    if (hero) {
      const o = new IntersectionObserver(
        ([entry]) => {
          pastHero = !entry.isIntersecting;
          sync();
        },
        /* A sliver of the hero still counts as the hero. */
        { threshold: 0, rootMargin: "-80px 0px 0px 0px" },
      );
      o.observe(hero);
      observers.push(o);
    }

    if (audit) {
      const o = new IntersectionObserver(
        ([entry]) => {
          atForm = entry.isIntersecting;
          sync();
        },
        { threshold: 0 },
      );
      o.observe(audit);
      observers.push(o);
    }

    sync();
    return () => observers.forEach((o) => o.disconnect());
  }, [suppressed, pathname]);

  if (suppressed) return null;

  return (
    <div
      inert={!visible}
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 lg:hidden",
        "px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3",
        "transition-transform duration-300 ease-out",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="glass-strong flex items-center gap-2 rounded-full p-1.5">
        {isHome ? (
          <ScrollLink
            to="audit"
            className="btn-primary min-h-tap flex-1 gap-1.5 px-5 text-sm"
          >
            {CTA_LINK.label}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </ScrollLink>
        ) : (
          <Link
            href={CTA_LINK.href}
            className="btn-primary min-h-tap flex-1 gap-1.5 px-5 text-sm"
          >
            {CTA_LINK.label}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
          </Link>
        )}

        {/* Icon-only, so it carries its own name — the number is the label a
            screen reader should read, not the word "phone". */}
        <a
          href={`tel:${SITE.phoneTel}`}
          aria-label={`Κλήση στο ${SITE.phoneDisplay}`}
          className="flex min-h-tap min-w-tap items-center justify-center rounded-full border border-hairline text-white transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.06]"
        >
          <Phone className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </a>
      </div>
    </div>
  );
}
