import { createClient } from '@supabase/supabase-js';

// Server-side singleton — safe to use in Server Actions and Server Components.
// Uses the same anon key; relies on Supabase Row Level Security for access control.
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
