import React, { useState } from 'react';
import { marketCategories } from '../data/marketData';

export default function MarketHub({ onSelectMarketCategory, onSelectSubCategory, onBack }) {
  const [activeCategory, setActiveCategory] = useState(null); // When a category tile is expanded
  const [filterStoreType, setFilterStoreType] = useState('all'); // 'all' | 'main-market' | 'lane-workshop' | 'home-business'

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. SUBCATEGORY SELECTION VIEW */}
      {activeCategory ? (
        <div className="space-y-3.5 pb-6">
          <div className="flex items-center justify-between bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {activeCategory.name.split('(')[0]}
              </span>
              <h2 className="text-sm font-black text-slate-900 mt-1 leading-tight">
                Select Specialty or Section
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 active:scale-95 transition cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {activeCategory.subCategories.map((sub) => (
              <div
                key={sub.id}
                onClick={() => onSelectSubCategory(activeCategory.id, sub.id)}
                className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer flex flex-col items-center text-center group"
              >
                <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform">{sub.icon}</span>
                <h3 className="text-xs font-black text-slate-900 leading-tight">{sub.name}</h3>
                <span className="mt-2 text-[10px] text-emerald-600 font-bold">View Stores ➔</span>
              </div>
            ))}
          </div>

          {/* Quick View All in Category Button */}
          <button
            type="button"
            onClick={() => onSelectMarketCategory(activeCategory.id)}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl text-xs font-black shadow-md active:scale-95 transition cursor-pointer"
          >
            🛍️ View All {activeCategory.name.split('(')[0]} Products
          </button>
        </div>
      ) : (
        /* 2. ROOT MARKET CATEGORY TILES */
        <div>
          {/* HEADER WITH SHOPPING PREFERENCE BADGE */}
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              City Market Hub (नया सामान व दुकानें)
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
              Explore Town Shops & Creators
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live catalogs from Main Bazaar showrooms & Colony Artisans.
            </p>
          </div>

          {/* STORE ORIGIN FILTER PILLS */}
          <div className="flex space-x-1.5 overflow-x-auto no-scrollbar mb-3.5 pb-1">
            {[
              { id: 'all', label: 'All Stores & Makers' },
              { id: 'main-market', label: '🏢 Main Bazaar Showrooms' },
              { id: 'lane-workshop', label: '🛠️ Mohalla Workshops' },
              { id: 'home-business', label: '🏡 Colony Boutiques/Home' },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => setFilterStoreType(pill.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  filterStoreType === pill.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white/80 text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* 14 FLOATING MARKET SECTOR TILES */}
          <div className="space-y-3 pb-6">
            {marketCategories.map((tile) => (
              <div
                key={tile.id}
                onClick={() => setActiveCategory(tile)}
                className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[82px] flex items-center"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
                <div className="flex items-center justify-between pl-2 w-full">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                      {tile.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {tile.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                        {tile.desc}
                      </p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                    ➔
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2">
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}