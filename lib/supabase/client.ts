"use client";

import { createClient } from "@supabase/supabase-js";

// Browser client. Uses only the public anon key — safe to ship to the
// client because the diagnostic tables have RLS on with NO policies;
// every read/write goes through the SECURITY DEFINER RPC functions in
// lib/readiness/session.ts, which validate and shape the input.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
