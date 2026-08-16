import React from 'react';

export default function BuySellHub({ onSelectSubCategory, onBack }) {
  const buySellCategories = [
    { id: 'property', name: 'Property', desc: 'Flats, land, independent houses & rentals', icon: '🏠', accent: 'from-amber-500/10 to-orange-500/20 text-orange-600' },
    { id: 'vehicle', name: 'Vehicles', desc: 'Used bikes, scooters, cars & parts', icon: '🚗', accent: 'from-blue-500/10 to-indigo-500/20 text-indigo-600' },
    { id: 'furniture', name: 'Furniture', desc: 'Sofa sets, wooden beds & dining tables', icon: '🪑', accent: 'from-purple-500/10 to-pink-500/20 text-purple-600' },
    { id: 'electronics', name: 'Electronics', desc: 'Smartphones, LED TVs, laptops & appliances', icon: '📱', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'clothes', name: 'Clothes & Fashion', desc: 'Traditional wear, jackets & accessories', icon: '👕', accent: 'from-rose-500/10 to-pink-500/20 text-rose-600' },
    { id: 'misc', name: 'Miscellaneous', desc: 'Other used goods, books & town items', icon: '📦', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
  ];

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          Re-commerce Hub (खरीदो-बेचो)
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          What would you like to buy or sell?
        </h2>
      </div>

      <div className="space-y-3.5 pb-6">
        {buySellCategories.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectSubCategory(tile.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[88px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {tile.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                    {tile.desc}
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}

        {/* Back Button */}
        <div className="pt-3">
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