'use client';

import { useState, useCallback, useTransition } from 'react';
import {
  Search, X, Loader2, AlertCircle, Zap, Shield, ChevronRight,
  Save, CheckCircle,
} from 'lucide-react';
import { saveTeamAction } from '../actions';
import type { TeamSlot, PokemonData, DbTeam } from '../types';

// ─── Type colours ──────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  fire:     { bg: 'rgba(249,115,22,0.2)',   text: '#f97316' },
  water:    { bg: 'rgba(59,130,246,0.2)',   text: '#60a5fa' },
  grass:    { bg: 'rgba(74,222,128,0.2)',   text: '#4ade80' },
  electric: { bg: 'rgba(250,204,21,0.2)',   text: '#facc15' },
  psychic:  { bg: 'rgba(236,72,153,0.2)',   text: '#ec4899' },
  ice:      { bg: 'rgba(103,232,249,0.2)',  text: '#67e8f9' },
  dragon:   { bg: 'rgba(99,102,241,0.2)',   text: '#818cf8' },
  dark:     { bg: 'rgba(161,161,170,0.2)',  text: '#a1a1aa' },
  fairy:    { bg: 'rgba(251,207,232,0.2)',  text: '#fbcfe8' },
  fighting: { bg: 'rgba(220,38,38,0.2)',    text: '#f87171' },
  poison:   { bg: 'rgba(168,85,247,0.2)',   text: '#c084fc' },
  ground:   { bg: 'rgba(180,83,9,0.2)',     text: '#d97706' },
  flying:   { bg: 'rgba(147,197,253,0.2)',  text: '#93c5fd' },
  bug:      { bg: 'rgba(132,204,22,0.2)',   text: '#a3e635' },
  rock:     { bg: 'rgba(120,113,108,0.2)',  text: '#a8a29e' },
  ghost:    { bg: 'rgba(88,28,135,0.2)',    text: '#a78bfa' },
  steel:    { bg: 'rgba(148,163,184,0.2)',  text: '#94a3b8' },
  normal:   { bg: 'rgba(161,161,170,0.15)', text: '#9ca3af' },
};

const STAT_COLORS: Record<string, string> = {
  hp:               '#4ade80',
  attack:           '#f97316',
  defense:          '#60a5fa',
  'special-attack': '#c084fc',
  'special-defense':'#67e8f9',
  speed:            '#facc15',
};

const STAT_ABBREV: Record<string, string> = {
  hp:               'HP',
  attack:           'ATK',
  defense:          'DEF',
  'special-attack': 'SPA',
  'special-defense':'SPD',
  speed:            'SPE',
};

// ─── Small components ──────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] ?? { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
  return (
    <span
      className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm"
      style={{ background: c.bg, color: c.text }}
    >
      {type}
    </span>
  );
}

