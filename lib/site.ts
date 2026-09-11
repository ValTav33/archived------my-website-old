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
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

if (!rawUrl) {
  throw new Error(
    "NEXT_PUBLIC_SITE_URL is required and must not be empty. Set it in " +
      ".env.local and in the Vercel project, for every environment " +
      "(Production, Preview and Development), e.g. https://tavlikossystems.com",
  );
}

/**
 * Validates the origin and normalises it to `scheme://host`, dropping any
 * path, query or trailing slash.
 *
 * A truthiness check alone is not enough. `NEXT_PUBLIC_SITE_URL` set to an
 * empty string once shipped a production deploy that died on
 * `new URL("")` with a bare `TypeError: Invalid URL` and no mention of the
 * variable — the value came from a Vercel entry whose key existed and whose
 * value did not. A schemeless `tavlikossystems.com` fails the same opaque
 * way. Both are configuration mistakes, so both should say so.
 */
function assertOrigin(value: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid URL: ${JSON.stringify(value)}. ` +
        "It must include the scheme, e.g. https://tavlikossystems.com",
    );
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be http or https, got ${JSON.stringify(parsed.protocol)}.`,
    );
  }

  return `${parsed.protocol}//${parsed.host}`;
}

export const SITE_URL = assertOrigin(rawUrl);

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
  /* The person. Playbook §2.1 lists him under Identity; until S1.8 he
     appeared nowhere on the site. The about section names him because its
     own heading asks «Με ποιον θα δουλέψετε» — a question the page should
     not pose and then dodge, and because the §12 risk register says the
     solo-operator objection is the one that kills deals silently. Naming one
     real person is the maximally §2.1-compliant move: the guardrail forbids
     claiming MORE people, never stating the actual one. Phase 2's `/about`
     route and its `Person` schema read this. */
  person: "Βαλσάμης Ταυλίκος",
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

  /* Availability for work — a fact we control, unlike uptime, which we owe
     nobody. Printed beside a `StatusDot` in the hero, the footer and the
     about section; the day this stops being true it has to stop being true
     in one place, not three. */
  availability: "Διαθέσιμοι για νέα projects",

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

/* ------------------------------------------------------------------ */
/*  Delivered work                                                     */
/* ------------------------------------------------------------------ */

/**
 * Work that has actually shipped, kept here rather than inside the component
 * so Phase 2's `/work` index reads this array instead of forking the copy.
 *
 * Everything below traces to a decision-log row or to Val's own words:
 * BTL Industries is cleared for naming (playbook §14, 2026-09-09, freelance
 * engagement with no NDA in force) and `roz-inn.com` is confirmed live and
 * linkable (§14, same date; re-checked 2026-09-11, HTTP 200).
 *
 * Two rules govern additions here:
 *
 *   §8.1  No numbers. Not leads processed, not emails sent, not match rates.
 *   §8.5  If it is not built, it is not on the page. roz-inn.com's booking
 *         and payment build is in progress, so it is absent — it goes in the
 *         day it ships, not as "σε εξέλιξη", which reads as padding.
 */
export type ProofItem = {
  id: string;
  /** Typeset name only. A logo needs permission separate from a name. */
  name: string;
  /** What it is, in three or four words. */
  kind: string;
  /** What it does for the client — outcome before mechanism, §11.4. */
  summary: string;
  /** A URL a visitor can open right now, when one exists. */
  href?: string;
  /** Tooling, rendered as badges. Only what was genuinely used. */
  stack?: readonly string[];
};

export const PROOF: readonly ProofItem[] = [
  {
    id: "btl",
    name: "BTL Industries",
    kind: "Κατασκευαστής ιατροτεχνολογικού εξοπλισμού",
    /* The vendor names are deliberately NOT in this sentence. A clinic owner
       reading "FullEnrich, BetterContact, ZoomInfo" learns nothing and hears
       someone else's suppliers; what the system DOES is the claim. The tools
       go in the badge row underneath, where they read as evidence. */
    summary:
      "Βρίσκει και επιβεβαιώνει στοιχεία επικοινωνίας, μελετά κάθε υποψήφιο πελάτη, γράφει προσωποποιημένο πρώτο email και φορτώνει την καμπάνια.",
    stack: [
      "FullEnrich",
      "BetterContact",
      "ZoomInfo",
      "LinkedIn",
      "Google Sheets",
      "Perplexity",
      "OpenAI",
      "Instantly",
    ],
  },
  {
    id: "roz-inn",
    name: "roz-inn.com",
    kind: "Ζωντανός ιστότοπος πελάτη",
    summary: "Ιστοσελίδα παρουσίασης με γκαλερί φωτογραφιών.",
    /* Resolves to www. with a redirect; the bare form is linked because it is
       also what the card displays, and a link that reads differently from
       where it goes is its own small dishonesty. */
    href: "https://roz-inn.com",
  },
] as const;

/**
 * Client quotes. **Deliberately empty.**
 *
 * `ProofStrip` renders nothing at all while this is empty — no skeleton, no
 * "coming soon", no greyed-out card. Phase 0 spent eight slices removing
 * placeholders and this is exactly the shape one grows back in.
 *
 * Fills in Phase 5, once Val picks the Fiverr quotes (open question Q4).
 * §8.4: every quote is attributed — a name, or role + sector + city.
 */
export type Testimonial = {
  quote: string;
  /** Name, or role + sector + city. Anonymous praise reads as invented. */
  attribution: string;
};

export const TESTIMONIALS: readonly Testimonial[] = [];

/* ------------------------------------------------------------------ */
/*  The two promises                                                   */
/* ------------------------------------------------------------------ */

/**
 * What the free audit actually delivers, playbook §2.2, as **one string**.
 *
 * This sentence is the site's only concrete promise, and it now appears in the
 * audit form and in the process section. Two hand-typed copies of a promise is
 * how a site ends up offering a 15-minute call in one place and a 20-minute
 * call in another, and the visitor who spots it stops believing the rest of
 * the page. Both surfaces interpolate this constant, so they cannot disagree.
 *
 * Written lowercase and unterminated so it can be embedded in a sentence
 * ("Θα λάβετε …", "Παίρνετε …") without the grammar fighting the constant.
 */
export const AUDIT_DELIVERABLE =
  "κλήση 15 λεπτών και σύντομη γραπτή σύνοψη με τις τρεις πρώτες κινήσεις, εντός 24 ωρών";

/**
 * Delivery time, playbook §2.2. **A range, never a promise**, and never an
 * average — an "average delivery time" is a number nobody can defend in a
 * sales call, which is what §8.1 exists to prevent.
 *
 * Phase 1's FAQ answers «Πόσο θα πάρει;» with this same constant.
 */
export const TIMELINE_RANGE = "3 ημέρες έως 2 μήνες, ανάλογα με το εύρος";
