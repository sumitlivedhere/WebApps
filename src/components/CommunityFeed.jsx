import React, { useMemo } from 'react';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function CommunityFeed({
  drives = [],
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const filteredDrives = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();
    const targetSub = (selectedSubCategory || 'all').toLowerCase().trim();

    return (drives || []).filter((item) => {
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      const itemSub = (item.subCategory || item.driveType || item.sub_category || '').toLowerCase().trim();
      const matchesSub = targetSub === 'all' || itemSub === targetSub;
      if (!matchesSub) return false;

      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q)
      );
    });
  }, [drives, selectedSubCategory, selectedCity, searchQuery]);

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {selectedSubCategory !== 'all' ? selectedSubCategory.replace('-', ' ') : 'Community & Seva Drives'}
          </h2>
          <p className="text-[10px] text-slate-500">Blood Donation, Ration & Gau Seva in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {filteredDrives.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🤝</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No community drives found in this category for {selectedCity}.
          </p>
        </div>
      ) : (
        filteredDrives.map((d) => (
          <article
            key={d.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  d.image ||
                  d.photo ||
                  'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700'
                }
                alt={d.name || d.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                Free / Seva Drive
              </span>

              <ListingDiscussionThread
                listingId={d.id}
                listingTitle={d.name || d.title}
                sellerName={d.organizer || d.sellerName || 'Organizer'}
                sellerPhone={d.phone || d.whatsapp}
                interestCount={d.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm">{d.name || d.title}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {d.subCategory ? d.subCategory.toUpperCase() : 'SEVA'}
                </span>
              </div>

              {d.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{d.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {d.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{d.distance || '0.1 km away'}</span>
              </div>
            </div>

            <ActionButtons
              phone={d.phone || '9876543210'}
              whatsapp={d.whatsapp || d.phone || '919876543210'}
              message={`Namaste, I want to participate / help in the "${d.name || d.title}" drive.`}
            />
          </article>
        ))
      )}
    </main>
  );
}