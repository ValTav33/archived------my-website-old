import { ArrowUp } from "lucide-react";
import { FOOTER_LINKS, NAV_LINKS, navHref } from "@/lib/nav";
import { SITE } from "@/lib/site";
import Badge from "@/components/ui/Badge";
import Eyebrow from "@/components/ui/Eyebrow";
import StatusDot from "@/components/ui/StatusDot";

/* Capability tracks, phrased for humans rather than for the schema. */
const CORE_TRACKS = [
  "Κατασκευή ιστοσελίδων & web εφαρμογών (Next.js)",
  "AI εξυπηρέτηση πελατών & φωνητικοί agents",
  "Αυτοματισμοί leads & εμπλουτισμός δεδομένων",
  "Custom dashboards για πελάτες",
] as const;

const SOCIAL_LINKS = [
  { label: "Instagram", href: SITE.social.instagram },
  { label: "Facebook", href: SITE.social.facebook },
  { label: "WhatsApp", href: SITE.social.whatsapp },
  { label: "Telegram", href: SITE.social.telegram },
] as const;

/* Rendered at build time; refreshes on every deploy rather than going stale
   in a hardcoded string. */
const YEAR = new Date().getFullYear();

/**
 * Telemetry-style footer.
 *
 * Every in-page link here is a plain anchor: the global
 * `html { scroll-behavior: smooth }` already animates them, so this whole
 * section stays a server component and ships zero JavaScript.
 */
export default function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* ---------------- Col 1 · Identity & coordinates -------------- */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
                {SITE.brand}
              </span>
            </div>

            <p className="mt-4 font-mono text-mono-xs text-ink-faint tabular-nums">
              {SITE.geoStamp}
            </p>
            <p className="mt-1 text-xs text-zinc-400">
              {SITE.locationLabel}
            </p>

            {/* Status pill — the single chromatic element in the footer. The
                dot signals availability for work, which is a fact we control,
                not uptime, which we owe nobody. */}
            <Badge variant="status" className="mt-5 tracking-wider">
              <StatusDot />
              Διαθέσιμοι για νέα projects
            </Badge>
          </div>

          {/* -------------------- Col 2 · Core tracks --------------------- */}
          <div>
            <Eyebrow as="h3" variant="label">
              Υπηρεσίες
            </Eyebrow>
            {/* Plain text, not links: there are no dedicated service pages
                yet, and a link to nowhere is worse than no link. */}
            <ul className="mt-4 space-y-2.5">
              {CORE_TRACKS.map((track) => (
                <li key={track} className="text-xs leading-relaxed text-zinc-400">
                  {track}
                </li>
              ))}
            </ul>
          </div>

          {/* --------------------- Col 3 · Navigation --------------------- */}
          <div>
            <Eyebrow as="h3" variant="label">
              Πλοήγηση
            </Eyebrow>
            <ul className="mt-4 space-y-2.5">
              {[...NAV_LINKS, ...FOOTER_LINKS].map((link) => (
                <li key={link.id}>
                  <a
                    href={navHref(link)}
                    className="text-xs text-zinc-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ------------------ Col 4 · Social & protocols ---------------- */}
          <div>
            <Eyebrow as="h3" variant="label">
              Επικοινωνία
            </Eyebrow>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 transition-colors duration-200 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#"
              className="group mt-5 inline-flex items-center gap-1.5 font-mono text-mono-xs text-ink-faint transition-colors duration-200 hover:text-white"
            >
              Επιστροφή στην αρχή
              <ArrowUp
                className="h-3 w-3 transition-transform duration-200 group-hover:-translate-y-0.5"
                strokeWidth={2}
              />
            </a>
          </div>
        </div>

        {/* ---------------------------- Sub-bar --------------------------- */}
        <div className="mt-12 flex flex-col gap-2 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-mono-xs text-ink-ghost">
            © {YEAR}. Κατασκευασμένο με Next.js, Tailwind &amp; TypeScript.
          </p>
          <p className="font-mono text-mono-xs text-ink-ghost">
            Ο κώδικας παραδίδεται δικός σας — χωρίς εξάρτηση από πλατφόρμα.
          </p>
        </div>
      </div>
    </footer>
  );
}
