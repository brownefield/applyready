"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { OPPORTUNITY_TEMPLATES } from "@/lib/opportunity/templates";
import { createWorkspace, saveWorkspace } from "@/lib/opportunity/workspace";
import { DestinationSource } from "@/lib/opportunity/types";

type Mode = "paste" | "describe" | "template";

export default function BringYourOwnOpportunity() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<Mode>("paste");
  const [text, setText] = useState("");
  const [templateId, setTemplateId] = useState(OPPORTUNITY_TEMPLATES[0].id);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  const start = async (
    source: DestinationSource,
    value: string,
    fileName?: string,
    tmpl?: string
  ) => {
    setError("");
    try {
      let workspace = createWorkspace({
        text: value,
        source,
        templateId: tmpl,
        fileName,
      });

      // Best-effort durable persist; sessionStorage remains the source of truth for MVP.
      try {
        const { getSupabaseBrowser } = await import("@/lib/supabase/client");
        const { persistCreateWorkspace } = await import("@/lib/opportunity/persist");
        const db = getSupabaseBrowser();
        if (db) {
          const saved = await persistCreateWorkspace(db, workspace);
          if (saved) workspace = saved;
        }
      } catch {
        // offline / env missing — continue locally
      }

      saveWorkspace(workspace);
      startTransition(() => {
        router.push(`/ready/${workspace.id}`);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start that opportunity.");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "template") {
      void start("template", text, undefined, templateId);
      return;
    }
    void start(mode, text);
  };

  const onFile = async (file: File | null) => {
    if (!file) return;
    setError("");
    try {
      const isTextish = /\.(txt|md|csv|json|html?)$/i.test(file.name) || file.type.startsWith("text/");
      if (!isTextish) {
        // Binary formats (PDF/DOC) are accepted as destination markers in this
        // slice; full document parsing lands with the Ready Packet workflow.
        await start(
          "upload",
          `Uploaded document: ${file.name}\nUse the vendor readiness baseline until text extraction is available.`,
          file.name,
          "vendor-readiness"
        );
        return;
      }
      const content = await file.text();
      await start("upload", content || `Uploaded file: ${file.name}`, file.name);
    } catch {
      setError("Could not read that file. Try pasting the text instead.");
    }
  };

  return (
    <section className="w-full max-w-2xl mx-auto">
      <form
        onSubmit={onSubmit}
        className="rounded-card border border-line bg-white/90 shadow-[0_1px_0_rgba(11,31,51,0.04)] overflow-hidden"
      >
        <div className="flex border-b border-line text-sm">
          {(
            [
              ["paste", "Paste"],
              ["describe", "Describe"],
              ["template", "Template"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setMode(id)}
              className={`flex-1 px-3 py-3 transition-colors ${
                mode === id ? "bg-navy text-white" : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex-1 px-3 py-3 text-muted hover:text-ink border-l border-line transition-colors"
          >
            Upload
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.csv,.json,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-4">
          {mode === "template" ? (
            <div className="flex flex-col gap-3">
              <label className="text-xs uppercase tracking-wide text-muted">
                Choose a starting template
              </label>
              <div className="grid gap-2">
                {OPPORTUNITY_TEMPLATES.map((tmpl) => (
                  <label
                    key={tmpl.id}
                    className={`rounded-card border px-4 py-3 cursor-pointer transition-colors ${
                      templateId === tmpl.id
                        ? "border-navy bg-paper"
                        : "border-line hover:border-navy/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="template"
                      value={tmpl.id}
                      checked={templateId === tmpl.id}
                      onChange={() => setTemplateId(tmpl.id)}
                      className="sr-only"
                    />
                    <span className="block font-medium text-ink text-[15px]">{tmpl.title}</span>
                    <span className="block text-sm text-muted mt-0.5">{tmpl.blurb}</span>
                  </label>
                ))}
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={3}
                placeholder="Optional: paste details from the opportunity to refine the requirements."
                className="rounded-card border border-line px-4 py-3 text-[15px] resize-none focus:outline-none focus:border-navy/50"
              />
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={7}
              placeholder={
                mode === "paste"
                  ? "Paste an RFP, job announcement, grant notice, vendor application, or eligibility page…"
                  : "Describe what you're trying to qualify for — contract, job, grant, certification, program…"
              }
              className="rounded-card border border-line px-4 py-3 text-[15px] resize-none focus:outline-none focus:border-navy/50"
            />
          )}

          {error && <p className="text-sm text-red-700">{error}</p>}

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-xs text-muted">
              ApplyReady maps the destination into requirements, evidence, gaps, and actions.
            </p>
            <button
              type="submit"
              disabled={pending}
              className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {pending ? "Opening workspace…" : "Build my readiness plan"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
