import { ReadinessResult } from "@/lib/readiness/types";

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] text-ink leading-snug pl-4 relative">
          <span className="absolute left-0 top-[0.55em] h-1.5 w-1.5 rounded-full bg-amber" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ResultSummary({ result }: { result: ReadinessResult }) {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink mb-3 leading-tight">
          {result.headline}
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-prose">{result.summary}</p>
      </div>

      {result.strengths.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted mb-3">
            What&rsquo;s already working
          </h3>
          <BulletList items={result.strengths} />
        </div>
      )}

      {result.gaps.length > 0 && (
        <div>
          <h3 className="text-xs uppercase tracking-wide text-muted mb-3">
            What&rsquo;s getting in the way
          </h3>
          <BulletList items={result.gaps} />
        </div>
      )}
    </div>
  );
}
