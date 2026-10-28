"use client";

import { useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import AnchorLink from "@/components/ui/AnchorLink";
import Container from "@/components/ui/Container";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrolled } from "@/hooks/useScrolled";
import { navLinks } from "@/lib/content";
import { siteConfig } from "@/lib/seo";
import { buttonClass } from "@/utils/buttonStyles";
import { cn } from "@/utils/cn";

const focusableSelector = "a[href],button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection();
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  function closeMenu() {
    // Restore scrolling first so the smooth scroll from a menu link is not blocked
    document.body.style.overflow = "";
    setOpen(false);
  }

  /* While the menu is open: lock page scroll, move focus in, trap Tab, close on Escape. */
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.style.overflow = "";
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !rootRef.current) return;

      const items = Array.from(rootRef.current.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (el) => el.getClientRects().length > 0,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // The desktop layout has no menu, so close it if the window grows past the breakpoint
    const onResize = () => {
      if (window.innerWidth >= 900) {
        document.body.style.overflow = "";
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <div ref={rootRef}>
      <header className="fixed inset-x-0 top-0 z-[60] pt-[env(safe-area-inset-top,0px)]">
        {/* Two background layers cross-fade: a soft gradient over the hero, a blurred bar once scrolled */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(11,17,20,.8),rgba(11,17,20,0))] transition-opacity duration-300",
            solid ? "opacity-0" : "opacity-100",
          )}
        />
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 border-b border-line bg-ink/75 backdrop-blur-md transition-opacity duration-300",
            solid ? "opacity-100" : "opacity-0",
          )}
        />

        <Container className="relative flex h-[var(--nav-h)] items-center justify-between gap-6">
          <AnchorLink
            href="#hero"
            aria-label="ARCA Architecture Studio, back to top"
            className="text-[1.3rem] font-extrabold uppercase tracking-[.2em] [font-stretch:125%]"
          >
            ARCA
          </AnchorLink>

          <nav aria-label="Primary" className="hidden gap-10 min-[900px]:flex">
            {navLinks.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <AnchorLink
                  key={link.href}
                  href={link.href as `#${string}`}
                  aria-current={isActive ? "location" : undefined}
                  className="relative py-2 text-[.76rem] font-semibold uppercase tracking-[.15em] opacity-75 transition-opacity after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-blue after:transition-transform after:duration-300 after:content-[''] hover:opacity-100 aria-[current=location]:opacity-100 aria-[current=location]:after:scale-x-100"
                >
                  {link.label}
                </AnchorLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden min-[640px]:block">
              <AnchorLink href="#contact" className={buttonClass("primary", "sm")}>
                Start a Project
              </AnchorLink>
            </div>
            <button
              ref={toggleRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => (open ? closeMenu() : setOpen(true))}
              className="grid size-11 cursor-pointer place-items-center border border-line-2 bg-transparent text-fg transition-colors hover:border-blue hover:text-blue min-[900px]:hidden"
            >
              {open ? <FiX aria-hidden="true" size={20} /> : <FiMenu aria-hidden="true" size={20} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu. Rendered outside the header so the header's blur layer cannot affect its fixed positioning. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={cn(
          "fixed inset-0 z-[55] overflow-y-auto bg-ink/95 backdrop-blur-lg transition-[opacity,visibility] duration-300 min-[900px]:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <Container className="flex min-h-full flex-col pb-[calc(2rem+env(safe-area-inset-bottom,0px))] pt-[calc(var(--nav-h)+env(safe-area-inset-top,0px)+2rem)]">
          <nav aria-label="Mobile">
            <ol className="m-0 list-none border-t border-line p-0">
              {navLinks.map((link, i) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href} className="border-b border-line">
                    <AnchorLink
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={link.href as `#${string}`}
                      onClick={closeMenu}
                      aria-current={isActive ? "location" : undefined}
                      className="disp flex items-baseline gap-4 py-5 text-[clamp(1.9rem,8vw,3rem)] transition-colors hover:text-blue aria-[current=location]:text-blue"
                    >
                      <span className="font-mono text-[.7rem] font-medium normal-case tracking-[.14em] text-mute">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {link.label}
                    </AnchorLink>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-auto pt-10">
            <AnchorLink href="#contact" onClick={closeMenu} className={buttonClass("primary", "md", "w-full")}>
              Start a Project
            </AnchorLink>
            <p className="mt-6 font-mono text-[.78rem] font-medium leading-relaxed text-soft">
              <a href={`mailto:${siteConfig.email}`} className="hover:text-blue">
                {siteConfig.email}
              </a>
              <br />
              <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="hover:text-blue">
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}