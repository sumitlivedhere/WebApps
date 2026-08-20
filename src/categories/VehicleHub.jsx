import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function VehicleHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectVehicleType,
  onBack,
}) {
  const categoryConfig = getCategoryById('vehicles');

  const handleSelect = (subId) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectVehicleType === 'function') {
      onSelectVehicleType(subId);
    }
  };

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 p-4 rounded-3xl text-white shadow-md flex items-center justify-between border border-blue-600/40">
        <div>
          <span className="text-2xl block">🚗</span>
          <h2 className="text-base font-black leading-tight mt-1 text-amber-300">
            Automobile Showrooms (नई गाड़ी व एजेंसी)
          </h2>
          <p className="text-[11px] font-semibold text-slate-300">
            Authorized car, bike, EV & tractor dealerships in {selectedCity}
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
            <div className="text-xs font-black">All Showrooms</div>
            <div className="text-[9px] text-slate-400 font-normal">Browse all new vehicles</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => handleSelect(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200 hover:border-blue-400"
          >
            <span className="text-xl">🚘</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">
                {sub.name.match(/\((.*?)\)/)?.[1] || 'एजेंसी'}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}