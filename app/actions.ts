'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '../lib/supabase-server';
import type { PokemonData } from './types';

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

/** Upsert the current 6-slot roster into the teams table.
 *  The DB column is `pokemon_list` (jsonb).
 *  Conflict target: `name` (unique) — one row per team name. */
export async function saveTeamAction(
  name: string,
  pokemonList: Array<PokemonData | null>,
) {
  const { data, error } = await db()
    .from('teams')
    .upsert(
      { name, pokemon_list: pokemonList, updated_at: new Date().toISOString() },
      { onConflict: 'name' },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}
