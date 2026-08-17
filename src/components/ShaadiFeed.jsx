import React from 'react';

export default function ShaadiFeed({
  vendors,
  selectedCategory,
  categoryTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory && selectedCategory !== 'all') {
      return v.category === selectedCategory;
    }
    return true;
  }).filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.specialty.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q)
    );
  });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💍</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {categoryTitle || 'Wedding Vendors'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified shaadi professionals in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-rose-50 text-rose-800 px-3 py-1.5 rounded-xl font-bold border border-rose-200 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 2. VENDOR CARDS */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🪅</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is wedding category me abhi koi vendor list nahi hua hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Phases
          </button>
        </div>
      ) : (
        filteredVendors.map((vendor) => (
          <article
            key={vendor.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* TOP HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <span className="text-blue-500 text-sm" title="Verified Shaadi Vendor">✓</span>
                  )}
                </div>
                <p className="text-xs font-bold text-rose-800 mt-0.5">
                  {vendor.specialty}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">{vendor.experience}</p>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                  <span>★</span>
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                  {vendor.jobsCompleted}+ Weddings Done
                </span>
              </div>
            </div>

            {/* PRICE ESTIMATE & LOCATION */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
              <p className="font-black text-emerald-800">
                💰 Est. Rate: <span className="font-normal text-slate-800">{vendor.priceEstimate}</span>
              </p>
              <p className="text-slate-600 text-[11px]">
                📍 {vendor.location} • <span className="font-semibold text-slate-700">{vendor.landmark}</span>
              </p>
            </div>

            {/* BADGE */}
            {vendor.badge && (
              <span className="inline-block text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                {vendor.badge}
              </span>
            )}

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${vendor.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Vendor</span>
              </a>
              <a
                href={`https://wa.me/${vendor.whatsapp}?text=Namaste *${encodeURIComponent(vendor.name)}*, we have an upcoming wedding in Alwar and need a date check and quote for *${encodeURIComponent(vendor.specialty)}*.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 WhatsApp Quote</span>
              </a>
            </div>
          </article>
        ))
      )}

    </main>
  );
}