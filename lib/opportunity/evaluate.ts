import {
  CompletionPlan,
  EvidenceEntry,
  EvidenceStatus,
  Gap,
  OpportunityWorkspace,
  PlanAction,
  Requirement,
} from "./types";

const STATUS_REASON: Record<Exclude<EvidenceStatus, "satisfied" | "unknown">, string> = {
  needs_evidence: "Requirement appears true, but proof is missing or needs updating.",
  unmet: "Requirement does not appear to be met yet.",
  confirm: "Confirm this before applying — status is unclear or time-sensitive.",
};

function countBy(
  evidence: Record<string, EvidenceEntry>,
  requirements: Requirement[],
  status: EvidenceStatus
): number {
  return requirements.filter((r) => (evidence[r.id]?.status ?? "unknown") === status).length;
}

function buildGaps(
  requirements: Requirement[],
  evidence: Record<string, EvidenceEntry>
): Gap[] {
  const gaps: Gap[] = [];
  for (const req of requirements) {
    const status = evidence[req.id]?.status ?? "unknown";
    if (status === "satisfied" || status === "unknown") continue;
    gaps.push({
      requirementId: req.id,
      requirementName: req.name,
      status,
      reason: evidence[req.id]?.note?.trim() || STATUS_REASON[status],
    });
  }
  return gaps;
}

function buildActions(
  requirements: Requirement[],
  evidence: Record<string, EvidenceEntry>,
  gaps: Gap[]
): PlanAction[] {
  const actions: PlanAction[] = [];
  let priority = 1;

  for (const gap of gaps) {
    const req = requirements.find((r) => r.id === gap.requirementId);
    if (!req) continue;

    if (gap.status === "needs_evidence") {
      actions.push({
        id: `act_${gap.requirementId}_collect`,
        kind: "COLLECT",
        label: `Collect or update evidence for ${req.name}`,
        requirementId: req.id,
        priority: priority++,
      });
      if (req.evidenceHints[0]) {
        actions.push({
          id: `act_${gap.requirementId}_gen`,
          kind: "GENERATE",
          label: `Prepare ${req.evidenceHints[0].label}`,
          requirementId: req.id,
          priority: priority++,
        });
      }
    } else if (gap.status === "unmet") {
      actions.push({
        id: `act_${gap.requirementId}_close`,
        kind: "ROUTE",
        label: `Close the gap on ${req.name}`,
        requirementId: req.id,
        priority: priority++,
      });
    } else if (gap.status === "confirm") {
      actions.push({
        id: `act_${gap.requirementId}_confirm`,
        kind: "CONFIRM",
        label: `Confirm ${req.name} before submission`,
        requirementId: req.id,
        priority: priority++,
      });
    }
  }

  const unknowns = requirements.filter(
    (r) => (evidence[r.id]?.status ?? "unknown") === "unknown"
  );
  for (const req of unknowns) {
    actions.push({
      id: `act_${req.id}_assess`,
      kind: "CONFIRM",
      label: `Assess status for ${req.name}`,
      requirementId: req.id,
      priority: priority++,
    });
  }

  if (gaps.length === 0 && unknowns.length === 0) {
    actions.push({
      id: "act_track",
      kind: "TRACK",
      label: "Track submission status and renewal dates",
      priority: 1,
    });
    actions.push({
      id: "act_keep",
      kind: "KEEP",
      label: "Keep the readiness packet current for the next opportunity",
      priority: 2,
    });
  } else {
    actions.push({
      id: "act_packet",
      kind: "GENERATE",
      label: "Produce a readiness packet that organizes evidence, gaps, and next steps",
      priority: priority++,
    });
    actions.push({
      id: "act_track_open",
      kind: "TRACK",
      label: "Track open requirements until the destination is reached",
      priority: priority++,
    });
  }

  return actions;
}

function headlineFor(plan: Omit<CompletionPlan, "headline" | "summary" | "actions" | "gaps"> & { gaps: Gap[] }): {
  headline: string;
  summary: string;
} {
  const { satisfiedCount, totalRequirements, readyNow, needsEvidenceCount, unmetCount, confirmCount } =
    plan;

  if (readyNow) {
    return {
      headline: "You appear ready for this destination",
      summary: `All ${totalRequirements} requirements have evidence on hand. Keep the packet together and track submission.`,
    };
  }

  return {
    headline: `You currently satisfy ${satisfiedCount} / ${totalRequirements} requirements`,
    summary: [
      needsEvidenceCount ? `${needsEvidenceCount} need evidence` : null,
      unmetCount ? `${unmetCount} appear unmet` : null,
      confirmCount ? `${confirmCount} should be confirmed` : null,
      `${plan.unknownCount} still need assessment`,
    ]
      .filter(Boolean)
      .join(" · "),
  };
}

export function evaluateCompletionPlan(
  destinationId: string,
  requirements: Requirement[],
  evidence: Record<string, EvidenceEntry>
): CompletionPlan {
  const totalRequirements = requirements.length;
  const satisfiedCount = countBy(evidence, requirements, "satisfied");
  const needsEvidenceCount = countBy(evidence, requirements, "needs_evidence");
  const unmetCount = countBy(evidence, requirements, "unmet");
  const confirmCount = countBy(evidence, requirements, "confirm");
  const unknownCount = countBy(evidence, requirements, "unknown");
  const gaps = buildGaps(requirements, evidence);
  const readyNow =
    totalRequirements > 0 &&
    satisfiedCount === totalRequirements &&
    unknownCount === 0;

  const base = {
    destinationId,
    evaluatedAt: new Date().toISOString(),
    totalRequirements,
    satisfiedCount,
    needsEvidenceCount,
    unmetCount,
    confirmCount,
    unknownCount,
    readyNow,
    gaps,
  };

  const { headline, summary } = headlineFor(base);
  const actions = buildActions(requirements, evidence, gaps);

  return {
    ...base,
    headline,
    summary,
    actions,
  };
}

export function evaluateWorkspace(workspace: OpportunityWorkspace): OpportunityWorkspace {
  const plan = evaluateCompletionPlan(
    workspace.destination.id,
    workspace.destination.requirements,
    workspace.evidence
  );
  return {
    ...workspace,
    plan,
    status: "planned",
    updatedAt: new Date().toISOString(),
  };
}

export function emptyEvidenceMap(requirements: Requirement[]): Record<string, EvidenceEntry> {
  const map: Record<string, EvidenceEntry> = {};
  for (const req of requirements) {
    map[req.id] = { requirementId: req.id, status: "unknown" };
  }
  return map;
}
