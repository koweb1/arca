"use client";

import { useRef } from "react";
import { useFrame } from "@/hooks/useFrame";
import { SECTIONS } from "@/lib/content";
import { clamp } from "@/utils/math";

/** Drawing-office readout: scale bar, level in metres and the current sheet name. */
export default function ScrollReadout() {
  const box = useRef<HTMLDivElement>(null);
  const level = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLSpanElement>(null);
  const els = useRef<Array<HTMLElement | null>>([]);

  useFrame(() => {
    if (!box.current || !level.current || !sheet.current) return;
    if (els.current.length === 0) {
      els.current = SECTIONS.map((s) => document.getElementById(s.id));
    }
    const y = window.scrollY;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;
    level.current.textContent = `+${(clamp(docH > 0 ? y / docH : 0) * 18.4).toFixed(2)} m`;

    let current: string = SECTIONS[0].label;
    SECTIONS.forEach((s, i) => {
      const el = els.current[i];
      if (el && el.getBoundingClientRect().top <= vh * 0.5) current = s.label;
    });
    if (sheet.current.textContent !== current) sheet.current.textContent = current;

    /* Below 1024px the Projects controls sit where the readout is, so hide it while that section is on screen */
    const work = els.current[SECTIONS.findIndex((s) => s.id === "work")];
    let hide = false;
    if (work && window.innerWidth < 1024) {
      const r = work.getBoundingClientRect();
      hide = r.top < vh && r.bottom > 0;
    }
    const next = hide ? "0" : "1";
    if (box.current.style.opacity !== next) box.current.style.opacity = next;
  });

  return (
    <div
      ref={box}
      aria-hidden="true"
      className="fixed bottom-[calc(14px+env(safe-area-inset-bottom,0px))] right-[max(var(--gutter),env(safe-area-inset-right,0px))] z-[45] flex items-center gap-[.9rem] border border-line bg-[rgba(11,17,20,.6)] px-3 py-[.55rem] font-mono text-[.68rem] font-medium uppercase leading-none tracking-[.1em] text-mute backdrop-blur-[6px] transition-opacity duration-300"
    >
      <svg width="64" height="14" viewBox="0 0 64 14">
        <path d="M1 8H63M1 4V12M32 6V10M63 4V12" fill="none" stroke="currentColor" strokeWidth="1" />
        <rect x="1" y="6.5" width="31" height="3" fill="currentColor" />
      </svg>
      <span>1:200</span>
      <b ref={level} className="inline-block min-w-[6.5ch] font-medium tabular-nums text-fg">
        +0.00 m
      </b>
      <span ref={sheet} className="max-[600px]:hidden">
        A-01 Arrival
      </span>
    </div>
  );
}