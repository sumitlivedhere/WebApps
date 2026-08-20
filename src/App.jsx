import React, { useState, useMemo } from 'react';
import {
  useStoreSlice,
  useNotificationSlice,
  hyperlocalStore,
} from './store/hyperlocalStore';

// Top-Level Screen Components
import HyperlocalHomeFeed from './HyperlocalHomeFeed';
import ProviderDashboard from './ProviderDashboard';
import NotificationCenter from './components/NotificationCenter';
import ContextualListingModal from './components/ContextualListingModal';

// Sector Hub Components
import CategoryHub from './categories/CategoryHub';
import TownHubView from './categories/TownHubView';
import VehicleHub from './categories/VehicleHub';
import PropertyHub from './categories/PropertyHub';
import ElectronicsHub from './categories/ElectronicsHub';
import FashionHub from './categories/FashionHub';
import FurnitureHub from './categories/FurnitureHub';
import KaarigarHub from './categories/KaarigarHub';
import TransporterHub from './categories/TransporterHub';
import WhiteCollarHub from './categories/WhiteCollarHub';
import EducationHub from './categories/EducationHub';
import RestaurantsHub from './categories/RestaurantsHub';
import MallsHub from './categories/MallsHub';
import ShaadiHub from './categories/ShaadiHub';
import ConstructionHub from './categories/ConstructionHub';
import AdvertisingHub from './categories/AdvertisingHub';
import CommunityHub from './categories/CommunityHub';
import MarketHub from './categories/MarketHub';
import ReCommerceHub from './categories/ReCommerceHub';

