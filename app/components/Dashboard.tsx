'use client';

import { useState } from 'react';
import { TrendingUp, Swords, Users, Star, Plus, X, ArrowUpRight, ArrowDownRight, Minus, Tag } from 'lucide-react';
import type { Note } from '../types';

const MATCH_HISTORY = [
  { label: 'Jan', wins: 4, losses: 1 },
  { label: 'Feb', wins: 7, losses: 3 },
  { label: 'Mar', wins: 6, losses: 2 },
  { label: 'Apr', wins: 9, losses: 2 },
  { label: 'May', wins: 8, losses: 3 },
  { label: 'Jun', wins: 11, losses: 2 },
  { label: 'Jul', wins: 10, losses: 4 },
];

const RECENT_MATCHES = [
  { opponent: 'PlayerAce_VGC', result: 'W' as const, score: '2-0', tournament: 'Local League #12', date: '2h ago' },
  { opponent: 'SapphireTrainer', result: 'W' as const, score: '2-1', tournament: 'Online Cup', date: '1d ago' },
  { opponent: 'Kazuki_PWT', result: 'L' as const, score: '0-2', tournament: 'Online Cup', date: '1d ago' },
  { opponent: 'MegaBattler99', result: 'W' as const, score: '2-0', tournament: 'Local League #11', date: '3d ago' },
  { opponent: 'FireStar_VGC', result: 'W' as const, score: '2-1', tournament: 'Regional Qualifier', date: '5d ago' },
];

const INITIAL_NOTES: Note[] = [
  { id: 1, content: 'Incineroar + Rillaboom core is extremely consistent. Fake Out + Grassy Glide secures most game-1s.', tag: 'STRATEGY', createdAt: '2d ago' },
  { id: 2, content: 'Watch for Amoonguss leads into Urshifu matchups — redirect misplays cost 3 rounds last week.', tag: 'REMINDER', createdAt: '4d ago' },
  { id: 3, content: 'Calyrex-Ice teams are surging in top cut. Need specific counterplay — consider Incineroar + priority.', tag: 'META', createdAt: '1w ago' },
];

function StatCard({ label, value, sub, icon: Icon, accent = false }: {
  label: string; value: string; sub: string; icon: React.ElementType; accent?: boolean;
}) {
  return (
    <div className="rounded-sm p-5 border border-[#2d2d2d] backdrop-blur-md relative overflow-hidden"
      style={{ background: accent ? 'rgba(249,115,22,0.06)' : '#1a1a1b', borderColor: accent ? 'rgba(249,115,22,0.25)' : '#2d2d2d' }}>
      {accent && <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }} />}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 font-medium mb-2">{label}</p>
          <p className="text-3xl font-black text-white tracking-tight" style={{ color: accent ? '#f97316' : undefined }}>{value}</p>
          <p className="text-[11px] text-white/35 mt-1">{sub}</p>
        </div>
        <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
          style={{ background: accent ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.05)' }}>
          <Icon size={18} style={{ color: accent ? '#f97316' : 'rgba(255,255,255,0.4)' }} />
        </div>
      </div>
    </div>
  );
}

