import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import SectionHeader from "@/components/ui/SectionHeader";

/* Operational facts, stated flatly. These answer what a Greek business
   actually asks before calling: what exactly do I get, how fast, from where,
   and what am I signing up to. The first line is the audit's definition —
   an undefined "free audit" is a promise nobody can hold you to, which cuts
   both ways. */
const GUARANTEES = [
  "Τι παίρνετε: κλήση 15 λεπτών και σύντομη γραπτή σύνοψη με τις τρεις πρώτες κινήσεις",
  "Χρόνος απόκρισης: εντός 24 ωρών",
  "Τοποθεσία: Θεσσαλονίκη — εξυπηρέτηση πανελλαδικά και remote",
  "Χωρίς δεσμεύσεις: ο κώδικας κάθε έργου παραδίδεται δικός σας",
] as const;

/* One string for the three alternative-channel links, which were three
   identical copies of it. Not a `Badge`: these are rounded-lg action rows
   with their own padding, and forcing them into the pill primitive would
   have changed their geometry. */
const CHANNEL_LINK =
  "inline-flex min-h-tap items-center gap-2 rounded-lg border border-hairline bg-white/[0.02] px-3 py-2 font-mono text-mono-xs text-zinc-300 transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.05] hover:text-white";

/**
 * The left rail of the conversion section: credibility and an immediate,
 * form-free way to make contact — for visitors who would rather call than
 * fill anything in.
 */
export default function DirectContactCard() {
  return (
    <div>
      {/* The conversion section's heading. An h2 rather than an h3 because
          nothing above it in the section carries one — it is the section's
          own title, not a subheading of the form beside it. `compact` because
          this header sits in a column the grid has already narrowed. */}
      <SectionHeader
        as="div"
        id="audit-heading"
        size="compact"
        eyebrow="[ 05 // ΑΜΕΣΗ ΕΠΙΚΟΙΝΩΝΙΑ ]"
        title="Ας συζητήσουμε την υποδομή της επιχείρησής σας."
        lede="Είτε χρειάζεστε ανακατασκευή της ιστοσελίδας σας σε Next.js είτε αυτοματοποίηση των καθημερινών σας διαδικασιών, είμαστε διαθέσιμοι για άμεση αξιολόγηση."
      />

      {/* -------------------------- Direct line -------------------------- */}
      <Card className="mt-8 p-5">
        <div className="flex items-start gap-3.5">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-hairline bg-white/[0.03] text-zinc-400">
            <Phone className="h-4 w-4" strokeWidth={1.8} />
          </span>

          <div className="min-w-0">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="flex min-h-tap items-center font-mono text-lg font-medium text-white transition-colors duration-200 hover:text-zinc-300 tabular-nums"
            >
              {SITE.phoneDisplay}
            </a>
            <p className="mt-1 font-mono text-mono-xs text-ink-faint">
              {`Τηλεφωνική εξυπηρέτηση: ${SITE.hoursLong}`}
            </p>
          </div>
        </div>
      </Card>

      {/* ------------------------- Operational facts ---------------------- */}
      <ul className="mt-6 space-y-2.5">
        {GUARANTEES.map((guarantee) => (
          <li
            key={guarantee}
            className="flex items-baseline gap-2.5 font-mono text-mono-xs leading-relaxed text-zinc-400"
          >
            <span aria-hidden className="shrink-0 text-decor">
              •
            </span>
            {guarantee}
          </li>
        ))}
      </ul>

      {/* ----------------------- Alternative channels --------------------- */}
      <div className="mt-8 border-t border-hairline pt-6">
        <Eyebrow variant="label">Εναλλακτικά</Eyebrow>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <a
            href={`mailto:${SITE.email}`}
            className={CHANNEL_LINK}
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
            className={CHANNEL_LINK}
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
            className={CHANNEL_LINK}
          >
            <Send className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.8} />
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}
