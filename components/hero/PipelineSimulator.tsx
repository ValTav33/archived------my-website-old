"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import StatusDot from "@/components/ui/StatusDot";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Timeline model                                                     */
/* ------------------------------------------------------------------ */
/*
 * The whole simulation is driven by a single integer, `cursor`, which walks
 * an alternating step -> connector -> step -> connector -> step timeline:
 *
 *   0  idle (nothing has run yet)
 *   1  step 0 active            4  connector 1 tracing
 *   2  connector 0 tracing      5  step 2 active
 *   3  step 1 active            6  complete
 *
 * Deriving every visual state from one number (rather than a boolean per
 * node) makes impossible combinations unrepresentable — step 3 can never
 * report "done" while step 1 is still running.
 */

const IDLE_CURSOR = 0;
const FINAL_CURSOR = 6;

/** Dwell time (ms) at each cursor value before advancing to the next. */
const STAGE_DURATIONS: Record<number, number> = {
  1: 620, // capturing the inbound lead
  2: 480, // tracer travels down connector 0
  3: 1100, // AI validation — deliberately the longest beat
  4: 480, // tracer travels down connector 1
  5: 760, // CRM write + calendar hold
};

type StepStatus = "pending" | "active" | "done";
type LinkStatus = "idle" | "tracing" | "done";
type LogEntry = { time: string; text: string; emphasis?: boolean };

/*
 * Greek, except for the nouns a Greek professional actually says out loud:
 * `lead`, `AI agent`, `CRM`. Everything that was decoration — Trigger,
 * Validation, Scoring, Sync — is translated, per playbook §11.2.
 *
 * Titles are kept short on purpose. The row truncates them (`min-w-0
 * flex-1 truncate`) and Greek runs longer than English, so a title that
 * reads fine in a mockup arrives on a 375px phone as an ellipsis. These
 * are labels; the detail belongs to the log lines below, which wrap.
 */
const STEPS = [
  { title: "Έναυσμα: νέο lead", activeLabel: "ΛΗΨΗ" },
  { title: "AI agent: αξιολόγηση", activeLabel: "ΑΝΑΛΥΣΗ" },
  { title: "Ενέργεια: CRM & κράτηση", activeLabel: "ΕΓΓΡΑΦΗ" },
] as const;

/**
 * Log lines emitted on entering each cursor value.
 *
 * `exit 0` survives translation: it is a terminal convention, not a word,
 * and translating it would read as a mistake to the exact visitor the
 * terminal motif is aimed at. `source=web_form` did not survive — a
 * key=value pair with a Greek key reads as neither one language nor the
 * other, so the line just says where the lead came from.
 *
 * No measurement appears here. S0.10 removed an invented latency and an
 * invented lead score from this component; §8.1 means none comes back.
 */
const STAGE_LOGS: Record<number, Omit<LogEntry, "time">[]> = {
  1: [{ text: "Νέο lead από τη φόρμα επικοινωνίας" }],
  2: [{ text: "Τακτοποίηση πεδίων → ουρά ελέγχου" }],
  3: [{ text: "Έλεγχος πρόθεσης και προϋπολογισμού" }],
  4: [{ text: "Το lead επιβεβαιώθηκε με AI" }],
  5: [{ text: "Εγγραφή στο CRM · κράτηση ραντεβού" }],
  6: [{ text: "Η ροή ολοκληρώθηκε · exit 0", emphasis: true }],
};

/** Wall-clock stamp, e.g. "12:04:02". Only ever called client-side, from a
    click handler or timer, so it can't desync server and client markup. */
function timestamp() {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}

function logsForStage(stage: number): LogEntry[] {
  const time = timestamp();
  return (STAGE_LOGS[stage] ?? []).map((entry) => ({ ...entry, time }));
}

