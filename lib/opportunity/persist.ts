import { SupabaseClient } from "@supabase/supabase-js";
import { CompletionPlan, Destination, EvidenceEntry, OpportunityWorkspace } from "./types";

type DbWorkspace = {
  id: string;
  created_at: string;
  updated_at: string;
  status: OpportunityWorkspace["status"];
  destination: Destination;
  evidence: Record<string, EvidenceEntry>;
  plan: CompletionPlan | null;
};

function fromDb(row: DbWorkspace): OpportunityWorkspace {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    status: row.status,
    destination: row.destination,
    evidence: row.evidence ?? {},
    plan: row.plan,
  };
}

export async function persistCreateWorkspace(
  db: SupabaseClient,
  workspace: OpportunityWorkspace
): Promise<OpportunityWorkspace | null> {
  const { data, error } = await db.rpc("ar_create_workspace", {
    p_destination: workspace.destination,
    p_evidence: workspace.evidence,
    p_source: workspace.destination.source,
    p_template_id: workspace.destination.templateId ?? null,
  });
  if (error || !data) return null;
  const row = data as DbWorkspace;
  return {
    ...fromDb(row),
    // Keep local destination/evidence if RPC returns oddly shaped JSON
    destination: workspace.destination,
    evidence: workspace.evidence,
    plan: workspace.plan,
  };
}

export async function persistUpdateWorkspace(
  db: SupabaseClient,
  workspace: OpportunityWorkspace
): Promise<void> {
  await db.rpc("ar_update_workspace", {
    p_id: workspace.id,
    p_evidence: workspace.evidence,
    p_plan: workspace.plan,
    p_status: workspace.status,
  });
}

export async function persistPacketRequest(
  db: SupabaseClient,
  workspaceId: string,
  name: string,
  email: string,
  note: string
) {
  return db.rpc("ar_create_packet_request", {
    p_workspace_id: workspaceId,
    p_name: name,
    p_email: email,
    p_note: note || null,
    p_offer: "ready_packet_99",
  });
}
