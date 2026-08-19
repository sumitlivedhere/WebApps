import React from 'react';

export const reCommerceCategories = [
  {
    id: 'all',
    name: 'All Used Items (सभी पुराने सामान)',
    desc: 'Explore every verified pre-owned item listed across town',
    icon: '🛍️',
    accent: 'from-indigo-500/10 to-blue-500/20 text-indigo-700',
    tag: '⚡ All Listings',
  },
  {
    id: 'mobiles',
    name: 'Mobiles & Tablets (मोबाइल व टैबलेट)',
    desc: 'iPhones, Android smartphones, iPads & genuine accessories',
    icon: '📱',
    accent: 'from-blue-500/10 to-indigo-500/20 text-blue-700',
    tag: '🔥 High Demand',
  },
  {
    id: 'bikes',
    name: 'Bikes & Two-Wheelers (बाइक व स्कूटी)',
    desc: 'Splendor, Activa, Pulsar, Royal Enfield & electric scooters',
    icon: '🏍️',
    accent: 'from-amber-500/10 to-orange-500/20 text-amber-700',
    tag: '🛵 Instant Deals',
  },
  {
    id: 'cars',
    name: 'Cars & Four-Wheelers (कार व चार पहिया)',
    desc: 'First-owner hatchbacks, sedans, SUVs & verified RC vehicles',
    icon: '🚗',
    accent: 'from-rose-500/10 to-red-500/20 text-rose-700',
    tag: '🚘 RC Verified',
  },
  {
    id: 'electronics',
    name: 'Electronics & Appliances (टीवी, फ्रिज व कूलर)',
    desc: 'Inverter ACs, Smart TVs, double door fridges & washing machines',
    icon: '📺',
    accent: 'from-cyan-500/10 to-blue-500/20 text-cyan-700',
    tag: '❄️ Tested Working',
  },
  {
    id: 'furniture',
    name: 'Home & Office Furniture (फर्नीचर व बेड)',
    desc: 'Double beds, wooden almirahs, sofa sets, study tables & chairs',
    icon: '🪑',
    accent: 'from-yellow-600/10 to-amber-500/20 text-yellow-800',
    tag: '🛋️ Solid Wood',
  },
  {
    id: 'fashion',
    name: 'Fashion & Accessories (कपड़े, जूते व घड़ियां)',
    desc: 'Wedding sherwanis, bridal lehengas, branded jackets & shoes',
    icon: '👗',
    accent: 'from-pink-500/10 to-rose-500/20 text-pink-700',
    tag: '✨ Like New',
  },
  {
    id: 'cycles-fitness',
    name: 'Bicycles & Gym Gear (साइकिल व फिटनेस)',
    desc: 'Gear bicycles, dumbbells, treadmills & home workout equipment',
    icon: '🚲',
    accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-700',
    tag: '💪 Fitness',
  },
  {
    id: 'books-hobbies',
    name: 'Books, Instruments & Hobbies (किताबें व शौक)',
    desc: 'Competition exam books, guitars, cameras & antique collectibles',
    icon: '📚',
    accent: 'from-purple-500/10 to-indigo-500/20 text-purple-700',
    tag: '📖 Exam Prep',
  },
];

export default function ReCommerceHub({ onSelectCategory, onBack }) {
  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      {/* 1. HEADER */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          Re-commerce Market (खरीदो-बेचो बाज़ार)
        </span>
        <h1 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Select What You Want To Buy / Sell
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Browse verified pre-owned products or list your unused goods directly for town buyers.
        </p>
      </div>

      {/* 2. CATEGORY SELECTION TILES */}
      <div className="space-y-3 pb-6">
        {reCommerceCategories.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectCategory(tile.id, tile.name)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[86px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  {tile.icon}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
                      {tile.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                  <span className="inline-block mt-1 text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded">
                    {tile.tag}
                  </span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}

        {/* BACK BUTTON */}
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