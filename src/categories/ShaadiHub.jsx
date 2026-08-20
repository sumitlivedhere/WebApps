import React, { useState, useMemo } from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';
import { useStoreSlice } from '../store/hyperlocalStore';
import ActionButtons from '../components/common/ActionButtons';

const SERVICE_PILLAR_FILTERS = [
  { id: 'all', label: 'All Wedding Services' },
  { id: 'combo-offers', label: '🎁 All-in-One Combos' },
  { id: 'home-makeover-workers', label: '🏠 Home Makeover Pros' },
  { id: 'guest-management', label: '🏨 Guest Stays & Drivers' },
  { id: 'marriage-gardens', label: '🏰 Gardens & Banquets' },
  { id: 'halwai-caterers', label: '🍲 Halwai & Catering' },
  { id: 'tent-light-sound', label: '🎪 Tent & DJ Sound' },
  { id: 'bridal-makeup-mehendi', label: '💄 Bridal Makeup' },
  { id: 'baraat-rituals-pooja', label: '🎺 Ghodi & Safa' },
];

const BUDGET_TIER_FILTERS = [
  { id: 'all', label: 'All Budgets' },
  { id: 'budget-smart', label: '🌱 Budget-Smart (Under ₹5 Lakh)' },
  { id: 'grand-royale', label: '👑 Grand Royale (₹10 - ₹25 Lakh)' },
  { id: 'imperial-luxury', label: '🏰 Imperial Heritage (₹30 Lakh+)' },
];

const GUEST_SCALE_FILTERS = [
  { id: 'all', label: 'All Guest Scales' },
  { id: 'intimate-250', label: '👨‍👩‍👧 100 - 250 Guests' },
  { id: 'grand-750', label: '🎉 500 - 750 Guests' },
  { id: 'mega-1500', label: '👑 1,000 - 1,500+ Guests' },
];

