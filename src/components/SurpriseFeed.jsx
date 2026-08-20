import React, { useState, useMemo } from 'react';
import { TAXONOMY_REGISTRY, getCategoryById } from '../data/taxonomyRegistry';
import { useAllListingsSlice } from '../store/hyperlocalStore';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function SurpriseFeed({
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const allListings = useAllListingsSlice();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [shuffleSeed, setShuffleSeed] = useState(0);

  // Filter and pseudo-randomly shuffle on demand
  const surpriseListings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();
    const filterCat = activeCategoryFilter.toLowerCase().trim();

    const filtered = (allListings || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Category Filter Pill
      const itemCat = (item.category || '').toLowerCase().trim();
      const matchesCat = filterCat === 'all' || itemCat === filterCat;
      if (!matchesCat) return false;

      // 3. Search Query
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.sellerName?.toLowerCase().includes(q)
      );
    });

    // Deterministic shuffle using seed
    return [...filtered].sort(() => 0.5 - Math.random());
  }, [allListings, selectedCity, activeCategoryFilter, searchQuery, shuffleSeed]);

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 rounded-3xl text-slate-950 shadow-lg flex items-center justify-between border border-amber-300/40">
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="text-2xl animate-bounce">🎲</span>
            <h2 className="text-base font-black leading-tight">
              Surprise Discovery (टाउन एक्सप्लोरर)
            </h2>
          </div>
          <p className="text-[11px] font-bold text-amber-950 mt-0.5">
            Handpicked & verified cross-sector listings in {selectedCity}
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={() => setShuffleSeed((prev) => prev + 1)}
            className="p-2 bg-slate-950 hover:bg-slate-900 text-amber-300 rounded-xl text-xs font-black active:scale-90 transition cursor-pointer shadow-md flex items-center space-x-1"
            title="Roll for new surprise deals"
          >
            <span>🎲</span>
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-slate-950 text-white px-3 py-2 rounded-xl font-black active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCategoryFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-black shrink-0 transition cursor-pointer ${
            activeCategoryFilter === 'all'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          🌟 All Surprise Deals
        </button>
        {TAXONOMY_REGISTRY.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategoryFilter(c.id)}
            className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold shrink-0 transition cursor-pointer flex items-center space-x-1 ${
              activeCategoryFilter === c.id
                ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                : 'bg-slate-900/90 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <span>{c.icon}</span>
            <span>{c.name.split('(')[0]}</span>
          </button>
        ))}
      </div>

      {/* Cards List */}
      {surpriseListings.length === 0 ? (
        <div className="bg-slate-900/80 rounded-2xl p-8 text-center border border-slate-800 text-slate-300">
          <span className="text-4xl block">🔍</span>
          <p className="font-bold text-xs mt-2">
            No matching listings found in {selectedCity}.
          </p>
        </div>
      ) : (
        surpriseListings.map((item) => {
          const catObj = getCategoryById(item.category);
          return (
            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
            >
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={
                    item.image ||
                    (item.images && item.images[0]) ||
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700'
                  }
                  alt={item.title || item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
                  }}
                />

                {/* Category Pill */}
                <span className="absolute top-2.5 left-2.5 text-[10px] font-black px-2.5 py-1 rounded-lg text-white bg-slate-950/85 backdrop-blur-md border border-white/10 flex items-center space-x-1">
                  <span>{catObj.icon}</span>
                  <span className="uppercase">{catObj.id} • {item.subCategory}</span>
                </span>

                {/* Price Tag */}
                <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                  {item.price || item.rates || item.fees || item.visitingCharge || 'Best Price'}
                </span>

                <ListingDiscussionThread
                  listingId={item.id}
                  listingTitle={item.title || item.name}
                  sellerName={item.sellerName || item.name || 'Verified Member'}
                  sellerPhone={item.phone || item.whatsapp}
                  interestCount={item.interestCount || 0}
                  onNewNotification={onNewNotification}
                />
              </div>

              <div className="pt-0.5">
                <div className="flex items-start justify-between">
                  <h3 className="font-black text-slate-900 text-sm leading-snug">
                    {item.title || item.name}
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                    {item.sellerName || 'Verified'}
                  </span>
                </div>

                {item.description && (
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                  <span>📍 {item.location || selectedCity}</span>
                  <span className="text-emerald-700 font-bold">{item.distance || '0.1 km away'}</span>
                </div>
              </div>

              <ActionButtons
                phone={item.phone || '9876543210'}
                whatsapp={item.whatsapp || item.phone || '919876543210'}
                message={`Namaste, I found "${item.title || item.name}" via Surprise Me on TownHub.`}
              />
            </article>
          );
        })
      )}
    </main>
  );
}