function BarChart() {
  const maxTotal = Math.max(...MATCH_HISTORY.map(d => d.wins + d.losses));
  return (
    <div className="flex items-end gap-2 h-40 w-full">
      {MATCH_HISTORY.map((data, i) => {
        const winH = (data.wins / maxTotal) * 100;
        const lossH = (data.losses / maxTotal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
            <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '120px' }}>
              <div className="w-full rounded-sm transition-all duration-300 group-hover:brightness-125"
                style={{ height: `${lossH}%`, background: 'rgba(239,68,68,0.4)', minHeight: lossH > 0 ? '3px' : '0' }} />
              <div className="w-full rounded-sm transition-all duration-300 group-hover:brightness-125"
                style={{ height: `${winH}%`, background: '#f97316', minHeight: '3px', boxShadow: '0 0 8px rgba(249,115,22,0.3)' }} />
            </div>
            <span className="text-[10px] text-white/30 group-hover:text-white/60 transition-colors">{data.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('STRATEGY');

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [{
      id: Date.now(), content: newNote.trim(), tag: newTag, createdAt: 'just now'
    }, ...prev]);
    setNewNote('');
  };

  const removeNote = (id: number) => setNotes(prev => prev.filter(n => n.id !== id));

  const tagColor: Record<string, string> = {
    STRATEGY: 'rgba(249,115,22,0.8)',
    REMINDER: 'rgba(59,130,246,0.8)',
    META: 'rgba(168,85,247,0.8)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">
          Command <span className="text-orange-500">Center</span>
        </h1>
        <p className="text-white/35 text-sm mt-0.5">Your VGC performance at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Win Rate" value="70%" sub="55W / 24L all time" icon={TrendingUp} accent />
        <StatCard label="Matches" value="79" sub="+6 this week" icon={Swords} />
        <StatCard label="Teams" value="5" sub="2 active builds" icon={Users} />
        <StatCard label="CP Earned" value="340" sub="Top 16 at Regionals" icon={Star} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bar chart */}
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
                <div className="w-2.5 h-2.5 rounded-sm bg-red-500/50" />
                <span className="text-white/40">Losses</span>
              </div>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Season record */}
        <div className="rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md flex flex-col" style={{ background: '#1a1a1b' }}>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase mb-1">Season Record</h2>
          <p className="text-[11px] text-white/30 mb-5">2025 Regulation G</p>
          <div className="flex items-center justify-center gap-6 flex-1">
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: '#4ade80', textShadow: '0 0 20px rgba(74,222,128,0.4)' }}>55</p>
              <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">Wins</p>
            </div>
            <div className="text-white/20 text-2xl font-thin">—</div>
            <div className="text-center">
              <p className="text-4xl font-black" style={{ color: '#f87171', textShadow: '0 0 20px rgba(248,113,113,0.4)' }}>24</p>
              <p className="text-[11px] text-white/30 mt-1 tracking-widest uppercase">Losses</p>
            </div>
          </div>
          <div className="mt-auto">
            <div className="flex justify-between text-[10px] text-white/30 mb-1.5">
              <span>Win rate</span><span className="text-orange-400 font-bold">70%</span>
            </div>
            <div className="h-1.5 rounded-sm overflow-hidden bg-white/5">
              <div className="h-full rounded-sm bg-orange-500 transition-all" style={{ width: '70%', boxShadow: '0 0 8px rgba(249,115,22,0.5)' }} />
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
            <button className="text-[11px] text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={11} />
            </button>
          </div>
          <div className="space-y-2">
            {RECENT_MATCHES.map((match, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-xs font-black"
                  style={{
                    background: match.result === 'W' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                    color: match.result === 'W' ? '#4ade80' : '#f87171',
                    border: `1px solid ${match.result === 'W' ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}`,
                  }}>
                  {match.result}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 font-medium truncate">{match.opponent}</p>
                  <p className="text-[10px] text-white/25 truncate">{match.tournament}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: match.result === 'W' ? '#4ade80' : '#f87171' }}>{match.score}</p>
                  <p className="text-[10px] text-white/25">{match.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-sm border border-[#2d2d2d] p-5 backdrop-blur-md" style={{ background: '#1a1a1b' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">Strategic Notes</h2>
            <Tag size={14} className="text-white/30" />
          </div>

          {/* Add note */}
          <div className="mb-4 space-y-2">
            <textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a strategic note..."
              rows={2}
              className="w-full bg-black/30 border border-white/8 rounded-sm px-3 py-2 text-sm text-white/80 placeholder-white/20 outline-none resize-none focus:border-orange-500/40 transition-colors"
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addNote(); }}
            />
            <div className="flex gap-2">
              {['STRATEGY', 'REMINDER', 'META'].map(t => (
                <button key={t} onClick={() => setNewTag(t)}
                  className="text-[10px] px-2 py-1 rounded-sm font-bold tracking-widest transition-all"
                  style={{
                    background: newTag === t ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                    color: newTag === t ? '#f97316' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${newTag === t ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {t}
                </button>
              ))}
              <button onClick={addNote} className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                <Plus size={11} /> Add
              </button>
            </div>
          </div>

          {/* Notes list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {notes.map(note => (
              <div key={note.id} className="relative group rounded-sm p-3 border border-white/5 hover:border-white/10 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-sm"
                    style={{ background: `${tagColor[note.tag]}15`, color: tagColor[note.tag], border: `1px solid ${tagColor[note.tag]}30` }}>
                    {note.tag}
                  </span>
                  <span className="text-[10px] text-white/20">{note.createdAt}</span>
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">{note.content}</p>
                <button onClick={() => removeNote(note.id)}
                  className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-red-400">
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
