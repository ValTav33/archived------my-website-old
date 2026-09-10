/**
 * Shared contract for the audit request.
 *
 * The form and the route handler both import from here on purpose: if the
 * dropdown options lived only in the component, the server's whitelist would
 * silently drift out of sync and start rejecting perfectly valid submissions.
 * One list, one validator, both sides.
 */

export const AUDIT_INTENTS = [
  "Χρειάζομαι νέα high-performance ιστοσελίδα / web app",
  "Χάνω εργατοώρες σε χειροκίνητες εργασίες & data entry",
  "Χρειάζομαι αυτοματοποιημένο lead generation & cold outreach",
  "Χρειάζομαι 24/7 AI Concierge / Assistant εξυπηρέτησης",
  "Συνδυασμός Web Development & Αυτοματισμών",
] as const;

export type AuditIntent = (typeof AUDIT_INTENTS)[number];

export type AuditField =
  | "name"
  | "email"
  | "phone"
  | "website"
  | "intent"
  | "brief";

/** Shape the form holds and the API accepts. */
export type AuditPayload = {
  name: string;
  email: string;
  phone: string;
  website: string;
  intent: string;
  brief: string;
  /**
   * Honeypot. Rendered visually hidden and never shown to a human, so any
   * value here means a bot filled the form. Optional because a legitimate
   * submission simply leaves it empty.
   */
  company?: string;
};

export type AuditFieldErrors = Partial<Record<AuditField, string>>;

export type AuditValidation =
  | { ok: true; data: AuditPayload }
  | { ok: false; errors: AuditFieldErrors };

export const EMPTY_AUDIT_PAYLOAD: AuditPayload = {
  name: "",
  email: "",
  phone: "",
  website: "",
  intent: "",
  brief: "",
};

/* Deliberately permissive: catching "user typed nonsense" is the job here,
   not RFC 5322 conformance. Real verification happens on delivery. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const asTrimmedString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

/**
 * Normalises a website value. Users type "acme.gr" far more often than a full
 * URL, so a missing scheme is filled in rather than treated as an error.
 * Returns `null` when the value can't be understood as a URL at all.
 */
function normaliseWebsite(raw: string): string | null {
  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  try {
    const url = new URL(candidate);
    // A bare word like "test" parses only as a hostname with no dot — reject.
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Validates an unknown payload (untrusted request body, or the form's own
 * state) and returns either the cleaned data or per-field Greek messages.
 */
export function validateAuditPayload(input: unknown): AuditValidation {
  if (typeof input !== "object" || input === null) {
    return { ok: false, errors: { name: "Μη έγκυρα δεδομένα." } };
  }

  const raw = input as Record<string, unknown>;
  const errors: AuditFieldErrors = {};

  const name = asTrimmedString(raw.name);
  if (name.length < 2) {
    errors.name = "Συμπληρώστε το ονοματεπώνυμό σας.";
  } else if (name.length > 120) {
    errors.name = "Το όνομα είναι υπερβολικά μεγάλο.";
  }

  const email = asTrimmedString(raw.email);
  if (!email) {
    errors.email = "Συμπληρώστε το email σας.";
  } else if (email.length > 200 || !EMAIL_PATTERN.test(email)) {
    errors.email = "Το email δεν φαίνεται έγκυρο.";
  }

  const phone = asTrimmedString(raw.phone);
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) {
    errors.phone = "Συμπληρώστε ένα τηλέφωνο επικοινωνίας.";
  } else if (phoneDigits.length < 8 || phone.length > 40) {
    errors.phone = "Το τηλέφωνο δεν φαίνεται έγκυρο.";
  }

  const intent = asTrimmedString(raw.intent);
  if (!intent) {
    errors.intent = "Επιλέξτε την βασική σας προτεραιότητα.";
  } else if (!AUDIT_INTENTS.includes(intent as AuditIntent)) {
    errors.intent = "Μη έγκυρη επιλογή.";
  }

  /* Website is optional — only validated when the visitor actually typed one. */
  const websiteInput = asTrimmedString(raw.website);
  let website = "";
  if (websiteInput) {
    const normalised = normaliseWebsite(websiteInput);
    if (!normalised) {
      errors.website = "Το URL δεν φαίνεται έγκυρο (π.χ. https://acme.gr).";
    } else {
      website = normalised;
    }
  }

  const brief = asTrimmedString(raw.brief);
  if (brief.length > 2000) {
    errors.brief = "Η περιγραφή ξεπερνά τους 2000 χαρακτήρες.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return { ok: true, data: { name, email, phone, website, intent, brief } };
}

/* ------------------------------------------------------------------ */
/*  Anti-bot signals                                                   */
/* ------------------------------------------------------------------ */

/**
 * Honeypot field name — bots fill anything called "company". Exported so the
 * form and the route handler can never disagree about what to look at.
 */
export const HONEYPOT_FIELD = "company";

/**
 * Floor for the time between the form rendering and its submission landing.
 * Six fields cannot be completed by a human in under two and a half seconds.
 */
export const MIN_SUBMIT_MS = 2500;

/**
 * True when a submission carries a bot signature: a filled honeypot, or a
 * round-trip too fast to be human.
 *
 * A missing or non-numeric `elapsedMs` also counts, because the real form
 * always sends one — a body without it did not come from this form.
 *
 * The caller must answer a positive exactly as it answers a real submission.
 * Telling a bot which check it tripped is how the check gets tuned around.
 */
export function looksAutomated(input: unknown): boolean {
  if (typeof input !== "object" || input === null) return true;
  const raw = input as Record<string, unknown>;

  const honeypot = raw[HONEYPOT_FIELD];
  if (typeof honeypot === "string" && honeypot.trim() !== "") return true;

  const elapsed = raw.elapsedMs;
  if (typeof elapsed !== "number" || !Number.isFinite(elapsed)) return true;

  return elapsed < MIN_SUBMIT_MS;
}
