"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { scrollToId } from "@/lib/utils";

/**
 * An in-page link that scrolls smoothly, without putting the page behind
 * hydration to do it.
 *
 * Every CTA on this page used to be a `<button onClick={scrollToId}>`, which
 * forced its whole section to be a Client Component — including the hero, the
 * LCP element. Two separate costs came with that: the markup shipped as a
 * button, so assistive technology announced a navigation control as a button
 * and offered it in the wrong rotor, and nothing worked at all until the
 * bundle arrived.
 *
 * This renders a real `<a href="#id">`. The browser handles it natively before
 * any JavaScript loads — `globals.css` already supplies
 * `scroll-behavior: smooth` and a `scroll-padding-top` that clears the fixed
 * header, and already collapses both under `prefers-reduced-motion`.
 *
 * The click handler is a pure enhancement on top of that: `scrollToId` reads
 * the motion preference itself (a scripted `scrollIntoView` ignores the media
 * query) and uses `replaceState`, so a visitor who clicks four CTAs does not
 * get four entries in their back-stack. If the handler never runs, the anchor
 * still works — it just leaves a history entry behind.
 *
 * `onClick` is composed rather than overridden, so a caller can still observe
 * the click.
 */
export default function ScrollLink({
  to,
  onClick,
  ...rest
}: {
  /** Target section id, without the `#`. */
  to: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href">) {
  return (
    <a
      href={`#${to}`}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        /* Leave modified clicks alone: ctrl/cmd/shift/middle-click are the
           visitor asking for a new tab or window, and hijacking them is the
           single most common way a custom link handler becomes a bug. */
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return;
        }

        event.preventDefault();
        scrollToId(to);
      }}
      {...rest}
    />
  );
}
