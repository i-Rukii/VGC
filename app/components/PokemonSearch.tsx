'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, ChevronUp, ChevronDown, Filter } from 'lucide-react';
import type { PokemonData, StatKey } from '../types';
import { DEFAULT_EVS, DEFAULT_IVS, displayName, STAT_LABEL } from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TYPES = [
  'fire','water','grass','electric','ice','fighting','poison',
  'ground','flying','psychic','bug','rock','ghost','dragon',
  'dark','steel','normal','fairy',
];

const TYPE_COLORS: Record<string, string> = {
  fire:'#f97316',water:'#60a5fa',grass:'#4ade80',electric:'#facc15',
  ice:'#67e8f9',fighting:'#f87171',poison:'#c084fc',ground:'#d97706',
  flying:'#93c5fd',psychic:'#ec4899',bug:'#a3e635',rock:'#a8a29e',
  ghost:'#a78bfa',dragon:'#818cf8',dark:'#a1a1aa',steel:'#94a3b8',
  normal:'#9ca3af',fairy:'#f9a8d4',
};

const SORT_OPTIONS: { key: StatKey | 'total' | 'name'; label: string }[] = [
  { key: 'name',           label: 'Name' },
  { key: 'total',          label: 'BST' },
  { key: 'hp',             label: 'HP' },
  { key: 'attack',         label: 'Atk' },
  { key: 'defense',        label: 'Def' },
  { key: 'special-attack', label: 'SpA' },
  { key: 'special-defense',label: 'SpD' },
  { key: 'speed',          label: 'Spe' },
];

const VGC_FEATURED = [
  'incineroar','rillaboom','flutter-mane','urshifu-rapid-strike','calyrex-ice',
  'calyrex-shadow','amoonguss','landorus-therian','iron-hands','chien-pao',
  'tornadus','indeedee','farigiraf','arcanine','talonflame','pelipper',
  'porygon2','grimmsnarl','corviknight','dondozo','tatsugiri','ogerpon-wellspring',
  'flutter-mane','chi-yu','iron-bundle','sandy-shocks','roaring-moon',
];

const RESULTS_PER_PAGE = 24;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function bst(p: PokemonData) { return p.stats.reduce((s, x) => s + x.value, 0); }
function getStat(p: PokemonData, key: StatKey) { return p.stats.find(s => s.name === key)?.value ?? 0; }

function transformPokeAPI(raw: any): PokemonData {
  return {
    id: raw.id,
    name: raw.name,
    sprite: raw.sprites?.other?.['official-artwork']?.front_default ?? raw.sprites?.front_default ?? '',
    types: raw.types.map((t: any) => t.type.name),
    stats: raw.stats.map((s: any) => ({ name: s.stat.name as StatKey, value: s.base_stat })),
    abilities: raw.abilities.map((a: any) => a.ability.name),
    // defaults — user fills in the editor
    ability: raw.abilities[0]?.ability.name ?? '',
    nature: 'Jolly',
    item: '',
    moves: ['', '', '', ''],
    evs: { ...DEFAULT_EVS },
    ivs: { ...DEFAULT_IVS },
    teraType: raw.types[0]?.type.name ?? 'Normal',
  };
}

// ─── TypeBadge ────────────────────────────────────────────────────────────────

function TypeBadge({ type, small = false }: { type: string; small?: boolean }) {
  const c = TYPE_COLORS[type] ?? '#fff';
  return (
    <span
      className={`font-bold uppercase tracking-wider rounded-sm ${small ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5'}`}
      style={{ background: `${c}20`, color: c, border: `1px solid ${c}35` }}
    >
      {type}
    </span>
  );
}

// ─── PokemonCard ──────────────────────────────────────────────────────────────

