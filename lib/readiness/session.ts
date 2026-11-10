// Thin wrapper around the applyready.* RPC functions (ar_start_session,
// ar_update_session, ar_complete_session, ar_get_session,
// ar_create_action_request — see the applyready_readiness_diagnostic
// migration). Nothing outside this file should call supabase.rpc(...)
// directly for diagnostic data, so the DB call shape only has to
// change in one place.

import { SupabaseClient } from "@supabase/supabase-js";
import { DiagnosticAnswers, DiagnosticSession, ReadinessResult } from "./types";

export async function startSession(
  db: SupabaseClient,
  initialAnswers: DiagnosticAnswers = {}
): Promise<DiagnosticSession> {
  const { data, error } = await db.rpc("ar_start_session", { p_answers: initialAnswers });
  if (error) throw error;
  return data as DiagnosticSession;
}

export async function updateSession(
  db: SupabaseClient,
  id: string,
  currentStep: number,
  answers: DiagnosticAnswers
): Promise<DiagnosticSession> {
  const { data, error } = await db.rpc("ar_update_session", {
    p_id: id,
    p_current_step: currentStep,
    p_answers: answers,
  });
  if (error) throw error;
  return data as DiagnosticSession;
}

export async function completeSession(
  db: SupabaseClient,
  id: string,
  result: ReadinessResult
): Promise<DiagnosticSession> {
  const { data, error } = await db.rpc("ar_complete_session", {
    p_id: id,
    p_score: result.score,
    p_route: result.route,
    p_result: result,
  });
  if (error) throw error;
  return data as DiagnosticSession;
}

export async function getSession(
  db: SupabaseClient,
  id: string
): Promise<DiagnosticSession | null> {
  const { data, error } = await db.rpc("ar_get_session", { p_id: id });
  if (error) throw error;
  return (data as DiagnosticSession) ?? null;
}

export async function createActionRequest(
  db: SupabaseClient,
  sessionId: string,
  name: string,
  email: string,
  requestText: string
) {
  const { data, error } = await db.rpc("ar_create_action_request", {
    p_session_id: sessionId,
    p_name: name,
    p_email: email,
    p_request_text: requestText,
  });
  if (error) throw error;
  return data;
}
