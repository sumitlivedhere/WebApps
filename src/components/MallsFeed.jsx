import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function MallsFeed({
  stores: propStores,
  selectedSubCategory,
  selectedCategoryId,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeStores = useStoreSlice('mallsStores');
  const allStores = propStores && propStores.length > 0 ? propStores : storeStores;

  const targetSub = (selectedSubCategory || selectedCategoryId || 'all').toLowerCase().trim();

  const filteredStores = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (allStores || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Strict Subcategory / Store Type Filter
      const itemSub = (item.subCategory || item.shopType || item.storeType || item.sub_category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.sellerName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [allStores, targetSub, selectedCity, searchQuery]);

  const getStoreTitle = () => {
    switch (targetSub) {
      case 'clothing': return 'Clothing & Garments (कपड़े व परिधान)';
      case 'footwear': return 'Footwear & Shoes (जूते व चप्पल)';
      case 'jewelry': return 'Jewelry & Ornaments (आभूषण व ज्वेलरी)';
      case 'electronics-store': return 'Electronics & Mobiles (इलेक्ट्रॉनिक्स व मोबाइल)';
      case 'kirana': return 'Kirana & Supermarket (किराना व जनरल स्टोर)';
      default: return 'All Shops & Showrooms';
    }
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getStoreTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">Retail stores & showrooms in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {/* Store Cards */}
      {filteredStores.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">👗</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No showrooms or shops found under {targetSub !== 'all' ? targetSub : 'this section'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredStores.map((s) => (
          <article
            key={s.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  s.image ||
                  s.photo ||
                  s.logo ||
                  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700'
                }
                alt={s.name || s.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {s.price || 'Open Today'}
              </span>

              <ListingDiscussionThread
                listingId={s.id}
                listingTitle={s.name || s.title}
                sellerName={s.sellerName || 'Store Manager'}
                sellerPhone={s.phone || s.whatsapp}
                interestCount={s.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm">{s.name || s.title}</h3>
                <span className="text-[10px] font-bold text-pink-800 bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(s.subCategory || s.shopType || 'STORE').toUpperCase()}
                </span>
              </div>

              {s.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{s.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {s.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{s.distance || '0.1 km away'}</span>
              </div>
            </div>

            <ActionButtons
              phone={s.phone || '9876543210'}
              whatsapp={s.whatsapp || s.phone || '919876543210'}
              message={`Namaste, I want to inquire about products/offers at "${s.name || s.title}".`}
            />
          </article>
        ))
      )}
    </main>
  );
}