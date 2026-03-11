'use client';

import { useState, useTransition, useEffect } from 'react';
import {
  Save, Copy, CheckCircle, Loader2, Pencil, X, Plus,
  BookOpen, ChevronRight, Clock, Zap, AlertCircle,
} from 'lucide-react';
import PokemonSearch from './PokemonSearch';
import PokemonEditor from './PokemonEditor';
import { saveTeamAction } from '../actions';
import { supabase } from '../../lib/supabase';
import type { TeamSlot, PokemonData, DbTeam } from '../types';
import {
  displayName, toShowdownPaste, STAT_LABEL, DEFAULT_EVS, DEFAULT_IVS, totalEVs,
} from '../types';

// ─── Type colours ─────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  fire:'#f97316',water:'#60a5fa',grass:'#4ade80',electric:'#facc15',
  ice:'#67e8f9',fighting:'#f87171',poison:'#c084fc',ground:'#d97706',
  flying:'#93c5fd',psychic:'#ec4899',bug:'#a3e635',rock:'#a8a29e',
  ghost:'#a78bfa',dragon:'#818cf8',dark:'#a1a1aa',steel:'#94a3b8',
  normal:'#9ca3af',fairy:'#f9a8d4',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const c = TYPE_COLORS[type] ?? '#fff';
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
      style={{ background: `${c}18`, color: c, border: `1px solid ${c}25` }}
    >
      {type}
    </span>
  );
}

// ─── Filled slot card ─────────────────────────────────────────────────────────

