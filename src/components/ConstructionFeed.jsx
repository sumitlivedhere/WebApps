import React from 'react';
import { constructionSectors } from '../data/constructionData';

export default function ConstructionFeed({
  listings,
  selectedSectorId,
  sectorTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const activeSector = constructionSectors.find((s) => s.id === selectedSectorId);

  const filteredListings = listings
    .filter((item) => {
      if (selectedSectorId && selectedSectorId !== 'all') {
        return item.sectorId === selectedSectorId;
      }
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.proprietor.toLowerCase().includes(q) ||
        item.specialty.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeSector ? activeSector.icon : '🏗️'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {sectorTitle || 'Construction Providers'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified contractors & suppliers in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl font-bold border border-amber-200 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 2. LISTINGS CARDS */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🏗️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is sector me abhi koi provider register nahi hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Sectors
          </button>
        </div>
      ) : (
        filteredListings.map((item) => (
          <article
            key={item.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* CARD TOP */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    {item.name}
                  </h3>
                </div>
                <p className="text-xs font-bold text-amber-800 mt-0.5">
                  {item.proprietor}
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug">
                  {item.specialty}
                </p>
              </div>

              {item.rating && (
                <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm shrink-0 ml-2">
                  <span>★</span>
                  <span>{item.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* RATES, EXPERIENCE & LOCATION */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-800 font-black">
                <span>💰 Rate / Estimate:</span>
                <span className="font-bold text-slate-800 text-right">{item.rate}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-indigo-700 font-extrabold pt-1 border-t border-slate-200/50">
                <span>🏅 Track Record:</span>
                <span className="font-semibold text-slate-700">{item.experience}</span>
              </div>
              <div className="flex justify-between items-start text-[10px] text-slate-500 pt-0.5">
                <span>📍 <strong>Location:</strong> {item.location} ({item.landmark})</span>
                <span className="font-bold text-emerald-700 shrink-0 ml-1">{item.distance}</span>
              </div>
            </div>

            {/* BADGE */}
            {item.badge && (
              <span className="inline-block text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {item.badge}
              </span>
            )}

            {/* DIRECT CALL & WHATSAPP ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <a
                href={`tel:${item.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Provider</span>
              </a>
              <a
                href={`https://wa.me/${item.whatsapp}?text=Namaste, I am planning construction/renovation in Alwar and would like to get a quote from *${encodeURIComponent(item.name)}*.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 WhatsApp Quote</span>
              </a>
            </div>

          </article>
        ))
      )}

    </main>
  );
}