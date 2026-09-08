import { NextResponse } from "next/server";
import { validateAuditPayload, type AuditPayload } from "@/lib/audit";

/* Uses the Node runtime because the delivery integrations wired in below
   (Nodemailer / Resend SDK / signed webhook push) expect Node APIs. */
export const runtime = "nodejs";

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
  /* Until a transport is wired, the console is the sink. Note this logs raw
     contact details — before going to production, route this to a proper
     logging service and redact email/phone, or drop the log entirely. */
  console.info("[audit] new request", {
    receivedAt: new Date().toISOString(),
    ...payload,
  });
}

export async function POST(request: Request) {
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

  return NextResponse.json(
    { success: true, message: "Audit request received" },
    { status: 200 },
  );
}

/* Anything other than POST gets a correct 405 rather than a 404. */
export function GET() {
  return NextResponse.json(
    { success: false, message: "Method Not Allowed" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
