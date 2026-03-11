// ─── UI / Local types ────────────────────────────────────────────────────────

export type Tab = 'dashboard' | 'team-builder' | 'meta-trends' | 'tournaments';

export interface PokemonStat {
  name: string;
  value: number;
}

export interface TeamSlot {
  id: number;
  pokemon: PokemonData | null;
}

export interface PokemonData {
  name: string;
  sprite: string;
  types: string[];
  stats: PokemonStat[];
  id: number;
}

export interface MetaPokemon {
  name: string;
  usage: number;
  tier: 'S' | 'A' | 'B';
  role: string;
  types: string[];
  trend: 'up' | 'down' | 'stable';
}

// ─── Supabase DB row types ────────────────────────────────────────────────────

export interface DbNote {
  id: string;          // uuid
  content: string;
  tag: string;
  created_at: string;
}

export interface DbMatch {
  id: string;          // uuid
  opponent: string;
  result: 'W' | 'L';
  score: string;
  tournament: string;
  created_at: string;
}

export interface DbTeam {
  id: string;          // uuid
  name: string;
  slots: Array<PokemonData | null>;  // jsonb
  updated_at: string;
}

export interface DbTournament {
  id: string;          // uuid
  name: string;
  date: string;
  location: string;
  country: string;
  format: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  players?: number;
  cp: number;
  created_at: string;
}

// ─── Aggregates passed from Server → Client ───────────────────────────────────

export interface InitialData {
  notes: DbNote[];
  matches: DbMatch[];
  latestTeam: DbTeam | null;
  tournaments: DbTournament[];
}
