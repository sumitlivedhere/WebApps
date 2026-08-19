import React, { useMemo } from 'react';
import ReCommerceCard from './ReCommerceCard';

export default function ReCommerceFeed({
  listings = [],
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return listings.filter((item) => {
      const matchesCategory =
        selectedSubCategory === 'all' ||
        item.category === selectedSubCategory ||
        item.subCategory === selectedSubCategory;

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.sellerName?.toLowerCase().includes(q)
      );
    });
  }, [listings, selectedSubCategory, searchQuery]);

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* HEADER */}
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

      {/* ITEMS LIST */}
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
          <ReCommerceCard
            key={item.id}
            item={item}
            selectedCity={selectedCity}
            onNewNotification={onNewNotification}
          />
        ))
      )}
    </main>
  );
}