"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import ProjectViewer from "@/components/ui/ProjectViewer";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { projects } from "@/lib/projects";
import { buttonClass } from "@/utils/buttonStyles";

export default function Projects() {
  const [index, setIndex] = useState(0);
  const project = projects[index];
  const go = (i: number) => setIndex((i + projects.length) % projects.length);

  const specs: Array<[string, string]> = [
    ["Category", project.category],
    ["Completed", project.year],
    ["Floor area", project.area],
    ["Location", project.location],
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

        <div className="grid grid-cols-1 items-stretch gap-[clamp(1.5rem,3vw,3rem)] min-[960px]:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal className="relative aspect-[4/5] max-h-[34rem] overflow-hidden border border-line bg-ink-2 min-[960px]:aspect-[16/11] min-[960px]:min-h-[26rem] min-[960px]:max-h-[44rem]">
            <ProjectViewer index={index} />
          </Reveal>

          <Reveal className="flex min-w-0 flex-col gap-[1.4rem]" aria-live="polite">
            <div className="font-mono text-[.78rem] font-medium tracking-[.12em] text-mute">
              <b className="font-medium text-blue">{String(index + 1).padStart(2, "0")}</b> /{" "}
              {String(projects.length).padStart(2, "0")}
            </div>
            <h3 className="disp text-[clamp(1.9rem,3.6vw,3.2rem)]">{project.name}</h3>
            <p className="font-mono text-[.76rem] font-medium uppercase tracking-[.1em] text-blue">
              {project.category} · {project.location}
            </p>
            <p className="max-w-[32rem] text-soft">{project.description}</p>

            <dl className="grid grid-cols-2 border-t border-line">
              {specs.map(([term, value]) => (
                <div key={term} className="border-b border-line py-[.8rem]">
                  <dt className="font-mono text-[.62rem] font-medium uppercase tracking-[.14em] text-mute">
                    {term}
                  </dt>
                  <dd className="ml-0 mt-[.15rem] font-semibold">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap gap-2">
              {projects.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  className="min-w-0 flex-[1_1_8rem] cursor-pointer border border-line bg-transparent px-[.8rem] py-[.7rem] text-left text-[.8rem] text-mute aria-[current=true]:border-blue aria-[current=true]:text-fg"
                >
                  <span className="mb-[.2rem] block font-mono text-[.6rem] font-medium tracking-[.12em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {p.name}
                </button>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap gap-[.6rem]">
              <button type="button" className={buttonClass("ghost", "sm")} onClick={() => go(index - 1)}>
                &larr; Previous
              </button>
              <button type="button" className={buttonClass("primary", "sm")} onClick={() => go(index + 1)}>
                Next project &rarr;
              </button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}