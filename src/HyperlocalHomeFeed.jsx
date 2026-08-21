import React from 'react';
import TownHubView from './categories/TownHubView';

const AVAILABLE_CITIES = ['Alwar', 'Jaipur', 'Rewari', 'Bharatpur', 'Bhiwadi'];

export default function HyperlocalHomeFeed({
  selectedCity = 'Alwar',
  onSelectCity,
  onSelectCategory,
  searchQuery = '',
  onSearchChange,
  onOpenPostModal,
}) {
  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      <style>{`
        @keyframes subtleWiggle {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-0.8deg) scale(1.008); }
          75% { transform: rotate(0.8deg) scale(1.008); }
        }
        .animate-subtle-wiggle {
          animation: subtleWiggle 3.2s ease-in-out infinite;
        }
      `}</style>

      {/* 1. CITY SELECTOR & SEARCH BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-4 rounded-3xl text-white shadow-lg border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
              📍 Current Town
            </span>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <select
                value={selectedCity}
                onChange={(e) => onSelectCity(e.target.value)}
                className="bg-slate-800/90 text-white font-black text-sm px-2.5 py-1 rounded-xl border border-slate-700 focus:outline-hidden focus:border-amber-400 cursor-pointer"
              >
                {AVAILABLE_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPostModal}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md active:scale-95 transition cursor-pointer"
          >
            + Post Free
          </button>
        </div>

        {/* Global Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search Plumber, 2 BHK Flat, Bolero, Doctor, Cafe..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 bg-slate-800/80 border border-slate-700 rounded-2xl font-bold text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
          />
          <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. 🌟 PROMINENT WIGGLING "SURPRISE ME" CATEGORY WITH LIGHT CURRENT FLOW */}
      <div className="relative animate-subtle-wiggle">
        {/* Continuous Conic Rotating Light Current Border */}
        <div className="absolute -inset-[2px] rounded-3xl overflow-hidden pointer-events-none">
          <div className="w-[250%] h-[250%] absolute -top-[75%] -left-[75%] bg-[conic-gradient(from_0deg,transparent_0_260deg,#fbbf24_300deg,#f59e0b_330deg,#ffffff_360deg)] animate-[spin_3.5s_linear_infinite]"></div>
        </div>

        {/* Outer Glow Halo */}
        <div className="absolute -inset-[1px] rounded-3xl bg-amber-400/25 blur-xs pointer-events-none"></div>

        {/* Surprise Card Trigger */}
        <button
          type="button"
          onClick={() => onSelectCategory('surprise')}
          className="relative z-10 w-full p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:to-indigo-900 text-white rounded-3xl font-black text-xs shadow-2xl flex items-center justify-between active:scale-[0.98] transition cursor-pointer border border-amber-400/30 group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg group-hover:scale-110 group-hover:rotate-12 transition">
              🎲
            </div>
            <div className="text-left">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-amber-300 text-sm tracking-tight">
                  Surprise Me! (कुछ नया देखें)
                </span>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-xs">
                  Trending
                </span>
              </div>
              <span className="block text-[11px] text-slate-300 font-medium leading-tight mt-1">
                Explore handpicked deals & verified services across all sectors
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[11px] font-black px-3 py-2 rounded-2xl shadow-md shrink-0 group-hover:translate-x-1 transition">
            <span>Open</span>
            <span>➔</span>
          </div>
        </button>
      </div>

      {/* 3. 17 TOP-LEVEL CATEGORIES DIRECTORY */}
      <TownHubView
        selectedCity={selectedCity}
        onSelectCategory={onSelectCategory}
      />
    </div>
  );
}