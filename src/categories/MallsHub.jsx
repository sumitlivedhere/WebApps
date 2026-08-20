import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function MallsHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('malls');

  const handleSelect = (subId, catName) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectCategory === 'function') {
      onSelectCategory(subId, catName);
    }
  };

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-rose-600 to-purple-700 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-pink-400/30">
        <div>
          <span className="text-2xl block">👗</span>
          <h2 className="text-base font-black leading-tight mt-1 text-yellow-200">
            Shops & Showrooms (दुकान व शोरूम)
          </h2>
          <p className="text-[11px] font-semibold text-rose-100">
            Boutiques, Footwear, Jewelry & Kirana in {selectedCity}
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

      {/* Subcategory Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleSelect('all', 'All Stores')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Stores</div>
            <div className="text-[9px] text-slate-400 font-normal">Browse all retail</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id, sub.name)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-pink-400"
          >
            <span className="text-xl">🛍️</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'दुकान'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}