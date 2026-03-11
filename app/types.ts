// ─── Core stat/tab types ─────────────────────────────────────────────────────

export type Tab = 'dashboard' | 'team-builder' | 'meta-trends' | 'tournaments';

export const STAT_KEYS = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'] as const;
export type StatKey = typeof STAT_KEYS[number];

export const STAT_LABEL: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Atk',
  defense: 'Def',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'Spe',
};

export const STAT_FULL: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  'special-attack': 'Sp. Atk',
  'special-defense': 'Sp. Def',
  speed: 'Speed',
};

// ─── EV / IV spreads ─────────────────────────────────────────────────────────

export type EVSpread = Record<StatKey, number>;
export type IVSpread = Record<StatKey, number>;

export const DEFAULT_EVS: EVSpread = { hp: 0, attack: 0, defense: 0, 'special-attack': 0, 'special-defense': 0, speed: 0 };
export const DEFAULT_IVS: IVSpread = { hp: 31, attack: 31, defense: 31, 'special-attack': 31, 'special-defense': 31, speed: 31 };

export const MAX_EV_PER_STAT = 252;
export const MAX_EV_TOTAL = 510;

// ─── Natures ─────────────────────────────────────────────────────────────────

export const NATURES = {
  Hardy:   { plus: null,                minus: null },
  Lonely:  { plus: 'attack',            minus: 'defense' },
  Brave:   { plus: 'attack',            minus: 'speed' },
  Adamant: { plus: 'attack',            minus: 'special-attack' },
  Naughty: { plus: 'attack',            minus: 'special-defense' },
  Bold:    { plus: 'defense',           minus: 'attack' },
  Docile:  { plus: null,                minus: null },
  Relaxed: { plus: 'defense',           minus: 'speed' },
  Impish:  { plus: 'defense',           minus: 'special-attack' },
  Lax:     { plus: 'defense',           minus: 'special-defense' },
  Timid:   { plus: 'speed',             minus: 'attack' },
  Hasty:   { plus: 'speed',             minus: 'defense' },
  Serious: { plus: null,                minus: null },
  Jolly:   { plus: 'speed',             minus: 'special-attack' },
  Naive:   { plus: 'speed',             minus: 'special-defense' },
  Modest:  { plus: 'special-attack',    minus: 'attack' },
  Mild:    { plus: 'special-attack',    minus: 'defense' },
  Quiet:   { plus: 'special-attack',    minus: 'speed' },
  Bashful: { plus: null,                minus: null },
  Rash:    { plus: 'special-attack',    minus: 'special-defense' },
  Calm:    { plus: 'special-defense',   minus: 'attack' },
  Gentle:  { plus: 'special-defense',   minus: 'defense' },
  Sassy:   { plus: 'special-defense',   minus: 'speed' },
  Careful: { plus: 'special-defense',   minus: 'special-attack' },
  Quirky:  { plus: null,                minus: null },
} as const satisfies Record<string, { plus: StatKey | null; minus: StatKey | null }>;

export const NATURE_NAMES = Object.keys(NATURES) as Array<keyof typeof NATURES>;

// ─── Tera types ───────────────────────────────────────────────────────────────

export const TERA_TYPES = [
  'Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison',
  'Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel',
  'Fairy','Stellar',
] as const;

export type TeraType = typeof TERA_TYPES[number];

// ─── VGC curated items ────────────────────────────────────────────────────────

export const VGC_ITEMS = [
  // Choice
  'Choice Band','Choice Specs','Choice Scarf',
  // Power
  'Life Orb','Expert Belt','Muscle Band','Wise Glasses',
  // Defensive
  'Focus Sash','Assault Vest','Rocky Helmet','Leftovers','Eviolite','Air Balloon',
  // Utility
  'Safety Goggles','Clear Amulet','Covert Cloak','Booster Energy',
  'Eject Pack','Eject Button','Mirror Herb','Loaded Dice','Punching Glove',
  'White Herb','Mental Herb','Power Herb','Red Card','Throat Spray',
  'Wide Lens','Zoom Lens','Metronome',
  // Terrain seeds
  'Electric Seed','Grassy Seed','Misty Seed','Psychic Seed',
  // Weather rocks
  'Damp Rock','Heat Rock','Icy Rock','Smooth Rock',
  // Pinch berries
  'Sitrus Berry','Lum Berry',
  'Figy Berry','Wiki Berry','Mago Berry','Aguav Berry','Iapapa Berry',
  // Status berries
  'Cheri Berry','Rawst Berry','Chesto Berry','Pecha Berry','Aspear Berry','Persim Berry',
  // Resist berries
  'Occa Berry','Passho Berry','Wacan Berry','Rindo Berry','Yache Berry',
  'Chople Berry','Kebia Berry','Shuca Berry','Coba Berry','Payapa Berry',
  'Tanga Berry','Charti Berry','Kasib Berry','Haban Berry','Colbur Berry',
  'Babiri Berry','Roseli Berry','Chilan Berry',
  // Type gems / boosts
  'Black Glasses','Black Belt','Charcoal','Mystic Water','Miracle Seed',
  'Soft Sand','Sharp Beak','Twisted Spoon','Silver Powder','Hard Stone',
  'Spell Tag','Dragon Scale','Silk Scarf','Never-Melt Ice','Poison Barb',
  'Metal Coat','Magnet',
  // Iron Ball
  'Iron Ball',
] as const;

