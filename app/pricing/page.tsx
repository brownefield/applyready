import Link from "next/link";

const TIERS = [
  {
    stage: "FIND",
    price: "Free",
    title: "Discovery",
    points: [
      "Mission Finder / VentureFit modules",
      "General readiness diagnostic",
      "ApplyReady profile foundations",
    ],
    cta: { href: "/diagnostic", label: "Start free diagnostic" },
    emphasis: false,
  },
  {
    stage: "READY",
    price: "$29",
    title: "Ready Check",
    points: [
      "Specific opportunity analysis",
      "Requirements vs. evidence map",
      "Gap list with next questions",
    ],
    cta: { href: "/", label: "Bring an opportunity" },
    emphasis: false,
  },
  {
    stage: "MOVE",
    price: "$99",
    title: "Ready Packet",
    points: [
      "Evidence organization",
      "Gap plan and checklists",
      "Draft artifacts and unresolved flags",
      "Tracked until submission-ready",
    ],
    cta: { href: "/", label: "Start with an opportunity" },
    emphasis: true,
  },
  {
    stage: "MOVE+",
    price: "$249+",
    title: "Guided Ready",
    points: [
      "Human / operator review",
      "High-stakes workflows",
      "Partner programs and cohorts",
    ],
    cta: { href: "/diagnostic", label: "Talk through next steps" },
    emphasis: false,
  },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
      <div className="max-w-2xl mb-12">
        <p className="font-serif text-amber text-lg mb-3">ApplyReady</p>
        <h1 className="font-serif text-4xl sm:text-5xl text-ink leading-tight mb-4">
          Price the completion, not the questionnaire
        </h1>
        <p className="text-[17px] text-muted leading-relaxed">
          FIND earns trust. READY analyzes a real destination. MOVE closes the distance — with
          FormBuddy and Waypoint underneath.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-14">
        {TIERS.map((tier) => (
          <article
            key={tier.title}
            className={`rounded-card border px-5 py-6 flex flex-col gap-4 ${
              tier.emphasis ? "border-navy bg-navy text-white" : "border-line bg-white"
            }`}
          >
            <div>
              <p
                className={`text-xs uppercase tracking-wide mb-2 ${
                  tier.emphasis ? "text-white/70" : "text-amber"
                }`}
              >
                {tier.stage}
              </p>
              <h2 className={`font-serif text-2xl ${tier.emphasis ? "text-white" : "text-ink"}`}>
                {tier.title}
              </h2>
              <p className={`text-3xl font-serif mt-2 ${tier.emphasis ? "text-amber" : "text-ink"}`}>
                {tier.price}
              </p>
            </div>
            <ul className="flex flex-col gap-2 flex-1">
              {tier.points.map((point) => (
                <li
                  key={point}
                  className={`text-sm leading-relaxed ${
                    tier.emphasis ? "text-white/80" : "text-muted"
                  }`}
                >
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={tier.cta.href}
              className={`rounded-card px-5 py-3 text-sm font-medium text-center transition-opacity hover:opacity-90 ${
                tier.emphasis ? "bg-amber text-navy" : "bg-navy text-white"
              }`}
            >
              {tier.cta.label}
            </Link>
          </article>
        ))}
      </div>

      <section className="rounded-card border border-line bg-white px-5 py-6 mb-10">
        <h2 className="font-serif text-2xl text-ink mb-2">Organizations</h2>
        <p className="text-[15px] text-muted leading-relaxed mb-3">
          Workforce programs, chambers, accelerators, employers, and vendor networks don&rsquo;t
          ask &ldquo;Am I ready?&rdquo; They ask which of their people are ready — and what each
          one still needs.
        </p>
        <p className="text-[15px] text-ink">
          Partner baseline: <strong>$299 setup + $99/month</strong>. Larger plans scale with
          participants and cases.
        </p>
      </section>

      <p className="text-sm text-muted">
        These prices are hypotheses to test against real opportunities — starting with
        small-business vendor readiness.{" "}
        <Link href="/" className="text-navy underline underline-offset-4">
          Bring Your Own Opportunity
        </Link>
      </p>
    </main>
  );
}
