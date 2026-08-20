import React, { memo } from 'react';
import { useStoreQuery } from '../../store/hyperlocalStore';
import { getCategoryById } from '../../data/taxonomyRegistry';
import ActionButtons from './ActionButtons';
import ListingDiscussionThread from './ListingDiscussionThread';

const ListingCard = memo(function ListingCard({ item, onNewNotification }) {
  return (
    <article className="bg-white rounded-2xl overflow-hidden shadow-xs border border-slate-200 hover:shadow-md transition-shadow p-3.5 space-y-3 relative">
      <div className="relative h-44 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
        <img
          src={item.image}
          alt={item.title || item.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600';
          }}
        />
        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
          {item.price}
        </span>

        <ListingDiscussionThread
          listingId={item.id}
          listingTitle={item.title}
          sellerName={item.sellerName}
          sellerPhone={item.phone || item.whatsapp}
          interestCount={item.interestCount || 0}
          onNewNotification={onNewNotification}
        />
      </div>

      <div className="pt-0.5 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm leading-snug">{item.title}</h3>
            {item.qualifications && (
              <p className="text-[10px] text-indigo-700 font-bold mt-0.5">🎓 {item.qualifications}</p>
            )}
            {item.sellerName && !item.qualifications && (
              <p className="text-[10px] text-slate-600 font-bold mt-0.5">👤 {item.sellerName}</p>
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {item.subCategory.toUpperCase()}
          </span>
        </div>

        {item.description && (
          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
        )}

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-100">
          <span>📍 {item.location}</span>
          <span className="text-emerald-700 font-bold">{item.badge || '🟢 Verified Provider'}</span>
        </div>
      </div>

      <ActionButtons
        phone={item.phone}
        whatsapp={item.whatsapp}
        message={`Namaste, I found "${item.title}" on TownHub. I want to inquire regarding your services in ${item.city}.`}
      />
    </article>
  );
});

export default function UnifiedFeedEngine({
  category,
  subCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const listings = useStoreQuery({
    city: selectedCity,
    category,
    subCategory,
    searchQuery,
  });

  const categoryConfig = getCategoryById(category);
  const matchedSub = categoryConfig?.subCategories?.find((s) => s.id === subCategory);
  const title = subCategory === 'all' ? categoryConfig?.name : matchedSub?.name || subCategory;

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Dynamic Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">{title}</h2>
          <p className="text-[10px] text-slate-500">Live verified listings in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* Optimized Listing Renderer */}
      {listings.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🔍</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No listings found under this category in {selectedCity}.
          </p>
        </div>
      ) : (
        listings.map((item) => (
          <ListingCard
            key={item.id}
            item={item}
            onNewNotification={onNewNotification}
          />
        ))
      )}
    </main>
  );
}