import React from 'react';

export default function FurnitureHub({ onSelectFurnitureType, onBack }) {
  const furnitureTypes = [
    { id: 'bed', name: 'Bed (पलंग / दीवान)', desc: 'King, Queen, Double Bed, Single Bed & Box Diwans', icon: '🛏️', accent: 'from-amber-500/10 to-orange-500/20 text-amber-700' },
    { id: 'sofa', name: 'Sofa (सोफा सेट)', desc: '3+1+1 Sets, L-Shape Corner Sofas & Recliners', icon: '🛋️', accent: 'from-purple-500/10 to-pink-500/20 text-purple-600' },
    { id: 'table', name: 'Table (सेंटर टेबल)', desc: 'Glass top, wooden coffee tables & side tables', icon: '🪵', accent: 'from-yellow-600/10 to-amber-500/20 text-yellow-800' },
    { id: 'mattress', name: 'Gadde / Mattress (गद्दे)', desc: 'Kurlon, Sleepwell, Memory Foam & Cotton Mattresses', icon: '🛌', accent: 'from-teal-500/10 to-emerald-500/20 text-teal-600' },
    { id: 'dining', name: 'Dining Set (डाइनिंग टेबल)', desc: '4-Seater, 6-Seater Wooden & Glass Dining Tables', icon: '🍽️', accent: 'from-rose-500/10 to-red-500/20 text-rose-600' },
    { id: 'dressing', name: 'Dressing (ड्रेसिंग टेबल)', desc: 'Full length mirrors, makeup vanity & drawer units', icon: '🪞', accent: 'from-pink-500/10 to-purple-500/20 text-pink-600' },
    { id: 'shoerack', name: 'Shoe Rack (जूता रैक)', desc: 'Closed cabinet, wooden & metal shoe organizers', icon: '👟', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
    { id: 'studytable', name: 'Study Table (पढ़ाई की मेज)', desc: 'Computer tables, student desks & office workstations', icon: '📚', accent: 'from-blue-500/10 to-indigo-500/20 text-blue-600' },
  ];

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Furniture Hub (फर्नीचर बाज़ार)
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Select Furniture Item
        </h2>
      </div>

      <div className="space-y-3 pb-6">
        {furnitureTypes.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectFurnitureType(tile.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[82px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
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