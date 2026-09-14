import ServiceCta from "@/components/services/ServiceCta";
import ServiceSection from "@/components/services/ServiceSection";
import PersonJsonLd from "@/components/seo/PersonJsonLd";
import Badge from "@/components/ui/Badge";
import BulletList from "@/components/ui/BulletList";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import PageShell from "@/components/ui/PageShell";
import SectionHeader from "@/components/ui/SectionHeader";
import StatusDot from "@/components/ui/StatusDot";
import { getRoute } from "@/lib/routes";
import { routeMetadata } from "@/lib/seo";
import { PORTRAIT, SITE } from "@/lib/site";

export const metadata = routeMetadata("/about");

const ROUTE = getRoute("/about");

/**
 * `/about` — the expansion of the homepage's about section.
 *
 * **§2.1 is the review bar for this file, as it was for S1.8**: plural voice,
 * singular facts. The register is "we"; nothing here is only true with more
 * than one person. Banned outright and swept for on review: possessive
 * plurals naming staff, a premises noun, any department, any founding
 * narrative, any headcount, and any years-of-experience figure that is not
 * exactly true (§8.1). The exact Greek strings live in playbook §2.1 and are
 * deliberately not repeated here — the review sweep greps this repo for them,
 * and a comment quoting them turns the sweep into noise.
 *
 * **Nothing on this page repeats the homepage section.** D1's rule, and here
 * it constrained the content rather than the layout: the homepage already
 * states the name, the city, the hours, the two things we build, code
 * ownership and four refusals. What was left to say is what those facts mean
 * in practice — who you actually talk to, what happens outside the stated
 * hours, and *why* each refusal is a refusal. That is the page.
 *
 * What is deliberately not here: no invented policy. Whether Val takes
 * meetings in person, what he charges, which sectors he declines — none of
 * that is written down anywhere in this repo, and a service page is not the
 * place to guess at a business's boundaries on its behalf.
 */

/** Why each refusal is a refusal. The homepage states them; this explains them. */
const REFUSALS = [
  "Όχι έτοιμα templates: ένα template σας δίνει το site κάποιου άλλου με το λογότυπό σας πάνω, και κάθε αλλαγή παλεύει με ό,τι υπήρχε από πριν.",
  "Όχι όμηρος ο κώδικας: το repository είναι στο όνομά σας από την πρώτη μέρα, όχι σε ένα δικό μας που σας δίνει πρόσβαση.",
  "Όχι υποσχέσεις για θέσεις στη Google: κανείς δεν ελέγχει την κατάταξη. Ελέγχουμε το πόσο γρήγορα φορτώνει, το πώς διαβάζεται και το τι βρίσκει ένας crawler.",
  "Όχι δουλειά που δεν μπορούμε να κάνουμε καλά: αν αυτό που ζητάτε δεν είναι για εμάς, θα σας το πούμε στην πρώτη κλήση και όχι στην τρίτη εβδομάδα.",
] as const;

export default function AboutPage() {
  return (
    <>
      <PersonJsonLd path={ROUTE.path} />

      <PageShell>
        <SectionHeader
          titleAs="h1"
          eyebrow="[ // ΠΟΙΟΙ ΕΙΜΑΣΤΕ ]"
          title={`${SITE.person}, και τι σημαίνει αυτό για τη δουλειά σας.`}
          lede={`Πίσω από το ${SITE.brand} υπάρχει ένα πρόσωπο. Παρακάτω είναι τι σημαίνει αυτό στην πράξη: με ποιον μιλάτε, πότε απαντάμε, και ποια δουλειά δεν αναλαμβάνουμε.`}
        />

        {/* The portrait slot. Renders nothing while `PORTRAIT` is null, and the
            page reads correctly without it — same discipline as S1.8. */}
        {PORTRAIT && (
          <Card className="mt-10 inline-block p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PORTRAIT.src}
              alt={PORTRAIT.alt}
              className="h-48 w-48 rounded-lg object-cover"
            />
          </Card>
        )}

        {/* -------------------------- Who you talk to ----------------------- */}
        <ServiceSection
          id="contact-person"
          eyebrow="[ 01 // ΜΕ ΠΟΙΟΝ ΜΙΛΑΤΕ ]"
          title="Πάντα με το ίδιο πρόσωπο."
          lede="Δεν υπάρχει account manager που μεταφέρει μηνύματα, ούτε ξεκινάτε την εξήγηση από την αρχή κάθε φορά που ρωτάτε κάτι. Όποιος απαντά στο τηλέφωνο είναι αυτός που έγραψε τον κώδικα."
        >
          <Card className="mt-8 max-w-3xl p-6">
            <Badge variant="status">
              <StatusDot />
              {SITE.availability}
            </Badge>

            <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div>
                <Eyebrow as="dt" variant="label">
                  Ώρες
                </Eyebrow>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {SITE.hoursLong}
                </dd>
              </div>
              <div>
                <Eyebrow as="dt" variant="label">
                  Έξω από αυτές
                </Eyebrow>
                {/* The honest half. A site that implies round-the-clock
                    availability from one person is making a promise the next
                    unanswered evening breaks. */}
                <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Δεν απαντάμε αμέσως, και δεν προσποιούμαστε ότι απαντάμε. Το
                  μήνυμά σας το βρίσκουμε το επόμενο πρωί.
                </dd>
              </div>
              <div>
                <Eyebrow as="dt" variant="label">
                  Πού βρισκόμαστε
                </Eyebrow>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {SITE.locationLabel}
                </dd>
              </div>
              <div>
                <Eyebrow as="dt" variant="label">
                  Γλώσσα
                </Eyebrow>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Ελληνικά και αγγλικά, γραπτά και προφορικά.
                </dd>
              </div>
            </dl>
          </Card>
        </ServiceSection>

        {/* ---------------------------- The refusals ------------------------- */}
        <ServiceSection
          id="refusals"
          eyebrow="[ 02 // ΤΙ ΔΕΝ ΑΝΑΛΑΜΒΑΝΟΥΜΕ ]"
          title="Και γιατί."
          lede="Η αρχική σελίδα τα λέει σε μια γραμμή. Εδώ είναι ο λόγος πίσω από κάθε ένα — γιατί μια άρνηση χωρίς λόγο είναι στάση, όχι κριτήριο."
        >
          <BulletList items={REFUSALS} className="mt-8 max-w-3xl" />
        </ServiceSection>

        <ServiceCta id="cta" title="Πείτε μας τι θέλετε να φτιάξετε." />
      </PageShell>
    </>
  );
}
