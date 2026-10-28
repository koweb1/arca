"use client";

import { useEffect, useRef } from "react";
import AnchorLink from "@/components/ui/AnchorLink";
import Container from "@/components/ui/Container";
import { useFrame } from "@/hooks/useFrame";
import { gsap } from "@/lib/gsap";
import { buttonClass } from "@/utils/buttonStyles";
import { ramp } from "@/utils/math";
import { prefersReducedMotion, sectionProgress } from "@/utils/scroll";
import { scenePinFallback } from "@/utils/sceneStyles";

const overlayText = "text-soft [text-shadow:0_1px_10px_rgba(0,0,0,.55)]";

export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);

  useFrame(() => {
    const s = section.current;
    const c = content.current;
    if (!s || !c) return;
    const hp = sectionProgress(s);
    const f = 1 - ramp(hp, 0.3, 0.62);
    c.style.opacity = String(f);
    c.style.transform = `translateY(${-ramp(hp, 0.2, 0.62) * 40}px)`;
    c.style.pointerEvents = f < 0.2 ? "none" : "";
  });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-line]", {
        yPercent: 110,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.2,
      });
      gsap.from("[data-hero-fade]", {
        opacity: 0,
        y: 16,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.7,
      });
    }, content);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={section}
      id="hero"
      aria-label="Arrival"
      className={`relative h-[230vh] ${scenePinFallback}`}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div
          aria-hidden="true"
          className={`absolute right-[var(--edge)] top-[calc(var(--nav-h)+1.1rem)] hidden text-right font-mono text-[.66rem] font-medium uppercase leading-[1.7] tracking-[.14em] min-[700px]:block ${overlayText}`}
        >
          6.5244° N<br />
          3.3792° E<br />
          Lagos
        </div>

        <div
          ref={content}
          className="absolute inset-x-0 bottom-0 isolate pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]"
        >
          {/* Soft scrim so the copy stays readable over the lighter sky */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[150%] bg-gradient-to-t from-ink/80 via-ink/40 to-transparent"
          />
          <Container>
            <p data-hero-fade className="eyebrow">
              Architecture &amp; Interior Studio
            </p>
            <h1 className="disp mb-[1.4rem] mt-4 text-[clamp(2.15rem,4.4vw,5.25rem)]">
              <span className="block overflow-hidden pb-[.06em]">
                <span data-hero-line className="block">
                  Spaces that
                </span>
              </span>
              <span className="block overflow-hidden pb-[.06em]">
                <span data-hero-line className="block">
                  define the future.
                </span>
              </span>
            </h1>
            <p
              data-hero-fade
              className="max-w-[36rem] text-[clamp(1.02rem,1.5vw,1.22rem)] text-soft"
            >
              Architecture shaped by vision, precision, and purpose.
            </p>
            {/* Phones: stacked, full width, equal size. From 640px: side by side at natural width. */}
            <div
              data-hero-fade
              className="mt-10 flex flex-col gap-3 min-[640px]:mt-8 min-[640px]:flex-row min-[640px]:flex-wrap min-[640px]:gap-[.8rem]"
            >
              <AnchorLink
                href="#work"
                className={buttonClass("primary", "md", "w-full min-[640px]:w-auto")}
              >
                Explore Our Work &rarr;
              </AnchorLink>
              <AnchorLink
                href="#contact"
                className={buttonClass("ghost", "md", "w-full min-[640px]:w-auto")}
              >
                Start a Project
              </AnchorLink>
            </div>
          </Container>
        </div>

        {/* Desktop hint only. On phones it collided with the scroll readout. */}
        <div
          aria-hidden="true"
          className={`absolute bottom-[calc(1.6rem+env(safe-area-inset-bottom,0px))] left-[var(--edge)] hidden items-center gap-[.8rem] font-mono text-[.66rem] font-medium uppercase tracking-[.16em] min-[640px]:flex ${overlayText}`}
        >
          <i className="relative block h-px w-[3.2rem] overflow-hidden bg-line-2 after:absolute after:inset-0 after:animate-cue after:bg-blue after:content-[''] after:[transform:translateX(-100%)]" />
          Scroll to enter
        </div>
      </div>
    </section>
  );
}