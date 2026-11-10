"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  buildPlan,
  loadWorkspace,
  markPacketRequested,
  saveWorkspace,
  setEvidenceStatus,
} from "@/lib/opportunity/workspace";
import { EvidenceStatus, OpportunityWorkspace } from "@/lib/opportunity/types";
import EvidenceChecklist from "./EvidenceChecklist";
import CompletionPlanView from "./CompletionPlanView";
import ReadyPacketCTA from "./ReadyPacketCTA";

export default function WorkspaceClient({ workspaceId }: { workspaceId: string }) {
  const [workspace, setWorkspace] = useState<OpportunityWorkspace | null>(null);
  const [missing, setMissing] = useState(false);
  const [phase, setPhase] = useState<"qualify" | "plan">("qualify");

  useEffect(() => {
    const loaded = loadWorkspace(workspaceId);
    if (!loaded) {
      setMissing(true);
      return;
    }
    setWorkspace(loaded);
    if (loaded.plan) setPhase("plan");
  }, [workspaceId]);

  if (missing) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink mb-3">Workspace not found</h1>
        <p className="text-muted mb-8">
          This readiness workspace is only available in the browser session that created it.
        </p>
        <Link href="/" className="rounded-card bg-navy text-white px-6 py-3 text-sm">
          Start again
        </Link>
      </main>
    );
  }

  if (!workspace) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center text-muted">
        Loading workspace…
      </main>
    );
  }

  const values = Object.fromEntries(
    Object.entries(workspace.evidence).map(([id, entry]) => [id, entry.status])
  ) as Record<string, EvidenceStatus>;

  const assessed = Object.values(workspace.evidence).filter((e) => e.status !== "unknown").length;
  const total = workspace.destination.requirements.length;

  const syncRemote = async (next: OpportunityWorkspace) => {
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const { persistUpdateWorkspace } = await import("@/lib/opportunity/persist");
      const db = getSupabaseBrowser();
      if (db) await persistUpdateWorkspace(db, next);
    } catch {
      // local workspace remains usable
    }
  };

  const onStatus = (requirementId: string, status: EvidenceStatus) => {
    const next = setEvidenceStatus(workspace, requirementId, status);
    saveWorkspace(next);
    setWorkspace(next);
    void syncRemote(next);
  };

  const onBuildPlan = () => {
    const next = buildPlan(workspace);
    saveWorkspace(next);
    setWorkspace(next);
    setPhase("plan");
    void syncRemote(next);
  };

  const onPacket = () => {
    const next = markPacketRequested(workspace);
    saveWorkspace(next);
    setWorkspace(next);
    void syncRemote(next);
  };

  return (
    <main className="mx-auto max-w-2xl px-5 py-10 sm:py-14 flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-wide text-amber">
          {workspace.destination.kind.replace("_", " ")} · {workspace.destination.source}
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink leading-tight">
          {workspace.destination.title}
        </h1>
        {workspace.destination.summary && (
          <p className="text-[15px] text-muted leading-relaxed">
            {workspace.destination.summary}
          </p>
        )}
        <p className="text-sm text-ink">
          {workspace.destination.requirements.length} requirements identified
          {phase === "qualify" ? ` · ${assessed}/${total} assessed` : null}
        </p>
      </header>

      {phase === "qualify" ? (
        <section className="flex flex-col gap-6">
          <div>
            <h2 className="font-serif text-2xl text-ink mb-2">What do you already have?</h2>
            <p className="text-sm text-muted leading-relaxed">
              Mark each requirement. ApplyReady only needs enough to find gaps and produce the
              plan.
            </p>
          </div>

          <EvidenceChecklist
            requirements={workspace.destination.requirements}
            values={values}
            onChange={onStatus}
          />

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between sticky bottom-4 bg-paper/95 border border-line rounded-card px-4 py-3 backdrop-blur">
            <p className="text-xs text-muted">
              You can build a plan with partial answers. Unassessed items stay on the list.
            </p>
            <button
              type="button"
              onClick={onBuildPlan}
              className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium"
            >
              Show completion plan
            </button>
          </div>
        </section>
      ) : (
        workspace.plan && (
          <section className="flex flex-col gap-10">
            <CompletionPlanView plan={workspace.plan} />
            <ReadyPacketCTA workspace={workspace} onRequested={onPacket} />
            <button
              type="button"
              onClick={() => setPhase("qualify")}
              className="text-sm text-muted hover:text-ink self-start"
            >
              ← Adjust evidence answers
            </button>
          </section>
        )
      )}
    </main>
  );
}
