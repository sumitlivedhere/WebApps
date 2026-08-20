import React, { useMemo } from 'react';
import ActionButtons from '../common/ActionButtons';
import ListingDiscussionThread from '../common/ListingDiscussionThread';

export default function ReCommerceFeed({
  listings = [],
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const filteredListings = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();
    const targetSub = (selectedSubCategory || 'all').toLowerCase().trim();

    return (listings || []).filter((item) => {
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      const itemSub = (item.subCategory || item.itemType || item.sub_category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [listings, selectedSubCategory, selectedCity, searchQuery]);

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {selectedSubCategory !== 'all' ? selectedSubCategory.replace('-', ' ') : 'Re-Commerce / Used Items'}
          </h2>
          <p className="text-[10px] text-slate-500">Mobiles, TV, Bikes & Furniture in {selectedCity}</p>
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
          <span className="text-3xl">🛍️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No pre-owned items found in this category for {selectedCity}.
          </p>
        </div>
      ) : (
        filteredListings.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  item.image ||
                  item.photo ||
                  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700'
                }
                alt={item.name || item.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {item.price || 'Contact for Price'}
              </span>

              <ListingDiscussionThread
                listingId={item.id}
                listingTitle={item.name || item.title}
                sellerName={item.sellerName || 'Seller'}
                sellerPhone={item.phone || item.whatsapp}
                interestCount={item.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm">{item.name || item.title}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {item.condition || 'Used - Good'}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {item.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{item.distance || '0.1 km away'}</span>
              </div>
            </div>

            <ActionButtons
              phone={item.phone || '9876543210'}
              whatsapp={item.whatsapp || item.phone || '919876543210'}
              message={`Namaste, I want to purchase your "${item.name || item.title}". Is it still available?`}
            />
          </article>
        ))
      )}
    </main>
  );
}