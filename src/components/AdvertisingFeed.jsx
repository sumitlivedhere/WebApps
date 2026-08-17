import React from 'react';
import { advertisingCategories } from '../data/advertisingData';

export default function AdvertisingFeed({
  providers,
  selectedCategory,
  categoryTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const activeCatObj = advertisingCategories.find((c) => c.id === selectedCategory);

  const filteredProviders = providers
    .filter((p) => {
      if (selectedCategory && selectedCategory !== 'all') {
        return p.category === selectedCategory;
      }
      return true;
    })
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.provider.toLowerCase().includes(q) ||
        p.specialty.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeCatObj ? activeCatObj.icon : '📢'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {categoryTitle || 'Advertising Services'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified advertising vendors in {selectedCity}</p>
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

      {/* 2. PROVIDER CARDS */}
      {filteredProviders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">📢</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi direct vendor register nahi hain.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Ad Options
          </button>
        </div>
      ) : (
        filteredProviders.map((item) => (
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
                  {item.provider}
                </p>
                <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                  {item.specialty}
                </p>
              </div>

              {item.rating && (
                <div className="flex flex-col items-end shrink-0 ml-2">
                  <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                    <span>★</span>
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                    {item.deliveries}
                  </span>
                </div>
              )}
            </div>

            {/* RATES & TURNAROUND TIME */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-800 font-black">
                <span>💰 Rate / Pricing:</span>
                <span className="font-bold text-slate-800">{item.rate}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-indigo-700 font-extrabold pt-1 border-t border-slate-200/50">
                <span>⚡ Turnaround Time:</span>
                <span className="font-bold text-slate-700">{item.turnaround}</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-0.5">
                📍 <strong>Location:</strong> {item.location} ({item.landmark})
              </div>
            </div>

            {/* BADGE */}
            {item.badge && (
              <span className="inline-block text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {item.badge}
              </span>
            )}

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <a
                href={`tel:${item.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Vendor</span>
              </a>
              <a
                href={`https://wa.me/${item.whatsapp}?text=Namaste, I want to inquire about advertising services: *${encodeURIComponent(item.name)}* for my local business in Alwar.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 WhatsApp Inquiry</span>
              </a>
            </div>
          </article>
        ))
      )}
    </main>
  );
}