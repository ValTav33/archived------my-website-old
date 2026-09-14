import { createHmac } from "node:crypto";
import { LEADS, type Environment } from "@/lib/env";
import { LeadPathError } from "@/lib/logging";

/**
 * The shared submission counter.
 *
 * Replaces the in-memory `Map` that lived in `app/api/audit/route.ts` since
 * S0.6 and closes three Backlog rows with it:
 *
 *   - the counter lived in **one serverless instance's memory**, so instances
 *     did not share it and a recycled instance started from zero. Its own
 *     comment called it a speed bump rather than a wall, which was accurate.
 *   - **preview traffic shared production's limit.** `environment` is part of
 *     the key here, so abuse on a preview cannot lock production out.
 *   - **a failed submission consumed a slot**, because the old counter ran
 *     before validation. This one is called after, so a mistyped email costs
 *     nothing.
 *
 * The old Map is **deleted**, not kept as a first line of defence. Two
 * limiters with different scopes and different lifetimes is a thing nobody
 * can reason about six months later, and the one being removed described
 * itself as ineffective.
 */

/** Five submissions per hour. Unchanged from S0.6. */
export const RATE_LIMIT = 5;
/** Exported so the maintenance job prunes on exactly this clock. */
export const RATE_WINDOW_MS = 60 * 60 * 1000;

/** A slow database must not hold a serverless invocation open. */
const TIMEOUT_MS = 5_000;

const TABLE = "/rest/v1/audit_rate_limit";

/**
 * Keyed hash of the caller's IP.
 *
 * **HMAC rather than a plain digest of `ip + salt`.** HMAC is the primitive
 * designed for keyed hashing; a bare `sha256(ip + salt)` is the construction
 * that keeps turning out to have length-extension problems, and there is no
 * reason to hand-roll it when `createHmac` is in the standard library.
 *
 * The salt is required whenever the database is configured — see
 * `lib/env.ts`. An unsalted hash of an IPv4 address has four billion
 * candidates and is reversible in seconds, which is a stored IP address with
 * extra steps. `/privacy` tells visitors their IP is not kept, and this is
 * the code that has to make that true.
 *
 * The column's own check constraint accepts a 64-character lowercase hex
 * digest and nothing else, so a raw IP cannot be written there by mistake.
 */
export function hashIp(ip: string, salt: string): string {
  return createHmac("sha256", salt).update(ip).digest("hex");
}

/** Shared headers for both requests. */
function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    ...extra,
  };
}

/**
 * Counts this caller's submissions inside the window.
 *
 * PostgREST returns the total in `content-range` as `0-0/12` when
 * `Prefer: count=exact` is set, and as a star followed by `/0` when nothing
 * matched — which is why the count is read from after the slash rather than
 * from the body, and why `Range: 0-0` is set to avoid transferring rows
 * nobody reads. (Spelling that header value out literally here would close
 * this comment block, which is its own small lesson.)
 */
async function countRecent(
  url: string,
  key: string,
  ipHash: string,
  environment: Environment,
): Promise<number> {
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const query = `select=id&ip_hash=eq.${ipHash}&environment=eq.${environment}&created_at=gte.${since}`;

  let response: Response;

  try {
    response = await fetch(`${url}${TABLE}?${query}`, {
      headers: headers(key, { Prefer: "count=exact", Range: "0-0" }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new LeadPathError(
      "rate-limit",
      "network-error",
      undefined,
      "no response from the database",
    );
  }

  /* A `Range` request answers 206 once more than one row matches and 200
     otherwise — both measured against the live endpoint. `Response.ok`
     already covers 200-299, so the explicit 206 is belt and braces rather
     than a necessity; it is kept because the next person to read this will
     wonder about 206, and the answer should be in front of them. */
  if (!response.ok && response.status !== 206) {
    throw new LeadPathError(
      "rate-limit",
      "http-error",
      response.status,
      response.status >= 500
        ? "project may be paused — see supabase/README.md"
        : "check SUPABASE_SERVICE_ROLE_KEY and that migration 0001 is applied",
    );
  }

  const total = response.headers.get("content-range")?.split("/")[1];
  const parsed = Number(total);

  if (total === undefined || !Number.isInteger(parsed)) {
    throw new LeadPathError(
      "rate-limit",
      "unexpected-response",
      response.status,
      "no usable content-range header",
    );
  }

  return parsed;
}

/** Records this submission. */
async function record(
  url: string,
  key: string,
  ipHash: string,
  environment: Environment,
): Promise<void> {
  const response = await fetch(`${url}${TABLE}`, {
    method: "POST",
    headers: headers(key, {
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    }),
    body: JSON.stringify({ ip_hash: ipHash, environment }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new LeadPathError(
      "rate-limit",
      "http-error",
      response.status,
      "could not record the submission",
    );
  }
}

/**
 * Reports whether this caller is over the limit, and records the submission
 * when it is not.
 *
 * **Fails open.** Every path that cannot get an answer returns `false` and
 * logs. The honeypot, the timing gate and the origin check all still run, and
 * in a phase whose entire purpose is to stop losing leads, dropping a real
 * one to protect against a hypothetical bot is the wrong trade. The tradeoff
 * is stated rather than hidden: with the database unreachable there is no
 * submission ceiling beyond those three checks.
 *
 * **Not atomic.** Two simultaneous requests can both read four and both pass.
 * Closing that needs a stored function and an RPC, which is more machinery
 * than a five-per-hour speed bump justifies; the bound it actually enforces
 * is "roughly five", and that is the honest description.
 */
export async function isRateLimited(
  ip: string,
  environment: Environment,
): Promise<boolean> {
  if (!LEADS) {
    /* No database means no shared counter. Not logged as a failure — it is a
       configuration state, reported once per request would be noise, and the
       env contract already refuses to start with a half-configured one. */
    return false;
  }

  const ipHash = hashIp(ip, LEADS.ipSalt);

  try {
    if ((await countRecent(LEADS.url, LEADS.serviceRoleKey, ipHash, environment)) >= RATE_LIMIT) {
      return true;
    }

    await record(LEADS.url, LEADS.serviceRoleKey, ipHash, environment);
    return false;
  } catch (error) {
    if (error instanceof LeadPathError) error.log();
    else {
      new LeadPathError(
        "rate-limit",
        "network-error",
        undefined,
        "counter unavailable, allowing the submission",
      ).log();
    }

    return false;
  }
}