// Feed Components
import ListingsFeed from './components/ListingsFeed';
import KaarigarWorkerList from './components/KaarigarWorkerList';
import TransporterFeed from './components/TransporterFeed';
import WhiteCollarFeed from './components/WhiteCollarFeed';
import EducationFeed from './components/EducationFeed';
import RestaurantsFeed from './components/RestaurantsFeed';
import MallsFeed from './components/MallsFeed';
import ShaadiFeed from './components/ShaadiFeed';
import ConstructionFeed from './components/ConstructionFeed';
import AdvertisingFeed from './components/AdvertisingFeed';
import CommunityFeed from './components/CommunityFeed';
import MarketFeed from './components/MarketFeed';
import ReCommerceFeed from './components/recommerce/ReCommerceFeed';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCity, setSelectedCity] = useState('Alwar');
  const [selectedCategory, setSelectedCategory] = useState('property');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // ⚡ Live Reactive Store Subscriptions
  const listings = useStoreSlice('listings');
  const marketProducts = useStoreSlice('marketProducts');
  const kaarigarWorkers = useStoreSlice('kaarigarWorkers');
  const transportFirms = useStoreSlice('transportFirms');
  const individualTransporters = useStoreSlice('individualTransporters');
  const communityDrives = useStoreSlice('communityDrives');
  const shaadiVendors = useStoreSlice('shaadiVendors');
  const advertisingProviders = useStoreSlice('advertisingProviders');
  const educationListings = useStoreSlice('educationListings');
  const constructionListings = useStoreSlice('constructionListings');
  const mallsStores = useStoreSlice('mallsStores');
  const restaurantsList = useStoreSlice('restaurantsList');
  const whiteCollarListings = useStoreSlice('whiteCollarListings');
  const reCommerceListings = useStoreSlice('reCommerceListings');
  const notifications = useNotificationSlice();

  const unreadNotifCount = useMemo(
    () => (notifications || []).filter((n) => !n.read).length,
    [notifications]
  );

  const handleOpenCategory = (categoryId, subCategory = 'all') => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(subCategory);

    const hubMapping = {
      property: 'property-hub',
      vehicles: 'vehicle-hub',
      electronics: 'electronics-hub',
      fashion: 'fashion-hub',
      furniture: 'furniture-hub',
      kaarigar: 'kaarigar-hub',
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
    };

    setCurrentScreen(hubMapping[categoryId] || 'town-hub');
  };

  const handleOpenFeed = (catId, subCatId) => {
    setSelectedCategory(catId);
    setSelectedSubCategory(subCatId);

    const feedMapping = {
      property: 'listings',
      vehicles: 'listings',
      electronics: 'listings',
      fashion: 'listings',
      furniture: 'listings',
      kaarigar: 'kaarigar-feed',
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
    };

    setCurrentScreen(feedMapping[catId] || 'listings');
  };

  const handleNewNotification = (newNotif) => {
    hyperlocalStore.addNotification(newNotif);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-x-hidden font-sans select-none">
      
      {/* TOP GLOBAL BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 border-b border-slate-800 flex items-center justify-between">
        <div
          onClick={() => setCurrentScreen('home')}
          className="flex items-center space-x-2 cursor-pointer active:scale-95 transition"
        >
          <span className="text-xl">🏛️</span>
          <div>
            <h1 className="text-xs font-black tracking-wider text-amber-400 uppercase">
              TownHub • {selectedCity}
            </h1>
            <p className="text-[9px] text-slate-400 font-semibold leading-none">
              Hyperlocal Economy Engine
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Post Free Button */}
          <button
            type="button"
            onClick={() => setIsListingModalOpen(true)}
            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-[11px] rounded-xl shadow-md active:scale-95 transition cursor-pointer flex items-center space-x-1"
          >
            <span>+</span>
            <span>Post Free</span>
          </button>

          {/* Notifications Bell */}
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center relative cursor-pointer active:scale-90 transition"
          >
            <span className="text-sm">🔔</span>
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
                {unreadNotifCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* SCREEN ROUTER */}
      <main className="flex-1 pb-20">
        {currentScreen === 'home' && (
          <HyperlocalHomeFeed
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
            onSelectCategory={handleOpenCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenPostModal={() => setIsListingModalOpen(true)}
          />
        )}

        {currentScreen === 'provider-dashboard' && (
          <ProviderDashboard
            onBack={() => setCurrentScreen('home')}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* SECTOR HUBS */}
        {currentScreen === 'town-hub' && (
          <TownHubView
            category={selectedCategory}
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed(selectedCategory, sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'property-hub' && (
          <PropertyHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('property', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'vehicle-hub' && (
          <VehicleHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('vehicles', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'electronics-hub' && (
          <ElectronicsHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('electronics', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'fashion-hub' && (
          <FashionHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('fashion', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'furniture-hub' && (
          <FurnitureHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('furniture', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'kaarigar-hub' && (
          <KaarigarHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('kaarigar', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'transporter-hub' && (
          <TransporterHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('transporters', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'white-collar-hub' && (
          <WhiteCollarHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('white-collar', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'education-hub' && (
          <EducationHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('education', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'restaurants-hub' && (
          <RestaurantsHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('restaurants', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'malls-hub' && (
          <MallsHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('malls', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'shaadi-hub' && (
          <ShaadiHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('shaadi', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'construction-hub' && (
          <ConstructionHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('construction', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'advertising-hub' && (
          <AdvertisingHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('advertising', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'community-hub' && (
          <CommunityHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('community', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'market-hub' && (
          <MarketHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('market', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}
        {currentScreen === 'buysell-hub' && (
          <ReCommerceHub
            selectedCity={selectedCity}
            onSelectSubCategory={(sub) => handleOpenFeed('recommerce', sub)}
            onBack={() => setCurrentScreen('home')}
          />
        )}

        {/* FEED SCREENS */}
        {currentScreen === 'listings' && (
          <ListingsFeed
            listings={listings}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('home')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'kaarigar-feed' && (
          <KaarigarWorkerList
            workers={kaarigarWorkers}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('kaarigar-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'transporter-feed' && (
          <TransporterFeed
            individualTransporters={individualTransporters}
            transportFirms={transportFirms}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('transporter-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'white-collar-feed' && (
          <WhiteCollarFeed
            listings={whiteCollarListings}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('white-collar-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'education-feed' && (
          <EducationFeed
            listings={educationListings}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('education-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'restaurants-feed' && (
          <RestaurantsFeed
            restaurants={restaurantsList}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('restaurants-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'malls-feed' && (
          <MallsFeed
            stores={mallsStores}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('malls-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'shaadi-feed' && (
          <ShaadiFeed
            vendors={shaadiVendors}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('shaadi-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'construction-feed' && (
          <ConstructionFeed
            listings={constructionListings}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('construction-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'advertising-feed' && (
          <AdvertisingFeed
            providers={advertisingProviders}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('advertising-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'community-feed' && (
          <CommunityFeed
            drives={communityDrives}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('community-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'market-feed' && (
          <MarketFeed
            products={marketProducts}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('market-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
        {currentScreen === 'recommerce-feed' && (
          <ReCommerceFeed
            listings={reCommerceListings}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={searchQuery}
            onBack={() => setCurrentScreen('buysell-hub')}
            onNewNotification={handleNewNotification}
          />
        )}
      </main>

      {/* BOTTOM FLOATING NAV */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-6 py-2 z-40 flex items-center justify-around">
        <button
          type="button"
          onClick={() => setCurrentScreen('home')}
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
          onClick={() => setCurrentScreen('provider-dashboard')}
          className={`flex flex-col items-center cursor-pointer transition ${
            currentScreen === 'provider-dashboard' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] font-bold">My Business</span>
        </button>
      </footer>

      {/* CONTEXTUAL LISTING MODAL */}
      {isListingModalOpen && (
        <ContextualListingModal
          currentScreen={currentScreen}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          onClose={() => setIsListingModalOpen(false)}
          onNewNotification={handleNewNotification}
        />
      )}

      {/* NOTIFICATIONS PANEL */}
      {isNotificationsOpen && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
        />
      )}
    </div>
  );
}