"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { projects } from "@/lib/projects";
import { cn } from "@/utils/cn";
import { prefersReducedMotion } from "@/utils/scroll";

// The 3D viewer pulls in Three.js, so it loads separately from the rest of the page.
const ProjectViewer = dynamic(() => import("@/components/ui/ProjectViewer"), {
  ssr: false,
  loading: () => (
    <p className="absolute inset-0 grid place-items-center font-mono text-[.7rem] uppercase tracking-[.12em] text-mute">
      Loading 3D model…
    </p>
  ),
});

const arrowBase =
  "grid cursor-pointer place-items-center border border-line-2 bg-transparent text-fg transition-colors hover:border-blue hover:text-blue";

const pad = (n: number) => String(n).padStart(2, "0");

export default function Projects() {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const go = (i: number) => setIndex((i + projects.length) % projects.length);

  /* The bottom arrows (below 1024px) sit far from the 3D model, so bring the model back into view
     after a change, unless it is already fully on screen. */
  function step(delta: number, bringViewerIntoView: boolean) {
    go(index + delta);
    if (!bringViewerIntoView || window.innerWidth >= 1024) return;
    const el = document.getElementById("project-viewer");
    if (!el) return;
    const navHeight = 72;
    const r = el.getBoundingClientRect();
    if (r.top >= navHeight && r.bottom <= window.innerHeight) return;
    window.scrollTo({
      top: window.scrollY + r.top - navHeight - 12,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }

  const specs: Array<[string, string]> = [
    ["Completed", project.year],
    ["Floor area", project.area],
  ];

  return (
    <section
      id="work"
      aria-label="Selected projects"
      className="relative bg-ink py-[clamp(4.5rem,10vw,9rem)]"
    >
      <Container>
        <SectionHead
          eyebrow="Selected Projects"
          title="Built from the ground up"
          tag="Concept models for preview"
        />

        {/*
          Phone and tablet: viewer, project selector, details (stacked), arrows at the bottom.
          Desktop (1024px+): viewer and details side by side in one fixed-height row, selector below.
        */}
        <div className="grid grid-cols-1 gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-5 min-[1024px]:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] min-[1024px]:grid-rows-[clamp(32rem,72vh,44rem)_auto] min-[1024px]:gap-y-6">
          {/* Viewer */}
          <Reveal
            id="project-viewer"
            className="relative order-1 aspect-[4/5] max-h-[34rem] min-w-0 overflow-hidden border border-line bg-ink-2 min-[640px]:aspect-[16/10] min-[640px]:max-h-none min-[1024px]:col-start-1 min-[1024px]:row-start-1 min-[1024px]:aspect-auto min-[1024px]:h-full"
          >
            <ProjectViewer index={index} />
          </Reveal>

          {/* Project selector: two cards then a full-width third on phones, three across from 640px */}
          <Reveal
            as="ul"
            aria-label="Choose a project"
            className="order-2 m-0 grid list-none grid-cols-2 gap-2 p-0 min-[640px]:grid-cols-3 min-[640px]:gap-3 min-[1024px]:col-span-2 min-[1024px]:row-start-2"
          >
            {projects.map((p, i) => (
              <li
                key={p.name}
                className="min-w-0 last:odd:col-span-2 min-[640px]:last:odd:col-span-1"
              >
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "block h-full w-full cursor-pointer border border-t-2 border-line bg-transparent px-4 py-3 text-left transition-colors min-[640px]:px-5 min-[640px]:py-4",
                    i === index ? "border-t-blue bg-ink-2 text-fg" : "border-t-line text-mute hover:text-fg",
                  )}
                >
                  <span className="font-mono text-[.6rem] font-medium tracking-[.12em]">{pad(i + 1)}</span>
                  <span className="mt-1 block text-[.9rem] font-semibold leading-tight min-[640px]:text-[.95rem]">
                    {p.name}
                  </span>
                  <span className="mt-1 hidden font-mono text-[.6rem] font-medium uppercase tracking-[.1em] text-mute min-[640px]:block">
                    {p.category}
                  </span>
                </button>
              </li>
            ))}
          </Reveal>

          {/* Details */}
          <Reveal className="order-3 min-w-0 min-[1024px]:col-start-2 min-[1024px]:row-start-1 min-[1024px]:h-full">
            <div className="grid min-w-0 gap-6 min-[640px]:grid-cols-2 min-[640px]:gap-x-10 min-[1024px]:h-full min-[1024px]:grid-cols-1 min-[1024px]:content-between">
              <div className="flex min-w-0 flex-col gap-4">
                {/* Counter and arrows beside the title: desktop only, where a mouse has no reach problem */}
                <div className="hidden items-center justify-between gap-4 min-[1024px]:flex">
                  <div className="font-mono text-[.78rem] font-medium tracking-[.12em] text-mute">
                    <b className="font-medium text-blue">{pad(index + 1)}</b> / {pad(projects.length)}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      aria-label="Previous project"
                      className={cn(arrowBase, "size-11")}
                      onClick={() => step(-1, false)}
                    >
                      <FiArrowLeft aria-hidden="true" size={18} />
                    </button>
                    <button
                      type="button"
                      aria-label="Next project"
                      className={cn(arrowBase, "size-11")}
                      onClick={() => step(1, false)}
                    >
                      <FiArrowRight aria-hidden="true" size={18} />
                    </button>
                  </div>
                </div>

                {/* Only this block is announced when the project changes */}
                <div aria-live="polite" className="flex min-w-0 flex-col gap-4">
                  <h3 className="disp text-[clamp(1.8rem,2.8vw,2.7rem)]">{project.name}</h3>
                  <p className="font-mono text-[.72rem] font-medium uppercase tracking-[.06em] text-blue min-[640px]:text-[.76rem] min-[640px]:tracking-[.1em]">
                    {project.category} · {project.location}
                  </p>
                  <p className="max-w-[32rem] text-soft">{project.description}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 border-t border-line min-[640px]:self-end min-[1024px]:self-auto">
                {specs.map(([term, value]) => (
                  <div key={term} className="border-b border-line py-[.8rem]">
                    <dt className="font-mono text-[.62rem] font-medium uppercase tracking-[.14em] text-mute">
                      {term}
                    </dt>
                    <dd className="ml-0 mt-[.15rem] font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Counter between the arrows, at the bottom: phone and tablet, where the thumb is */}
            <div className="mt-6 flex items-center justify-between gap-4 min-[1024px]:hidden">
              <button
                type="button"
                aria-label="Previous project"
                className={cn(arrowBase, "size-12")}
                onClick={() => step(-1, true)}
              >
                <FiArrowLeft aria-hidden="true" size={20} />
              </button>
              <div className="font-mono text-[.85rem] font-medium tracking-[.12em] text-mute">
                <b className="font-medium text-blue">{pad(index + 1)}</b> / {pad(projects.length)}
              </div>
              <button
                type="button"
                aria-label="Next project"
                className={cn(arrowBase, "size-12")}
                onClick={() => step(1, true)}
              >
                <FiArrowRight aria-hidden="true" size={20} />
              </button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}