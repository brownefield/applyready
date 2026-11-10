"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser client. Uses only the public anon key — safe to ship to the
// client because the diagnostic tables have RLS on with NO policies;
// every read/write goes through the SECURITY DEFINER RPC functions in
// lib/readiness/session.ts, which validate and shape the input.

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!browserClient) {
    browserClient = createClient(url, key);
  }
  return browserClient;
}

/** @deprecated Prefer getSupabaseBrowser() which returns null when unset. */
export const supabaseBrowser = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getSupabaseBrowser();
    if (!client) {
      if (prop === "rpc") {
        return async () => ({ data: null, error: new Error("Supabase env not configured") });
      }
      return undefined;
    }
    return Reflect.get(client, prop, receiver);
  },
});
