import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function WhiteCollarHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('white-collar');

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
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-cyan-800/40">
        <div>
          <span className="text-2xl block">👔</span>
          <h2 className="text-base font-black leading-tight mt-1 text-cyan-300">
            White Collar Professionals (प्रोफेशनल्स)
          </h2>
          <p className="text-[11px] font-semibold text-slate-300">
            Doctors, CA, Lawyers & Architects in {selectedCity}
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
          onClick={() => handleSelect('all', 'All Professionals')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Professionals</div>
            <div className="text-[9px] text-slate-400 font-normal">All expert consultants</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id, sub.name)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-cyan-400"
          >
            <span className="text-xl">💼</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'सलाहकार'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}