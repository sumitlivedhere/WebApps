import React from 'react';
import { mallCategories } from '../data/mallsData';

export default function MallsFeed({
  stores,
  selectedCategoryId,
  categoryTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const activeCategory = mallCategories.find((c) => c.id === selectedCategoryId);

  const filteredStores = stores
    .filter((s) => {
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        return s.categoryId === selectedCategoryId;
      }
      return true;
    })
    .filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.highlightedProducts.some((p) => p.title.toLowerCase().includes(q))
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeCategory ? activeCategory.icon : '🛍️'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {categoryTitle || 'Modern Stores & Showrooms'}
              </h2>
              <p className="text-[10px] text-slate-500">Curated quality stores in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-pink-50 text-pink-800 px-3 py-1.5 rounded-xl font-bold border border-pink-200 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 2. SHOWROOM CARDS */}
      {filteredStores.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛍️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi showroom register nahi hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Outlets
          </button>
        </div>
      ) : (
        filteredStores.map((store) => (
          <article
            key={store.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* STOREFRONT HERO IMAGE */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={store.frontImage}
                alt={store.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-lg text-white shadow-md bg-slate-900/80 backdrop-blur-sm">
                {store.vibe}
              </span>
              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-md">
                <span>★</span>
                <span>{store.rating.toFixed(1)}</span>
                <span className="text-[9px] font-bold text-slate-800">({store.reviewCount})</span>
              </div>
            </div>

            <div className="p-3.5 pt-0 space-y-2.5">
              
              {/* STORE TITLE & TAGLINE */}
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {store.name}
                </h3>
                <p className="text-xs font-semibold text-pink-700 mt-0.5">
                  {store.tagline}
                </p>
              </div>

              {/* PRICE RANGE & LOCATION */}
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                <p className="font-extrabold text-emerald-800">
                  🏷️ Price Band: <span className="font-semibold text-slate-700">{store.priceRange}</span>
                </p>
                <div className="flex justify-between items-start text-slate-500 text-[10px] pt-0.5 border-t border-slate-200/50">
                  <span>📍 {store.location} (<span className="font-semibold text-slate-700">{store.landmark}</span>)</span>
                  <span className="font-bold text-emerald-700 shrink-0 ml-1">{store.distance}</span>
                </div>
              </div>

              {/* AMENITIES PILLS */}
              <div>
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Showroom Amenities
                </span>
                <div className="flex flex-wrap gap-1">
                  {store.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* HIGHLIGHTED PRODUCT SHOWCASE */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 tracking-wider block mb-1.5">
                  ✨ Highlighted In-Store Collection
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {store.highlightedProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-indigo-50/40 p-2 rounded-xl border border-indigo-100/70 text-center flex flex-col justify-between"
                    >
                      <span className="text-[9px] font-extrabold text-amber-800 bg-amber-100 px-1 py-0.2 rounded-full self-center mb-1">
                        {prod.tag}
                      </span>
                      <h4 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">
                        {prod.title}
                      </h4>
                      <span className="text-[11px] font-black text-emerald-700 mt-1">
                        {prod.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DIRECT CALL & WHATSAPP ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
                >
                  <span>📞 Call Showroom</span>
                </a>
                <a
                  href={`https://wa.me/${store.whatsapp}?text=Hi, I saw your showroom *${encodeURIComponent(store.name)}* on the Town app. Please share your live catalogue / location directions.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
                >
                  <span>💬 WhatsApp Catalog</span>
                </a>
              </div>

            </div>
          </article>
        ))
      )}

    </main>
  );
}