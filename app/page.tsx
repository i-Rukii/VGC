// No 'use client' — this is a Server Component.
// It fetches all initial data in one place then passes it to the client shell.

import { createServerClient } from '../lib/supabase-server';
import CommandCenter from './CommandCenter';
import type { InitialData } from './types';

export const dynamic = 'force-dynamic'; // always fetch fresh on navigation

async function getInitialData(): Promise<InitialData> {
  const db = createServerClient();

  const [notesRes, matchesRes, teamRes, tournamentsRes] = await Promise.all([
    db.from('notes').select('*').order('created_at', { ascending: false }),
    db.from('matches').select('*').order('created_at', { ascending: false }),
    db.from('teams').select('*').order('updated_at', { ascending: false }).limit(1).maybeSingle(),
    db.from('tournaments').select('*').order('created_at', { ascending: true }),
  ]);

  return {
    notes: notesRes.data ?? [],
    matches: matchesRes.data ?? [],
    latestTeam: teamRes.data ?? null,
    tournaments: tournamentsRes.data ?? [],
  };
}

export default async function Page() {
  const initialData = await getInitialData();
  return <CommandCenter initialData={initialData} />;
}
