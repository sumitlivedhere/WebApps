import React from 'react';

// Built-in subcategory schema map for generic/fallback categories
const genericCategoryMap = {
  wholesellers: {
    name: 'Wholesellers & Mandi (थोक व्यापारी)',
    desc: 'B2B suppliers, grain mandi, bulk packaging & industrial goods',
    icon: '📦',
    subCategories: [
      { id: 'grain-mandi', name: 'Grain & Krishi Mandi (अनाज मंडी)', icon: '🌾' },
      { id: 'fmcg-wholesale', name: 'FMCG & Grocery Bulk (किराना थोक)', icon: '🛒' },
      { id: 'cloth-mandi', name: 'Textile & Cloth Wholesale (कपड़ा थोक)', icon: '🧵' },
      { id: 'plastic-packaging', name: 'Packaging & Disposables (पैकेजिंग)', icon: '📦' },
    ],
  },
  jobs: {
    name: 'Local Jobs & Vacancies (स्थानीय नौकरियाँ)',
    desc: 'Shop helpers, drivers, delivery staff, accountants & sales executive jobs',
    icon: '💼',
    subCategories: [
      { id: 'shop-staff', name: 'Retail & Shop Staff (दुकान सेल्समैन)', icon: '🏪' },
      { id: 'delivery-driver', name: 'Drivers & Delivery Boys (ड्राइवर व डिलीवरी)', icon: '🛵' },
      { id: 'office-accountant', name: 'Office Staff & Computer Operator (ऑफिस कार्य)', icon: '💻' },
      { id: 'factory-worker', name: 'Factory & Warehouse Labor (मजदूर व कारीगर)', icon: '🏭' },
    ],
  },
  news: {
    name: 'Town News & Updates (शहर की खबरें)',
    desc: 'Daily local headlines, weather, civic notices & business bulletins',
    icon: '📰',
    subCategories: [
      { id: 'city-headlines', name: 'City Headlines (मुख्य समाचार)', icon: '📢' },
      { id: 'mandi-bhav', name: 'Daily Mandi Bhav (मंडी भाव)', icon: '📊' },
      { id: 'civic-alerts', name: 'Power/Water Alerts (बिजली/पानी सूचना)', icon: '⚡' },
      { id: 'classified-news', name: 'Public Notices (सार्वजनिक सूचना)', icon: '📜' },
    ],
  },
  festival: {
    name: 'Festivals & Local Events (त्योहार व उत्सव)',
    desc: 'Mela, puja pandals, garba nights, cultural programs & exhibitions',
    icon: '🎉',
    subCategories: [
      { id: 'mela-exhibitions', name: 'Local Mela & Exhibitions (मेला व प्रदर्शनी)', icon: '🎡' },
      { id: 'puja-pandals', name: 'Religious Events & Pujas (धार्मिक आयोजन)', icon: '🪔' },
      { id: 'garba-cultural', name: 'Garba & Dance Events (डांडिया व सांस्कृतिक)', icon: '💃' },
      { id: 'sound-stage', name: 'Stage & Sound Bookings (स्टेज व साउंड)', icon: '🎤' },
    ],
  },
};

export default function CategoryHub({ categoryId, onSelectSubCategory, onBack }) {
  const activeCategory = genericCategoryMap[categoryId] || {
    name: 'Category Explorer',
    desc: 'Browse verified listings in this sector',
    icon: '📁',
    subCategories: [
      { id: `${categoryId}-general`, name: 'View All Listings in this Category', icon: '🔍' },
    ],
  };

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. HEADER */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{activeCategory.icon}</span>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              {activeCategory.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeCategory.desc}
            </p>
          </div>
        </div>
      </div>

      {/* 2. SUBCATEGORY TILES */}
      <div className="space-y-3 pb-6">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider block px-1">
          Select Sub-Category
        </span>

        {activeCategory.subCategories.map((sub) => (
          <div
            key={sub.id}
            onClick={() => onSelectSubCategory(sub.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden flex items-center justify-between"
          >
            <div className="flex items-center space-x-3.5 pl-1">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0">
                {sub.icon}
              </div>
              <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                {sub.name}
              </h3>
            </div>

            <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm shrink-0">
              ➔
            </div>
          </div>
        ))}

        {/* BACK BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}