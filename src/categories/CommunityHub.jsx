import React from 'react';
import { communityCategories } from '../data/communityData';

export default function CommunityHub({ onSelectPillar, onBack }) {
  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
          Community & Social Welfare (समाज सेवा व नगर कल्याण)
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Apne Shahar Ke Liye Seva Karein
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Join volunteer drives, donate books/clothes, support hospitals, or help green the town.
        </p>
      </div>

      <div className="space-y-3 pb-6">
        {communityCategories.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectPillar(tile.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(244,63,94,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[82px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {tile.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-rose-700 transition-colors">
                      {tile.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                  <span className="inline-block text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded mt-1">
                    {tile.count}
                  </span>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-rose-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
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
    </section>
  );
}