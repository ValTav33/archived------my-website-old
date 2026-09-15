/**
 * The little schematic on a showcase card: the system's hops, as nodes on a
 * line that draws itself once when the card arrives.
 *
 * ## Why this exists
 *
 * Val declined photography on 2026-09-15 and asked for animated elements
 * instead. The cards had nothing to look at — three text blocks in a row on a
 * page whose whole complaint was "not engaging" — and a screenshot of client
 * work is exactly what we are not allowed to invent (§8).
 *
 * So it draws the **shape** of the system and nothing more: how many steps,
 * and that they are connected. It carries no labels, asserts no result, and
 * the section it sits in is titled «Ενδεικτικά». `aria-hidden`, because every
 * hop is already named in words on the service page this card links to — a
 * screen-reader user gets the real list, not a description of a drawing.
 *
 * ## Why it draws once rather than loops
 *
 * §2.4 caps animation at 1–2 elements per viewport, and three of these sit in
 * one row. A loop would put three continuous animations on screen at once and
 * break that rule three times over. A one-shot draw is part of the card's
 * entrance instead — it inherits `data-reveal="shown"` from the `Reveal`
 * above it, so it animates when the card does and is inert forever after.
 *
 * `stroke-dashoffset` and `opacity` only. Under reduced motion the line is
 * simply already drawn.
 */
export default function FlowGlyph({ hops }: { hops: number }) {
  /* Clamped: the glyph describes shape, and past five dots it stops reading
     as a sequence and starts reading as texture. */
  const count = Math.min(Math.max(hops, 2), 5);
  const width = 120;
  const gap = width / (count - 1);

  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} 16`}
      className="flow-glyph mt-5 h-4 w-[120px] overflow-visible"
      fill="none"
    >
      <line
        x1="0"
        y1="8"
        x2={width}
        y2="8"
        stroke="currentColor"
        strokeWidth="1"
        className="flow-line text-trace-line"
        pathLength={1}
      />
      {Array.from({ length: count }, (_, i) => (
        <circle
          key={i}
          cx={i * gap}
          cy="8"
          r={i === count - 1 ? 3 : 2}
          className="flow-node text-trace-active"
          fill="currentColor"
          style={{ animationDelay: `${300 + i * 110}ms` }}
        />
      ))}
    </svg>
  );
}
