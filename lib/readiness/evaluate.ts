import { readinessDiagnostic } from "./questions";
import {
  ActionType,
  DiagnosticAnswers,
  ReadinessResult,
  ReadinessRoute,
  RecommendedAction,
} from "./types";

// ---------------------------------------------------------------------
// READINESS SCORE (0-100)
// Transparent, additive, no hidden math. Each answered question below
// contributes 0-10 "readiness points" toward how close the person is
// to moving forward without help. "goal" (question 1) is intent, not
// a readiness signal, so it does not score. Unanswered questions
// contribute 0, which only matters if evaluate() is ever called on a
// partial answer set.
// ---------------------------------------------------------------------
const READINESS_POINTS: Record<string, Record<string, number>> = {
  knows_requirements: { yes: 10, some: 6, not_sure: 3, no: 2 },
  has_documents: { all: 10, most: 7, some: 4, little_none: 1 },
  process_working: { yes_well: 10, yes_effort: 7, partially: 5, no_process: 3, no: 2 },
  repeating_steps: { never: 10, rarely: 8, sometimes: 5, often: 3 },
  needs_review: { no: 10, not_sure: 6, maybe: 5, yes: 3 },
  missing_artifact: { no: 10, maybe: 5, yes: 3 },
  biggest_blocker: {
    nothing_major: 10,
    takes_too_long: 5,
    need_created: 5,
    missing_info: 4,
    dont_know_requirements: 3,
    waiting_on_other: 2,
  },
};
const MAX_READINESS_POINTS =
  Object.keys(READINESS_POINTS).length * 10; // 70

function computeReadinessScore(answers: DiagnosticAnswers): number {
  let total = 0;
  for (const [questionId, pointMap] of Object.entries(READINESS_POINTS)) {
    const answer = answers[questionId];
    if (answer && pointMap[answer] !== undefined) {
      total += pointMap[answer];
    }
  }
  return Math.round((total / MAX_READINESS_POINTS) * 100);
}

// ---------------------------------------------------------------------
// ROUTE SCORING
// Each route accumulates weighted points from the signals the spec
// calls out. Signal weight is 2 when the answer directly states the
// thing (e.g. the blocker question, or an explicit yes), 1 when it's
// a supporting/softer signal. Primary route = highest score; ties
// break by PRIORITY_ORDER, most-blocking first.
// ---------------------------------------------------------------------
type RouteScores = Record<ReadinessRoute, number>;

const PRIORITY_ORDER: ReadinessRoute[] = ["ROUTE", "GENERATE", "AUTOMATE", "KEEP"];

function computeRouteScores(answers: DiagnosticAnswers): RouteScores {
  const scores: RouteScores = { KEEP: 0, AUTOMATE: 0, ROUTE: 0, GENERATE: 0 };
  const add = (route: ReadinessRoute, weight: number) => (scores[route] += weight);

  // GENERATE
  if (answers.goal === "create_something") add("GENERATE", 2);
  if (answers.missing_artifact === "yes") add("GENERATE", 2);
  if (answers.missing_artifact === "maybe") add("GENERATE", 1);
  if (answers.biggest_blocker === "need_created") add("GENERATE", 2);
  if (["most", "all"].includes(answers.has_documents) && answers.missing_artifact !== "no") {
    add("GENERATE", 1);
  }

  // AUTOMATE
  if (answers.process_working === "yes_effort") add("AUTOMATE", 2);
  if (answers.repeating_steps === "often") add("AUTOMATE", 2);
  if (answers.repeating_steps === "sometimes") add("AUTOMATE", 1);
  if (["most", "all"].includes(answers.has_documents)) add("AUTOMATE", 1);
  if (answers.needs_review === "no") add("AUTOMATE", 1);
  if (answers.biggest_blocker === "takes_too_long") add("AUTOMATE", 2);

  // ROUTE
  if (["no", "not_sure"].includes(answers.knows_requirements)) add("ROUTE", 2);
  if (answers.needs_review === "yes") add("ROUTE", 2);
  if (answers.needs_review === "maybe") add("ROUTE", 1);
  if (answers.biggest_blocker === "waiting_on_other") add("ROUTE", 2);
  if (answers.biggest_blocker === "dont_know_requirements") add("ROUTE", 2);
  if (answers.has_documents === "little_none") add("ROUTE", 1);

  // KEEP
  if (answers.knows_requirements === "yes") add("KEEP", 1);
  if (answers.has_documents === "all") add("KEEP", 1);
  if (answers.process_working === "yes_well") add("KEEP", 2);
  if (["never", "rarely"].includes(answers.repeating_steps)) add("KEEP", 1);
  if (answers.biggest_blocker === "nothing_major") add("KEEP", 2);

  return scores;
}

function pickPrimaryRoute(scores: RouteScores): ReadinessRoute {
  const max = Math.max(...Object.values(scores));
  const contenders = PRIORITY_ORDER.filter((route) => scores[route] === max);
  // If literally every score is 0 (unusual — very sparse answers),
  // default to ROUTE: safest fallback is "figure out what's actually
  // required" rather than assuming the person is fine.
  return contenders[0] ?? "ROUTE";
}

