import type { AuditPayload } from "@/lib/audit";
import { LEADS, type Environment } from "@/lib/env";
import { LeadPathError } from "@/lib/logging";

/**
 * The shape of a row in `audit_requests`, and the one place that turns a
 * validated form payload into one.
 *
 * Hand-written from `supabase/migrations/0001_audit_requests.sql` and derived
 * from `AuditPayload` where the two overlap — which is everywhere except
 * `environment`.
 *
 * **What the mapped type actually buys, stated honestly.** TypeScript cannot
 * see the database, so nothing here proves a column exists. What it does
 * prove is narrower and still useful: a field added to the form cannot reach
 * an insert without this file failing to compile, and this file is where the
 * comment pointing at the migration lives. The guarantee is "you will be
 * stopped and told to write a migration", not "the migration was written".
 *
 * S3.4 adds the insert itself. This slice is the schema and the contract.
 */

/** Every stored field. The honeypot is excluded and is never written. */
type StoredFields = Omit<AuditPayload, "company">;

/**
 * The two fields a visitor can legitimately leave blank.
 *
 * They are stored `NULL`, never `''`. `lib/audit.ts` returns `""` for an
 * unanswered optional field, and both representations reaching one column
 * would mean every later query has to check for two kinds of nothing.
 */
type NullableField = "website" | "brief";

export type AuditRequestInsert = {
  [Field in keyof StoredFields]: Field extends NullableField
    ? string | null
    : string;
} & {
  environment: Environment;
};

/** `''` becomes `NULL`; anything else is passed through untouched. */
const orNull = (value: string) => (value === "" ? null : value);

/**
 * Maps a **validated** payload to a row.
 *
 * Takes `AuditPayload` rather than `unknown` on purpose: the only way to hold
 * one is to have been handed it by `validateAuditPayload`, so the length
 * bounds the migration's check constraints enforce have already been applied
 * by the time anything calls this.
 */
export function toAuditRequestRow(
  payload: AuditPayload,
  environment: Environment,
): AuditRequestInsert {
  return {
    environment,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    intent: payload.intent,
    website: orNull(payload.website),
    brief: orNull(payload.brief),
  };
}

/**
 * A row in `audit_rate_limit`.
 *
 * `ipHash` is a lowercase sha256 hex digest and the column's check constraint
 * accepts nothing else, so a raw IP address cannot be written here by mistake
 * — the database refuses it. S3.5 computes the hash and does the counting.
 */
export type RateLimitInsert = {
  ip_hash: string;
  environment: Environment;
};

/* ------------------------------------------------------------------ */
/*  The archive write                                                  */
/* ------------------------------------------------------------------ */

/**
 * PostgREST, not `@supabase/supabase-js` — D2 in the phase spec.
 *
 * This whole phase makes two queries: one insert and one count. The SDK pulls
 * auth, realtime and storage to serve them, becomes a monthly `npm outdated`
 * row under §13, and wraps a plain HTTP call in a client whose error objects
 * would have to be kept away from every log line anyway. The route is
 * server-only, so nothing here reaches a browser bundle.
 *
 * If it ever needs the SDK, this file is the only one that changes. §2.5 locks
 * *Supabase*, the product; it does not name a client.
 */
const REST_PATH = "/rest/v1/audit_requests";

/** A paused or slow project must not hold a serverless invocation open. */
const TIMEOUT_MS = 8_000;

/**
 * What a status code means, in our words, for the log line.
 *
 * `lib/logging.ts` forbids logging a response body — a PostgREST error can
 * echo the row it refused, which for this table is the entire payload. So the
 * diagnosis has to be authored on this side, from the status alone.
 */
function hintFor(status: number): string {
  if (status === 401 || status === 403) {
    return "check SUPABASE_SERVICE_ROLE_KEY — the publishable key cannot write";
  }
  if (status === 404) {
    return "table missing — has supabase/migrations/0001 been applied?";
  }
  if (status === 400 || status === 409 || status === 422) {
    return "row refused — a check constraint in 0001 disagrees with lib/audit.ts";
  }
  if (status >= 500) {
    return "project may be paused — see supabase/README.md";
  }
  return "unexpected status from the database";
}

/**
 * Writes the row. Throws `LeadPathError` on any failure.
 *
 * **Called only after the email has gone out, and its failure is survivable.**
 * That ordering is D1: the free tier pauses a project after a week without
 * traffic, so an insert is the part of this path most likely to be
 * unavailable, and the visitor's promise must not rest on it. A failure here
 * costs an archive copy and never a lead.
 *
 * `Prefer: return=minimal` is not a micro-optimisation. It stops the response
 * from echoing the row back, which keeps the payload out of reach of any
 * future error handler that gets careless with a response body.
 */
export async function archiveLead(
  payload: AuditPayload,
  environment: Environment,
): Promise<void> {
  if (!LEADS) {
    throw new LeadPathError(
      "archive",
      "not-configured",
      undefined,
      "SUPABASE_URL is not set",
    );
  }

  let response: Response;

  try {
    response = await fetch(`${LEADS.url}${REST_PATH}`, {
      method: "POST",
      headers: {
        apikey: LEADS.serviceRoleKey,
        Authorization: `Bearer ${LEADS.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(toAuditRequestRow(payload, environment)),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new LeadPathError(
      "archive",
      "network-error",
      undefined,
      "no response from the database",
    );
  }

  if (!response.ok) {
    throw new LeadPathError(
      "archive",
      "http-error",
      response.status,
      hintFor(response.status),
    );
  }
}
