import React from 'react';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function MarketFeed({
  products = [],
  categoryTitle,
  selectedCategory,
  selectedSubCategory,
  selectedCity,
  searchQuery,
  onBack,
  onNewNotification,
}) {
  const filteredProducts = products
    .filter((prod) => {
      if (selectedSubCategory && selectedSubCategory !== 'all') return prod.subCategory === selectedSubCategory;
      if (selectedCategory && selectedCategory !== 'all') return prod.category === selectedCategory;
      return true;
    })
    .filter((prod) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return prod.title?.toLowerCase().includes(q) || prod.shopName?.toLowerCase().includes(q) || prod.location?.toLowerCase().includes(q);
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
            {categoryTitle || 'Market Products & Shops'}
          </h2>
          <p className="text-[10px] text-slate-500">Direct shop offers in {selectedCity}</p>
        </div>
        <button type="button" onClick={onBack} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer">
          ← Back
        </button>
      </div>

      {filteredProducts.map((prod) => (
        <article key={prod.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative">
          <div className="relative h-52 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
            <img src={prod.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700'} alt={prod.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-2.5 left-2.5 z-10">
              <span className="text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                {prod.price || 'Best Market Rate'}
              </span>
            </div>

            <ListingDiscussionThread
              listingId={prod.id}
              listingTitle={prod.title}
              sellerName={prod.shopName || 'Shopkeeper'}
              sellerPhone={prod.phone || prod.whatsapp}
              interestCount={prod.interestCount || 5}
              onNewNotification={onNewNotification}
            />
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{prod.title}</h3>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">🏪 {prod.shopName}</p>
              </div>
              {prod.rating && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md ml-2 shrink-0">
                  ★ {prod.rating}
                </span>
              )}
            </div>
            {prod.desc && <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{prod.desc}</p>}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
              <span>📍 {prod.location || selectedCity}</span>
              <span className="text-emerald-700 font-bold">{prod.distance || '0.8 km away'}</span>
            </div>
          </div>

          <ActionButtons
            phone={prod.phone || '9876543210'}
            whatsapp={prod.whatsapp || prod.phone || '919876543210'}
            message={`Namaste, I saw "${prod.title}" at your shop *${prod.shopName}* on Town App. Is it in stock?`}
          />
        </article>
      ))}
    </main>
  );
}