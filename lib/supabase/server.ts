import { createClient } from "@supabase/supabase-js";

// Server-side client for use in Server Components / route handlers
// (e.g. the results page fetching a session before render). Same anon
// key as the browser client — no service role key is needed for this
// MVP since every operation goes through the RPC functions.
export function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
