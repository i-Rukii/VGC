
'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '../lib/supabase-server';
import type { PokemonData, TeamSlot } from './types';

const db = () => createServerClient();

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function addNoteAction(content: string, tag: string) {
  const { data, error } = await db()
    .from('notes')
    .insert({ content, tag })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

export async function deleteNoteAction(id: string) {
  const { error } = await db().from('notes').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/');
}

// ─── Matches ──────────────────────────────────────────────────────────────────

export async function logMatchAction(payload: {
  opponent: string;
  result: 'W' | 'L';
  score: string;
  tournament: string;
}) {
  const { data, error } = await db()
    .from('matches')
    .insert(payload)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

// ─── Teams ────────────────────────────────────────────────────────────────────

export async function saveTeamAction(name: string, slots: Array<PokemonData | null>) {
  // Upsert into a single "active team" row identified by name.
  // If you want per-user rows, add a user_id filter here.
  const { data, error } = await db()
    .from('teams')
    .upsert(
      { name, slots, updated_at: new Date().toISOString() },
      { onConflict: 'name' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}
