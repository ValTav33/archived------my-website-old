/**
 * Single source of truth for identity, contact details and coordinates.
 *
 * These values appear in the navbar, hero, contact card, footer AND the
 * JSON-LD payload. Structured data that disagrees with the on-page content is
 * a genuine local-SEO liability (search engines cross-check NAP), so the only
 * safe arrangement is one constant read by every surface.
 */

/**
 * Canonical origin. Required — there is deliberately no fallback.
 *
 * This value ends up in the canonical link, `metadataBase`, every Open Graph
 * tag and the JSON-LD `@id`. A default would let a misconfigured deployment
 * ship a site that quietly points search engines at a domain we do not own,
 * and nothing about the running site would look wrong. A build that fails is
 * strictly better than a build that lies.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!rawUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required. Set it in .env.local and in the Vercel project.",
  );
}

export const SITE_URL = rawUrl.replace(/\/$/, "");

/**
 * Trading hours, as the two windows they actually are: a morning block and an
 * evening block, with the afternoon closed. Every representation below — UI
 * copy, the schema strings and the schema spec — is derived from this array,
 * so a change to trading hours is one edit that cannot desync.
 */
const HOURS = [
  { opens: "10:00", closes: "15:00" },
  { opens: "18:30", closes: "21:00" },
] as const;

/** "10:00–15:00 & 18:30–21:00" */
const HOURS_SHORT = HOURS.map((h) => `${h.opens}–${h.closes}`).join(" & ");

const PHONE_TEL = "+306988327654";
/** Telegram profile URLs are always t.me/<username> — from the @VALSAMIST QR. */
const TELEGRAM_USERNAME = "valsamist";

export const SITE = {
  /* One name, used everywhere. Three different ones used to appear across the
     codebase — brand, siteName and a separate legalName — which is how a site
     ends up introducing itself differently in the navbar, the OG card and the
     structured data. */
  brand: "Tavlikos Systems",
  siteName: "Tavlikos Systems",
  /** Name used in structured data. Not a registered entity — see playbook §2.2. */
  legalName: "Tavlikos Systems",
  url: SITE_URL,

  phoneDisplay: "+30 6988327654",
  phoneTel: PHONE_TEL,
  email: "info@tavlikossystems.com",

  hours: HOURS,
  hoursShort: HOURS_SHORT,
  hoursLong: `Δευτ – Παρ, ${HOURS_SHORT}`,
  openingHoursSchema: HOURS.map((h) => `Mo-Fr ${h.opens}-${h.closes}`),

  geo: { latitude: 40.6401, longitude: 22.9444 },
  geoStamp: "40.6401° N, 22.9444° E",
  locality: "Thessaloniki, Euosmos",
  region: "Central Macedonia",
  country: "GR",
  locationLabel: "Θεσσαλονίκη, Ελλάδα — εξυπηρέτηση remote",

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
