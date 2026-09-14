import type { AuditPayload } from "@/lib/audit";
import type { Environment } from "@/lib/env";

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
