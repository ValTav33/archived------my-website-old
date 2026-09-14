import ArrowLink from "@/components/ui/ArrowLink";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusDot from "@/components/ui/StatusDot";
import { PORTRAIT, SITE } from "@/lib/site";

/**
 * Who the visitor is actually dealing with.
 *
 * **This is the highest-risk copy on the site**, and the risk is one specific
 * failure: a prospect reads about a team, then meets one person, and feels
 * misled at the worst possible moment in the sale. Playbook §2.1 is the rule —
 * *plural voice, singular facts*. The register is "we"; nothing below is only
 * true with more than one person.
 *
 * Banned outright, and swept for on review: possessive plurals naming staff
 * (a team, developers, specialists), a premises noun, any department, any
 * founding narrative, any headcount, and any years-of-experience figure that
 * is not exactly true (§8.1). The exact Greek strings live in playbook §2.1
 * and are deliberately NOT repeated here — the review sweep greps this repo
 * for them, and a comment quoting them turns that sweep into noise.
 *
 * Deliberately short. Four sentences that a prospect can finish, ending on
 * what we will not do — which is the part that is hard to fake and therefore
 * the part worth reading.
 */

const PARAGRAPHS = [
  /* The heading asks who. This answers it, in the first line, with a name —
     §2.1's guardrail bans claiming more people than exist, not stating the
     one who does. A prospect who reads this and then meets Val meets exactly
     who the page said. */
  `Το ${SITE.brand} είναι ο ${SITE.person}. Δουλεύουμε από τη Θεσσαλονίκη — Εύοσμος — και εξυπηρετούμε όλη την Ελλάδα, remote. Οι ώρες είναι πραγματικές: ${SITE.hoursLong}.`,
  "Κατασκευάζουμε δύο πράγματα. Ιστοσελίδες και web εφαρμογές που φορτώνουν γρήγορα, και αυτοματισμούς που αναλαμβάνουν δουλειά ρουτίνας που σήμερα γίνεται με το χέρι.",
  /* S2 stripped the false half of this paragraph; S5 rewrites the section. */
  "Κάθε έργο ξεκινά με γραπτή συμφωνία για το τι παραδίδεται και ποιος διαχειρίζεται τι.",
  /* The "what we do not do" line. Every clause here is a promise NOT to do
     something, which is the only kind of claim that costs the writer
     something — and the only kind §8 lets us make without evidence. */
  "Δεν δουλεύουμε με έτοιμα templates, δεν αφήνουμε εκπλήξεις για το τέλος και δεν υποσχόμαστε θέσεις στη Google.",
] as const;

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 pb-20 sm:pb-28 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="about-heading"
          eyebrow="[ 03 // ΠΟΙΟΙ ΕΙΜΑΣΤΕ ]"
          title="Με ποιον θα δουλέψετε."
        />

        <Card className="mt-10 p-6 sm:p-8">
          <div
            className={
              PORTRAIT
                ? "grid gap-6 sm:grid-cols-[10rem,1fr] sm:gap-8"
                : "grid gap-6"
            }
          >
            {PORTRAIT && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={PORTRAIT.src}
                alt={PORTRAIT.alt}
                className="h-40 w-40 rounded-xl object-cover"
              />
            )}

            <div>
              <Badge variant="status">
                <StatusDot />
                {SITE.availability}
              </Badge>

              {/* max-w-prose holds the measure near 65–75 characters even when
                  the card runs the full width of a 1440px layout. */}
              <div className="mt-5 max-w-prose space-y-4">
                {PARAGRAPHS.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-zinc-400 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* How we communicate, when we answer, and the reasons behind the
            four refusals above all live on `/about`. */}
        <ArrowLink href="/about" className="mt-8">
          Περισσότερα για εμάς
        </ArrowLink>
      </div>
    </section>
  );
}
