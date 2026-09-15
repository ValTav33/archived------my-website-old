"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { CTA_LINK, NAV_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";
import Badge from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

/**
 * The header, on every route since S2.1 moved the chrome into the layout.
 *
 * **Every link here is a `next/link` route, not a `ScrollLink`.** Through
 * Phase 1 the nav scrolled to sections of the single page; once the sections
 * became routes, a scroll link in a header that renders on eleven pages is a
 * silent dead click on ten of them. The in-page anchors that remain on the
 * site — the hero CTA and the showcase banner — both live in components that
 * only ever render on the homepage, so they are still genuinely same-page and
 * stay as they are.
 */

export default function Navbar() {
  /* The current route, for `aria-current` and the active style. */
  const pathname = usePathname();

  /* `scrolled` drives the header hairline: the border is invisible while the
     page is at the top and resolves once content slides underneath. */
  const [scrolled, setScrolled] = useState(false);

  /* True while a `.surface-paper` band is behind the header — see the effect
     below. Drives the whole header's ground, not just its background. */
  const [overPaper, setOverPaper] = useState(false);

  /**
   * The mobile drawer.
   *
   * State is **the route the drawer was opened on**, not a boolean, so `open`
   * is derived and a route change closes it during render. The header lives
   * in the root layout, so an App Router navigation does not remount it and a
   * boolean would leave the drawer hanging open over the new page — the
   * classic App Router nav bug, and invisible at desktop width where the
   * drawer never opens at all.
   *
   * The per-link `onClick` already covers a tap. This covers everything else:
   * browser back and forward, and any programmatic navigation. Deriving it
   * rather than resetting it in an effect is also what stops the render from
   * committing an open drawer for one frame.
   */
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;

  /* The hamburger. Focus returns here when the drawer is dismissed, so a
     keyboard user is put back where they were rather than at the top of the
     document. */
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Set only when the drawer is dismissed without navigating. Following a link
     must NOT pull focus back to the header — focusing a fixed element can
     scroll the page and undo the jump the visitor just asked for. */
  const returnFocusRef = useRef(false);

  /** Closes the drawer, optionally handing focus back to the hamburger. */
  const closeDrawer = useCallback((restoreFocus: boolean) => {
    returnFocusRef.current = restoreFocus;
    setOpenedOn(null);
  }, []);

  /**
   * Two facts about where the header is, computed together on every scroll.
   *
   * `scrolled` drives the shape. `overPaper` drives the **ground**: S4.4 made
   * the conversion section a light band, and a translucent dark header over
   * `paper` composites to about #F6F7F9, on which the white brand mark is
   * **1.02:1**. White on white. The header has to change ground with the page
   * beneath it.
   *
   * **This was an IntersectionObserver first, and it was replaced.** The
   * observer was correct — a root shrunk to the top 64px strip, which is
   * exactly the flat bar's height — but its *updates* could not be verified
   * here: the Browser pane's document is `visibilityState: "hidden"`, and
   * delivery ran anywhere from 1.5 to over 5.5 seconds behind the scroll. A
   * behaviour that cannot be observed is a behaviour that cannot be trusted,
   * and this one is the difference between a legible header and an invisible
   * one. Reading two rects inside a listener that already runs costs
   * essentially nothing, is synchronous, and is verifiable.
   */
  useEffect(() => {
    const bands = Array.from(
      document.querySelectorAll<HTMLElement>(".surface-paper"),
    );

    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      /* A band is behind the header when it crosses the top 64px strip. */
      setOverPaper(
        bands.some((el) => {
          const r = el.getBoundingClientRect();
          return r.top < 64 && r.bottom > 0;
        }),
      );
    };

    onScroll(); // sync on mount, which also handles a reload mid-page
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* While the drawer is open: freeze background scroll, close on Escape, keep
     Tab inside the panel, and restore focus on the way out. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /* Captured now rather than read in the cleanup. The hamburger outlives the
       drawer, so the node is the same either way, but reading a ref in a
       cleanup is a stale-value trap and the linter is right to flag it. */
    const trigger = triggerRef.current;

    /* Queried on every Tab rather than cached: the panel animates in and its
       contents are not guaranteed to be measurable on the first frame. */
    const focusables = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer(true);
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      const inPanel = active instanceof Node && panelRef.current?.contains(active);

      /* Wrap at both ends, and pull focus back in if it has escaped the panel
         entirely (which happens when the drawer opens over a focused element
         in the header). */
      if (event.shiftKey && (active === first || !inPanel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inPanel)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);

      if (returnFocusRef.current) {
        returnFocusRef.current = false;
        trigger?.focus();
      }
    };
  }, [open, closeDrawer]);

  /* Handed to every link in the header. The link itself performs the
     navigation — this only dismisses the drawer first, and deliberately does
     NOT return focus to the hamburger: focusing a fixed element can scroll
     the page and undo the jump the visitor just asked for. */
  const dismissDrawer = useCallback(() => closeDrawer(false), [closeDrawer]);

  /* The header has two shapes: a flat full-bleed bar at the top of the page,
     and a floating pill once the hero is behind you.

     **The drawer is deliberately outside the morphing element.** It is a
     sibling of `nav` inside `header`, and its scrim is anchored at `top-16` —
     the flat bar's exact height. Wrapping the drawer in something that gains
     padding and a 999px radius would clip the panel and strand the scrim.
     So only the inner bar changes, and opening the drawer forces the flat
     shape back regardless of scroll, which keeps that `top-16` true in every
     state rather than true by luck. */
  const pill = scrolled && !open;

  /* The drawer's panel is dark, so while it is open the header stays dark too
     — the same reason the pill flattens: one state, not two halves. */
  const onPaper = overPaper && !open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-[padding] duration-300 ease-out",
          pill ? "px-3 pt-2 sm:px-4 sm:pt-3" : "px-0 pt-0",
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl transition-[border-radius,background-color,box-shadow,border-color] duration-300 ease-out",
            onPaper && "nav-on-paper",
            pill
              ? cn(onPaper ? "glass-on-paper" : "glass-strong", "rounded-full")
              : cn(
                  onPaper ? "glass-on-paper" : "glass",
                  "rounded-none border-x-0 border-t-0",
                  scrolled
                    ? onPaper
                      ? "border-b-rule"
                      : "border-b-hairline"
                    : "border-b-transparent",
                ),
          )}
        >
          <nav
            aria-label="Κύρια πλοήγηση"
            className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8"
          >
        {/* ---------------------------- Brand ---------------------------- */}
        {/* A link, not a button: it navigates, so assistive tech should
            announce it as a link and a middle-click should open a new tab.
            Became `/` in S2.12, as the Phase 1 comment here predicted. */}
        <Link
          href="/"
          onClick={dismissDrawer}
          aria-current={pathname === "/" ? "page" : undefined}
          className="nav-brand group flex min-h-tap shrink-0 items-center gap-2"
        >
          <span className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-white">
            {SITE.brand}
          </span>
        </Link>

        {/* ------------------------ Desktop links ------------------------ */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={dismissDrawer}
                  aria-current={active ? "page" : undefined}
                  /* The active state is the hover colour, not a new one —
                     §10.2 allows exactly one accent and it belongs to the
                     status dots.

                     `min-w-tap` because §2.3's labels are shorter than the
                     ones they replaced: «Έργα» measured **36×44** at 1024px,
                     under the 44 bar S1.3 drove to zero site-wide. Height
                     alone was never the whole rule. */
                  className={cn(
                    "nav-link inline-flex min-h-tap min-w-tap items-center justify-center text-sm transition-colors duration-200 hover:text-white",
                    active ? "text-white" : "text-ink-muted",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* --------------------- Right-side utilities -------------------- */}
        <div className="flex items-center gap-2">
          {/* Direct phone pill + hover/focus tooltip with office hours. */}
          <div className={cn("group relative hidden xl:block", onPaper && "invisible")}>
            <Badge
              as="a"
              href={`tel:${SITE.phoneTel}`}
              interactive
              className="min-h-tap py-1.5 hover:text-white"
            >
              <Phone className="h-3 w-3 text-ink-faint" strokeWidth={2} />
              <span className="tabular-nums">{SITE.phoneDisplay}</span>
            </Badge>

            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-hairline bg-obsidian-750 px-2.5 py-1.5 font-mono text-mono-xs text-ink-muted opacity-0 shadow-raise transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              {`Δευτ-Παρ: ${SITE.hoursShort}`}
            </span>
          </div>

          {/* The EL|EN switch returns in Phase 6, with real /en locale routing. */}

          {/* Primary CTA — solid white, the highest-contrast element on screen. */}
          <Link
            href={CTA_LINK.href}
            onClick={dismissDrawer}
            aria-current={pathname === CTA_LINK.href ? "page" : undefined}
            className={cn(
              "hidden min-h-tap px-4 py-2 text-sm sm:inline-flex",
              onPaper ? "btn-ink" : "btn-primary",
            )}
          >
            {CTA_LINK.label}
          </Link>

          {/* Hamburger — hidden once the full desktop nav is visible. */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (open ? closeDrawer(true) : setOpenedOn(pathname))}
            aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            aria-expanded={open}
            className="nav-icon flex h-11 w-11 items-center justify-center rounded-lg border border-hairline bg-white/[0.02] text-ink-muted transition-colors duration-200 hover:border-hairline-strong hover:text-white lg:hidden"
          >
            {open ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
          </button>
            </div>
          </nav>
        </div>
      </div>

      {/* --------------------------- Mobile drawer -------------------------- */}
      <AnimatePresence>
        {open && (
          <>
            {/* Scrim: dims the page behind the drawer and closes on tap. */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => closeDrawer(true)}
              className="fixed inset-0 top-16 -z-10 bg-obsidian-950/80 lg:hidden"
            />

            {/* Panel: height animation keeps it anchored under the header. */}
            <motion.div
              key="drawer"
              ref={panelRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-hairline bg-obsidian-950/95 backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-5 px-5 pb-7 pt-4 sm:px-8">
                <ul>
                  {NAV_LINKS.map((item, index) => (
                    <motion.li
                      key={item.href}
                      /* Links cascade 40ms apart so the drawer reads as
                         assembled rather than dumped on screen. */
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.04, duration: 0.22 }}
                    >
                      <Link
                        href={item.href}
                        onClick={dismissDrawer}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={cn(
                          "flex min-h-tap w-full items-center justify-between border-b border-hairline py-3.5 text-base transition-colors duration-200 hover:text-white",
                          pathname === item.href ? "text-white" : "text-zinc-400",
                        )}
                      >
                        {item.label}
                        <ArrowRight
                          aria-hidden
                          className="h-4 w-4 text-ink-ghost"
                          strokeWidth={1.8}
                        />
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                {/* Phone + hours stated inline — a hover tooltip is useless
                    on a touch device. */}
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="flex items-center gap-3 rounded-lg border border-hairline bg-white/[0.02] px-3.5 py-3 transition-colors duration-200 hover:border-hairline-strong hover:bg-white/[0.04]"
                >
                  <Phone className="h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <span className="flex flex-col">
                    <span className="font-mono text-sm text-white tabular-nums">
                      {SITE.phoneDisplay}
                    </span>
                    <span className="font-mono text-mono-xs text-ink-faint">
                      {`Δευτ-Παρ: ${SITE.hoursShort}`}
                    </span>
                  </span>
                </a>

                <Link
                  href={CTA_LINK.href}
                  onClick={dismissDrawer}
                  className="btn-primary flex min-h-tap w-full justify-center px-4 py-2.5 text-sm"
                >
                  {CTA_LINK.label}
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
