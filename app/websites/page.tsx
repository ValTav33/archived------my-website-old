import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ServiceJsonLd from "@/components/seo/ServiceJsonLd";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionHeader from "@/components/ui/SectionHeader";
import { getRoute } from "@/lib/routes";
import { routeMetadata } from "@/lib/seo";
import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

export const metadata = routeMetadata("/websites");

const ROUTE = getRoute("/websites");

/**
 * What the client actually receives. Every line is something that exists on a
 * delivered project or on this site, which is §8.5 read strictly: a service
 * page is allowed to describe a service, but not to describe a capability
 * that has never been exercised.
 *
 * **No numbers anywhere in this file.** Not a load time, not a Lighthouse
 * score, not a percentage. §8.1's test is whether the figure survives a
 * prospect asking where it came from, and a performance number is worse than
 * unverifiable — it is true on the day it is written and false after one
 * dependency bump, on a page nobody thinks to re-measure.
 */
const DELIVERABLES = [
  {
    title: "Site ή web εφαρμογή σε Next.js",
    body: "TypeScript, server rendering και ένα build που δεν στηρίζεται σε plugins τρίτων για να λειτουργήσει.",
  },
  {
    title: "Σωστό σε κινητό πρώτα",
    body: "Δουλεύει σε κινητό, tablet και υπολογιστή, και ελέγχεται σε κάθε ένα από αυτά πριν την παράδοση.",
  },
  {
    title: "Preview URL σε κάθε στάδιο",
    body: "Ένας σύνδεσμος που ανοίγετε και βλέπετε τι έχει γίνει, όσο γίνεται — όχι screenshot σε email.",
  },
  {
    title: "Τεχνικό SEO από την αρχή",
    body: "Μοναδικοί τίτλοι και περιγραφές, sitemap, structured data και OG κάρτες για όταν μοιράζεται ο σύνδεσμος.",
  },
  {
    title: "Προσβασιμότητα, όχι εκ των υστέρων",
    body: "Αντιθέσεις, πλοήγηση με πληκτρολόγιο και σωστή σήμανση — ελέγχονται καθώς κατασκευάζεται, όχι σε δεύτερη φάση.",
  },
  {
    title: "Ο κώδικας δικός σας",
    body: "Το repository στο όνομά σας από την πρώτη μέρα και η εγκατάσταση τεκμηριωμένη, ώστε να μπορεί να συνεχίσει οποιοσδήποτε.",
  },
] as const;

/** Who this is for, said the way the prospect would describe themselves. */
const AUDIENCE = [
  "Έχετε site και έχει γίνει βάρος — αργεί, χαλάει, και κάθε αλλαγή περνά από κάποιον άλλον.",
  "Δεν έχετε site και δεν θέλετε να το φτιάξετε δύο φορές.",
  "Θέλετε κάτι περισσότερο από σελίδα παρουσίασης: λογαριασμούς χρηστών, portal πελατών, διαχείριση από μέσα.",
] as const;

