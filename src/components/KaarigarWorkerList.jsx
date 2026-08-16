import React, { useState } from 'react';
import { kaarigarTrades } from '../data/kaarigarData';

export default function KaarigarWorkerList({
  workers,
  selectedTradeId,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [filterAvailability, setFilterAvailability] = useState('all'); // 'all' | 'now'
  const [expandedRatings, setExpandedRatings] = useState({}); // workerId -> bool (toggle 5-dimension rating view)

  const activeTrade = kaarigarTrades.find((t) => t.id === selectedTradeId);

  const toggleRatingExpand = (id) => {
    setExpandedRatings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredWorkers = workers
    .filter((w) => {
      if (selectedTradeId && selectedTradeId !== 'all') {
        return w.tradeId === selectedTradeId;
      }
      return true;
    })
    .filter((w) => {
      if (filterAvailability === 'now') return w.isAvailableNow;
      return true;
    })
    .filter((w) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        w.name.toLowerCase().includes(q) ||
        w.tradeLabel.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activeTrade ? activeTrade.icon : '🛠️'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {activeTrade ? activeTrade.name : 'Kaarigar Directory'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified workers near {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-amber-50 text-amber-800 px-3 py-1.5 rounded-xl font-bold border border-amber-200 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* QUICK AVAILABILITY FILTER */}
        <div className="flex space-x-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setFilterAvailability('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterAvailability === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Verified Workers
          </button>
          <button
            type="button"
            onClick={() => setFilterAvailability('now')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
              filterAvailability === 'now'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>⚡ Available Right Now</span>
          </button>
        </div>
      </div>

      {/* 2. WORKER PROFILES LIST */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛠️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is trade me abhi koi worker online nahi hai.
          </p>
          <button
            onClick={() => setFilterAvailability('all')}
            className="mt-3 text-xs bg-amber-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-md"
          >
            Show All Workers
          </button>
        </div>
      ) : (
        filteredWorkers.map((worker) => {
          const isExpanded = expandedRatings[worker.id];

          return (
            <article
              key={worker.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
            >
              {/* TOP ROW: NAME, BADGE & OVERALL STAR */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {worker.name}
                    </h3>
                    {worker.verified && (
                      <span className="text-blue-500 text-sm" title="Verified Worker">✓</span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-amber-800 mt-0.5">
                    {worker.tradeLabel} • <span className="text-slate-500 font-normal">{worker.experience}</span>
                  </p>
                </div>

                {/* OVERALL RATING BADGE */}
                <div className="flex flex-col items-end">
                  <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                    <span>★</span>
                    <span>{worker.ratings.overall.toFixed(1)}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                    {worker.jobsCompleted}+ Jobs Done
                  </span>
                </div>
              </div>

              {/* LOCATION & FREE TIME SLOT BOX */}
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">📍 {worker.location}</span>
                  <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                    {worker.distance}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                  <span className="text-[11px] font-extrabold text-indigo-700 flex items-center space-x-1">
                    <span>🕒 Slot:</span>
                    <span>{worker.freeTimeSlot}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">{worker.visitingCharge}</span>
                </div>
              </div>

              {/* 5-DIMENSION MERITOCRATIC RATING ACCORDION */}
              <div className="border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleRatingExpand(worker.id)}
                  className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] font-bold text-slate-700 hover:bg-slate-100/60 transition"
                >
                  <span className="flex items-center space-x-1">
                    <span>📊 5-Star Skill Breakdown</span>
                    <span className="text-[9px] text-slate-400">(Speed, Cost, Quality, Behavior, Availability)</span>
                  </span>
                  <span className="text-xs text-slate-400">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="px-3 pb-3 pt-1 space-y-2 border-t border-slate-100 bg-white text-xs animate-fade-in">
                    {[
                      { label: '1. Punctuality & Speed (समय की पाबंदी)', val: worker.ratings.punctuality, icon: '⏱️' },
                      { label: '2. Cost Effective (किफायती दाम)', val: worker.ratings.costEffective, icon: '💰' },
                      { label: '3. Quality of Work (काम की सफाई)', val: worker.ratings.quality, icon: '✨' },
                      { label: '4. Behavior & Trust (व्यवहार)', val: worker.ratings.behavior, icon: '🤝' },
                      { label: '5. Availability / Response (उपलब्धता)', val: worker.ratings.availability, icon: '📞' },
                    ].map((metric, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-medium">{metric.icon} {metric.label}</span>
                        <div className="flex items-center space-x-1">
                          <span className="font-extrabold text-slate-900">{metric.val.toFixed(1)}</span>
                          <span className="text-amber-500 text-xs">★</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DIRECT CONTACT BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${worker.phone}`}
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
                >
                  <span>📞 Call Worker</span>
                </a>
                <a
                  href={`https://wa.me/${worker.whatsapp}?text=Namaste *${encodeURIComponent(worker.name)}*, I need your *${encodeURIComponent(worker.tradeLabel)}* service in Alwar. Are you free to take a job today?`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
                >
                  <span>💬 WhatsApp Chat</span>
                </a>
              </div>

            </article>
          );
        })
      )}

    </main>
  );
}