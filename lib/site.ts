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
     route and its `Person` schema read this.

     **Ταβλίκος, with a beta.** It shipped as «Ταυλίκος» from Phase 0 until
     Val caught it on the live site on 2026-09-14 — his own surname,
     misspelled in the `Person` JSON-LD node and in the visible copy of `/`,
     `/about` and `/privacy`. One constant is why the correction is one line
     instead of a sweep, which is the whole argument for the single-source
     rule; it is also why the error was uniform enough to survive four
     phases of review. Do not "fix" this back.

     *Corrected while verifying:* a first draft of this comment claimed the
     name was also burnt into the generated OG cards. It is not — those
     render the page title and eyebrow, not the person. The card was opened
     and looked at rather than assumed, which is the same method that caught
     the Greek all-caps tonos bug in S2.5. */
  person: "Βαλσάμης Ταβλίκος",
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

/**
 * The portrait. **Ships as `null` on purpose.**
 *
 * Val's photo is a Phase 5 asset. While this is `null` every surface renders
 * *nothing* — no frame, no silhouette, no grey circle. Phase 0 spent eight
 * slices removing placeholders and a portrait frame is exactly the shape one
 * grows back in.
 *
 * It lives here rather than in a component because S2.7 gave `/about` a
 * second slot, and two `null`s in two files is two places to remember on the
 * day a photo finally exists. Setting this constant is the whole change.
 */
export const PORTRAIT: { src: string; alt: string } | null = null;

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
  /**
   * URL segment for `/work/[slug]`.
   *
   * Added in S2.4 rather than S2.5, because `/automations` links to the BTL
   * case study and the alternative was a hardcoded `/work/btl-industries`
   * in a page that has no idea whether that path is real. The slug belongs
   * beside the entry it names; S2.5 generates the routes from it.
   *
   * Spelled out rather than derived from `id` — `btl` is a fine object key
   * and a poor URL.
   */
  slug: string;
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
  /**
   * The case-study body. **Optional, and the absence is meaningful.**
   *
   * `/work/[slug]` generates a page only for entries that have one. An entry
   * without a study is a row on the index that links to its live site if it
   * has one, and nowhere if it does not. That is §8.5 as a routing rule: a
   * case study with nothing to say is a thin page that harms the ones with
   * something to say, and «σε εξέλιξη» is padding.
   *
   * `roz-inn` deliberately has none. It is a presentation site with a
   * gallery and a live URL — the URL *is* the evidence, and it beats an
   * internal page that says the same thing in more words. Its booking and
   * payment build is in progress, so it is absent rather than promised; the
   * study goes in the day that ships.
   */
  study?: {
    /**
     * The problem, in the client's terms.
     *
     * Describes the *nature of the work* rather than asserting what the
     * client used to do. We have no documented before-state for BTL, and
     * "they used to copy rows by hand" would be an invented premise — which
     * §8.1 forbids just as much as an invented percentage.
     */
    problem: string;
    /** What was built, as the ordered steps the system actually performs. */
    built: readonly string[];
    /** What the client can see or do now. No metrics (§8.1). */
    now: string;
  };
};

export const PROOF: readonly ProofItem[] = [
  {
    id: "btl",
    slug: "btl-industries",
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
    study: {
      problem:
        "Ένας κατασκευαστής ιατροτεχνολογικού εξοπλισμού απευθύνεται σε κλινικές και διανομείς σε πολλές αγορές. Κάθε υποψήφιος πελάτης χρειάζεται στοιχεία επικοινωνίας που ισχύουν, λίγη έρευνα για το τι κάνει, και ένα πρώτο email που δεν διαβάζεται ως μαζικό. Αυτά τα τρία, πολλαπλασιασμένα, είναι η δουλειά.",
      /* The same vocabulary the homepage's architecture trace uses, in the
         order the pipeline runs. S1.10's closeout translated those nodes;
         reusing the terms means a visitor who read the homepage recognises
         the system rather than meeting a second description of it. */
      built: [
        "Είσοδος από λίστα ή φόρμα",
        "Κλιμακωτή επαλήθευση στοιχείων επικοινωνίας",
        "Έρευνα για κάθε υποψήφιο πελάτη",
        "Φίλτρο καταλληλότητας",
        "Προσωποποιημένο πρώτο email",
        "Φόρτωση στην καμπάνια",
      ],
      now: "Η λίστα φτάνει έτοιμη για αποστολή: στοιχεία επιβεβαιωμένα, κείμενο γραμμένο, καμπάνια φορτωμένη. Ό,τι δεν περάσει την επαλήθευση δεν φεύγει.",
    },
  },
  {
    id: "roz-inn",
    slug: "roz-inn",
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

/** The entries that earn a `/work/[slug]` page. */
export const STUDIED_PROOF = PROOF.filter((item) => item.study);

/** Looks up a delivered-work entry by slug, or `undefined` if there is none. */
export function getProofBySlug(slug: string): ProofItem | undefined {
  return PROOF.find((item) => item.slug === slug);
}

/** Looks up a delivered-work entry by id. Throws rather than returning undefined. */
export function getProof(id: string): ProofItem {
  const item = PROOF.find((candidate) => candidate.id === id);

  if (!item) {
    throw new Error(`PROOF has no entry with id ${JSON.stringify(id)}.`);
  }

  return item;
}

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