export default function ShaadiHub({
  selectedCity = 'Alwar',
  onSelectSubCategory,
  onSelectShaadiCategory,
  onBack,
}) {
  const categoryConfig = getCategoryById('shaadi');
  const storeVendors = useStoreSlice('shaadiVendors');

  // Filter States
  const [selectedPillar, setSelectedPillar] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedGuest, setSelectedGuest] = useState('all');

  // Surprise State
  const [surpriseBundle, setSurpriseBundle] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  const handleSelect = (subId, catName) => {
    if (typeof onSelectSubCategory === 'function') {
      onSelectSubCategory(subId);
    } else if (typeof onSelectShaadiCategory === 'function') {
      onSelectShaadiCategory(subId, catName);
    }
  };

  // Compute Matched Pool
  const matchedVendors = useMemo(() => {
    return (storeVendors || []).filter((item) => {
      const sub = (item.subCategory || '').toLowerCase();
      const budget = (item.budgetTier || '').toLowerCase();
      const guest = (item.guestScale || '').toLowerCase();

      const matchesPillar = selectedPillar === 'all' || sub === selectedPillar;
      const matchesBudget = selectedBudget === 'all' || budget === selectedBudget;
      const matchesGuest = selectedGuest === 'all' || guest === selectedGuest;

      return matchesPillar && matchesBudget && matchesGuest;
    });
  }, [storeVendors, selectedPillar, selectedBudget, selectedGuest]);

  // Roll Surprise Package
  const handleRollSurprise = () => {
    setIsSpinning(true);
    setSurpriseBundle(null);

    setTimeout(() => {
      const pool = matchedVendors.length > 0 ? matchedVendors : storeVendors;
      if (pool && pool.length > 0) {
        const randomIndex = Math.floor(Math.random() * pool.length);
        setSurpriseBundle(pool[randomIndex]);
        setMatchCount(pool.length);
      }
      setIsSpinning(false);
    }, 450);
  };

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-100 pb-10">
      
      {/* 🌟 1. ROYAL IMPERIAL WEDDING HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-950 via-red-950 to-amber-950 p-4 border border-amber-500/40 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-rose-600 rounded-full blur-2xl opacity-15 pointer-events-none"></div>

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              <span>Shaadi 360° Ecosystem • {selectedCity}</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white mt-1 flex items-center space-x-1.5">
              <span>💍 Shaadi & Wedding</span>
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-rose-200 bg-clip-text text-transparent">
                Planning Hub
              </span>
            </h2>
            <p className="text-[11px] text-rose-200/90 font-medium">
              Turnkey Combos, Direct Workers, Guest Stays & Vehicles with Drivers
            </p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-white/10 hover:bg-white/20 text-amber-100 px-3 py-1.5 rounded-xl font-bold backdrop-blur-md active:scale-95 transition cursor-pointer border border-white/10"
          >
            ← Town Hub
          </button>
        </div>

        {/* Quality Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-xl py-1 backdrop-blur-xs">
            <div className="text-xs font-black text-amber-300">🎁 Mega Combos</div>
            <div className="text-[8px] text-slate-300 font-semibold">Max Bundle Savings</div>
          </div>
          <div className="bg-white/5 rounded-xl py-1 backdrop-blur-xs">
            <div className="text-xs font-black text-rose-300">👷 Direct Workers</div>
            <div className="text-[8px] text-slate-300 font-semibold">Painters & Electricians</div>
          </div>
          <div className="bg-white/5 rounded-xl py-1 backdrop-blur-xs">
            <div className="text-xs font-black text-cyan-300">🏨 Stays & Drivers</div>
            <div className="text-[8px] text-slate-300 font-semibold">Hotels & Innova Fleet</div>
          </div>
        </div>
      </div>

      {/* 🌟 2. THREE PRIMARY HIGHLIGHTED FAMILY ACTION TILES */}
      <div className="grid grid-cols-1 gap-2.5">
        
        {/* Card 1: All-in-One Combo Offers (NEW) */}
        <button
          type="button"
          onClick={() => handleSelect('combo-offers', 'All-in-One Combos')}
          className="p-3.5 bg-gradient-to-r from-amber-950 via-rose-950 to-slate-950 border border-amber-400/50 rounded-2xl text-left hover:scale-[1.01] active:scale-95 transition cursor-pointer flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <span className="text-3xl p-2 bg-amber-500/20 rounded-2xl border border-amber-400/30">🎁</span>
            <div>
              <div className="inline-flex items-center space-x-1.5">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">All-in-One Shaadi Combo Offers</span>
                <span className="text-[8px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md">BULK SAVINGS</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5">
                Trusted coordinators & wholesale aggregates who bundle all wedding buying, catering & decor in one discounted package
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-300 shrink-0 ml-2">Explore ➔</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 2: Ghar Ka Makeover (Direct Workers & Works Needed) */}
          <button
            type="button"
            onClick={() => handleSelect('home-makeover-workers', 'Home Makeover Workers')}
            className="p-3 bg-gradient-to-br from-amber-900/40 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl text-left hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-32 shadow-md"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-2xl p-1.5 bg-amber-500/20 rounded-xl">🏠</span>
              <span className="text-[8px] font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-md">INDIVIDUAL PROS</span>
            </div>
            <div>
              <div className="text-xs font-black text-amber-200">Ghar Ka Makeover & Works</div>
              <div className="text-[9px] text-slate-300">Hire individual painters, rice-light electricians, cleaners & bedding rentals</div>
            </div>
          </button>

          {/* Card 3: Guest Management (Hotels & Vehicles with Drivers) */}
          <button
            type="button"
            onClick={() => handleSelect('guest-management', 'Guest Management')}
            className="p-3 bg-gradient-to-br from-blue-950/50 via-slate-900 to-slate-950 border border-blue-500/30 rounded-2xl text-left hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-32 shadow-md"
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-2xl p-1.5 bg-blue-500/20 rounded-xl">🏨</span>
              <span className="text-[8px] font-black px-1.5 py-0.2 bg-cyan-400 text-slate-950 rounded-md">STAYS & FLEET</span>
            </div>
            <div>
              <div className="text-xs font-black text-cyan-200">Guest Management</div>
              <div className="text-[9px] text-slate-300">Book hotels/rooms + Innova & Tempo Travellers with local drivers</div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌟 3. INTERACTIVE "SHAADI 360° PACKAGE & BUDGET MATCHER" */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/40 p-4 rounded-3xl border border-amber-500/30 shadow-xl space-y-3.5 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">👑</span>
            <div>
              <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider">
                Shaadi 360° Package & Budget Matcher
              </h3>
              <p className="text-[10px] text-slate-400">
                Filter by your stage & budget to get the best verified local option
              </p>
            </div>
          </div>

          <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {matchedVendors.length} Options Ready
          </span>
        </div>

        {/* Filter 1: Service Pillar */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            1. Stage / Department
          </label>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SERVICE_PILLAR_FILTERS.map((pil) => (
              <button
                key={pil.id}
                type="button"
                onClick={() => setSelectedPillar(pil.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition cursor-pointer ${
                  selectedPillar === pil.id
                    ? 'bg-amber-400 text-slate-950 font-black shadow-sm scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {pil.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter 2: Budget Scale */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            2. Budget Scale
          </label>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {BUDGET_TIER_FILTERS.map((bud) => (
              <button
                key={bud.id}
                type="button"
                onClick={() => setSelectedBudget(bud.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition cursor-pointer ${
                  selectedBudget === bud.id
                    ? 'bg-rose-600 text-white font-black shadow-sm scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {bud.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter 3: Guest Scale */}
        <div className="space-y-1">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
            3. Guest Scale
          </label>
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {GUEST_SCALE_FILTERS.map((gst) => (
              <button
                key={gst.id}
                type="button"
                onClick={() => setSelectedGuest(gst.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition cursor-pointer ${
                  selectedGuest === gst.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-sm scale-105'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {gst.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Trigger Button */}
        <button
          type="button"
          onClick={handleRollSurprise}
          disabled={isSpinning}
          className={`w-full py-2.5 px-4 rounded-2xl font-black text-xs shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center space-x-2 border border-amber-400/40 ${
            isSpinning
              ? 'bg-slate-800 text-slate-400 animate-pulse cursor-wait'
              : 'bg-gradient-to-r from-amber-500 via-rose-600 to-amber-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black shadow-amber-500/20'
          }`}
        >
          <span className={`text-base ${isSpinning ? 'animate-spin' : ''}`}>👑</span>
          <span>{isSpinning ? 'Bundling Best Deals...' : 'Surprise Me with a Verified Deal / Package!'}</span>
        </button>

        
      </section>

      {/* 🌟 4. SECTOR SUBCATEGORY TILES */}
      <section className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center space-x-1.5">
            <span>💍</span>
            <span>Browse All Wedding Sectors</span>
          </h3>
          <span className="text-[10px] text-amber-400 font-bold">
            {categoryConfig.subCategories.length} Specialized Sectors
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleSelect('all', 'All Wedding Services')}
            className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-28 border border-slate-800"
          >
            <span className="text-xl">🌟</span>
            <div>
              <div className="text-xs font-black">All Shaadi Services</div>
              <div className="text-[9px] text-slate-400 font-normal">All specialists & packages</div>
            </div>
          </button>

          {categoryConfig.subCategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => handleSelect(sub.id, sub.name)}
              className="p-3.5 bg-slate-900/90 hover:bg-slate-850 text-white rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-28 border border-slate-800 hover:border-amber-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{sub.icon || '💍'}</span>
                <span className="text-[8px] font-black px-1.5 py-0.2 rounded-md bg-amber-500 text-slate-950 font-bold uppercase">
                  {sub.tag || 'SHAADI'}
                </span>
              </div>
              <div>
                <div className="text-xs font-black leading-tight text-slate-100">{sub.name.split('(')[0]}</div>
                <div className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate">
                  {sub.name.match(/\((.*?)\)/)?.[1] || 'विवाह सेवा'}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 🌟 5. VENDOR ONBOARDING BANNER */}
      <div className="p-3 bg-gradient-to-r from-slate-900 via-rose-950/60 to-slate-900 border border-amber-600/40 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <span className="text-xl">🎪</span>
          <div>
            <div className="text-xs font-black text-amber-300">Are you a Wedding Vendor, Driver or Worker?</div>
            <div className="text-[10px] text-slate-300">Connect directly with families planning weddings in {selectedCity}. Zero commission.</div>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 shrink-0">List Service ➔</span>
      </div>
    </div>
  );
}