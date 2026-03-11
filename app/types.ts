
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

export interface Tournament {
  id: number;
  name: string;
  date: string;
  location: string;
  country: string;
  format: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  players?: number;
  cp: number;
}

export interface MatchResult {
  opponent: string;
  result: 'W' | 'L';
  score: string;
  tournament: string;
  date: string;
}

export interface Note {
  id: number;
  content: string;
  tag: string;
  createdAt: string;
}
