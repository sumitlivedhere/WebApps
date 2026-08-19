import React from 'react';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function CommunityFeed({
  drives = [],
  selectedPillarId,
  selectedCity,
  searchQuery,
  onBack,
  onNewNotification,
}) {
  const filtered = drives
    .filter((item) => {
      if (selectedPillarId && selectedPillarId !== 'all') return item.pillar === selectedPillarId || item.category === selectedPillarId;
      return true;
    })
    .filter((item) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return item.title?.toLowerCase().includes(q) || item.organizer?.toLowerCase().includes(q) || item.location?.toLowerCase().includes(q);
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
            Community Drives & Social Welfare
          </h2>
          <p className="text-[10px] text-slate-500">Local emergency, blood donation & charity drives in {selectedCity}</p>
        </div>
        <button type="button" onClick={onBack} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer">
          ← Back
        </button>
      </div>

      {filtered.map((item) => (
        <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative">
          <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
            <img src={item.image || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=700'} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-2.5 left-2.5 z-10 space-y-1">
              <span className="inline-block text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                🚨 {item.status || 'Active Drive'}
              </span>
            </div>

            <ListingDiscussionThread
              listingId={item.id}
              listingTitle={item.title}
              sellerName={item.organizer || 'Drive Coordinator'}
              sellerPhone={item.phone || item.whatsapp}
              interestCount={item.volunteersCount || 23}
              onNewNotification={onNewNotification}
            />
          </div>

          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{item.title}</h3>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">🤝 {item.organizer}</p>
              </div>
              <span className="bg-rose-100 text-rose-900 text-[10px] font-black px-2 py-0.5 rounded-md ml-2 shrink-0">
                {item.urgency || 'Immediate Help'}
              </span>
            </div>
            {item.desc && <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">{item.desc}</p>}
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
              <span>📍 {item.location || selectedCity}</span>
              <span className="text-emerald-700 font-bold">{item.distance || 'Near You'}</span>
            </div>
          </div>

          <ActionButtons
            phone={item.phone || '9876543210'}
            whatsapp={item.whatsapp || item.phone || '919876543210'}
            callLabel="Call Helpline"
            chatLabel="WhatsApp Seva"
            message={`Namaste, I want to contribute / volunteer for "${item.title}".`}
          />
        </article>
      ))}
    </main>
  );
}