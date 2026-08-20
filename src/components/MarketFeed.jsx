import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function MarketFeed({
  products: propProducts,
  selectedSubCategory,
  selectedCategory,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeProducts = useStoreSlice('marketProducts');
  const allProducts = propProducts && propProducts.length > 0 ? propProducts : storeProducts;

  const targetSub = (selectedSubCategory || selectedCategory || 'all').toLowerCase().trim();

  const filteredProducts = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (allProducts || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Strict Subcategory Filter
      const itemSub = (item.subCategory || item.dealType || item.sub_category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        item.title?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.shopName?.toLowerCase().includes(q) ||
        item.sellerName?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [allProducts, targetSub, selectedCity, searchQuery]);

  const getMarketTitle = () => {
    switch (targetSub) {
      case 'new-openings': return 'New Openings & Launches (नई दुकानें व शुभारंभ)';
      case 'sales-clearance': return 'Mega Sales & Clearance (सेल व भारी छूट)';
      case 'special-deals': return 'Special Deals & Offers (खास ऑफर्स व डील्स)';
      case 'wholesalers': return 'Wholesalers & Bulk Supply (थोक विक्रेता व मंडी)';
      case 'brand-showrooms': return 'Brand Showrooms & Outlets (ब्रांडेड शोरूम)';
      case 'miscellaneous': return 'Miscellaneous Retail (अन्य बाज़ार स्टोर्स)';
      default: return 'All Market & Retail Listings';
    }
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getMarketTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">Live verified retail stores & deals in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {/* Retail Cards List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛒</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No market stores or offers found under {targetSub !== 'all' ? targetSub : 'this category'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredProducts.map((p) => (
          <article
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  p.image ||
                  p.photo ||
                  (p.images && p.images[0]) ||
                  'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=700'
                }
                alt={p.title || p.name}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {p.price || p.discount || 'Special Offer'}
              </span>

              <ListingDiscussionThread
                listingId={p.id}
                listingTitle={p.title || p.name}
                sellerName={p.shopName || p.sellerName || 'Store Manager'}
                sellerPhone={p.phone || p.whatsapp}
                interestCount={p.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm">{p.title || p.name}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(p.subCategory || 'RETAIL').toUpperCase()}
                </span>
              </div>

              {p.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{p.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {p.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{p.badge || '🟢 Verified Store'}</span>
              </div>
            </div>

            <ActionButtons
              phone={p.phone || '9876543210'}
              whatsapp={p.whatsapp || p.phone || '919876543210'}
              message={`Namaste, I am reaching out through TownHub regarding "${p.title || p.name}".`}
            />
          </article>
        ))
      )}
    </main>
  );
}