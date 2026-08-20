import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import { getCategoryById } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function AdvertisingFeed({
  selectedSubCategory,
  selectedCategory,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeListings = useStoreSlice('advertisingProviders');
  const targetSub = (selectedSubCategory || selectedCategory || 'all').toLowerCase().trim();
  const categoryConfig = getCategoryById('advertising');

  const filteredListings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (storeListings || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Subcategory Filter
      const itemSub = (item.subCategory || item.category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.agencyName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [storeListings, targetSub, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (targetSub === 'all') return 'All Advertising, Spaces & Promotion';
    const matched = categoryConfig.subCategories.find((s) => s.id === targetSub);
    return matched ? matched.name : targetSub.replace('-', ' ').toUpperCase();
  };

  const getMessageTemplate = (item) => {
    const sub = (item.subCategory || '').toLowerCase();
    if (sub.includes('private-space')) {
      return `Namaste ${item.agencyName || ''}, I saw your space listing "${item.name || item.title}" on TownHub. I want to inquire regarding renting your rooftop/wall for advertising in ${selectedCity}.`;
    }
    if (sub.includes('brands-seeking')) {
      return `Namaste, I saw your brand requirement "${item.name || item.title}" on TownHub. I have a high-traffic wall available in ${selectedCity}. Can we discuss?`;
    }
    if (sub.includes('newspaper')) {
      return `Namaste ${item.agencyName || ''}, I want to book a classified / display newspaper advertisement in ${selectedCity}.`;
    }
    if (sub.includes('townhub')) {
      return `Namaste TownHub Team, I want to advertise my business with a top banner on the TownHub App in ${selectedCity}.`;
    }
    return `Namaste, I found "${item.name || item.title}" on TownHub Advertising. I want to inquire about rates & campaign availability in ${selectedCity}.`;
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">Live verified spaces, printers & ad networks in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Channels
        </button>
      </div>

      {/* Cards List */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">📢</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No listings found under {targetSub !== 'all' ? targetSub : 'this category'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredListings.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-44 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  item.image ||
                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700'
                }
                alt={item.name || item.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {item.price || 'Rates on Inquiry'}
              </span>

              <ListingDiscussionThread
                listingId={item.id}
                listingTitle={item.name || item.title}
                sellerName={item.agencyName || item.name || 'Ad Agency / Space Owner'}
                sellerPhone={item.phone || item.whatsapp}
                interestCount={item.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-snug">{item.name || item.title}</h3>
                  {item.agencyName && (
                    <p className="text-[10px] text-amber-700 font-bold mt-0.5">📢 {item.agencyName}</p>
                  )}
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(item.subCategory || 'PROMO').replace('private-space-', '').replace('brands-seeking-', '').toUpperCase()}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-100">
                <span>📍 {item.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{item.badge || item.timing || '🟢 Available for Booking'}</span>
              </div>
            </div>

            <ActionButtons
              phone={item.phone || '9876543210'}
              whatsapp={item.whatsapp || item.phone || '919876543210'}
              message={getMessageTemplate(item)}
            />
          </article>
        ))
      )}
    </main>
  );
}