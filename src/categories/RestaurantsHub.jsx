import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function RestaurantsHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('restaurants');

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
      <div className="bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-rose-400/30">
        <div>
          <span className="text-2xl block">🍔</span>
          <h2 className="text-base font-black leading-tight mt-1 text-yellow-200">
            Restaurants & Cafes (रेस्टोरेंट व कैफे)
          </h2>
          <p className="text-[11px] font-semibold text-rose-100">
            Family Dining, Cafes, Bakeries & Dhabas in {selectedCity}
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
          onClick={() => handleSelect('all', 'All Dining')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Dining</div>
            <div className="text-[9px] text-slate-400 font-normal">All food & cafes</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id, sub.name)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-rose-400"
          >
            <span className="text-xl">🍽️</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'भोजन'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}