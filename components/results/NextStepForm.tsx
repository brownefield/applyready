"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { createActionRequest } from "@/lib/readiness/session";

export default function NextStepForm({ sessionId }: { sessionId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [requestText, setRequestText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");

  if (status === "done") {
    return (
      <div className="rounded-card border border-line bg-white px-5 py-6">
        <p className="font-serif text-xl text-ink mb-1">Got it.</p>
        <p className="text-[15px] text-muted">
          We&rsquo;ll follow up at {email} about what to build next.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium w-full sm:w-auto"
      >
        Build My Next Step
      </button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !requestText.trim()) return;
    setStatus("saving");
    try {
      await createActionRequest(supabaseBrowser, sessionId, name.trim(), email.trim(), requestText.trim());
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-card border border-line bg-white px-5 py-6 flex flex-col gap-4"
    >
      <p className="font-serif text-xl text-ink">Build my next step</p>
      <p className="text-sm text-muted -mt-2">
        Tell us what to build and we&rsquo;ll follow up with next steps.
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
        <span className="text-xs uppercase tracking-wide text-muted">
          What do you want help completing?
        </span>
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          required
          rows={3}
          className="rounded-card border border-line px-4 py-2.5 text-[15px] resize-none"
        />
      </label>

      {status === "error" && (
        <p className="text-sm text-red-600">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "saving"}
        className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium disabled:opacity-50"
      >
        {status === "saving" ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
