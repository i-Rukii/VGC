'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, ChevronDown, CheckCircle } from 'lucide-react';
import type { PokemonData, StatKey } from '../types';
import {
  STAT_KEYS, STAT_LABEL, STAT_FULL, NATURES, NATURE_NAMES,
  TERA_TYPES, VGC_ITEMS, DEFAULT_EVS, DEFAULT_IVS,
  calcStat, setEV, totalEVs, displayName,
} from '../types';

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  fire:'#f97316',water:'#60a5fa',grass:'#4ade80',electric:'#facc15',
  ice:'#67e8f9',fighting:'#f87171',poison:'#c084fc',ground:'#d97706',
  flying:'#93c5fd',psychic:'#ec4899',bug:'#a3e635',rock:'#a8a29e',
  ghost:'#a78bfa',dragon:'#818cf8',dark:'#a1a1aa',steel:'#94a3b8',
  normal:'#9ca3af',fairy:'#f9a8d4',stellar:'#ffffff',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Combobox({
  value, options, onChange, placeholder, formatOption,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
  formatOption?: (v: string) => string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const fmt = formatOption ?? displayName;
  const filtered = q
    ? options.filter(o => o.toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(v => !v); setQ(''); }}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-sm border border-white/8 text-sm text-left transition-colors hover:border-orange-500/30"
        style={{ background: 'rgba(0,0,0,0.3)' }}
      >
        <span className={value ? 'text-white/80' : 'text-white/25'}>
          {value ? fmt(value) : (placeholder ?? 'Select…')}
        </span>
        <ChevronDown size={13} className="text-white/25 flex-shrink-0" />
      </button>

      {open && (
        <div
          className="absolute top-full mt-1 left-0 right-0 z-50 rounded-sm border border-[#2d2d2d] overflow-hidden shadow-2xl"
          style={{ background: '#111' }}
        >
          <div className="p-1.5 border-b border-white/5">
            <input
              autoFocus
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full bg-black/40 rounded-sm px-2.5 py-1.5 text-xs text-white placeholder-white/20 outline-none"
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.slice(0, 80).map(opt => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); setQ(''); }}
                className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-orange-500/10 hover:text-white transition-colors"
                style={{ background: opt === value ? 'rgba(249,115,22,0.08)' : undefined }}
              >
                {fmt(opt)}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-white/25 text-xs py-3">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EV Slider row ────────────────────────────────────────────────────────────

function EVRow({
  stat, base, ev, iv, nature, evTotal, onChange, onIVChange,
}: {
  stat: StatKey; base: number; ev: number; iv: number;
  nature: string; evTotal: number; onChange: (v: number) => void; onIVChange: (v: number) => void;
}) {
  const natData = NATURES[nature as keyof typeof NATURES];
  const isPlus  = natData?.plus  === stat;
  const isMinus = natData?.minus === stat;
  const natColor = isPlus ? '#4ade80' : isMinus ? '#f87171' : 'rgba(255,255,255,0.2)';
  const computed = calcStat(stat, base, iv, ev, nature);
  const maxEV    = Math.min(252, 510 - evTotal + ev);

  // Colour the computed stat relative to a rough scale
  const statColor = computed >= 150 ? '#4ade80'
    : computed >= 100 ? '#facc15'
    : computed >= 60  ? '#f97316'
    : '#f87171';

  return (
    <div className="grid grid-cols-[5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 items-center py-1.5 border-b border-white/4 last:border-0">
      {/* Stat label + nature indicator */}
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] font-bold text-white/50 tracking-wider uppercase w-8 flex-shrink-0">
          {STAT_LABEL[stat]}
        </span>
        {(isPlus || isMinus) && (
          <span className="text-[10px] font-black" style={{ color: natColor }}>
            {isPlus ? '↑' : '↓'}
          </span>
        )}
      </div>

      {/* EV slider */}
      <div className="relative">
        <input
          type="range" min={0} max={maxEV} value={ev}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-sm appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 ${(ev / 252) * 100}%, rgba(255,255,255,0.06) ${(ev / 252) * 100}%)`,
          }}
        />
      </div>

      {/* EV number */}
      <input
        type="number" min={0} max={maxEV} value={ev}
        onChange={e => onChange(Number(e.target.value))}
        className="text-center text-xs text-white/70 bg-black/30 border border-white/8 rounded-sm px-1 py-1 outline-none focus:border-orange-500/30 w-full"
      />

      {/* EV quick-fill buttons */}
      <button
        onClick={() => onChange(0)}
        className="text-[9px] text-white/20 hover:text-white/60 transition-colors font-bold"
      >0</button>
      <button
        onClick={() => onChange(Math.min(252, maxEV))}
        className="text-[9px] text-white/20 hover:text-orange-400 transition-colors font-bold"
      >252</button>

      {/* Computed stat */}
      <span className="text-xs font-black text-right" style={{ color: statColor }}>
        {computed}
      </span>
    </div>
  );
}

// ─── Move slot ────────────────────────────────────────────────────────────────

function MoveSlot({
  index, move, learnset, onChange,
}: {
  index: number; move: string; learnset: string[]; onChange: (m: string) => void;
}) {
  return (
    <div>
      <label className="block text-[10px] text-white/30 tracking-widest uppercase mb-1.5 font-medium">
        Move {index + 1}
      </label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Combobox
            value={move}
            options={learnset}
            onChange={onChange}
            placeholder="— No Move —"
          />
        </div>
        {move && (
          <button
            onClick={() => onChange('')}
            className="w-9 flex items-center justify-center rounded-sm border border-white/8 text-white/25 hover:text-red-400 hover:border-red-400/30 transition-colors"
            style={{ background: 'rgba(0,0,0,0.3)' }}
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  pokemon: PokemonData;
  onSave: (updated: PokemonData) => void;
  onClose: () => void;
}

export default function PokemonEditor({ pokemon, onSave, onClose }: Props) {
  const [local, setLocal]         = useState<PokemonData>(pokemon);
  const [tab, setTab]             = useState<'set' | 'moves' | 'stats'>('set');
  const [learnset, setLearnset]   = useState<string[]>([]);
  const [loadingMoves, setLoadingMoves] = useState(true);
  const [saved, setSaved]         = useState(false);
  const [itemQuery, setItemQuery] = useState('');

  // Fetch learnset on open
  useEffect(() => {
    setLoadingMoves(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      .then(r => r.json())
      .then(data => {
        const moves: string[] = data.moves.map((m: any) => m.move.name);
        setLearnset(moves.sort());
        setLoadingMoves(false);
      });
  }, [pokemon.name]);

  const evTotal = totalEVs(local.evs);
  const evRemaining = 510 - evTotal;

  const updateEV = (stat: StatKey, v: number) =>
    setLocal(p => ({ ...p, evs: setEV(stat, v, p.evs) }));
  const updateIV = (stat: StatKey, v: number) =>
    setLocal(p => ({ ...p, ivs: { ...p.ivs, [stat]: Math.min(31, Math.max(0, v)) } }));
  const updateMove = (i: number, m: string) =>
    setLocal(p => {
      const moves = [...p.moves] as [string, string, string, string];
      moves[i] = m;
      return { ...p, moves };
    });

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const filteredItems = itemQuery
    ? VGC_ITEMS.filter(i => i.toLowerCase().includes(itemQuery.toLowerCase()))
    : VGC_ITEMS;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="w-[480px] flex-shrink-0 flex flex-col border-l border-[#2d2d2d]"
        style={{ background: '#0e0e0e' }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-4 px-5 py-4 border-b border-[#2d2d2d] flex-shrink-0"
          style={{ background: '#0a0a0a' }}
        >
          <img
            src={local.sprite}
            alt={local.name}
            className="w-12 h-12 object-contain flex-shrink-0"
            style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.6))' }}
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-black text-white capitalize tracking-wide">{displayName(local.name)}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              {local.types.map(t => {
                const c = TYPE_COLORS[t] ?? '#fff';
                return (
                  <span
                    key={t}
                    className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{ background: `${c}20`, color: c }}
                  >
                    {t}
                  </span>
                );
              })}
              {local.teraType && (
                <span
                  className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm ml-1"
                  style={{
                    background: `${TYPE_COLORS[local.teraType.toLowerCase()] ?? '#fff'}15`,
                    color: TYPE_COLORS[local.teraType.toLowerCase()] ?? '#fff',
                    border: `1px solid ${TYPE_COLORS[local.teraType.toLowerCase()] ?? '#fff'}30`,
                  }}
                >
                  ◈ {local.teraType}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-all flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#2d2d2d] flex-shrink-0" style={{ background: '#0a0a0a' }}>
          {(['set', 'moves', 'stats'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all"
              style={{
                color: tab === t ? '#f97316' : 'rgba(255,255,255,0.3)',
                borderBottom: tab === t ? '2px solid #f97316' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── SET TAB ── */}
          {tab === 'set' && (
            <div className="p-5 space-y-5">
              {/* Ability */}
              <div>
                <label className="block text-[10px] text-white/30 tracking-widest uppercase mb-1.5 font-medium">
                  Ability
                </label>
                <Combobox
                  value={local.ability}
                  options={local.abilities}
                  onChange={v => setLocal(p => ({ ...p, ability: v }))}
                  placeholder="Select ability…"
                />
              </div>

              {/* Nature */}
              <div>
                <label className="block text-[10px] text-white/30 tracking-widest uppercase mb-1.5 font-medium">
                  Nature
                </label>
                <Combobox
                  value={local.nature}
                  options={NATURE_NAMES}
                  onChange={v => setLocal(p => ({ ...p, nature: v }))}
                  formatOption={(n) => {
                    const nat = NATURES[n as keyof typeof NATURES];
                    if (!nat?.plus) return n;
                    return `${n} (+${STAT_LABEL[nat.plus as StatKey]} / -${STAT_LABEL[nat.minus as StatKey]})`;
                  }}
                />
              </div>

              {/* Held item */}
              <div>
                <label className="block text-[10px] text-white/30 tracking-widest uppercase mb-1.5 font-medium">
                  Held Item
                </label>
                <div className="space-y-1.5">
                  <div className="relative">
                    <input
                      value={itemQuery || local.item}
                      onChange={e => {
                        setItemQuery(e.target.value);
                        if (e.target.value === '') setLocal(p => ({ ...p, item: '' }));
                      }}
                      placeholder="Search or type an item…"
                      className="w-full bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-orange-500/40 transition-colors"
                    />
                  </div>
                  {itemQuery && (
                    <div
                      className="rounded-sm border border-[#2d2d2d] max-h-36 overflow-y-auto"
                      style={{ background: '#111' }}
                    >
                      {filteredItems.map(item => (
                        <button
                          key={item}
                          onClick={() => {
                            setLocal(p => ({ ...p, item }));
                            setItemQuery('');
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-white/70 hover:bg-orange-500/10 hover:text-white transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                  {local.item && !itemQuery && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-sm border border-orange-500/20"
                      style={{ background: 'rgba(249,115,22,0.06)' }}>
                      <span className="text-xs text-orange-300 font-medium">{local.item}</span>
                      <button onClick={() => setLocal(p => ({ ...p, item: '' }))}
                        className="text-white/25 hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tera Type */}
              <div>
                <label className="block text-[10px] text-white/30 tracking-widest uppercase mb-2 font-medium">
                  Tera Type
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {TERA_TYPES.map(tt => {
                    const c = TYPE_COLORS[tt.toLowerCase()] ?? '#fff';
                    const active = local.teraType === tt;
                    return (
                      <button
                        key={tt}
                        onClick={() => setLocal(p => ({ ...p, teraType: tt }))}
                        className="text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm transition-all"
                        style={{
                          background: active ? `${c}25` : 'rgba(255,255,255,0.03)',
                          color: active ? c : 'rgba(255,255,255,0.3)',
                          border: `1px solid ${active ? `${c}50` : 'rgba(255,255,255,0.06)'}`,
                          boxShadow: active ? `0 0 8px ${c}30` : 'none',
                        }}
                      >
                        {tt}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── MOVES TAB ── */}
          {tab === 'moves' && (
            <div className="p-5 space-y-4">
              {loadingMoves ? (
                <div className="flex items-center justify-center gap-2 py-12 text-white/30">
                  <Loader2 size={16} className="animate-spin text-orange-500" />
                  <span className="text-sm">Loading learnset…</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] text-white/30 tracking-widest uppercase">
                      {learnset.length} learnable moves
                    </p>
                    <button
                      onClick={() => setLocal(p => ({ ...p, moves: ['', '', '', ''] }))}
                      className="text-[10px] text-white/25 hover:text-red-400 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                  {([0, 1, 2, 3] as const).map(i => (
                    <MoveSlot
                      key={i}
                      index={i}
                      move={local.moves[i]}
                      learnset={learnset}
                      onChange={m => updateMove(i, m)}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {/* ── STATS TAB ── */}
          {tab === 'stats' && (
            <div className="p-5">
              {/* EV remaining bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5 text-[10px]">
                  <span className="text-white/30 uppercase tracking-widest font-medium">EV Budget</span>
                  <span
                    className="font-black"
                    style={{ color: evRemaining < 4 ? '#f87171' : evRemaining < 50 ? '#facc15' : '#4ade80' }}
                  >
                    {evRemaining} / 510 remaining
                  </span>
                </div>
                <div className="h-2 rounded-sm overflow-hidden bg-white/5">
                  <div
                    className="h-full rounded-sm transition-all duration-200"
                    style={{
                      width: `${(evTotal / 510) * 100}%`,
                      background: evRemaining < 4 ? '#f87171' : 'linear-gradient(to right, #f97316, #facc15)',
                      boxShadow: '0 0 6px rgba(249,115,22,0.4)',
                    }}
                  />
                </div>
                {/* EV preset shortcuts */}
                <div className="flex gap-2 mt-2">
                  {[
                    { label: 'Sp. Sweeper', evs: { ...DEFAULT_EVS, 'special-attack': 252, speed: 252, hp: 4 } },
                    { label: 'Ph. Sweeper', evs: { ...DEFAULT_EVS, attack: 252, speed: 252, hp: 4 } },
                    { label: 'Bulky', evs: { ...DEFAULT_EVS, hp: 252, defense: 128, 'special-defense': 128 } },
                    { label: 'Clear', evs: { ...DEFAULT_EVS } },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => setLocal(p => ({ ...p, evs: preset.evs }))}
                      className="text-[9px] px-2 py-1 rounded-sm font-bold transition-all"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        color: 'rgba(255,255,255,0.4)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column headers */}
              <div className="grid grid-cols-[5rem_1fr_3.5rem_2.5rem_2.5rem_3rem] gap-2 mb-2 pb-2 border-b border-white/5">
                <span className="text-[9px] text-white/20 uppercase tracking-widest">Stat</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest text-center">EVs</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest text-center">EV</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest text-center">0</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest text-center">252</span>
                <span className="text-[9px] text-white/20 uppercase tracking-widest text-right">Final</span>
              </div>

              {STAT_KEYS.map(stat => {
                const base = local.stats.find(s => s.name === stat)?.value ?? 0;
                return (
                  <EVRow
                    key={stat}
                    stat={stat}
                    base={base}
                    ev={local.evs[stat]}
                    iv={local.ivs[stat]}
                    nature={local.nature}
                    evTotal={evTotal}
                    onChange={v => updateEV(stat, v)}
                    onIVChange={v => updateIV(stat, v)}
                  />
                );
              })}

              {/* IV section */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] text-white/30 tracking-widest uppercase font-medium">Individual Values (IVs)</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLocal(p => ({ ...p, ivs: { ...DEFAULT_IVS } }))}
                      className="text-[9px] px-2 py-1 rounded-sm font-bold text-white/30 hover:text-white/70 border border-white/8 transition-colors"
                    >
                      31 all
                    </button>
                    <button
                      onClick={() => setLocal(p => ({ ...p, ivs: { ...DEFAULT_IVS, attack: 0, 'special-attack': 0, speed: 0 } }))}
                      className="text-[9px] px-2 py-1 rounded-sm font-bold text-white/30 hover:text-white/70 border border-white/8 transition-colors"
                    >
                      Trick Room
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {STAT_KEYS.map(stat => (
                    <div key={stat}>
                      <label className="block text-[9px] text-white/25 tracking-wider uppercase mb-1">{STAT_LABEL[stat]}</label>
                      <input
                        type="number" min={0} max={31}
                        value={local.ivs[stat]}
                        onChange={e => updateIV(stat, Number(e.target.value))}
                        className="w-full text-center text-xs text-white/70 bg-black/30 border border-white/8 rounded-sm px-2 py-1.5 outline-none focus:border-orange-500/30 transition-colors"
                        style={{ borderColor: local.ivs[stat] < 31 ? 'rgba(250,204,21,0.3)' : undefined }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Base stats reference */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] text-white/20 uppercase tracking-widest mb-2">Base Stats</p>
                {STAT_KEYS.map(stat => {
                  const base = local.stats.find(s => s.name === stat)?.value ?? 0;
                  const pct = (base / 255) * 100;
                  const c = base >= 120 ? '#4ade80' : base >= 90 ? '#f97316' : base >= 60 ? '#facc15' : '#f87171';
                  return (
                    <div key={stat} className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-white/30 w-7 uppercase">{STAT_LABEL[stat]}</span>
                      <div className="flex-1 h-1 rounded-sm bg-white/5 overflow-hidden">
                        <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: c }} />
                      </div>
                      <span className="text-[10px] font-bold w-6 text-right" style={{ color: c }}>{base}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-t border-[#2d2d2d] flex-shrink-0" style={{ background: '#0a0a0a' }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-sm text-sm font-bold text-white/40 hover:text-white/70 border border-white/8 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-sm text-sm font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{ background: saved ? '#4ade80' : '#f97316', color: saved ? '#000' : '#fff' }}
          >
            {saved ? <><CheckCircle size={15} /> Saved</> : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
