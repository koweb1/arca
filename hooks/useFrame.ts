"use client";

import { useEffect, useRef } from "react";

type FrameCallback = (now: number) => void;

const subscribers = new Set<FrameCallback>();
let rafId = 0;

function loop(now: number) {
  rafId = requestAnimationFrame(loop);
  subscribers.forEach((cb) => cb(now));
}

/** Runs a callback every animation frame, sharing one requestAnimationFrame loop across the page. */
export function useFrame(callback: FrameCallback) {
  const saved = useRef(callback);

  useEffect(() => {
    saved.current = callback;
  });

  useEffect(() => {
    const tick: FrameCallback = (now) => saved.current(now);
    subscribers.add(tick);
    if (subscribers.size === 1) rafId = requestAnimationFrame(loop);
    return () => {
      subscribers.delete(tick);
      if (subscribers.size === 0) cancelAnimationFrame(rafId);
    };
  }, []);
}