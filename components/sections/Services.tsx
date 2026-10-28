"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { serviceDemos } from "@/components/ui/ServiceDemos";
import { gsap } from "@/lib/gsap";
import { services } from "@/lib/services";
import { buttonClass } from "@/utils/buttonStyles";
import { clamp } from "@/utils/math";
import { prefersReducedMotion } from "@/utils/scroll";

const range = (value: string | undefined) => (value ?? "0,1").split(",").map(Number);

export default function Services() {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const slider = useRef<HTMLInputElement>(null);
  const output = useRef<HTMLOutputElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const tween = useRef<gsap.core.Tween | null>(null);
  const progress = useRef({ s: 1 });
  const shouldPlay = useRef(false);
  const seen = useRef(false);

  const paint = useCallback((s: number) => {
    const root = stage.current;
    if (!root) return;
    root.querySelectorAll<SVGElement>("[data-draw]").forEach((el) => {
      const [a, b] = range(el.dataset.draw);
      el.style.strokeDashoffset = String(1 - clamp((s - a) / (b - a)));
    });
    root.querySelectorAll<SVGElement>("[data-fade]").forEach((el) => {
      const [a, b] = range(el.dataset.fade);
      el.style.opacity = String(clamp((s - a) / (b - a)));
    });
    root.querySelectorAll<SVGElement>("[data-out]").forEach((el) => {
      const [a, b] = range(el.dataset.out);
      el.style.opacity = String(1 - clamp((s - a) / (b - a)));
    });
    if (slider.current) slider.current.value = String(Math.round(s * 100));
    if (output.current) output.current.textContent = `${Math.round(s * 100)}%`;
  }, []);

  const play = useCallback(() => {
    tween.current?.kill();
    progress.current.s = 0;
    paint(0);
    if (prefersReducedMotion()) {
      progress.current.s = 1;
      paint(1);
      return;
    }
    tween.current = gsap.to(progress.current, {
      s: 1,
      duration: 4.2,
      ease: "power1.inOut",
      onUpdate: () => paint(progress.current.s),
    });
  }, [paint]);

  /* After the selected demo mounts, either play it (user picked it) or show it complete. */
  useEffect(() => {
    if (shouldPlay.current) {
      shouldPlay.current = false;
      play();
    } else {
      paint(1);
    }
  }, [active, play, paint]);

  /* Play the first demo once, when it scrolls into view. */
  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !seen.current) {
          seen.current = true;
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      tween.current?.kill();
    };
  }, [play]);

  function select(i: number) {
    shouldPlay.current = true;
    setActive(i);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const forward = e.key === "ArrowDown" || e.key === "ArrowRight";
    const back = e.key === "ArrowUp" || e.key === "ArrowLeft";
    if (!forward && !back) return;
    e.preventDefault();
    const next = (active + (forward ? 1 : services.length - 1)) % services.length;
    select(next);
    tabs.current[next]?.focus();
  }

  const Demo = serviceDemos[active];

  return (
    <section
      id="services"
      aria-label="Services"
      className="relative border-t border-line bg-ink py-[clamp(4.5rem,10vw,9rem)]"
    >
      <Container>
        <SectionHead eyebrow="What we do" title="Four services, shown at work" />

        <div className="grid grid-cols-1 items-start gap-[clamp(1.5rem,4vw,4rem)] min-[960px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <Reveal
            className="border-b border-line"
            role="tablist"
            aria-label="Services"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
          >
            {services.map((service, i) => (
              <button
                key={service.title}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`service-tab-${i}`}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls="service-panel"
                tabIndex={i === active ? 0 : -1}
                onClick={() => select(i)}
                className="group block w-full cursor-pointer border-0 border-t border-line bg-transparent py-[1.1rem] text-left text-mute transition-colors hover:text-fg aria-selected:text-fg"
              >
                <span className="flex items-baseline justify-between gap-4 text-[clamp(1.35rem,2.6vw,2.1rem)] font-bold leading-[1.1] [font-stretch:115%]">
                  {service.title}
                  <small className="whitespace-nowrap font-mono text-[.62rem] font-medium uppercase tracking-[.12em] text-blue">
                    {service.tag}
                  </small>
                </span>
                <span className="mt-[.7rem] hidden max-w-[30rem] text-[.98rem] text-soft group-aria-selected:block">
                  {service.description}
                </span>
              </button>
            ))}
          </Reveal>

          <Reveal className="min-w-0 border border-line bg-ink-2">
            <div
              ref={stage}
              id="service-panel"
              role="tabpanel"
              aria-labelledby={`service-tab-${active}`}
            >
              <Demo />
            </div>
            <div className="flex items-center gap-4 border-t border-line px-4 py-[.8rem]">
              <button type="button" className={buttonClass("ghost", "sm")} onClick={play}>
                Replay
              </button>
              <input
                ref={slider}
                type="range"
                min={0}
                max={100}
                defaultValue={100}
                aria-label="Demonstration progress"
                className="min-w-0 flex-1 accent-blue"
                onChange={(e) => {
                  tween.current?.kill();
                  progress.current.s = Number(e.target.value) / 100;
                  paint(progress.current.s);
                }}
              />
              <output
                ref={output}
                className="min-w-[6.5ch] text-right font-mono text-[.7rem] tracking-[.08em] text-mute"
              >
                100%
              </output>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}