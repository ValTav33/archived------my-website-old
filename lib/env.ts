/**
 * Server-side configuration contract for the lead path.
 *
 * Everything Phase 3 needs a secret for is read here, once, and nowhere else.
 * The route handlers import the shapes below; they never touch
 * `process.env` themselves.
 *
 * **Two rules, and they pull in opposite directions on purpose.**
 *
 * *Missing is not fatal.* The site has to build and deploy with none of these
 * set, because it does today and because a preview deployment must not fail
 * to build just because a credential has not been pasted in yet. An absent
 * variable makes its subsystem `null`, and the caller decides what that means
 * — for mail it means an honest 502, for the archive it means a logged miss.
 *
 * *Malformed is fatal.* `lib/site.ts` carries the scar: a Vercel entry whose
 * key existed and whose value was an empty string reached `new URL("")` and
 * killed a production build on a bare `TypeError: Invalid URL` that never
 * mentioned the variable. So every value here is validated, every failure
 * names the variable, and a value that is present and wrong stops the build
 * rather than surfacing later as a 500 on a submitted form.
 *
 * **Reject only what is provably wrong; never require a format.** The checks
 * below refuse an empty string, embedded whitespace (a pasted newline or a
 * quoted value), a non-URL where a URL is required, and — the one that earns
 * its keep — a Supabase *publishable* key handed over where the service-role
 * key belongs. They do not assert that a Resend key starts with `re_` or that
 * a Supabase host ends in `.supabase.co`, because a provider changing its own
 * prefix should not break a deploy holding a perfectly good credential.
 *
 * **Nothing here is `NEXT_PUBLIC_`.** A service-role key bypasses row-level
 * security completely; in a browser bundle it is the worst outcome available
 * in this phase. The prefix is the only thing standing between the two, so
 * none of these names carry it and none of them ever should.
 *
 * *One deviation from the phase spec, recorded here rather than silently:* the
 * spec names three predicates (`MAIL_CONFIGURED`, `LEADS_CONFIGURED`,
 * `CRON_CONFIGURED`). They are three nullable objects instead, because
 * `if (!MAIL) return honest502()` narrows the type for the lines that follow
 * and `if (!MAIL_CONFIGURED)` does not — a boolean beside the value it
 * describes invites exactly the call site that checks the boolean and then
 * reads the value with a `!`. `X !== null` *is* the predicate.
 */

/* ------------------------------------------------------------------ */
/*  Readers                                                            */
/* ------------------------------------------------------------------ */

/**
 * A variable's value, or `undefined` when it is absent **or empty**.
 *
 * Treating `""` as absent is the whole point. In a Vercel project an entry
 * with an empty value looks identical to a configured one in the dashboard,
 * and `process.env.X !== undefined` reports it as set.
 */
function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

/** Throws with a sentence that names the variable and says how to fix it. */
function fail(name: string, problem: string): never {
  throw new Error(`${name} ${problem}`);
}

/**
 * Rejects a value carrying whitespace *inside* it — a credential wrapped in
 * quotes in a `.env` file (`KEY="abc def"`), or two values pasted into one
 * entry.
 *
 * Leading and trailing whitespace never reaches here: `optional` trims, so a
 * key pasted with its line break is repaired rather than rejected. That is
 * the right outcome — the credential is correct and only the copy was untidy
 * — and it is worth stating, because the obvious reading of this function is
 * that it guards against the trailing newline, and it does not.
 */
function assertOpaque(name: string, value: string): string {
  if (/\s/.test(value)) {
    fail(
      name,
      "contains whitespace, which no credential does. Check for a pasted " +
        "line break or surrounding quotes in the .env entry.",
    );
  }

  return value;
}

/** Rejects a secret short enough to be a placeholder rather than a secret. */
function assertSecret(name: string, value: string, minLength: number): string {
  assertOpaque(name, value);

  if (value.length < minLength) {
    fail(
      name,
      `is only ${value.length} characters. It must be at least ${minLength}. ` +
        "Generate one with: openssl rand -hex 32",
    );
  }

  return value;
}

/* ------------------------------------------------------------------ */
/*  The environment a submission arrived in                            */
/* ------------------------------------------------------------------ */

