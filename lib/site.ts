/**
 * Single source of truth for identity, contact details and coordinates.
 *
 * These values appear in the navbar, hero, contact card, footer AND the
 * JSON-LD payload. Structured data that disagrees with the on-page content is
 * a genuine local-SEO liability (search engines cross-check NAP), so the only
 * safe arrangement is one constant read by every surface.
 */

/** Canonical origin. Set NEXT_PUBLIC_SITE_URL per environment before launch. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://yourdomain.gr";

/* Opening hours live here as two values and are formatted into every other
   representation below — UI copy, the schema string and the schema spec — so
   a change to trading hours is a two-line edit that cannot desync. */
const OPENS = "10:00";
const CLOSES = "15:00";

const PHONE_TEL = "+306988327654";
/** Telegram profile URLs are always t.me/<username> — from the @VALSAMIST QR. */
const TELEGRAM_USERNAME = "valsamist";

export const SITE = {
  brand: "Valsamis",
  siteName: "Valsamis Studio",
  /** Legal/registered name used in structured data. */
  legalName: "Tavlikos Web Development & AI Automations",
  url: SITE_URL,

  phoneDisplay: "+30 6988327654",
  phoneTel: PHONE_TEL,
  email: "hello@domain.gr",

  hours: { opens: OPENS, closes: CLOSES },
  hoursShort: `${OPENS} - ${CLOSES}`,
  hoursLong: `Δευτ – Παρ, ${OPENS} – ${CLOSES}`,
  openingHoursSchema: [`Mo-Fr ${OPENS}-${CLOSES}`],

  geo: { latitude: 40.6401, longitude: 22.9444 },
  geoStamp: "40.6401° N, 22.9444° E",
  locality: "Thessaloniki, Euosmos",
  region: "Central Macedonia",
  country: "GR",
  locationLabel: "Θεσσαλονίκη, Ελλάδα (Remote Worldwide)",

  social: {
    /* Share/QR tracking params (stkn, mibextid, utm_source) stripped — they
       are tied to a single share session and don't belong in public markup. */
    instagram: "https://www.instagram.com/tavlikos.v",
    facebook: "https://www.facebook.com/share/18AUCxS32W/",
    /* Built from the number rather than the wa.me/qr/… short link: a QR token
       breaks if the code is ever regenerated, the number-based form doesn't. */
    whatsapp: `https://wa.me/${PHONE_TEL.replace("+", "")}`,
    telegram: `https://t.me/${TELEGRAM_USERNAME}`,
  },
} as const;

/**
 * Profile URLs that unambiguously identify the same entity, for schema
 * `sameAs`. WhatsApp is deliberately excluded: wa.me is a chat deeplink, not
 * a profile page, so it doesn't belong in an identity assertion.
 */
export const SAME_AS = [
  SITE.social.instagram,
  SITE.social.facebook,
  SITE.social.telegram,
] as const;

/** Capability list — feeds both `knowsAbout` and the offer catalog. */
export const SERVICE_CATALOG = [
  "Custom Web Development (Next.js, TypeScript)",
  "Business Process Automation (n8n, Workflows)",
  "AI Concierge & Voice/Chat Agents",
  "Lead Generation & Outreach Pipelines",
  "Client Portals & Admin Dashboards",
] as const;