// ─── Pokémon data (stored in DB + used by UI) ─────────────────────────────────

export interface PokemonStat {
  name: StatKey;
  value: number;
}

export interface PokemonData {
  id: number;
  name: string;           // PokeAPI kebab-case name
  sprite: string;
  types: string[];
  stats: PokemonStat[];
  abilities: string[];    // all abilities (kebab-case)
  // ── Competitive fields ─────────────────────────────────────────────────────
  ability: string;
  nature: string;
  item: string;
  moves: [string, string, string, string];
  evs: EVSpread;
  ivs: IVSpread;
  teraType: string;
}

export interface TeamSlot {
  id: number;
  pokemon: PokemonData | null;
}

// ─── Stat calculation (Level 50 VGC) ─────────────────────────────────────────

export function calcStat(
  statName: StatKey,
  base: number,
  iv: number,
  ev: number,
  nature: string,
): number {
  const natData = NATURES[nature as keyof typeof NATURES] ?? { plus: null, minus: null };
  const natMult = natData.plus === statName ? 1.1 : natData.minus === statName ? 0.9 : 1.0;
  const level = 50;
  const inner = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100);
  if (statName === 'hp') return inner + level + 10;
  return Math.floor((inner + 5) * natMult);
}

export function totalEVs(evs: EVSpread): number {
  return STAT_KEYS.reduce((sum, k) => sum + evs[k], 0);
}

/** Set an EV while respecting 252-per-stat and 510-total caps */
export function setEV(stat: StatKey, raw: number, current: EVSpread): EVSpread {
  const clamped = Math.max(0, Math.min(MAX_EV_PER_STAT, raw));
  const others = STAT_KEYS.reduce((s, k) => k !== stat ? s + current[k] : s, 0);
  return { ...current, [stat]: Math.min(clamped, MAX_EV_TOTAL - others) };
}

// ─── Display helpers ──────────────────────────────────────────────────────────

/** "flutter-mane" → "Flutter Mane", "urshifu-rapid-strike" → "Urshifu-Rapid-Strike" */
export function displayName(kebab: string): string {
  // Multi-word species names (iron-*, flutter-*, chien-*, wo-*) use spaces.
  // Form variants (urshifu-rapid-strike, calyrex-ice) use hyphens.
  const spacePatterns = /^(iron|flutter|chien|wo|ting|chi|sandy|roaring|walking|slither|great|brute|scream)/;
  const sep = spacePatterns.test(kebab) ? ' ' : '-';
  return kebab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(sep === ' ' ? ' ' : '-');
}

/** Showdown paste name: capitalise each hyphen-segment, keep hyphens */
export function showdownName(kebab: string): string {
  return kebab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
}

// ─── Showdown export ──────────────────────────────────────────────────────────

export function toShowdownPaste(slots: TeamSlot[]): string {
  return slots
    .filter(s => s.pokemon !== null)
    .map(({ pokemon: p }) => {
      if (!p) return '';
      const lines: string[] = [];

      lines.push(p.item ? `${showdownName(p.name)} @ ${p.item}` : showdownName(p.name));
      if (p.ability)   lines.push(`Ability: ${displayName(p.ability)}`);
      lines.push('Level: 50');
      if (p.teraType)  lines.push(`Tera Type: ${p.teraType}`);

      const evParts = STAT_KEYS
        .filter(k => p.evs[k] > 0)
        .map(k => `${p.evs[k]} ${STAT_LABEL[k]}`);
      if (evParts.length) lines.push(`EVs: ${evParts.join(' / ')}`);

      if (p.nature) lines.push(`${p.nature} Nature`);

      const ivParts = STAT_KEYS
        .filter(k => p.ivs[k] < 31)
        .map(k => `${p.ivs[k]} ${STAT_LABEL[k]}`);
      if (ivParts.length) lines.push(`IVs: ${ivParts.join(' / ')}`);

      p.moves.filter(Boolean).forEach(m => lines.push(`- ${displayName(m)}`));

      return lines.join('\n');
    })
    .join('\n\n');
}

// ─── DB row types ─────────────────────────────────────────────────────────────

export interface DbNote {
  id: string;
  content: string;
  tag: string;
  created_at: string;
}

export interface DbMatch {
  id: string;
  opponent: string;
  result: 'W' | 'L';
  score: string;
  tournament: string;
  created_at: string;
}

export interface DbTeam {
  id: string;
  name: string;
  pokemon_list: Array<PokemonData | null>;   // jsonb column
  updated_at: string;
}

export interface DbTournament {
  id: string;
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

export interface InitialData {
  notes: DbNote[];
  matches: DbMatch[];
  latestTeam: DbTeam | null;
  tournaments: DbTournament[];
}

// ─── Meta (unchanged) ─────────────────────────────────────────────────────────

export interface MetaPokemon {
  name: string;
  usage: number;
  tier: 'S' | 'A' | 'B';
  role: string;
  types: string[];
  trend: 'up' | 'down' | 'stable';
}
