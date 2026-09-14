import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/lib/utils";

/* Operational facts, stated flatly. These answer what a Greek business
   actually asks before calling: what exactly do I get, how fast, from where,
   and what am I signing up to. The first line is the audit's definition —
   an undefined "free audit" is a promise nobody can hold you to, which cuts
   both ways. */
const GUARANTEES = [
  "Τι παίρνετε: κλήση 15 λεπτών και σύντομη γραπτή σύνοψη με τις τρεις πρώτες κινήσεις",
  "Χρόνος απόκρισης: εντός 24 ωρών",
  "Τοποθεσία: Θεσσαλονίκη — εξυπηρέτηση πανελλαδικά και remote",
  "Χωρίς δεσμεύσεις: το εύρος και η παράδοση συμφωνούνται γραπτά πριν ξεκινήσουμε",
] as const;

/* One string for the three alternative-channel links, which were three
   identical copies of it. Not a `Badge`: these are rounded-lg action rows
   with their own padding, and forcing them into the pill primitive would
   have changed their geometry. */
const CHANNEL_LINK =
  "inline-flex min-h-tap items-center gap-2 rounded-lg border border-hairline bg-white/[0.02] px-3 py-2 font-mono text-mono-xs text-zinc-300 transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.05] hover:text-white";

/**
 * Credibility and an immediate, form-free way to make contact — for visitors
 * who would rather call than fill anything in.
 *
 * **Two layouts, one set of strings.** On the homepage this is the narrow
 * left rail of the conversion section; on `/contact` the same content is the
 * page's subject rather than a sidebar, so it spreads into a grid. The phase
 * spec's rule is that a deeper page changes the emphasis and never the copy,
 * which is why this is a `layout` prop and not a second component with a
 * second set of sentences to keep in sync.
 *
 * DOM order is identical in both: phone, then what you get, then the
 * alternative channels. How to reach us now, before the small print.
 *
 * The section heading moved out to `ConversionSection` in S2.2. It was never
 * this component's to own — it titles the whole conversion section, and
 * `/contact` needs its own `h1` above a differently-shaped block.
 *
 * **The rail returns a fragment and only the grid gets a wrapper.** Wrapping
 * both would leave the homepage with an unstyled `div` between the heading
 * and the first card, which is where a `mt-8` quietly becomes a collapsed
 * margin on a different element. No wrapper, no question to answer.
 */
export default function DirectContactCard({
  layout = "rail",
}: {
  layout?: "rail" | "wide";
}) {
  const wide = layout === "wide";

  const blocks = (
    <>
      {/* -------------------------- Direct line -------------------------- */}
      <Card className={cn("p-5", !wide && "mt-8")}>
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
      <ul className={cn("space-y-2.5", wide ? "sm:px-1" : "mt-6")}>
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
      {/* The rule above is a divider between stacked blocks. In the grid the
          gap already separates them, and a stray top border would read as a
          cell edge in a table that does not exist. */}
      <div className={cn(!wide && "mt-8 border-t border-hairline pt-6")}>
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
    </>
  );

  if (!wide) return blocks;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:items-start">
      {blocks}
    </div>
  );
}
