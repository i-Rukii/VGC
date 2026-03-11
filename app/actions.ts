'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '../lib/supabase-server';
import type { PokemonData } from './types';

const db = () => createServerClient();

// ─── Notes ────────────────────────────────────────────────────────────────────
export async function addNoteAction(content: string, category: string) {
  const { data, error } = await db()
    .from('notes')
    .insert({ 
      content, 
      category // Changed from 'tag' to 'category'
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

// ─── Matches ──────────────────────────────────────────────────────────────────
export async function logMatchAction(payload: {
  opponent: string;
  result: 'W' | 'L';
}) {
  const { data, error } = await db()
    .from('matches')
    .insert({
      opponent: payload.opponent,
      result: payload.result
      // Removed 'score' and 'tournament' because they don't exist in your table
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}

// ─── Teams ────────────────────────────────────────────────────────────────────
export async function saveTeamAction(name: string, slots: Array<PokemonData | null>) {
  const { data, error } = await db()
    .from('teams')
    .upsert(
      { 
        name, 
        pokemon_list: slots // Changed from 'slots' to 'pokemon_list'
      },
      { onConflict: 'name' }
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath('/');
  return data;
}
