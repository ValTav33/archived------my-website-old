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
 * Deliberately short. Three sentences that a prospect can finish, ending on
 * what we will not do — which is the part that is hard to fake and therefore
 * the part worth reading.
 */

const PARAGRAPHS = [
  /* **The heading asks «Με ποιον θα δουλέψετε». This answers it in three
     words**, which is the whole fix S5 made.

     It used to open «Το {brand} είναι ο {person}» — Val's objection, and he
     was right twice over: it equates a company with a human being, which is
     not a sentence that means anything, and it answers a question nobody
     asked. Naming him is still required (§2.1 bans claiming more people than
     exist, never stating the one who does); answering the actual question is
     what changed.

     «εξ αποστάσεως» rather than «remote» — plain Greek where plain Greek
     exists, §2.4. No premises noun anywhere in here: §2.1 bans «το γραφείο
     μας» and «έδρα» is the same claim in a more formal register. */
  `Με τον ${SITE.personAccusative}. Δουλεύουμε από τη Θεσσαλονίκη — Εύοσμος — και εξυπηρετούμε όλη την Ελλάδα εξ αποστάσεως. Οι ώρες είναι πραγματικές: ${SITE.hoursLong}.`,
  /* The "we build two things" paragraph that used to sit here is gone as of
     S4.1 — it is now `ServicesSection`, near the top of the page, where a
     visitor meets the offer instead of discovering it three quarters of the
     way down. Removed rather than copied: D1 forbids the same claim twice on
     one page, and this section's job is who, not what. */
  /* Replaces the ownership promise S2 removed. The anxiety is the same one —
     "what do I actually end up with" — answered from what holds in every
     package instead of from one that does not. */
  "Κάθε έργο ξεκινά με γραπτή συμφωνία: τι μπαίνει, τι δεν μπαίνει, και ποιος κρατά τι στο τέλος. Τα πακέτα διαφέρουν· αυτό που δεν αλλάζει είναι ότι το ξέρετε πριν συμφωνήσετε, όχι μετά.",
  /* The "what we do not do" line. Every clause is a promise NOT to do
     something, which is the only kind of claim that costs the writer
     something — and the only kind §8 lets us make without evidence.

     These three are deliberately three of the four refusals `/about`
     expands, and «εκπλήξεις στο τέλος» is deliberately the one left out:
     the paragraph above already makes that point on this page, and D1 says a
     homepage section states while the deeper page explains. */
  "Δεν δουλεύουμε με έτοιμα templates, δεν υποσχόμαστε θέσεις στη Google, και δεν αναλαμβάνουμε δουλειά που δεν μπορούμε να κάνουμε καλά.",
] as const;

export default function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 pb-14 sm:pb-28 lg:pb-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          id="about-heading"
          eyebrow="ΠΟΙΟΙ ΕΙΜΑΣΤΕ"
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
