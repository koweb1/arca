"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/utils/scroll";

export default function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    el.textContent = "0";
    const counter = { v: 0 };
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 92%",
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          v: value,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.v));
          },
        });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(counter);
      el.textContent = String(value);
    };
  }, [value]);

  // The final number is rendered on the server, so it shows even without JavaScript.
  return <span ref={ref} dangerouslySetInnerHTML={{ __html: String(value) }} />;
}