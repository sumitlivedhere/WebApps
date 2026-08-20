import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

const ICON_MAP = {
  'smartphones-tablets': '📱',
  'laptops-computers': '💻',
  'home-appliances': '📺',
  'audio-wearables': '🎧',
  'cameras-cctv': '📹',
  'printers-accessories': '🖨️',
  'service-centers': '🛠️',
};

export default function ElectronicsHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectElectronicsType,
  onBack,
}) {
  const categoryConfig = getCategoryById('electronics');

  const handleSelect = (subId) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectElectronicsType === 'function') {
      onSelectElectronicsType(subId);
    }
  };

  return (
    <div className="p-3.5 space-y-3.5 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-950 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-cyan-800/40">
        <div>
          <span className="text-2xl block">📱</span>
          <h2 className="text-base font-black leading-tight mt-1 text-cyan-300">
            Electronics & Gadgets (इलेक्ट्रॉनिक्स)
          </h2>
          <p className="text-[11px] font-semibold text-slate-300">
            Showrooms, Gadgets & Authorized Service Centers in {selectedCity}
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

      {/* Featured Service Center Direct Card */}
      <div
        onClick={() => handleSelect('service-centers')}
        className="p-3.5 bg-gradient-to-r from-cyan-900 via-teal-900 to-slate-900 rounded-2xl border border-cyan-400/40 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.99] hover:border-cyan-300 transition"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xl font-black shrink-0">
            🛠️
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">Brand Service Centers</span>
              <span className="bg-emerald-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                Official
              </span>
            </div>
            <p className="text-[10px] text-cyan-200/90 font-medium">
              Samsung, Apple, Xiaomi, Realme, LG, HP & Dell repairs
            </p>
          </div>
        </div>
        <span className="text-cyan-300 font-black text-xs">Explore →</span>
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
            <div className="text-xs font-black">All Gadgets & Stores</div>
            <div className="text-[9px] text-slate-400 font-normal">All showroom listings</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-cyan-400"
          >
            <span className="text-xl">{ICON_MAP[sub.id] || '⚡'}</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'इलेक्ट्रॉनिक्स'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}