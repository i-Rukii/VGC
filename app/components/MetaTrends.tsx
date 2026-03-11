'use client';

import { TrendingUp, TrendingDown, Minus, Info, Flame } from 'lucide-react';
import type { MetaPokemon } from '../types';

const META_DATA: MetaPokemon[] = [
  // S Tier
  { name: 'Incineroar', usage: 84.2, tier: 'S', role: 'Support / Intimidate', types: ['fire', 'dark'], trend: 'up' },
  { name: 'Rillaboom', usage: 71.8, tier: 'S', role: 'Priority / Terrain', types: ['grass'], trend: 'stable' },
  { name: 'Flutter Mane', usage: 68.3, tier: 'S', role: 'Special Attacker', types: ['ghost', 'fairy'], trend: 'up' },
  // A Tier
  { name: 'Urshifu-RS', usage: 61.5, tier: 'A', role: 'Breaker / Bypass', types: ['water', 'fighting'], trend: 'up' },
  { name: 'Landorus-T', usage: 59.1, tier: 'A', role: 'Pivot / Control', types: ['ground', 'flying'], trend: 'down' },
  { name: 'Calyrex-Ice', usage: 52.7, tier: 'A', role: 'Restricted / Trick Room', types: ['psychic', 'ice'], trend: 'up' },
  { name: 'Chien-Pao', usage: 48.4, tier: 'A', role: 'Speed Control / Offense', types: ['dark', 'ice'], trend: 'stable' },
  // B Tier
  { name: 'Amoonguss', usage: 45.9, tier: 'B', role: 'Support / Redirect', types: ['grass', 'poison'], trend: 'down' },
  { name: 'Iron Hands', usage: 41.2, tier: 'B', role: 'Bulky Attacker', types: ['fighting', 'electric'], trend: 'stable' },
  { name: 'Tornadus', usage: 38.7, tier: 'B', role: 'Tailwind / Prankster', types: ['flying'], trend: 'down' },
];

const TIER_CONFIG: Record<'S' | 'A' | 'B', { label: string; color: string; glow: string; bg: string; desc: string }> = {
  S: { label: 'S', color: '#f97316', glow: 'rgba(249,115,22,0.3)', bg: 'rgba(249,115,22,0.06)', desc: 'Dominant — present in nearly every top-cut team' },
  A: { label: 'A', color: '#facc15', glow: 'rgba(250,204,21,0.3)', bg: 'rgba(250,204,21,0.04)', desc: 'Strong — reliable picks with clear team archetypes' },
  B: { label: 'B', color: '#60a5fa', glow: 'rgba(96,165,250,0.3)', bg: 'rgba(96,165,250,0.04)', desc: 'Viable — situational, requires specific team support' },
};

const TYPE_COLORS: Record<string, string> = {
  fire: '#f97316', water: '#60a5fa', grass: '#4ade80', electric: '#facc15',
  psychic: '#ec4899', ice: '#67e8f9', dragon: '#818cf8', dark: '#a1a1aa',
  fairy: '#f9a8d4', fighting: '#f87171', poison: '#c084fc', ground: '#d97706',
  flying: '#93c5fd', bug: '#a3e635', rock: '#a8a29e', ghost: '#a78bfa',
  steel: '#94a3b8', normal: '#9ca3af',
};

const TREND_ICON = {
  up: <TrendingUp size={13} className="text-green-400" />,
  down: <TrendingDown size={13} className="text-red-400" />,
  stable: <Minus size={13} className="text-white/30" />,
};

