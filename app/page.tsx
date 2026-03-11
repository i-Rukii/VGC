'use client';

import { useState } from 'react';
import {
  Search,
  Shield,
  Zap,
  TrendingUp,
  ChevronRight,
  Plus,
  Crosshair,
  Activity,
  Star,
  Radio,
} from 'lucide-react';

const TRENDING_POKEMON = [
  { name: 'Incineroar', role: 'Support', usage: '84.2%', tier: 'S', color: '#FF6B35' },
  { name: 'Rillaboom', role: 'Offense', usage: '71.8%', tier: 'S', color: '#4CAF50' },
  { name: 'Flutter Mane', role: 'Special Atk', usage: '68.3%', tier: 'S', color: '#CE93D8' },
  { name: 'Urshifu-RS', role: 'Breaker', usage: '61.5%', tier: 'A', color: '#64B5F6' },
  { name: 'Landorus-T', role: 'Control', usage: '59.1%', tier: 'A', color: '#FFD54F' },
  { name: 'Calyrex-Ice', role: 'Restrict', usage: '52.7%', tier: 'A', color: '#80DEEA' },
  { name: 'Chien-Pao', role: 'Offense', usage: '48.4%', tier: 'A', color: '#B0BEC5' },
  { name: 'Amoonguss', role: 'Support', usage: '45.9%', tier: 'B', color: '#A5D6A7' },
];

const TEAM_SLOTS = Array(6).fill(null);

const tierColors: Record<string, string> = {
  S: '#FF4757',
  A: '#FFA502',
  B: '#2ED573',
  C: '#70A1FF',
};

