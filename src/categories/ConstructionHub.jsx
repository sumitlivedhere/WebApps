import React from 'react';
import { constructionSectors } from '../data/constructionData';

export default function ConstructionHub({ onSelectSector, onBack }) {
  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. HEADER */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Construction & Building Hub (निर्माण कार्य)
        </span>
        <h1 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Ghar Ya Dukan Ka Nirman Karein
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          From map design & thekedars to building materials, JCB rentals & interior finishing.
        </p>
      </div>

      {/* 2. 6 SECTOR TILES */}
      <div className="space-y-3 pb-6">
        {constructionSectors.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectSector(tile.id, tile.name)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[88px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-600 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                    💰 {tile.rateGuide}
                  </span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}

        {/* BACK TO HOMEPAGE */}
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
    </section>
  );
}