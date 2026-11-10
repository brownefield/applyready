import { DiagnosticQuestion } from "@/lib/readiness/types";

export default function QuestionCard({
  question,
  value,
  onSelect,
}: {
  question: DiagnosticQuestion;
  value: string | undefined;
  onSelect: (optionValue: string) => void;
}) {
  return (
    <div>
      <h2 className="font-serif text-2xl sm:text-3xl text-ink mb-2 leading-snug">
        {question.prompt}
      </h2>
      {question.helperText && (
        <p className="text-sm text-muted mb-6">{question.helperText}</p>
      )}
      {!question.helperText && <div className="mb-6" />}
      <div className="flex flex-col gap-3">
        {question.options.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              aria-pressed={selected}
              className={[
                "text-left rounded-card border px-5 py-4 transition-colors",
                "text-[15px] leading-snug",
                selected
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white text-ink hover:border-navy/40",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
