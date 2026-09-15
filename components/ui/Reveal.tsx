"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Fades a block up as it enters the viewport. Once, never on the way back.
 *
 * ## It fails open, and that is the whole design
 *
 * The obvious implementation starts the element at `opacity: 0` and lets
 * JavaScript reveal it. That hides content whenever the script does not run —
 * a failed bundle, an old browser, a blocked request — and content that is
 * invisible is worse than content that never animated.
 *
 * So the initial server render carries **no** styles at all: `idle`. The
 * effect is what arms the animation, and it only arms it for blocks that are
 * still **below** the fold. Anything already on screen when the component
 * mounts goes straight to `shown`, which also removes the flash you get from
 * hiding something the visitor is already looking at.
 *
 * Under `prefers-reduced-motion` it never arms — §10.6, and the right
 * reduced-motion state for an entrance is "already arrived", not "arrives
 * instantly".
 *
 * ## Why not Framer Motion
 *
 * §2.5 locks Framer Motion as the animation library and it stays the library
 * for anything stateful — the drawer, the FAQ disclosures. This is two CSS
 * properties on a scroll boundary, and `whileInView` would pull the motion
 * runtime into every section that uses it. `children` are passed through as
 * props, so everything inside stays a Server Component either way.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Stagger, in ms. Keep the total per viewport small — §2.4 caps it at 1–2. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  /* No React state, deliberately. The server renders `idle`, the effect writes
     the attribute straight onto the node, and nothing re-renders — which is
     both what an effect is for (synchronising an external system) and what
     keeps the lint rule about cascading renders satisfied rather than
     suppressed. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const settle = () => {
      el.dataset.reveal = "shown";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      settle();
      return;
    }

    /* Already on screen — never hide something the visitor can see. */
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
      settle();
      return;
    }

    el.dataset.reveal = "armed";

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        settle();
        io.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal="idle"
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", className)}
    >
      {children}
    </div>
  );
}