function StatBar({ name, value }: { name: string; value: number }) {
  const color = STAT_COLORS[name] ?? '#f97316';
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-white/35 w-8 tracking-wider uppercase flex-shrink-0">
        {STAT_ABBREV[name] ?? name.slice(0, 3).toUpperCase()}
      </span>
      <div className="flex-1 h-1.5 rounded-sm bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${Math.min((value / 255) * 100, 100)}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
        />
      </div>
      <span className="text-[11px] font-bold text-white/60 w-8 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

function FilledSlot({ slot, onRemove }: { slot: TeamSlot; onRemove: () => void }) {
  const p = slot.pokemon!;
  return (
    <div
      className="rounded-sm border border-[#2d2d2d] hover:border-orange-500/30 transition-all duration-200 overflow-hidden group relative"
      style={{ background: '#1a1a1b' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }}
      />
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 w-6 h-6 rounded-sm flex items-center justify-center bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
      >
        <X size={12} />
      </button>
      <div
        className="relative flex items-center justify-center pt-4 pb-2"
        style={{ background: 'radial-gradient(circle at 50% 80%, rgba(249,115,22,0.05) 0%, transparent 70%)' }}
      >
        <img
          src={p.sprite}
          alt={p.name}
          className="w-20 h-20 object-contain"
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        />
      </div>
      <div className="px-4 pb-4">
        <p className="text-sm font-black text-white capitalize tracking-wide mb-2">{p.name}</p>
        <div className="flex gap-1.5 mb-3">
          {p.types.map(t => <TypeBadge key={t} type={t} />)}
        </div>
        <div className="space-y-1.5">
          {p.stats.map(s => <StatBar key={s.name} name={s.name} value={s.value} />)}
        </div>
      </div>
    </div>
  );
}

function EmptySlot({ slotNum, isActive, onClick }: { slotNum: number; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border transition-all duration-200 flex flex-col items-center justify-center gap-3 h-64 group"
      style={{
        background: isActive ? 'rgba(249,115,22,0.04)' : '#1a1a1b',
        borderColor: isActive ? 'rgba(249,115,22,0.4)' : '#2d2d2d',
        borderStyle: isActive ? 'solid' : 'dashed',
      }}
    >
      <div
        className="w-12 h-12 rounded-sm flex items-center justify-center transition-all"
        style={{
          background: isActive ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isActive ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        <Zap size={18} style={{ color: isActive ? '#f97316' : 'rgba(255,255,255,0.15)' }} />
      </div>
      <div className="text-center">
        <p
          className="text-[11px] font-bold tracking-[0.2em] uppercase"
          style={{ color: isActive ? 'rgba(249,115,22,0.7)' : 'rgba(255,255,255,0.2)' }}
        >
          {isActive ? 'Search Below' : `Slot ${String(slotNum + 1).padStart(2, '0')}`}
        </p>
        <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.15)' }}>
          {isActive ? '↓ Enter Pokémon name' : 'Click to fill'}
        </p>
      </div>
    </button>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

const TEAM_NAME = 'My Team'; // single active team; change or make dynamic later

interface Props {
  initialTeam: DbTeam | null;
}

export default function TeamBuilder({ initialTeam }: Props) {
  // Hydrate from DB or start empty
  const [slots, setSlots] = useState<TeamSlot[]>(() => {
    if (initialTeam?.slots) {
      return initialTeam.slots.map((p, i) => ({ id: i, pokemon: p }));
    }
    return Array.from({ length: 6 }, (_, i) => ({ id: i, pokemon: null }));
  });

  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [savePending, startSaveTransition] = useTransition();
  const [saveToast, setSaveToast] = useState<'success' | 'error' | null>(null);

  const filled = slots.filter(s => s.pokemon).length;

  // ── Fetch from PokeAPI ───────────────────────────────────────────────────

  const searchPokemon = useCallback(async () => {
    if (!query.trim() || activeSlot === null) return;
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query.trim().toLowerCase()}`);
      if (!res.ok) throw new Error(`"${query}" not found. Check spelling.`);
      const data = await res.json();
      const pokemon: PokemonData = {
        name: data.name,
        id: data.id,
        sprite: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
        stats: data.stats.map((s: any) => ({ name: s.stat.name, value: s.base_stat })),
      };
      setSlots(prev => prev.map(s => s.id === activeSlot ? { ...s, pokemon } : s));
      setQuery('');
      setActiveSlot(null);
    } catch (e: any) {
      setFetchError(e.message ?? 'Failed to fetch. Try again.');
    } finally {
      setLoading(false);
    }
  }, [query, activeSlot]);

  // ── Save team to Supabase ────────────────────────────────────────────────

  const handleSave = () => {
    const pokemonSlots = slots.map(s => s.pokemon);
    startSaveTransition(async () => {
      try {
        await saveTeamAction(TEAM_NAME, pokemonSlots);
        setSaveToast('success');
      } catch {
        setSaveToast('error');
      }
      setTimeout(() => setSaveToast(null), 3000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {saveToast && (
        <div
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium shadow-lg"
          style={{
            background: '#1a1a1b',
            border: `1px solid ${saveToast === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
            color: saveToast === 'success' ? '#4ade80' : '#f87171',
          }}
        >
          {saveToast === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          {saveToast === 'success' ? 'Team saved to Supabase ✓' : 'Failed to save — check console'}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Team <span className="text-orange-500">Builder</span>
          </h1>
          <p className="text-white/35 text-sm mt-0.5">
            Build and analyse your VGC roster
            {initialTeam && (
              <span className="ml-2 text-orange-400/60 text-[10px] uppercase tracking-widest font-bold">
                · Loaded from DB
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Slot pips */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: i < filled ? '#f97316' : 'rgba(255,255,255,0.08)',
                  boxShadow: i < filled ? '0 0 6px rgba(249,115,22,0.6)' : 'none',
                }}
              />
            ))}
            <span className="text-[11px] text-white/30 ml-1">{filled}/6</span>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={savePending || filled === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold text-white transition-all disabled:opacity-40"
            style={{ background: '#f97316' }}
          >
            {savePending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {savePending ? 'Saving…' : 'Save Team'}
          </button>
        </div>
      </div>

      {/* Search bar */}
      <div className="rounded-sm border border-[#2d2d2d] p-4 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
        <div className="flex items-center gap-3 mb-3">
          <Shield size={14} className="text-orange-500 flex-shrink-0" />
          <span className="text-[11px] text-white/40 tracking-[0.2em] uppercase font-medium">
            {activeSlot !== null
              ? `Filling Slot ${String(activeSlot + 1).padStart(2, '0')} — Enter Pokémon name`
              : 'Select a slot below to begin'}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') searchPokemon(); }}
              disabled={activeSlot === null}
              placeholder={activeSlot !== null ? 'e.g. incineroar, flutter-mane, urshifu-rapid-strike…' : 'Select a slot first…'}
              className="w-full bg-black/30 border border-white/8 rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/40 disabled:opacity-40 transition-colors"
            />
          </div>
          <button
            onClick={searchPokemon}
            disabled={loading || !query.trim() || activeSlot === null}
            className="px-5 py-2.5 rounded-sm text-sm font-bold text-white transition-all flex items-center gap-2 disabled:opacity-40"
            style={{ background: '#f97316' }}
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
            {loading ? 'Loading…' : 'Add'}
          </button>
        </div>
        {fetchError && (
          <div className="mt-2 flex items-center gap-2 text-[12px] text-red-400">
            <AlertCircle size={12} />
            <span>{fetchError}</span>
          </div>
        )}
      </div>

      {/* Slots grid */}
      <div className="grid grid-cols-3 gap-4">
        {slots.map(slot =>
          slot.pokemon ? (
            <FilledSlot
              key={slot.id}
              slot={slot}
              onRemove={() => {
                setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, pokemon: null } : s));
                if (activeSlot === slot.id) setActiveSlot(null);
              }}
            />
          ) : (
            <EmptySlot
              key={slot.id}
              slotNum={slot.id}
              isActive={activeSlot === slot.id}
              onClick={() => setActiveSlot(slot.id)}
            />
          )
        )}
      </div>

      {/* Type coverage strip */}
      {filled > 0 && (
        <div className="rounded-sm border border-[#2d2d2d] p-4 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium mb-3">Team Type Coverage</p>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(slots.filter(s => s.pokemon).flatMap(s => s.pokemon!.types))).map(type => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
