import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { CRON_SECRET } from "@/lib/env";
import { LeadPathError, classify, logLeadFailure } from "@/lib/logging";
import { runMaintenance } from "@/lib/maintenance";

/**
 * The daily retention and keepalive job.
 *
 * Invoked by Vercel Cron on the schedule in `vercel.json`, which sends
 * `Authorization: Bearer $CRON_SECRET`.
 *
 * **This endpoint deletes rows, so it refuses everything by default.** With no
 * `CRON_SECRET` configured it answers 401 to every caller including the
 * platform. That is the only safe direction: "the secret has not been set
 * yet" is precisely the moment when failing open would publish a public
 * deletion endpoint on a site holding other people's personal data.
 */

export const runtime = "nodejs";

/* Never cached, never prerendered. A cached maintenance job is one that runs
   once and reports the same counts forever. */
export const dynamic = "force-dynamic";

/**
 * Constant-time comparison of the bearer token.
 *
 * Both sides are hashed first because `timingSafeEqual` throws on a length
 * mismatch, and the length of the expected secret is itself something not
 * worth leaking. The practical risk here is small; the cost of doing it
 * properly is two lines.
 */
function tokenMatches(provided: string, expected: string): boolean {
  return timingSafeEqual(
    createHash("sha256").update(provided).digest(),
    createHash("sha256").update(expected).digest(),
  );
}

const unauthorised = () =>
  NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });

export async function GET(request: Request) {
  if (!CRON_SECRET) return unauthorised();

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return unauthorised();

  if (!tokenMatches(header.slice("Bearer ".length), CRON_SECRET)) {
    return unauthorised();
  }

  try {
    const result = await runMaintenance();

    /* Counts, never rows. The whole point of `return=minimal` upstream is
       that the deleted personal data never comes back to be logged here. */
    console.info("[maintenance] complete", result);

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    if (error instanceof LeadPathError) error.log();
    else logLeadFailure("maintenance", classify(error));

    return NextResponse.json(
      { ok: false, message: "Maintenance failed" },
      { status: 502 },
    );
  }
}
