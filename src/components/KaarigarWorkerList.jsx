import React, { useState } from 'react';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function KaarigarWorkerList({
  workers = [],
  selectedTradeId = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all' | 'available_now'

  const filteredWorkers = workers
    .filter((worker) => {
      if (selectedTradeId && selectedTradeId !== 'all') {
        return worker.tradeId === selectedTradeId || worker.trade === selectedTradeId;
      }
      return true;
    })
    .filter((worker) => {
      if (filterAvailability === 'available_now') {
        return worker.isAvailableNow === true;
      }
      return true;
    })
    .filter((worker) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        worker.name?.toLowerCase().includes(q) ||
        worker.trade?.toLowerCase().includes(q) ||
        worker.location?.toLowerCase().includes(q) ||
        worker.skills?.some((s) => s.toLowerCase().includes(q))
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
            {selectedTradeId !== 'all' ? selectedTradeId : 'All Kaarigar Workers'}
          </h2>
          <p className="text-[10px] text-slate-500">Verified skilled workers in {selectedCity}</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setFilterAvailability(filterAvailability === 'all' ? 'available_now' : 'all')}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer ${
              filterAvailability === 'available_now'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200'
            }`}
          >
            🟢 Available Now
          </button>

          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
          >
            ← Trades
          </button>
        </div>
      </div>

      {/* 2. WORKERS LIST */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛠️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is trade me abhi koi kaarigar uplabdh nahi hai.
          </p>
          <button
            type="button"
            onClick={onBack}
            className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold cursor-pointer"
          >
            Explore Other Trades
          </button>
        </div>
      ) : (
        filteredWorkers.map((worker) => (
          <article
            key={worker.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative"
          >
            {/* 📷 FULL HERO IMAGE WITH REELS-STYLE RIGHT OVERLAYS */}
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={worker.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=700'}
                alt={worker.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none"></div>

              {/* Badges & Visiting Charge */}
              <div className="absolute bottom-2.5 left-2.5 z-10 space-y-1">
                <span className="inline-block text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                  Visiting: {worker.visitingCharge || worker.fee || '₹ 200 - 300'}
                </span>
                <span className="block text-[9px] font-black px-2 py-0.5 rounded-lg text-slate-950 bg-amber-400 shadow-sm w-max">
                  {worker.experience || '8+ Yrs Experience'}
                </span>
              </div>

              {/* 🌟 FLOATING RIGHT RAIL (🔥 Interested + 💬 Q&A) */}
              <ListingDiscussionThread
                listingId={worker.id}
                listingTitle={`${worker.name} (${worker.trade || 'Kaarigar'})`}
                sellerName={worker.name}
                sellerPhone={worker.phone || worker.whatsapp}
                interestCount={worker.interestCount || 6}
                onNewNotification={onNewNotification}
              />
            </div>

            {/* DETAILS */}
            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm leading-snug">
                    {worker.name}
                  </h3>
                  <p className="text-xs font-bold text-indigo-700 mt-0.5">
                    🛠️ {worker.trade}
                  </p>
                </div>

                <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shrink-0 ml-2">
                  <span>★</span>
                  <span>{typeof worker.rating === 'number' ? worker.rating.toFixed(1) : (worker.rating || '4.9')}</span>
                </div>
              </div>

              {/* SKILLS CHIPS */}
              {worker.skills && worker.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {worker.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[9px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2.5 pt-2 border-t border-slate-100">
                <span>📍 {worker.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">
                  {worker.freeTimeSlot || 'Available Today (उपलब्ध)'}
                </span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <ActionButtons
              phone={worker.phone || '9876543210'}
              whatsapp={worker.whatsapp || worker.phone || '919876543210'}
              message={`Namaste ${worker.name}, I need your ${worker.trade} service in ${selectedCity}. Are you available?`}
            />
          </article>
        ))
      )}
    </main>
  );
}