import React, { useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';

export default function HyperlocalHomeFeed() {
  const [activeTab, setActiveTab] = useState('all'); // Default to all so hub shows
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('Alwar - Central');
  const [searchQuery, setSearchQuery] = useState('');

  // Sub-filter states
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

  // Handle category selection and reset sub-filters
  const handleSelectSubCategory = (catId) => {
    setSelectedSubCategory(catId);
    setSelectedPriceRange('all');
    setSelectedBrand('all');
    setSelectedVehicleType('all');
  };

  // Sub-Vehicle Categories List
  const vehicleSubTypes = [
    { id: 'bike-petrol', name: 'Bikes (Petrol)', icon: '🏍️' },
    { id: 'bike-ev', name: 'Bikes (Electrical)', icon: '⚡🏍️' },
    { id: 'car', name: 'Cars', icon: '🚗' },
    { id: 'scooty-petrol', name: 'Scooty (Petrol)', icon: '🛵' },
    { id: 'scooty-ev', name: 'Scooty (Electrical)', icon: '⚡🛵' },
    { id: 'cycle', name: 'Cycle', icon: '🚲' },
    { id: 'misc', name: 'Miscellaneous', icon: '🚜' },
  ];

  // Stacked main categories
  // Stacked main categories
  const buySellCategories = [
    {
      id: 'property',
      name: 'Property',
      desc: 'Flats, houses, plots, commercial shops & rentals',
      icon: '🏠',
      count: '14+ Listings',
      accent: 'from-amber-500/10 to-orange-500/20 text-orange-600',
    },
    {
      id: 'vehicle',
      name: 'Vehicle',
      desc: 'Bikes, scooters, cars & commercial transport',
      icon: '🚗',
      count: '32+ Listings',
      accent: 'from-blue-500/10 to-indigo-500/20 text-indigo-600',
    },
    {
      id: 'electronics',
      name: 'Electronics',
      desc: 'Smartphones, LED TVs, laptops & home appliances',
      icon: '📱',
      count: '28+ Listings',
      accent: 'from-emerald-500/10 to-teal-500/20 text-teal-600',
    },
    {
      id: 'furniture',
      name: 'Furniture',
      desc: 'Sofa sets, wooden beds, dining tables & office chairs',
      icon: '🪑',
      count: '19+ Listings',
      accent: 'from-purple-500/10 to-pink-500/20 text-purple-600',
    },
  ];

  const townInterestCategories = [
    { id: 're-commerce', name: 'Re-commerce (खरीदो-बेचो)', desc: 'Used Bikes, Cars, Property & Mobiles', icon: '🛍️', accent: 'from-indigo-500/10 to-blue-500/20 text-indigo-600' },
    { id: 'market', name: 'Market (बाज़ार)', desc: 'Local Shops, Showrooms & Products', icon: '🏪', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'kaarigar', name: 'Kaarigar (कारीगर)', desc: 'Plumbers, Electricians, Carpenters & Mechanics', icon: '🛠️', accent: 'from-amber-500/10 to-orange-500/20 text-amber-600' },
    { id: 'transporters', name: 'Transporters (ट्रांसपोर्ट)', desc: 'Goods Pickups, Packers & Tempo Services', icon: '🚚', accent: 'from-purple-500/10 to-violet-500/20 text-purple-600' },
    { id: 'wholesellers', name: 'Wholesellers (थोक व्यापारी)', desc: 'Bulk Supplies, Mandi & B2B Dealers', icon: '📦', accent: 'from-rose-500/10 to-pink-500/20 text-rose-600' },
    { id: 'jobs', name: 'Local Jobs (नौकरी)', desc: 'Sales, Shop Staff, Drivers & Office Work', icon: '💼', accent: 'from-cyan-500/10 to-blue-500/20 text-cyan-600' },
    { id: 'news', name: 'Local News (खबर)', desc: 'Town Updates, Events & Weather Alerts', icon: '📰', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
    { id: 'community', name: 'Community Service (जनहित)', desc: 'Blood Donation, NGO & Helplines', icon: '🤝', accent: 'from-red-500/10 to-orange-500/20 text-red-600' },
    { id: 'advertising', name: 'Advertising (विज्ञापन)', desc: 'Promote your shop, banners & offers', icon: '📢', accent: 'from-yellow-500/10 to-amber-500/20 text-amber-600' },
    { id: 'matrimony', name: 'Shadi (विवाह)', desc: 'Local Matrimony & Wedding Vendors', icon: '💍', accent: 'from-pink-500/10 to-rose-500/20 text-pink-600' },
    { id: 'healthcare', name: 'Healthcare / Medical (स्वास्थ्य सेवाएँ)', desc: 'Emergency Doctors, Chemists, Blood Banks & Labs', icon: '🏥', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'festival', name: 'Festival / Utsav (त्योहार / उत्सव)', desc: 'Local Mela, Pandal, Garba, Events & Pujas', icon: '🎉', accent: 'from-violet-500/10 to-purple-500/20 text-purple-600' },
    { id: 'construction', name: 'Construction (निर्माण कार्य)', desc: 'Builders, Masons, Architects & Building Material', icon: '🏗️', accent: 'from-amber-600/10 to-yellow-500/20 text-amber-700' },
    { id: 'teaching', name: 'Teaching / Coaching (शिक्षण / कोचिंग)', desc: 'Tutors, Tuition Classes, Competitive Coaching & Institutes', icon: '📚', accent: 'from-blue-600/10 to-indigo-500/20 text-blue-700' },
    { id: 'malls', name: 'Malls & Shopping (मॉल और बाजार)', desc: 'Clothing Outlets, Multiplexes, Brands & Supermarkets', icon: '🛍️', accent: 'from-pink-600/10 to-rose-500/20 text-pink-700' },
    { id: 'restaurants', name: 'Restaurants & Cafes (रेस्टोरेंट और कैफे)', desc: 'Dine-in, Food Delivery, Street Food & Cafes', icon: '🍔', accent: 'from-orange-500/10 to-red-500/20 text-orange-600' },
    { id: 'white-collar', name: 'White Collar Services (वाइट कॉलर सेवाएँ)', desc: 'CAs, Lawyers, Financial Consultants & IT Experts', icon: '👔', accent: 'from-slate-600/10 to-zinc-500/20 text-slate-800' },
    { id: 'creative', name: 'Creative Professionals (क्रिएटिव प्रोफेशनल्स)', desc: 'Photographers, Videographers, Designers & Event Planners', icon: '📸', accent: 'from-purple-600/10 to-pink-500/20 text-purple-700' },
  ];

  // PROPERTY SPECIFIC PRICE FILTERS
  const propertyPriceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-25l', label: '< ₹25 Lakh' },
    { id: '25l-50l', label: '₹25L - ₹50L' },
    { id: '50l-1cr', label: '₹50L - ₹1 Cr' },
    { id: 'above-1cr', label: '> ₹1 Cr' },
  ];

  // VEHICLE SPECIFIC PRICE FILTERS & POPULAR MODELS/BRANDS
  const vehiclePriceRanges = [
    { id: 'all', label: 'All Prices' },
    { id: 'under-30k', label: '< ₹30k' },
    { id: '30k-50k', label: '₹30k - ₹50k' },
    { id: '50k-80k', label: '₹50k - ₹80k' },
    { id: 'above-80k', label: '> ₹80k' },
  ];

  const vehicleBrands = [
    { id: 'all', label: 'All Brands/Models' },
    { id: 'Splendor', label: 'Hero Splendor+' },
    { id: 'HF Deluxe', label: 'Hero HF Deluxe' },
    { id: 'Platina', label: 'Bajaj Platina' },
    { id: 'Activa', label: 'Honda Activa' },
    { id: 'Maruti', label: 'Maruti Cars' },
  ];

  // MOCK LISTINGS DATA WITH RAW VALUES FOR SORTING/FILTERING
  const listings = [
    {
      id: 1,
      type: 'classified',
      subCategory: 'vehicle',
      brand: 'Splendor',
      vehicleType: 'bike-petrol',
      rawPrice: 45000,
      title: 'Hero Splendor Plus (2022) - i3S Drum',
      price: '₹ 45,000',
      category: 'Vehicle • Bike',
      location: 'Ward 12, Housing Board',
      image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500',
      phone: '+919876543211',
      whatsapp: '919876543211',
      badge: 'Used Vehicle',
    },
    {
      id: 2,
      type: 'classified',
      subCategory: 'vehicle',
      brand: 'Platina',
      vehicleType: 'bike-petrol',
      rawPrice: 28000,
      title: 'Bajaj Platina 100cc (2019) - 70kmpl Mileage',
      price: '₹ 28,000',
      category: 'Vehicle • Bike',
      location: 'Station Road',
      image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500',
      phone: '+919876543213',
      whatsapp: '919876543213',
      badge: 'Used Vehicle',
    },
    {
      id: 3,
      type: 'classified',
      subCategory: 'vehicle',
      brand: 'Maruti',
      vehicleType: 'car',
      rawPrice: 180000,
      title: 'Maruti Alto K10 VXI (2018) - Single Hand',
      price: '₹ 1,80,000',
      category: 'Vehicle • Car',
      location: 'Moti Nagar, Alwar',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500',
      phone: '+919876543217',
      whatsapp: '919876543217',
      badge: 'Used Car',
    },
    {
      id: 4,
      type: 'classified',
      subCategory: 'property',
      rawPrice: 2200000,
      title: '2 BHK Independent House Plot (100 Sq Yd)',
      price: '₹ 22.5 Lakh',
      category: 'Property • House Sale',
      location: 'Near Company Bagh',
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500',
      phone: '+919876543214',
      whatsapp: '919876543214',
      badge: 'Property Sale',
    },
    {
      id: 5,
      type: 'classified',
      subCategory: 'property',
      rawPrice: 4200000,
      title: '3 BHK Villa with Gated Boundary & Parking',
      price: '₹ 42.0 Lakh',
      category: 'Property • Villa',
      location: 'NEB Housing Board',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500',
      phone: '+919876543218',
      whatsapp: '919876543218',
      badge: 'Property Sale',
    },
    {
      id: 6,
      type: 'classified',
      subCategory: 'electronics',
      rawPrice: 16000,
      title: 'Samsung 43" Smart LED TV (Used 1 Yr)',
      price: '₹ 16,000',
      category: 'Electronics • TV',
      location: 'Manu Marg, Alwar',
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=500',
      phone: '+919876543215',
      whatsapp: '919876543215',
      badge: 'Electronics',
    },
  ];

  // ADVANCED FILTER LOGIC FOR PRICE RANGES AND BRANDS
  const filteredListings = listings
    .filter((item) => (activeTab === 'all' ? true : item.type === activeTab))
    .filter((item) => {
      if (activeTab === 'classified' && selectedSubCategory !== 'all') {
        return item.subCategory === selectedSubCategory;
      }
      return true;
    })
    .filter((item) => {
      // Vehicle Sub-type & Brand Filter
      if (selectedSubCategory === 'vehicle') {
        if (selectedVehicleType !== 'all' && item.vehicleType && item.vehicleType !== selectedVehicleType) {
          return false;
        }
        if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
          return false;
        }
      }
      return true;
    })
    .filter((item) => {
      // Price Range Filter Logic
      if (selectedPriceRange === 'all') return true;

      if (selectedSubCategory === 'property') {
        if (selectedPriceRange === 'under-25l') return item.rawPrice < 2500000;
        if (selectedPriceRange === '25l-50l') return item.rawPrice >= 2500000 && item.rawPrice <= 5000000;
        if (selectedPriceRange === '50l-1cr') return item.rawPrice > 5000000 && item.rawPrice <= 10000000;
        if (selectedPriceRange === 'above-1cr') return item.rawPrice > 10000000;
      }

      if (selectedSubCategory === 'vehicle') {
        if (selectedPriceRange === 'under-30k') return item.rawPrice < 30000;
        if (selectedPriceRange === '30k-50k') return item.rawPrice >= 30000 && item.rawPrice <= 50000;
        if (selectedPriceRange === '50k-80k') return item.rawPrice > 50000 && item.rawPrice <= 80000;
        if (selectedPriceRange === 'above-80k') return item.rawPrice > 80000;
      }

      return true;
    })
    .filter(
      (item) =>
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSearchSubmit = (query) => {
    console.log('Searching backend for:', query);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900/5 backdrop-blur-2xl pb-24 text-slate-800 font-sans relative overflow-hidden">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-10 left-[-20%] w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-[-20%] w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-30 bg-indigo-700/90 backdrop-blur-md text-white p-3.5 shadow-lg border-b border-white/10">
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
      
     {/*3 BUY / SELL CONCENTRATED FOCUS VIEW */}
      {selectedSubCategory === 'all' && (
        <section className="px-4 py-4 relative z-10">
          
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Re-commerce Hub (खरीदो-बेचो)
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
              What would you like to buy or sell?
            </h2>
          </div>

     {/* 6 Clean Floating Tiles Stacked Vertically */}
       <div className="space-y-3.5 pb-6">
            {[
              { id: 'property', name: 'Property', desc: 'Flats, land, independent houses & rentals', icon: '🏠', accent: 'from-amber-500/10 to-orange-500/20 text-orange-600' },
              { id: 'vehicle', name: 'Vehicles', desc: 'Used bikes, scooters, cars & parts', icon: '🚗', accent: 'from-blue-500/10 to-indigo-500/20 text-indigo-600' },
              { id: 'furniture', name: 'Furniture', desc: 'Sofa sets, wooden beds & dining tables', icon: '🪑', accent: 'from-purple-500/10 to-pink-500/20 text-purple-600' },
              { id: 'electronics', name: 'Electronics', desc: 'Smartphones, LED TVs, laptops & appliances', icon: '📱', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
              { id: 'clothes', name: 'Clothes & Fashion', desc: 'Traditional wear, jackets & accessories', icon: '👕', accent: 'from-rose-500/10 to-pink-500/20 text-rose-600' },
              { id: 'misc', name: 'Miscellaneous', desc: 'Other used goods, books & town items', icon: '📦', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
            ].map((tile) => (
              <div
                key={tile.id}
                onClick={() => setSelectedSubCategory(tile.id)}
                className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[88px] flex items-center"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>

                <div className="flex items-center justify-between pl-2 w-full">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                      {tile.icon}
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        {tile.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                        {tile.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                    ➔
                  </div>
                </div>
              </div>
            ))}

      {/* Simple Back Button to Main Hub */}
            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedSubCategory('all');
                  setActiveTab('all');
                }}
                className="w-full py-3 bg-white/90 hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </section>
      )}


      {/* 4. LISTINGS FEED WITH DYNAMIC SORTING / PRICE BRACKETS */}
      {(activeTab !== 'classified' || selectedSubCategory !== 'all') && (
        <main className="p-3.5 space-y-3.5 relative z-10">
          
          {/* VEHICLE SUB-TYPE TILES SCREEN (Shown when Vehicle category is clicked but no vehicle type selected) */}
          {selectedSubCategory === 'vehicle' && selectedVehicleType === 'all' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80">
                <div>
                  <h2 className="text-sm font-black text-slate-900">Select Vehicle Category</h2>
                  <p className="text-[10px] text-slate-500">Choose vehicle type to view available options</p>
                </div>
                <button
                  onClick={() => handleSelectSubCategory('all')}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100"
                >
                  ← All Categories
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {vehicleSubTypes.map((vType) => (
                  <button
                    key={vType.id}
                    onClick={() => setSelectedVehicleType(vType.id)}
                    className="flex flex-col items-center justify-center p-3.5 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center"
                  >
                    <span className="text-3xl mb-1">{vType.icon}</span>
                    <span className="text-xs font-bold text-slate-800 leading-tight">{vType.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORY TOP HEADER & FILTER BAR (Shown once sub-category or vehicle sub-type is selected) */}
          {activeTab === 'classified' && selectedSubCategory !== 'all' && (selectedSubCategory !== 'vehicle' || selectedVehicleType !== 'all') && (
            <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {selectedSubCategory === 'vehicle' 
                      ? vehicleSubTypes.find(v => v.id === selectedVehicleType)?.icon 
                      : buySellCategories.find((c) => c.id === selectedSubCategory)?.icon}
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                      {selectedSubCategory === 'vehicle'
                        ? vehicleSubTypes.find(v => v.id === selectedVehicleType)?.name
                        : `${selectedSubCategory} Listings`}
                    </h2>
                    <p className="text-[10px] text-slate-500">Filtered for {selectedCity}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (selectedSubCategory === 'vehicle' && selectedVehicleType !== 'all') {
                      setSelectedVehicleType('all');
                    } else {
                      handleSelectSubCategory('all');
                    }
                  }}
                  className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100 active:scale-95 transition"
                >
                  {selectedSubCategory === 'vehicle' ? '← Vehicles' : '← All Categories'}
                </button>
              </div>

              {/* DYNAMIC PRICE RANGE FILTER PILLS FOR PROPERTY */}
              {selectedSubCategory === 'property' && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Filter by Price Range
                  </span>
                  <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                    {propertyPriceRanges.map((range) => (
                      <button
                        key={range.id}
                        onClick={() => setSelectedPriceRange(range.id)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                          selectedPriceRange === range.id
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* DYNAMIC PRICE & BRAND FILTER PILLS FOR VEHICLES */}
              {selectedSubCategory === 'vehicle' && (
                <div className="space-y-2 pt-1 border-t border-slate-100">
                  
                  {/* Vehicle Brand / Model Selector */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                      Popular Companies / Models
                    </span>
                    <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                      {vehicleBrands.map((brand) => (
                        <button
                          key={brand.id}
                          onClick={() => setSelectedBrand(brand.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            selectedBrand === brand.id
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {brand.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Vehicle Budget Ranges */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                      Budget Bracket
                    </span>
                    <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                      {vehiclePriceRanges.map((range) => (
                        <button
                          key={range.id}
                          onClick={() => setSelectedPriceRange(range.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                            selectedPriceRange === range.id
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* LISTINGS FEED CARDS */}
          {filteredListings.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
              <span className="text-3xl">🔍</span>
              <p className="text-slate-600 font-bold text-xs mt-2">
                Selected price filter me koi listing nahi mili.
              </p>
              <button
                onClick={() => {
                  setSelectedPriceRange('all');
                  setSelectedBrand('all');
                }}
                className="mt-3 text-xs bg-indigo-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-md"
              >
                Clear Price & Model Filters
              </button>
            </div>
          ) : (
            filteredListings.map((item) => (
              <article
                key={item.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg transition duration-200"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-1 rounded-md text-white shadow ${
                      item.type === 'shop' ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  >
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
                      className="flex items-center justify-center space-x-1 border border-slate-300/80 py-2 rounded-xl text-xs font-bold text-slate-700 active:bg-slate-50"
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
      )}

      {/* 5. BOTTOM NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around items-center z-30">
        <button className="flex flex-col items-center text-indigo-600 font-bold text-[10px]">
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
          <span className="text-lg">🔍</span>
          <span>Explore</span>
        </button>
        <button className="bg-indigo-600 text-white p-3 rounded-full shadow-lg -mt-6 border-4 border-slate-50 flex items-center justify-center hover:scale-105 transition">
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