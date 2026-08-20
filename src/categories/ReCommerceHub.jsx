import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function ReCommerceHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('recommerce');

  const handleSelect = (subId) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectCategory === 'function') {
      onSelectCategory(subId);
    }
  };

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-cyan-500/30">
        <div>
          <span className="text-2xl block">🛍️</span>
          <h2 className="text-base font-black leading-tight mt-1 text-cyan-200">
            Re-Commerce (पुराना सामान बेचें)
          </h2>
          <p className="text-[11px] font-semibold text-cyan-100">
            Used Mobiles, TV, Bikes & Furniture in {selectedCity}
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
          onClick={() => handleSelect('all')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Used Items</div>
            <div className="text-[9px] text-slate-400 font-normal">All listings</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-cyan-400"
          >
            <span className="text-xl">📦</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'सामान'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}