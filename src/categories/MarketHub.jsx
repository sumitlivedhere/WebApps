import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

const ICON_MAP = {
  'new-openings': '🎉',
  'sales-clearance': '🏷️',
  'special-deals': '🔥',
  'wholesalers': '📦',
  'brand-showrooms': '🏬',
  'miscellaneous': '🛍️',
};

export default function MarketHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectMarketCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('market');

  const handleSelect = (subId, catName) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectMarketCategory === 'function') {
      onSelectMarketCategory(subId, catName);
    }
  };

  return (
    <div className="p-3.5 space-y-3.5 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-emerald-500/30">
        <div>
          <span className="text-2xl block">🛒</span>
          <h2 className="text-base font-black leading-tight mt-1 text-emerald-200">
            Market & Retail (लोकल बाज़ार व डील्स)
          </h2>
          <p className="text-[11px] font-semibold text-emerald-100">
            Deals, Sales, Openings & Wholesalers in {selectedCity}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Spotlight 1: New Store Openings & Launches */}
      <div
        onClick={() => handleSelect('new-openings', 'New Openings')}
        className="p-3.5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 rounded-2xl border border-emerald-400/40 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] hover:border-emerald-300 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xl font-black shrink-0">
            🎉
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Grand Openings & Launches</span>
              <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                New
              </span>
            </div>
            <p className="text-[10px] text-emerald-200/90 font-medium">
              Newly launched showrooms, sweet shops & retail boutiques
            </p>
          </div>
        </div>
        <span className="text-emerald-300 font-black text-xs">Explore →</span>
      </div>

      {/* Spotlight 2: Special Deals & Clearance Sales */}
      <div
        onClick={() => handleSelect('special-deals', 'Special Deals')}
        className="p-3.5 bg-gradient-to-r from-rose-950 via-orange-950 to-slate-950 rounded-2xl border border-rose-500/40 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] hover:border-rose-400 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center text-xl font-black shrink-0">
            🔥
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Mega Sales & Exclusive Deals</span>
              <span className="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Hot
              </span>
            </div>
            <p className="text-[10px] text-rose-200/90 font-medium">
              Limited-time discounts, clearance sales & festival offers
            </p>
          </div>
        </div>
        <span className="text-rose-300 font-black text-xs">View Deals →</span>
      </div>

      {/* Subcategory Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleSelect('all', 'All Market Listings')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Market Stores</div>
            <div className="text-[9px] text-slate-400 font-normal">All market listings</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id, sub.name)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-emerald-400"
          >
            <span className="text-xl">{ICON_MAP[sub.id] || '🛒'}</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'बाज़ार'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}