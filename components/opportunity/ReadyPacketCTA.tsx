"use client";

import { useState } from "react";
import { OpportunityWorkspace } from "@/lib/opportunity/types";

export default function ReadyPacketCTA({
  workspace,
  onRequested,
}: {
  workspace: OpportunityWorkspace;
  onRequested: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  if (status === "done" || workspace.status === "packet_requested") {
    return (
      <div className="rounded-card border border-line bg-white px-5 py-6">
        <p className="font-serif text-2xl text-ink mb-2">Ready Packet requested</p>
        <p className="text-[15px] text-muted leading-relaxed">
          We&rsquo;ll use this workspace to organize evidence, flag unresolved requirements, and
          prepare your packet. Watch {email || "your inbox"} for next steps.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <section className="rounded-card border border-navy/15 bg-navy text-white px-5 py-6 sm:px-6">
        <p className="text-xs uppercase tracking-wide text-white/70 mb-2">MOVE · Ready Packet</p>
        <h3 className="font-serif text-2xl sm:text-3xl mb-3">Get ready for this opportunity</h3>
        <p className="text-[15px] text-white/80 leading-relaxed mb-5 max-w-xl">
          We&rsquo;ll determine exactly what this opportunity requires, organize what you already
          have, identify what&rsquo;s missing, and produce your readiness plan.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-card bg-amber text-navy px-6 py-3 text-sm font-medium hover:opacity-95 transition-opacity"
          >
            Request Ready Packet — $99
          </button>
          <p className="text-xs text-white/60">
            Guided Ready with human review starts at $249 for high-stakes workflows.
          </p>
        </div>
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setStatus("saving");
    try {
      const leads = JSON.parse(sessionStorage.getItem("applyready.packet.leads") || "[]");
      leads.push({
        workspaceId: workspace.id,
        destination: workspace.destination.title,
        name: name.trim(),
        email: email.trim(),
        note: note.trim(),
        createdAt: new Date().toISOString(),
        offer: "ready_packet_99",
      });
      sessionStorage.setItem("applyready.packet.leads", JSON.stringify(leads));
    } catch {
      // ignore storage failures
    }

    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase/client");
      const { persistPacketRequest } = await import("@/lib/opportunity/persist");
      const db = getSupabaseBrowser();
      if (db) {
        await persistPacketRequest(db, workspace.id, name.trim(), email.trim(), note.trim());
      }
    } catch {
      // local request still counts for the proof loop
    }

    onRequested();
    setStatus("done");
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-card border border-line bg-white px-5 py-6 flex flex-col gap-4"
    >
      <p className="font-serif text-2xl text-ink">Request Ready Packet</p>
      <p className="text-sm text-muted -mt-2">
        $99 for evidence mapping, gap plan, and readiness packet preparation.
      </p>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wide text-muted">Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded-card border border-line px-4 py-2.5 text-[15px]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wide text-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-card border border-line px-4 py-2.5 text-[15px]"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-xs uppercase tracking-wide text-muted">Anything we should know</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          className="rounded-card border border-line px-4 py-2.5 text-[15px] resize-none"
          placeholder="Deadline, buyer name, documents you already have…"
        />
      </label>

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Request packet"}
      </button>
    </form>
  );
}