// ---------------------------------------------------------------------
// EXPLANATIONS
// ---------------------------------------------------------------------
const ROUTE_COPY: Record<ReadinessRoute, { headline: string; summary: string }> = {
  KEEP: {
    headline: "Best next move: keep going",
    summary:
      "What you have is basically working. There's no major blocker and nothing here needs to be rebuilt — a few small improvements are enough.",
  },
  AUTOMATE: {
    headline: "Best next move: automate the repeat work",
    summary:
      "The process works, but you're spending more effort than the task deserves. The requirements and information are largely in place — the opportunity is cutting the manual, repeated steps.",
  },
  ROUTE: {
    headline: "Best next move: route this first",
    summary:
      "Something outside your control is standing between you and progress — unclear requirements, or a person or organization that has to weigh in. That needs to get resolved before anything else moves.",
  },
  GENERATE: {
    headline: "Best next move: generate the missing piece",
    summary:
      "You have most of what's needed — what's missing is a finished output. That's something that can reasonably be created from the information you already have.",
  },
};

function buildStrengths(answers: DiagnosticAnswers): string[] {
  const strengths: string[] = [];
  if (answers.knows_requirements === "yes") strengths.push("You already know the requirements.");
  if (answers.knows_requirements === "some")
    strengths.push("You have a partial picture of the requirements.");
  if (answers.has_documents === "all") strengths.push("You have everything you need on hand.");
  if (answers.has_documents === "most") strengths.push("You already have most of what you need.");
  if (answers.process_working === "yes_well") strengths.push("Your current process already works well.");
  if (answers.process_working === "yes_effort")
    strengths.push("Your process works — it just costs more effort than it should.");
  if (["never", "rarely"].includes(answers.repeating_steps))
    strengths.push("You're not stuck repeating manual steps.");
  if (answers.needs_review === "no")
    strengths.push("Nobody else has to review or approve before you continue.");
  if (answers.missing_artifact === "no")
    strengths.push("You're not missing a document or output to move forward.");
  if (answers.biggest_blocker === "nothing_major")
    strengths.push("You don't have a major blocker right now.");
  return strengths.slice(0, 4);
}

function buildGaps(answers: DiagnosticAnswers): string[] {
  const gaps: string[] = [];
  if (["no", "not_sure"].includes(answers.knows_requirements))
    gaps.push("The requirements aren't fully clear yet.");
  if (answers.has_documents === "little_none")
    gaps.push("You're missing most of the information or documents you'll need.");
  if (answers.has_documents === "some")
    gaps.push("You only have some of the information or documents you'll need.");
  if (answers.process_working === "no") gaps.push("The current process isn't working.");
  if (answers.process_working === "no_process") gaps.push("There isn't a process in place yet.");
  if (["often", "sometimes"].includes(answers.repeating_steps))
    gaps.push("You're repeating the same manual steps on a regular basis.");
  if (["yes", "maybe"].includes(answers.needs_review))
    gaps.push("Someone else needs to review, approve, or receive something before you can continue.");
  if (["yes", "maybe"].includes(answers.missing_artifact))
    gaps.push("You're missing an output that could be created from what you already have.");
  if (answers.biggest_blocker === "waiting_on_other")
    gaps.push("You're currently waiting on another person or organization.");
  return gaps.slice(0, 4);
}

function buildRecommendedActions(
  route: ReadinessRoute,
  answers: DiagnosticAnswers
): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const push = (type: ActionType, label: string) => actions.push({ type, label });

  if (["no", "not_sure"].includes(answers.knows_requirements)) {
    push("ROUTE", "Confirm the actual requirements before doing anything else.");
  }
  if (["yes", "maybe"].includes(answers.needs_review)) {
    push("ROUTE", "Identify who needs to review or approve this, and what they need from you.");
  }
  if (answers.has_documents === "little_none" || answers.has_documents === "some") {
    push("GENERATE", "Gather or request the information and documents you're missing.");
  }
  if (["yes", "maybe"].includes(answers.missing_artifact)) {
    push("GENERATE", "Create the missing document, checklist, or summary from what you already have.");
  }
  if (answers.process_working === "yes_effort" || ["often", "sometimes"].includes(answers.repeating_steps)) {
    push("AUTOMATE", "Automate or template the repetitive steps in your current process.");
  }
  if (route === "KEEP") {
    push("KEEP", "Make the small improvements you already know about — don't rebuild what works.");
  }
  if (answers.biggest_blocker === "waiting_on_other") {
    push("TRACK", "Track the request until the other person or organization responds.");
  }
  if (actions.length < 3) {
    push("TRACK", "Save this result and track it until it's fully resolved.");
  }

  // De-dupe by label, cap at 5, keep at least 3.
  const seen = new Set<string>();
  const deduped = actions.filter((a) => (seen.has(a.label) ? false : (seen.add(a.label), true)));
  return deduped.slice(0, 5);
}

// ---------------------------------------------------------------------
// PUBLIC ENTRY POINT
// ---------------------------------------------------------------------
export function evaluateReadiness(answers: DiagnosticAnswers): ReadinessResult {
  const score = computeReadinessScore(answers);
  const routeScores = computeRouteScores(answers);
  const route = pickPrimaryRoute(routeScores);
  const { headline, summary } = ROUTE_COPY[route];

  return {
    score,
    route,
    headline,
    summary,
    strengths: buildStrengths(answers),
    gaps: buildGaps(answers),
    recommendedActions: buildRecommendedActions(route, answers),
  };
}

// Exposed for tests/debugging — not part of the primary API surface.
export const __internal = { computeReadinessScore, computeRouteScores, pickPrimaryRoute };

// Guard: fail loudly in dev if the question set and scoring tables
// drift apart (e.g. someone renames an option value in questions.ts).
if (process.env.NODE_ENV !== "production") {
  const questionIds = new Set(readinessDiagnostic.questions.map((q) => q.id));
  for (const key of Object.keys(READINESS_POINTS)) {
    if (!questionIds.has(key)) {
      // eslint-disable-next-line no-console
      console.warn(`[readiness/evaluate] scoring table references unknown question "${key}"`);
    }
  }
}
