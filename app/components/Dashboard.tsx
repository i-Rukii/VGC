'use client';

import { useState, useTransition, useMemo } from 'react';
import {
  TrendingUp, Swords, Users, Star, Plus, X, ArrowUpRight,
  Tag, CheckCircle, AlertCircle, Loader2, PlusCircle, ChevronDown,
} from 'lucide-react';
import { logMatchAction, addNoteAction, deleteNoteAction } from '../actions';
import type { DbMatch, DbNote } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, accent = false,
}: {
  label: string; value: string; sub: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div
      className="rounded-sm p-5 border backdrop-blur-md relative overflow-hidden"
      style={{
        background: accent ? 'rgba(249,115,22,0.06)' : '#1a1a1b',
        borderColor: accent ? 'rgba(249,115,22,0.25)' : '#2d2d2d',
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }}
        />
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium mb-2">{label}</p>
          <p className="text-3xl font-black tracking-tight" style={{ color: accent ? '#f97316' : 'white' }}>
            {value}
          </p>
          <p className="text-[11px] text-white/35 mt-1">{sub}</p>
        </div>
        <div
          className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ background: accent ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)' }}
        >
          <Icon size={18} style={{ color: accent ? '#f97316' : 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>
    </div>
  );
}

function BarChart({ matches }: { matches: DbMatch[] }) {
  const monthly = useMemo(() => {
    const map: Record<string, { wins: number; losses: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // seed last 7 months
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      map[months[d.getMonth()]] = { wins: 0, losses: 0 };
    }

    matches.forEach(m => {
      const label = months[new Date(m.created_at).getMonth()];
      if (map[label]) {
        if (m.result === 'W') map[label].wins++;
        else map[label].losses++;
      }
    });

    return Object.entries(map).map(([label, v]) => ({ label, ...v }));
  }, [matches]);

  const maxTotal = Math.max(...monthly.map(d => d.wins + d.losses), 1);

  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {monthly.map((data, i) => {
        const winH = (data.wins / maxTotal) * 100;
        const lossH = (data.losses / maxTotal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '120px' }}>
              <div
                className="w-full rounded-sm transition-all duration-300 group-hover:brightness-125"
                style={{ height: `${lossH}%`, background: 'rgba(239,68,68,0.4)', minHeight: lossH > 0 ? '3px' : '0' }}
              />
              <div
                className="w-full rounded-sm transition-all duration-300 group-hover:brightness-125"
                style={{ height: `${winH}%`, background: '#f97316', minHeight: winH > 0 ? '3px' : '0', boxShadow: '0 0 8px rgba(249,115,22,0.3)' }}
              />
            </div>
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors">{data.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Log Match Modal ──────────────────────────────────────────────────────────

interface LogMatchFormProps {
  onSubmit: (data: { opponent: string; result: 'W' | 'L'; score: string; tournament: string }) => void;
  onCancel: () => void;
  isPending: boolean;
}

function LogMatchForm({ onSubmit, onCancel, isPending }: LogMatchFormProps) {
  const [opponent, setOpponent] = useState('');
  const [result, setResult] = useState<'W' | 'L'>('W');
  const [score, setScore] = useState('');
  const [tournament, setTournament] = useState('');

  const valid = opponent.trim() && score.trim() && tournament.trim();

  return (
    <div
      className="rounded-sm border border-orange-500/20 p-4 space-y-3"
      style={{ background: 'rgba(249,115,22,0.04)' }}
    >
      <p className="text-[10px] text-orange-400 tracking-[0.2em] uppercase font-bold">Log New Match</p>

      <div className="grid grid-cols-2 gap-2">
        <input
          value={opponent}
          onChange={e => setOpponent(e.target.value)}
          placeholder="Opponent name"
          className="col-span-2 bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/40 transition-colors"
        />
        <input
          value={tournament}
          onChange={e => setTournament(e.target.value)}
          placeholder="Tournament / event"
          className="bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/40 transition-colors"
        />
        <input
          value={score}
          onChange={e => setScore(e.target.value)}
          placeholder="Score (e.g. 2-1)"
          className="bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white placeholder-white/20 outline-none focus:border-orange-500/40 transition-colors"
        />
      </div>

      {/* W / L toggle */}
      <div className="flex gap-2">
        {(['W', 'L'] as const).map(r => (
          <button
            key={r}
            onClick={() => setResult(r)}
            className="flex-1 py-2 rounded-sm text-sm font-black transition-all"
            style={{
              background: result === r
                ? r === 'W' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'
                : 'rgba(255,255,255,0.04)',
              color: result === r
                ? r === 'W' ? '#4ade80' : '#f87171'
                : 'rgba(255,255,255,0.3)',
              border: `1px solid ${result === r ? (r === 'W' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)') : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {r === 'W' ? '✓ WIN' : '✗ LOSS'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-sm text-[11px] font-bold text-white/40 hover:text-white/70 transition-colors border border-white/8"
        >
          Cancel
        </button>
        <button
          onClick={() => valid && onSubmit({ opponent, result, score, tournament })}
          disabled={!valid || isPending}
          className="flex-1 py-1.5 rounded-sm text-[11px] font-bold text-white flex items-center justify-center gap-1.5 disabled:opacity-40 transition-colors"
          style={{ background: '#f97316' }}
        >
          {isPending ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          {isPending ? 'Saving...' : 'Save Match'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  initialMatches: DbMatch[];
  initialNotes: DbNote[];
}

const TAG_COLOR: Record<string, string> = {
  STRATEGY: 'rgba(249,115,22,0.8)',
  REMINDER: 'rgba(59,130,246,0.8)',
  META: 'rgba(168,85,247,0.8)',
};

export default function Dashboard({ initialMatches, initialNotes }: Props) {
  // ── Match state ────────────────────────────────────────────────────────────
  const [matches, setMatches] = useState<DbMatch[]>(initialMatches);
  const [showLogForm, setShowLogForm] = useState(false);
  const [matchPending, startMatchTransition] = useTransition();
  const [matchToast, setMatchToast] = useState<string | null>(null);

  const wins = matches.filter(m => m.result === 'W').length;
  const losses = matches.filter(m => m.result === 'L').length;
  const total = wins + losses;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  const handleLogMatch = (data: { opponent: string; result: 'W' | 'L'; score: string; tournament: string }) => {
    // Optimistic update
    const optimistic: DbMatch = { id: `tmp-${Date.now()}`, created_at: new Date().toISOString(), ...data };
    setMatches(prev => [optimistic, ...prev]);
    setShowLogForm(false);

    startMatchTransition(async () => {
      try {
        const saved = await logMatchAction(data);
        // Replace the optimistic row with the real DB row
        setMatches(prev => prev.map(m => m.id === optimistic.id ? saved : m));
        setMatchToast('Match saved ✓');
      } catch {
        // Roll back
        setMatches(prev => prev.filter(m => m.id !== optimistic.id));
        setMatchToast('Error saving match');
      }
      setTimeout(() => setMatchToast(null), 3000);
    });
  };

  // ── Notes state ────────────────────────────────────────────────────────────
  const [notes, setNotes] = useState<DbNote[]>(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('STRATEGY');
  const [notePending, startNoteTransition] = useTransition();

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const optimistic: DbNote = {
      id: `tmp-${Date.now()}`,
      content: newNote.trim(),
      tag: newTag,
      created_at: new Date().toISOString(),
    };
    setNotes(prev => [optimistic, ...prev]);
    setNewNote('');

    startNoteTransition(async () => {
      try {
        const saved = await addNoteAction(optimistic.content, optimistic.tag);
        setNotes(prev => prev.map(n => n.id === optimistic.id ? saved : n));
      } catch {
        setNotes(prev => prev.filter(n => n.id !== optimistic.id));
      }
    });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    startNoteTransition(async () => {
      try {
        await deleteNoteAction(id);
      } catch {
        // nothing — row is gone from UI either way
      }
    });
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Toast */}
      {matchToast && (
        <div
          className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-medium shadow-lg"
          style={{ background: '#1a1a1b', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316' }}
        >
          <CheckCircle size={14} />
          {matchToast}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Command <span className="text-orange-500">Center</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Your VGC performance at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Win Rate" value={`${winRate}%`} sub={`${wins}W / ${losses}L all time`} icon={TrendingUp} accent />
        <StatCard label="Matches" value={String(total)} sub="all time" icon={Swords} />
        <StatCard label="Teams" value="—" sub="from team builder" icon={Users} />
        <StatCard label="CP Earned" value="—" sub="update manually" icon={Star} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide uppercase">Performance Analytics</h2>
              <p className="text-[11px] text-white/30 mt-0.5">Monthly W/L breakdown</p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm bg-orange-500" />
                <span className="text-white/40">Wins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: 'rgba(239,68,68,0.5)' }} />
                <span className="text-white/40">Losses</span>
              </div>
            </div>
          </div>
          <BarChart matches={matches} />
        </div>

        {/* Season record */}
        <div className="rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md flex flex-col" style={{ background: '#1a1a1b' }}>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-1">Season Record</h2>
          <p className="text-[11px] text-white/30 mb-5">2025 Regulation G</p>
          <div className="flex items-center justify-center gap-6 flex-1">
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: '#4ade80', textShadow: '0 0 20px rgba(74,222,128,0.4)' }}>
                {wins}
              </p>
              <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">Wins</p>
            </div>
            <div className="text-white/20 text-2xl font-thin">—</div>
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: '#f87171', textShadow: '0 0 20px rgba(248,113,113,0.4)' }}>
                {losses}
              </p>
              <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">Losses</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
              <span>Win rate</span>
              <span className="text-orange-400 font-bold">{winRate}%</span>
            </div>
            <div className="h-1.5 rounded-sm overflow-hidden bg-white/5">
              <div
                className="h-full rounded-sm bg-orange-500 transition-all duration-500"
                style={{ width: `${winRate}%`, boxShadow: '0 0 8px rgba(249,115,22,0.5)' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent matches + Notes */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent matches */}
        <div className="rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Recent Matches</h2>
            <button
              onClick={() => setShowLogForm(v => !v)}
              className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-sm font-bold transition-all"
              style={{
                background: showLogForm ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)',
                color: showLogForm ? '#f97316' : 'rgba(255,255,255,0.5)',
                border: `1px solid ${showLogForm ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <PlusCircle size={12} />
              Log Match
            </button>
          </div>

          {showLogForm && (
            <div className="mb-4">
              <LogMatchForm
                onSubmit={handleLogMatch}
                onCancel={() => setShowLogForm(false)}
                isPending={matchPending}
              />
            </div>
          )}

          {matches.length === 0 ? (
            <p className="text-center text-white/20 text-sm py-6">No matches logged yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {matches.slice(0, 8).map((match) => (
                <div key={match.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <div
                    className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-black"
                    style={{
                      background: match.result === 'W' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                      color: match.result === 'W' ? '#4ade80' : '#f87171',
                      border: `1px solid ${match.result === 'W' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                    }}
                  >
                    {match.result}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium truncate">{match.opponent}</p>
                    <p className="text-[10px] text-white/25 truncate">{match.tournament}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="text-sm font-bold"
                      style={{ color: match.result === 'W' ? '#4ade80' : '#f87171' }}
                    >
                      {match.score}
                    </p>
                    <p className="text-[10px] text-white/25">{timeAgo(match.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Strategic Notes</h2>
            {notePending ? (
              <Loader2 size={13} className="text-orange-400 animate-spin" />
            ) : (
              <Tag size={13} className="text-white/30" />
            )}
          </div>

          {/* Add note */}
          <div className="mb-4 space-y-2">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a strategic note..."
              rows={2}
              className="w-full bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none resize-none focus:border-orange-500/40 transition-colors"
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleAddNote(); }}
            />
            <div className="flex gap-2">
              {(['STRATEGY', 'REMINDER', 'META'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setNewTag(t)}
                  className="text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest transition-all"
                  style={{
                    background: newTag === t ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                    color: newTag === t ? '#f97316' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${newTag === t ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={handleAddNote}
                disabled={notePending || !newNote.trim()}
                className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                {notePending ? <Loader2 size={11} className="animate-spin" /> : <Plus size={11} />}
                Add
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {notes.length === 0 && (
              <p className="text-center text-white/20 text-xs py-4">No notes yet</p>
            )}
            {notes.map(note => (
              <div
                key={note.id}
                className="relative group rounded-sm p-3 border border-white/5 hover:border-white/10 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: `${TAG_COLOR[note.tag] ?? 'rgba(255,255,255,0.4)'}15`,
                      color: TAG_COLOR[note.tag] ?? 'rgba(255,255,255,0.6)',
                      border: `1px solid ${TAG_COLOR[note.tag] ?? 'rgba(255,255,255,0.2)'}30`,
                    }}
                  >
                    {note.tag}
                  </span>
                  <span className="text-[10px] text-white/20">{timeAgo(note.created_at)}</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">{note.content}</p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
