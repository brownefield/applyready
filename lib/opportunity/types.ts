// Universal readiness object model.
// Destination → Requirement → Evidence → Gap → Action
// Matches PRODUCT.md and the Waypoint completion-plan shape.

export type EvidenceStatus =
  | "satisfied" // have proof on hand
  | "needs_evidence" // true, but proof is missing/stale
  | "unmet" // does not appear to hold
  | "confirm" // needs confirmation before applying
  | "unknown"; // not assessed yet

export type ActionKind =
  | "KEEP"
  | "ROUTE"
  | "GENERATE"
  | "AUTOMATE"
  | "TRACK"
  | "COLLECT"
  | "UPDATE"
  | "CONFIRM";

export type DestinationSource =
  | "paste"
  | "upload"
  | "describe"
  | "template"
  | "link";

export type DestinationKind =
  | "vendor"
  | "federal_job"
  | "grant"
  | "certification"
  | "contract"
  | "program"
  | "general";

export interface EvidenceHint {
  id: string;
  label: string;
  description?: string;
}

export interface Requirement {
  id: string;
  name: string;
  description?: string;
  category?: string;
  required: boolean;
  evidenceHints: EvidenceHint[];
  /** reusable vault key when this maps to a durable profile fact */
  vaultKey?: string;
}

export interface Destination {
  id: string;
  title: string;
  kind: DestinationKind;
  source: DestinationSource;
  rawInput?: string;
  summary?: string;
  templateId?: string;
  requirements: Requirement[];
  createdAt: string;
}

export interface EvidenceEntry {
  requirementId: string;
  status: EvidenceStatus;
  note?: string;
}

export interface Gap {
  requirementId: string;
  requirementName: string;
  status: Exclude<EvidenceStatus, "satisfied" | "unknown">;
  reason: string;
}

export interface PlanAction {
  id: string;
  kind: ActionKind;
  label: string;
  requirementId?: string;
  priority: number;
}

export interface CompletionPlan {
  destinationId: string;
  evaluatedAt: string;
  totalRequirements: number;
  satisfiedCount: number;
  needsEvidenceCount: number;
  unmetCount: number;
  confirmCount: number;
  unknownCount: number;
  readyNow: boolean;
  headline: string;
  summary: string;
  gaps: Gap[];
  actions: PlanAction[];
}

export interface OpportunityWorkspace {
  id: string;
  createdAt: string;
  updatedAt: string;
  destination: Destination;
  evidence: Record<string, EvidenceEntry>;
  plan: CompletionPlan | null;
  status: "intake" | "qualifying" | "planned" | "packet_requested";
}

export interface OpportunityTemplate {
  id: string;
  title: string;
  kind: DestinationKind;
  blurb: string;
  requirements: Omit<Requirement, "id">[];
}
