import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-20 sm:py-28 flex flex-col items-center text-center min-h-[80vh] justify-center">
      <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-5">
        Are you ready to move forward?
      </h1>
      <p className="text-[17px] text-muted leading-relaxed max-w-md mb-10">
        ApplyReady helps you figure out what you have, what you&rsquo;re missing, and what should
        happen next.
      </p>
      <Link
        href="/diagnostic"
        className="rounded-card bg-navy text-white px-8 py-4 text-[15px] font-medium hover:opacity-90 transition-opacity"
      >
        Check My Readiness
      </Link>
      <p className="text-xs text-muted mt-4">Takes about 2 minutes.</p>
    </main>
  );
}