function PokemonCard({
  pokemon, sortKey, onClick,
}: {
  pokemon: PokemonData;
  sortKey: StatKey | 'total' | 'name';
  onClick: () => void;
}) {
  const statVal = sortKey === 'total' ? bst(pokemon)
    : sortKey === 'name' ? null
    : getStat(pokemon, sortKey as StatKey);

  return (
    <button
      onClick={onClick}
      className="group rounded-sm border border-[#2d2d2d] hover:border-orange-500/40 transition-all duration-150 overflow-hidden text-left relative"
      style={{ background: '#1a1a1b' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,.6),transparent)' }}
      />
      {/* Sprite */}
      <div
        className="flex items-center justify-center p-3 pb-0"
        style={{ background: 'radial-gradient(circle at 50% 90%,rgba(249,115,22,.06) 0%,transparent 70%)' }}
      >
        {pokemon.sprite ? (
          <img
            src={pokemon.sprite}
            alt={pokemon.name}
            className="w-16 h-16 object-contain"
            style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 3px 8px rgba(0,0,0,.5))' }}
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center text-white/10 text-2xl">?</div>
        )}
      </div>
      {/* Info */}
      <div className="px-2.5 pb-2.5 pt-1">
        <p className="text-xs font-bold text-white/80 truncate capitalize mb-1.5">
          {displayName(pokemon.name)}
        </p>
        <div className="flex gap-1 flex-wrap mb-2">
          {pokemon.types.map(t => <TypeBadge key={t} type={t} small />)}
        </div>
        {statVal !== null && (
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/25 uppercase tracking-widest">
              {sortKey === 'total' ? 'BST' : STAT_LABEL[sortKey as StatKey]}
            </span>
            <span className="text-[11px] font-black text-orange-400">{statVal}</span>
          </div>
        )}
      </div>
    </button>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  onSelect: (pokemon: PokemonData) => void;
  onClose: () => void;
}

