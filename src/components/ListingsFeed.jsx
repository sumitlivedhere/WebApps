import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function KaarigarHub({ selectedCity = 'Alwar', onSelectSubCategory, onBack }) {
  const categoryConfig = getCategoryById('kaarigar');

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 p-4 rounded-3xl text-slate-950 shadow-md flex items-center justify-between">
        <div>
          <span className="text-2xl block">🛠️</span>
          <h2 className="text-base font-black leading-tight mt-1">
            Kaarigar & Blue-Collar (कारीगर व मिस्त्री)
          </h2>
          <p className="text-[11px] font-bold text-amber-950">
            Verified local technicians & workers in {selectedCity}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-950 text-amber-400 px-3 py-1.5 rounded-xl font-black active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Subcategory Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectSubCategory('all')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Kaarigars</div>
            <div className="text-[9px] text-slate-400 font-normal">Browse all skilled trades</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelectSubCategory(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200"
          >
            <span className="text-xl">🔧</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">{sub.name.match(/\((.*?)\)/)?.[1] || 'सेवा'}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}