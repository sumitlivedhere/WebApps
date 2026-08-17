import React, { useState } from 'react';
import { examCategories, educationFormats } from '../data/educationData';

export default function EducationFeed({
  listings,
  selectedExamId,
  examTitle,
  initialFormatFilter = 'all',
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [formatFilter, setFormatFilter] = useState(initialFormatFilter);
  const activeExamObj = examCategories.find((e) => e.id === selectedExamId);

  const filteredListings = listings
    .filter((item) => {
      if (selectedExamId && selectedExamId !== 'all') {
        return item.examId === selectedExamId;
      }
      return true;
    })
    .filter((item) => {
      if (formatFilter !== 'all') {
        return item.format === formatFilter;
      }
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.subjects.some((s) => s.toLowerCase().includes(q)) ||
        item.targetExams.some((t) => t.toLowerCase().includes(q)) ||
        item.location.toLowerCase().includes(q) ||
        item.achievements.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER & FORMAT BAR */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeExamObj ? activeExamObj.icon : '🎓'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {examTitle || 'Coaching & Tuition Listings'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified tutors & institutes in {selectedCity}</p>
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

        {/* FORMAT FILTER TABS */}
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          {educationFormats.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatFilter(f.id)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                formatFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. LISTINGS CARDS */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">📚</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is category me abhi koi tutor/coaching register nahi hai.
          </p>
          <button
            type="button"
            onClick={() => setFormatFilter('all')}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold"
          >
            Show All Formats
          </button>
        </div>
      ) : (
        filteredListings.map((item) => (
          <article
            key={item.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* CARD TOP HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                    {item.name}
                  </h3>
                </div>
                <div className="flex items-center space-x-1.5 mt-1">
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {item.formatLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.facultyExp}</span>
                </div>
              </div>

              {/* RATING BADGE */}
              <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm shrink-0">
                <span>★</span>
                <span>{item.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* 🏆 PAST RESULTS & ACHIEVEMENTS BANNER */}
            <div className="p-2.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/70 text-xs">
              <p className="font-black text-amber-900 leading-snug">
                {item.achievements}
              </p>
            </div>

            {/* SUBJECTS & TOPICS COVERED PILLS */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                Subjects & Syllabus Covered
              </span>
              <div className="flex flex-wrap gap-1">
                {item.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
                  >
                    📖 {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* FEES, TIMINGS & LOCATION SPECS */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-emerald-800 font-black">
                <span>💰 Expected Fee:</span>
                <span className="font-bold text-slate-800">{item.fee}</span>
              </div>
              <div className="flex items-start justify-between text-[11px] text-indigo-700 font-extrabold pt-1 border-t border-slate-200/50">
                <span>🕒 Active Batch Hours:</span>
                <span className="font-semibold text-slate-700 text-right">{item.batchTimings}</span>
              </div>
              <div className="flex justify-between items-start text-[10px] text-slate-500 pt-0.5">
                <span>📍 <strong>Location:</strong> {item.location} ({item.landmark})</span>
                <span className="font-bold text-emerald-700 shrink-0 ml-1">{item.distance}</span>
              </div>
            </div>

            {/* BADGE */}
            {item.badge && (
              <span className="inline-block text-[10px] font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {item.badge}
              </span>
            )}

            {/* DIRECT INQUIRY & WHATSAPP BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
              <a
                href={`tel:${item.phone}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Institute/Tutor</span>
              </a>
              <a
                href={`https://wa.me/${item.whatsapp}?text=Namaste, I want to inquire regarding admission and batch timings for *${encodeURIComponent(item.name)}* for ${encodeURIComponent(item.targetExams.join(', '))} in Alwar.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 WhatsApp Demo Batch</span>
              </a>
            </div>

          </article>
        ))
      )}
    </main>
  );
}