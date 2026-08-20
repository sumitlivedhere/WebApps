import React, { useMemo } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import { getCategoryById } from '../data/taxonomyRegistry';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function KaarigarWorkerList({
  selectedTrade,
  selectedCategory,
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  const storeWorkers = useStoreSlice('kaarigarWorkers');
  const targetTrade = (selectedTrade || selectedCategory || 'all').toLowerCase().trim();
  const categoryConfig = getCategoryById('kaarigar');

  const filteredWorkers = useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    const city = (selectedCity || '').toLowerCase().trim();

    return (storeWorkers || []).filter((item) => {
      // 1. City Filter
      const loc = (item.location || item.city || '').toLowerCase();
      const matchesCity = !city || loc.includes(city) || city.includes(loc) || !loc;
      if (!matchesCity) return false;

      // 2. Subcategory Filter
      const itemSub = (item.subCategory || item.trade || item.tradeType || '').toLowerCase().trim();
      const matchesTrade = targetTrade === 'all' || itemSub === targetTrade;
      if (!matchesTrade) return false;

      // 3. Search Query Filter
      if (!q) return true;
      return (
        item.name?.toLowerCase().includes(q) ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.location?.toLowerCase().includes(q) ||
        item.experience?.toLowerCase().includes(q)
      );
    });
  }, [storeWorkers, targetTrade, selectedCity, searchQuery]);

  const getSubCategoryTitle = () => {
    if (targetTrade === 'all') return 'All Kaarigars & Mistris (सभी कारीगर)';
    const matched = categoryConfig.subCategories.find((s) => s.id === targetTrade);
    return matched ? matched.name : targetTrade.replace('-', ' ').toUpperCase();
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize">
            {getSubCategoryTitle()}
          </h2>
          <p className="text-[10px] text-slate-500">Live verified technicians & mistris in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Trades
        </button>
      </div>

      {/* Cards List */}
      {filteredWorkers.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🛠️</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            No technicians found under {targetTrade !== 'all' ? targetTrade : 'this trade'} in {selectedCity}.
          </p>
        </div>
      ) : (
        filteredWorkers.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition p-3.5 space-y-3 relative"
          >
            <div className="relative h-44 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={
                  item.image ||
                  item.photo ||
                  'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700'
                }
                alt={item.name || item.title}
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700';
                }}
              />
              <span className="absolute bottom-2.5 left-2.5 text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md border border-white/10">
                {item.price || item.rates || '₹150 Visiting Charge'}
              </span>

              <ListingDiscussionThread
                listingId={item.id}
                listingTitle={item.name || item.title}
                sellerName={item.name || 'Mistri'}
                sellerPhone={item.phone || item.whatsapp}
                interestCount={item.interestCount || 0}
                onNewNotification={onNewNotification}
              />
            </div>

            <div className="pt-0.5 space-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{item.name || item.title}</h3>
                  {item.experience && (
                    <p className="text-[10px] text-blue-700 font-bold">{item.experience}</p>
                  )}
                </div>
                <span className="text-[10px] font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md shrink-0 ml-2">
                  {(item.subCategory || 'TRADE').toUpperCase()}
                </span>
              </div>

              {item.description && (
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{item.description}</p>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-2 border-t border-slate-100">
                <span>📍 {item.location || selectedCity}</span>
                <span className="text-emerald-700 font-bold">{item.badge || item.arrivalSpeed || '🟢 Verified Mistri'}</span>
              </div>
            </div>

            <ActionButtons
              phone={item.phone || '9876543210'}
              whatsapp={item.whatsapp || item.phone || '919876543210'}
              message={`Namaste ${item.name || ''}, I found your profile on TownHub Kaarigar. I need repair/service work at my house in ${selectedCity}. Are you available today?`}
            />
          </article>
        ))
      )}
    </main>
  );
}