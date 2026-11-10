"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readinessDiagnostic } from "@/lib/readiness/questions";
import { evaluateReadiness } from "@/lib/readiness/evaluate";
import { supabaseBrowser } from "@/lib/supabase/client";
import { completeSession, startSession, updateSession } from "@/lib/readiness/session";
import { DiagnosticAnswers } from "@/lib/readiness/types";
import ProgressIndicator from "./ProgressIndicator";
import QuestionCard from "./QuestionCard";

const STORAGE_KEY = "applyready.diagnostic.session";
const { questions } = readinessDiagnostic;

export default function DiagnosticWizard() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const initialized = useRef(false);

  // Resume an in-progress session from this browser if one exists,
  // otherwise start a fresh row in Supabase. Best-effort: if Supabase
  // is unreachable the wizard still works locally and just won't
  // resume across a refresh.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const saved = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_KEY) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessionId(parsed.id);
        setStep(parsed.step ?? 1);
        setAnswers(parsed.answers ?? {});
        return;
      } catch {
        // fall through to starting a new session
      }
    }

    startSession(supabaseBrowser, {})
      .then((session) => setSessionId(session.id))
      .catch(() => {
        // Diagnostic still works without a saved session id; it just
        // won't autosave or be resumable, and results won't have a
        // shareable URL until submit succeeds.
      });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ id: sessionId, step, answers }));
    if (sessionId) {
      updateSession(supabaseBrowser, sessionId, step, answers).catch(() => {
        // best-effort autosave
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, answers, sessionId]);

  const question = questions[step - 1];
  const total = questions.length;
  const selectedValue = answers[question.id];
  const isLast = step === total;

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleContinue = async () => {
    if (!selectedValue) return;
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const result = evaluateReadiness(answers);
      let finalId = sessionId;
      if (finalId) {
        await completeSession(supabaseBrowser, finalId, result);
      } else {
        // Supabase wasn't reachable earlier — start and complete now
        // so the result still gets a real session id to route to.
        const session = await startSession(supabaseBrowser, answers);
        finalId = session.id;
        await completeSession(supabaseBrowser, finalId, result);
      }
      sessionStorage.removeItem(STORAGE_KEY);
      router.push(`/results/${finalId}`);
    } catch (e) {
      setError("Couldn't save your result. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-5 py-12 sm:py-16 min-h-screen">
      <ProgressIndicator step={step} total={total} />
      <QuestionCard question={question} value={selectedValue} onSelect={handleSelect} />

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={step === 1 || submitting}
          className="text-sm text-muted disabled:opacity-0 px-2 py-2"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedValue || submitting}
          className="rounded-card bg-navy text-white px-6 py-3 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {submitting ? "Saving…" : isLast ? "See My Results" : "Continue"}
        </button>
      </div>
    </div>
  );
}
