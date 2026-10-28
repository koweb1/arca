export default function Footer() {
  return (
    <footer className="flex flex-wrap justify-between gap-4 border-t border-line bg-[linear-gradient(0deg,rgba(8,13,16,.7),rgba(8,13,16,0))] pb-[calc(4.2rem+env(safe-area-inset-bottom,0px))] pt-[1.2rem] font-mono text-[.64rem] font-medium uppercase tracking-[.12em] text-mute">
      <span>ARCA Architecture Studio</span>
      <span>Placeholder studio for design preview</span>
      <span>6.5244° N · 3.3792° E</span>
    </footer>
  );
}