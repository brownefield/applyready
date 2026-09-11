import { RecommendedAction } from "@/lib/readiness/types";

const TYPE_LABEL: Record<string, string> = {
  KEEP: "Keep",
  AUTOMATE: "Automate",
  ROUTE: "Route",
  GENERATE: "Generate",
  TRACK: "Track",
};

export default function ActionList({ actions }: { actions: RecommendedAction[] }) {
  if (actions.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs uppercase tracking-wide text-muted mb-3">Recommended next steps</h3>
      <ol className="flex flex-col gap-3">
        {actions.map((action, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-card border border-line bg-white px-4 py-3"
          >
            <span className="mt-0.5 shrink-0 rounded-full bg-navy text-white text-xs font-medium h-5 w-5 flex items-center justify-center">
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-[15px] text-ink leading-snug">{action.label}</p>
              <span className="text-[11px] uppercase tracking-wide text-amber">
                {TYPE_LABEL[action.type] ?? action.type}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
