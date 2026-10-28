import Container from "@/components/ui/Container";
import CountUp from "@/components/ui/CountUp";
import Reveal from "@/components/ui/Reveal";
import { stats } from "@/lib/content";

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      aria-label="Studio philosophy"
      className="relative border-t border-line bg-ink py-[clamp(4.5rem,10vw,9rem)]"
    >
      <Container>
        <Reveal as="p" className="eyebrow">
          Philosophy
        </Reveal>
        <Reveal
          as="p"
          className="mt-[1.4rem] max-w-[24ch] text-balance text-[clamp(1.7rem,4.4vw,3.9rem)] font-semibold leading-[1.12] tracking-[-.01em]"
        >
          We design for how people{" "}
          <em className="not-italic text-blue">live, work and gather</em>, then draw every line
          with that in mind.
        </Reveal>

        <Reveal className="mt-[clamp(3rem,6vw,5.5rem)] grid grid-cols-2 border-t border-line-2 min-[760px]:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="border-b border-line py-[1.4rem] pr-4">
              <strong className="block text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-none tabular-nums [font-stretch:125%]">
                <CountUp value={stat.value} />
              </strong>
              <span className="mt-2 block font-mono text-[.66rem] font-medium uppercase tracking-[.12em] text-mute">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
        <p className="mt-4 font-mono text-[.62rem] font-medium uppercase tracking-[.1em] text-mute">
          Sample figures for the preview
        </p>
      </Container>
    </section>
  );
}