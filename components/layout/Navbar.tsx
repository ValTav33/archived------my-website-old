"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { cn, scrollToId, scrollToTop } from "@/lib/utils";

type Language = "EL" | "EN";

export default function Navbar() {
  /* `scrolled` drives the header hairline: the border is invisible while the
     page is at the top and resolves once content slides underneath. */
  const [scrolled, setScrolled] = useState(false);

  /* `open` controls the mobile drawer. */
  const [open, setOpen] = useState(false);

  /* `lang` is a presentational indicator only — no i18n routing is wired up
     yet, so toggling it just moves the highlighted segment of the EL|EN pill. */
  const [lang, setLang] = useState<Language>("EL");

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
    setOpen(false);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll(); // sync on mount (handles reloads mid-page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /* Every in-page link funnels through here so the drawer always closes
     before the scroll animation starts. */
  const goTo = useCallback(
    (id: string) => {
      closeDrawer(false);
      scrollToId(id);
    },
    [closeDrawer],
  );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b bg-[#08090D]/80 backdrop-blur-md transition-colors duration-300",
        scrolled ? "border-white/[0.07]" : "border-transparent",
      )}
    >
      <nav
        aria-label="Κύρια πλοήγηση"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        {/* ---------------------------- Brand ---------------------------- */}
        <button
          type="button"
          onClick={scrollToTop}
          className="group flex shrink-0 items-baseline gap-2"
        >
          <span className="font-mono text-[13.5px] font-bold uppercase tracking-[0.18em] text-white">
            Valsamis
          </span>
        </button>

        {/* ------------------------ Desktop links ------------------------ */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <button
                type="button"
                onClick={() => goTo(link.id)}
                className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        {/* --------------------- Right-side utilities -------------------- */}
        <div className="flex items-center gap-2">
          {/* Direct phone pill + hover/focus tooltip with office hours. */}
          <div className="group relative hidden xl:block">
            <a
              href={`tel:${SITE.phoneTel}`}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-xs text-zinc-300 transition-colors duration-200 hover:border-white/[0.15] hover:text-white"
            >
              <Phone className="h-3 w-3 text-ink-faint" strokeWidth={2} />
              <span className="font-mono tabular-nums">{SITE.phoneDisplay}</span>
            </a>

            <span
              role="tooltip"
              className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-md border border-white/[0.08] bg-obsidian-750 px-2.5 py-1.5 font-mono text-[11px] text-ink-muted opacity-0 shadow-raise transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              {`Δευτ-Παρ: ${SITE.hoursShort}`}
            </span>
          </div>

          {/* Language indicator. Purely visual until i18n routing lands. */}
          <div
            role="group"
            aria-label="Γλώσσα"
            className="hidden items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 sm:flex"
          >
            {(["EL", "EN"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={lang === code}
                className={cn(
                  "rounded-full px-2 py-1 font-mono text-[10.5px] font-semibold tracking-wider transition-colors duration-200",
                  lang === code
                    ? "bg-white/[0.07] text-white"
                    : "text-ink-ghost hover:text-zinc-400",
                )}
              >
                {code}
              </button>
            ))}
          </div>

          {/* Primary CTA — solid white, the highest-contrast element on screen. */}
          <button
            type="button"
            onClick={() => goTo("audit")}
            className="btn-primary hidden px-4 py-2 text-xs sm:inline-flex"
          >
            Δωρεάν Audit
          </button>

          {/* Hamburger — hidden once the full desktop nav is visible. */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => (open ? closeDrawer(true) : setOpen(true))}
            aria-label={open ? "Κλείσιμο μενού" : "Άνοιγμα μενού"}
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-zinc-400 transition-colors duration-200 hover:border-white/[0.15] hover:text-white lg:hidden"
          >
            {open ? (
              <X className="h-[18px] w-[18px]" strokeWidth={1.8} />
            ) : (
              <Menu className="h-[18px] w-[18px]" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </nav>

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
              className="overflow-hidden border-t border-white/[0.07] bg-[#08090D]/95 backdrop-blur-xl lg:hidden"
            >
              <div className="space-y-5 px-5 pb-7 pt-4 sm:px-8">
                <ul>
                  {NAV_LINKS.map((link, index) => (
                    <motion.li
                      key={link.id}
                      /* Links cascade 40ms apart so the drawer reads as
                         assembled rather than dumped on screen. */
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.04, duration: 0.22 }}
                    >
                      <button
                        type="button"
                        onClick={() => goTo(link.id)}
                        className="flex w-full items-center justify-between border-b border-white/[0.05] py-3.5 text-[15px] text-zinc-400 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                        <ArrowRight
                          className="h-4 w-4 text-ink-ghost"
                          strokeWidth={1.8}
                        />
                      </button>
                    </motion.li>
                  ))}
                </ul>

                {/* Phone + hours stated inline — a hover tooltip is useless
                    on a touch device. */}
                <a
                  href={`tel:${SITE.phoneTel}`}
                  className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3.5 py-3 transition-colors duration-200 hover:border-white/[0.15] hover:bg-white/[0.04]"
                >
                  <Phone className="h-4 w-4 text-ink-faint" strokeWidth={1.8} />
                  <span className="flex flex-col">
                    <span className="font-mono text-sm text-white tabular-nums">
                      {SITE.phoneDisplay}
                    </span>
                    <span className="font-mono text-[11px] text-ink-faint">
                      {`Δευτ-Παρ: ${SITE.hoursShort}`}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-white/[0.08] bg-white/[0.02] p-0.5 sm:hidden">
                    {(["EL", "EN"] as const).map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setLang(code)}
                        aria-pressed={lang === code}
                        className={cn(
                          "rounded-full px-3 py-1.5 font-mono text-[10.5px] font-semibold tracking-wider transition-colors duration-200",
                          lang === code
                            ? "bg-white/[0.07] text-white"
                            : "text-ink-ghost",
                        )}
                      >
                        {code}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => goTo("audit")}
                    className="btn-primary flex-1 px-4 py-2.5 text-sm"
                  >
                    Δωρεάν Audit
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
