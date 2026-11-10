import { CompletionPlan } from "@/lib/opportunity/types";

export default function CompletionPlanView({ plan }: { plan: CompletionPlan }) {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="text-xs uppercase tracking-wide text-amber mb-2">Completion plan</p>
        <h2 className="font-serif text-3xl sm:text-4xl text-ink leading-tight mb-3">
          {plan.headline}
        </h2>
        <p className="text-[15px] text-muted leading-relaxed">{plan.summary}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          ["Satisfied", plan.satisfiedCount],
          ["Need evidence", plan.needsEvidenceCount],
          ["Unmet", plan.unmetCount],
          ["Confirm", plan.confirmCount],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-card border border-line bg-white px-4 py-3">
            <p className="text-2xl font-serif text-ink">{value as number}</p>
            <p className="text-xs text-muted mt-1">{label as string}</p>
          </div>
        ))}
      </div>

      {plan.gaps.length > 0 && (
        <div>
          <h3 className="font-serif text-xl text-ink mb-3">Gaps</h3>
          <ul className="flex flex-col gap-3">
            {plan.gaps.map((gap) => (
              <li key={gap.requirementId} className="border-l-2 border-amber pl-4">
                <p className="text-[15px] text-ink font-medium">{gap.requirementName}</p>
                <p className="text-sm text-muted mt-0.5">{gap.reason}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-serif text-xl text-ink mb-3">Actions</h3>
        <ol className="flex flex-col gap-2">
          {plan.actions.map((action, index) => (
            <li
              key={action.id}
              className="flex gap-3 items-start rounded-card border border-line bg-white px-4 py-3"
            >
              <span className="text-xs text-muted mt-0.5 w-5">{index + 1}</span>
              <div>
                <p className="text-[15px] text-ink">{action.label}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted mt-1">
                  {action.kind}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