function PokemonRow({ pokemon, rank }: { pokemon: MetaPokemon; rank: number }) {
  const tier = TIER_CONFIG[pokemon.tier];
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-sm border border-transparent hover:border-white/8 hover:bg-white/2 transition-all duration-150 group">
      {/* Rank */}
      <span className="text-[11px] font-black text-white/20 w-5 text-center flex-shrink-0">{rank}</span>

      {/* Name + role */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-bold text-white capitalize">{pokemon.name}</span>
          <div className="flex gap-1">
            {pokemon.types.map(t => (
              <span key={t} className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm"
                style={{ color: TYPE_COLORS[t] ?? '#fff', background: `${TYPE_COLORS[t] ?? '#fff'}18`, border: `1px solid ${TYPE_COLORS[t] ?? '#fff'}25` }}>
                {t}
              </span>
            ))}
          </div>
        </div>
        <span className="text-[11px] text-white/30">{pokemon.role}</span>
      </div>

      {/* Usage bar */}
      <div className="w-36 flex-shrink-0">
        <div className="flex justify-between mb-1">
          <span className="text-[10px] text-white/25">Usage</span>
          <span className="text-[11px] font-bold" style={{ color: tier.color }}>{pokemon.usage}%</span>
        </div>
        <div className="h-1.5 rounded-sm bg-white/5 overflow-hidden">
          <div className="h-full rounded-sm transition-all duration-700"
            style={{ width: `${pokemon.usage}%`, background: tier.color, boxShadow: `0 0 6px ${tier.glow}` }} />
        </div>
      </div>

      {/* Trend */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        {TREND_ICON[pokemon.trend]}
      </div>
    </div>
  );
}

export default function MetaTrends() {
  const tiers: ('S' | 'A' | 'B')[] = ['S', 'A', 'B'];
  let globalRank = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Meta <span className="text-orange-500">Trends</span>
          </h1>
          <p className="text-white/35 text-sm mt-0.5">Top Pokémon usage in Regulation G — updated from tournament data</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-orange-500/20 bg-orange-500/5">
          <Flame size={13} className="text-orange-500" />
          <span className="text-[11px] text-orange-400 font-bold tracking-widest">WCS 2025 DATA</span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3">
        {tiers.map(tier => {
          const cfg = TIER_CONFIG[tier];
          return (
            <div key={tier} className="rounded-sm border border-[#2d2d2d] p-3 flex items-center gap-3" style={{ background: '#1a1a1b' }}>
              <div className="w-10 h-10 rounded-sm flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.glow}`, textShadow: `0 0 12px ${cfg.color}` }}>
                {tier}
              </div>
              <div>
                <p className="text-xs font-bold text-white">{tier === 'S' ? 'S-Tier' : tier === 'A' ? 'A-Tier' : 'B-Tier'}</p>
                <p className="text-[10px] text-white/30 leading-tight mt-0.5">{cfg.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tier sections */}
      {tiers.map(tier => {
        const cfg = TIER_CONFIG[tier];
        const pokemonInTier = META_DATA.filter(p => p.tier === tier);
        return (
          <div key={tier} className="rounded-sm border border-[#2d2d2d] overflow-hidden" style={{ background: '#1a1a1b' }}>
            {/* Tier header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
              style={{ background: cfg.bg, borderLeft: `3px solid ${cfg.color}` }}>
              <span className="font-black text-base w-6 text-center"
                style={{ color: cfg.color, textShadow: `0 0 12px ${cfg.color}` }}>
                {tier}
              </span>
              <span className="text-xs font-bold text-white/60 tracking-widest uppercase">
                {tier === 'S' ? 'Dominant Picks' : tier === 'A' ? 'Strong Picks' : 'Viable Picks'}
              </span>
              <span className="ml-auto text-[10px] text-white/25">{pokemonInTier.length} Pokémon</span>

              {/* Column headers */}
              <div className="flex items-center gap-4 ml-4">
                <span className="text-[10px] text-white/25 w-36 text-right tracking-widest">USAGE RATE</span>
                <span className="text-[10px] text-white/25 w-8 text-center tracking-widest">TREND</span>
              </div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-white/3">
              {pokemonInTier.map(p => {
                globalRank++;
                return <PokemonRow key={p.name} pokemon={p} rank={globalRank} />;
              })}
            </div>
          </div>
        );
      })}

      {/* Footnote */}
      <div className="flex items-start gap-2 px-4 py-3 rounded-sm border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <Info size={13} className="text-white/25 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-white/25 leading-relaxed">
          Usage data derived from top-cut VGC tournament results. Trends reflect week-over-week change.
          Regulation G includes all Pokémon from Scarlet & Violet up to Crown Tundra DLC.
        </p>
      </div>
    </div>
  );
}
