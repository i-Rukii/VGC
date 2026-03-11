'use client';

import { Calendar, MapPin, Users, Star, Clock, ExternalLink, Trophy, Filter } from 'lucide-react';
import { useState } from 'react';
import type { Tournament } from '../types';

const TOURNAMENTS: Tournament[] = [
  {
    id: 1, name: 'NAIC 2025', date: 'Jun 20–22, 2025', location: 'Columbus, OH', country: '🇺🇸',
    format: 'Regulation G', status: 'upcoming', players: 2000, cp: 800,
  },
  {
    id: 2, name: 'Worlds 2025', date: 'Aug 15–17, 2025', location: 'Yokohama, Japan', country: '🇯🇵',
    format: 'Regulation G', status: 'upcoming', players: 512, cp: 1200,
  },
  {
    id: 3, name: 'Latin America IC', date: 'May 3–4, 2025', location: 'São Paulo, Brazil', country: '🇧🇷',
    format: 'Regulation G', status: 'upcoming', players: 800, cp: 500,
  },
  {
    id: 4, name: 'UK Regionals', date: 'Apr 12–13, 2025', location: 'Manchester, UK', country: '🇬🇧',
    format: 'Regulation G', status: 'upcoming', players: 350, cp: 300,
  },
  {
    id: 5, name: 'EU IC 2025', date: 'Apr 25–27, 2025', location: 'Berlin, Germany', country: '🇩🇪',
    format: 'Regulation G', status: 'upcoming', players: 900, cp: 500,
  },
  {
    id: 6, name: 'Oceania IC', date: 'Mar 28–30, 2025', location: 'Melbourne, Australia', country: '🇦🇺',
    format: 'Regulation G', status: 'ongoing', players: 400, cp: 300,
  },
  {
    id: 7, name: 'Japan Nats 2025', date: 'Jul 5–6, 2025', location: 'Tokyo, Japan', country: '🇯🇵',
    format: 'Regulation G', status: 'upcoming', players: 1200, cp: 600,
  },
  {
    id: 8, name: 'Charlotte Regionals', date: 'Feb 22–23, 2025', location: 'Charlotte, NC', country: '🇺🇸',
    format: 'Regulation G', status: 'completed', players: 480, cp: 300,
  },
];

const STATUS_CONFIG = {
  upcoming: { label: 'Upcoming', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)' },
  ongoing: { label: 'Live Now', color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.25)' },
  completed: { label: 'Completed', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' },
};

type FilterType = 'all' | 'upcoming' | 'ongoing' | 'completed';

export default function TournamentTracker() {
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all' ? TOURNAMENTS : TOURNAMENTS.filter(t => t.status === filter);

  const upcomingCount = TOURNAMENTS.filter(t => t.status === 'upcoming').length;
  const ongoingCount = TOURNAMENTS.filter(t => t.status === 'ongoing').length;
  const totalCP = TOURNAMENTS.filter(t => t.status === 'upcoming' || t.status === 'ongoing')
    .reduce((sum, t) => sum + t.cp, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Tournament <span className="text-orange-500">Tracker</span>
          </h1>
          <p className="text-white/35 text-sm mt-0.5">Official VGC events for the 2025 competitive season</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Upcoming Events', value: String(upcomingCount), icon: Calendar, color: '#60a5fa' },
          { label: 'Live Right Now', value: String(ongoingCount), icon: Clock, color: '#4ade80', pulse: true },
          { label: 'CP Available', value: totalCP.toLocaleString(), icon: Star, color: '#f97316' },
        ].map(({ label, value, icon: Icon, color, pulse }) => (
          <div key={label} className="rounded-sm border border-[#2d2d2d] p-4 flex items-center gap-4" style={{ background: '#1a1a1b' }}>
            <div className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0 relative"
              style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
              <Icon size={16} style={{ color }} />
              {pulse && <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-green-400 animate-ping opacity-75" />}
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
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-sm text-[11px] font-bold capitalize tracking-wide transition-all"
            style={{
              background: filter === f ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
              color: filter === f ? '#f97316' : 'rgba(255,255,255,0.35)',
              border: `1px solid ${filter === f ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {f === 'all' ? `All (${TOURNAMENTS.length})` : f}
          </button>
        ))}
      </div>

      {/* Table header */}
      <div className="rounded-sm border border-[#2d2d2d] overflow-hidden" style={{ background: '#1a1a1b' }}>
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 bg-black/20">
          <span className="col-span-4 text-[10px] text-white/25 uppercase tracking-widest font-bold">Event</span>
          <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold">Date</span>
          <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold">Location</span>
          <span className="col-span-1 text-[10px] text-white/25 uppercase tracking-widest font-bold text-center">Players</span>
          <span className="col-span-1 text-[10px] text-white/25 uppercase tracking-widest font-bold text-center">CP</span>
          <span className="col-span-2 text-[10px] text-white/25 uppercase tracking-widest font-bold text-right">Status</span>
        </div>

        <div className="divide-y divide-white/3">
          {filtered.map((t) => {
            const statusCfg = STATUS_CONFIG[t.status];
            const isOngoing = t.status === 'ongoing';
            const isCompleted = t.status === 'completed';

            return (
              <div key={t.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors group"
                style={{ opacity: isCompleted ? 0.55 : 1 }}>

                {/* Name */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0 text-base"
                    style={{ background: isOngoing ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isOngoing ? 'rgba(74,222,128,0.2)' : 'rgba(255,255,255,0.06)'}` }}>
                    {t.country}
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
                    <span className="text-[12px] text-white/55 font-medium">{t.players?.toLocaleString()}</span>
                  </div>
                </div>

                {/* CP */}
                <div className="col-span-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star size={11} className="text-orange-500/60" />
                    <span className="text-[12px] font-bold text-orange-400/80">{t.cp}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  {isOngoing && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping absolute" />
                  )}
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-sm tracking-widest uppercase"
                    style={{ background: statusCfg.bg, color: statusCfg.color, border: `1px solid ${statusCfg.border}` }}>
                    {statusCfg.label}
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
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-white/25 text-sm">
          No tournaments found for this filter.
        </div>
      )}
    </div>
  );
}
