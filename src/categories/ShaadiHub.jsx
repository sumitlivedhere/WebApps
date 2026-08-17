import React, { useState } from 'react';
import { shaadiMilestones } from '../data/shaadiData';

export default function ShaadiHub({
  onSelectShaadiCategory,
  onNavigateCrossCategory, // For instant jumping to Kaarigar/Furniture/Electronics/Transporters
  onBack,
}) {
  const [weddingSide, setWeddingSide] = useState('groom'); // 'groom' (वर पक्ष) | 'bride' (वधू पक्ष)
  const [expandedMilestone, setExpandedMilestone] = useState('phase-1-house-prep');

  const toggleMilestone = (phaseId) => {
    setExpandedMilestone(expandedMilestone === phaseId ? null : phaseId);
  };

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP BANNER & WEDDING SIDE SELECTOR */}
      <div className="bg-gradient-to-r from-rose-900 via-amber-900 to-rose-950 rounded-3xl p-4 text-white shadow-xl border border-amber-400/30 mb-4 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-8 text-8xl opacity-15 pointer-events-none">
          🪅
        </div>

        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/40 px-2.5 py-0.5 rounded-full border border-amber-400/30 inline-block">
          Shaadi Logistics Hub (विवाह आयोजन)
        </span>
        <h1 className="text-base font-black text-white mt-1.5 leading-tight">
          Nuclear Family Wedding Planner
        </h1>
        <p className="text-[11px] text-amber-100/80 mt-0.5 max-w-[280px]">
          Organize vendors, house renovations, guest fleet & ceremonies without stress.
        </p>

        {/* SIDE SWITCHER (GROOM SIDE VS BRIDE SIDE) */}
        <div className="mt-3.5 bg-black/40 p-1 rounded-2xl border border-amber-400/40 flex items-center">
          <button
            type="button"
            onClick={() => setWeddingSide('groom')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              weddingSide === 'groom'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-[1.02]'
                : 'text-amber-200 hover:text-white'
            }`}
          >
            <span>🤴 वर पक्ष (Groom Side)</span>
          </button>

          <button
            type="button"
            onClick={() => setWeddingSide('bride')}
            className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
              weddingSide === 'bride'
                ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
                : 'text-rose-200 hover:text-white'
            }`}
          >
            <span>👰 वधू पक्ष (Bride Side)</span>
          </button>
        </div>
      </div>

      {/* 2. 7 PHASED MILESTONE ACCORDION */}
      <div className="space-y-3 pb-6">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Wedding Execution Timeline
          </span>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            7 Essential Steps
          </span>
        </div>

        {shaadiMilestones.map((phase) => {
          const isExpanded = expandedMilestone === phase.id;

          // Pick categories adaptively based on side
          let activeCategories = phase.categories;
          if (phase.id === 'phase-5-side-essentials') {
            activeCategories = weddingSide === 'groom' ? phase.groomCategories : phase.brideCategories;
          }

          return (
            <div
              key={phase.id}
              className={`bg-white/90 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all shadow-sm ${
                isExpanded ? 'border-amber-400/80 shadow-md ring-1 ring-amber-400/20' : 'border-slate-200/80'
              }`}
            >
              {/* ACCORDION HEADER */}
              <button
                type="button"
                onClick={() => toggleMilestone(phase.id)}
                className="w-full p-3.5 text-left flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 text-xl flex items-center justify-center shrink-0">
                    {phase.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded">
                        {phase.phaseNumber}
                      </span>
                      <h3 className="text-xs font-black text-slate-900 leading-tight">
                        {phase.title}
                      </h3>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {phase.subtitle}
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold shrink-0 ml-2">
                  {isExpanded ? '▲' : '▼'}
                </div>
              </button>

              {/* EXPANDED TILES INSIDE THIS PHASE */}
              {isExpanded && (
                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-2 bg-amber-50/20 animate-fade-in">
                  <div className="grid grid-cols-2 gap-2">
                    {activeCategories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          // If it is renovation/Kaarigar, route seamlessly
                          if (phase.id === 'phase-1-house-prep') {
                            onNavigateCrossCategory('kaarigar-hub');
                          } else {
                            onSelectShaadiCategory(cat.id, cat.name);
                          }
                        }}
                        className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs hover:border-amber-500 active:scale-95 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-2xl mb-1 block">{cat.icon}</span>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                            {cat.hint}
                          </p>
                        </div>
                        <span className="mt-2 text-[9px] font-bold text-amber-800 flex items-center">
                          View Providers ➔
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

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