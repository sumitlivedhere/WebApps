import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import { getCategoryById } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function ListingsFeed({
  selectedCategory = 'vehicles',
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeListings = useStoreSlice('listings') || [];
  const categoryConfig = getCategoryById(selectedCategory) || { subCategories: [] };
  const subCategories = categoryConfig.subCategories || [];

  const filteredListings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();
    const sub = (selectedSubCategory || 'all').toLowerCase().trim();

    return storeListings.filter((item) => {
      if (!item) return false;

      // 1. Category Check
      const itemCat = String(item.category || '').toLowerCase().trim();
      if (itemCat && itemCat !== selectedCategory.toLowerCase()) return false;

      // 2. City Check
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 3. Subcategory Check
      if (sub !== 'all') {
        const itemSub = String(item.subCategory || '').toLowerCase().trim();
        const matchesSub = itemSub === sub || itemSub.includes(sub) || sub.includes(itemSub);
        if (!matchesSub) return false;
      }

      // 4. Search Query Check
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [storeListings, selectedCategory, selectedSubCategory, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (selectedSubCategory === 'all') return categoryConfig.name || 'All Listings';
    const matched = subCategories.find((s) => s.id === selectedSubCategory);
    return matched ? matched.name : selectedSubCategory.toUpperCase();
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Feed Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle().split('(')[0]}
          </h2>
          <p className="text-[10px] text-slate-500">
            {filteredListings.length} verified listings in {selectedCity}
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

      {/* Feed Cards */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">{categoryConfig.icon || '🏪'}</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No listings found under this subsection in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredListings.map((item) => {
          // Dynamic Google Maps link generated from coordinates
          const mapUrl =
            item.mapUrl ||
            (item.lat && item.lng
              ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
              : null);

          return (
            <article
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-xs border transition p-3.5 space-y-3 relative ${
                item.isNew ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:shadow-md'
              }`}
            >
              {/* Photo Display */}
              <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={
                    item.image ||
                    item.photo ||
                    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700'
                  }
                  alt={item.title || item.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
                  }}
                />
                <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                  {item.price || item.rent || item.rates || 'Contact for Price'}
                </span>

                <ListingDiscussionThread
                  listingId={item.id}
                  listingTitle={item.title || item.name}
                  sellerName={item.sellerName || 'Verified Member'}
                  sellerPhone={item.phone || item.whatsapp}
                  interestCount={item.interestCount || 0}
                  onNewNotification={onNewNotification}
                />
              </div>

              <div className="pt-0.5 space-y-1.5">
                <div className="flex items-start justify-between">
                  <h3 className="font-black text-slate-900 text-sm">{item.title || item.name}</h3>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                    {String(item.subCategory || 'SPOTLIGHT').toUpperCase()}
                  </span>
                </div>

                {item.description && (
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}

                {/* 📍 Verified Location & Google Maps Link */}
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
                      className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-[10px] font-black flex items-center space-x-1 shrink-0 transition"
                    >
                      <span>🗺️</span>
                      <span>View Map</span>
                    </a>
                  )}
                </div>
              </div>

              <ActionButtons
                phone={item.phone || '9876543201'}
                whatsapp={item.whatsapp || item.phone || '919876543201'}
                message={`Namaste ${item.sellerName || ''}, I found your listing "${item.title || ''}" on TownHub (${item.location || selectedCity}). Is this still available?`}
              />
            </article>
          );
        })
      )}
    </main>
  );
}