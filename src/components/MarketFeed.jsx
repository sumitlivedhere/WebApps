import React, { useState } from 'react';
import { marketStores } from '../data/marketData';

export default function MarketFeed({
  products,
  categoryTitle,
  selectedCategory,
  selectedSubCategory,
  selectedCity,
  searchQuery,
  onBack,
  onSetAlert,
}) {
  const [storeTypeFilter, setStoreTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default'); // 'default' | 'discount' | 'price-low' | 'price-high'

  const filteredProducts = products
    .filter((prod) => {
      if (selectedSubCategory && selectedSubCategory !== 'all') {
        return prod.subCategoryId === selectedSubCategory;
      }
      if (selectedCategory && selectedCategory !== 'all') {
        return prod.categoryId === selectedCategory;
      }
      return true;
    })
    .filter((prod) => {
      if (storeTypeFilter === 'all') return true;
      const store = marketStores[prod.storeId];
      return store && store.type === storeTypeFilter;
    })
    .filter((prod) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const store = marketStores[prod.storeId];
      return (
        prod.title.toLowerCase().includes(q) ||
        (store && store.name.toLowerCase().includes(q)) ||
        (store && store.area.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      if (sortBy === 'price-low') return a.finalPrice - b.finalPrice;
      if (sortBy === 'price-high') return b.finalPrice - a.finalPrice;
      return 0;
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER & SMART SORTING CONTROLS */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
              {categoryTitle || 'Market Catalog'}
            </h2>
            <p className="text-[10px] text-slate-500">Live prices from verified stores in {selectedCity}</p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-bold border border-emerald-100 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* SHOP LOCATION FILTER (HIGH-STREET VS DEEP-LANE WORKSHOPS) */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
              Store Category & Location
            </span>
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: 'all', label: 'All Town Stores' },
                { id: 'main-market', label: '🏢 Main Bazaar Showrooms' },
                { id: 'lane-workshop', label: '🛠️ Mohalla Workshops' },
                { id: 'home-business', label: '🏡 Home Boutiques' },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setStoreTypeFilter(pill.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    storeTypeFilter === pill.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* SORTING CONTROLS */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
              Sort Deals
            </span>
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: 'default', label: 'Recommended' },
                { id: 'discount', label: '🔥 Highest Discount %' },
                { id: 'price-low', label: 'Price: Low to High ↑' },
                { id: 'price-high', label: 'Price: High to Low ↓' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSortBy(opt.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    sortBy === opt.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PRODUCT CARDS WITH MRP & DIRECT SELLER HOOKS */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛍️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi new products list nahi hue hain.
          </p>
          <button
            onClick={() => {
              setStoreTypeFilter('all');
              setSortBy('default');
            }}
            className="mt-3 text-xs bg-emerald-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-md"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        filteredProducts.map((prod) => {
          const store = marketStores[prod.storeId] || {
            name: 'Local Town Merchant',
            area: 'Local Area',
            landmark: 'Near Market',
            distance: '1 km',
            phone: '+919876543210',
            whatsapp: '919876543210',
            typeLabel: 'Verified Merchant',
          };

          return (
            <article
              key={prod.id}
              className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg transition duration-200"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount Badge */}
                <span className="absolute top-3 left-3 text-[11px] font-black px-2.5 py-1 rounded-lg text-white shadow-md bg-rose-600">
                  {prod.discountPercent}% OFF
                </span>

                {/* Badge/Tag */}
                {prod.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow bg-slate-900/80 backdrop-blur-sm">
                    {prod.badge}
                  </span>
                )}
              </div>

              {/* Product Info & Pricing */}
              <div className="p-3.5">
                <div className="flex items-baseline space-x-2">
                  <span className="text-lg font-black text-slate-900">
                    ₹{prod.finalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400 line-through">
                    MRP ₹{prod.mrp.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Save ₹{(prod.mrp - prod.finalPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-sm mt-1 leading-snug">
                  {prod.title}
                </h3>

                {prod.warranty && (
                  <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                    🛡️ {prod.warranty}
                  </p>
                )}

                {/* SHOP LOCATION CARD */}
                <div className="mt-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-black text-slate-900">
                      🏪 {store.name}
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                      {store.distance}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    📍 {store.area} • <span className="font-semibold">{store.landmark}</span>
                  </p>
                  <p className="text-[9px] font-bold text-slate-400">
                    {store.typeLabel}
                  </p>
                </div>

                {/* DIRECT INQUIRY & WHATSAPP */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center justify-center space-x-1 border border-slate-300/80 py-2 rounded-xl text-xs font-bold text-slate-700 active:bg-slate-50"
                  >
                    <span>📞 Call Shop</span>
                  </a>
                  <a
                    href={`https://wa.me/${store.whatsapp}?text=Hi, I am inquiring about *${encodeURIComponent(prod.title)}* (Offer Price: ₹${prod.finalPrice}) listed on Town App.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-1 bg-emerald-600 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700"
                  >
                    <span>💬 Buy / Chat</span>
                  </a>
                </div>

              </div>
            </article>
          );
        })
      )}
    </main>
  );
}