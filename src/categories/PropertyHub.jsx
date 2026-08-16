import React, { useState } from 'react';

export default function PropertyHub({ nestedPropType, onSelectNestedType, onSelectPropertyType, onBack }) {

  const mainPropertyTypes = [
    { id: 'tenancy', name: 'Tenancy / Rent (किराए पर मकान या दुकान)', desc: 'Houses, PG, Shops, Showrooms & Warehouses for rent', icon: '🔑', accent: 'from-teal-500/10 to-emerald-500/20 text-teal-700', hasSubTypes: true },    { id: 'flat', name: 'Flat / Apartment', desc: 'Ready to move flats & societies', icon: '🏢', accent: 'from-blue-500/10 to-indigo-500/20 text-blue-600' },
    { id: 'plot', name: 'Plot (प्लॉट)', desc: 'Residential & commercial registry plots', icon: '📐', accent: 'from-amber-500/10 to-yellow-500/20 text-amber-600' },
    { id: 'land', name: 'Land / Zameen (जमीन)', desc: 'Agricultural farm land & highway bighas', icon: '🌾', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'shop', name: 'Shop / Commercial (दुकान)', desc: 'Main market shops, godowns & showrooms', icon: '🏬', accent: 'from-purple-500/10 to-violet-500/20 text-purple-600' },
    { id: 'house', name: 'Independent House (मकान)', desc: 'Kothi, villas, 1/2 BHK & multi-story houses', icon: '🏠', accent: 'from-rose-500/10 to-orange-500/20 text-rose-600', hasSubTypes: true },
  ];

  const houseSubTypes = [
    { id: 'house-1bhk', name: '1 BHK House', desc: 'Compact independent unit', icon: '🚪' },
    { id: 'house-2bhk', name: '2 BHK House', desc: 'Standard family home', icon: '🏡' },
    { id: 'house-3bhk', name: '3 BHK House', desc: 'Spacious independent home', icon: '🏘️' },
    { id: 'house-large', name: 'Large / Kothi (4+ BHK)', desc: 'Luxury villas & big bungalows', icon: '🏰' },
    { id: 'house-1floor', name: '1 Manzil (Single Storey)', desc: 'Ground floor independent setup', icon: '🏠' },
    { id: 'house-2floor', name: '2 Manzil (Duplex / Double Storey)', desc: 'Ground + 1st floor building', icon: '🏗️' },
  ];

  const tenancySubTypes = [
    { id: 'rent-house', name: 'Residential House / Flat / PG', desc: 'For living, families & students', icon: '🏡' },
    { id: 'rent-shop', name: 'Shop / Showroom / Godown', desc: 'For retail business & commercial use', icon: '🏬' },
  ];

 return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      {/* 1. NESTED VIEW: HOUSE OR TENANCY TYPE BREAKDOWN */}
      {nestedPropType ? (
        <div className="space-y-3.5 pb-6">
          <div className="flex items-center justify-between bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {nestedPropType === 'house' ? 'House Selection (मकान)' : 'Tenancy Selection (किराया)'}
              </span>
              <h2 className="text-sm font-black text-slate-900 mt-1 leading-tight">
                {nestedPropType === 'house' ? 'Select House Type & Size' : 'Select Rental Type'}
              </h2>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBack(); // Triggers global goBack, returning nestedPropType to null seamlessly
              }}
              className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 active:scale-95 transition cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {(nestedPropType === 'house' ? houseSubTypes : tenancySubTypes).map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectPropertyType(item.id)}
                className="bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <span className="text-3xl mb-1.5">{item.icon}</span>
                <h3 className="text-xs font-black text-slate-900 leading-tight">{item.name}</h3>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. ROOT PROPERTY SELECTION TILES */
        <div>
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Property Hub (प्रॉपर्टी बाज़ार)
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
              Select Property Category
            </h2>
          </div>

          <div className="space-y-3.5 pb-6">
            {mainPropertyTypes.map((tile) => (
              <div
                key={tile.id}
                onClick={() => {
                  if (tile.id === 'tenancy' || tile.hasSubTypes) {
                    onSelectNestedType(tile.id);
                  } else {
                    onSelectPropertyType(tile.id);
                  }
                }}
                className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[88px] flex items-center"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
                <div className="flex items-center justify-between pl-2 w-full">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                      {tile.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-amber-700 transition-colors">
                        {tile.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                        {tile.desc}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                    ➔
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}