"use client";

import { useEffect, useRef, type ElementType, type HTMLAttributes, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/utils/scroll";

type Props = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

/** Fades and lifts its content in when it scrolls into view. Content already on screen is left alone. */
export default function Reveal({ as: Tag = "div", children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top <= window.innerHeight * 0.92) return;

    gsap.set(el, { opacity: 0, y: 28 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
      },
    });

    return () => {
      trigger.kill();
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "opacity,transform" });
    };
  }, []);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}