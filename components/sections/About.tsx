"use client";

import { useRef, useState } from "react";
import Container from "@/components/ui/Container";
import { useFrame } from "@/hooks/useFrame";
import { aboutStages, aboutSteps } from "@/lib/content";
import { clamp } from "@/utils/math";
import { sectionProgress } from "@/utils/scroll";
import { scenePinFallback } from "@/utils/sceneStyles";

export default function About() {
  const section = useRef<HTMLElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lastStage = useRef(0);
  const [stage, setStage] = useState(0);

  useFrame(() => {
    const s = section.current;
    if (!s) return;
    const ap = sectionProgress(s);
    const next = ap < 0.34 ? 0 : ap < 0.66 ? 1 : 2;
    if (next !== lastStage.current) {
      lastStage.current = next;
      setStage(next);
    }
    stepRefs.current.forEach((el, i) => {
      el?.style.setProperty("--p", `${clamp(ap * 3 - i, 0, 1) * 100}%`);
    });
  });

  return (
    <section
      ref={section}
      id="about"
      aria-label="Studio"
      className={`relative h-[420vh] ${scenePinFallback}`}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(8,13,16,.92)_0%,rgba(8,13,16,.6)_45%,rgba(8,13,16,0)_75%)] min-[900px]:bg-[linear-gradient(90deg,rgba(8,13,16,.86)_0%,rgba(8,13,16,.5)_40%,rgba(8,13,16,0)_70%)]" />
        <div className="absolute inset-0 flex items-end pb-[calc(4.2rem+env(safe-area-inset-bottom,0px))] min-[900px]:items-center min-[900px]:pb-0">
          <Container className="w-full">
            <div className="max-w-[30rem]">
              <p className="eyebrow">The Studio</p>
              <div className="mt-[1.2rem] grid">
                {aboutStages.map((s, i) => (
                  <div
                    key={s.title}
                    className={`transition-all duration-500 [grid-area:1/1] ${
                      i === stage ? "translate-y-0 opacity-100" : "translate-y-[18px] opacity-0"
                    }`}
                  >
                    <h2 className="disp mb-4 text-[clamp(1.8rem,3.6vw,3.1rem)]">{s.title}</h2>
                    <p className="max-w-[27rem] text-soft">{s.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-[.6rem]" aria-hidden="true">
                {aboutSteps.map((label, i) => (
                  <div
                    key={label}
                    ref={(el) => {
                      stepRefs.current[i] = el;
                    }}
                    className={`relative flex-1 border-t border-line-2 pt-[.6rem] font-mono text-[.66rem] font-medium uppercase tracking-[.12em] before:absolute before:-top-px before:left-0 before:h-0.5 before:w-[var(--p,0%)] before:bg-blue before:content-[''] ${
                      i <= stage ? "text-fg" : "text-mute"
                    }`}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>
    </section>
  );
}