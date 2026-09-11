"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, LoaderCircle } from "lucide-react";
import {
  AUDIT_INTENTS,
  EMPTY_AUDIT_PAYLOAD,
  HONEYPOT_FIELD,
  validateAuditPayload,
  type AuditField,
  type AuditFieldErrors,
  type AuditPayload,
} from "@/lib/audit";
import Card from "@/components/ui/Card";
import { AUDIT_DELIVERABLE } from "@/lib/site";
import { cn } from "@/lib/utils";

/*
 * Four states, one variable:
 *   idle       — accepting input (also the state a failed submit returns to)
 *   submitting — request in flight, controls locked
 *   success    — form is replaced by the confirmation card
 *   error      — submit failed; the form stays filled so nothing is retyped
 */
type FormStatus = "idle" | "submitting" | "success" | "error";

/* Shared between input/select/textarea so focus and error styling stay
   identical across control types. */
const FIELD_BASE =
  "w-full rounded-lg border bg-obsidian-775 px-4 py-3 text-sm text-zinc-100 transition-colors placeholder:text-ink-ghost focus:outline-none disabled:opacity-60";

const fieldTone = (hasError: boolean) =>
  hasError
    ? "border-red-500/40 focus:border-red-500/60"
    : "border-hairline focus:border-white/[0.25]";

