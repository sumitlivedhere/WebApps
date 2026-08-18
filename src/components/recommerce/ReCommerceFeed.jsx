import React, { useState, useMemo } from 'react';
import { RE_COMMERCE_SUB_CATEGORIES, RE_COMMERCE_CONDITIONS } from '../../data/reCommerceData';

export default function ReCommerceFeed({ listings, selectedCity, searchQuery, onBack }) {
  const [activeSubCat, setActiveSubCat] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [negotiableOnly, setNegotiableOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredItems = useMemo(() => {
    const q = searchQuery ? searchQuery.toLowerCase().trim() : '';

    const results = [];
    for (let i = 0; i < listings.length; i++) {
      const item = listings[i];

      if (item.status === 'SOLD') continue;
      if (activeSubCat !== 'all' && item.subCategory !== activeSubCat) continue;
      if (selectedCondition !== 'all' && item.condition !== selectedCondition) continue;
      if (negotiableOnly && !item.isNegotiable) continue;

      if (q) {
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        if (!matches) continue;
      }

      results.push(item);
    }

    if (sortOrder === 'low-to-high') {
      results.sort((a, b) => a.rawPrice - b.rawPrice);
    } else if (sortOrder === 'high-to-low') {
      results.sort((a, b) => b.rawPrice - a.rawPrice);
    }

    return results;
  }, [listings, activeSubCat, selectedCondition, negotiableOnly, sortOrder, searchQuery]);

  return (
    <div className="space-y-3 p-3 animate-fadeIn pb-24 text-slate-800">
      {/* Subcategory Pills */}
      <div className="flex space-x-2 overflow-x-auto no-scrollbar py-1">
        {RE_COMMERCE_SUB_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveSubCat(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeSubCat === cat.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm text-[11px]">
        <label className="flex items-center space-x-1.5 cursor-pointer font-bold text-slate-700">
          <input
            type="checkbox"
            checked={negotiableOnly}
            onChange={(e) => setNegotiableOnly(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-0"
          />
          <span>Negotiable Only</span>
        </label>

        <div className="flex items-center space-x-1">
          <select
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 outline-none"
          >
            <option value="all">All Conditions</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-bold text-slate-700 outline-none"
          >
            <option value="newest">Newest</option>
            <option value="low-to-high">₹ Low to High</option>
            <option value="high-to-low">₹ High to Low</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm my-6">
          <div className="text-3xl mb-2">📦</div>
          <h4 className="text-sm font-black text-slate-800">No Used Items Found</h4>
          <p className="text-xs text-slate-400 mt-1">Try resetting filters or expanding your search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const conditionMeta = RE_COMMERCE_CONDITIONS.find((c) => c.id === item.condition);
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col transition hover:border-indigo-300"
              >
                {/* Photo & Badge Overlay */}
                <div className="relative h-44 w-full bg-slate-100">
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=60'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm ${conditionMeta?.badge}`}>
                      {conditionMeta?.label.split(' ')[0]}
                    </span>
                    {item.isNegotiable && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-sm">
                        Negotiable
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-2.5 right-2.5 text-[10px] font-bold bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg">
                    📍 {item.location}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-black text-slate-900 leading-snug line-clamp-1">{item.title}</h3>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span>⏳ {item.ageMonths} mos old</span>
                        <span>•</span>
                        <span>{item.hasBillOrBox ? '📄 Bill/Box Available' : 'No Bill/Box'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">{item.price}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-xl">
                    {item.description}
                  </p>

                  {/* Actions & Contact Bar */}
                  <div className="pt-1 flex items-center justify-between gap-2 border-t border-slate-100">
                    <div className="flex items-center space-x-1 text-[10px] text-slate-500 font-bold">
                      <span>👤 {item.seller.name}</span>
                      {item.seller.isVerified && <span className="text-indigo-600">✓</span>}
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <a
                        href={`https://wa.me/91${item.seller.phone}?text=${encodeURIComponent(`Hi ${item.seller.name}, I am interested in your "${item.title}" listed for ${item.price} on TownHub.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-black flex items-center space-x-1 shadow-sm active:scale-95 transition"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${item.seller.phone}`}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-[11px] font-black flex items-center space-x-1 active:scale-95 transition"
                      >
                        <span>📞</span>
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}