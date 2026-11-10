// Core readiness diagnostic types. Kept independent of any single
// diagnostic's question set so ApplyReady can run more than one
// diagnostic off this same engine later (job readiness today; vendor,
// contractor, permit readiness etc. down the line).

export type ReadinessRoute = "KEEP" | "AUTOMATE" | "ROUTE" | "GENERATE";

// TRACK exists in the data model now (per spec) even though it is not
// a primary MVP route yet — a future action can carry this type
// without a schema change.
export type ActionType = "KEEP" | "AUTOMATE" | "ROUTE" | "GENERATE" | "TRACK";

export interface RecommendedAction {
  type: ActionType;
  label: string;
}

export interface ReadinessResult {
  score: number; // 0-100
  route: ReadinessRoute;
  headline: string;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommendedActions: RecommendedAction[];
}

export interface QuestionOption {
  value: string;
  label: string;
}

export interface DiagnosticQuestion {
  id: string; // stable key, used in the answers map
  prompt: string;
  helperText?: string;
  options: QuestionOption[];
}

export interface DiagnosticDefinition {
  slug: string;
  title: string;
  questions: DiagnosticQuestion[];
}

// answers: { [questionId]: optionValue }
export type DiagnosticAnswers = Record<string, string>;

export interface DiagnosticSession {
  id: string;
  created_at: string;
  updated_at: string;
  status: "in_progress" | "completed" | "abandoned";
  current_step: number;
  answers: DiagnosticAnswers;
  readiness_score: number | null;
  primary_route: ReadinessRoute | null;
  result: ReadinessResult | null;
}
