export default function ReadinessScore({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#E4DFD3"
          strokeWidth="10"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#B8842B"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="66"
          textAnchor="middle"
          fontSize="26"
          fontWeight={600}
          fill="#0B1F33"
        >
          {clamped}%
        </text>
      </svg>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted mb-1">Readiness Score</div>
        <div className="font-serif text-2xl text-ink">{clamped}% Ready</div>
      </div>
    </div>
  );
}
