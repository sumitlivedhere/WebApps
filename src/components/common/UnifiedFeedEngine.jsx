import React, { memo, useState } from 'react';
import { useStoreQuery, useInterestSlice, hyperlocalStore } from '../../store/hyperlocalStore';
import { getCategoryById } from '../../data/taxonomyRegistry';
import ActionButtons from './ActionButtons';
import ListingDetailModal from './ListingDetailModal';

const ListingCard = memo(function ListingCard({ item, selectedCity, onSelect }) {
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
      item.sellerName || item.driverName || 'Verified Member'
    );
  };

  const gallery =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600'];

  const coverImg = gallery[0];

  const mapUrl =
    item.mapUrl ||
    (item.lat && item.lng
      ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
      : null);

  return (
    <article
      onClick={onSelect}
      className={`bg-white rounded-2xl overflow-hidden shadow-xs border transition p-3.5 space-y-3 relative cursor-pointer hover:shadow-md active:scale-99 ${
        item.isNew ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
      }`}
    >
      {/* Photo Banner */}
      <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner select-none">
        <img
          src={coverImg}
          alt={item.title || item.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600';
          }}
        />

        {/* Price Tag */}
        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
          {item.price || item.rent || item.rates || 'Contact for Price'}
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
          className="absolute top-2.5 right-2.5 px-2 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-amber-300 border border-amber-400/30 text-[10px] font-black flex items-center space-x-1 backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md"
        >
          <span>⭐</span>
          <span>{interestCount}</span>
        </button>
      </div>

      {/* Card Details */}
      <div className="pt-0.5 space-y-1.5">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="font-black text-slate-900 text-sm leading-snug truncate max-w-[220px]">
              {item.title || item.name}
            </h3>
            {item.qualifications && (
              <p className="text-[10px] text-indigo-700 font-bold mt-0.5 truncate">
                🎓 {item.qualifications}
              </p>
            )}
            {item.sellerName && !item.qualifications && (
              <p className="text-[10px] text-slate-600 font-bold mt-0.5 truncate">
                👤 {item.sellerName}
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {String(item.subCategory || item.category || 'LISTING').toUpperCase()}
          </span>
        </div>

        {item.description && (
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1 text-slate-700 font-semibold truncate max-w-[220px]">
            <span>📍</span>
            <span className="truncate">{item.location || selectedCity}</span>
          </div>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-[10px] font-black flex items-center space-x-1 shrink-0 transition"
            >
              <span>🗺️</span>
              <span>View Map</span>
            </a>
          )}
        </div>
      </div>

      {/* 1-Click Action Buttons */}
      <div onClick={(e) => e.stopPropagation()}>
        <ActionButtons
          phone={item.phone || '9876543210'}
          whatsapp={item.whatsapp || item.phone || '919876543210'}
          message={`Namaste, I found "${item.title || item.name}" on TownHub. I want to inquire regarding your services in ${item.location || selectedCity}.`}
        />
      </div>
    </article>
  );
});

export default function UnifiedFeedEngine({
  category,
  subCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const listings = useStoreQuery({
    city: selectedCity,
    category,
    subCategory,
    searchQuery,
  });

  const categoryConfig = getCategoryById(category);
  const matchedSub = categoryConfig?.subCategories?.find((s) => s.id === subCategory);
  const title = subCategory === 'all' ? categoryConfig?.name : matchedSub?.name || subCategory;

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Dynamic Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">{title}</h2>
          <p className="text-[10px] text-slate-500">
            {listings.length} live verified listings in {selectedCity}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Listing Renderer */}
      {listings.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🔍</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No listings found under this category in {selectedCity}.
          </p>
        </div>
      ) : (
        listings.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            selectedCity={selectedCity}
            onSelect={() => setSelectedDetailItem(item)}
          />
        ))
      )}

      {/* Dedicated Detail View Modal */}
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