export default function PipelineSimulator() {
  const [cursor, setCursor] = useState(IDLE_CURSOR);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logViewRef = useRef<HTMLDivElement>(null);

  const isRunning = cursor > IDLE_CURSOR && cursor < FINAL_CURSOR;
  const isComplete = cursor === FINAL_CURSOR;

  /* Self-driving clock. Each mid-run cursor schedules exactly one advance,
     and appends that stage's log lines in the *same* update as the cursor
     change — keeping the timeline and the transcript impossible to desync,
     and side-effect-free under StrictMode's double-invoked effects. */
  useEffect(() => {
    if (!isRunning) return;

    const timer = window.setTimeout(() => {
      const next = cursor + 1;
      setCursor(next);
      setLogs((previous) => [...previous, ...logsForStage(next)]);
    }, STAGE_DURATIONS[cursor]);

    return () => window.clearTimeout(timer);
  }, [cursor, isRunning]);

  /* Keep the newest log line in view as the transcript grows. */
  useEffect(() => {
    const view = logViewRef.current;
    if (view) view.scrollTop = view.scrollHeight;
  }, [logs]);

  /* Restarting from any state rewinds the cursor and clears the transcript. */
  const runSimulation = () => {
    setCursor(1);
    setLogs(logsForStage(1));
  };

  /* Derived state — a step is active on its odd slot, done after it. */
  const stepStatus = (index: number): StepStatus => {
    const slot = index * 2 + 1;
    if (cursor > slot) return "done";
    if (cursor === slot) return "active";
    return "pending";
  };

  /* Connector i sits on the even slot between step i and step i+1. */
  const linkStatus = (index: number): LinkStatus => {
    const slot = index * 2 + 2;
    if (cursor > slot) return "done";
    if (cursor === slot) return "tracing";
    return "idle";
  };

  const badgeLabel = isRunning
    ? "ΣΕ ΕΞΕΛΙΞΗ"
    : isComplete
      ? "ΟΛΟΚΛΗΡΩΘΗΚΕ"
      : "ΕΤΟΙΜΟ";

  return (
    <Card className="overflow-hidden shadow-panel">
      {/* --------------------------- Window chrome -------------------------- */}
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-trace-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-trace-line" />
          <span className="h-2.5 w-2.5 rounded-full bg-trace-line" />
        </div>

        {/* Shortened from `pipeline-lead-engine.ts` in S1.5. The Greek status
            badge beside it is up to 12 characters where `DONE` was four, and
            `truncate` was eating eight characters off the end of the longer
            name — a filename cut mid-word reads as broken rather than tidy.
            The shorter name matches the showcase's `lead-engine` case id. */}
        <span className="truncate font-mono text-mono-xs text-ink-faint">
          lead-engine.ts
        </span>

        <Badge
          shape="chip"
          className="ml-auto shrink-0 gap-1.5 bg-transparent tracking-[0.12em] text-ink-muted"
        >
          {/* The only colour in the component: a 6px live-status dot. */}
          <StatusDot pulse={false} />
          {badgeLabel}
        </Badge>
      </div>

      {/* ------------------------------ Pipeline ---------------------------- */}
      <div className="px-4 py-5">
        {STEPS.map((step, index) => (
          <div key={step.title}>
            <PipelineStep
              index={index}
              step={step}
              status={stepStatus(index)}
              isFinalStep={index === STEPS.length - 1}
            />
            {index < STEPS.length - 1 && (
              <Connector status={linkStatus(index)} />
            )}
          </div>
        ))}
      </div>

      {/* --------------------------- Execution log -------------------------- */}
      <div className="border-t border-hairline bg-obsidian-950/60 px-4 py-3">
        <div
          ref={logViewRef}
          className="scrollbar-slim h-[92px] space-y-1 overflow-y-auto font-mono text-mono-xs leading-relaxed"
          aria-live="polite"
        >
          {logs.length === 0 ? (
            <p className="text-ink-ghost">
              $ αναμονή για έναυσμα
              <span className="ml-0.5 animate-caret-blink">▋</span>
            </p>
          ) : (
            logs.map((entry, index) => (
              <p key={index} className="flex gap-2">
                <span className="shrink-0 text-ink-ghost tabular-nums">
                  [{entry.time}]
                </span>
                <span
                  className={cn(
                    entry.emphasis ? "text-white" : "text-ink-muted",
                  )}
                >
                  {entry.text}
                </span>
              </p>
            ))
          )}
        </div>
      </div>

      {/* ----------------------------- Trigger ------------------------------ */}
      <div className="border-t border-hairline px-4 py-3.5">
        <button
          type="button"
          onClick={runSimulation}
          disabled={isRunning}
          className={cn(
            "flex min-h-tap w-full items-center justify-center rounded-lg border px-4 py-2.5 font-mono text-mono-xs transition-colors duration-200",
            isRunning
              ? "cursor-not-allowed border-hairline bg-white/[0.02] text-ink-ghost"
              : "border-white/[0.12] bg-white/[0.03] text-white hover:border-white/[0.22] hover:bg-white/[0.07]",
          )}
        >
          {isRunning ? (
            <>
              Εκτέλεση<span className="animate-caret-blink">…</span>
            </>
          ) : isComplete ? (
            "Επανάληψη Προσομοίωσης"
          ) : (
            "Εκτέλεση Προσομοίωσης"
          )}
        </button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function PipelineStep({
  index,
  step,
  status,
  isFinalStep,
}: {
  index: number;
  step: (typeof STEPS)[number];
  status: StepStatus;
  isFinalStep: boolean;
}) {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors duration-500",
        isActive && "animate-border-glow bg-white/[0.04]",
        isDone && "border-white/[0.12] bg-white/[0.02]",
        status === "pending" && "border-hairline bg-transparent",
      )}
    >
      {/* Slot number — the constant left rail of the monitor. */}
      <span
        className={cn(
          "shrink-0 font-mono text-mono-xs tabular-nums transition-colors duration-500",
          isActive || isDone ? "text-ink-muted" : "text-ink-ghost",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <p
        className={cn(
          "min-w-0 flex-1 truncate font-mono text-mono-xs transition-colors duration-500",
          isActive || isDone ? "text-white" : "text-ink-muted",
        )}
      >
        {step.title}
      </p>

      {/* Right-hand chip swaps between queued / live / result. */}
      <span className="shrink-0">
        {isDone ? (
          isFinalStep ? (
            /* The terminal step earns a filled success mark. */
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-black">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          ) : (
            <Check className="h-3.5 w-3.5 text-zinc-400" strokeWidth={2.5} />
          )
        ) : (
          <span
            className={cn(
              "font-mono text-mono-xs tracking-[0.12em] transition-colors duration-300",
              isActive ? "text-white" : "text-ink-ghost",
            )}
          >
            {isActive ? step.activeLabel : "ΑΝΑΜΟΝΗ"}
          </span>
        )}
      </span>
    </div>
  );
}

function Connector({ status }: { status: LinkStatus }) {
  const isTracing = status === "tracing";
  const isDone = status === "done";

  return (
    <div className="relative ml-[19px] h-6 w-px" aria-hidden>
      {/* Dashed rail — dim until the tracer has passed through it. */}
      <div
        className={cn(
          "absolute inset-0 border-l border-dashed transition-colors duration-500",
          isDone || isTracing ? "border-trace-active" : "border-trace-node",
        )}
      />

      {/* Silver tracer, visible only while this segment is live. */}
      {isTracing && (
        <div className="absolute inset-0 overflow-hidden">
          <span className="absolute left-1/2 h-2.5 w-px -translate-x-1/2 animate-tracer-down bg-white shadow-[0_0_6px_1px_rgba(255,255,255,0.5)]" />
        </div>
      )}
    </div>
  );
}