export default function WebsitesPage() {
  return (
    <>
      <ServiceJsonLd
        path={ROUTE.path}
        name="Κατασκευή ιστοσελίδων και web εφαρμογών"
        serviceType="Web development"
        description={ROUTE.description}
      />

      <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 sm:pt-32 lg:px-8">
        {/* ------------------------------ Intent ------------------------------ */}
        {/* The keyword is in the h1 because that is the phrase someone typed to
            arrive here, and §11.7 wants a heading that is a sentence rather
            than a label — so it carries the clause that matters most to them
            instead of standing alone as a category name. */}
        <SectionHeader
          titleAs="h1"
          eyebrow="[ // ΚΑΤΑΣΚΕΥΗ ΙΣΤΟΣΕΛΙΔΩΝ ]"
          title="Κατασκευή ιστοσελίδων στη Θεσσαλονίκη, με κώδικα που μένει δικός σας."
          lede="Σχεδιάζουμε και κατασκευάζουμε ιστοσελίδες και web εφαρμογές σε Next.js, για επιχειρήσεις στη Θεσσαλονίκη και σε όλη την Ελλάδα. Το site δεν σπάει επειδή ενημερώθηκε κάποιο plugin, γιατί δεν στηρίζεται σε plugins."
        />

        {/* --------------------------- What you get --------------------------- */}
        <section aria-labelledby="deliverables-heading" className="mt-20">
          <SectionHeader
            as="div"
            id="deliverables-heading"
            size="compact"
            eyebrow="[ 01 // ΤΙ ΠΑΙΡΝΕΤΕ ]"
            title="Τι παραδίδεται, συγκεκριμένα."
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DELIVERABLES.map((item) => (
              <Card as="li" key={item.title} className="p-5">
                <h3 className="text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-zinc-400">
                  {item.body}
                </p>
              </Card>
            ))}
          </ul>
        </section>

        {/* ----------------------------- Who for ------------------------------ */}
        <section aria-labelledby="audience-heading" className="mt-20">
          <SectionHeader
            as="div"
            id="audience-heading"
            size="compact"
            eyebrow="[ 02 // ΓΙΑ ΠΟΙΟΥΣ ]"
            title="Πότε αξίζει να μιλήσουμε."
          />

          <ul className="mt-8 max-w-3xl space-y-3">
            {AUDIENCE.map((line) => (
              <li
                key={line}
                className="flex items-baseline gap-3 text-sm leading-relaxed text-zinc-400"
              >
                <span aria-hidden className="shrink-0 text-decor">
                  •
                </span>
                {line}
              </li>
            ))}
          </ul>
        </section>

        {/* ---------------------------- How it runs --------------------------- */}
        {/* One sentence and a link, not a restatement of the three steps. The
            steps live in `ProcessSection` today and move to `lib/process.ts`
            in S2.6; writing them out here would have made a fourth
            hand-typed copy of a promise that is supposed to exist once. The
            two constants below are interpolated for the same reason. */}
        <section aria-labelledby="how-heading" className="mt-20">
          <SectionHeader
            as="div"
            id="how-heading"
            size="compact"
            eyebrow="[ 03 // ΠΩΣ ΤΡΕΧΕΙ ]"
            title="Πώς φτάνουμε από τη συζήτηση στο site."
            lede={`Ξεκινάμε με ένα δωρεάν audit — παίρνετε ${AUDIT_DELIVERABLE}. Μετά συμφωνούμε το εύρος πριν γραφτεί γραμμή κώδικα, και η κατασκευή παραδίδεται σε στάδια, με preview URL σε κάθε ένα. Ο χρόνος είναι ${TIMELINE_RANGE} — εύρος, όχι υπόσχεση.`}
          />

          <Link
            href="/process"
            className="group mt-6 inline-flex min-h-tap items-center gap-1.5 text-sm text-zinc-300 transition-colors duration-200 hover:text-white"
          >
            Η διαδικασία, αναλυτικά
            <ArrowRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.8}
            />
          </Link>
        </section>

        {/* -------------------------- What you keep --------------------------- */}
        <section aria-labelledby="ownership-heading" className="mt-20">
          <SectionHeader
            as="div"
            id="ownership-heading"
            size="compact"
            eyebrow="[ 04 // ΤΙ ΣΑΣ ΜΕΝΕΙ ]"
            title="Τι έχετε στο χέρι σας στο τέλος."
            lede="Το repository, τον κώδικα και τεκμηριωμένη εγκατάσταση. Δεν υπάρχει κλείδωμα σε πλατφόρμα, σε λογαριασμό ή σε πρόσωπο — αν αύριο θέλετε άλλον developer, ανοίγει το έργο και συνεχίζει. Η μηνιαία υποστήριξη είναι προαιρετική, όχι προϋπόθεση για να μείνει το site όρθιο."
          />

          {/* §11.6: the objection gets answered here in structure, and the
              full answer lives in the FAQ rather than in two places. */}
          <Card tone="glass" className="mt-8 max-w-3xl p-5">
            <Eyebrow variant="label">Γιατί όχι WordPress</Eyebrow>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              Δεν πουλάμε Next.js σε όποιον χρειάζεται ένα blog — αν το
              WordPress κάνει τη δουλειά, θα σας το πούμε. Η διαφορά φαίνεται
              όταν το site πρέπει να κάνει κάτι: λογαριασμούς χρηστών,
              σύνδεση με τα εργαλεία που ήδη χρησιμοποιείτε, δικά σας δεδομένα.
            </p>

            <Link
              href="/faq"
              className="group mt-4 inline-flex min-h-tap items-center gap-1.5 font-mono text-mono-xs text-ink-faint transition-colors duration-200 hover:text-white"
            >
              Οι υπόλοιπες ερωτήσεις
              <ArrowRight
                aria-hidden
                className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
          </Card>
        </section>

        {/* ------------------------------- CTA -------------------------------- */}
        <section aria-labelledby="cta-heading" className="mt-20">
          <Card className="p-6 sm:p-8">
            <h2
              id="cta-heading"
              className="max-w-2xl text-2xl font-semibold leading-snug text-white sm:text-3xl"
            >
              Πείτε μας τι θέλετε να φτιάξετε.
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
      </div>
    </>
  );
}
