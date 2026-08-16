import React, { useState } from 'react';
import { communityCategories } from '../data/communityData';

export default function CommunityFeed({
  drives,
  selectedPillarId,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'volunteer' | 'donate'
  const activePillar = communityCategories.find((c) => c.id === selectedPillarId);

  const filteredDrives = drives
    .filter((d) => {
      if (selectedPillarId && selectedPillarId !== 'all') {
        return d.category === selectedPillarId;
      }
      return true;
    })
    .filter((d) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.title.toLowerCase().includes(q) ||
        d.organizedBy.toLowerCase().includes(q) ||
        d.venue.toLowerCase().includes(q) ||
        d.landmark.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. HEADER */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activePillar ? activePillar.icon : '🤝'}</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {activePillar ? activePillar.name.split('(')[0] : 'Community Services'}
              </h2>
              <p className="text-[10px] text-slate-500">Verified welfare drives in {selectedCity}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl font-bold border border-rose-100 active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>

        {/* DRIVE PURPOSE SELECTOR */}
        <div className="flex space-x-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Active Initiatives
          </button>
          <button
            type="button"
            onClick={() => setFilterType('volunteer')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              filterType === 'volunteer'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-800 border border-rose-100 hover:bg-rose-100'
            }`}
          >
            🙋 Volunteer Help Needed
          </button>
        </div>
      </div>

      {/* 2. DRIVES LIST */}
      {filteredDrives.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🤝</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Is section me abhi koi active drive list nahi hui hai.
          </p>
        </div>
      ) : (
        filteredDrives.map((drive) => (
          <article
            key={drive.id}
            className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200/80 hover:shadow-md transition duration-200 space-y-3"
          >
            {/* TOP HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  {drive.badge}
                </span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1 leading-tight">
                  {drive.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Organized by: <strong className="text-slate-700">{drive.organizedBy}</strong>
                </p>
              </div>
            </div>

            {/* TIMING, VENUE & LANDMARK */}
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs">
              <p className="font-bold text-indigo-700 flex items-center space-x-1">
                <span>🕒 Timing:</span>
                <span className="font-semibold text-slate-800">{drive.timing}</span>
              </p>
              <div className="flex justify-between items-start text-slate-600">
                <span>📍 <strong>Venue:</strong> {drive.venue} (<span className="text-slate-800 font-semibold">{drive.landmark}</span>)</span>
                <span className="font-bold text-emerald-700 shrink-0 ml-2">{drive.distance}</span>
              </div>
            </div>

            {/* TARGET GOAL & VOLUNTEER REQUIREMENTS */}
            <div className="space-y-1.5 text-xs bg-gradient-to-br from-rose-50/50 to-amber-50/50 p-2.5 rounded-xl border border-rose-100/60">
              <p className="text-[11px] font-extrabold text-rose-900">
                🎯 <strong>Goal / Capacity:</strong> {drive.targetGoal}
              </p>
              <p className="text-[11px] text-slate-700">
                🙋 <strong>Volunteers Needed:</strong> {drive.volunteersNeeded}
              </p>
              <p className="text-[11px] text-emerald-800">
                📦 <strong>Donations Accepted:</strong> {drive.donationsAccepted}
              </p>
            </div>

            {/* BRIEF DESCRIPTION */}
            <p className="text-xs text-slate-600 leading-relaxed bg-white/70 p-2 rounded-lg border border-slate-100">
              {drive.description}
            </p>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${drive.organizerContact}`}
                className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
              >
                <span>📞 Call Organizer</span>
              </a>
              <a
                href={`https://wa.me/${drive.whatsapp}?text=Namaste, I want to volunteer/support the initiative: *${encodeURIComponent(drive.title)}* in Alwar.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
              >
                <span>💬 Volunteer / Donate</span>
              </a>
            </div>

          </article>
        ))
      )}

    </main>
  );
}