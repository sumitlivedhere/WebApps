import React, { useState, lazy, Suspense, useMemo, useCallback } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import NotificationCenter from './components/NotificationCenter';
import ContextualListingModal from './components/ContextualListingModal';
import { useDebounce } from './hooks/useDebounce';
import { FastPrefixSearchIndex } from './utils/fastEngine';
import { hyperlocalStore, useStoreSlice } from './store/hyperlocalStore';

// ==========================================
// 1. LIGHTWEIGHT SYNCHRONOUS HUBS (0ms First Paint)
// ==========================================
import TownHubView from './categories/TownHubView';
import ReCommerceHub from './categories/ReCommerceHub';
import CategoryHub from './categories/CategoryHub';
import PropertyHub from './categories/PropertyHub';
import VehicleHub from './categories/VehicleHub';
import FurnitureHub from './categories/FurnitureHub';
import ElectronicsHub from './categories/ElectronicsHub';
import FashionHub from './categories/FashionHub';
import MarketHub from './categories/MarketHub';
import ShaadiHub from './categories/ShaadiHub';
import AdvertisingHub from './categories/AdvertisingHub';
import EducationHub from './categories/EducationHub';
import ConstructionHub from './categories/ConstructionHub';
import MallsHub from './categories/MallsHub';
import RestaurantsHub from './categories/RestaurantsHub';
import WhiteCollarHub from './categories/WhiteCollarHub';
import KaarigarHub from './categories/KaarigarHub';
import CommunityHub from './categories/CommunityHub';
import TransporterHub from './categories/TransporterHub';

// ==========================================
// 2. LAZY-LOADED INTERACTIVE FEEDS
// ==========================================
const ReCommerceFeed = lazy(() => import('./components/recommerce/ReCommerceFeed'));
const MarketFeed = lazy(() => import('./components/MarketFeed'));
const ShaadiFeed = lazy(() => import('./components/ShaadiFeed'));
const AdvertisingFeed = lazy(() => import('./components/AdvertisingFeed'));
const EducationFeed = lazy(() => import('./components/EducationFeed'));
const ConstructionFeed = lazy(() => import('./components/ConstructionFeed'));
const MallsFeed = lazy(() => import('./components/MallsFeed'));
const RestaurantsFeed = lazy(() => import('./components/RestaurantsFeed'));
const WhiteCollarFeed = lazy(() => import('./components/WhiteCollarFeed'));
const KaarigarWorkerList = lazy(() => import('./components/KaarigarWorkerList'));
const CommunityFeed = lazy(() => import('./components/CommunityFeed'));
const TransporterFeed = lazy(() => import('./components/TransporterFeed'));
const ListingsFeed = lazy(() => import('./components/ListingsFeed'));
const ProviderDashboard = lazy(() => import('./ProviderDashboard'));

import { marketCategories } from './data/marketData';

