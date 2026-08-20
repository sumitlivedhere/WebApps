import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function KaarigarWorkerList({
  workers: propWorkers,
  selectedSubCategory,
  selectedTradeId,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  // Reactive live store slice (falls back to propWorkers if passed)
  const storeWorkers = useStoreSlice('kaarigarWorkers');
  const allWorkers = propWorkers && propWorkers.length > 0 ? propWorkers : storeWorkers;

  const targetTrade = (selectedSubCategory || selectedTradeId || 'all').toLowerCase().trim();

  const filteredWorkers = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (allWorkers || []).filter((w) => {
      // 1. City Filter
      const loc = (w.location || w.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Strict Subcategory / Trade Match
      const itemTrade = (w.subCategory || w.trade || w.sub_category || '').toLowerCase().trim();
      const matchesTrade = targetTrade === 'all' || itemTrade === targetTrade;
      if (!matchesTrade) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        w.name?.toLowerCase().includes(q) ||
        w.title?.toLowerCase().includes(q) ||
        w.description?.toLowerCase().includes(q) ||
        w.location?.toLowerCase().includes(q)
      );
    });
  }, [allWorkers, targetTrade, selectedCity, searchQuery]);

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {targetTrade !== 'all' ? targetTrade.replace('-', ' ') : 'All Kaarigars'}
          </h2>
          <p className="text-[10px] text-slate-500">Verified skilled workers in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Categories
        </button>
      </div>

      {/* Worker Cards */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛠️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No {targetTrade !== 'all' ? targetTrade : 'workers'} found in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredWorkers.map((w) => (
          <article
            key={w.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  w.image ||
                  w.photo ||
                  w.avatar ||
                  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700'
                }
                alt={w.name || w.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {w.visitingCharge || w.fee || w.price || 'Visiting: ₹ 200'}
              </span>

              <ListingDiscussionThread
                listingId={w.id}
                listingTitle={w.name || w.title}
                sellerName={w.name || 'Kaarigar'}
                sellerPhone={w.phone || w.whatsapp}
                interestCount={w.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5">
              <div className="flex items-start justify-between">
                <h3 className="font-black text-slate-900 text-sm">{w.name || w.title}</h3>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(w.subCategory || w.trade || 'KAARIGAR').toUpperCase()}
                </span>
              </div>

              {w.description && (
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">{w.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                <span>📍 {w.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{w.experience || '5+ Yrs Exp'}</span>
              </div>
            </div>

            <ActionButtons
              phone={w.phone || '9876543210'}
              whatsapp={w.whatsapp || w.phone || '919876543210'}
              message={`Namaste ${w.name || ''}, I found your Kaarigar profile on TownHub and need your service.`}
            />
          </article>
        ))
      )}
    </main>
  );
}