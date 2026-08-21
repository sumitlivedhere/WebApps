import React, { useMemo, useState } from 'react';
import { useStoreSlice, useInterestSlice, hyperlocalStore } from '../store/hyperlocalStore';
import { getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDetailModal from './common/ListingDetailModal';

function TransporterCardItem({ item, selectedCity, onSelect }) {
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
      item.sellerName || item.driverName || 'Transporter'
    );
  };

  const gallery = item.images && item.images.length > 0 ? item.images : [item.image];
  const coverImg = gallery[0] || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700';

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
      <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
        <img
          src={coverImg}
          alt={item.title || item.name}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700';
          }}
        />

        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
          {item.price || item.rates || '₹ Contact for Rate'}
        </span>

        {gallery.length > 1 && (
          <span className="absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-0.5 rounded-lg text-white bg-slate-950/80 backdrop-blur-xs border border-white/10">
            📷 {gallery.length} Photos
          </span>
        )}

        <button
          type="button"
          onClick={handleStarClick}
          className="absolute top-2.5 right-2.5 px-2 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-amber-300 border border-amber-400/30 text-[10px] font-black flex items-center space-x-1 backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md"
        >
          <span>⭐</span>
          <span>{interestCount}</span>
        </button>
      </div>

      <div className="pt-0.5 space-y-1.5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm">{item.title || item.name}</h3>
            {(item.driverName || item.sellerName) && (
              <p className="text-[10px] text-blue-700 font-bold">
                Driver/Owner: {item.driverName || item.sellerName}
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {String(item.subCategory || item.vehicleType || 'TRANSPORT').toUpperCase()}
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

      <div onClick={(e) => e.stopPropagation()}>
        <ActionButtons
          phone={item.phone || '9876543201'}
          whatsapp={item.whatsapp || item.phone || '919876543210'}
          message={`Namaste ${item.sellerName || item.driverName || ''}, I found your vehicle/transport listing "${item.title || ''}" on TownHub (${item.location || selectedCity}). I need transport service. Are you available?`}
        />
      </div>
    </article>
  );
}

export default function TransporterFeed({
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const transportFirms = useStoreSlice('transportFirms') || [];
  const individualTransporters = useStoreSlice('individualTransporters') || [];

  const categoryConfig = getCategoryById('transporters') || { subCategories: [] };
  const subCategories = categoryConfig.subCategories || [];

  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const filteredListings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const targetCity = (selectedCity || 'Alwar').toLowerCase().trim();
    const sub = (selectedSubCategory || 'all').toLowerCase().trim();
    const targetSub = sanitizeSubCategoryId('transporters', sub);

    const uniqueMap = new Map();
    const allTransportItems = [...transportFirms, ...individualTransporters];

    allTransportItems.forEach((item) => {
      if (!item || !item.id) return;

      const itemCity = (item.city || '').toLowerCase().trim();
      const itemLoc = (item.location || '').toLowerCase().trim();
      const matchesCity =
        !targetCity ||
        itemCity === targetCity ||
        itemLoc.includes(targetCity) ||
        targetCity.includes(itemCity);

      if (!matchesCity) return false;

      if (targetSub !== 'all' && targetSub !== 'transporters') {
        const rawSub = String(item.subCategory || item.vehicleType || item.trade || '').toLowerCase().trim();
        const sanitizedItemSub = sanitizeSubCategoryId('transporters', rawSub);

        const matchesSub =
          sanitizedItemSub === targetSub ||
          rawSub === targetSub ||
          rawSub.includes(targetSub) ||
          targetSub.includes(rawSub);

        if (!matchesSub) return false;
      }

      if (q) {
        const matchesQuery =
          item.title?.toLowerCase().includes(q) ||
          item.name?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.vehicleType?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q);

        if (!matchesQuery) return false;
      }

      uniqueMap.set(String(item.id), item);
    });

    return Array.from(uniqueMap.values());
  }, [transportFirms, individualTransporters, selectedSubCategory, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (selectedSubCategory === 'all' || selectedSubCategory === 'transporters') {
      return 'All Transporters, Trucks & Commercial Vehicles (ट्रांसपोर्ट व गाड़ियां)';
    }
    const matched = subCategories.find((s) => s.id === selectedSubCategory);
    return matched ? matched.name : selectedSubCategory.toUpperCase();
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle().split('(')[0]}
          </h2>
          <p className="text-[10px] text-slate-500">
            {filteredListings.length} verified commercial vehicles & transport offices in {selectedCity}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {filteredListings.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🚛</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No transport vehicles found under this subsection in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredListings.map((item) => (
          <TransporterCardItem
            key={item.id}
            item={item}
            selectedCity={selectedCity}
            onSelect={() => setSelectedDetailItem(item)}
          />
        ))
      )}

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