import React, { useState } from 'react';
import ActionButtons from './ActionButtons';
import ListingDiscussionThread from './ListingDiscussionThread';

export default function ListingInteractiveCard({
  item,
  selectedCity,
  badgeCategory = 'LISTING',
  onNewNotification,
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Gallery array resolution
  const galleryImages =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700'];

  const totalImages = galleryImages.length;
  const currentImg = galleryImages[activeImgIndex] || galleryImages[0];

  const handleNextImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImg = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const mapUrl =
    item.mapUrl ||
    (item.lat && item.lng
      ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
      : null);

  const descText = item.description || '';
  const isLongDescription = descText.length > 110;

  return (
    <article
      className={`bg-white rounded-2xl overflow-hidden shadow-xs border transition p-3.5 space-y-3 relative ${
        item.isNew ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:shadow-md'
      }`}
    >
      {/* 🖼️ INTERACTIVE PHOTO CAROUSEL */}
      <div className="relative h-52 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner group select-none">
        <img
          src={currentImg}
          alt={item.title || item.name}
          loading="lazy"
          className="w-full h-full object-cover transition duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
          }}
        />

        {/* Price Pill */}
        <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
          {item.price || item.rent || item.rates || 'Contact for Price'}
        </span>

        {/* Multi-Photo Navigation Arrows */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center text-xs font-bold transition active:scale-90 cursor-pointer shadow-md backdrop-blur-xs"
            >
              ❮
            </button>
            <button
              type="button"
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center text-xs font-bold transition active:scale-90 cursor-pointer shadow-md backdrop-blur-xs"
            >
              ❯
            </button>

            {/* Photo Counter Pill & Dots */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-slate-950/80 backdrop-blur-xs text-white text-[9px] font-black flex items-center space-x-1 border border-white/10">
              <span>📷</span>
              <span>{activeImgIndex + 1}/{totalImages}</span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 flex items-center space-x-1 bg-slate-950/60 backdrop-blur-xs px-2 py-1 rounded-full">
              {galleryImages.map((_, idx) => (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImgIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeImgIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Discussion Thread Icon & Interest Action */}
        <ListingDiscussionThread
          listingId={item.id}
          listingTitle={item.title || item.name}
          sellerName={item.sellerName || item.driverName || 'Verified Member'}
          sellerPhone={item.phone || item.whatsapp}
          interestCount={item.interestCount || 0}
          onNewNotification={onNewNotification}
        />
      </div>

      {/* 📄 LISTING BODY & EXPANDABLE DESCRIPTION */}
      <div className="pt-0.5 space-y-1.5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm">{item.title || item.name}</h3>
            {(item.sellerName || item.driverName) && (
              <p className="text-[10px] text-blue-700 font-bold">
                By: {item.sellerName || item.driverName}
              </p>
            )}
          </div>
          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
            {String(item.subCategory || badgeCategory).toUpperCase()}
          </span>
        </div>

        {/* Expandable Rich Description Section */}
        {descText && (
          <div className="space-y-0.5">
            <p className={`text-[11px] text-slate-600 leading-relaxed ${isDescExpanded ? 'whitespace-pre-line' : 'line-clamp-2'}`}>
              {descText}
            </p>
            {isLongDescription && (
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-[10px] font-black text-blue-600 hover:text-blue-800 cursor-pointer pt-0.5"
              >
                {isDescExpanded ? 'Show Less ▴' : 'Read More ▾'}
              </button>
            )}
          </div>
        )}

        {/* Verified Location & One-Tap Map Navigation */}
        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1 text-slate-700 font-semibold truncate max-w-[220px]">
            <span>📍</span>
            <span className="truncate">{item.location || selectedCity}</span>
          </div>

          {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 rounded-lg text-[10px] font-black flex items-center space-x-1 shrink-0 transition cursor-pointer"
            >
              <span>🗺️</span>
              <span>View Map</span>
            </a>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <ActionButtons
        phone={item.phone || '9876543201'}
        whatsapp={item.whatsapp || item.phone || '919876543210'}
        message={`Namaste ${item.sellerName || ''}, I found your listing "${item.title || ''}" on TownHub (${item.location || selectedCity}). Is this still available?`}
      />
    </article>
  );
}