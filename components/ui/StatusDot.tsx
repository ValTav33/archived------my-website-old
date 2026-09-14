/**
 * The live status dot — the one place emerald is allowed (playbook §2.4).
 *
 * Always `aria-hidden`. The dot never carries the meaning on its own: every
 * call site puts a readable label beside it ("Διαθέσιμοι για νέα projects",
 * "ΕΤΟΙΜΟ"), so a screen reader gets the state from the text and the dot is
 * pure decoration. State conveyed by colour alone would fail the same rule
 * that governs the FAQ disclosure.
 */
export default function StatusDot({
  /** The breathing halo. Off for dots inside an already-animated surface. */
  pulse = true,
}: {
  pulse?: boolean;
}) {
  if (!pulse) {
    return <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-live" />;
  }

  return (
    <span aria-hidden className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-pulse-slow rounded-full bg-live" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-live" />
    </span>
  );
}
