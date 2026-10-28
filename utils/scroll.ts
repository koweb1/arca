import { clamp } from "./math";

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const isNarrow = () => window.innerWidth < 900;

/** 0 to 1 progress through a tall sticky section. */
export function sectionProgress(el: HTMLElement): number {
  const range = el.offsetHeight - window.innerHeight;
  if (range <= 0) return 0;
  return clamp(-el.getBoundingClientRect().top / range);
}