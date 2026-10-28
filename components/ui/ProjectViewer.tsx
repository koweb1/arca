"use client";

import { useEffect, useRef, useState } from "react";
import { FiRotateCcw, FiRotateCw } from "react-icons/fi";
import { createViewer, type Viewer, type ViewName } from "@/lib/three/viewer";
import { cn } from "@/utils/cn";

const seg = "inline-flex border border-line-2 bg-ink/85 backdrop-blur-md";
const segBtn =
  "inline-flex cursor-pointer items-center border-0 bg-transparent px-[.9rem] py-[.7rem] text-[.7rem] font-bold uppercase tracking-[.12em] text-soft transition-colors hover:text-fg aria-pressed:bg-blue aria-pressed:text-[#06161c]";

const VIEW_LABELS: Array<[ViewName, string]> = [
  ["ext", "Exterior"],
  ["aer", "Aerial"],
  ["ent", "Entrance"],
];

/** Interactive 3D model with day/night, camera presets and rotate buttons. Fills its positioned parent. */
export default function ProjectViewer({ index }: { index: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewer = useRef<Viewer | null>(null);
  const [supported, setSupported] = useState(true);
  const [night, setNight] = useState(false);
  const [view, setView] = useState<ViewName>("ext");
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const v = createViewer(canvas, { onInteract: () => setHint(false) });
    viewer.current = v;
    if (!v) setSupported(false);
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
    setHint(false);
    viewer.current?.setNight(on);
  }

  function chooseView(next: ViewName) {
    setView(next);
    setHint(false);
    viewer.current?.setView(next);
  }

  function rotate(deg: number) {
    setHint(false);
    viewer.current?.rotate(deg);
  }

  return (
    <>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Interactive 3D model of the selected project. Drag, or use the rotate and view buttons, to look around."
        className="absolute inset-0 block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      />

      {!supported ? (
        <p
          role="status"
          className="absolute inset-0 grid place-items-center p-6 text-center font-mono text-[.72rem] uppercase tracking-[.12em] text-mute"
        >
          The 3D preview is not available on this device.
        </p>
      ) : (
        <>
          {/* Drag hint. Fades away after the first interaction. */}
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute left-3 top-3 bg-ink/85 px-[.75rem] py-[.5rem] font-mono text-[.64rem] font-medium uppercase tracking-[.12em] text-soft backdrop-blur-md transition-opacity duration-500 min-[640px]:left-4 min-[640px]:top-4",
              hint ? "opacity-100" : "opacity-0",
            )}
          >
            Drag to rotate
          </span>

          {/* One control bar along the bottom edge */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-2 p-3 *:pointer-events-auto min-[640px]:p-4">
            <div className="flex flex-wrap gap-2">
              <div className={seg} role="group" aria-label="Lighting">
                <button type="button" className={segBtn} aria-pressed={!night} onClick={() => chooseNight(false)}>
                  Day
                </button>
                <button type="button" className={segBtn} aria-pressed={night} onClick={() => chooseNight(true)}>
                  Night
                </button>
              </div>
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

            <div className={seg} role="group" aria-label="Rotate model">
              <button type="button" className={segBtn} aria-label="Rotate left" onClick={() => rotate(-30)}>
                <FiRotateCcw aria-hidden="true" size={16} />
              </button>
              <button type="button" className={segBtn} aria-label="Rotate right" onClick={() => rotate(30)}>
                <FiRotateCw aria-hidden="true" size={16} />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}