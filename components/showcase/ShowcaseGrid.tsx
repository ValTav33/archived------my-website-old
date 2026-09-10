"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn, scrollToId } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Case data                                                          */
/* ------------------------------------------------------------------ */

type ShowcaseCase = {
  id: string;
  category: string;
  title: string;
  problem: string;
  solution: string;
  stack: readonly string[];
  metrics: readonly string[];
  /* Ordered hops of the system's data flow, rendered as a terminal trace. */
  architecture: readonly string[];
};

const CASES: readonly ShowcaseCase[] = [
  {
    id: "ai-concierge",
    category: "Αυτοματισμοί AI • Φιλοξενία & Ιατρεία",
    title: "Αυτόνομο AI Concierge Portal & 24/7 Εξυπηρέτηση",
    problem:
      "Χιλιάδες επαναλαμβανόμενες ερωτήσεις επισκεπτών (κρατήσεις, οδηγίες, check-in) δεσμεύουν ώρες καθημερινής ανθρώπινης επικοινωνίας και προκαλούν καθυστερήσεις.",
    solution:
      "Ανάπτυξη custom web portal με ενσωματωμένο πολύγλωσσο Voice & Text AI agent, συνδεδεμένο σε πραγματικό χρόνο με τη βάση γνώσεων και το σύστημα κρατήσεων της επιχείρησης.",
    stack: ["Next.js", "Voice AI / Vapi", "n8n", "Supabase"],
    metrics: [
      "Άμεση απόκριση, χωρίς αναμονή",
      "Αυτόνομη λειτουργία 24/7",
      "Check-in χωρίς ανθρώπινη παρέμβαση",
    ],
    architecture: [
      "Client Audio/Text",
      "Vapi LLM",
      "n8n Webhook",
      "Supabase DB",
      "Instant Dynamic Response",
    ],
  },
  {
    id: "client-portal",
    category: "Κατασκευή web εφαρμογών • Ιατρικά & Συμβουλευτική",
    title: "Custom Web Application & Ενοποιημένο Client Portal",
    problem:
      "Κατακερματισμένα δεδομένα σε emails και WhatsApp. Χάσιμο χρόνου σε χειροκίνητη αποστολή φορμών, ερασιτεχνική εικόνα προς τους πελάτες και έλλειψη κεντρικού ελέγχου.",
    solution:
      "Κατασκευή bespoke web εφαρμογής με ασφαλές περιβάλλον διαχείρισης (Admin Dashboard), ρόλους χρηστών, αυτόματο onboarding και κεντρική αποθήκευση εγγράφων.",
    stack: ["Next.js", "Tailwind CSS", "Secure Auth", "PostgreSQL"],
    metrics: [
      "Όλα τα δεδομένα σε ένα σημείο",
      "Τα αρχεία βρίσκονται χωρίς αναζήτηση",
      "Επαγγελματικό περιβάλλον χρήσης",
    ],
    architecture: [
      "Secure Auth",
      "Role Gate (Admin/Client)",
      "S3/Cloud Storage",
      "Real-time Status Sync",
    ],
  },
  {
    id: "lead-engine",
    category: "Υποδομή δεδομένων • B2B agencies",
    title: "Αυτοματοποιημένο Pipeline Συλλογής & Εμπλουτισμού Leads",
    problem:
      "Χειροκίνητο copy-paste από spreadsheets, ανεπιβεβαίωτα emails που καταλήγουν στα spam και αργή δρομολόγηση νέων ευκαιριών.",
    solution:
      "End-to-end αυτοματοποιημένο pipeline που αναζητά, επικυρώνει (waterfall verification), βαθμολογεί με AI και τροφοδοτεί άμεσα τα κατάλληλα leads στο CRM.",
    stack: ["n8n / Make", "Enrichment APIs", "AI Scoring", "CRM Sync"],
    metrics: [
      "Χωρίς χειροκίνητη καταχώριση δεδομένων",
      "Αυτόματη αξιολόγηση και καθαρισμός leads",
      "Άμεση κλιμάκωση του όγκου επικοινωνίας",
    ],
    architecture: [
      "Inbound/List Trigger",
      "Waterfall Verification",
      "AI Relevancy Filter",
      "CRM / Outreach Tool",
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */

export default function ShowcaseGrid() {
  return (
    <section
      id="solutions"
      className="scroll-mt-24 py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* ---------------------------- Header --------------------------- */}
        <header className="max-w-3xl">
          {/* Emerald is reserved for live status dots — playbook §2.4. Both
              section eyebrows use the neutral label token. */}
          <p className="font-mono text-xs tracking-wider text-ink-ghost">
            [ 01 // ΕΝΔΕΙΚΤΙΚΕΣ ΑΡΧΙΤΕΚΤΟΝΙΚΕΣ ]
          </p>

          {/* Named "ενδεικτικές" on purpose. These describe systems we build,
              not projects we have shipped and can name — content truth policy
              §8.2. The heading has to say so before the cards do. */}
          <h2 className="mt-4 text-3xl font-semibold leading-[1.15] tracking-[-0.025em] text-white sm:text-4xl lg:text-[2.75rem]">
            Ενδεικτικές Αρχιτεκτονικές.
          </h2>

          <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
            Οι αρχιτεκτονικές που ακολουθούν περιγράφουν συστήματα που
            κατασκευάζουμε — όχι δημοσιευμένα έργα πελατών. Τα πρώτα ονομαστικά
            case studies προστίθενται σύντομα.
          </p>
        </header>

        {/* ----------------------------- Grid ---------------------------- */}
        {/* Cards stretch to a common row height, so every "View Architecture"
            button pins to the same baseline (that is what `justify-between`
            on the card is for). Expanding one panel grows the row, which is
            the expected behaviour for an accordion inside a grid. */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CASES.map((item) => (
            <ShowcaseCard key={item.id} item={item} />
          ))}
        </div>

        {/* --------------------- Transition banner ----------------------- */}
        <div className="mt-14 flex flex-col items-start justify-between gap-5 rounded-xl border border-white/[0.08] bg-white/[0.015] px-6 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-zinc-400 sm:text-[15px]">
            Χρειάζεστε ένα custom σύστημα προσαρμοσμένο στις δικές σας
            λειτουργίες;
          </p>

          <button
            type="button"
            onClick={() => scrollToId("audit")}
            className="btn-primary shrink-0 px-5 py-3 text-[13px]"
          >
            Σχεδιάστε τη λύση σας — Κλείστε ένα 15-λεπτο Audit
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Card                                                               */
/* ------------------------------------------------------------------ */

function ShowcaseCard({ item }: { item: ShowcaseCase }) {
  /* Each card owns its disclosure state, so opening one architecture panel
     never collapses another — visitors can compare two systems side by side. */
  const [open, setOpen] = useState(false);
  const panelId = `${item.id}-architecture`;

  return (
    <article className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0D0F16] p-6 transition-colors duration-300 hover:border-white/[0.18]">
      <div>
        {/* Category */}
        <span className="inline-block rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-300">
          {item.category}
        </span>

        <h3 className="mt-5 text-lg font-semibold leading-snug text-zinc-100">
          {item.title}
        </h3>

        {/* Problem / solution, labelled like an engineering brief. */}
        <div className="mt-5 space-y-4">
          <Field label="Πρόβλημα" body={item.problem} />
          <Field label="Λύση" body={item.solution} />
        </div>

        {/* Stack */}
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {item.stack.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 font-mono text-xs text-zinc-300"
            >
              {tech}
            </li>
          ))}
        </ul>

        {/* Impact — stacked rather than inline, so long Greek metrics stay on
            one line each instead of wrapping mid-phrase. */}
        <ul className="mt-5 flex flex-col items-start gap-1.5">
          {item.metrics.map((metric) => (
            <li
              key={metric}
              className="flex items-baseline gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 font-mono text-[11px] text-zinc-400"
            >
              <span aria-hidden className="text-decor">
                •
              </span>
              {metric}
            </li>
          ))}
        </ul>
      </div>

      {/* --------------------- Architecture disclosure -------------------- */}
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 font-mono text-[11.5px] text-zinc-300 transition-colors duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
        >
          Τεχνική αρχιτεκτονική
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform duration-300",
              open && "rotate-180",
            )}
            strokeWidth={2}
          />
        </button>

        {/* `initial={false}` stops every card from animating its (closed)
            panel on mount — only real user toggles animate. */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              key="panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <ArchitectureTrace nodes={item.architecture} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Card internals                                                     */
/* ------------------------------------------------------------------ */

function Field({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
        {label}
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

/**
 * The data flow rendered as a terminal trace. Uses the same dashed-connector
 * language as the hero's pipeline monitor so both widgets read as one system.
 */
function ArchitectureTrace({ nodes }: { nodes: readonly string[] }) {
  return (
    <div className="mt-3 rounded-lg border border-white/[0.07] bg-obsidian-950/70 p-3.5">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
        $ trace --flow
      </p>

      <ol className="mt-3">
        {nodes.map((node, index) => (
          <li key={node}>
            <div className="flex items-baseline gap-2.5 font-mono text-[11.5px]">
              <span className="shrink-0 text-ink-ghost tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-zinc-300">{node}</span>
            </div>

            {index < nodes.length - 1 && (
              <div
                aria-hidden
                className="my-1 ml-[7px] h-3 w-px border-l border-dashed border-zinc-700"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
