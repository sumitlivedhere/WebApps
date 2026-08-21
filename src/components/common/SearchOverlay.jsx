import React, { useMemo } from 'react';
import { searchHyperlocalListings } from '../../utils/searchEngine';

export default function SearchOverlay({
  query = '',
  allListings = [],
  selectedCity = 'Alwar',
  onClose,
  onSelectIntent,
  onSelectItem,
}) {
  // Sub-millisecond in-memory search execution
  const { intent, results, totalMatches } = useMemo(() => {
    return searchHyperlocalListings(query, allListings, { selectedCity, limit: 40 });
  }, [query, allListings, selectedCity]);

  if (!query.trim()) return null;

  return (
    <div className="fixed inset-x-0 top-[175px] bottom-16 z-30 max-w-md mx-auto bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100 animate-fade-in">
      
      {/* 🌟 Fixed Sub-Header with Query & Match Counter */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="text-amber-400 text-xs">⚡</span>
          <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider truncate">
            Results for "{query}"
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-lg">
            {totalMatches} Found
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-black text-slate-400 hover:text-white px-2 py-0.5 rounded-md hover:bg-slate-800 transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 🌟 Fully Scrollable Results Panel */}
      <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1 overscroll-contain pb-10">
        
        {/* Category Intent Quick-Jump Pill */}
        {intent && (
          <div
            onClick={() => onSelectIntent && onSelectIntent(intent.category, intent.subCategory)}
            className="p-3 bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-slate-900/50 border border-amber-400/40 rounded-2xl cursor-pointer active:scale-[0.98] transition shadow-md flex items-center justify-between group"
          >
            <div className="min-w-0 pr-2">
              <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider block">
                ⚡ Category Quick Match
              </span>
              <h4 className="text-xs font-black text-white truncate mt-0.5 group-hover:text-amber-300 transition">
                {intent.label}
              </h4>
              <p className="text-[10px] text-slate-300 truncate">
                Tap to explore all verified listings in {selectedCity}
              </p>
            </div>

            <div className="px-2.5 py-1.5 bg-amber-400 text-slate-950 rounded-xl text-[10px] font-black shrink-0 flex items-center space-x-1 shadow-md group-hover:translate-x-0.5 transition">
              <span>Explore</span>
              <span>➔</span>
            </div>
          </div>
        )}

        {/* Listings List */}
        {results.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800/60 p-6 space-y-2">
            <span className="text-3xl block">🔍</span>
            <p className="text-xs font-bold text-slate-300">
              No listings matched "{query}" in {selectedCity}
            </p>
            <p className="text-[10px] text-slate-500 max-w-[240px] mx-auto">
              Try searching with terms like "Plumber", "2 BHK", "Chota Hathi", "Gym", or "AC Repair".
            </p>
          </div>
        ) : (
          results.map((item) => {
            const coverImage =
              (item.images && item.images[0]) ||
              item.image ||
              'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300';

            const priceDisplay = item.price || item.rates || item.rent || item.budget;

            return (
              <article
                key={item.id}
                onClick={() => onSelectItem && onSelectItem(item)}
                className="p-2.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800/90 hover:border-amber-400/40 rounded-2xl transition cursor-pointer flex items-center space-x-3 active:scale-[0.99] shadow-xs"
              >
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/50">
                  <img
                    src={coverImage}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300';
                    }}
                  />
                </div>

                {/* Listing Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-slate-800 text-amber-300 border border-slate-700 truncate max-w-[120px]">
                      {item.subCategory || item.category || 'LISTING'}
                    </span>
                    {priceDisplay && (
                      <span className="text-[10px] font-black text-emerald-400 font-mono">
                        {priceDisplay}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xs font-black text-white truncate leading-snug">
                    {item.title || item.name}
                  </h3>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                    <span className="truncate max-w-[150px]">
                      📍 {item.location || selectedCity}
                    </span>
                    {(item.sellerName || item.driverName) && (
                      <span className="text-[9px] text-slate-500 truncate max-w-[90px]">
                        👤 {item.sellerName || item.driverName}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}