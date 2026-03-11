'use client';

import { LayoutDashboard, Swords, BarChart3, Trophy, Zap, ChevronRight } from 'lucide-react';
import type { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'team-builder', label: 'Team Builder', icon: Swords },
  { id: 'meta-trends', label: 'Meta Trends', icon: BarChart3, badge: 'REG G' },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy },
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col bg-[#0e0e0e] border-r border-[#2d2d2d] min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2d2d2d]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-sm bg-orange-500 flex items-center justify-center flex-shrink-0"
            style={{ boxShadow: '0 0 16px rgba(249,115,22,0.4)' }}>
            <Zap size={16} className="text-white fill-white" />
          </div>
          <div>
            <span className="text-white font-black text-sm tracking-tight">VGC</span>
            <span className="text-orange-500 font-black text-sm tracking-tight">Hub</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-[10px] text-white/25 tracking-[0.25em] uppercase px-2 pb-2 font-medium">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-all duration-150 group relative"
              style={{
                background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                borderLeft: isActive ? '2px solid #f97316' : '2px solid transparent',
              }}
            >
              <Icon
                size={16}
                className="flex-shrink-0 transition-colors"
                style={{ color: isActive ? '#f97316' : 'rgba(255,255,255,0.35)' }}
              />
              <span
                className="text-sm font-medium flex-1 tracking-wide transition-colors"
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-bold tracking-widest"
                  style={{
                    background: isActive ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#f97316' : 'rgba(255,255,255,0.3)',
                    border: `1px solid ${isActive ? 'rgba(249,115,22,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight size={12} className="text-orange-500 flex-shrink-0" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Season tag */}
      <div className="px-3 py-4 border-t border-[#2d2d2d]">
        <div className="px-3 py-2.5 rounded-sm" style={{ background: 'rgba(249,115,22,0.07)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <p className="text-[10px] text-white/30 tracking-widest uppercase mb-0.5">Active Format</p>
          <p className="text-sm font-bold text-orange-400">Regulation G</p>
          <p className="text-[10px] text-white/25 mt-0.5">Season 2025</p>
        </div>
      </div>
    </aside>
  );
}