export default function PokemonSearch({ onSelect, onClose }: Props) {
  const [allNames, setAllNames] = useState<string[]>([]);
  const [typeNames, setTypeNames] = useState<Set<string> | null>(null); // null = no filter
  const [query, setQuery]         = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sortKey, setSortKey]     = useState<StatKey | 'total' | 'name'>('name');
  const [sortAsc, setSortAsc]     = useState(true);
  const [displayData, setDisplayData] = useState<PokemonData[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showTypes, setShowTypes] = useState(false);

  const cache   = useRef(new Map<string, PokemonData>());
  const searchId = useRef(0);

  // 1) Fetch full name list once
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=1302')
      .then(r => r.json())
      .then(d => setAllNames(d.results.map((x: any) => x.name)));
  }, []);

  // 2) Fetch type filter list when typeFilter changes
  useEffect(() => {
    if (!typeFilter) { setTypeNames(null); return; }
    fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`)
      .then(r => r.json())
      .then(d => {
        const names = new Set<string>(d.pokemon.map((p: any) => p.pokemon.name as string));
        setTypeNames(names);
      });
  }, [typeFilter]);

  // 3) Derive candidates from name list + type filter
  const getCandidates = useCallback((): string[] => {
    const q = query.trim().toLowerCase();
    let base: string[];

    if (!q && !typeFilter) {
      base = VGC_FEATURED;
    } else if (q) {
      base = allNames.filter(n => n.includes(q));
    } else {
      base = allNames;
    }

    if (typeNames) base = base.filter(n => typeNames.has(n));
    return base.slice(0, RESULTS_PER_PAGE);
  }, [query, allNames, typeNames, typeFilter]);

  // 4) Fetch details for candidates
  const fetchAndDisplay = useCallback(async (names: string[]) => {
    const id = ++searchId.current;
    setLoading(true);

    const missing = names.filter(n => !cache.current.has(n));
    if (missing.length) {
      const results = await Promise.allSettled(
        missing.map(n =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${n}`).then(r => r.json())
        )
      );
      results.forEach((res, i) => {
        if (res.status === 'fulfilled') {
          cache.current.set(missing[i], transformPokeAPI(res.value));
        }
      });
    }

    if (id !== searchId.current) return;

    const data = names
      .map(n => cache.current.get(n))
      .filter(Boolean) as PokemonData[];

    // Sort
    const sorted = [...data].sort((a, b) => {
      let diff = 0;
      if (sortKey === 'name') diff = a.name.localeCompare(b.name);
      else if (sortKey === 'total') diff = bst(a) - bst(b);
      else diff = getStat(a, sortKey) - getStat(b, sortKey);
      return sortAsc ? diff : -diff;
    });

    setDisplayData(sorted);
    setLoading(false);
  }, [sortKey, sortAsc]);

  // 5) Re-run whenever deps change (debounced)
  useEffect(() => {
    const candidates = getCandidates();
    const t = setTimeout(() => fetchAndDisplay(candidates), 200);
    return () => clearTimeout(t);
  }, [getCandidates, fetchAndDisplay]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0a' }}>
      {/* ── Header ── */}
      <div
        className="flex items-center gap-4 px-6 py-4 border-b border-[#2d2d2d] flex-shrink-0"
        style={{ background: '#0e0e0e' }}
      >
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search Pokémon by name…"
            className="w-full bg-black/40 border border-white/8 rounded-sm pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/40 transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Type filter toggle */}
        <button
          onClick={() => setShowTypes(v => !v)}
          className="flex items-center gap-2 px-3 py-2.5 rounded-sm text-[11px] font-bold transition-all"
          style={{
            background: typeFilter ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
            color: typeFilter ? '#f97316' : 'rgba(255,255,255,0.5)',
            border: `1px solid ${typeFilter ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}
        >
          <Filter size={13} />
          {typeFilter ? typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1) : 'Type'}
        </button>

        {/* Sort options */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-sm border border-white/6">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.key}
              onClick={() => toggleSort(opt.key)}
              className="flex items-center gap-0.5 px-2 py-1 rounded-sm text-[10px] font-bold transition-all"
              style={{
                background: sortKey === opt.key ? 'rgba(249,115,22,0.15)' : 'transparent',
                color: sortKey === opt.key ? '#f97316' : 'rgba(255,255,255,0.3)',
              }}
            >
              {opt.label}
              {sortKey === opt.key && (
                sortAsc ? <ChevronUp size={10} /> : <ChevronDown size={10} />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-sm flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Type filter pills ── */}
      {showTypes && (
        <div className="px-6 py-3 flex flex-wrap gap-1.5 border-b border-[#2d2d2d] flex-shrink-0" style={{ background: '#0e0e0e' }}>
          <button
            onClick={() => { setTypeFilter(null); setShowTypes(false); }}
            className="px-2.5 py-1 rounded-sm text-[10px] font-bold transition-all"
            style={{
              background: !typeFilter ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
              color: !typeFilter ? '#f97316' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${!typeFilter ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            All
          </button>
          {ALL_TYPES.map(t => {
            const c = TYPE_COLORS[t] ?? '#fff';
            const active = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setShowTypes(false); }}
                className="px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-all"
                style={{
                  background: active ? `${c}20` : 'rgba(255,255,255,0.03)',
                  color: active ? c : 'rgba(255,255,255,0.35)',
                  border: `1px solid ${active ? `${c}40` : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Results grid ── */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-white/30 tracking-widest uppercase">
            {typeFilter ? `${typeFilter} type` : query ? `Results for "${query}"` : 'Featured VGC Pokémon'}
            {' · '}{displayData.length} shown
          </p>
          {loading && <Loader2 size={13} className="text-orange-500 animate-spin" />}
        </div>

        {!loading && displayData.length === 0 && (
          <div className="text-center py-20 text-white/20">
            <p className="text-sm">No Pokémon found</p>
            <p className="text-[11px] mt-1">Try a different name or type filter</p>
          </div>
        )}

        <div className="grid grid-cols-6 gap-3">
          {displayData.map(p => (
            <PokemonCard
              key={p.name}
              pokemon={p}
              sortKey={sortKey}
              onClick={() => onSelect(p)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
