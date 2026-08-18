import React, { useState, lazy, Suspense, useMemo } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import NotificationCenter from './components/NotificationCenter';
import { useGeoFilter } from './hooks/useGeoFilter';
import { useDebounce } from './hooks/useDebounce';
import { buildInvertedIndex, searchInvertedIndex } from './utils/searchIndex';

// Core structural views are kept synchronous for immediate paint
import TownHubView from './categories/TownHubView';
import ProviderDashboard from './ProviderDashboard';

// ==========================================
// LIGHTWEIGHT HUBS (Synchronous for Instant 0ms Paint)
// ==========================================
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
// HEAVY FEEDS (Lazy Loaded for Reduced Initial Bundle)
// ==========================================
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

// Static data initialization imports
import { initialShaadiVendors } from './data/shaadiData';
import { initialTransportFirms, initialIndividualTransporters } from './data/transporterData';
import { initialKaarigarWorkers } from './data/kaarigarData';
import { initialMarketProducts, marketCategories } from './data/marketData';
import { initialAdvertisingProviders } from './data/advertisingData';
import { initialEducationListings } from './data/educationData';
import { initialConstructionListings } from './data/constructionData';
import { initialMallsStores } from './data/mallsData';
import { initialRestaurantsList } from './data/restaurantsData';
import { initialWhiteCollarListings } from './data/whiteCollarData';
import { initialListings } from './data/mockData';
import { initialCommunityDrives } from './data/communityData';

// Optimized skeleton loader matching deep slate/indigo UI
function HubLoaderSkeleton() {
  return (
    <div className="w-full p-4 animate-pulse space-y-4">
      <div className="h-8 bg-slate-800/40 rounded-xl w-1/3"></div>
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 bg-slate-800/20 rounded-2xl"></div>
        <div className="h-28 bg-slate-800/20 rounded-2xl"></div>
        <div className="h-28 bg-slate-800/20 rounded-2xl"></div>
        <div className="h-28 bg-slate-800/20 rounded-2xl"></div>
      </div>
    </div>
  );
}

