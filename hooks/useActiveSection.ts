"use client";

import { useEffect, useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/content";

/** The section currently crossing 40% of the viewport height. Updates state only when the section changes. */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>(SECTIONS[0].id);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.4;
      let current: SectionId = SECTIONS[0].id;
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= line) current = s.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return active;
}