import React, { useState, useMemo, useRef, lazy, Suspense } from 'react';
import { useNotificationSlice, hyperlocalStore } from './store/hyperlocalStore';

// Instant Critical Screens & Hubs
import HyperlocalHomeFeed from './HyperlocalHomeFeed';
import TownHubView from './categories/TownHubView';
import NotificationCenter from './components/NotificationCenter';
import ContextualListingModal from './components/ContextualListingModal';

// Code-Split Lazy Loaded Hubs
const SurpriseFeed = lazy(() => import('./components/SurpriseFeed'));
const ProviderDashboard = lazy(() => import('./ProviderDashboard'));
const MedicalHub = lazy(() => import('./categories/MedicalHub'));
const PropertyHub = lazy(() => import('./categories/PropertyHub'));
const VehicleHub = lazy(() => import('./categories/VehicleHub'));
const ElectronicsHub = lazy(() => import('./categories/ElectronicsHub'));
const FashionHub = lazy(() => import('./categories/FashionHub'));
const FurnitureHub = lazy(() => import('./categories/FurnitureHub'));
const KaarigarHub = lazy(() => import('./categories/KaarigarHub'));
const TransporterHub = lazy(() => import('./categories/TransporterHub'));
const WhiteCollarHub = lazy(() => import('./categories/WhiteCollarHub'));
const EducationHub = lazy(() => import('./categories/EducationHub'));
const RestaurantsHub = lazy(() => import('./categories/RestaurantsHub'));
const MallsHub = lazy(() => import('./categories/MallsHub'));
const ShaadiHub = lazy(() => import('./categories/ShaadiHub'));
const ConstructionHub = lazy(() => import('./categories/ConstructionHub'));
const AdvertisingHub = lazy(() => import('./categories/AdvertisingHub'));
const CommunityHub = lazy(() => import('./categories/CommunityHub'));
const MarketHub = lazy(() => import('./categories/MarketHub'));
const ReCommerceHub = lazy(() => import('./categories/ReCommerceHub'));
const FitnessHub = lazy(() => import('./categories/FitnessHub'));
const CreatorsHub = lazy(() => import('./categories/CreatorsHub'));

// Code-Split Lazy Loaded Category Feeds
const ListingsFeed = lazy(() => import('./components/ListingsFeed'));
const PropertyFeed = lazy(() => import('./components/PropertyFeed'));
const MedicalFeed = lazy(() => import('./components/MedicalFeed'));
const KaarigarWorkerList = lazy(() => import('./components/KaarigarWorkerList'));
const TransporterFeed = lazy(() => import('./components/TransporterFeed'));
const WhiteCollarFeed = lazy(() => import('./components/WhiteCollarFeed'));
const EducationFeed = lazy(() => import('./components/EducationFeed'));
const RestaurantsFeed = lazy(() => import('./components/RestaurantsFeed'));
const MallsFeed = lazy(() => import('./components/MallsFeed'));
const ShaadiFeed = lazy(() => import('./components/ShaadiFeed'));
const ConstructionFeed = lazy(() => import('./components/ConstructionFeed'));
const AdvertisingFeed = lazy(() => import('./components/AdvertisingFeed'));
const CommunityFeed = lazy(() => import('./components/CommunityFeed'));
const MarketFeed = lazy(() => import('./components/MarketFeed'));
const ReCommerceFeed = lazy(() => import('./components/recommerce/ReCommerceFeed'));
const FitnessFeed = lazy(() => import('./components/FitnessFeed'));
const CreatorsFeed = lazy(() => import('./components/CreatorsFeed'));

function ScreenSkeleton() {
  return (
    <div className="p-4 space-y-3 animate-pulse">
      <div className="h-20 bg-slate-900/80 rounded-2xl"></div>
      <div className="h-44 bg-slate-900/60 rounded-2xl"></div>
      <div className="h-44 bg-slate-900/60 rounded-2xl"></div>
    </div>
  );
}

const INITIAL_NAV_STATE = {
  screen: 'home',
  category: 'property',
  subCategory: 'all',
  searchQuery: '',
};

