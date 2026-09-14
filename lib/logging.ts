/**
 * Failure logging for the lead path.
 *
 * **The rule this file exists to make structural.** Name, email and phone must
 * never reach a log line: Vercel logs are retained, searchable, and readable
 * by anyone holding project access, and there is no lawful basis recorded for
 * keeping identifying data there. Phase 0 wrote that rule as a comment, and
 * `/privacy` states it to visitors.
 *
 * Phase 3 arrives with two new ways to break it, and both are what the obvious
 * code does:
 *
 *     console.error("[audit] persist failed", error)
 *
 * A PostgREST error body can echo the row that failed to insert. A mail API's
 * 4xx can echo the recipient and the message it rejected. Either one puts the
 * whole payload in the log, from a line that looks careful.
 *
 * So the fix is not "remember to scrub". **No error object reaches a log line
 * at all.** Callers report a stage, a reason drawn from a fixed union written
 * here, and optionally an HTTP status. Every string that can be logged is
 * authored in this repository, which makes leaking a payload not a mistake to
 * avoid but a thing the signature cannot express.
 *
 * The cost is diagnostic detail, and it is smaller than it looks: for a mail
 * or database failure the status code *is* the diagnosis — 401 is a bad key,
 * 403 an unverified sender, 422 a rejected field — so `hint` carries that
 * mapping, authored on this side.
 */

/** Which part of the lead path failed. */
export type LeadStage = "mail" | "archive" | "rate-limit" | "maintenance";

/**
 * Why it failed, in our words.
 *
 * Deliberately coarse. A finer taxonomy would tempt someone to widen it with
 * a provider-supplied string, which is the one thing this file prevents.
 */
export type FailureReason =
  | "not-configured"
  | "http-error"
  | "network-error"
  | "unexpected-response";

/**
 * Logs a lead-path failure. Nothing identifying can be passed in.
 *
 * `hint` is a short sentence **written in this repository** — never a string
 * taken from a response body, an error message, or a payload.
 */
export function logLeadFailure(
  stage: LeadStage,
  reason: FailureReason,
  detail: { status?: number; hint?: string } = {},
): void {
  console.error("[lead] failure", {
    stage,
    reason,
    ...(detail.status !== undefined && { status: detail.status }),
    ...(detail.hint !== undefined && { hint: detail.hint }),
  });
}

/**
 * Classifies a thrown value into a reason, without reading its message.
 *
 * Everything that is not one of our own `LeadPathError`s is a transport
 * problem — a DNS failure, an aborted socket, a `fetch` that never resolved.
 * The distinction that matters for a log line is "we rejected it" versus "the
 * network did", and that is the whole taxonomy.
 */
export function classify(error: unknown): FailureReason {
  return error instanceof LeadPathError ? error.reason : "network-error";
}

/**
 * A failure we raised ourselves, carrying only values we chose.
 *
 * The `message` is for a developer reading a stack trace locally; it is never
 * passed to `logLeadFailure` and never reaches a response body. The visitor's
 * message comes from the route handler in Greek and does not vary by cause —
 * telling the browser which credential is wrong is not information a visitor
 * can use.
 */
export class LeadPathError extends Error {
  constructor(
    readonly stage: LeadStage,
    readonly reason: FailureReason,
    readonly status?: number,
    readonly hint?: string,
  ) {
    super(`${stage}: ${reason}${status === undefined ? "" : ` (${status})`}`);
    this.name = "LeadPathError";
  }

  /** Logs itself, with only the fields it was constructed from. */
  log(): void {
    logLeadFailure(this.stage, this.reason, {
      status: this.status,
      hint: this.hint,
    });
  }
}
