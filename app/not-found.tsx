import type { Metadata } from "next";
import ArrowLink from "@/components/ui/ArrowLink";
import Eyebrow from "@/components/ui/Eyebrow";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";

/**
 * The 404.
 *
 * `noindex` because a 404 that gets indexed competes with the pages that
 * exist. Next serves the correct 404 status regardless; this is about what a
 * crawler does with it.
 *
 * Greek, and **no terminal joke**. «404 SYSTEM ERROR» in monospace is exactly
 * the jargon register §2.4 removed from the whole site, and a visitor who has
 * just hit a dead end is the last person to entertain with one. It says what
 * happened and offers the three places they were probably going.
 */
export const metadata: Metadata = {
  title: "Η σελίδα δεν βρέθηκε",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <PageShell className="max-w-3xl">
      <SectionHeader
        titleAs="h1"
        eyebrow="404"
        title="Αυτή η σελίδα δεν υπάρχει."
        lede="Ο σύνδεσμος μπορεί να είναι λάθος, ή η σελίδα να μετακινήθηκε. Δεν χάθηκε κάτι δικό σας."
      />

      {/* An `h2`, and not decoration. Measured across every route, this page
          was the only one with a skipped heading level: its `h1` sat directly
          above the footer's `h3` column headings, because unlike every other
          route it had no `h2` of its own. The list needed a label anyway. */}
      <Eyebrow as="h2" variant="label" className="mt-12">
        Πού μπορείτε να πάτε
      </Eyebrow>

      <div className="mt-5 flex flex-col items-start gap-3">
        <ArrowLink href="/">Αρχική</ArrowLink>
        <ArrowLink href="/work">Έργα που έχουν παραδοθεί</ArrowLink>
        <ArrowLink href="/contact">Επικοινωνία</ArrowLink>
      </div>
    </PageShell>
  );
}
