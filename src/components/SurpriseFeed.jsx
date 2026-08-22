import React, { useState, useMemo } from 'react';
import { hyperlocalStore, useInterestSlice } from '../store/hyperlocalStore';
import ActionButtons from './common/ActionButtons';
import ListingDetailModal from './common/ListingDetailModal';

function SurpriseCardItem({ item, selectedCity, onSelect, getMessageTemplate }) {
  const interestCount = useInterestSlice(
    item.id,
    Number(item.interestCount || item.interest_count || 0)
  );

  const handleStarClick = (e) => {
    e.stopPropagation();
    hyperlocalStore.incrementInterest(
      item.id,
      interestCount,
      item.title || item.name,
      item.sellerName || item.agencyName || item.providerName || 'Local Provider'
    );
  };

  const gallery =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700'];

  const coverImg = gallery[0];
  const priceDisplay = item.price || item.rates || item.rent || item.budget || 'Best Price';

  return (
    <article
      onClick={onSelect}
      className={`bg-slate-900/90 hover:bg-slate-900 border rounded-3xl overflow-hidden p-3.5 space-y-3 relative cursor-pointer transition active:scale-[0.99] shadow-lg ${
        item.isNew || item.featured
          ? 'border-amber-400/80 ring-2 ring-amber-400/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* 1. Photo Thumbnail Banner */}
      <div className="relative h-44 w-full bg-slate-950 rounded-2xl overflow-hidden select-none border border-slate-800">
        <img
          src={coverImg}
          alt={item.title || item.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
          }}
        />

        {/* Price / Rate Pill */}
        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-slate-950 bg-amber-400 shadow-md">
          {priceDisplay}
        </span>

        {/* Multi-Photo Indicator */}
        {gallery.length > 1 && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-lg text-white bg-slate-950/80 backdrop-blur-xs border border-white/10">
            📷 {gallery.length} Photos
          </span>
        )}

        {/* Live Star Interest Badge */}
        <button
          type="button"
          onClick={handleStarClick}
          className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-xl bg-slate-950/85 hover:bg-slate-950 text-amber-300 border border-amber-400/30 text-[10px] font-black flex items-center space-x-1 backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md"
        >
          <span>⭐</span>
          <span>{interestCount}</span>
        </button>
      </div>

      {/* 2. Listing Details */}
      <div className="pt-0.5 space-y-1.5">
        <div className="flex items-start justify-between">
          <div className="min-w-0 pr-2">
            <h3 className="font-black text-white text-sm leading-snug truncate">
              {item.title || item.name}
            </h3>
            {(item.sellerName || item.agencyName || item.driverName) && (
              <p className="text-[10px] text-amber-300 font-bold mt-0.5 truncate">
                👤 {item.sellerName || item.agencyName || item.driverName}
              </p>
            )}
          </div>

          <span className="text-[9px] font-black text-amber-300 bg-amber-500/10 border border-amber-400/30 px-2 py-0.5 rounded-lg uppercase tracking-wider shrink-0">
            {item.subCategory || item.category || 'DEAL'}
          </span>
        </div>

        {item.description && (
          <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
          <div className="flex items-center space-x-1 truncate max-w-[200px]">
            <span>📍</span>
            <span className="truncate">{item.location || selectedCity}</span>
          </div>

          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Verified • सत्यापित
          </span>
        </div>
      </div>

      {/* 3. 1-Click Action Buttons */}
      <div onClick={(e) => e.stopPropagation()}>
        <ActionButtons
          phone={item.phone || item.contact || '9876543210'}
          whatsapp={item.whatsapp || item.phone || item.contact || '919876543210'}
          message={getMessageTemplate(item)}
        />
      </div>
    </article>
  );
}

export default function SurpriseFeed({
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [shuffleKey, setShuffleKey] = useState(0);

  // Fetch and mix listings across all categories
  const surpriseListings = useMemo(() => {
    const allItems = hyperlocalStore.getAllListings() || [];
    const city = (selectedCity || '').toLowerCase().trim();
    const q = (searchQuery || '').toLowerCase().trim();

    // 1. City Filter (with fallback if city has no direct records)
    let matched = allItems.filter((item) => {
      if (!item || !item.id) return false;
      const itemCity = (item.city || '').toLowerCase().trim();
      const itemLoc = (item.location || item.location_name || '').toLowerCase().trim();
      return !city || itemCity === city || itemLoc.includes(city) || city.includes(itemCity);
    });

    // Fallback: If town has 0 matched items, use all store items so discovery is never empty
    if (matched.length === 0) {
      matched = allItems.filter((item) => item && item.id);
    }

    // 2. Tab Filter
    if (activeFilter === 'trending') {
      matched = matched.filter((item) => item.isNew || Number(item.interestCount || 0) > 1 || item.featured);
    } else if (activeFilter === 'services') {
      matched = matched.filter((item) =>
        ['kaarigar', 'transporters', 'white-collar', 'medical', 'education', 'creators', 'fitness'].includes(
          item.category
        )
      );
    } else if (activeFilter === 'property') {
      matched = matched.filter((item) => ['property', 'construction'].includes(item.category));
    } else if (activeFilter === 'food') {
      matched = matched.filter((item) => ['restaurants', 'market'].includes(item.category));
    } else if (activeFilter === 'deals') {
      matched = matched.filter((item) =>
        ['recommerce', 'vehicles', 'malls', 'shaadi', 'advertising'].includes(item.category)
      );
    }

    // 3. Search Query Filter
    if (q) {
      matched = matched.filter((item) => {
        const title = (item.title || item.name || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const loc = (item.location || '').toLowerCase();
        return title.includes(q) || desc.includes(q) || loc.includes(q);
      });
    }

    // 4. Randomize / Shuffle
    const shuffled = [...matched];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }, [selectedCity, searchQuery, activeFilter, shuffleKey]);

  const handleShuffle = () => {
    setShuffleKey((prev) => prev + 1);
  };

  const getMessageTemplate = (item) => {
    return `Namaste, I found your listing "${item.title || item.name}" in TownHub Surprise Discovery in ${selectedCity}. I want to inquire for more details.`;
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-100 pb-20 select-none">
      {/* 🌟 1. Header Banner with Shuffle Action */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 p-4 rounded-3xl text-slate-950 shadow-xl flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <div className="flex items-center space-x-1.5">
            <span className="text-lg">🎲</span>
            <h2 className="text-sm font-black uppercase tracking-wider leading-none">
              Surprise Discovery
            </h2>
          </div>
          <p className="text-[10px] font-bold text-slate-900 mt-1 truncate">
            Handpicked gems, verified services & deals in {selectedCity}
          </p>
        </div>

        <div className="flex items-center space-x-1.5 shrink-0">
          <button
            type="button"
            onClick={handleShuffle}
            title="Roll the Dice for new deals"
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-900 text-amber-300 text-xs font-black rounded-xl active:scale-90 transition cursor-pointer shadow-md flex items-center space-x-1"
          >
            <span>🎲</span>
            <span>Shuffle</span>
          </button>

          <button
            type="button"
            onClick={onBack}
            className="px-2.5 py-1.5 bg-slate-950/20 hover:bg-slate-950/40 text-slate-950 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 🌟 2. Filter Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto py-1 no-scrollbar text-xs font-bold">
        {[
          { id: 'all', label: '🌟 All Finds' },
          { id: 'trending', label: '🔥 Trending' },
          { id: 'services', label: '🛠️ Services' },
          { id: 'property', label: '🏠 Property' },
          { id: 'food', label: '🍔 Food & Kirana' },
          { id: 'deals', label: '🛍️ Deals & Wheels' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer active:scale-95 text-[11px] ${
              activeFilter === tab.id
                ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🌟 3. Listings Grid */}
      {surpriseListings.length === 0 ? (
        <div className="bg-slate-900/60 rounded-3xl p-10 text-center border border-slate-800 space-y-3">
          <span className="text-4xl block">🎲</span>
          <h3 className="text-sm font-black text-white">No listings found in this filter</h3>
          <p className="text-xs text-slate-400 max-w-[240px] mx-auto">
            Try switching back to "All Finds" or tap Shuffle to reload local recommendations.
          </p>
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {surpriseListings.map((item) => (
            <SurpriseCardItem
              key={item.id}
              item={item}
              selectedCity={selectedCity}
              onSelect={() => setSelectedDetailItem(item)}
              getMessageTemplate={getMessageTemplate}
            />
          ))}
        </div>
      )}

      {/* 🌟 4. Global Detail View Modal */}
      {selectedDetailItem && (
        <ListingDetailModal
          item={selectedDetailItem}
          selectedCity={selectedCity}
          onClose={() => setSelectedDetailItem(null)}
          onNewNotification={onNewNotification}
        />
      )}
    </main>
  );
}