export default function AuditForm() {
  const [values, setValues] = useState<AuditPayload>(EMPTY_AUDIT_PAYLOAD);
  const [errors, setErrors] = useState<AuditFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  /* Honeypot. Kept out of `values` so it never touches validation, delivery
     or the error map — it exists only to be read back on submit. */
  const honeypotRef = useRef<HTMLInputElement>(null);

  /* Stamped once, on mount. The gap between this and the submit is what
     separates a person from a script. A ref rather than state because
     changing it must never trigger a re-render, and stamped in an effect
     rather than in the initialiser because `Date.now()` during render is
     impure. Left at 0 until the effect runs, which reads as an enormous
     elapsed time — the check fails open, toward the human. */
  const renderedAtRef = useRef(0);

  useEffect(() => {
    renderedAtRef.current = Date.now();
  }, []);

  /* On success the whole form is replaced by the confirmation card. Without
     moving focus, a screen reader user is left on a submit button that no
     longer exists and hears nothing at all. */
  const successHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (status === "success") successHeadingRef.current?.focus();
  }, [status]);

  const isSubmitting = status === "submitting";

  /* Editing a field clears only that field's error, so the rest of the
     summary stays visible while the visitor works through it. */
  const update = (field: AuditField, value: string) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    /* Validate with the same function the route handler uses, so the visitor
       never gets a server rejection the client could have caught. */
    const validation = validateAuditPayload(values);
    if (!validation.ok) {
      setErrors(validation.errors);
      setStatus("idle");
      setSubmitMessage("");
      return;
    }

    setStatus("submitting");
    setErrors({});
    setSubmitMessage("");

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...validation.data,
          [HONEYPOT_FIELD]: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - renderedAtRef.current,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        /* Surface server-side field errors (e.g. a stale intent option). */
        setErrors(result?.errors ?? {});
        setStatus("error");
        setSubmitMessage(
          result?.message ??
            "Η αποστολή απέτυχε. Δοκιμάστε ξανά ή καλέστε μας απευθείας.",
        );
        return;
      }

      setStatus("success");
    } catch {
      /* Offline, DNS failure, request blocked — never a validation problem. */
      setStatus("error");
      setSubmitMessage(
        "Δεν ήταν δυνατή η σύνδεση. Ελέγξτε το δίκτυό σας και δοκιμάστε ξανά.",
      );
    }
  }

  const reset = () => {
    setValues(EMPTY_AUDIT_PAYLOAD);
    setErrors({});
    setSubmitMessage("");
    setStatus("idle");
    /* Restart the timing window — the next submission is timed from here, not
       from the original mount. */
    renderedAtRef.current = Date.now();
  };

  /* ------------------------ Success confirmation ------------------------ */
  if (status === "success") {
    return (
      <Card role="status" aria-live="polite" className="p-6 md:p-8">
        <div className="flex flex-col items-start">
          <span
            aria-hidden
            className="flex h-11 w-11 items-center justify-center rounded-full border border-live/30 bg-live/10 text-live"
          >
            <Check className="h-5 w-5" strokeWidth={2.5} />
          </span>

          <h3
            ref={successHeadingRef}
            tabIndex={-1}
            className="mt-5 text-xl font-semibold text-white"
          >
            Το αίτημα καταχωρήθηκε.
          </h3>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Λάβαμε το αίτημά σας. Θα επικοινωνήσουμε για την κλήση των 15
            λεπτών και θα στείλουμε τη γραπτή σύνοψη εντός 24 ωρών.
          </p>

          <Card tone="sunken" className="mt-6 w-full p-3.5 font-mono text-mono-xs">
            <p className="text-ink-ghost">$ audit --status</p>
            <p className="mt-2 flex gap-2 text-zinc-300">
              <span className="text-ink-ghost">01</span>
              Το αίτημα καταχωρήθηκε · απάντηση εντός 24 ωρών
            </p>
          </Card>

          <button
            type="button"
            onClick={reset}
            className="btn-secondary mt-6 min-h-tap px-4 py-2.5 text-xs"
          >
            Νέο αίτημα
          </button>
        </div>
      </Card>
    );
  }

  /* ------------------------------- Form -------------------------------- */
  return (
    <Card
      as="form"
      onSubmit={handleSubmit}
      noValidate
      className="p-6 md:p-8"
    >
      {/* Honeypot. Hidden from sight, from the tab order and from assistive
          tech — a human cannot reach it, so anything in it is a bot. */}
      <div aria-hidden className="sr-only">
        <label htmlFor="audit-company">Εταιρεία (μην συμπληρώσετε)</label>
        <input
          ref={honeypotRef}
          id="audit-company"
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>

      <div className="space-y-5">
        <Field
          id="audit-name"
          label="Ονοματεπώνυμο"
          required
          error={errors.name}
        >
          <input
            id="audit-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Γιώργος Παπαδόπουλος"
            value={values.name}
            disabled={isSubmitting}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "audit-name-error" : undefined}
            className={cn(FIELD_BASE, fieldTone(Boolean(errors.name)))}
          />
        </Field>

        <Field
          id="audit-email"
          label="Email"
          required
          error={errors.email}
        >
          <input
            id="audit-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.gr"
            value={values.email}
            disabled={isSubmitting}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "audit-email-error" : undefined}
            className={cn(FIELD_BASE, fieldTone(Boolean(errors.email)))}
          />
        </Field>

        <Field
          id="audit-phone"
          label="Τηλέφωνο επικοινωνίας"
          required
          error={errors.phone}
        >
          <input
            id="audit-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+30 69XXXXXXXX"
            value={values.phone}
            disabled={isSubmitting}
            onChange={(event) => update("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "audit-phone-error" : undefined}
            className={cn(FIELD_BASE, fieldTone(Boolean(errors.phone)))}
          />
        </Field>

        <Field id="audit-website" label="Τρέχον Website" error={errors.website}>
          <input
            id="audit-website"
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://..."
            value={values.website}
            disabled={isSubmitting}
            onChange={(event) => update("website", event.target.value)}
            aria-invalid={Boolean(errors.website)}
            aria-describedby={
              errors.website ? "audit-website-error" : undefined
            }
            className={cn(FIELD_BASE, fieldTone(Boolean(errors.website)))}
          />
        </Field>

        <Field
          id="audit-intent"
          label="Ποια είναι η βασική προτεραιότητα αυτή τη στιγμή;"
          required
          error={errors.intent}
        >
          {/* `appearance-none` + an explicit chevron, because the native arrow
              renders light on some platforms and breaks the matte surface.
              Each <option> carries its own dark background so the open list is
              legible on Windows/Firefox, where the control's colours are not
              inherited by the popup. */}
          <div className="relative">
            <select
              id="audit-intent"
              name="intent"
              value={values.intent}
              disabled={isSubmitting}
              onChange={(event) => update("intent", event.target.value)}
              aria-invalid={Boolean(errors.intent)}
              aria-describedby={
                errors.intent ? "audit-intent-error" : undefined
              }
              className={cn(
                FIELD_BASE,
                fieldTone(Boolean(errors.intent)),
                "appearance-none pr-11",
                values.intent ? "text-zinc-100" : "text-ink-ghost",
              )}
            >
              <option value="" disabled className="bg-obsidian-775 text-ink-faint">
                Επιλέξτε προτεραιότητα…
              </option>
              {AUDIT_INTENTS.map((intent) => (
                <option
                  key={intent}
                  value={intent}
                  className="bg-obsidian-775 text-zinc-100"
                >
                  {intent}
                </option>
              ))}
            </select>

            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
              strokeWidth={1.8}
            />
          </div>
        </Field>

        <Field
          id="audit-brief"
          label="Σύντομη περιγραφή αναγκών"
          error={errors.brief}
        >
          <textarea
            id="audit-brief"
            name="brief"
            rows={4}
            placeholder="Π.χ. έχουμε WordPress που αργεί και 3 ώρες/ημέρα χειροκίνητη καταχώρηση παραγγελιών…"
            value={values.brief}
            disabled={isSubmitting}
            onChange={(event) => update("brief", event.target.value)}
            aria-invalid={Boolean(errors.brief)}
            aria-describedby={errors.brief ? "audit-brief-error" : undefined}
            className={cn(
              FIELD_BASE,
              fieldTone(Boolean(errors.brief)),
              "resize-y",
            )}
          />
        </Field>
      </div>

      {/* --------------------------- Submit ---------------------------- */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary mt-7 w-full px-5 py-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting && (
          <LoaderCircle className="h-4 w-4 animate-spin" strokeWidth={2.2} />
        )}
        {isSubmitting ? "Αποστολή…" : "Αποστολή Αιτήματος για Δωρεάν Audit"}
      </button>

      {/* Submit-level failures only. Field problems render beside their own
          input; repeating them here would just be noise. */}
      {status === "error" && submitMessage && (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-red-500/25 bg-red-500/[0.07] px-3.5 py-2.5 text-xs text-red-300"
        >
          {submitMessage}
        </p>
      )}

      <p className="mt-4 text-center text-xs leading-relaxed text-ink-faint">
        Θα λάβετε {AUDIT_DELIVERABLE}. Τα στοιχεία σας χρησιμοποιούνται μόνο
        για αυτό.
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Field wrapper                                                      */
/* ------------------------------------------------------------------ */

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-mono-xs uppercase tracking-[0.12em] text-ink-faint"
      >
        {label}
        {required && (
          <span aria-hidden className="ml-1 text-ink-ghost">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
