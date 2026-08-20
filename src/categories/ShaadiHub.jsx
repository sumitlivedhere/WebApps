import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function ShaadiHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectShaadiCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('shaadi');

  const handleSelect = (subId, catName) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectShaadiCategory === 'function') {
      onSelectShaadiCategory(subId, catName);
    }
  };

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800 pb-10">
      {/* 1. Header */}
      <div className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-rose-400/30">
        <div>
          <span className="text-2xl block">💍</span>
          <h2 className="text-base font-black leading-tight mt-1 text-yellow-300">
            Shaadi & Wedding (विवाह सेवा)
          </h2>
          <p className="text-[11px] font-semibold text-rose-100">
            Banquets, Halwai, Tent, DJ & Photography in {selectedCity}
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

      {/* 2. Direct Subcategory Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleSelect('all', 'All Wedding Services')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Wedding Services</div>
            <div className="text-[9px] text-slate-400 font-normal">All verified local vendors</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id, sub.name)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-rose-400"
          >
            <span className="text-xl">{sub.icon || '🎪'}</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'सेवा'}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 3. Vendor Registration Banner */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-amber-600/40 rounded-2xl flex items-center justify-between text-white shadow-xs">
        <div className="flex items-center space-x-2.5">
          <span className="text-xl">🎪</span>
          <div>
            <div className="text-xs font-black text-amber-300">Are you a Wedding Vendor or Service Provider?</div>
            <div className="text-[10px] text-slate-300">List your services for families in {selectedCity}. Zero commission.</div>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 shrink-0 ml-2">List Free ➔</span>
      </div>
    </div>
  );
}