import React from 'react';
import { restaurantCategories } from '../data/restaurantsData';

export default function RestaurantsFeed({
  restaurants,
  selectedCategoryId,
  categoryTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const activeCategory = restaurantCategories.find((c) => c.id === selectedCategoryId);

  const filteredRestaurants = restaurants
    .filter((r) => {
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        return r.categoryId === selectedCategoryId;
      }
      return true;
    })
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.mustTryDishes.some((d) => d.title.toLowerCase().includes(q))
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeCategory ? activeCategory.icon : '🍽️'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {categoryTitle || 'Restaurants & Cafes'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified dining & food places in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-orange-50 text-orange-800 px-3 py-1.5 rounded-xl font-bold border border-orange-200 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 2. RESTAURANT CARDS */}
      {filteredRestaurants.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">☕</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi restaurant list nahi hua hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Dining Spots
          </button>
        </div>
      ) : (
        filteredRestaurants.map((res) => (
          <article
            key={res.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* HERO AMBIANCE IMAGE */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={res.heroImage}
                alt={res.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 text-[10px] font-black px-2.5 py-1 rounded-lg text-white shadow-md bg-slate-900/85 backdrop-blur-sm">
                {res.vibe}
              </span>
              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-md">
                <span>★</span>
                <span>{res.rating.toFixed(1)}</span>
                <span className="text-[9px] font-bold text-slate-800">({res.reviewCount})</span>
              </div>
            </div>

            <div className="p-3.5 pt-0 space-y-2.5">
              
              {/* RESTAURANT HEADER */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                    {res.name}
                  </h3>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {res.dietary}
                  </span>
                </div>
                <p className="text-xs font-semibold text-orange-700 mt-0.5">
                  {res.tagline}
                </p>
              </div>

              {/* AVG COST & LOCATION */}
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                <p className="font-extrabold text-slate-900 flex items-center justify-between">
                  <span>💰 Avg Cost: <strong className="text-emerald-700">{res.avgCost}</strong></span>
                  <span className="font-bold text-emerald-700">{res.distance}</span>
                </p>
                <p className="text-slate-500 text-[10px] pt-0.5 border-t border-slate-200/50">
                  📍 {res.location} (<span className="font-semibold text-slate-700">{res.landmark}</span>)
                </p>
              </div>

              {/* AMENITIES PILLS */}
              <div>
                <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Ambiance & Features
                </span>
                <div className="flex flex-wrap gap-1">
                  {res.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* MUST-TRY SIGNATURE DISHES */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-orange-700 tracking-wider block mb-1.5">
                  🔥 Must-Try Signature Dishes
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {res.mustTryDishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="bg-orange-50/40 p-2 rounded-xl border border-orange-100/70 text-center flex flex-col justify-between"
                    >
                      <span className="text-[9px] font-extrabold text-orange-900 bg-orange-100 px-1 py-0.2 rounded-full self-center mb-1">
                        {dish.badge}
                      </span>
                      <h4 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-2">
                        {dish.title}
                      </h4>
                      <span className="text-[11px] font-black text-emerald-700 mt-1">
                        {dish.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIONS: CALL & WHATSAPP TABLE/DELIVERY */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${res.phone}`}
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
                >
                  <span>📞 Call / Book Table</span>
                </a>
                <a
                  href={`https://wa.me/${res.whatsapp}?text=Namaste, I want to reserve a table / place a food order at *${encodeURIComponent(res.name)}* in Alwar.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
                >
                  <span>💬 WhatsApp Order</span>
                </a>
              </div>

            </div>
          </article>
        ))
      )}

    </main>
  );
}