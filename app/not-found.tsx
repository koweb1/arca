import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-svh place-items-center px-4 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="disp mt-4 text-[clamp(2.2rem,6vw,5rem)]">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-soft">
          That drawing is not on our board. Head back to the studio.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center border border-blue bg-blue px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#06161c] transition-colors hover:bg-[#b4e9f6]"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}