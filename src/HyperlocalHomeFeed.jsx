import React, { useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';

export default function HyperlocalHomeFeed() {
  const [activeTab, setActiveTab] = useState('classified'); // Default to Buy/Sell section
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('Alwar - Central');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. BUY/SELL CATEGORY TILES DEFINITION
  const buySellCategories = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'vehicle', name: 'Vehicle', icon: '🚗' },
    { id: 'property', name: 'Property', icon: '🏠' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
  ];

  // 2. MOCK LISTINGS DATA WITH SUB-CATEGORIES
  const listings = [
    {
      id: 1,
      type: 'classified',
      subCategory: 'vehicle',
      title: 'Hero Splendor Plus (2022) - Single Owner',
      price: '₹ 45,000',
      category: 'Vehicle • Bikes',
      location: 'Ward 12, Housing Board',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
      phone: '+919876543211',
      whatsapp: '919876543211',
      badge: 'Used Vehicle',
    },
    {
      id: 2,
      type: 'classified',
      subCategory: 'property',
      title: '2 BHK Independent House for Rent',
      price: '₹ 8,500 / mo',
      category: 'Property • House Rent',
      location: 'Near Company Bagh',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
      phone: '+919876543214',
      whatsapp: '919876543214',
      badge: 'Property Rent',
    },
    {
      id: 3,
      type: 'classified',
      subCategory: 'electronics',
      title: 'Samsung 43" Smart LED TV (Used 1 Yr)',
      price: '₹ 16,000',
      category: 'Electronics • TV',
      location: 'Manu Marg, Alwar',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
      phone: '+919876543215',
      whatsapp: '919876543215',
      badge: 'Electronics',
    },
    {
      id: 4,
      type: 'classified',
      subCategory: 'furniture',
      title: 'Wooden 6-Seater Sofa Set + Teak Table',
      price: '₹ 12,000',
      category: 'Furniture • Living Room',
      location: 'Scheme No. 2, Alwar',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
      phone: '+919876543216',
      whatsapp: '919876543216',
      badge: 'Furniture',
    },
    {
      id: 5,
      type: 'shop',
      subCategory: 'shop',
      title: 'Gupta Kirana & General Store',
      category: 'Local Shop • Grocery',
      location: 'Main Bazaar, Near Clock Tower',
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500',
      phone: '+919876543210',
      whatsapp: '919876543210',
      badge: 'Verified Shop',
    },
  ];

  // Filter listings based on main tab, selected sub-category tile, and voice search query
  const filteredListings = listings
    .filter((item) => (activeTab === 'all' ? true : item.type === activeTab))
    .filter((item) => {
      if (activeTab !== 'classified') return true;
      if (selectedSubCategory === 'all') return true;
      return item.subCategory === selectedSubCategory;
    })
    .filter(
      (item) =>
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSearchSubmit = (query) => {
    console.log("Searching backend for:", query);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-20 text-slate-800 font-sans">
      
      {/* 1. TOP HEADER WITH VOICE SEARCH */}
      <header className="sticky top-0 z-10 bg-indigo-700 text-white p-3.5 shadow-md">
        <div className="flex justify-between items-center mb-2.5">
          <div className="flex items-center space-x-1 cursor-pointer">
            <span className="text-[10px] bg-indigo-900/60 text-indigo-100 px-2 py-0.5 rounded-full font-bold">📍 City</span>
            <select 
              value={selectedCity} 
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold text-xs outline-none cursor-pointer text-white"
            >
              <option value="Alwar - Central" className="text-slate-900">Alwar - Central</option>
              <option value="Alwar - Station Rd" className="text-slate-900">Alwar - Station Rd</option>
              <option value="Alwar - Moti Nagar" className="text-slate-900">Alwar - Moti Nagar</option>
            </select>
          </div>
          <span className="text-[10px] text-indigo-200 font-medium">✨ Vernacular Voice Search</span>
        </div>

        <VoiceSearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>

      {/* 2. MAIN NAVIGATION TABS */}
      <nav className="flex space-x-2 p-3 overflow-x-auto no-scrollbar bg-white border-b border-slate-200">
        {[
          { id: 'all', label: '🌟 All Feed' },
          { id: 'classified', label: '🏷️ Buy/Sell Used (OLX)' },
          { id: 'shop', label: '🏪 Local Shops (JD)' },
          { id: 'deal', label: '🔥 Town Deals (FB)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSelectedSubCategory('all');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3. CLICKABLE CATEGORY TILES (VISIBLE ONLY IN BUY/SELL TAB OR ALL FEED) */}
      {(activeTab === 'classified' || activeTab === 'all') && (
        <section className="bg-white p-3.5 border-b border-slate-200">
          <div className="flex justify-between items-center mb-2.5">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Browse Categories
            </h2>
            {selectedSubCategory !== 'all' && (
              <button
                onClick={() => setSelectedSubCategory('all')}
                className="text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                Clear Filter ✕
              </button>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {buySellCategories.slice(1).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedSubCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  selectedSubCategory === cat.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl mb-1">{cat.icon}</span>
                <span className={`text-[11px] font-semibold text-center leading-tight ${
                  selectedSubCategory === cat.id ? 'text-indigo-700 font-bold' : 'text-slate-700'
                }`}>
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* 4. LISTINGS FEED */}
      <main className="p-3 space-y-4">
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <span className="text-3xl">🔍</span>
            <p className="text-slate-600 font-semibold text-xs mt-2">
              Is category me koi item nahi mila.
            </p>
            <button 
              onClick={() => setSelectedSubCategory('all')}
              className="mt-3 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-bold"
            >
              Show All Items
            </button>
          </div>
        ) : (
          filteredListings.map((item) => (
            <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="relative h-44 w-full bg-slate-100">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-1 rounded-md text-white shadow ${
                  item.type === 'shop' ? 'bg-blue-600' : 'bg-emerald-600'
                }`}>
                  {item.badge}
                </span>
                {item.price && (
                  <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-black text-sm px-2.5 py-1 rounded-lg">
                    {item.price}
                  </span>
                )}
              </div>

              <div className="p-3.5">
                <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>📍 {item.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <a
                    href={`tel:${item.phone}`}
                    className="flex items-center justify-center space-x-1 border border-slate-300 py-2 rounded-xl text-xs font-bold text-slate-700 active:bg-slate-50"
                  >
                    <span>📞 Call Seller</span>
                  </a>
                  <a
                    href={`https://wa.me/${item.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-1 bg-emerald-600 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700"
                  >
                    <span>💬 WhatsApp</span>
                  </a>
                </div>
              </div>
            </article>
          ))
        )}
      </main>

      {/* 5. BOTTOM NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-20">
        <button className="flex flex-col items-center text-indigo-600 font-bold text-[10px]">
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
          <span className="text-lg">🔍</span>
          <span>Explore</span>
        </button>
        <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg -mt-6 border-4 border-slate-50 flex items-center justify-center">
          <span className="text-xl font-bold">+</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
          <span className="text-lg">❤️</span>
          <span>Saved</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
          <span className="text-lg">👤</span>
          <span>Account</span>
        </button>
      </footer>

    </div>
  );
}