export default function App() {
  const [history, setHistory] = useState([INITIAL_NAV_STATE]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedCity, setSelectedCity] = useState('Alwar');

  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Swipe Gesture Tracking Refs
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);

  const currentNav = history[historyIndex] || INITIAL_NAV_STATE;
  const {
    screen: currentScreen,
    category: selectedCategory,
    subCategory: selectedSubCategory,
    searchQuery,
  } = currentNav;

  const notifications = useNotificationSlice();
  const unreadNotifCount = useMemo(
    () => (notifications || []).filter((n) => !n.read).length,
    [notifications]
  );

  const navigateTo = (updates) => {
    const nextState = {
      screen: updates.screen !== undefined ? updates.screen : currentScreen,
      category: updates.category !== undefined ? updates.category : selectedCategory,
      subCategory: updates.subCategory !== undefined ? updates.subCategory : selectedSubCategory,
      searchQuery: updates.searchQuery !== undefined ? updates.searchQuery : searchQuery,
    };

    if (
      nextState.screen === currentScreen &&
      nextState.category === selectedCategory &&
      nextState.subCategory === selectedSubCategory &&
      nextState.searchQuery === searchQuery
    ) {
      return;
    }

    setHistory((prev) => {
      const branchCut = prev.slice(0, historyIndex + 1);
      return [...branchCut, nextState];
    });
    setHistoryIndex((prev) => prev + 1);
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const goBack = () => {
    if (canGoBack) setHistoryIndex((prev) => prev - 1);
  };

  const goForward = () => {
    if (canGoForward) setHistoryIndex((prev) => prev + 1);
  };

  const handleNewNotification = (notif) => {
    hyperlocalStore.addNotification(notif);
  };

  // 🌟 TOUCH SWIPE GESTURE HANDLERS
  const handleTouchStart = (e) => {
    if (isListingModalOpen || isNotificationsOpen) return;
    touchStartX.current = e.changedTouches[0].clientX;
    touchStartY.current = e.changedTouches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e) => {
    if (isListingModalOpen || isNotificationsOpen) return;

    const target = e.target;
    if (target.closest('.overflow-x-auto, input, textarea, select')) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    if (deltaTime < 550 && Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
      if (deltaX > 0) {
        if (canGoBack) goBack();
      } else {
        if (canGoForward) goForward();
      }
    }
  };

  const handleOpenCategory = (catId, sub = 'all') => {
    if (catId === 'surprise') {
      navigateTo({
        screen: 'surprise-feed',
        category: 'surprise',
        subCategory: 'all',
      });
      return;
    }

    const hubMap = {
      property: 'property-hub',
      vehicles: 'vehicle-hub',
      electronics: 'electronics-hub',
      fashion: 'fashion-hub',
      furniture: 'furniture-hub',
      kaarigar: 'kaarigar-hub',
      medical: 'medical-hub',
      transporters: 'transporter-hub',
      'white-collar': 'white-collar-hub',
      education: 'education-hub',
      restaurants: 'restaurants-hub',
      malls: 'malls-hub',
      shaadi: 'shaadi-hub',
      construction: 'construction-hub',
      advertising: 'advertising-hub',
      community: 'community-hub',
      market: 'market-hub',
      recommerce: 'buysell-hub',
      fitness: 'fitness-hub',
      creators: 'creators-hub',
    };

    navigateTo({
      screen: hubMap[catId] || 'town-hub',
      category: catId,
      subCategory: sub,
    });
  };

  const handleOpenFeed = (catId, subId) => {
    const feedMap = {
      property: 'property-feed',
      vehicles: 'listings',
      electronics: 'listings',
      fashion: 'listings',
      furniture: 'listings',
      kaarigar: 'kaarigar-feed',
      medical: 'medical-feed',
      transporters: 'transporter-feed',
      'white-collar': 'white-collar-feed',
      education: 'education-feed',
      restaurants: 'restaurants-feed',
      malls: 'malls-feed',
      shaadi: 'shaadi-feed',
      construction: 'construction-feed',
      advertising: 'advertising-feed',
      community: 'community-feed',
      market: 'market-feed',
      recommerce: 'recommerce-feed',
      fitness: 'fitness-feed',
      creators: 'creators-feed',
    };

    navigateTo({
      screen: feedMap[catId] || 'listings',
      category: catId,
      subCategory: subId,
    });
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-x-hidden font-sans select-none pb-24 touch-pan-y"
    >
      {/* 🌟 1. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md px-3 py-2 border-b border-slate-800 flex items-center justify-between shadow-md">
        {/* Left: Step History Controller */}
        <div className="flex items-center space-x-1.5 bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner shrink-0">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            title="Step Back (Swipe Right)"
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition active:scale-90 ${
              canGoBack
                ? 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-300 shadow-xs cursor-pointer'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
            }`}
          >
            ❮
          </button>

          <button
            type="button"
            onClick={goForward}
            disabled={!canGoForward}
            title="Step Forward (Swipe Left)"
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs transition active:scale-90 ${
              canGoForward
                ? 'bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-300 shadow-xs cursor-pointer'
                : 'bg-slate-900 text-slate-600 cursor-not-allowed opacity-40'
            }`}
          >
            ❯
          </button>
        </div>

        {/* Center: Brand Header */}
        <div
          onClick={() => navigateTo({ screen: 'home' })}
          className="flex items-center space-x-1.5 cursor-pointer active:scale-95 transition mx-1"
        >
          <span className="text-lg">🏛️</span>
          <div>
            <h1 className="text-[11px] font-black tracking-wider text-amber-400 uppercase leading-none">
              TownHub • {selectedCity}
            </h1>
            <p className="text-[8px] text-slate-400 font-semibold leading-none mt-0.5">
              Step {historyIndex + 1} of {history.length}
            </p>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {currentScreen !== 'home' && currentScreen !== 'provider-dashboard' && (
            <button
              type="button"
              onClick={() => setIsListingModalOpen(true)}
              className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-[10px] rounded-xl shadow-md active:scale-95 transition cursor-pointer flex items-center space-x-1"
              title="Post in this Category"
            >
              <span>+</span>
              <span>Post Here</span>
            </button>
          )}

          {/* 🔔 Live Alerts Button */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition cursor-pointer active:scale-90 border ${
              unreadNotifCount > 0
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-400/70 shadow-md shadow-amber-500/20'
                : 'bg-slate-900/90 border-slate-800 hover:bg-slate-800 text-slate-300'
            }`}
            title="Open Town Alerts"
          >
            <span className={`text-sm ${unreadNotifCount > 0 ? 'animate-bounce' : ''}`}>🔔</span>

            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex items-center justify-center rounded-full h-3 w-3 bg-rose-600 text-[8px] font-black text-white">
                  {unreadNotifCount}
                </span>
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 🌟 2. MAIN ACTIVE VIEW ROUTER */}
      <main className="flex-1">
        {currentScreen === 'home' && (
          <HyperlocalHomeFeed
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onSelectCategory={handleOpenCategory}
            searchQuery={searchQuery}
            onSearchChange={(q) => navigateTo({ searchQuery: q })}
            onOpenPostModal={() => setIsListingModalOpen(true)}
          />
        )}

        <Suspense fallback={<ScreenSkeleton />}>
          {currentScreen === 'surprise-feed' && (
            <SurpriseFeed
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}

          {currentScreen === 'provider-dashboard' && (
            <ProviderDashboard onBack={goBack} />
          )}

          {currentScreen === 'town-hub' && (
            <TownHubView
              category={selectedCategory}
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed(selectedCategory, sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'medical-hub' && (
            <MedicalHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('medical', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'property-hub' && (
            <PropertyHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('property', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'vehicle-hub' && (
            <VehicleHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('vehicles', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'electronics-hub' && (
            <ElectronicsHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('electronics', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'fashion-hub' && (
            <FashionHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('fashion', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'furniture-hub' && (
            <FurnitureHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('furniture', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'kaarigar-hub' && (
            <KaarigarHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('kaarigar', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'transporter-hub' && (
            <TransporterHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('transporters', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'white-collar-hub' && (
            <WhiteCollarHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('white-collar', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'education-hub' && (
            <EducationHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('education', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'restaurants-hub' && (
            <RestaurantsHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('restaurants', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'malls-hub' && (
            <MallsHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('malls', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'shaadi-hub' && (
            <ShaadiHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('shaadi', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'construction-hub' && (
            <ConstructionHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('construction', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'advertising-hub' && (
            <AdvertisingHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('advertising', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'community-hub' && (
            <CommunityHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('community', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'market-hub' && (
            <MarketHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('market', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'buysell-hub' && (
            <ReCommerceHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('recommerce', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'fitness-hub' && (
            <FitnessHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('fitness', sub)}
              onBack={goBack}
            />
          )}

          {currentScreen === 'creators-hub' && (
            <CreatorsHub
              selectedCity={selectedCity}
              onSelectSubCategory={(sub) => handleOpenFeed('creators', sub)}
              onBack={goBack}
            />
          )}

          {/* Feeds */}
          {currentScreen === 'listings' && (
            <ListingsFeed
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'property-feed' && (
            <PropertyFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'medical-feed' && (
            <MedicalFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'kaarigar-feed' && (
            <KaarigarWorkerList
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'transporter-feed' && (
            <TransporterFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'white-collar-feed' && (
            <WhiteCollarFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'education-feed' && (
            <EducationFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'restaurants-feed' && (
            <RestaurantsFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'malls-feed' && (
            <MallsFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'shaadi-feed' && (
            <ShaadiFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'construction-feed' && (
            <ConstructionFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'advertising-feed' && (
            <AdvertisingFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'community-feed' && (
            <CommunityFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'market-feed' && (
            <MarketFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'recommerce-feed' && (
            <ReCommerceFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'fitness-feed' && (
            <FitnessFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
          {currentScreen === 'creators-feed' && (
            <CreatorsFeed
              selectedSubCategory={selectedSubCategory}
              selectedCity={selectedCity}
              searchQuery={searchQuery}
              onBack={goBack}
              onNewNotification={handleNewNotification}
            />
          )}
        </Suspense>
      </main>

      {/* 🌟 3. FLOATING STEP HISTORY PILL */}
      <aside className="fixed bottom-16 right-4 z-40 flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border border-slate-700 shadow-2xl">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition active:scale-90 ${
            canGoBack
              ? 'bg-slate-800 text-amber-400 hover:bg-amber-400 hover:text-slate-950 cursor-pointer shadow-md'
              : 'bg-slate-950 text-slate-700 cursor-not-allowed opacity-30'
          }`}
          title="Go Back (Swipe Right)"
        >
          ◀
        </button>

        <span className="text-[9px] font-mono font-bold text-slate-400 px-1">
          {historyIndex + 1}/{history.length}
        </span>

        <button
          type="button"
          onClick={goForward}
          disabled={!canGoForward}
          className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition active:scale-90 ${
            canGoForward
              ? 'bg-slate-800 text-amber-400 hover:bg-amber-400 hover:text-slate-950 cursor-pointer shadow-md'
              : 'bg-slate-950 text-slate-700 cursor-not-allowed opacity-30'
          }`}
          title="Go Forward (Swipe Left)"
        >
          ▶
        </button>
      </aside>

      {/* 🌟 4. BOTTOM NAVIGATION BAR */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-6 py-2 z-30 flex items-center justify-around">
        <button
          type="button"
          onClick={() => navigateTo({ screen: 'home' })}
          className={`flex flex-col items-center cursor-pointer transition ${
            currentScreen === 'home' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">🏛️</span>
          <span className="text-[10px] font-bold">Town Hub</span>
        </button>

        <button
          type="button"
          onClick={() => setIsListingModalOpen(true)}
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-lg active:scale-95 transition -mt-5 ring-4 ring-slate-950 cursor-pointer"
        >
          +
        </button>

        <button
          type="button"
          onClick={() => navigateTo({ screen: 'provider-dashboard' })}
          className={`flex flex-col items-center cursor-pointer transition ${
            currentScreen === 'provider-dashboard' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-bold">My Business</span>
        </button>
      </footer>

      {/* Modals */}
      {isListingModalOpen && (
        <ContextualListingModal
          currentScreen={currentScreen}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          onClose={() => setIsListingModalOpen(false)}
        />
      )}

      {isNotificationsOpen && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
    </div>
  );
}