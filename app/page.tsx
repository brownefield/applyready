import Link from "next/link";
import BringYourOwnOpportunity from "@/components/opportunity/BringYourOwnOpportunity";

export default function HomePage() {
  return (
    <main>
      {/* Hero — brand + one question + intake */}
      <section className="relative overflow-hidden border-b border-line">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 20% 0%, rgba(184,132,43,0.18), transparent 55%), radial-gradient(ellipse at 90% 20%, rgba(11,31,51,0.08), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-5 pt-14 pb-16 sm:pt-20 sm:pb-24 flex flex-col items-center text-center gap-6">
          <p className="font-serif text-amber text-lg tracking-wide animate-[fadeIn_0.6s_ease-out]">
            ApplyReady
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.35rem] text-ink leading-[1.12] max-w-2xl animate-[fadeIn_0.8s_ease-out]">
            What are you trying to become ready for?
          </h1>
          <p className="text-[17px] text-muted leading-relaxed max-w-xl animate-[fadeIn_1s_ease-out]">
            Show ApplyReady the opportunity. We&rsquo;ll determine what it requires, what you
            already have, what&rsquo;s missing, and how to finish the rest.
          </p>
          <div className="w-full pt-2 animate-[riseIn_0.9s_ease-out]">
            <BringYourOwnOpportunity />
          </div>
        </div>
      </section>

      {/* One job: explain the loop */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <h2 className="font-serif text-3xl text-ink mb-3 text-center">
          From destination to completion plan
        </h2>
        <p className="text-muted text-center max-w-xl mx-auto mb-10 leading-relaxed">
          Readiness is not a score you collect once. It is the distance between what you want and
          what you can prove.
        </p>
        <ol className="grid sm:grid-cols-5 gap-4 text-center">
          {["Discover", "Qualify", "Prepare", "Complete", "Track"].map((step, i) => (
            <li key={step} className="flex flex-col items-center gap-2">
              <span className="w-8 h-8 rounded-full border border-line text-xs flex items-center justify-center text-muted">
                {i + 1}
              </span>
              <span className="font-serif text-lg text-ink">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* FIND modules */}
      <section className="border-y border-line bg-white/50">
        <div className="mx-auto max-w-3xl px-5 py-14 sm:py-16">
          <p className="text-xs uppercase tracking-wide text-amber mb-2">FIND — free</p>
          <h2 className="font-serif text-3xl text-ink mb-3">Not sure what to pursue yet?</h2>
          <p className="text-muted mb-8 max-w-xl leading-relaxed">
            Use the free diagnostic to see where you stand. Mission Finder and VentureFit stay
            modules inside ApplyReady — not separate products.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/diagnostic"
              className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium text-center"
            >
              Check general readiness
            </Link>
            <Link
              href="/resume-optimizer"
              className="rounded-card border border-line px-6 py-3 text-sm text-ink text-center hover:border-navy/40 transition-colors"
            >
              Federal resume optimizer
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing tease */}
      <section className="mx-auto max-w-3xl px-5 py-16 sm:py-20">
        <p className="text-xs uppercase tracking-wide text-amber mb-2">READY · MOVE</p>
        <h2 className="font-serif text-3xl text-ink mb-3">Pay for the destination, not the quiz</h2>
        <p className="text-muted mb-8 max-w-xl leading-relaxed">
          Free discovery builds trust. Paid work starts when you name a specific opportunity and
          need the distance closed.
        </p>
        <Link href="/pricing" className="text-sm text-navy underline underline-offset-4">
          View FIND / READY / MOVE pricing
        </Link>
      </section>
    </main>
  );
}
