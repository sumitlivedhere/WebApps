import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

const ICON_MAP = {
  'modular-kitchen': '🍳',
  'interior-decorators': '🎨',
  'glass-aluminium': '🪟',
  'sofas-living': '🛋️',
  'beds-wardrobes': '🛏️',
  'dining-tables': '🪑',
  'home-decor-curtains': '🖼️',
};

export default function FurnitureHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectFurnitureType,
  onBack,
}) {
  const categoryConfig = getCategoryById('furniture');

  const handleSelect = (subId) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectFurnitureType === 'function') {
      onSelectFurnitureType(subId);
    }
  };

  return (
    <div className="p-3.5 space-y-3.5 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-amber-700/40">
        <div>
          <span className="text-2xl block">🛋️</span>
          <h2 className="text-base font-black leading-tight mt-1 text-amber-200">
            Furniture & Interior Decor (फर्नीचर व इंटीरियर)
          </h2>
          <p className="text-[11px] font-semibold text-slate-300">
            Modular Kitchens, Interior Stylists & Glass Work in {selectedCity}
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

      {/* Featured Spotlight: Modular Kitchen Contractors with Past Work Proof */}
      <div
        onClick={() => handleSelect('modular-kitchen')}
        className="p-3.5 bg-gradient-to-r from-amber-950 via-orange-950 to-slate-950 rounded-2xl border border-amber-500/40 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] hover:border-amber-400 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center text-xl font-black shrink-0">
            🍳
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Modular Kitchen Contractors</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Work Proofs
              </span>
            </div>
            <p className="text-[10px] text-amber-200/90 font-medium">
              Acrylic, PVC, Laminate kitchens & factory site proof portfolios
            </p>
          </div>
        </div>
        <span className="text-amber-300 font-black text-xs">View Portfolios →</span>
      </div>

      {/* Featured Spotlight: Interior Decorators & Home Stylists */}
      <div
        onClick={() => handleSelect('interior-decorators')}
        className="p-3.5 bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-950 rounded-2xl border border-purple-500/40 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] hover:border-purple-400 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl font-black shrink-0">
            🎨
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Interior Decorators & Turnkey Design</span>
              <span className="bg-purple-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Full 3D
              </span>
            </div>
            <p className="text-[10px] text-purple-200/90 font-medium">
              False ceiling, ambient lighting, wallpaper & luxury home styling
            </p>
          </div>
        </div>
        <span className="text-purple-300 font-black text-xs">Consult →</span>
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
            <div className="text-xs font-black">All Furniture & Decor</div>
            <div className="text-[9px] text-slate-400 font-normal">All listings & workshops</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-amber-400"
          >
            <span className="text-xl">{ICON_MAP[sub.id] || '🛋️'}</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'फर्नीचर'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}