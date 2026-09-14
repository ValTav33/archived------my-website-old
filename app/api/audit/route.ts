import { NextResponse } from "next/server";
import { looksAutomated, validateAuditPayload, type AuditPayload } from "@/lib/audit";
import { ENVIRONMENT } from "@/lib/env";
import { archiveLead } from "@/lib/leads";
import { isRateLimited } from "@/lib/ratelimit";
import { LeadPathError, classify, logLeadFailure } from "@/lib/logging";
import { deliver } from "@/lib/notify";
import { SITE_URL } from "@/lib/site";

/* Node runtime. `lib/env.ts` decodes a JWT payload with `Buffer` to catch a
   publishable key pasted where the service-role key belongs, and S3.5's IP
   hash uses `node:crypto`. Neither exists on the edge runtime. */
export const runtime = "nodejs";

/**
 * Client IP. `x-forwarded-for` is a comma-separated chain and the first entry
 * is the original client. Spoofable in general, but on Vercel the platform
 * rewrites the header, so it is trustworthy enough for a speed bump.
 */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/**
 * Origins allowed to POST this form: the canonical site, plus whatever domain
 * this particular deployment is actually being served from.
 *
 * The second part matters. A Vercel preview is served from a generated
 * domain that can never equal SITE_URL, so checking SITE_URL alone rejects
 * every submission on every preview — the one environment where the form is
 * supposed to be exercised before it ships. `VERCEL_URL` is the immutable
 * per-deployment domain and `VERCEL_BRANCH_URL` the branch alias; both are
 * server-side only and set by the platform, so neither is attacker-supplied.
 */
function allowedOrigins(): string[] {
  const origins = [SITE_URL];

  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) origins.push(`https://${host}`);
  }

  return origins;
}

/**
 * Cheap CSRF mitigation: a browser cannot forge `Origin` on a cross-site POST.
 * Only enforced in production — local development runs on an origin that will
 * never match.
 */
function hasValidOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  return allowedOrigins().includes(origin.replace(/\/$/, ""));
}

/**
 * The response a real submission gets. Bots get this too — see POST.
 *
 * Built fresh per call rather than hoisted into a constant: a Response body is
 * a single-use stream, so a shared instance serves an empty body to every
 * request after the first.
 */
const accepted = () =>
  NextResponse.json(
    { success: true, message: "Audit request received" },
    { status: 200 },
  );

/**
 * Delivers the request, and is the only thing the visitor's success response
 * depends on.
 *
 * **This function was a stub for three phases.** A submission was validated
 * and then dropped while the form promised a reply within 24 hours — the one
 * risk playbook §12 rates Severe, and the reason the site was live but not
 * launched. S3.3 is the slice that closed it.
 *
 * Still its own function, because the route's contract is `validate ->
 * deliver -> respond` and that shape should not change when the transport
 * does. S3.4 adds the archive write behind the email, in this order and not
 * the reverse: see D1 in the phase spec, and `supabase/README.md` for the
 * free-tier pausing behaviour that forced it.
 */
async function deliverAuditRequest(payload: AuditPayload): Promise<void> {
  await deliver(payload, ENVIRONMENT);

  /* The trace that survives. Nothing identifying goes in here — name, email
     and phone must never reach a log line, because Vercel logs are retained,
     searchable and readable by anyone holding project access, and there is no
     lawful basis recorded for keeping them there. `/privacy` states this to
     visitors, and it is the one sentence on that page this slice narrowed
     rather than replaced: the three fields are still absent from the logs,
     they are now in an email instead. */
  console.info("[audit] request delivered", {
    receivedAt: new Date().toISOString(),
    environment: ENVIRONMENT,
    intent: payload.intent,
    hasWebsite: Boolean(payload.website),
    briefLength: payload.brief.length,
  });
}

export async function POST(request: Request) {
  if (!hasValidOrigin(request)) {
    return NextResponse.json(
      { success: false, message: "Μη έγκυρο αίτημα." },
      { status: 403 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    /* Malformed JSON never reaches validation. */
    return NextResponse.json(
      { success: false, message: "Μη έγκυρο αίτημα." },
      { status: 400 },
    );
  }

  /* Bot signature: answer exactly as a real submission would be answered and
     deliver nothing. A bot that learns it was caught is a bot that gets
     tuned until it isn't. */
  if (looksAutomated(body)) return accepted();

  const result = validateAuditPayload(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        message: "Ελέγξτε τα στοιχεία της φόρμας.",
        errors: result.errors,
      },
      { status: 422 },
    );
  }

  /* Rate limited **after** validation, which is the point of the move. The
     old in-memory counter ran before the body was even parsed, so a mistyped
     email spent one of the caller's five slots — a Backlog row since S0.6,
     and a genuinely user-hostile one, because the person most likely to
     submit twice is the person who got it wrong the first time. */
  if (await isRateLimited(clientIp(request), ENVIRONMENT)) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Έχετε στείλει πολλά αιτήματα. Δοκιμάστε ξανά σε λίγη ώρα ή καλέστε μας απευθείας.",
      },
      { status: 429 },
    );
  }

  try {
    await deliverAuditRequest(result.data);
  } catch (error) {
    /* The visitor filled the form correctly — this failure is ours, so it
       must not be reported as a validation problem.

       The error object is never logged. A mail API's 4xx can echo the
       recipient and the message body it rejected, which would put the whole
       payload in a log line from code that looks careful; `lib/logging.ts`
       makes that unexpressible rather than merely discouraged. */
    if (error instanceof LeadPathError) error.log();
    else logLeadFailure("mail", classify(error));

    return NextResponse.json(
      {
        success: false,
        message:
          "Η αποστολή απέτυχε προσωρινά. Δοκιμάστε ξανά ή καλέστε μας απευθείας.",
      },
      { status: 502 },
    );
  }

  /* The archive, and its failure is deliberately not the visitor's problem.
     D1: the email above is the delivery, this is the copy. The free tier
     pauses a project after a week without traffic, so this is the part of the
     path most likely to be unavailable — and a lead that reached a human is
     not going to be reported as a failure because its archive copy did not
     get written. Logged, without the payload, and the visitor is told yes.

     The try/catch lives here rather than inside `archiveLead` on purpose. A
     function that swallows its own errors reads as one that cannot fail; the
     non-fatality is a property of this call site and belongs where a reader
     is looking at the response being returned two lines later. */
  try {
    await archiveLead(result.data, ENVIRONMENT);
  } catch (error) {
    if (error instanceof LeadPathError) error.log();
    else logLeadFailure("archive", classify(error));
  }

  return accepted();
}

/* Anything other than POST gets a correct 405 rather than a 404. */
export function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
