import React, { useMemo, useState } from 'react';
import { useStoreSlice, useInterestSlice, hyperlocalStore } from '../store/hyperlocalStore';
import { getCategoryById } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDetailModal from './common/ListingDetailModal';

function WhiteCollarCardItem({ item, selectedCity, onSelect, getMessageTemplate }) {
  const interestCount = useInterestSlice(
    item.id,
    Number(item.interestCount || item.interest_count || 0)
  );

  const handleStarClick = (e) => {
    e.stopPropagation();
    hyperlocalStore.incrementInterest(
      item.id,
      interestCount,
      item.name || item.title,
      item.name || item.sellerName || 'Practitioner'
    );
  };

  const gallery =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700'];

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
        item.isNew ? 'border-indigo-400 ring-2 ring-indigo-400/20' : 'border-slate-200'
      }`}
    >
      {/* Photo Banner */}
      <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner select-none">
        <img
          src={coverImg}
          alt={item.name || item.title}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700';
          }}
        />

        {/* Consultation Fee / Rates Tag */}
        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
          {item.price || item.rates || 'Consultation on Appointment'}
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
              {item.name || item.title}
            </h3>
            {item.qualifications && (
              <p className="text-[11px] text-indigo-700 font-bold mt-0.5 truncate">
                🎓 {item.qualifications}
              </p>
            )}
            {item.regNumber && (
              <p className="text-[9px] text-slate-400 font-semibold truncate">
                Reg: {item.regNumber}
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {String(item.subCategory || item.profession || 'PROFESSIONAL').toUpperCase()}
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
          message={getMessageTemplate(item)}
        />
      </div>
    </article>
  );
}

export default function WhiteCollarFeed({
  professionals: propProfessionals,
  selectedProfession,
  selectedSubCategory,
  selectedCategory,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeProfessionals = useStoreSlice('whiteCollarListings') || [];
  const allProfessionals =
    propProfessionals && propProfessionals.length > 0 ? propProfessionals : storeProfessionals;

  const targetSub = (selectedProfession || selectedSubCategory || selectedCategory || 'all')
    .toLowerCase()
    .trim();
  const categoryConfig = getCategoryById('white-collar') || { subCategories: [] };
  const subCategories = categoryConfig.subCategories || [];

  const [selectedDetailItem, setSelectedDetailItem] = useState(null);

  const filteredProfessionals = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    const uniqueMap = new Map();

    (allProfessionals || []).forEach((item) => {
      if (!item || !item.id) return;

      // 1. City Filter
      const itemCity = (item.city || '').toLowerCase().trim();
      const itemLoc = (item.location || '').toLowerCase().trim();
      const matchesCity =
        !city ||
        itemCity === city ||
        itemLoc.includes(city) ||
        city.includes(itemCity);

      if (!matchesCity) return;

      // 2. Subcategory / Profession Filter
      const itemSub = (item.subCategory || item.profession || item.category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return;

      // 3. Search Query Filter
      if (q) {
        const matchesQuery =
          item.name?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.qualifications?.toLowerCase().includes(q) ||
          item.description?.toLowerCase().includes(q) ||
          item.location?.toLowerCase().includes(q) ||
          item.regNumber?.toLowerCase().includes(q);
        if (!matchesQuery) return;
      }

      uniqueMap.set(String(item.id), item);
    });

    return Array.from(uniqueMap.values());
  }, [allProfessionals, targetSub, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (targetSub === 'all') return 'All Professional Practitioners & Consultants';
    const matched = subCategories.find((s) => s.id === targetSub);
    return matched ? matched.name : targetSub.replace('-', ' ').toUpperCase();
  };

  const getMessageTemplate = (item) => {
    return `Namaste ${item.name || ''}, I found your professional profile on TownHub in ${selectedCity}. I would like to book a consultation / appointment.`;
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">
            {filteredProfessionals.length} live verified practitioners & consultants in {selectedCity}
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

      {/* Cards List */}
      {filteredProfessionals.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">👔</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No practitioners found under {targetSub !== 'all' ? targetSub : 'this category'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredProfessionals.map((item) => (
          <WhiteCollarCardItem
            key={item.id}
            item={item}
            selectedCity={selectedCity}
            onSelect={() => setSelectedDetailItem(item)}
            getMessageTemplate={getMessageTemplate}
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