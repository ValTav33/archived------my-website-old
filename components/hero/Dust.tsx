/**
 * The particle field, hero only.
 *
 * Eighteen dots. Not a canvas, not a loop, no JavaScript at runtime at all —
 * the positions below are a fixed table rather than `Math.random()`, which
 * matters for two reasons beyond taste: a random layout differs between the
 * server render and the client hydration, and a field you cannot reproduce is
 * a field you cannot tune.
 *
 * `aria-hidden`, because it carries no information (§2.4), and `pointer-events-none`
 * so it can never intercept a tap meant for the CTA behind it.
 *
 * Kept only if it holds the phase's Performance budget — playbook §2.4's
 * particles row states that as a condition, not a preference.
 */
const DUST = [
  { x: 6, y: 18, s: 2, d: 26, delay: 0, o: 0.5 },
  { x: 14, y: 62, s: 1, d: 34, delay: 4, o: 0.35 },
  { x: 21, y: 34, s: 1, d: 30, delay: 11, o: 0.4 },
  { x: 28, y: 78, s: 2, d: 38, delay: 2, o: 0.3 },
  { x: 34, y: 12, s: 1, d: 28, delay: 15, o: 0.45 },
  { x: 41, y: 51, s: 1, d: 33, delay: 7, o: 0.3 },
  { x: 47, y: 88, s: 2, d: 41, delay: 19, o: 0.35 },
  { x: 53, y: 26, s: 1, d: 29, delay: 9, o: 0.4 },
  { x: 59, y: 68, s: 1, d: 36, delay: 1, o: 0.3 },
  { x: 64, y: 41, s: 2, d: 31, delay: 13, o: 0.45 },
  { x: 70, y: 82, s: 1, d: 27, delay: 5, o: 0.3 },
  { x: 76, y: 16, s: 1, d: 39, delay: 17, o: 0.4 },
  { x: 81, y: 57, s: 2, d: 32, delay: 3, o: 0.35 },
  { x: 86, y: 31, s: 1, d: 35, delay: 21, o: 0.3 },
  { x: 90, y: 73, s: 1, d: 30, delay: 8, o: 0.4 },
  { x: 94, y: 45, s: 2, d: 37, delay: 12, o: 0.3 },
  { x: 11, y: 92, s: 1, d: 40, delay: 6, o: 0.35 },
  { x: 97, y: 9, s: 1, d: 28, delay: 16, o: 0.3 },
] as const;

export default function Dust() {
  return (
    <div
      aria-hidden
      className="dust pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {DUST.map((d, i) => (
        <span
          key={i}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: `${d.s}px`,
            height: `${d.s}px`,
            opacity: d.o,
            animationDuration: `${d.d}s`,
            animationDelay: `-${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