export type Environment = "production" | "preview" | "development";

/**
 * Which deployment this is, stamped onto every stored row.
 *
 * Without it a preview submission and a real lead are indistinguishable in
 * the table, and the rate limiter would count them together — a Backlog row
 * since Phase 2's exit gate. `VERCEL_ENV` is set by the platform and is one
 * of exactly these three strings; anything else means we are not on Vercel,
 * which locally is true.
 */
export const ENVIRONMENT: Environment =
  process.env.VERCEL_ENV === "production"
    ? "production"
    : process.env.VERCEL_ENV === "preview"
      ? "preview"
      : "development";

/* ------------------------------------------------------------------ */
/*  Mail — the delivery path                                           */
/* ------------------------------------------------------------------ */

export type MailConfig = {
  apiKey: string;
  /**
   * Envelope sender. Until the sending domain is verified in the mail
   * provider, this has to be the provider's own sandbox address — which can
   * only send to the account holder, and the account holder is the only
   * recipient this phase has.
   */
  from: string;
};

/** The provider's sandbox sender, usable with no DNS records at all. */
const SANDBOX_FROM = "onboarding@resend.dev";

/* Deliberately permissive, matching `lib/audit.ts`: the job is to catch "this
   is not an address at all", not to implement RFC 5322. */
const BARE_ADDRESS = /^[^\s@<>,]+@[^\s@<>,]+\.[^\s@<>,]{2,}$/;

/**
 * Accepts both sender forms a mail API takes: a bare `name@domain`, and the
 * display form `Some Name <name@domain>`.
 *
 * Written as a split rather than one expression because the single-regex
 * version shipped in this file's first draft and rejected
 * `Tavlikos Systems <info@tavlikossystems.com>` — the exact value
 * `.env.example` tells Val to use once the domain is verified. A validator
 * that refuses the documented value is worse than no validator.
 */
function isSenderAddress(value: string): boolean {
  const display = /^([^<>]*)<([^<>]+)>$/.exec(value);
  if (!display) return BARE_ADDRESS.test(value);

  /* An empty display name (`<info@…>`) is unusual but perfectly valid, and
     this file's own rule is to reject only what is provably wrong. */
  return BARE_ADDRESS.test(display[2].trim());
}

function readMail(): MailConfig | null {
  const apiKey = optional("RESEND_API_KEY");
  if (!apiKey) return null;

  assertOpaque("RESEND_API_KEY", apiKey);

  const from = optional("AUDIT_MAIL_FROM") ?? SANDBOX_FROM;

  if (!isSenderAddress(from)) {
    fail(
      "AUDIT_MAIL_FROM",
      `is not an email address: ${JSON.stringify(from)}. ` +
        `Use \`name@domain\` or \`Name <name@domain>\`, or leave it unset to ` +
        `send from ${SANDBOX_FROM}.`,
    );
  }

  return Object.freeze({ apiKey, from });
}

/**
 * Mail credentials, or `null` when none are configured.
 *
 * `null` is not a fallback — the route returns 502 and the form tells the
 * visitor to call instead. A missing transport that *looks* like it worked is
 * the exact behaviour this phase exists to delete.
 */
export const MAIL: MailConfig | null = readMail();

/* ------------------------------------------------------------------ */
/*  Leads — the archive                                                */
/* ------------------------------------------------------------------ */

export type LeadsConfig = {
  /** Project origin, no trailing slash. */
  url: string;
  serviceRoleKey: string;
  /** Salt for the rate limiter's IP hash. See `ipSalt` below. */
  ipSalt: string;
};

/**
 * True when a Supabase key is a *publishable* (browser-safe) key rather than
 * the service-role key.
 *
 * This is the one format assumption in the file, and it earns its place: the
 * publishable key is the value sitting next to the one we want in the
 * dashboard, it is the one every tutorial pastes, and with row-level security
 * enabled and no policies it fails as *silence* — an insert that returns a
 * permission error long after the config was declared fine. Two shapes are
 * checked, the current `sb_publishable_…` prefix and the legacy JWT whose
 * payload carries `"role":"anon"`. Both are proof of the wrong key; neither
 * requires the right one to look like anything in particular.
 */
