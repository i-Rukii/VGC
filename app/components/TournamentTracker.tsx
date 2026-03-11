'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, Star, Clock, ExternalLink, Filter, Flame, AlertCircle } from 'lucide-react';
import type { DbTournament } from '../types';

type FilterType = 'all' | 'upcoming' | 'ongoing' | 'completed';

const STATUS_CONFIG = {
  upcoming:  { label: 'Upcoming',  color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.25)' },
  ongoing:   { label: 'Live Now',  color: '#4ade80', bg: 'rgba(74,222,128,0.1)',  border: 'rgba(74,222,128,0.25)' },
  completed: { label: 'Completed', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
};

interface Props {
  initialTournaments: DbTournament[];
}

export default function TournamentTracker({ initialTournaments }: Props) {
  const [filter, setFilter] = useState<FilterType>('all');
  const tournaments = initialTournaments;

  const filtered = filter === 'all' ? tournaments : tournaments.filter(t => t.status === filter);
  const upcomingCount = tournaments.filter(t => t.status === 'upcoming').length;
  const ongoingCount  = tournaments.filter(t => t.status === 'ongoing').length;
  const totalCP       = tournaments
    .filter(t => t.status === 'upcoming' || t.status === 'ongoing')
    .reduce((s, t) => s + (t.cp ?? 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tournament <span className="text-orange-500">Tracker</span>
          </h1>
          <p className="text-white/35 text-sm mt-0.5">
            Events you&apos;re planning to attend — add rows directly in Supabase
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-sm border border-orange-500/20 bg-orange-500/5">
          <Flame size={13} className="text-orange-500" />
          <span className="text-[11px] text-orange-400 font-bold tracking-widest">REG G · 2025</span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming Events', value: String(upcomingCount), icon: Calendar, color: '#60a5fa' },
          { label: 'Live Right Now',  value: String(ongoingCount),  icon: Clock,    color: '#4ade80', pulse: true },
          { label: 'CP Available',    value: totalCP.toLocaleString() || '—', icon: Star, color: '#f97316' },
        ].map(({ label, value, icon: Icon, color, pulse }) => (
          <div key={label} className="rounded-sm border border-[#2d2d2d] p-4 flex items-center gap-4" style={{ background: '#1a1a1b' }}>
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 relative"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}
            >
              <Icon size={16} style={{ color }} />
              {pulse && ongoingCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75" />
              )}
            </div>
            <div>
              <p className="text-xl font-black text-white">{value}</p>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-white/30" />
        <span className="text-[10px] text-white/25 tracking-widest uppercase mr-2">Filter</span>
        {(['all', 'upcoming', 'ongoing', 'completed'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-sm text-[11px] font-bold capitalize tracking-wide transition-all"
            style={{
              background: filter === f ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#f97316' : 'rgba(255,255,255,0.35)',
              border: `1px solid ${filter === f ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {f === 'all' ? `All (${tournaments.length})` : f}
          </button>
        ))}
      </div>

      {/* Empty state */}
      {tournaments.length === 0 ? (
        <div
          className="rounded-sm border border-dashed border-[#2d2d2d] p-10 flex flex-col items-center justify-center gap-4 text-center"
          style={{ background: '#1a1a1b' }}
        >
          <div
            className="w-12 h-12 rounded-sm flex items-center justify-center"
            style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}
          >
            <Calendar size={20} className="text-orange-500/60" />
          </div>
          <div>
            <p className="text-white/50 font-bold text-sm">No tournaments yet</p>
            <p className="text-white/25 text-[12px] mt-1 max-w-xs leading-relaxed">
              Add rows to the <code className="text-orange-400/60">tournaments</code> table in your Supabase dashboard.
              They&apos;ll appear here automatically on next page load.
            </p>
          </div>
          <div
            className="flex items-start gap-2 px-4 py-3 rounded-sm border border-white/5 text-left max-w-sm"
            style={{ background: 'rgba(255,255,255,0.02)' }}
          >
            <AlertCircle size={13} className="text-white/25 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-white/25 leading-relaxed">
              Required columns: <code className="text-white/40">name</code>,{' '}
              <code className="text-white/40">date</code>,{' '}
              <code className="text-white/40">location</code>,{' '}
              <code className="text-white/40">country</code>,{' '}
              <code className="text-white/40">format</code>,{' '}
              <code className="text-white/40">status</code>,{' '}
              <code className="text-white/40">cp</code>
            </p>
          </div>
        </div>
      ) : (
        /* Table */
        <div className="rounded-sm border border-[#2d2d2d] overflow-hidden" style={{ background: '#1a1a1b' }}>
          {/* Column headers */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 bg-black/20">
            <span className="col-span-4 text-[10px] text-white/25 uppercase tracking-widest font-bold">Event</span>
            <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold">Date</span>
            <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold">Location</span>
            <span className="col-span-1 text-[10px] text-white/25 uppercase tracking-widest font-bold text-center">Players</span>
            <span className="col-span-1 text-[10px] text-white/25 uppercase tracking-widest font-bold text-center">CP</span>
            <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold text-right">Status</span>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-white/20 text-sm py-8">No events match this filter</p>
          ) : (
            <div className="divide-y divide-white/3">
              {filtered.map(t => {
                const sc = STATUS_CONFIG[t.status] ?? STATUS_CONFIG.upcoming;
                const isOngoing   = t.status === 'ongoing';
                const isCompleted = t.status === 'completed';

                return (
                  <div
                    key={t.id}
                    className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors group"
                    style={{ opacity: isCompleted ? 0.55 : 1 }}
                  >
                    {/* Name */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 text-base"
                        style={{
                          background: isOngoing ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isOngoing ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}`,
                        }}
                      >
                        {t.country ?? '🌍'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{t.name}</p>
                        <p className="text-[10px] text-white/30">{t.format}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2 flex items-center gap-1.5">
                      <Calendar size={12} className="text-white/25 flex-shrink-0" />
                      <span className="text-[12px] text-white/60">{t.date}</span>
                    </div>

                    {/* Location */}
                    <div className="col-span-2 flex items-center gap-1.5">
                      <MapPin size={12} className="text-white/25 flex-shrink-0" />
                      <span className="text-[12px] text-white/60 truncate">{t.location}</span>
                    </div>

                    {/* Players */}
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users size={11} className="text-white/25" />
                        <span className="text-[12px] text-white/55 font-medium">
                          {t.players ? t.players.toLocaleString() : '—'}
                        </span>
                      </div>
                    </div>

                    {/* CP */}
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={11} className="text-orange-500/60" />
                        <span className="text-[12px] font-bold text-orange-400/80">{t.cp ?? '—'}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                      >
                        {isOngoing ? '● ' : ''}{sc.label}
                      </span>
                      {!isCompleted && (
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-white/25 hover:text-orange-400">
                          <ExternalLink size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