function FilledSlot({
  slot, onEdit, onClear,
}: {
  slot: TeamSlot; onEdit: () => void; onClear: () => void;
}) {
  const p = slot.pokemon!;
  const evTotal = totalEVs(p.evs);
  const movesFilled = p.moves.filter(Boolean).length;

  return (
    <div
      className="rounded-sm border border-[#2d2d2d] hover:border-orange-500/25 transition-all overflow-hidden group relative"
      style={{ background: '#1a1a1b' }}
    >
      {/* Orange top line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,.5),transparent)' }}
      />

      {/* Sprite + actions row */}
      <div
        className="flex items-center justify-between px-3 pt-3"
        style={{ background: 'radial-gradient(circle at 20% 80%,rgba(249,115,22,.04) 0%,transparent 60%)' }}
      >
        <img
          src={p.sprite} alt={p.name}
          className="w-14 h-14 object-contain flex-shrink-0"
          style={{ imageRendering: 'pixelated', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,.5))' }}
        />
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-white/40 hover:text-orange-400 hover:bg-orange-500/10 transition-all"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onClear}
            className="w-7 h-7 rounded-sm flex items-center justify-center text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pb-3 pt-1">
        <p className="text-xs font-black text-white capitalize mb-1.5 truncate">
          {displayName(p.name)}
        </p>

        {/* Types */}
        <div className="flex gap-1 flex-wrap mb-2">
          {p.types.map(t => <TypeBadge key={t} type={t} />)}
          {p.teraType && (
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-sm"
              style={{
                background: `${TYPE_COLORS[p.teraType.toLowerCase()] ?? '#fff'}10`,
                color: TYPE_COLORS[p.teraType.toLowerCase()] ?? '#fff',
                border: `1px dashed ${TYPE_COLORS[p.teraType.toLowerCase()] ?? '#fff'}30`,
              }}
            >
              ◈ {p.teraType}
            </span>
          )}
        </div>

        {/* Item + ability */}
        <div className="space-y-0.5 mb-2">
          {p.item && (
            <p className="text-[10px] text-white/40 truncate">
              <span className="text-white/20">@ </span>{p.item}
            </p>
          )}
          {p.ability && (
            <p className="text-[10px] text-white/30 truncate capitalize">{displayName(p.ability)}</p>
          )}
        </div>

        {/* Moves */}
        <div className="space-y-0.5 mb-2">
          {[0, 1, 2, 3].map(i => (
            <p key={i} className="text-[10px] truncate" style={{ color: p.moves[i] ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.12)' }}>
              {p.moves[i] ? `· ${displayName(p.moves[i])}` : '· —'}
            </p>
          ))}
        </div>

        {/* EV bar */}
        <div>
          <div className="flex justify-between text-[9px] mb-1">
            <span className="text-white/20">EVs</span>
            <span style={{ color: evTotal > 0 ? '#f97316' : 'rgba(255,255,255,0.15)' }}>{evTotal}/510</span>
          </div>
          <div className="h-1 rounded-sm bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-sm transition-all"
              style={{ width: `${(evTotal / 510) * 100}%`, background: '#f97316', boxShadow: '0 0 4px rgba(249,115,22,.4)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty slot card ──────────────────────────────────────────────────────────

function EmptySlot({ slotNum, isActive, onClick }: { slotNum: number; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border transition-all duration-150 flex flex-col items-center justify-center gap-3 min-h-[200px] group"
      style={{
        background: isActive ? 'rgba(249,115,22,0.04)' : '#1a1a1b',
        borderColor: isActive ? 'rgba(249,115,22,0.4)' : '#2d2d2d',
        borderStyle: isActive ? 'solid' : 'dashed',
      }}
    >
      <div
        className="w-10 h-10 rounded-sm flex items-center justify-center transition-all"
        style={{
          background: isActive ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.03)',
          border: `1px solid ${isActive ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.06)'}`,
        }}
      >
        {isActive
          ? <Zap size={16} style={{ color: '#f97316' }} />
          : <Plus size={16} style={{ color: 'rgba(255,255,255,0.15)' }} />
        }
      </div>
      <p
        className="text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ color: isActive ? 'rgba(249,115,22,0.7)' : 'rgba(255,255,255,0.2)' }}
      >
        {isActive ? 'Search below' : `Slot ${String(slotNum + 1).padStart(2, '0')}`}
      </p>
    </button>
  );
}

// ─── Saved teams sidebar ──────────────────────────────────────────────────────

function SavedTeamsSidebar({
  onLoad, currentTeamName,
}: {
  onLoad: (team: DbTeam) => void; currentTeamName: string;
}) {
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('teams')
      .select('*')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setTeams((data as DbTeam[]) ?? []);
        setLoading(false);
      });
  }, []);

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  return (
    <div className="w-60 flex-shrink-0 border-l border-[#2d2d2d] flex flex-col" style={{ background: '#0e0e0e' }}>
      <div className="px-4 py-3 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2">
          <BookOpen size={13} className="text-orange-500" />
          <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold">Saved Teams</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-white/20">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">Loading…</span>
          </div>
        )}

        {!loading && teams.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/20 text-xs">No saved teams yet</p>
            <p className="text-white/15 text-[10px] mt-1">Build and save a team first</p>
          </div>
        )}

        {teams.map(team => {
          const filled = (team.pokemon_list ?? []).filter(Boolean);
          const isCurrent = team.name === currentTeamName;
          return (
            <button
              key={team.id}
              onClick={() => onLoad(team)}
              className="w-full text-left px-4 py-3 hover:bg-white/3 transition-colors group border-b border-white/4 last:border-0"
              style={{ background: isCurrent ? 'rgba(249,115,22,0.05)' : undefined }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-xs font-bold truncate"
                  style={{ color: isCurrent ? '#f97316' : 'rgba(255,255,255,0.7)' }}
                >
                  {team.name}
                </span>
                <ChevronRight size={12} className="text-white/15 group-hover:text-orange-400 transition-colors flex-shrink-0" />
              </div>

              {/* Mini sprites */}
              <div className="flex gap-1 mb-1.5">
                {(team.pokemon_list ?? []).map((p, i) =>
                  p ? (
                    <img
                      key={i}
                      src={p.sprite}
                      alt={p.name}
                      className="w-7 h-7 object-contain"
                      style={{ imageRendering: 'pixelated', filter: 'brightness(0.9)' }}
                    />
                  ) : (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-sm border border-dashed border-white/10 flex-shrink-0"
                    />
                  )
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock size={9} className="text-white/20" />
                <span className="text-[9px] text-white/20">{timeAgo(team.updated_at)}</span>
                <span className="text-[9px] text-white/15 ml-auto">{filled.length}/6</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main TeamBuilder ─────────────────────────────────────────────────────────

const INITIAL_SLOTS: TeamSlot[] = Array.from({ length: 6 }, (_, i) => ({ id: i, pokemon: null }));

interface Props {
  initialTeam: DbTeam | null;
}

export default function TeamBuilder({ initialTeam }: Props) {
  const [slots, setSlots] = useState<TeamSlot[]>(() => {
    if (initialTeam?.pokemon_list) {
      return initialTeam.pokemon_list.map((p, i) => ({ id: i, pokemon: p }));
    }
    return INITIAL_SLOTS;
  });

  const [teamName, setTeamName]   = useState(initialTeam?.name ?? 'My Team');
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [editingSlot, setEditingSlot] = useState<number | null>(null);
  const [showSaved, setShowSaved] = useState(true);
  const [copied, setCopied]       = useState(false);
  const [savePending, startSave]  = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  const filled = slots.filter(s => s.pokemon).length;

  // ── Slot interactions ───────────────────────────────────────────────────────

  const handleSlotClick = (slotId: number) => {
    if (slots[slotId].pokemon) {
      setEditingSlot(slotId);
    } else {
      setActiveSlot(slotId);
      setShowSearch(true);
    }
  };

  const handleSearchSelect = (pokemon: PokemonData) => {
    if (activeSlot === null) return;
    setSlots(prev => prev.map(s => s.id === activeSlot ? { ...s, pokemon } : s));
    setShowSearch(false);
    setActiveSlot(null);
    // Auto-open editor to fill in competitive details
    setEditingSlot(activeSlot);
  };

  const handleEditorSave = (updated: PokemonData) => {
    if (editingSlot === null) return;
    setSlots(prev => prev.map(s => s.id === editingSlot ? { ...s, pokemon: updated } : s));
  };

  const clearSlot = (slotId: number) => {
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, pokemon: null } : s));
    if (editingSlot === slotId) setEditingSlot(null);
  };

  // ── Load saved team ─────────────────────────────────────────────────────────

  const loadTeam = (team: DbTeam) => {
    setSlots((team.pokemon_list ?? []).map((p, i) => ({ id: i, pokemon: p })));
    setTeamName(team.name);
    setEditingSlot(null);
  };

  // ── Save to Supabase ────────────────────────────────────────────────────────

  const handleSave = () => {
    setSaveError(null);
    startSave(async () => {
      try {
        await saveTeamAction(teamName, slots.map(s => s.pokemon));
      } catch (e: any) {
        setSaveError(e.message ?? 'Save failed');
      }
    });
  };

  // ── Showdown export ─────────────────────────────────────────────────────────

  const handleCopyShowdown = () => {
    const paste = toShowdownPaste(slots);
    navigator.clipboard.writeText(paste).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // ── Editing pokemon ─────────────────────────────────────────────────────────

  const editingPokemon = editingSlot !== null ? slots[editingSlot]?.pokemon : null;

  return (
    <div className="flex gap-0 -m-8 min-h-[calc(100vh-3rem)]">
      {/* ── Main area ──────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-8 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Team <span className="text-orange-500">Builder</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <input
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
                className="bg-transparent text-sm text-white/40 hover:text-white/70 focus:text-white outline-none border-b border-transparent hover:border-white/20 focus:border-orange-500/40 transition-all w-40 pb-0.5"
              />
              <span className="text-white/20 text-[10px]">·</span>
              <span className="text-white/25 text-[10px] tracking-widest">{filled}/6 slots</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Slot indicator pips */}
            <div className="flex items-center gap-1.5 mr-2">
              {slots.map((s, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: s.pokemon ? '#f97316' : 'rgba(255,255,255,0.08)',
                    boxShadow: s.pokemon ? '0 0 5px rgba(249,115,22,.6)' : 'none',
                  }}
                />
              ))}
            </div>

            {/* Copy Showdown */}
            <button
              onClick={handleCopyShowdown}
              disabled={filled === 0}
              className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-bold transition-all disabled:opacity-30 border"
              style={{
                background: copied ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                color: copied ? '#4ade80' : 'rgba(255,255,255,0.5)',
                borderColor: copied ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              {copied ? <CheckCircle size={13} /> : <Copy size={13} />}
              {copied ? 'Copied!' : 'Copy Showdown'}
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={savePending || filled === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold text-white transition-all disabled:opacity-40"
              style={{ background: '#f97316' }}
            >
              {savePending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {savePending ? 'Saving…' : 'Save Team'}
            </button>

            {/* Saved teams toggle */}
            <button
              onClick={() => setShowSaved(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-sm text-xs font-bold transition-all border"
              style={{
                background: showSaved ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.04)',
                color: showSaved ? '#f97316' : 'rgba(255,255,255,0.4)',
                borderColor: showSaved ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.1)',
              }}
            >
              <BookOpen size={13} />
              Teams
            </button>
          </div>
        </div>

        {saveError && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-sm border border-red-500/20 text-red-400 text-xs"
            style={{ background: 'rgba(248,113,113,0.06)' }}>
            <AlertCircle size={13} />
            {saveError}
          </div>
        )}

        {/* ── Team grid ── */}
        <div className="grid grid-cols-3 gap-4 flex-1">
          {slots.map(slot =>
            slot.pokemon ? (
              <FilledSlot
                key={slot.id}
                slot={slot}
                onEdit={() => handleSlotClick(slot.id)}
                onClear={() => clearSlot(slot.id)}
              />
            ) : (
              <EmptySlot
                key={slot.id}
                slotNum={slot.id}
                isActive={activeSlot === slot.id}
                onClick={() => handleSlotClick(slot.id)}
              />
            )
          )}
        </div>

        {/* ── Type coverage strip ── */}
        {filled > 0 && (
          <div
            className="mt-4 rounded-sm border border-[#2d2d2d] px-4 py-3"
            style={{ background: '#1a1a1b' }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-white/25 tracking-widest uppercase font-medium">Team Type Coverage</p>
              <p className="text-[10px] text-white/20">{filled} Pokémon</p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Array.from(
                new Set(slots.filter(s => s.pokemon).flatMap(s => s.pokemon!.types))
              ).map(type => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Saved teams sidebar ─────────────────────────────────────────────── */}
      {showSaved && (
        <SavedTeamsSidebar onLoad={loadTeam} currentTeamName={teamName} />
      )}

      {/* ── Search overlay ──────────────────────────────────────────────────── */}
      {showSearch && (
        <PokemonSearch
          onSelect={handleSearchSelect}
          onClose={() => { setShowSearch(false); setActiveSlot(null); }}
        />
      )}

      {/* ── Editor slide-over ───────────────────────────────────────────────── */}
      {editingPokemon && editingSlot !== null && (
        <PokemonEditor
          pokemon={editingPokemon}
          onSave={handleEditorSave}
          onClose={() => setEditingSlot(null)}
        />
      )}
    </div>
  );
}