function looksPublishable(key: string): boolean {
  if (key.startsWith("sb_publishable_")) return true;

  const segments = key.split(".");
  if (segments.length !== 3) return false;

  try {
    const payload = Buffer.from(segments[1], "base64url").toString("utf8");
    return (JSON.parse(payload) as { role?: unknown }).role === "anon";
  } catch {
    /* Not a JWT we can read — no evidence either way, so no objection. */
    return false;
  }
}

function readLeads(): LeadsConfig | null {
  const rawUrl = optional("SUPABASE_URL");
  const serviceRoleKey = optional("SUPABASE_SERVICE_ROLE_KEY");

  /* Both absent is "not configured yet". One absent is a half-finished
     configuration, which is a mistake worth naming rather than ignoring. */
  if (!rawUrl && !serviceRoleKey) return null;

  if (!rawUrl) {
    fail(
      "SUPABASE_URL",
      "is missing while SUPABASE_SERVICE_ROLE_KEY is set. Set both or neither.",
    );
  }

  if (!serviceRoleKey) {
    fail(
      "SUPABASE_SERVICE_ROLE_KEY",
      "is missing while SUPABASE_URL is set. Set both or neither.",
    );
  }

  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    fail(
      "SUPABASE_URL",
      `is not a valid URL: ${JSON.stringify(rawUrl)}. It must include the ` +
        "scheme, e.g. https://abcdefgh.supabase.co",
    );
  }

  if (parsed.protocol !== "https:") {
    fail(
      "SUPABASE_URL",
      `must use https, not ${parsed.protocol}. A service-role key is not sent ` +
        "over plaintext.",
    );
  }

  assertOpaque("SUPABASE_SERVICE_ROLE_KEY", serviceRoleKey);

  if (looksPublishable(serviceRoleKey)) {
    fail(
      "SUPABASE_SERVICE_ROLE_KEY",
      "looks like the publishable (anon) key, not the service-role key. " +
        "Row-level security is enabled with no policies, so the anon key can " +
        "read nothing and write nothing — every submission would be archived " +
        "nowhere. Copy the service_role key from Project Settings → API Keys.",
    );
  }

  /* The salt is required the moment the database is, rather than being its
     own capability, because the alternative is a rate-limit table filled with
     unsalted hashes of IPv4 addresses — four billion candidates, reversible
     in seconds, which is a stored IP address with extra steps. One missing
     variable that stops the build beats a privacy claim on /privacy that the
     table quietly contradicts. */
  const ipSalt = optional("AUDIT_IP_SALT");

  if (!ipSalt) {
    fail(
      "AUDIT_IP_SALT",
      "is required whenever SUPABASE_URL is set: the rate limiter stores a " +
        "salted hash of the caller's IP, and an unsalted hash of an IPv4 " +
        "address is reversible by brute force. Generate one with: " +
        "openssl rand -hex 32",
    );
  }

  assertSecret("AUDIT_IP_SALT", ipSalt, 32);

  return Object.freeze({
    url: parsed.origin,
    serviceRoleKey,
    ipSalt,
  });
}

/**
 * Database credentials, or `null` when none are configured.
 *
 * `null` here is survivable by design: the email is the delivery and this is
 * the archive, so a submission with no archive is a logged miss rather than a
 * lost lead. See D1 in the phase spec for why that order and not the reverse.
 */
export const LEADS: LeadsConfig | null = readLeads();

/* ------------------------------------------------------------------ */
/*  Cron — the retention and keepalive job                             */
/* ------------------------------------------------------------------ */

/**
 * Shared secret for the scheduled maintenance route, or `null`.
 *
 * Vercel sends it as `Authorization: Bearer …` on scheduled invocations. That
 * route deletes rows, so `null` must mean *refuse everything* and never
 * *allow everything* — a public deletion endpoint is not something this site
 * ships, and "the secret was not set yet" is precisely when it would be one.
 */
export const CRON_SECRET: string | null = (() => {
  const value = optional("CRON_SECRET");
  return value ? assertSecret("CRON_SECRET", value, 16) : null;
})();
