import { LEADS } from "@/lib/env";
import { LeadPathError } from "@/lib/logging";
import { RATE_WINDOW_MS } from "@/lib/ratelimit";

/**
 * Retention, and the job that makes it true.
 *
 * **D3, approved by Val: 24 months.** Long enough that a prospect who comes
 * back in a year is recognised, short enough to be a real limit.
 *
 * The number and its enforcement are deliberately in the same commit as the
 * sentence on `/privacy` that states it. A retention period a privacy policy
 * promises and nothing deletes is the one content error on this site with
 * consequences off the website — §8 with teeth — so either the deletion is
 * real or the number does not get written down.
 */
export const RETENTION_MONTHS = 24;

const TIMEOUT_MS = 8_000;

/** ISO timestamp for the oldest row worth keeping. */
function retentionCutoff(now = new Date()): string {
  const cutoff = new Date(now);
  cutoff.setUTCMonth(cutoff.getUTCMonth() - RETENTION_MONTHS);
  return cutoff.toISOString();
}

/**
 * Deletes rows older than `cutoff` and reports how many went.
 *
 * `Prefer: count=exact` makes PostgREST report the affected count in
 * `content-range`; `return=minimal` keeps the deleted rows out of the
 * response, which for `audit_requests` would otherwise hand a full set of
 * personal data to whatever reads the body. The count is `null` rather than
 * `0` when the header is missing, because reporting a confident zero for "we
 * could not tell" is how a retention job gets believed while doing nothing.
 */
async function deleteOlderThan(
  table: string,
  column: string,
  cutoff: string,
): Promise<number | null> {
  if (!LEADS) {
    throw new LeadPathError(
      "maintenance",
      "not-configured",
      undefined,
      "SUPABASE_URL is not set",
    );
  }

  const url = `${LEADS.url}/rest/v1/${table}?${column}=lt.${cutoff}`;

  let response: Response;

  try {
    response = await fetch(url, {
      method: "DELETE",
      headers: {
        apikey: LEADS.serviceRoleKey,
        Authorization: `Bearer ${LEADS.serviceRoleKey}`,
        Prefer: "return=minimal,count=exact",
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    throw new LeadPathError(
      "maintenance",
      "network-error",
      undefined,
      "no response from the database",
    );
  }

  if (!response.ok && response.status !== 206) {
    throw new LeadPathError(
      "maintenance",
      "http-error",
      response.status,
      response.status >= 500
        ? "project may be paused — see supabase/README.md"
        : "check SUPABASE_SERVICE_ROLE_KEY and that migration 0001 is applied",
    );
  }

  const total = Number(response.headers.get("content-range")?.split("/")[1]);
  return Number.isInteger(total) ? total : null;
}

export type MaintenanceResult = {
  /** Leads deleted for being past the retention period. */
  leads: number | null;
  /** Rate-limit rows deleted for being past the counting window. */
  rateLimit: number | null;
  retentionMonths: number;
};

/**
 * The daily job. **Two purposes, one mechanism, and that is on purpose.**
 *
 * It enforces the retention period above. It is also what stops the free-tier
 * project pausing after a week of no activity — the constraint that shaped
 * this whole phase, and the reason D1 puts the email ahead of the database
 * (see `supabase/README.md`). Because one call does both, the keepalive
 * cannot be deleted without the retention promise on `/privacy` visibly
 * breaking at the same time.
 *
 * Stated precisely, since the distinction matters: Supabase's inactivity
 * detection is about **project activity**, not specifically writes. What keeps
 * the project awake is that this runs daily and makes authenticated API
 * calls; the deletions are what make the retention claim true.
 */
export async function runMaintenance(): Promise<MaintenanceResult> {
  const leads = await deleteOlderThan(
    "audit_requests",
    "created_at",
    retentionCutoff(),
  );

  /* The counter's rows are personal-adjacent too — a keyed digest of an IP —
     and `/privacy` says they last an hour. Same reasoning, shorter clock. */
  const rateLimit = await deleteOlderThan(
    "audit_rate_limit",
    "created_at",
    new Date(Date.now() - RATE_WINDOW_MS).toISOString(),
  );

  return { leads, rateLimit, retentionMonths: RETENTION_MONTHS };
}
