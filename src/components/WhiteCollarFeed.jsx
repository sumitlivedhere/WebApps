import React, { useState } from 'react';
import { whiteCollarCategories } from '../data/whiteCollarData';

export default function WhiteCollarFeed({
  listings,
  selectedCategoryId,
  categoryTitle,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const activeCategory = whiteCollarCategories.find((c) => c.id === selectedCategoryId);

  const filteredListings = listings
    .filter((item) => {
      if (selectedCategoryId && selectedCategoryId !== 'all') {
        return item.categoryId === selectedCategoryId;
      }
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.designation.toLowerCase().includes(q) ||
        item.qualifications.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.specialties.some((s) => s.toLowerCase().includes(q))
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeCategory ? activeCategory.icon : '👔'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {categoryTitle || 'Professional Consultants'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified licensed practitioners in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* 2. PROFESSIONAL CARDS */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">👔</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi professional register nahi hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Explore Other Consultants
          </button>
        </div>
      ) : (
        filteredListings.map((prof) => (
          <article
            key={prof.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* HEADER: NAME, DESIGNATION & RATING */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                  {prof.name}
                </h3>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">
                  {prof.designation}
                </p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  🏅 {prof.qualifications}
                </p>
              </div>

              <div className="flex flex-col items-end shrink-0 ml-2">
                <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                  <span>★</span>
                  <span>{prof.rating.toFixed(1)}</span>
                  <span className="text-[9px] font-bold text-slate-800">({prof.reviewCount})</span>
                </div>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                  {prof.experience}
                </span>
              </div>
            </div>

            {/* BADGE & COUNCIL REGISTRATION NUMBER */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                🆔 {prof.regNumber}
              </span>
              {prof.badge && (
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {prof.badge}
                </span>
              )}
            </div>

            {/* SPECIALTY TAGS */}
            <div>
              <span className="text-[9px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                Core Practice & Expertise
              </span>
              <div className="flex flex-wrap gap-1">
                {prof.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold bg-indigo-50/70 text-indigo-900 px-2 py-0.5 rounded-md border border-indigo-100"
                  >
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* CONSULTATION FEE & CHAMBER HOURS */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-800 font-black">
                <span>💰 Consultation Fee:</span>
                <span className="font-bold text-slate-800">{prof.consultationFee}</span>
              </div>
              <div className="flex items-start justify-between text-[11px] text-slate-700 font-bold pt-1 border-t border-slate-200/50">
                <span>🕒 Chamber / Clinic Hours:</span>
                <span className="font-semibold text-slate-600 text-right">{prof.availability}</span>
              </div>
              <div className="flex justify-between items-start text-[10px] text-slate-500 pt-0.5">
                <span>📍 <strong>Location:</strong> {prof.location} ({prof.landmark})</span>
                <span className="font-bold text-emerald-700 shrink-0 ml-1">{prof.distance}</span>
              </div>
            </div>

            {/* VERIFIABLE SHOWCASE / CREDENTIALS GALLERY */}
            {prof.showcaseDocs && prof.showcaseDocs.length > 0 && (
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  📸 Credentials & Chamber Showcase
                </span>
                <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
                  {prof.showcaseDocs.map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActivePreviewDoc(doc)}
                      className="shrink-0 w-24 h-16 rounded-xl overflow-hidden border border-slate-200 relative cursor-pointer group shadow-2xs"
                    >
                      <img src={doc.img} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-end p-1">
                        <span className="text-[8px] font-bold text-white leading-tight truncate">{doc.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS: CALL & WHATSAPP APPOINTMENT */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <a
                href={`tel:${prof.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Chamber</span>
              </a>
              <a
                href={`https://wa.me/${prof.whatsapp}?text=Namaste *${encodeURIComponent(prof.name)}*, I would like to book a consultation / appointment slot in Alwar regarding your *${encodeURIComponent(prof.designation)}* services.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 Book Appointment</span>
              </a>
            </div>

          </article>
        ))
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {activePreviewDoc && (
        <div
          onClick={() => setActivePreviewDoc(null)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl overflow-hidden max-w-sm w-full p-3 space-y-2 shadow-2xl">
            <div className="flex justify-between items-center px-1">
              <h4 className="text-xs font-black text-slate-900">{activePreviewDoc.title}</h4>
              <button onClick={() => setActivePreviewDoc(null)} className="text-xs font-bold text-slate-500">✕ Close</button>
            </div>
            <img src={activePreviewDoc.img} alt={activePreviewDoc.title} className="w-full h-56 object-cover rounded-xl" />
          </div>
        </div>
      )}

    </main>
  );
}