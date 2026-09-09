import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { SITE } from "@/lib/site";

/* Operational facts, stated flatly. These answer the three questions a Greek
   business actually has before calling: where are you, how fast do you reply,
   and what does this cost me. */
const GUARANTEES = [
  "Τοποθεσία: Θεσσαλονίκη (Εξυπηρέτηση Πανελλαδικά & Remote)",
  "Χρόνος απόκρισης: < 24 ώρες για κάθε audit",
  "Χωρίς δεσμεύσεις: 100% τεχνική & λειτουργική αξιολόγηση",
] as const;

/**
 * The left rail of the conversion section: credibility and an immediate,
 * form-free way to make contact — for visitors who would rather call than
 * fill anything in.
 */
export default function DirectContactCard() {
  return (
    <div>
      <p className="font-mono text-xs tracking-wider text-ink-faint">
        [ 02 // ΑΜΕΣΗ ΕΠΙΚΟΙΝΩΝΙΑ ]
      </p>

      <h3 className="mt-4 text-2xl font-semibold leading-snug tracking-[-0.02em] text-white sm:text-3xl">
        Ας συζητήσουμε την υποδομή της επιχείρησής σας.
      </h3>

      <p className="mt-5 text-sm leading-relaxed text-zinc-400 sm:text-base">
        Είτε χρειάζεστε ανακατασκευή της ιστοσελίδας σας σε Next.js είτε
        αυτοματοποίηση των καθημερινών σας διαδικασιών, είμαστε διαθέσιμοι για
        άμεση αξιολόγηση.
      </p>

      {/* -------------------------- Direct line -------------------------- */}
      <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#0D0F16] p-5">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-zinc-400">
            <Phone className="h-4 w-4" strokeWidth={1.8} />
          </span>

          <div className="min-w-0">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="block font-mono text-lg font-medium text-white transition-colors duration-200 hover:text-zinc-300 tabular-nums"
            >
              {SITE.phoneDisplay}
            </a>
            <p className="mt-1 font-mono text-[11.5px] text-ink-faint">
              {`Τηλεφωνική εξυπηρέτηση: ${SITE.hoursLong}`}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------- Operational facts ---------------------- */}
      <ul className="mt-6 space-y-2.5">
        {GUARANTEES.map((guarantee) => (
          <li
            key={guarantee}
            className="flex items-baseline gap-2.5 font-mono text-[11.5px] leading-relaxed text-zinc-400"
          >
            <span aria-hidden className="shrink-0 text-decor">
              •
            </span>
            {guarantee}
          </li>
        ))}
      </ul>

      {/* ----------------------- Alternative channels --------------------- */}
      <div className="mt-8 border-t border-white/[0.07] pt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-ghost">
          Εναλλακτικά
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${SITE.email}`}
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-xs text-zinc-300 transition-colors duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.8} />
            {SITE.email}
          </a>

          {/* Now a real deeplink rather than a claim — WhatsApp opens a chat
              on the same number, Telegram opens the profile. */}
          <a
            href={SITE.social.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-xs text-zinc-300 transition-colors duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
          >
            <MessageCircle
              className="h-3.5 w-3.5 text-ink-faint"
              strokeWidth={1.8}
            />
            WhatsApp
          </a>

          <a
            href={SITE.social.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 font-mono text-xs text-zinc-300 transition-colors duration-200 hover:border-white/[0.18] hover:bg-white/[0.05] hover:text-white"
          >
            <Send className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.8} />
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
