import React from 'react';
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
  const filtered = listings
    .filter((item) => {
      if (selectedSubCategory && selectedSubCategory !== 'all') {
        return item.category === selectedSubCategory || item.subCategory === selectedSubCategory;
      }
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.sellerName?.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* 1. TOP HEADER & BACK NAVIGATION */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
            {selectedSubCategory !== 'all' ? selectedSubCategory : 'All Re-commerce Items'}
          </h2>
          <p className="text-[10px] text-slate-500">Verified pre-owned products in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {/* 2. FEED CONTAINER */}
      {filtered.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛍️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi item listed nahi hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold cursor-pointer"
          >
            Explore Other Categories
          </button>
        </div>
      ) : (
        filtered.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative"
          >
            {/* 📷 FULL-WIDTH PRODUCT HERO IMAGE WITH REELS-STYLE RIGHT OVERLAYS */}
            <div className="relative h-56 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700'}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Price & Condition Chips (Left Side) */}
              <div className="absolute bottom-2.5 left-2.5 z-10 space-y-1">
                <span className="inline-block text-sm font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                  {item.price}
                </span>
                {item.condition && (
                  <span className="block text-[9px] font-black px-2 py-0.5 rounded-lg text-slate-950 bg-amber-400 shadow-sm w-max">
                    {item.condition}
                  </span>
                )}
              </div>

              {/* 🌟 REELS-STYLE FLOATING RIGHT-RAIL (🔥 Interested + 💬 Q&A With Auto-Focus) */}
              <ListingDiscussionThread
                listingId={item.id}
                listingTitle={item.title}
                sellerName={item.sellerName || 'Seller'}
                sellerPhone={item.phone || item.whatsapp}
                interestCount={item.interestCount || 4}
                onNewNotification={onNewNotification}
              />
            </div>

            {/* DETAILS */}
            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm leading-snug">
                  {item.title}
                </h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {item.sellerName || 'Verified Seller'}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {item.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{item.distance || '0.3 km away'}</span>
              </div>
            </div>

            {/* DIRECT CALL & WHATSAPP ACTION BUTTONS */}
            <ActionButtons
              phone={item.phone || '9876543210'}
              whatsapp={item.whatsapp || item.phone || '919876543210'}
              message={`Namaste, I saw your listing for "${item.title}" on Town App. Is it still available?`}
            />
          </article>
        ))
      )}
    </main>
  );
}