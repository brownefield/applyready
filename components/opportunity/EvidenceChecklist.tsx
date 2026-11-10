"use client";

import { EvidenceStatus, Requirement } from "@/lib/opportunity/types";

const OPTIONS: Array<{ value: EvidenceStatus; label: string }> = [
  { value: "satisfied", label: "Have it" },
  { value: "needs_evidence", label: "Need evidence" },
  { value: "unmet", label: "Unmet" },
  { value: "confirm", label: "Confirm" },
  { value: "unknown", label: "Not sure" },
];

export default function EvidenceChecklist({
  requirements,
  values,
  onChange,
}: {
  requirements: Requirement[];
  values: Record<string, EvidenceStatus>;
  onChange: (requirementId: string, status: EvidenceStatus) => void;
}) {
  return (
    <ol className="flex flex-col gap-4">
      {requirements.map((req, index) => {
        const status = values[req.id] ?? "unknown";
        return (
          <li
            key={req.id}
            className="rounded-card border border-line bg-white px-4 py-4 sm:px-5"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-xs text-muted mt-1 w-5 shrink-0">{index + 1}</span>
              <div className="min-w-0">
                <p className="font-medium text-ink text-[15px]">
                  {req.name}
                  {!req.required && (
                    <span className="ml-2 text-xs font-normal text-muted">optional</span>
                  )}
                </p>
                {req.description && (
                  <p className="text-sm text-muted mt-1 leading-relaxed">{req.description}</p>
                )}
                {req.evidenceHints.length > 0 && (
                  <p className="text-xs text-amber mt-2">
                    Evidence: {req.evidenceHints.map((h) => h.label).join(" · ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pl-8">
              {OPTIONS.map((opt) => {
                const active = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(req.id, opt.value)}
                    className={`rounded-card px-3 py-1.5 text-xs border transition-colors ${
                      active
                        ? "bg-navy text-white border-navy"
                        : "bg-paper border-line text-muted hover:text-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
