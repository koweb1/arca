"use client";

import { useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { useFrame } from "@/hooks/useFrame";
import { processSteps } from "@/lib/content";
import { clamp } from "@/utils/math";
import { sectionProgress } from "@/utils/scroll";
import { scenePinFallback } from "@/utils/sceneStyles";

export default function Process() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const lastCard = useRef(0);
  const [activeCard, setActiveCard] = useState(0);

  useFrame(() => {
    const s = section.current;
    const t = track.current;
    if (!s || !t) return;
    const pp = sectionProgress(s);

    const ci =
      pp <= 0
        ? 0
        : Math.max(0, Math.min(processSteps.length - 1, Math.floor(pp * processSteps.length - 0.0001)));
    if (ci !== lastCard.current) {
      lastCard.current = ci;
      setActiveCard(ci);
    }

    // Scroll far enough that the last card ends on the same right edge as the content above
    const last = t.lastElementChild as HTMLElement | null;
    if (last) {
      const edge = parseFloat(getComputedStyle(t).paddingLeft) || 0;
      const end = last.offsetLeft + last.offsetWidth;
      const max = Math.max(0, end - (document.documentElement.clientWidth - edge));
      t.style.transform = `translateX(${-clamp(pp) * max}px)`;
    }
    line.current?.style.setProperty("--p", `${clamp(pp) * 100}%`);
  });

  return (
    <section
      ref={section}
      id="process"
      aria-label="Design process"
      className={`relative h-[560vh] ${scenePinFallback}`}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-x-0 top-[calc(var(--nav-h)+1.1rem)]">
          <Container>
            <p className="eyebrow">Design process</p>
            <h2 className="disp mt-[.8rem] max-w-[16ch] text-[clamp(1.8rem,4vw,3.4rem)]">
              From first conversation to final drawings
            </h2>
          </Container>
        </div>

        <div className="absolute inset-x-0 bottom-[calc(5.4rem+env(safe-area-inset-bottom,0px))] overflow-visible">
          <ol
            ref={track}
            className="m-0 flex list-none gap-[1.1rem] p-0 pl-[var(--edge)] will-change-transform"
          >
            {processSteps.map((step, i) => (
              <li
                key={step.number}
                aria-current={i === activeCard ? "step" : undefined}
                className={`shrink-0 grow-0 basis-[min(78vw,21rem)] border bg-[rgba(11,17,20,.72)] p-[1.3rem] backdrop-blur-[8px] transition-[opacity,border-color] duration-[400ms] ${
                  i === activeCard ? "border-blue opacity-100" : "border-line-2 opacity-50"
                }`}
              >
                <span className="font-mono text-[.72rem] font-medium tracking-[.14em] text-blue">
                  {step.number}
                </span>
                <h3 className="mb-2 mt-[.6rem] text-[1.7rem] font-extrabold uppercase [font-stretch:125%]">
                  {step.title}
                </h3>
                <p className="text-[.95rem] text-soft">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>

        <div
          ref={line}
          aria-hidden="true"
          className="absolute bottom-[calc(3.7rem+env(safe-area-inset-bottom,0px))] left-[var(--edge)] right-[var(--edge)] h-px bg-line-2"
        >
          <i className="absolute -top-px left-0 h-[3px] w-[var(--p,0%)] bg-blue" />
        </div>
      </div>
    </section>
  );
}