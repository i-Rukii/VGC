'use client';
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Swords, 
  Trophy, 
  BarChart3, 
  StickyNote, 
  Settings,
  TrendingUp,
  Plus
} from 'lucide-react';

export default function VGCCommand() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="flex h-screen bg-[#0f1115] text-gray-100 font-sans selection:bg-orange-500/30">
      
      {/* --- SIDEBAR NAV --- */}
      <aside className="w-64 border-r border-gray-800 flex flex-col bg-[#0f1115]">
        <div className="p-6">
          <h1 className="text-xl font-black tracking-tighter text-orange-500 italic">VGC COMMAND</h1>
          <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Tactical Intel v3.0</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'home', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'builder', icon: Swords, label: 'Team Builder' },
            { id: 'meta', icon: BarChart3, label: 'Meta Hub' },
            { id: 'tourney', icon: Trophy, label: 'Tournaments' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-3 px-4 py-2 text-gray-500 hover:text-white transition-colors">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 overflow-y-auto p-8 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent">
        
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">Commander Deck</h2>
            <p className="text-gray-500">Welcome back. The meta is shifting toward Trick Room.</p>
          </div>
          <div className="flex space-x-3">
            <button className="px-4 py-2 bg-gray-800 rounded-md border border-gray-700 hover:border-orange-500 transition-all text-sm font-semibold">
              Export Team
            </button>
            <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-md text-sm font-bold shadow-lg shadow-orange-900/20">
              New Session
            </button>
          </div>
        </div>

        {/* TOP GRID: WINS & TRENDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* WIN/LOSS CHART (FROSTED) */}
          <div className="lg:col-span-2 bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold flex items-center gap-2"><TrendingUp size={16} className="text-orange-500"/> Performance Analytics</h3>
              <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">+12% vs last week</span>
            </div>
            {/* Visual placeholder for Chart */}
            <div className="h-48 flex items-end justify-between gap-2">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="w-full bg-gray-800 rounded-t-sm relative group">
                  <div 
                    className="absolute bottom-0 w-full bg-orange-500/50 group-hover:bg-orange-500 transition-all" 
                    style={{ height: `${h}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-mono">
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>

          {/* QUICK STATS CARD */}
          <div className="bg-orange-600 rounded-xl p-6 text-white flex flex-col justify-between shadow-2xl shadow-orange-900/40">
            <div>
              <p className="text-orange-200 text-xs font-bold uppercase tracking-wider">Overall Record</p>
              <h3 className="text-5xl font-black mt-2">42 — 18</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-orange-400/30">
              <p className="text-sm font-medium">Win Rate: 70%</p>
              <div className="w-full bg-orange-900/30 h-1.5 mt-2 rounded-full overflow-hidden">
                <div className="bg-white h-full w-[70%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM GRID: NOTES & RECENT SQUADS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* NOTES SECTION */}
          <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold flex items-center gap-2"><StickyNote size={16} className="text-orange-500"/> Strategic Notes</h3>
              <button className="text-gray-500 hover:text-orange-500"><Plus size={18}/></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-800/50 rounded-lg border-l-2 border-orange-500">
                <p className="text-xs text-gray-300">Incineroar usage is peaking. Need to practice the Gamos/Pelipper lead more to punish Fake Out.</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg border-l-2 border-gray-600">
                <p className="text-xs text-gray-300">Check speed tiers for Calyrex-Shadow at +1.</p>
              </div>
            </div>
          </div>

          {/* QUICK ADD / RECENT */}
          <div className="bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-xl p-6 flex items-center justify-center border-dashed group cursor-pointer hover:border-orange-500/50 transition-all">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-orange-500/20 group-hover:text-orange-500 transition-all">
                <Plus />
              </div>
              <p className="text-sm font-bold">Quick Build Team</p>
              <p className="text-xs text-gray-500">Start with a core or template</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
