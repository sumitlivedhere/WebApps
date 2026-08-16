import React, { useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import ProviderDashboard from './ProviderDashboard';
import TownHubView from './categories/TownHubView';
import CategoryHub from './categories/CategoryHub';
import PropertyHub from './categories/PropertyHub';
import ListingsFeed from './components/ListingsFeed';
import { initialListings } from './data/mockData';

export default function HyperlocalHomeFeed() {
  const [userMode, setUserMode] = useState('buyer'); // 'buyer' | 'provider'
  const [currentScreen, setCurrentScreen] = useState('hub'); // 'hub' | 'category-hub' | 'property-hub' | 'listings'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [nestedPropType, setNestedPropType] = useState(null); // 'house' | 'tenancy' | null
  const [history, setHistory] = useState([]); // GLOBAL NAVIGATION HISTORY
  const [selectedCity, setSelectedCity] = useState('Alwar - Central');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState(initialListings);

  const handleSearchSubmit = (query) => {
    console.log('Searching backend for:', query);
  };

  // --- GLOBAL NAVIGATION ENGINE ---
  const navigateForward = (updates) => {
    // Save a snapshot of the current state before moving forward
    setHistory((prev) => [
      ...prev,
      { currentScreen, selectedCategory, selectedSubCategory, nestedPropType },
    ]);
    // Apply new state
    if (updates.screen !== undefined) setCurrentScreen(updates.screen);
    if (updates.category !== undefined) setSelectedCategory(updates.category);
    if (updates.subCategory !== undefined) setSelectedSubCategory(updates.subCategory);
    if (updates.nestedPropType !== undefined) setNestedPropType(updates.nestedPropType);
  };

  const goBack = () => {
    if (history.length > 0) {
      // Pop the last snapshot and restore it exactly
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev.currentScreen);
      setSelectedCategory(prev.selectedCategory);
      setSelectedSubCategory(prev.selectedSubCategory);
      setNestedPropType(prev.nestedPropType);
    } else {
      // Fallback if at root
      setCurrentScreen('hub');
      setSelectedCategory('all');
      setSelectedSubCategory('all');
      setNestedPropType(null);
    }
  };

  const isPropertyType = [
  'property', 'tenancy', 'rent-house', 'rent-shop', 
  'flat', 'plot', 'land', 'shop', 
  'house-1bhk', 'house-2bhk', 'house-3bhk', 'house-large', 'house-1floor', 'house-2floor'
].includes(selectedSubCategory);

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

        {/* USER / PROVIDER PILL SWITCH */}
        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] font-bold text-indigo-100">
            {userMode === 'buyer' ? '👤 Consumer Mode' : '💼 Business / Provider Mode'}
          </span>
          <div className="flex bg-indigo-900/60 p-0.5 rounded-full border border-white/20">
            <button
              type="button"
              onClick={() => setUserMode('buyer')}
              className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                userMode === 'buyer' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              Need Service
            </button>
            <button
              type="button"
              onClick={() => setUserMode('provider')}
              className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${
                userMode === 'provider' ? 'bg-amber-400 text-slate-900 shadow-sm' : 'text-indigo-200 hover:text-white'
              }`}
            >
              Provide / Sell
            </button>
          </div>
        </div>
      </header>

      {/* 2. PROVIDER / SELLER WORKFLOW */}
      {userMode === 'provider' && (
        <ProviderDashboard
          onBackToUserMode={() => setUserMode('buyer')}
          onAddListing={(newItem) => {
            setListings([newItem, ...listings]);
            setUserMode('buyer');
            setCurrentScreen('listings');
            setSelectedSubCategory(newItem.subCategory);
          }}
        />
      )}

{/* 3. SCREEN 1: HOMEPAGE (18 INTEREST TILES) */}
      {userMode === 'buyer' && currentScreen === 'hub' && (
        <TownHubView
          onSelectCategory={(catId) => {
            if (catId === 'property') {
              navigateForward({ screen: 'property-hub', category: catId });
            } else {
              navigateForward({ screen: 'category-hub', category: catId });
            }
          }}
        />
      )}

      {/* 4. DEDICATED PROPERTY HUB SCREEN */}
      {userMode === 'buyer' && currentScreen === 'property-hub' && (
        <PropertyHub
          nestedPropType={nestedPropType}
          onSelectNestedType={(type) => {
            navigateForward({ nestedPropType: type });
          }}
          onSelectPropertyType={(propType) => {
            navigateForward({ screen: 'listings', subCategory: propType });
          }}
          onBack={goBack}
        />
      )}

      {/* 5. DYNAMIC CATEGORY HUB */}
      {userMode === 'buyer' && currentScreen === 'category-hub' && (
        <CategoryHub
          categoryId={selectedCategory}
          onSelectSubCategory={(subCatId) => {
            if (subCatId === 'property') {
              navigateForward({ screen: 'property-hub' });
            } else {
              navigateForward({ screen: 'listings', subCategory: subCatId });
            }
          }}
          onBack={goBack}
        />
      )}

      {/* 6. LISTINGS FEED */}
      {userMode === 'buyer' && currentScreen === 'listings' && (
        <ListingsFeed
          listings={listings}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}
      
      {/* 6. BOTTOM NAVIGATION */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around items-center z-30">
        <button
          onClick={() => {
            setCurrentScreen('hub');
            setUserMode('buyer');
          }}
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px]"
        >
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 font-medium text-[10px]">
          <span className="text-lg">🔍</span>
          <span>Explore</span>
        </button>
        <button
          onClick={() => setUserMode('provider')}
          className="bg-indigo-600 text-white p-3 rounded-full shadow-lg -mt-6 border-4 border-slate-50 flex items-center justify-center hover:scale-105 transition"
        >
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