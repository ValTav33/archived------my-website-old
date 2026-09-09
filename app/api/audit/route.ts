import { NextResponse } from "next/server";
import { looksAutomated, validateAuditPayload, type AuditPayload } from "@/lib/audit";
import { SITE_URL } from "@/lib/site";

/* Uses the Node runtime because the delivery integrations wired in below
   (Nodemailer / Resend SDK / signed webhook push) expect Node APIs. */
export const runtime = "nodejs";

/* ------------------------------------------------------------------ */
/*  Rate limiting                                                      */
/* ------------------------------------------------------------------ */

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // one hour

/**
 * Per-IP submission counter.
 *
 * LIMITATION, on purpose: this Map lives in one serverless instance's memory.
 * Instances do not share it, they are recycled without warning, and a request
 * routed to a cold one starts from zero. This is a speed bump against casual
 * scripted abuse, not a wall. Phase 3 moves the counter to Supabase, where it
 * is actually shared across instances.
 */
const submissions = new Map<string, number[]>();

/** Drops timestamps that have aged out, and any IP left with none. */
function sweep(now: number): void {
  for (const [ip, times] of submissions) {
    const fresh = times.filter((t) => now - t < RATE_WINDOW_MS);
    if (fresh.length === 0) submissions.delete(ip);
    else submissions.set(ip, fresh);
  }
}

/** Records a submission and reports whether this IP is now over the limit. */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  sweep(now);

  const times = submissions.get(ip) ?? [];
  if (times.length >= RATE_LIMIT) return true;

  submissions.set(ip, [...times, now]);
  return false;
}

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
 * Cheap CSRF mitigation: a browser cannot forge `Origin` on a cross-site POST.
 * Only enforced in production — local development and preview deployments run
 * on origins that will never match SITE_URL.
 */
function hasValidOrigin(request: Request): boolean {
  if (process.env.NODE_ENV !== "production") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;
  return origin.replace(/\/$/, "") === SITE_URL;
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
 * DELIVERY STUB.
 *
 * Replace the body with exactly one of the following once credentials exist:
 *
 *   Resend:
 *     const resend = new Resend(process.env.RESEND_API_KEY);
 *     await resend.emails.send({ from, to, subject, text });
 *
 *   n8n webhook:
 *     await fetch(process.env.N8N_AUDIT_WEBHOOK_URL!, {
 *       method: "POST",
 *       headers: { "Content-Type": "application/json" },
 *       body: JSON.stringify(payload),
 *     });
 *
 * Kept as its own function so the route's contract (validate -> deliver ->
 * respond) doesn't change when the transport does.
 */
async function deliverAuditRequest(payload: AuditPayload): Promise<void> {
  /* Until a transport is wired, the console is the sink.
     Nothing identifying goes in here. Name, email and phone must never reach
     a log line: Vercel logs are retained, searchable and shared with anyone
     holding project access, and there is no lawful basis recorded for that. */
  console.info("[audit] request accepted", {
    receivedAt: new Date().toISOString(),
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

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Έχετε στείλει πολλά αιτήματα. Δοκιμάστε ξανά σε λίγη ώρα ή καλέστε μας απευθείας.",
      },
      { status: 429 },
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

  try {
    await deliverAuditRequest(result.data);
  } catch (error) {
    /* The visitor filled the form correctly — this failure is ours, so it
       must not be reported as a validation problem. */
    console.error("[audit] delivery failed", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Η αποστολή απέτυχε προσωρινά. Δοκιμάστε ξανά ή καλέστε μας απευθείας.",
      },
      { status: 502 },
    );
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
