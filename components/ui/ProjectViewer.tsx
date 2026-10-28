"use client";

import { useEffect, useRef, useState } from "react";
import { createViewer, type Viewer, type ViewName } from "@/lib/three/viewer";

const seg =
  "inline-flex border border-line-2 bg-[rgba(11,17,20,.6)] backdrop-blur-[6px]";
const segBtn =
  "cursor-pointer border-0 bg-transparent px-[.85rem] py-[.6rem] text-[.7rem] font-bold uppercase tracking-[.12em] text-mute aria-pressed:bg-blue aria-pressed:text-[#06161c]";

const VIEW_LABELS: Array<[ViewName, string]> = [
  ["ext", "Exterior"],
  ["aer", "Aerial"],
  ["ent", "Entrance"],
];

/** Interactive 3D model with day/night and camera presets. Fills its positioned parent. */
export default function ProjectViewer({ index }: { index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const [night, setNight] = useState(false);
  const [view, setView] = useState<ViewName>("ext");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    viewer.current = createViewer(canvas);
    return () => {
      viewer.current?.dispose();
      viewer.current = null;
    };
  }, []);

  useEffect(() => {
    viewer.current?.setModel(index);
  }, [index]);

  function chooseNight(on: boolean) {
    setNight(on);
    viewer.current?.setNight(on);
  }

  function chooseView(next: ViewName) {
    setView(next);
    viewer.current?.setView(next);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D model of the selected project. Drag to rotate."
        className="absolute inset-0 block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap justify-between gap-[.6rem] p-[.9rem] *:pointer-events-auto">
        <div className={seg} role="group" aria-label="Lighting">
          <button type="button" className={segBtn} aria-pressed={!night} onClick={() => chooseNight(false)}>
            Day
          </button>
          <button type="button" className={segBtn} aria-pressed={night} onClick={() => chooseNight(true)}>
            Night
          </button>
        </div>
        <span className="bg-[rgba(11,17,20,.6)] px-[.7rem] py-[.55rem] font-mono text-[.64rem] font-medium uppercase tracking-[.12em] text-mute">
          Drag to rotate
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-[.6rem] p-[.9rem] *:pointer-events-auto">
        <div className={seg} role="group" aria-label="Camera view">
          {VIEW_LABELS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={segBtn}
              aria-pressed={view === key}
              onClick={() => chooseView(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}