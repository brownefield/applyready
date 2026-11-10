import { emptyEvidenceMap, evaluateWorkspace } from "./evaluate";
import { parseOpportunityInput, ParseInput } from "./parse";
import { EvidenceEntry, EvidenceStatus, OpportunityWorkspace } from "./types";

const STORAGE_KEY = "applyready.opportunity.workspace";

function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `ws_${Math.random().toString(36).slice(2, 10)}`;
}

export function createWorkspace(input: ParseInput): OpportunityWorkspace {
  const destination = parseOpportunityInput(input);
  const now = new Date().toISOString();
  const workspace: OpportunityWorkspace = {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    destination,
    evidence: emptyEvidenceMap(destination.requirements),
    plan: null,
    status: "qualifying",
  };
  return workspace;
}

export function saveWorkspace(workspace: OpportunityWorkspace): void {
  if (typeof window === "undefined") return;
  const next = { ...workspace, updatedAt: new Date().toISOString() };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  sessionStorage.setItem(`${STORAGE_KEY}.${next.id}`, JSON.stringify(next));
}

export function loadWorkspace(id?: string): OpportunityWorkspace | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = id
      ? sessionStorage.getItem(`${STORAGE_KEY}.${id}`) ||
        (sessionStorage.getItem(STORAGE_KEY) &&
        JSON.parse(sessionStorage.getItem(STORAGE_KEY) as string).id === id
          ? sessionStorage.getItem(STORAGE_KEY)
          : null)
      : sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as OpportunityWorkspace;
  } catch {
    return null;
  }
}

export function setEvidenceStatus(
  workspace: OpportunityWorkspace,
  requirementId: string,
  status: EvidenceStatus,
  note?: string
): OpportunityWorkspace {
  const entry: EvidenceEntry = {
    requirementId,
    status,
    note: note?.trim() || workspace.evidence[requirementId]?.note,
  };
  const next: OpportunityWorkspace = {
    ...workspace,
    evidence: {
      ...workspace.evidence,
      [requirementId]: entry,
    },
    updatedAt: new Date().toISOString(),
  };
  return next;
}

export function buildPlan(workspace: OpportunityWorkspace): OpportunityWorkspace {
  return evaluateWorkspace(workspace);
}

export function markPacketRequested(workspace: OpportunityWorkspace): OpportunityWorkspace {
  return {
    ...workspace,
    status: "packet_requested",
    updatedAt: new Date().toISOString(),
  };
}