export default function HyperlocalHomeFeed() {
  // Navigation & History Stack
  const [currentScreen, setCurrentScreen] = useState('hub');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [nestedPropType, setNestedPropType] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Alwar - Central');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 120);

  // Active Hub Titles
  const [shaadiCategoryTitle, setShaadiCategoryTitle] = useState('');
  const [advertisingCategoryTitle, setAdvertisingCategoryTitle] = useState('');
  const [educationExamTitle, setEducationExamTitle] = useState('');
  const [educationFormatFilter, setEducationFormatFilter] = useState('all');
  const [constructionSectorTitle, setConstructionSectorTitle] = useState('');
  const [mallsCategoryTitle, setMallsCategoryTitle] = useState('');
  const [restaurantCategoryTitle, setRestaurantCategoryTitle] = useState('');
  const [whiteCollarCategoryTitle, setWhiteCollarCategoryTitle] = useState('');
  const [transporterViewMode, setTransporterViewMode] = useState('firms');

  // Modals & Panels
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSellerHubOpen, setIsSellerHubOpen] = useState(false);

  // Atomic Store Subscriptions
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

  // Fast Inverted Search Index Instances
  const kaarigarSearch = useMemo(() => {
    const idx = new FastPrefixSearchIndex();
    idx.buildIndex(kaarigarWorkers, (item) => [item.name, item.trade, item.location, ...(item.skills || [])]);
    return idx;
  }, [kaarigarWorkers]);

  const marketSearch = useMemo(() => {
    const idx = new FastPrefixSearchIndex();
    idx.buildIndex(marketProducts, (item) => [item.title, item.shopName, item.category, item.location]);
    return idx;
  }, [marketProducts]);

  const activeKaarigarWorkers = useMemo(
    () => kaarigarSearch.search(debouncedSearchQuery, kaarigarWorkers),
    [debouncedSearchQuery, kaarigarSearch, kaarigarWorkers]
  );

  const activeMarketProducts = useMemo(
    () => marketSearch.search(debouncedSearchQuery, marketProducts),
    [debouncedSearchQuery, marketSearch, marketProducts]
  );

  // Live Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      tag: 'Fresh Arrival',
      title: 'New AC listed near Budh Vihar!',
      message: 'Voltas 1.5 Ton Inverter AC listed at ₹21,000 in your preferred area.',
      time: '10m ago',
      isRead: false,
      price: '21,000',
      subCategory: 'ac',
      productId: 11,
    },
    {
      id: 2,
      tag: 'Price Drop',
      title: 'Price Reduced on Hero Splendor',
      message: 'Seller reduced price from ₹55,000 to ₹52,000 near Housing Board.',
      time: '2h ago',
      isRead: false,
      price: '52,000',
      subCategory: 'bikes',
    },
  ]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  // Contextual Sub-screen Name
  const getContextualName = useCallback(() => {
    switch (currentScreen) {
      case 'recommerce-feed':
      case 'recommerce-hub': return 'Buy & Sell Used (पुराना सामान)';
      case 'property-hub': return 'Property (प्रॉपर्टी)';
      case 'vehicle-hub': return 'Vehicles (गाड़ी व बाइक)';
      case 'furniture-hub': return 'Furniture (फर्नीचर)';
      case 'electronics-hub': return 'Electronics (इलेक्ट्रॉनिक्स)';
      case 'fashion-hub': return 'Fashion (कपड़े व जूते)';
      case 'market-hub':
      case 'market-feed': return 'Market (लोकल बाज़ार)';
      case 'kaarigar-hub':
      case 'kaarigar-feed': return 'Kaarigar (कारीगर व सेवाएँ)';
      case 'transporter-hub':
      case 'transporter-feed': return 'Transporters (ट्रांसपोर्ट)';
      case 'community-hub':
      case 'community-feed': return 'Community (समाज सेवा)';
      case 'shaadi-hub':
      case 'shaadi-feed': return 'Shaadi (विवाह आयोजन)';
      case 'advertising-hub':
      case 'advertising-feed': return 'Advertising (विज्ञापन व प्रचार)';
      case 'education-hub':
      case 'education-feed': return 'Education (कोचिंग व ट्यूशन)';
      case 'construction-hub':
      case 'construction-feed': return 'Construction (निर्माण कार्य)';
      case 'malls-hub':
      case 'malls-feed': return 'Malls & Boutiques (मॉल और बाजार)';
      case 'restaurants-hub':
      case 'restaurants-feed': return 'Restaurants & Cafes (रेस्टोरेंट और कैफे)';
      case 'white-collar-hub':
      case 'white-collar-feed': return 'Consultants (वाइट कॉलर सेवाएँ)';
      case 'listings': return selectedSubCategory !== 'all' ? selectedSubCategory.toUpperCase() : 'Listings';
      default: return 'Town Hub';
    }
  }, [currentScreen, selectedSubCategory]);

  // Central Router Resolver
  const getHubScreenForCategory = useCallback((rawId) => {
    const id = String(rawId || '').toLowerCase().trim();
    if (['recommerce', 'buysell', 'buy-sell', 'used', 'purana', 'old-items', 'second-hand', 're-commerce'].includes(id)) return 'recommerce-hub';
    if (['property', 'real-estate', 'zameen', 'plot'].includes(id)) return 'property-hub';
    if (['vehicle', 'vehicles', 'gadi', 'bike', 'car'].includes(id)) return 'vehicle-hub';
    if (['furniture', 'sofa', 'bed'].includes(id)) return 'furniture-hub';
    if (['electronics', 'appliances', 'electronic'].includes(id)) return 'electronics-hub';
    if (['clothes', 'fashion', 'clothing', 'kapde'].includes(id)) return 'fashion-hub';
    if (['market', 'bazaar', 'shop', 'shops', 'retail'].includes(id)) return 'market-hub';
    if (['kaarigar', 'services', 'workers', 'blue-collar', 'handyman', 'service'].includes(id)) return 'kaarigar-hub';
    if (['transporters', 'transport', 'transportation', 'loading', 'tempo'].includes(id)) return 'transporter-hub';
    if (['community', 'social-welfare', 'welfare', 'seva', 'ngo'].includes(id)) return 'community-hub';
    if (['shaadi', 'shadi', 'wedding', 'matrimony', 'marriage', 'vivah', 'pre-wedding', 'wedding-event'].includes(id)) return 'shaadi-hub';
    if (['advertising', 'ad', 'ads', 'adv', 'advertisement', 'marketing', 'prachar', 'branding', 'hoardings', 'pamphlet', 'pamphlets', 'promotion'].includes(id)) return 'advertising-hub';
    if (['education', 'coaching', 'tuition', 'tuitions', 'teaching', 'tutor', 'tutors', 'exams', 'study', 'classes', 'shiksha'].includes(id)) return 'education-hub';
    if (['construction', 'nirman', 'builder', 'builders', 'thekedaar', 'thekedar', 'cement', 'architect', 'jcb'].includes(id)) return 'construction-hub';
    if (['malls', 'shopping', 'mall', 'boutique', 'boutiques', 'showroom', 'showrooms', 'outlets', 'fashion-mall'].includes(id)) return 'malls-hub';
    if (['restaurants', 'restaurant', 'cafe', 'cafes', 'food', 'dining', 'dhaba', 'bakery', 'bhojnalya'].includes(id)) return 'restaurants-hub';
    if (['white-collar', 'whitecollar', 'ca', 'lawyer', 'doctor', 'professional', 'professionals', 'consultant', 'consultants', 'advocate', 'ayurveda', 'trainer'].includes(id)) return 'white-collar-hub';
    return 'category-hub';
  }, []);

  // Forward Navigation
  const navigateForward = useCallback((updates) => {
    setHistory((prev) => [...prev, { currentScreen, selectedCategory, selectedSubCategory, nestedPropType }]);
    if (updates.screen !== undefined) setCurrentScreen(updates.screen);
    if (updates.category !== undefined) setSelectedCategory(updates.category);
    if (updates.subCategory !== undefined) setSelectedSubCategory(updates.subCategory);
    if (updates.nestedPropType !== undefined) setNestedPropType(updates.nestedPropType);
  }, [currentScreen, selectedCategory, selectedSubCategory, nestedPropType]);

  // Back Navigation
  const goBack = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setCurrentScreen(prev.currentScreen);
      setSelectedCategory(prev.selectedCategory);
      setSelectedSubCategory(prev.selectedSubCategory);
      setNestedPropType(prev.nestedPropType);
    } else {
      setCurrentScreen('hub');
      setSelectedCategory('all');
      setSelectedSubCategory('all');
      setNestedPropType(null);
    }
  }, [history]);

  // Universal Bi-Directional Notification Dispatcher
  const handleNewNotification = useCallback((notif) => {
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  // Global Contextual In-Category Publishing
  const handleAddNewListing = useCallback((newEntry, explicitBucket) => {
    let bucketKey = explicitBucket;

    if (!bucketKey) {
      const screen = currentScreen;
      if (['white-collar-hub', 'white-collar-feed'].includes(screen)) bucketKey = 'whiteCollarListings';
      else if (['kaarigar-hub', 'kaarigar-feed'].includes(screen)) bucketKey = 'kaarigarWorkers';
      else if (['education-hub', 'education-feed'].includes(screen)) bucketKey = 'educationListings';
      else if (['restaurants-hub', 'restaurants-feed'].includes(screen)) bucketKey = 'restaurantsList';
      else if (['malls-hub', 'malls-feed'].includes(screen)) bucketKey = 'mallsStores';
      else if (['market-hub', 'market-feed'].includes(screen)) bucketKey = 'marketProducts';
      else if (['shaadi-hub', 'shaadi-feed'].includes(screen)) bucketKey = 'shaadiVendors';
      else if (['construction-hub', 'construction-feed'].includes(screen)) bucketKey = 'constructionListings';
      else if (['advertising-hub', 'advertising-feed'].includes(screen)) bucketKey = 'advertisingProviders';
      else if (['community-hub', 'community-feed'].includes(screen)) bucketKey = 'communityDrives';
      else if (['transporter-hub', 'transporter-feed'].includes(screen)) bucketKey = 'individualTransporters';
      else if (['recommerce-feed', 'recommerce-hub'].includes(screen)) bucketKey = 'reCommerceListings';
      else bucketKey = 'listings';
    }

    hyperlocalStore.insertListing(bucketKey, newEntry);

    handleNewNotification({
      id: Date.now(),
      tag: 'Listing Live',
      title: `Your listing "${newEntry.name || newEntry.title}" is published!`,
      message: `Visible instantly to all town buyers in ${selectedCity}.`,
      time: 'Just now',
      isRead: false,
    });
  }, [currentScreen, selectedCity, handleNewNotification]);

  const handleSetAlert = useCallback((alertData) => {
    handleNewNotification({
      id: Date.now(),
      tag: 'Alert Subscribed',
      title: `Subscribed to ${alertData.title}`,
      message: `You will get instant updates as soon as sellers post new options in ${selectedCity}.`,
      time: 'Just now',
      isRead: false,
      subCategory: alertData.subCategory,
      productId: alertData.targetId,
    });
  }, [selectedCity, handleNewNotification]);

  const handleNotificationClick = useCallback((notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);
    if (notif.subCategory) {
      navigateForward({ screen: 'listings', subCategory: notif.subCategory });
    }
  }, [navigateForward]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900/5 backdrop-blur-2xl pb-24 text-slate-800 font-sans relative overflow-hidden">
      
      {/* 🌟 1. UNIFIED ADAPTIVE TOP HEADER */}
      <header className="sticky top-0 z-30 bg-indigo-700/95 backdrop-blur-md text-white p-3.5 shadow-lg border-b border-white/10">
        {currentScreen === 'hub' ? (
          <>
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

              {/* LIVE ALERTS BEACON */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-950/70 hover:bg-indigo-900/80 text-white rounded-full border border-indigo-400/40 shadow-xs active:scale-95 transition cursor-pointer"
                  title="View Local Alerts & Live Town Updates"
                >
                  <span className={`text-sm ${unreadCount > 0 ? 'animate-bell-ring' : ''}`}>🔔</span>
                  <span className="text-[10px] font-black text-amber-300">Alerts</span>
                  {unreadCount > 0 && (
                    <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <VoiceSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={(q) => console.log('Search:', q)}
              placeholder="Search across all town services, shops & items..."
            />

            {/* 🌟 PROMINENT MOVING LIGHT CURRENT ONBOARDING WIDGET */}
            <div className="mt-3 relative animate-wiggle-subtle">
              <div className="absolute -inset-[2px] rounded-2xl overflow-hidden pointer-events-none">
                <div className="w-[250%] h-[250%] absolute -top-[75%] -left-[75%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#fef08a_320deg,#f59e0b_360deg)] animate-[spin_3s_linear_infinite]"></div>
              </div>
              <div className="absolute -inset-[1px] rounded-2xl bg-amber-400/20 blur-sm pointer-events-none"></div>

              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="relative z-10 w-full py-2.5 px-3 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:to-indigo-900 text-white rounded-2xl font-black text-xs shadow-xl flex items-center justify-between active:scale-[0.98] transition cursor-pointer border border-amber-400/30"
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-xl animate-bounce">📢</span>
                  <div className="text-left">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-black text-amber-300 text-xs tracking-tight">
                        अपना काम / दुकान यहाँ जोड़ें
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">
                        Free
                      </span>
                    </div>
                    <span className="block text-[10px] text-slate-300 font-medium leading-tight mt-0.5">
                      1 मिनट में लिस्ट करें • सीधे कॉल और WhatsApp पाएँ
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-black px-2.5 py-1.5 rounded-xl shadow-md shrink-0">
                  <span>+ Post Free</span>
                  <span>➔</span>
                </div>
              </button>
            </div>
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-7 h-7 bg-indigo-900/70 hover:bg-indigo-900 text-white rounded-full flex items-center justify-center font-bold text-xs active:scale-95 transition cursor-pointer"
                >
                  ←
                </button>
                <span className="text-[11px] font-black text-amber-300 bg-indigo-900/80 px-2.5 py-0.5 rounded-full border border-white/15">
                  📁 {getContextualName()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsNotificationOpen(true)}
                className="relative flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-950/70 hover:bg-indigo-900/80 text-white rounded-full border border-indigo-400/40 shadow-xs active:scale-95 transition cursor-pointer"
              >
                <span className={`text-sm ${unreadCount > 0 ? 'animate-bell-ring' : ''}`}>🔔</span>
                {unreadCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative ring-2 ring-amber-400/40 rounded-2xl">
              <VoiceSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={(q) => console.log('Search:', q)}
                placeholder={`"${getContextualName()}" me kya dhoondh rahe hain?`}
              />
            </div>

            {/* IN-CATEGORY MOVING LIGHT CURRENT BANNER */}
            <div className="mt-3 relative animate-wiggle-subtle">
              <div className="absolute -inset-[2px] rounded-2xl overflow-hidden pointer-events-none">
                <div className="w-[250%] h-[250%] absolute -top-[75%] -left-[75%] bg-[conic-gradient(from_0deg,transparent_0_280deg,#fef08a_320deg,#f59e0b_360deg)] animate-[spin_3s_linear_infinite]"></div>
              </div>
              <div className="absolute -inset-[1px] rounded-2xl bg-amber-400/20 blur-sm pointer-events-none"></div>

              <button
                type="button"
                onClick={() => setIsPublishModalOpen(true)}
                className="relative z-10 w-full py-2 px-3 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 hover:from-slate-900 hover:to-indigo-900 text-white rounded-2xl font-black text-xs shadow-xl flex items-center justify-between active:scale-[0.98] transition cursor-pointer border border-amber-400/30"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📢</span>
                  <div className="text-left">
                    <span className="font-extrabold text-amber-300 text-[11px] leading-tight block">
                      इस केटेगरी में अपना काम / दुकान जोड़ें
                    </span>
                    <span className="text-[9px] text-slate-300 block">
                      {getContextualName()} के ग्राहकों तक सीधे पहुँचें
                    </span>
                  </div>
                </div>

                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-xl shadow-xs shrink-0">
                  + Add Free
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 🌟 2. VIEW CONTAINER WITH SUSPENSE */}
      <Suspense fallback={<div className="p-8 text-center text-xs font-bold text-slate-400">Loading fast view...</div>}>
        
        {/* HOMEPAGE TILES */}
        {currentScreen === 'hub' && (
          <TownHubView
            onSelectCategory={(catId) => {
              const targetScreen = getHubScreenForCategory(catId);
              navigateForward({ screen: targetScreen, category: catId });
            }}
          />
        )}

        {/* RE-COMMERCE FLOW: CATEGORY TILES FIRST */}
        {currentScreen === 'recommerce-hub' && (
          <ReCommerceHub
            onSelectCategory={(catId) => {
              navigateForward({
                screen: 'recommerce-feed',
                subCategory: catId,
              });
            }}
            onBack={goBack}
          />
        )}

        {/* RE-COMMERCE FEED: FULL IMAGES & REELS-STYLE RIGHT OVERLAYS */}
        {currentScreen === 'recommerce-feed' && (
          <ReCommerceFeed
            listings={reCommerceListings}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* MARKET HUB & FEED */}
        {currentScreen === 'market-hub' && (
          <MarketHub
            onSelectMarketCategory={(catId) => navigateForward({ screen: 'market-feed', category: catId, subCategory: 'all' })}
            onSelectSubCategory={(catId, subCatId) => navigateForward({ screen: 'market-feed', category: catId, subCategory: subCatId })}
            onBack={goBack}
          />
        )}
        {currentScreen === 'market-feed' && (
          <MarketFeed
            products={activeMarketProducts}
            categoryTitle={marketCategories.find((c) => c.id === selectedCategory)?.name || 'Market Products'}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onSetAlert={handleSetAlert}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* KAARIGAR HUB & FEED */}
        {currentScreen === 'kaarigar-hub' && (
          <KaarigarHub onSelectTrade={(tradeId) => navigateForward({ screen: 'kaarigar-feed', subCategory: tradeId })} onBack={goBack} />
        )}
        {currentScreen === 'kaarigar-feed' && (
          <KaarigarWorkerList
            workers={activeKaarigarWorkers}
            selectedTradeId={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* TRANSPORTER HUB & FEED */}
        {currentScreen === 'transporter-hub' && (
          <TransporterHub
            onSelectFirms={() => { setTransporterViewMode('firms'); navigateForward({ screen: 'transporter-feed', subCategory: 'firms' }); }}
            onSelectIndividualVehicle={(vehicleId) => { setTransporterViewMode('individual'); navigateForward({ screen: 'transporter-feed', subCategory: vehicleId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'transporter-feed' && (
          <TransporterFeed
            viewMode={transporterViewMode}
            firms={transportFirms}
            individualTransporters={individualTransporters}
            selectedVehicleType={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* COMMUNITY HUB & FEED */}
        {currentScreen === 'community-hub' && (
          <CommunityHub onSelectPillar={(pillarId) => navigateForward({ screen: 'community-feed', subCategory: pillarId })} onBack={goBack} />
        )}
        {currentScreen === 'community-feed' && (
          <CommunityFeed
            drives={communityDrives}
            selectedPillarId={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* SHAADI HUB & FEED */}
        {currentScreen === 'shaadi-hub' && (
          <ShaadiHub
            onSelectShaadiCategory={(catId, catName) => { setShaadiCategoryTitle(catName); navigateForward({ screen: 'shaadi-feed', subCategory: catId }); }}
            onNavigateCrossCategory={(targetHub) => navigateForward({ screen: targetHub })}
            onBack={goBack}
          />
        )}
        {currentScreen === 'shaadi-feed' && (
          <ShaadiFeed
            vendors={shaadiVendors}
            selectedCategory={selectedSubCategory}
            categoryTitle={shaadiCategoryTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* ADVERTISING HUB & FEED */}
        {currentScreen === 'advertising-hub' && (
          <AdvertisingHub
            onSelectCategory={(catId, catName) => { setAdvertisingCategoryTitle(catName); navigateForward({ screen: 'advertising-feed', subCategory: catId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'advertising-feed' && (
          <AdvertisingFeed
            providers={advertisingProviders}
            selectedCategory={selectedSubCategory}
            categoryTitle={advertisingCategoryTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* EDUCATION HUB & FEED */}
        {currentScreen === 'education-hub' && (
          <EducationHub
            onSelectExamCategory={(examId, examName, format) => { setEducationExamTitle(examName); setEducationFormatFilter(format || 'all'); navigateForward({ screen: 'education-feed', subCategory: examId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'education-feed' && (
          <EducationFeed
            listings={educationListings}
            selectedExamId={selectedSubCategory}
            examTitle={educationExamTitle}
            initialFormatFilter={educationFormatFilter}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* CONSTRUCTION HUB & FEED */}
        {currentScreen === 'construction-hub' && (
          <ConstructionHub
            onSelectSector={(sectorId, sectorName) => { setConstructionSectorTitle(sectorName); navigateForward({ screen: 'construction-feed', subCategory: sectorId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'construction-feed' && (
          <ConstructionFeed
            listings={constructionListings}
            selectedSectorId={selectedSubCategory}
            sectorTitle={constructionSectorTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* MALLS HUB & FEED */}
        {currentScreen === 'malls-hub' && (
          <MallsHub
            onSelectCategory={(catId, catName) => { setMallsCategoryTitle(catName); navigateForward({ screen: 'malls-feed', subCategory: catId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'malls-feed' && (
          <MallsFeed
            stores={mallsStores}
            selectedCategoryId={selectedSubCategory}
            categoryTitle={mallsCategoryTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* RESTAURANTS HUB & FEED */}
        {currentScreen === 'restaurants-hub' && (
          <RestaurantsHub
            onSelectCategory={(catId, catName) => { setRestaurantCategoryTitle(catName); navigateForward({ screen: 'restaurants-feed', subCategory: catId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'restaurants-feed' && (
          <RestaurantsFeed
            restaurants={restaurantsList}
            selectedCategoryId={selectedSubCategory}
            categoryTitle={restaurantCategoryTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* WHITE COLLAR HUB & FEED */}
        {currentScreen === 'white-collar-hub' && (
          <WhiteCollarHub
            onSelectCategory={(catId, catName) => { setWhiteCollarCategoryTitle(catName); navigateForward({ screen: 'white-collar-feed', subCategory: catId }); }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'white-collar-feed' && (
          <WhiteCollarFeed
            listings={whiteCollarListings}
            selectedCategoryId={selectedSubCategory}
            categoryTitle={whiteCollarCategoryTitle}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* GENERAL CATEGORY HUBS */}
        {currentScreen === 'fashion-hub' && (
          <FashionHub onSelectFashionType={(fType) => navigateForward({ screen: 'listings', subCategory: fType })} onBack={goBack} />
        )}
        {currentScreen === 'electronics-hub' && (
          <ElectronicsHub onSelectElectronicsType={(eType) => navigateForward({ screen: 'listings', subCategory: eType })} onBack={goBack} />
        )}
        {currentScreen === 'vehicle-hub' && (
          <VehicleHub onSelectVehicleType={(vType) => navigateForward({ screen: 'listings', subCategory: vType })} onBack={goBack} />
        )}
        {currentScreen === 'furniture-hub' && (
          <FurnitureHub onSelectFurnitureType={(fType) => navigateForward({ screen: 'listings', subCategory: fType })} onBack={goBack} />
        )}
        {currentScreen === 'property-hub' && (
          <PropertyHub nestedPropType={nestedPropType} onSelectNestedType={(type) => navigateForward({ nestedPropType: type })} onSelectPropertyType={(propType) => navigateForward({ screen: 'listings', subCategory: propType })} onBack={goBack} />
        )}
        {currentScreen === 'category-hub' && (
          <CategoryHub
            categoryId={selectedCategory}
            onSelectSubCategory={(subCatId) => {
              const targetScreen = getHubScreenForCategory(subCatId);
              if (targetScreen !== 'category-hub') {
                navigateForward({ screen: targetScreen, category: subCatId });
              } else {
                navigateForward({ screen: 'listings', subCategory: subCatId });
              }
            }}
            onBack={goBack}
          />
        )}
        {currentScreen === 'listings' && (
          <ListingsFeed
            listings={listings}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onSetAlert={handleSetAlert}
            onNewNotification={handleNewNotification}
          />
        )}

        {/* SELLER HUB MODAL VIEW */}
        {isSellerHubOpen && (
          <ProviderDashboard
            onBackToUserMode={() => setIsSellerHubOpen(false)}
            onAddListing={(newItem) => {
              handleAddNewListing(newItem);
              setIsSellerHubOpen(false);
            }}
          />
        )}
      </Suspense>

      {/* 🌟 3. GLOBAL CONTEXTUAL LISTING MODAL (VOICE & WRITE MODES) */}
      {isPublishModalOpen && (
        <ContextualListingModal
          currentScreen={currentScreen}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          onClose={() => setIsPublishModalOpen(false)}
          onAddListing={handleAddNewListing}
        />
      )}

      {/* 🌟 4. TOWN NOTIFICATION CENTER */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onClearAll={() => setNotifications([])}
      />

      {/* 🌟 5. CLEAN FIXED BOTTOM NAVIGATION BAR */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around items-center z-30">
        <button
          onClick={() => {
            setIsSellerHubOpen(false);
            setCurrentScreen('hub');
          }}
          className="flex flex-col items-center text-indigo-600 font-bold text-[10px] cursor-pointer"
        >
          <span className="text-lg">🏠</span>
          <span>Home</span>
        </button>
        <button
          onClick={() => {
            setIsSellerHubOpen(false);
            navigateForward({ screen: 'recommerce-hub' });
          }}
          className="flex flex-col items-center text-slate-400 font-medium text-[10px] cursor-pointer"
        >
          <span className="text-lg">🛍️</span>
          <span>Re-commerce</span>
        </button>
        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 p-3 rounded-full shadow-lg -mt-6 border-4 border-slate-50 flex items-center justify-center hover:scale-105 transition cursor-pointer font-black"
          title="Post Free Listing"
        >
          <span className="text-xl font-black">+</span>
        </button>
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="flex flex-col items-center text-slate-400 font-medium text-[10px] cursor-pointer"
        >
          <span className="text-lg">🔔</span>
          <span>Alerts</span>
        </button>
        <button
          onClick={() => setIsSellerHubOpen(!isSellerHubOpen)}
          className="flex flex-col items-center text-slate-400 font-medium text-[10px] cursor-pointer"
        >
          <span className="text-lg">💼</span>
          <span>My Hub</span>
        </button>
      </footer>

    </div>
  );
}