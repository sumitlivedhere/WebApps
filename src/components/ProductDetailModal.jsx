import React, { useState } from 'react';

export default function ProductDetailModal({ product, onClose }) {
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto shadow-2xl border-t border-slate-200/80 flex flex-col">
        
        {/* MODAL HEADER WITH CLOSE BUTTON */}
        <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md px-4 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            {product.badge || 'Verified Listing'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-black text-xs"
          >
            ✕
          </button>
        </div>

        {/* 1. MULTI-ANGLE IMAGE CAROUSEL */}
        <div className="relative bg-slate-900 w-full h-64 overflow-hidden">
          <img
            src={images[activeImageIndex]}
            alt={`Angle ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-2.5 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            📷 {activeImageIndex + 1} / {images.length} Photos
          </div>
        </div>

        {/* Thumbnail Selector */}
        {images.length > 1 && (
          <div className="flex space-x-2 px-4 py-2.5 overflow-x-auto bg-slate-50 border-b border-slate-100">
            {images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                  activeImageIndex === idx ? 'border-indigo-600 scale-105 shadow-md' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* 2. PRODUCT DETAILS & SPECS */}
        <div className="p-4 space-y-4 text-slate-800">
          <div>
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-black text-slate-900">{product.price}</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                Fixed / Negotiable
              </span>
            </div>
            <h1 className="text-base font-extrabold text-slate-900 mt-1 leading-snug">
              {product.title}
            </h1>
          </div>

          {/* LOCAL DISTANCE & LANDMARK BOX */}
          <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 rounded-2xl p-3 flex items-start space-x-3">
            <span className="text-2xl mt-0.5">📍</span>
            <div>
              <div className="text-xs font-black text-slate-900 flex items-center space-x-2">
                <span>{product.location}</span>
                {product.distance && (
                  <span className="bg-indigo-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {product.distance}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                <span className="font-semibold text-slate-700">Landmark:</span> {product.landmark || 'Near Main Market'}
              </p>
            </div>
          </div>

          {/* SPECIFICATIONS GRID */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Model / Brand</span>
              <span className="font-extrabold text-slate-800">{product.brand || 'Standard Model'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Vehicle Age / Year</span>
              <span className="font-extrabold text-slate-800">{product.year ? `${product.year} (${product.age || '2 Yrs Old'})` : '3 Years Old'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">KM Driven</span>
              <span className="font-extrabold text-slate-800">{product.kmDriven || '18,500 km'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ownership</span>
              <span className="font-extrabold text-slate-800">{product.ownership || '1st Owner'}</span>
            </div>
          </div>

          {/* SELLER DESCRIPTION */}
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
              Seller Description
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {product.description || 'Single hand used vehicle in prime condition. All papers up to date, original insurance & toolkit available. Serious town buyers only.'}
            </p>
          </div>
        </div>

        {/* 3. STICKY CALL & WHATSAPP FOOTER */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 grid grid-cols-2 gap-2.5">
          <a
            href={`tel:${product.phone}`}
            className="flex items-center justify-center space-x-1.5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold active:scale-95 transition shadow-sm"
          >
            <span>📞 Direct Call</span>
          </a>
          <a
            href={`https://wa.me/${product.whatsapp}?text=Hi, I am interested in your vehicle listing: ${encodeURIComponent(product.title)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center space-x-1.5 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-bold active:scale-95 transition shadow-sm"
          >
            <span>💬 Chat WhatsApp</span>
          </a>
        </div>

      </div>
    </div>
  );
}