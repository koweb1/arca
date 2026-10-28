import Reveal from "@/components/ui/Reveal";

export default function SectionHead({
  eyebrow,
  title,
  tag,
}: {
  eyebrow: string;
  title: string;
  tag?: string;
}) {
  return (
    <div className="mb-[clamp(2rem,4vw,3.5rem)] flex flex-wrap items-end justify-between gap-8">
      <div>
        <Reveal as="p" className="eyebrow">
          {eyebrow}
        </Reveal>
        <Reveal as="h2" className="disp mt-4 max-w-[14ch] text-[clamp(2rem,5vw,4.4rem)]">
          {title}
        </Reveal>
      </div>
      {tag && (
        <Reveal
          as="span"
          className="border border-line px-[.6rem] py-[.4rem] font-mono text-[.66rem] font-medium uppercase tracking-[.12em] text-mute"
        >
          {tag}
        </Reveal>
      )}
    </div>
  );
}