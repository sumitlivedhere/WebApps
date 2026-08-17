import React, { useState } from 'react';
import VoiceSearchBar from './VoiceSearchBar';
import ProviderDashboard from './ProviderDashboard';
import TownHubView from './categories/TownHubView';
import CategoryHub from './categories/CategoryHub';
import PropertyHub from './categories/PropertyHub';
import VehicleHub from './categories/VehicleHub';
import FurnitureHub from './categories/FurnitureHub';
import ElectronicsHub from './categories/ElectronicsHub';
import FashionHub from './categories/FashionHub';
import MarketHub from './categories/MarketHub';
import MarketFeed from './components/MarketFeed';
import ShaadiHub from './categories/ShaadiHub';
import ShaadiFeed from './components/ShaadiFeed';
import AdvertisingHub from './categories/AdvertisingHub';
import AdvertisingFeed from './components/AdvertisingFeed';
import EducationHub from './categories/EducationHub';
import EducationFeed from './components/EducationFeed';
import ConstructionHub from './categories/ConstructionHub';
import ConstructionFeed from './components/ConstructionFeed';
import MallsHub from './categories/MallsHub';
import MallsFeed from './components/MallsFeed';
import RestaurantsHub from './categories/RestaurantsHub';
import RestaurantsFeed from './components/RestaurantsFeed';
import WhiteCollarHub from './categories/WhiteCollarHub';
import WhiteCollarFeed from './components/WhiteCollarFeed';
import KaarigarHub from './categories/KaarigarHub';
import CommunityHub from './categories/CommunityHub';
import CommunityFeed from './components/CommunityFeed';
import KaarigarWorkerList from './components/KaarigarWorkerList';
import ListingsFeed from './components/ListingsFeed';
import NotificationCenter from './components/NotificationCenter';
import TransporterHub from './categories/TransporterHub';
import TransporterFeed from './components/TransporterFeed';
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
  const [marketProducts, setMarketProducts] = useState(initialMarketProducts);
  const [kaarigarWorkers, setKaarigarWorkers] = useState(initialKaarigarWorkers);
  const [transportFirms, setTransportFirms] = useState(initialTransportFirms);
  const [individualTransporters, setIndividualTransporters] = useState(initialIndividualTransporters);
  const [communityDrives, setCommunityDrives] = useState(initialCommunityDrives);
  const [transporterViewMode, setTransporterViewMode] = useState('firms'); // 'firms' | 'individual'
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
    // Generate an instant confirmation notification
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
    // Mark as read
    setNotifications(
      notifications.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );
    setIsNotificationOpen(false);

    // Route straight to the matching category feed or listing
    if (notif.subCategory) {
      navigateForward({ screen: 'listings', subCategory: notif.subCategory });
    }
  };

 const handleSearchSubmit = (query) => {
    console.log('Searching backend for:', query);
  };

  // Helper to determine active category title for contextual search
  const getContextualName = () => {
    switch (currentScreen) {
      case 'property-hub':
        return 'Property';
      case 'vehicle-hub':
        return 'Vehicles (गाड़ी)';
      case 'furniture-hub':
        return 'Furniture (फर्नीचर)';
      case 'electronics-hub':
        return 'Electronics (इलेक्ट्रॉनिक्स)';
      case 'fashion-hub':
        return 'Fashion (कपड़े व जूते)';
      case 'market-hub':
      case 'market-feed':
        return 'Market (बाज़ार)';
      case 'kaarigar-hub':
      case 'kaarigar-feed':
        return 'Kaarigar (कारीगर व सेवाएँ)';
      case 'transporter-hub':
      case 'transporter-feed':
        return 'Transporter (ट्रांसपोर्ट व लोडिंग)';
      case 'community-hub':
      case 'community-feed':
        return 'Community (समाज सेवा)';
      case 'shaadi-hub':
      case 'shaadi-feed':
        return 'Shaadi (विवाह आयोजन)';
      case 'listings':
        return selectedSubCategory !== 'all' ? selectedSubCategory.toUpperCase() : 'Listings';
      case 'advertising-hub':
      case 'advertising-feed':
        return 'Advertising (विज्ञापन व प्रचार)';
      case 'education-hub':
      case 'education-feed':
        return 'Education (कोचिंग व ट्यूशन)';
      case 'construction-hub':
      case 'construction-feed':
        return 'Construction (निर्माण कार्य)';
      case 'malls-hub':
      case 'malls-feed':
        return 'Malls & Boutiques (मॉल और बाजार)';
      case 'restaurants-hub':
      case 'restaurants-feed':
        return 'Restaurants & Cafes (रेस्टोरेंट और कैफे)';
      case 'white-collar-hub':
      case 'white-collar-feed':
        return 'Consultants & Experts (वाइट कॉलर सेवाएँ)';

      default:
        return 'Town Hub';
        
    }
  };

  // Centralized Category Router mapping any keyword variation to its hub
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

     {/* 1. ADAPTIVE HEADER: HOME MODE VS CATEGORY SCOPED SEARCH */}
      <header className="sticky top-0 z-30 bg-indigo-700/95 backdrop-blur-md text-white p-3.5 shadow-lg border-b border-white/10">
        
        {/* A. HOMEPAGE HEADER (City Selector + Notification + Global Voice Search + Provider Switch) */}
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
                <span className="text-[10px] text-indigo-200 font-medium hidden sm:inline">✨ Voice Search</span>
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
          </>
        ) : (
          /* B. CATEGORY SCOPED SEARCH HEADER (NO CITY SELECTOR, SCOPED SEARCH BAR ONLY) */
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

              {/* Notification Bell */}
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

            {/* FOCUSED CATEGORY SEARCH BAR */}
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
            const targetScreen = getHubScreenForCategory(catId);
            navigateForward({ screen: targetScreen, category: catId });
          }}
        />
      )}

     {/* DEDICATED FASHION HUB (8 CATEGORIES) */}
      {userMode === 'buyer' && currentScreen === 'fashion-hub' && (
        <FashionHub
          onSelectFashionType={(fType) => {
            navigateForward({ screen: 'listings', subCategory: fType });
          }}
          onBack={goBack}
        />
      )}

      {/* DEDICATED MARKET HUB (14 SECTORS & SUBCATEGORIES) */}
      {userMode === 'buyer' && currentScreen === 'market-hub' && (
        <MarketHub
          onSelectMarketCategory={(catId) => {
            navigateForward({ screen: 'market-feed', category: catId, subCategory: 'all' });
          }}
          onSelectSubCategory={(catId, subCatId) => {
            navigateForward({ screen: 'market-feed', category: catId, subCategory: subCatId });
          }}
          onBack={goBack}
        />
      )}

      {/* MARKET FEED (MRP, DISCOUNTS, LIVE STORE CATALOGS) */}
      {userMode === 'buyer' && currentScreen === 'market-feed' && (
        <MarketFeed
          products={marketProducts}
          categoryTitle={marketCategories.find((c) => c.id === selectedCategory)?.name || 'Market Products'}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
          onSetAlert={handleSetAlert}
        />
      )}

      {/* DEDICATED KAARIGAR HUB (19 TRADES) */}
      {userMode === 'buyer' && currentScreen === 'kaarigar-hub' && (
        <KaarigarHub
          onSelectTrade={(tradeId) => {
            navigateForward({ screen: 'kaarigar-feed', subCategory: tradeId });
          }}
          onBack={goBack}
        />
      )}

     {/* KAARIGAR WORKER LIST (5-DIMENSION RATINGS, SLOTS, WHATSAPP) */}
      {userMode === 'buyer' && currentScreen === 'kaarigar-feed' && (
        <KaarigarWorkerList
          workers={kaarigarWorkers}
          selectedTradeId={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED TRANSPORTER HUB (FIRMS VS PERSONAL VEHICLE OWNERS) */}
      {userMode === 'buyer' && currentScreen === 'transporter-hub' && (
        <TransporterHub
          onSelectFirms={() => {
            setTransporterViewMode('firms');
            navigateForward({ screen: 'transporter-feed', subCategory: 'firms' });
          }}
          onSelectIndividualVehicle={(vehicleId) => {
            setTransporterViewMode('individual');
            navigateForward({ screen: 'transporter-feed', subCategory: vehicleId });
          }}
          onBack={goBack}
        />
      )}

     {/* TRANSPORTER FEED (FLEET FIRMS VS INDIVIDUAL DRIVERS WITH 5-STAR RATINGS) */}
      {userMode === 'buyer' && currentScreen === 'transporter-feed' && (
        <TransporterFeed
          viewMode={transporterViewMode}
          firms={transportFirms}
          individualTransporters={individualTransporters}
          selectedVehicleType={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED COMMUNITY SERVICES HUB */}
      {userMode === 'buyer' && currentScreen === 'community-hub' && (
        <CommunityHub
          onSelectPillar={(pillarId) => {
            navigateForward({ screen: 'community-feed', subCategory: pillarId });
          }}
          onBack={goBack}
        />
      )}

      {/* COMMUNITY FEED (TIMING, VENUE, VOLUNTEERS & DONATIONS) */}
      {userMode === 'buyer' && currentScreen === 'community-feed' && (
        <CommunityFeed
          drives={communityDrives}
          selectedPillarId={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED SHAADI LOGISTICS HUB (7 MILESTONE PHASES + GROOM/BRIDE SWITCH) */}
      {userMode === 'buyer' && currentScreen === 'shaadi-hub' && (
        <ShaadiHub
          onSelectShaadiCategory={(catId, catName) => {
            setShaadiCategoryTitle(catName);
            navigateForward({ screen: 'shaadi-feed', subCategory: catId });
          }}
          onNavigateCrossCategory={(targetHub) => {
            navigateForward({ screen: targetHub });
          }}
          onBack={goBack}
        />
      )}

     {/* SHAADI VENDOR FEED (HALWAI, TENT, GHODI, MAKEUP, PHOTOGRAPHERS) */}
      {userMode === 'buyer' && currentScreen === 'shaadi-feed' && (
        <ShaadiFeed
          vendors={shaadiVendors}
          selectedCategory={selectedSubCategory}
          categoryTitle={shaadiCategoryTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED ADVERTISING HUB (10 ADVERTISING CHANNELS) */}
      {userMode === 'buyer' && currentScreen === 'advertising-hub' && (
        <AdvertisingHub
          onSelectCategory={(catId, catName) => {
            setAdvertisingCategoryTitle(catName);
            navigateForward({ screen: 'advertising-feed', subCategory: catId });
          }}
          onBack={goBack}
        />
      )}

      {/* ADVERTISING FEED (PRINTING, HOARDINGS, NEWSPAPER, TV ADS) */}
      {userMode === 'buyer' && currentScreen === 'advertising-feed' && (
        <AdvertisingFeed
          providers={advertisingProviders}
          selectedCategory={selectedSubCategory}
          categoryTitle={advertisingCategoryTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED EDUCATION & COACHING HUB (6 EXAMS + 3 LEARNING FORMATS) */}
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

      {/* EDUCATION FEED (FEES, BATCH HOURS, ACHIEVEMENTS & DIRECT DEMO CLASS BOOKING) */}
      {userMode === 'buyer' && currentScreen === 'education-feed' && (
        <EducationFeed
          listings={educationListings}
          selectedExamId={selectedSubCategory}
          examTitle={educationExamTitle}
          initialFormatFilter={educationFormatFilter}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED CONSTRUCTION HUB (6 PHASES & SECTORS) */}
      {userMode === 'buyer' && currentScreen === 'construction-hub' && (
        <ConstructionHub
          onSelectSector={(sectorId, sectorName) => {
            setConstructionSectorTitle(sectorName);
            navigateForward({ screen: 'construction-feed', subCategory: sectorId });
          }}
          onBack={goBack}
        />
      )}

      {/* CONSTRUCTION FEED (THEKEDARS, MATERIALS, JCB, ARCHITECTS) */}
      {userMode === 'buyer' && currentScreen === 'construction-feed' && (
        <ConstructionFeed
          listings={constructionListings}
          selectedSectorId={selectedSubCategory}
          sectorTitle={constructionSectorTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED MALLS & BOUTIQUES HUB (7 MODERN RETAIL SECTORS) */}
      {userMode === 'buyer' && currentScreen === 'malls-hub' && (
        <MallsHub
          onSelectCategory={(catId, catName) => {
            setMallsCategoryTitle(catName);
            navigateForward({ screen: 'malls-feed', subCategory: catId });
          }}
          onBack={goBack}
        />
      )}

      {/* MALLS FEED (STOREFRONTS, AMENITIES, PRICE BANDS & CATALOGUE SHOWCASE) */}
      {userMode === 'buyer' && currentScreen === 'malls-feed' && (
        <MallsFeed
          stores={mallsStores}
          selectedCategoryId={selectedSubCategory}
          categoryTitle={mallsCategoryTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED RESTAURANTS & CAFES HUB (6 DINING SECTORS) */}
      {userMode === 'buyer' && currentScreen === 'restaurants-hub' && (
        <RestaurantsHub
          onSelectCategory={(catId, catName) => {
            setRestaurantCategoryTitle(catName);
            navigateForward({ screen: 'restaurants-feed', subCategory: catId });
          }}
          onBack={goBack}
        />
      )}

      {/* RESTAURANTS FEED (AMBIANCE, MUST-TRY DISHES, PRICE FOR TWO & TABLE BOOKING) */}
      {userMode === 'buyer' && currentScreen === 'restaurants-feed' && (
        <RestaurantsFeed
          restaurants={restaurantsList}
          selectedCategoryId={selectedSubCategory}
          categoryTitle={restaurantCategoryTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

      {/* DEDICATED WHITE COLLAR HUB (9 PROFESSIONAL SECTORS) */}
      {userMode === 'buyer' && currentScreen === 'white-collar-hub' && (
        <WhiteCollarHub
          onSelectCategory={(catId, catName) => {
            setWhiteCollarCategoryTitle(catName);
            navigateForward({ screen: 'white-collar-feed', subCategory: catId });
          }}
          onBack={goBack}
        />
      )}

      {/* WHITE COLLAR FEED (QUALIFICATIONS, REGISTRATIONS, FEES & CREDENTIAL SHOWCASE) */}
      {userMode === 'buyer' && currentScreen === 'white-collar-feed' && (
        <WhiteCollarFeed
          listings={whiteCollarListings}
          selectedCategoryId={selectedSubCategory}
          categoryTitle={whiteCollarCategoryTitle}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
        />
      )}

     {/* DEDICATED ELECTRONICS HUB (10 CATEGORIES) */}
      {userMode === 'buyer' && currentScreen === 'electronics-hub' && (
        <ElectronicsHub
          onSelectElectronicsType={(eType) => {
            navigateForward({ screen: 'listings', subCategory: eType });
          }}
          onBack={goBack}
        />
      )}

      {/* DEDICATED FASHION HUB (8 CATEGORIES) */}
      {userMode === 'buyer' && currentScreen === 'fashion-hub' && (
        <FashionHub
          onSelectFashionType={(fType) => {
            navigateForward({ screen: 'listings', subCategory: fType });
          }}
          onBack={goBack}
        />
      )}

      {/* DEDICATED VEHICLE HUB (10 CATEGORIES) */}
      {userMode === 'buyer' && currentScreen === 'vehicle-hub' && (
        <VehicleHub
          onSelectVehicleType={(vType) => {
            navigateForward({ screen: 'listings', subCategory: vType });
          }}
          onBack={goBack}
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
     {/* 6. LISTINGS FEED */}
      {userMode === 'buyer' && currentScreen === 'listings' && (
        <ListingsFeed
          listings={listings}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          selectedCity={selectedCity}
          searchQuery={searchQuery}
          onBack={goBack}
          onSetAlert={handleSetAlert}
        />
      )}

      {/* NOTIFICATION TRAY MODAL */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onClearAll={() => setNotifications([])}
      />
      
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