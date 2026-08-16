import React, { useState } from 'react';
import { localVehicleTypes } from '../data/transporterData';

export default function TransporterFeed({
  viewMode, // 'firms' | 'individual'
  firms,
  individualTransporters,
  selectedVehicleType,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [expandedRatings, setExpandedRatings] = useState({});
  const [filterAvailability, setFilterAvailability] = useState('all');

  const toggleRating = (id) => {
    setExpandedRatings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const activeVehicle = localVehicleTypes.find((v) => v.id === selectedVehicleType);

  // 1. FILTER FOR INDIVIDUAL VEHICLE OWNERS
  const filteredIndividuals = individualTransporters
    .filter((it) => {
      if (selectedVehicleType && selectedVehicleType !== 'all') {
        return it.vehicleCategory === selectedVehicleType;
      }
      return true;
    })
    .filter((it) => {
      if (filterAvailability === 'now') return it.isAvailableNow;
      return true;
    })
    .filter((it) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        it.driverName.toLowerCase().includes(q) ||
        it.vehicleName.toLowerCase().includes(q) ||
        it.location.toLowerCase().includes(q)
      );
    });

  // 2. FILTER FOR TRANSPORT FIRMS
  const filteredFirms = firms.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q) ||
      f.primaryRoutes.some((r) => r.toLowerCase().includes(q))
    );
  });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{viewMode === 'firms' ? '🏢' : activeVehicle ? activeVehicle.icon : '🚚'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {viewMode === 'firms' ? 'Transport Companies & Fleet Logistics' : (activeVehicle ? activeVehicle.name : 'Local Transporters')}
              </h2>
              <p className="text-[10px] text-slate-500">
                {viewMode === 'firms' ? 'Bilty & GST verified logistics in ' + selectedCity : 'Direct vehicle owners near ' + selectedCity}
              </p>
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

        {/* AVAILABILITY PILL (INDIVIDUAL VIEW ONLY) */}
        {viewMode === 'individual' && (
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
              All Vehicle Drivers
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
              <span>⚡ Free / Ready Now</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. A: TRANSPORT FIRMS FEED */}
      {viewMode === 'firms' ? (
        filteredFirms.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
            <span className="text-3xl">🏢</span>
            <p className="text-slate-600 font-bold text-xs mt-2">No transport firms found matching your search.</p>
          </div>
        ) : (
          filteredFirms.map((firm) => (
            <article
              key={firm.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {firm.name}
                    </h3>
                    {firm.gstVerified && (
                      <span className="text-emerald-600 text-xs font-black bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        GST ✓
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prop: <strong className="text-slate-700">{firm.owner}</strong> • {firm.established}
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                  <span>★</span>
                  <span>{firm.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* FLEET & WAREHOUSING INFO */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                <p className="font-bold text-indigo-700">
                  🚛 Fleet: <span className="font-normal text-slate-700">{firm.fleetSize}</span>
                </p>
                <p className="text-slate-600">
                  📍 <strong>Godown/Office:</strong> {firm.location}
                </p>
                <p className="text-[11px] text-emerald-800">
                  📦 <strong>Warehousing:</strong> {firm.warehousing}
                </p>
              </div>

              {/* PRIMARY ROUTES PILLS */}
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block mb-1">
                  Active Heavy Routes
                </span>
                <div className="flex flex-wrap gap-1">
                  {firm.primaryRoutes.map((route, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-100 px-2 py-0.5 rounded-md"
                    >
                      🛣️ {route}
                    </span>
                  ))}
                </div>
              </div>

              {/* CALL & WHATSAPP ACTION BUTTONS */}
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <a
                  href={`tel:${firm.phone}`}
                  className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
                >
                  <span>📞 Call Transport Office</span>
                </a>
                <a
                  href={`https://wa.me/${firm.whatsapp}?text=Namaste, I want to book commercial goods transport with *${encodeURIComponent(firm.name)}*. Please share truck availability and rate quote.`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
                >
                  <span>💬 Get Rate on WhatsApp</span>
                </a>
              </div>
            </article>
          ))
        )
      ) : (
        /* 2. B: INDIVIDUAL VEHICLE OWNERS FEED WITH 5-DIMENSION RATINGS */
        filteredIndividuals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
            <span className="text-3xl">🚚</span>
            <p className="text-slate-600 font-bold text-xs mt-2">Is vehicle category me koi driver online nahi hai.</p>
          </div>
        ) : (
          filteredIndividuals.map((it) => {
            const isExpanded = expandedRatings[it.id];

            return (
              <article
                key={it.id}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {it.driverName}
                      </h3>
                      {it.verified && (
                        <span className="text-blue-500 text-sm" title="Verified Driver">✓</span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-indigo-700 mt-0.5">
                      {it.vehicleName}
                    </p>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg font-black text-xs shadow-sm">
                      <span>★</span>
                      <span>{it.ratings.overall.toFixed(1)}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-bold mt-0.5">
                      {it.jobsCompleted}+ Trips Done
                    </span>
                  </div>
                </div>

                {/* CAPACITY & LOCATION BOX */}
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 font-medium">📍 Stand: {it.location}</span>
                    <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 shadow-2xs">
                      {it.distance}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[11px]">
                    <span className="font-bold text-emerald-700">⚖️ {it.capacity}</span>
                    <span className="font-extrabold text-indigo-700">🕒 {it.freeTimeSlot}</span>
                  </div>
                </div>

                {/* 5-DIMENSION MERITOCRATIC RATING BREAKDOWN */}
                <div className="border border-slate-100 rounded-xl bg-slate-50/50 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleRating(it.id)}
                    className="w-full px-3 py-2 text-left flex items-center justify-between text-[11px] font-bold text-slate-700 hover:bg-slate-100/60 transition"
                  >
                    <span className="flex items-center space-x-1">
                      <span>📊 5-Star Driver Rating Breakdown</span>
                      <span className="text-[9px] text-slate-400">(Speed, Cost, Handling, Behavior, Response)</span>
                    </span>
                    <span className="text-xs text-slate-400">{isExpanded ? '▲' : '▼'}</span>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 space-y-2 border-t border-slate-100 bg-white text-xs animate-fade-in">
                      {[
                        { label: '1. Punctuality & Reach Speed (समय की पाबंदी)', val: it.ratings.punctuality, icon: '⏱️' },
                        { label: '2. Cost Effective / Fair Rate (उचित किराया)', val: it.ratings.costEffective, icon: '💰' },
                        { label: '3. Safe Handling of Goods (सामान की सुरक्षा)', val: it.ratings.quality, icon: '🛡️' },
                        { label: '4. Driver Behavior (व्यवहार)', val: it.ratings.behavior, icon: '🤝' },
                        { label: '5. Availability & Response (उपलब्धता)', val: it.ratings.availability, icon: '📞' },
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

                {/* CALL & WHATSAPP BUTTONS */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href={`tel:${it.phone}`}
                    className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
                  >
                    <span>📞 Call Driver</span>
                  </a>
                  <a
                    href={`https://wa.me/${it.whatsapp}?text=Namaste *${encodeURIComponent(it.driverName)}*, I need your *${encodeURIComponent(it.vehicleName)}* for local goods shifting in Alwar. Are you free right now?`}
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
        )
      )}
    </main>
  );
}