export default function HyperlocalHomeFeed() {
  const [userMode, setUserMode] = useState('buyer'); 
  const [currentScreen, setCurrentScreen] = useState('hub'); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [nestedPropType, setNestedPropType] = useState(null); 
  const [history, setHistory] = useState([]); 
  const [selectedCity, setSelectedCity] = useState('Alwar - Central');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  
  // Base State Buckets
  const [listings, setListings] = useState(initialListings);
  const [marketProducts, setMarketProducts] = useState(initialMarketProducts);
  const [kaarigarWorkers, setKaarigarWorkers] = useState(initialKaarigarWorkers);
  const [transportFirms, setTransportFirms] = useState(initialTransportFirms);
  const [individualTransporters, setIndividualTransporters] = useState(initialIndividualTransporters);
  const [communityDrives, setCommunityDrives] = useState(initialCommunityDrives);
  const [transporterViewMode, setTransporterViewMode] = useState('firms'); 
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [shaadiVendors, setShaadiVendors] = useState(initialShaadiVendors);
  const [shaadiCategoryTitle, setShaadiCategoryTitle] = useState('');
  const [advertisingProviders, setAdvertisingProviders] = useState(initialAdvertisingProviders);
  const [advertisingCategoryTitle, setAdvertisingCategoryTitle] = useState('');
  const [educationListings, setEducationListings] = useState(initialEducationListings);
  const [educationExamTitle, setEducationExamTitle] = useState('');
  const [educationFormatFilter, setEducationFormatFilter] = useState('all');
  const [constructionListings, setConstructionListings] = useState(initialConstructionListings);
  const [constructionSectorTitle, setConstructionSectorTitle] = useState('');
  const [mallsStores, setMallsStores] = useState(initialMallsStores);
  const [mallsCategoryTitle, setMallsCategoryTitle] = useState('');
  const [restaurantsList, setRestaurantsList] = useState(initialRestaurantsList);
  const [restaurantCategoryTitle, setRestaurantCategoryTitle] = useState('');
  const [whiteCollarListings, setWhiteCollarListings] = useState(initialWhiteCollarListings);
  const [whiteCollarCategoryTitle, setWhiteCollarCategoryTitle] = useState('');

  // ==========================================
  // GLOBAL METRIC GEOFENCING HOOKS O(K)
  // Filters data cleanly whenever 'selectedCity' changes
  // ==========================================
  const localListings = useGeoFilter(listings, selectedCity);
  const localMarketProducts = useGeoFilter(marketProducts, selectedCity);
  const localKaarigarWorkers = useGeoFilter(kaarigarWorkers, selectedCity);
  const localTransportFirms = useGeoFilter(transportFirms, selectedCity);
  const localIndividualTransporters = useGeoFilter(individualTransporters, selectedCity);
  const localCommunityDrives = useGeoFilter(communityDrives, selectedCity);
  const localShaadiVendors = useGeoFilter(shaadiVendors, selectedCity);
  const localAdvertisingProviders = useGeoFilter(advertisingProviders, selectedCity);
  const localEducationListings = useGeoFilter(educationListings, selectedCity);
  const localConstructionListings = useGeoFilter(constructionListings, selectedCity);
  const localMallsStores = useGeoFilter(mallsStores, selectedCity);
  const localRestaurantsList = useGeoFilter(restaurantsList, selectedCity);
  const localWhiteCollarListings = useGeoFilter(whiteCollarListings, selectedCity);

  // ==========================================
  // INVERTED SEARCH INDEXES (Memoized O(1) Lookups)
  // ==========================================
  const kaarigarIndex = useMemo(() => buildInvertedIndex(localKaarigarWorkers), [localKaarigarWorkers]);
  const marketIndex = useMemo(() => buildInvertedIndex(localMarketProducts), [localMarketProducts]);
  const listingsIndex = useMemo(() => buildInvertedIndex(localListings), [localListings]);

  const activeKaarigarWorkers = useMemo(() => {
    return debouncedSearchQuery ? searchInvertedIndex(kaarigarIndex, debouncedSearchQuery) : localKaarigarWorkers;
  }, [debouncedSearchQuery, kaarigarIndex, localKaarigarWorkers]);

  const activeMarketProducts = useMemo(() => {
    return debouncedSearchQuery ? searchInvertedIndex(marketIndex, debouncedSearchQuery) : localMarketProducts;
  }, [debouncedSearchQuery, marketIndex, localMarketProducts]);

  const activeListings = useMemo(() => {
    return debouncedSearchQuery ? searchInvertedIndex(listingsIndex, debouncedSearchQuery) : localListings;
  }, [debouncedSearchQuery, listingsIndex, localListings]);

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
      subCategory: 'bike',
      productId: 1,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleSetAlert = (alertData) => {
    const newNotif = {
      id: Date.now(),
      tag: 'Alert Subscribed',
      title: `Subscribed to ${alertData.title}`,
      message: `You will get instant updates as soon as sellers post new options in Alwar.`,
      time: 'Just now',
      isRead: false,
      subCategory: alertData.subCategory,
      productId: alertData.targetId,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const handleNotificationClick = (notif) => {
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);
    if (notif.subCategory) {
      navigateForward({ screen: 'listings', subCategory: notif.subCategory });
    }
  };

  const handleSearchSubmit = (query) => {
    console.log('Searching backend for:', query);
  };

  const getContextualName = () => {
    switch (currentScreen) {
      case 'property-hub': return 'Property';
      case 'vehicle-hub': return 'Vehicles (गाड़ी)';
      case 'furniture-hub': return 'Furniture (फर्नीचर)';
      case 'electronics-hub': return 'Electronics (इलेक्ट्रॉनिक्स)';
      case 'fashion-hub': return 'Fashion (कपड़े व जूते)';
      case 'market-hub':
      case 'market-feed': return 'Market (बाज़ार)';
      case 'kaarigar-hub':
      case 'kaarigar-feed': return 'Kaarigar (कारीगर व सेवाएँ)';
      case 'transporter-hub':
      case 'transporter-feed': return 'Transporter (ट्रांसपोर्ट व लोडिंग)';
      case 'community-hub':
      case 'community-feed': return 'Community (समाज सेवा)';
      case 'shaadi-hub':
      case 'shaadi-feed': return 'Shaadi (विवाह आयोजन)';
      case 'listings': return selectedSubCategory !== 'all' ? selectedSubCategory.toUpperCase() : 'Listings';
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
      case 'white-collar-feed': return 'Consultants & Experts (वाइट कॉलर सेवाएँ)';
      default: return 'Town Hub';
    }
  };

  const getHubScreenForCategory = (rawId) => {
    const id = String(rawId || '').toLowerCase().trim();
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
    if (['advertising', 'ad', 'ads', 'adv', 'advertisement', 'marketing', 'prachar', 'branding', 'hoardings', 'pamphlet', 'pamphlets', 'promotion', 'promotions'].includes(id)) return 'advertising-hub';
    if (['education', 'coaching', 'tuition', 'tuitions', 'teaching', 'tutor', 'tutors', 'exams', 'study', 'classes'].includes(id)) return 'education-hub';
    if (['construction', 'nirman', 'builder', 'builders', 'thekedaar', 'thekedar', 'cement', 'architect', 'jcb'].includes(id)) return 'construction-hub';
    if (['malls', 'shopping', 'mall', 'boutique', 'boutiques', 'showroom', 'showrooms', 'outlets', 'fashion-mall'].includes(id)) return 'malls-hub';
    if (['restaurants', 'restaurant', 'cafe', 'cafes', 'food', 'dining', 'dhaba', 'bakery', 'bhojnalya'].includes(id)) return 'restaurants-hub';
    if (['white-collar', 'whitecollar', 'ca', 'lawyer', 'doctor', 'professional', 'professionals', 'consultant', 'consultants', 'advocate', 'ayurveda', 'trainer'].includes(id)) return 'white-collar-hub';
    return 'category-hub';
  };

  const navigateForward = (updates) => {
    setHistory((prev) => [
      ...prev,
      { currentScreen, selectedCategory, selectedSubCategory, nestedPropType },
    ]);
    if (updates.screen !== undefined) setCurrentScreen(updates.screen);
    if (updates.category !== undefined) setSelectedCategory(updates.category);
    if (updates.subCategory !== undefined) setSelectedSubCategory(updates.subCategory);
    if (updates.nestedPropType !== undefined) setNestedPropType(updates.nestedPropType);
  };

  const goBack = () => {
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
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900/5 backdrop-blur-2xl pb-24 text-slate-800 font-sans relative overflow-hidden">
      {/* BACKGROUND DECORATIONS */}
      <div className="absolute top-10 left-[-20%] w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-[-20%] w-72 h-72 bg-pink-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* HEADER SYSTEM */}
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
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative p-1.5 bg-indigo-900/60 hover:bg-indigo-900 text-white rounded-full border border-white/20 active:scale-95 transition"
                >
                  <span className="text-sm">🔔</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <VoiceSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              placeholder="Search across all town services, shops & items..."
            />

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
          </>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="w-7 h-7 bg-indigo-900/70 hover:bg-indigo-900 text-white rounded-full flex items-center justify-center font-bold text-xs active:scale-95 transition"
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
                className="relative p-1.5 bg-indigo-900/60 hover:bg-indigo-900 text-white rounded-full border border-white/20 active:scale-95 transition"
              >
                <span className="text-sm">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="relative ring-2 ring-amber-400/40 rounded-2xl">
              <VoiceSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
                placeholder={`"${getContextualName()}" me kya dhoondh rahe hain?`}
              />
            </div>
          </div>
        )}
      </header>

      {/* SUSPENSE-WRAPPED DYNAMIC ROUTER */}
      <Suspense fallback={<HubLoaderSkeleton />}>
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

        {userMode === 'buyer' && currentScreen === 'hub' && (
          <TownHubView
            onSelectCategory={(catId) => {
              const targetScreen = getHubScreenForCategory(catId);
              navigateForward({ screen: targetScreen, category: catId });
            }}
          />
        )}

        {userMode === 'buyer' && currentScreen === 'fashion-hub' && (
          <FashionHub 
            onSelectFashionType={(fType) => navigateForward({ screen: 'listings', subCategory: fType })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'market-hub' && (
          <MarketHub
            onSelectMarketCategory={(catId) => navigateForward({ screen: 'market-feed', category: catId, subCategory: 'all' })}
            onSelectSubCategory={(catId, subCatId) => navigateForward({ screen: 'market-feed', category: catId, subCategory: subCatId })}
            onBack={goBack}
          />
        )}

        {userMode === 'buyer' && currentScreen === 'market-feed' && (
          <MarketFeed
            products={activeMarketProducts}
            categoryTitle={marketCategories.find((c) => c.id === selectedCategory)?.name || 'Market Products'}
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedCity={selectedCity}
            searchQuery={debouncedSearchQuery}
            onBack={goBack}
            onSetAlert={handleSetAlert}
          />
        )}

        {userMode === 'buyer' && currentScreen === 'kaarigar-hub' && (
          <KaarigarHub 
            onSelectTrade={(tradeId) => navigateForward({ screen: 'kaarigar-feed', subCategory: tradeId })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'kaarigar-feed' && (
          <KaarigarWorkerList 
            workers={activeKaarigarWorkers}
            selectedTradeId={selectedSubCategory} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'transporter-hub' && (
          <TransporterHub
            onSelectFirms={() => { setTransporterViewMode('firms'); navigateForward({ screen: 'transporter-feed', subCategory: 'firms' }); }}
            onSelectIndividualVehicle={(vehicleId) => { setTransporterViewMode('individual'); navigateForward({ screen: 'transporter-feed', subCategory: vehicleId }); }}
            onBack={goBack}
          />
        )}

        {userMode === 'buyer' && currentScreen === 'transporter-feed' && (
          <TransporterFeed 
            viewMode={transporterViewMode} 
            firms={localTransportFirms} 
            individualTransporters={localIndividualTransporters} 
            selectedVehicleType={selectedSubCategory} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'community-hub' && (
          <CommunityHub 
            onSelectPillar={(pillarId) => navigateForward({ screen: 'community-feed', subCategory: pillarId })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'community-feed' && (
          <CommunityFeed 
            drives={localCommunityDrives} 
            selectedPillarId={selectedSubCategory} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'shaadi-hub' && (
          <ShaadiHub 
            onSelectShaadiCategory={(catId, catName) => { 
              setShaadiCategoryTitle(catName); 
              navigateForward({ screen: 'shaadi-feed', subCategory: catId }); 
            }} 
            onNavigateCrossCategory={(targetHub) => navigateForward({ screen: targetHub })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'shaadi-feed' && (
          <ShaadiFeed 
            vendors={localShaadiVendors} 
            selectedCategory={selectedSubCategory} 
            categoryTitle={shaadiCategoryTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'advertising-hub' && (
          <AdvertisingHub 
            onSelectCategory={(catId, catName) => { 
              setAdvertisingCategoryTitle(catName); 
              navigateForward({ screen: 'advertising-feed', subCategory: catId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'advertising-feed' && (
          <AdvertisingFeed 
            providers={localAdvertisingProviders} 
            selectedCategory={selectedSubCategory} 
            categoryTitle={advertisingCategoryTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'education-hub' && (
          <EducationHub 
            onSelectExamCategory={(examId, examName, format) => { 
              setEducationExamTitle(examName); 
              setEducationFormatFilter(format); 
              navigateForward({ screen: 'education-feed', subCategory: examId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'education-feed' && (
          <EducationFeed 
            listings={localEducationListings} 
            selectedExamId={selectedSubCategory} 
            examTitle={educationExamTitle} 
            initialFormatFilter={educationFormatFilter} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'construction-hub' && (
          <ConstructionHub 
            onSelectSector={(sectorId, sectorName) => { 
              setConstructionSectorTitle(sectorName); 
              navigateForward({ screen: 'construction-feed', subCategory: sectorId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'construction-feed' && (
          <ConstructionFeed 
            listings={localConstructionListings} 
            selectedSectorId={selectedSubCategory} 
            sectorTitle={constructionSectorTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'malls-hub' && (
          <MallsHub 
            onSelectCategory={(catId, catName) => { 
              setMallsCategoryTitle(catName); 
              navigateForward({ screen: 'malls-feed', subCategory: catId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'malls-feed' && (
          <MallsFeed 
            stores={localMallsStores} 
            selectedCategoryId={selectedSubCategory} 
            categoryTitle={mallsCategoryTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'restaurants-hub' && (
          <RestaurantsHub 
            onSelectCategory={(catId, catName) => { 
              setRestaurantCategoryTitle(catName); 
              navigateForward({ screen: 'restaurants-feed', subCategory: catId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'restaurants-feed' && (
          <RestaurantsFeed 
            restaurants={localRestaurantsList} 
            selectedCategoryId={selectedSubCategory} 
            categoryTitle={restaurantCategoryTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'white-collar-hub' && (
          <WhiteCollarHub 
            onSelectCategory={(catId, catName) => { 
              setWhiteCollarCategoryTitle(catName); 
              navigateForward({ screen: 'white-collar-feed', subCategory: catId }); 
            }} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'white-collar-feed' && (
          <WhiteCollarFeed 
            listings={localWhiteCollarListings} 
            selectedCategoryId={selectedSubCategory} 
            categoryTitle={whiteCollarCategoryTitle} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'electronics-hub' && (
          <ElectronicsHub 
            onSelectElectronicsType={(eType) => navigateForward({ screen: 'listings', subCategory: eType })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'vehicle-hub' && (
          <VehicleHub 
            onSelectVehicleType={(vType) => navigateForward({ screen: 'listings', subCategory: vType })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'property-hub' && (
          <PropertyHub 
            nestedPropType={nestedPropType} 
            onSelectNestedType={(type) => navigateForward({ nestedPropType: type })} 
            onSelectPropertyType={(propType) => navigateForward({ screen: 'listings', subCategory: propType })} 
            onBack={goBack} 
          />
        )}

        {userMode === 'buyer' && currentScreen === 'category-hub' && (
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

        {userMode === 'buyer' && currentScreen === 'listings' && (
          <ListingsFeed 
            listings={activeListings} 
            selectedCategory={selectedCategory} 
            selectedSubCategory={selectedSubCategory} 
            selectedCity={selectedCity} 
            searchQuery={debouncedSearchQuery} 
            onBack={goBack} 
            onSetAlert={handleSetAlert} 
          />
        )}
      </Suspense>

      <NotificationCenter 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
        notifications={notifications} 
        onNotificationClick={handleNotificationClick} 
        onClearAll={() => setNotifications([])} 
      />

      {/* BOTTOM NAVIGATION BAR */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex justify-around items-center z-30">
        <button 
          onClick={() => { setCurrentScreen('hub'); setUserMode('buyer'); }} 
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