export default function VGCTeamBuilder() {
  const [searchQuery, setSearchQuery] = useState('');
  const [team, setTeam] = useState<(string | null)[]>(Array(6).fill(null));
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [hoveredTrend, setHoveredTrend] = useState<number | null>(null);

  const filledSlots = team.filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#080C10] text-white overflow-hidden font-mono">
      {/* Scanline overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
        }}
      />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #00D4FF 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #FF4757 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 left-1/3 w-[350px] h-[350px] rounded-full opacity-6"
          style={{ background: 'radial-gradient(circle, #7B61FF 0%, transparent 70%)' }}
        />
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── TOP NAV ── */}
      <header className="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Crosshair size={20} className="text-[#00D4FF]" />
              <div className="absolute inset-0 animate-ping opacity-30">
                <Crosshair size={20} className="text-[#00D4FF]" />
              </div>
            </div>
            <span
              className="text-sm font-bold tracking-[0.25em] uppercase"
              style={{ color: '#00D4FF', textShadow: '0 0 20px rgba(0,212,255,0.5)' }}
            >
              VGC Command
            </span>
            <span className="text-white/20 text-xs tracking-widest">// TEAM BUILDER v2.1</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Radio size={10} className="text-[#2ED573] animate-pulse" />
              <span className="text-[10px] text-white/40 tracking-widest uppercase">Live Meta</span>
            </div>
            <div
              className="text-xs px-3 py-1 rounded border"
              style={{
                borderColor: 'rgba(0,212,255,0.3)',
                color: '#00D4FF',
                background: 'rgba(0,212,255,0.05)',
              }}
            >
              Season 2 · Reg G
            </div>
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-8 flex gap-6">
        {/* ── LEFT: MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 space-y-8">
          {/* Status bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="text-2xl font-black tracking-tight uppercase"
                style={{ letterSpacing: '-0.02em' }}
              >
                Team
                <span style={{ color: '#00D4FF' }}> Assembly</span>
              </h1>
              <p className="text-white/30 text-xs mt-0.5 tracking-widest uppercase">
                {filledSlots}/6 slots configured
              </p>
            </div>
            <div className="flex items-center gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background:
                      i < filledSlots
                        ? '#00D4FF'
                        : 'rgba(255,255,255,0.1)',
                    boxShadow: i < filledSlots ? '0 0 8px rgba(0,212,255,0.8)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* ── SEARCH BAR ── */}
          <div className="relative group">
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-xl"
              style={{ background: 'rgba(0,212,255,0.15)' }}
            />
            <div
              className="relative flex items-center gap-3 rounded-xl px-5 py-4 border transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <Search
                size={18}
                className="text-white/30 group-focus-within:text-[#00D4FF] transition-colors duration-300 flex-shrink-0"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pokémon by name, type, or ability..."
                className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none tracking-wide"
                style={{ fontFamily: 'inherit' }}
              />
              {searchQuery && (
                <div
                  className="text-[10px] px-2 py-0.5 rounded border tracking-widest uppercase"
                  style={{
                    color: '#00D4FF',
                    borderColor: 'rgba(0,212,255,0.3)',
                    background: 'rgba(0,212,255,0.08)',
                  }}
                >
                  Enter ↵
                </div>
              )}
              <div className="flex items-center gap-2 text-white/20 text-[10px] tracking-widest">
                <span>GEN 9</span>
                <span className="w-px h-3 bg-white/10" />
                <Zap size={10} />
                <span>VGC</span>
              </div>
            </div>
          </div>

          {/* ── TEAM SLOTS GRID ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Shield size={14} className="text-white/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                Active Roster
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {TEAM_SLOTS.map((_, index) => {
                const isActive = activeSlot === index;
                const isFilled = team[index] !== null;

                return (
                  <button
                    key={index}
                    onClick={() => setActiveSlot(isActive ? null : index)}
                    className="relative group rounded-xl p-px transition-all duration-300 text-left"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(0,212,255,0.4), rgba(123,97,255,0.4))'
                        : isFilled
                        ? 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(123,97,255,0.2))'
                        : 'rgba(255,255,255,0.04)',
                    }}
                  >
                    <div
                      className="rounded-[11px] p-5 h-full transition-all duration-300"
                      style={{
                        background: isActive
                          ? 'rgba(0,10,20,0.95)'
                          : 'rgba(0,10,20,0.9)',
                      }}
                    >
                      {/* Slot number */}
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className="text-[10px] tracking-[0.3em] font-bold uppercase"
                          style={{ color: isActive ? '#00D4FF' : 'rgba(255,255,255,0.2)' }}
                        >
                          Slot {String(index + 1).padStart(2, '0')}
                        </span>
                        {isActive && (
                          <div
                            className="text-[9px] px-2 py-0.5 rounded tracking-widest uppercase"
                            style={{
                              background: 'rgba(0,212,255,0.1)',
                              color: '#00D4FF',
                              border: '1px solid rgba(0,212,255,0.3)',
                            }}
                          >
                            Active
                          </div>
                        )}
                      </div>

                      {/* Center icon */}
                      <div className="flex flex-col items-center justify-center py-4 gap-3">
                        <div
                          className="w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isActive
                              ? 'rgba(0,212,255,0.1)'
                              : 'rgba(255,255,255,0.03)',
                            border: isActive
                              ? '1px solid rgba(0,212,255,0.3)'
                              : '1px dashed rgba(255,255,255,0.08)',
                          }}
                        >
                          <Plus
                            size={20}
                            className="transition-all duration-300"
                            style={{
                              color: isActive ? '#00D4FF' : 'rgba(255,255,255,0.15)',
                              transform: isActive ? 'rotate(45deg)' : 'none',
                            }}
                          />
                        </div>
                        <span
                          className="text-[11px] tracking-widest uppercase transition-colors duration-300"
                          style={{ color: isActive ? 'rgba(0,212,255,0.6)' : 'rgba(255,255,255,0.15)' }}
                        >
                          {isActive ? 'Search above' : 'Empty slot'}
                        </span>
                      </div>

                      {/* Bottom stat placeholders */}
                      <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                        {['ATK', 'DEF', 'SPD'].map((stat) => (
                          <div
                            key={stat}
                            className="flex-1 text-center py-1 rounded text-[9px] tracking-widest"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              color: 'rgba(255,255,255,0.15)',
                            }}
                          >
                            {stat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── TEAM ANALYSIS STRIP ── */}
          <div
            className="rounded-xl p-5 border"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Activity size={14} className="text-white/40" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                Team Analysis
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Type Coverage', value: '—', sub: 'Add Pokémon' },
                { label: 'Speed Control', value: '—', sub: 'Add Pokémon' },
                { label: 'Win Condition', value: '—', sub: 'Add Pokémon' },
                { label: 'Threat Score', value: '—', sub: 'Add Pokémon' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-white/20 text-[10px] tracking-widest uppercase mb-1">
                    {item.label}
                  </div>
                  <div className="text-white/70 text-lg font-bold">{item.value}</div>
                  <div className="text-white/20 text-[10px]">{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* ── RIGHT: SIDEBAR ── */}
        <aside className="w-72 flex-shrink-0 space-y-4">
          {/* Header */}
          <div
            className="rounded-xl p-5 border"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <TrendingUp size={14} style={{ color: '#FF4757' }} />
                <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
                  Trending Meta
                </span>
              </div>
              <span className="text-[9px] text-white/20 tracking-widest">WCS 2025</span>
            </div>
            <p className="text-[10px] text-white/20 leading-relaxed mt-2">
              Usage rates from top-cut tournament data. Updated daily.
            </p>
          </div>

          {/* Trending list */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            {TRENDING_POKEMON.map((pokemon, index) => (
              <button
                key={pokemon.name}
                onMouseEnter={() => setHoveredTrend(index)}
                onMouseLeave={() => setHoveredTrend(null)}
                className="w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 text-left"
                style={{
                  background:
                    hoveredTrend === index ? 'rgba(255,255,255,0.04)' : 'transparent',
                  borderBottom:
                    index < TRENDING_POKEMON.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                }}
              >
                {/* Rank */}
                <span
                  className="text-[10px] font-bold w-5 text-center"
                  style={{ color: 'rgba(255,255,255,0.2)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>

                {/* Color dot */}
                <div
                  className="w-1.5 h-8 rounded-full flex-shrink-0"
                  style={{
                    background: pokemon.color,
                    boxShadow:
                      hoveredTrend === index ? `0 0 8px ${pokemon.color}` : 'none',
                    transition: 'box-shadow 0.2s',
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white/80 truncate">
                    {pokemon.name}
                  </div>
                  <div className="text-[10px] text-white/30 tracking-wider">{pokemon.role}</div>
                </div>

                {/* Tier + usage */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5 rounded"
                    style={{
                      color: tierColors[pokemon.tier],
                      background: `${tierColors[pokemon.tier]}18`,
                      border: `1px solid ${tierColors[pokemon.tier]}40`,
                    }}
                  >
                    {pokemon.tier}
                  </span>
                  <span className="text-[10px] text-white/30">{pokemon.usage}</span>
                </div>

                <ChevronRight
                  size={12}
                  className="text-white/10 flex-shrink-0 transition-all duration-200"
                  style={{
                    color: hoveredTrend === index ? 'rgba(0,212,255,0.5)' : undefined,
                    transform: hoveredTrend === index ? 'translateX(2px)' : 'none',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Meta snapshot */}
          <div
            className="rounded-xl p-4 border"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.05)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Star size={12} className="text-white/30" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-white/30">
                Meta Snapshot
              </span>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Offense-heavy', pct: 62 },
                { label: 'Trick Room', pct: 38 },
                { label: 'Tailwind', pct: 51 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-white/30">{item.label}</span>
                    <span className="text-[10px] text-white/30">{item.pct}%</span>
                  </div>
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.pct}%`,
                        background:
                          'linear-gradient(90deg, rgba(0,212,255,0.6), rgba(123,97,255,0.6))',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
