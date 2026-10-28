"use client";

import type { AnchorHTMLAttributes, MouseEvent, Ref } from "react";
import { prefersReducedMotion } from "@/utils/scroll";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: `#${string}`;
  ref?: Ref<HTMLAnchorElement>;
};

const FOCUSABLE = "a[href],button,input,select,textarea,[tabindex]";

/** In-page link: smooth scroll, updates the URL hash and moves keyboard focus to the target. */
export default function AnchorLink({ href, children, onClick, ref, ...rest }: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    // Let the browser handle "open in new tab" and similar modified clicks
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    // The +2px nudge makes the pinned sections start at progress zero
    let top = target.getBoundingClientRect().top + window.scrollY;
    if (id === "about" || id === "process") top += 2;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });

    if (window.location.hash !== href) window.history.pushState(null, "", href);

    if (!target.matches(FOCUSABLE)) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}