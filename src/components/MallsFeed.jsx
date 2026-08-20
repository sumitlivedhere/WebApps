import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import { getCategoryById } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function MallsFeed({
  stores: propStores,
  selectedSubCategory,
  selectedCategory,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeListings = useStoreSlice('mallsStores');
  const allStores = propStores && propStores.length > 0 ? propStores : storeListings;

  const targetSub = (selectedSubCategory || selectedCategory || 'all').toLowerCase().trim();
  const categoryConfig = getCategoryById('malls');

  const filteredStores = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (allStores || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Strict Subcategory Filter
      const itemSub = (item.subCategory || item.category || item.sub_category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.tagline?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [allStores, targetSub, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (targetSub === 'all') return 'All Flagship Showrooms & Boutiques';
    const matched = categoryConfig.subCategories.find((s) => s.id === targetSub);
    return matched ? matched.name : targetSub.replace('-', ' ').toUpperCase();
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">Live verified flagship showrooms & boutiques in {selectedCity}</p>
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
      {filteredStores.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">💎</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No flagship showrooms found under {targetSub !== 'all' ? targetSub : 'this category'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredStores.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  item.image ||
                  (item.images && item.images[0]) ||
                  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700'
                }
                alt={item.title || item.name}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {item.price || item.tagline || 'Flagship Store'}
              </span>

              <ListingDiscussionThread
                listingId={item.id}
                listingTitle={item.title || item.name}
                sellerName={item.title || item.name || 'Flagship Store'}
                sellerPhone={item.phone || item.whatsapp}
                interestCount={item.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{item.title || item.name}</h3>
                  {item.tagline && (
                    <p className="text-[11px] text-pink-600 font-bold mt-0.5">{item.tagline}</p>
                  )}
                </div>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(item.subCategory || 'FLAGSHIP').toUpperCase()}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {item.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{item.badge || item.timing || '🟢 Open Now'}</span>
              </div>
            </div>

            <ActionButtons
              phone={item.phone || '9876543210'}
              whatsapp={item.whatsapp || item.phone || '919876543210'}
              message={`Namaste, I saw "${item.title || item.name}" on TownHub Flagship Showrooms. I would like to inquire about visiting / checking new collections.`}
            />
          </article>
        ))
      )}
    </main>
  );
}