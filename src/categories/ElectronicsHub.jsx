import React from 'react';

export default function ElectronicsHub({ onSelectElectronicsType, onBack }) {
  const electronicsTypes = [
    { id: 'ac', name: 'AC (एयर कंडीशनर)', desc: 'Split AC, Window AC & Inverter AC (1/1.5/2 Ton)', icon: '❄️', accent: 'from-cyan-500/10 to-blue-500/20 text-cyan-600' },
    { id: 'tv', name: 'TV / LED / LCD', desc: 'Smart TVs, Android TVs (32", 43", 55"+)', icon: '📺', accent: 'from-indigo-500/10 to-violet-500/20 text-indigo-600' },
    { id: 'fridge', name: 'Fridge (रेफ्रिजरेटर)', desc: 'Single Door, Double Door & Frost-Free Fridges', icon: '🧊', accent: 'from-sky-500/10 to-teal-500/20 text-sky-600' },
    { id: 'washingmachine', name: 'Washing Machine', desc: 'Fully Automatic, Semi Automatic & Front Load', icon: '🧺', accent: 'from-blue-500/10 to-indigo-500/20 text-blue-600' },
    { id: 'geyser', name: 'Geyser (गीजर)', desc: 'Electric & Gas Water Heaters (10L / 15L / 25L)', icon: '♨️', accent: 'from-amber-500/10 to-orange-500/20 text-amber-600' },
    { id: 'pc', name: 'PC (डेस्कटॉप कंप्यूटर)', desc: 'Gaming PCs, Office Desktops, Monitors & CPUs', icon: '🖥️', accent: 'from-purple-500/10 to-pink-500/20 text-purple-600' },
    { id: 'laptop', name: 'Laptop (लैपटॉप)', desc: 'HP, Dell, Lenovo, Apple MacBook & Gaming Laptops', icon: '💻', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'smartphones', name: 'Smartphones (मोबाइल)', desc: 'iPhones, Samsung, OnePlus, Vivo, Realme & 5G Phones', icon: '📱', accent: 'from-rose-500/10 to-pink-500/20 text-rose-600' },
    { id: 'camera', name: 'Camera (कैमरा)', desc: 'DSLR, Mirrorless, GoPro & Studio Equipment', icon: '📸', accent: 'from-violet-500/10 to-purple-500/20 text-violet-600' },
    { id: 'misc-electronics', name: 'Miscellaneous (अन्य सामान)', desc: 'Microwaves, Inverters, Speakers & Home Theater', icon: '📻', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
  ];

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          Electronics Hub (इलेक्ट्रॉनिक्स बाज़ार)
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Select Electronics & Appliances
        </h2>
      </div>

      <div className="space-y-3 pb-6">
        {electronicsTypes.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectElectronicsType(tile.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(20,184,166,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[82px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-teal-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
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