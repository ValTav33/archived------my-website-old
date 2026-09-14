import type { AuditPayload } from "@/lib/audit";
import { MAIL, type Environment } from "@/lib/env";
import { LeadPathError } from "@/lib/logging";
import { AUDIT_DELIVERABLE, SITE } from "@/lib/site";

/**
 * The delivery. Not the archive — **this** is what the 24-hour promise rests
 * on.
 *
 * D1 in the phase spec: the email is the delivery and Supabase is the archive,
 * because the free tier pauses a project after a week without traffic and a
 * marketing site's lead volume is exactly that traffic profile. So a visitor's
 * success response depends on this function returning, and on nothing else. If
 * it throws, the route returns 502 and no row is written anywhere, which makes
 * a retry clean rather than a duplicate.
 */

const ENDPOINT = "https://api.resend.com/emails";

/** A hung provider must not hold a serverless invocation open. */
const TIMEOUT_MS = 10_000;

/**
 * What a status code means, in our words, for the log line.
 *
 * `lib/logging.ts` forbids logging a provider's own text, and for this API the
 * status *is* the diagnosis — which is why losing the body costs nothing worth
 * having.
 */
function hintFor(status: number): string {
  if (status === 401 || status === 403) {
    return "check RESEND_API_KEY, and whether the sending domain is verified";
  }
  if (status === 422) {
    return "the provider rejected a field — check AUDIT_MAIL_FROM and AUDIT_NOTIFY_TO";
  }
  if (status === 429) return "provider rate limit";
  if (status >= 500) return "provider outage";
  return "unexpected status from the mail provider";
}

/** `el-GR` in Athens time, because the person reading this is in Athens time. */
function receivedAt(): string {
  return new Intl.DateTimeFormat("el-GR", {
    timeZone: "Europe/Athens",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());
}

/**
 * Plain text, not HTML, and not a decision made for speed.
 *
 * It renders identically in every client, it survives being forwarded, and it
 * cannot smuggle a tracking pixel into a notification about a form whose
 * privacy page promises there are none. Greek needs no markup to be legible.
 */
function body(payload: AuditPayload, environment: Environment): string {
  const lines = [
    "Νέο αίτημα για δωρεάν audit.",
    "",
    `Ονοματεπώνυμο:  ${payload.name}`,
    `Email:          ${payload.email}`,
    `Τηλέφωνο:       ${payload.phone}`,
    `Website:        ${payload.website || "—"}`,
    "",
    "Προτεραιότητα:",
    payload.intent,
    "",
    "Περιγραφή:",
    payload.brief || "— (δεν συμπληρώθηκε)",
    "",
    "".padEnd(56, "-"),
    `Ελήφθη: ${receivedAt()}`,
    `Περιβάλλον: ${environment}`,
  ];

  /* The promise, interpolated from `AUDIT_DELIVERABLE` — the same constant
     the form's footnote, the homepage and process step 01 render. S1.7's exit
     condition was that those surfaces match character for character, and
     retyping the sentence here to save an import is exactly how a promise
     starts drifting. The notification therefore states the clock the visitor
     was just shown, not a paraphrase of it. */
  if (environment === "production") {
    lines.push("", `Ο επισκέπτης διάβασε: «Θα λάβετε ${AUDIT_DELIVERABLE}».`);
  } else {
    lines.push(
      "",
      "ΔΟΚΙΜΗ — δεν προέρχεται από την παραγωγή. Καμία απάντηση δεν χρειάζεται.",
    );
  }

  return lines.join("\n");
}

/**
 * Sends the notification. Throws `LeadPathError` on any failure.
 *
 * `reply_to` is the visitor's address, so answering the lead is one tap from
 * the notification rather than a copy-paste out of it. That single header is
 * most of this function's practical value.
 */
export async function deliver(
  payload: AuditPayload,
  environment: Environment,
): Promise<void> {
  if (!MAIL) {
    throw new LeadPathError("mail", "not-configured", undefined, "RESEND_API_KEY is not set");
  }

  const prefix = environment === "production" ? "" : `[${environment.toUpperCase()}] `;

  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${MAIL.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: MAIL.from,
        to: [MAIL.notifyTo ?? SITE.email],
        reply_to: payload.email,
        subject: `${prefix}Δωρεάν audit — ${payload.name}`,
        text: body(payload, environment),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch {
    /* DNS, socket, or the timeout above. The thrown value is deliberately not
       inspected — see lib/logging.ts. */
    throw new LeadPathError("mail", "network-error", undefined, "no response from the mail provider");
  }

  if (!response.ok) {
    throw new LeadPathError("mail", "http-error", response.status, hintFor(response.status));
  }
}
