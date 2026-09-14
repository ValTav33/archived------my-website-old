import { AUDIT_DELIVERABLE, TIMELINE_RANGE } from "@/lib/site";

/**
 * The three steps of an engagement, as **data** — the move `lib/faq.ts` made
 * for the same reason.
 *
 * Two surfaces render these: the homepage section keeps `summary`, one
 * sentence per step, and `/process` renders `detail`. D1's rule is that a
 * deeper page *expands* and never copies, so the two halves are deliberately
 * disjoint: nothing in `detail` restates a `summary`, and a visitor who
 * reads both does not read the same sentence twice.
 *
 * Step 01's summary interpolates `AUDIT_DELIVERABLE` and step 02's
 * `TIMELINE_RANGE`. That is not tidiness — S1.7's exit condition was that the
 * audit description match the form's promise character for character, and
 * paraphrasing it here to save a line would quietly undo a Phase 1 property.
 * A promise that is retyped is a promise that drifts.
 *
 * **`costsYou` is the field this page exists for.** Every process section on
 * every agency site says what the agency does; almost none say what the
 * client has to spend. It is also the field most likely to attract an
 * invented number — "about two hours a week" is exactly the figure §8.1
 * exists to keep off the page — so only the audit call is quantified, and
 * only because §2.2 defines it.
 */
export type ProcessStep = {
  n: string;
  title: string;
  /** One sentence. The homepage highlight. */
  summary: string;
  /** The expansion. `/process` only. */
  detail: {
    /** What actually happens in this step. */
    what: string;
    /** What the client has to supply for it to proceed. */
    provides: string;
    /** What they hold at the end of it. */
    gets: string;
    /** What it costs them — their hours, not ours. */
    costsYou: string;
  };
};

export const PROCESS: readonly ProcessStep[] = [
  {
    n: "01",
    title: "Δωρεάν audit",
    summary: `Παίρνετε ${AUDIT_DELIVERABLE} — χωρίς κόστος και χωρίς δέσμευση να συνεχίσετε.`,
    detail: {
      what: "Μιλάμε για το τι κάνει η επιχείρησή σας και τι σας κοστίζει χρόνο σήμερα. Δεν είναι παρουσίαση — είναι ερωτήσεις.",
      provides:
        "Μια περιγραφή του τι θέλετε να λύσετε. Δεν χρειάζεται προδιαγραφή, ούτε να ξέρετε τι τεχνολογία θέλετε· αυτό είναι δουλειά μας.",
      gets: "Γραπτή σύνοψη με τις τρεις πρώτες κινήσεις που θα κάναμε, είτε συνεχίσουμε μαζί είτε όχι.",
      costsYou: "Την κλήση, και λίγη σκέψη πριν από αυτήν. Τίποτα άλλο.",
    },
  },
  {
    n: "02",
    title: "Σχεδιασμός & κατασκευή",
    summary: `Συμφωνούμε το εύρος και χτίζουμε σε στάδια, με preview URL σε κάθε ένα· ο χρόνος είναι ${TIMELINE_RANGE}.`,
    detail: {
      what: "Συμφωνούμε γραπτά τι μπαίνει και τι δεν μπαίνει, πριν γραφτεί γραμμή κώδικα. Μετά χτίζουμε σε στάδια, αντί για μία παράδοση στο τέλος που είτε είναι σωστή είτε δεν είναι.",
      provides:
        "Περιεχόμενο — κείμενα, φωτογραφίες, λογότυπο — και απόφαση όταν κάτι χρειάζεται τη δική σας.",
      gets: "Ένα preview URL που ανοίγει σε κάθε στάδιο, οπότε βλέπετε την πρόοδο χωρίς να τη ζητήσετε.",
      costsYou:
        "Όσο χρειάζεται για να ανοίξετε το preview και να πείτε τι θέλετε αλλιώς. Δεν υπάρχουν εβδομαδιαίες συναντήσεις αν δεν τις θέλετε.",
    },
  },
  {
    n: "03",
    title: "Παράδοση & υποστήριξη",
    summary:
      "Το έργο πηγαίνει live, και τι παραδίδεται και ποιος διαχειρίζεται τι είναι συμφωνημένα από την αρχή. Μηνιαία υποστήριξη μόνο αν τη θέλετε.",
    detail: {
      /* **Rewritten in S3.5 S2 (D1, D2).** This step used to promise that the
         repository passed into the client's name and that any other developer
         could continue without us. Neither is true across all of Val's
         packages, so both are gone — see the phase spec.

         What replaces them is the choice, which is a better sentence anyway:
         the client decides how much account administration they want to own.
         §2.1 still applies — plural voice, singular facts, and no copy here
         may imply staff, in the comments either. */
      what: "Το έργο πηγαίνει live και παραδίδεται με ό,τι έχει συμφωνηθεί γραπτά — τεκμηρίωση, πρόσβαση, και μια διαδρομή μέσα από το έργο.",
      provides:
        "Μια απόφαση: κρατάτε εσείς τους λογαριασμούς όπου ζει το έργο — domain, hosting, ό,τι συνδέεται — ή τους αναλαμβάνουμε εμείς. Εξαρτάται από πόσο χρόνο θέλετε να δίνετε στη διαχείρισή τους, και συμφωνείται πριν την παράδοση.",
      gets: "Ένα έργο που δουλεύει, τεκμηρίωση για το πώς λειτουργεί, και ξεκάθαρο ποιος κρατά τι — γραμμένο από την αρχή, όχι ανακοινωμένο στο τέλος.",
      costsYou:
        "Μία διαδρομή μέσα από το έργο, ώστε να ξέρετε πού βρίσκεται τι.",
    },
  },
] as const;

/** The four labels of a step's detail, in the order they are read. */
export const DETAIL_LABELS = [
  { key: "what", label: "Τι γίνεται" },
  { key: "provides", label: "Τι χρειάζεται από εσάς" },
  { key: "gets", label: "Τι παίρνετε" },
  { key: "costsYou", label: "Πόσο σας κοστίζει σε χρόνο" },
] as const satisfies readonly {
  key: keyof ProcessStep["detail"];
  label: string;
}[];
