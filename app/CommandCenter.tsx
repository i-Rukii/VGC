'use client';

import { useState } from 'react';
import type { Tab, InitialData } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TeamBuilder from './components/TeamBuilder';
import MetaTrends from './components/MetaTrends';
import TournamentTracker from './components/TournamentTracker';

const TAB_TITLES: Record<Tab, string> = {
  'dashboard':     'Dashboard',
  'team-builder':  'Team Builder',
  'meta-trends':   'Meta Trends',
  'tournaments':   'Tournament Tracker',
};

interface Props {
  initialData: InitialData;
}

export default function CommandCenter({ initialData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            initialMatches={initialData.matches}
            initialNotes={initialData.notes}
          />
        );
      case 'team-builder':
        return <TeamBuilder initialTeam={initialData.latestTeam} />;
      case 'meta-trends':
        return <MetaTrends />;
      case 'tournaments':
        return <TournamentTracker initialTournaments={initialData.tournaments} />;
    }
  };

  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#121212', fontFamily: "'DM Mono', 'JetBrains Mono', 'Fira Code', monospace" }}
    >
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="h-12 border-b border-[#2d2d2d] flex items-center px-8 gap-3 flex-shrink-0"
          style={{ background: '#0e0e0e' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-1 h-4 rounded-full bg-orange-500"
              style={{ boxShadow: '0 0 8px rgba(249,115,22,0.6)' }}
            />
            <span className="text-xs text-white/40 tracking-[0.2em] uppercase font-medium">
              {TAB_TITLES[activeTab]}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-white/25 tracking-widest uppercase">Live</span>
            </div>
            <div className="h-4 w-px bg-white/8" />
            <span className="text-[11px] text-white/20 tracking-wider">Regulation G · Season 2025</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div key={activeTab} className="max-w-5xl mx-auto animate-fade-in">
            {renderTab()}
          </div>
        </main>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d2d2d; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #3d3d3d; }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
