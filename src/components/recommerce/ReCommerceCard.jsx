import React, { memo } from 'react';
import ActionButtons from '../common/ActionButtons';
import ListingDiscussionThread from '../common/ListingDiscussionThread';

function ReCommerceCard({ item, selectedCity, onNewNotification }) {
  return (
    <article className="feed-card-contain bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative">
      {/* 📷 FULL-WIDTH PRODUCT HERO IMAGE WITH OVERLAYS */}
      <div className="relative h-56 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700'}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none"></div>

        {/* Price & Condition Chips */}
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

        {/* 🌟 FLOATING INTERACTION RAIL */}
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

      {/* DIRECT ACTION BUTTONS */}
      <ActionButtons
        phone={item.phone || '9876543210'}
        whatsapp={item.whatsapp || item.phone || '919876543210'}
        message={`Namaste, I saw your listing for "${item.title}" on Town App. Is it still available?`}
      />
    </article>
  );
}

export default memo(ReCommerceCard);