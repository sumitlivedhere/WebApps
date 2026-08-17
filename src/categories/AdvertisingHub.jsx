import React from 'react';
import { advertisingCategories } from '../data/advertisingData';

export default function AdvertisingHub({ onSelectCategory, onBack }) {
  const featuredAppPromo = advertisingCategories.find((c) => c.id === 'app-featured');
  const regularCategories = advertisingCategories.filter((c) => c.id !== 'app-featured');

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. HEADER */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
          Advertising & Branding Hub (विज्ञापन व प्रचार)
        </span>
        <h1 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Apne Vyapar Ka Prachar Karein
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Newspaper ads, pamphlet inserts, prime city hoardings, LED boards & app promotions.
        </p>
      </div>

      {/* 2. TOP HERO PROMO: PROMOTE ON THIS TOWN PWA APP */}
      {featuredAppPromo && (
        <div
          onClick={() => onSelectCategory(featuredAppPromo.id, featuredAppPromo.name)}
          className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl p-4 text-white shadow-lg border border-amber-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer mb-4 relative overflow-hidden group"
        >
          <div className="absolute -right-4 -bottom-6 text-7xl opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
            📢
          </div>

          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20">
              🔥 Spotlight Ad
            </span>
            <span className="text-[10px] font-bold text-amber-100">Direct Town Reach</span>
          </div>

          <h2 className="text-base font-black text-white leading-tight">
            Advertise On This Town App
          </h2>
          <p className="text-xs text-amber-50 mt-1 leading-snug max-w-[290px]">
            Put your banner right on the top homepage & category feeds. Instant WhatsApp inquiries from thousands of town buyers.
          </p>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20">
            <span className="text-[11px] font-extrabold text-amber-100">
              Starts ₹ 499 / week
            </span>
            <span className="text-xs font-black bg-white text-slate-900 px-3 py-1 rounded-xl shadow-sm flex items-center space-x-1">
              <span>Book In-App Slot</span>
              <span>➔</span>
            </span>
          </div>
        </div>
      )}

      {/* 3. 9 FLOATING SPECIALTY TILES */}
      <div className="space-y-3 pb-6">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider block px-1">
          Traditional & Outdoor Advertising
        </span>

        {regularCategories.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectCategory(tile.id, tile.name)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(245,158,11,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[86px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors leading-tight">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                    💰 {tile.rateGuide}
                  </span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}

        {/* BACK TO HOMEPAGE */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}