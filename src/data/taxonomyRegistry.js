/**
 * Master Hyperlocal Taxonomy Registry
 * Defines deterministic Category IDs and Subcategory IDs across database, store, and UI feeds.
 */

export const TAXONOMY_REGISTRY = [
  {
    id: 'kaarigar',
    name: 'Kaarigar (कारीगर व मिस्त्री)',
    icon: '🛠️',
    bucketKey: 'kaarigarWorkers',
    subCategories: [
      { id: 'electrician', name: 'Electrician (इलेक्ट्रीशियन)' },
      { id: 'plumber', name: 'Plumber (प्लंबर)' },
      { id: 'carpenter', name: 'Carpenter (बढ़ई)' },
      { id: 'painter', name: 'Painter (पेंटर)' },
      { id: 'mason', name: 'Mistri / Mason (राजमिस्त्री)' },
      { id: 'ac-technician', name: 'AC & Fridge Technician' },
      { id: 'welder', name: 'Welder & Fabricator (वेल्डर)' },
      { id: 'mechanic', name: 'Vehicle Mechanic (मैकेनिक)' },
    ],
  },
  {
    id: 'property',
    name: 'Property & Real Estate (प्रॉपर्टी)',
    icon: '🏢',
    bucketKey: 'listings',
    subCategories: [
      { id: 'flats', name: 'Flats & Apartments (फ्लैट्स)' },
      { id: 'plots', name: 'Plots & Land (प्लॉट व जमीन)' },
      { id: 'rent', name: 'House on Rent (किराये का मकान)' },
      { id: 'commercial', name: 'Shops & Commercial (दुकान व ऑफिस)' },
      { id: 'agriculture', name: 'Agriculture Land (कृषि भूमि)' },
    ],
  },
  {
    id: 'transporters',
    name: 'Transporters / Loading (ट्रांसपोर्ट)',
    icon: '🚚',
    bucketKey: 'individualTransporters',
    subCategories: [
      { id: 'bolero-pickup', name: 'Bolero Maxi / Pickup' },
      { id: 'tata-ace', name: 'Tata Ace / Chota Hathi' },
      { id: 'loading-auto', name: '3-Wheeler Loading Auto' },
      { id: 'e-rickshaw-loader', name: 'E-Rickshaw Loader' },
      { id: 'heavy-truck', name: 'Heavy Truck' },
      { id: 'packers-movers', name: 'Packers & Movers' },
    ],
  },
  {
    id: 'white-collar',
    name: 'Doctor / CA / Lawyer / Consultant (प्रोफेशनल्स)',
    icon: '👔',
    bucketKey: 'whiteCollarListings',
    subCategories: [
      { id: 'doctors', name: 'Doctors & Clinics' },
      { id: 'ca-cs', name: 'CA, CS & Tax Consultants' },
      { id: 'advocates', name: 'Advocates & Legal Advisors' },
      { id: 'architects', name: 'Architects & Civil Engineers' },
      { id: 'financial-advisors', name: 'Financial & Insurance Advisors' },
    ],
  },
  {
    id: 'restaurants',
    name: 'Restaurant / Cafe / Food (रेस्टोरेंट व कैफे)',
    icon: '🍔',
    bucketKey: 'restaurantsList',
    subCategories: [
      { id: 'cafes', name: 'Cafes & Fast Food' },
      { id: 'pure-veg', name: 'Pure Veg Family Restaurant' },
      { id: 'dhaba', name: 'Dhaba & Highway Dining' },
      { id: 'bakeries', name: 'Bakeries & Sweet Shops' },
      { id: 'non-veg', name: 'Non-Veg Dining' },
    ],
  },
  {
    id: 'malls',
    name: 'Showroom / Boutique / Shop (दुकान व शोरूम)',
    icon: '👗',
    bucketKey: 'mallsStores',
    subCategories: [
      { id: 'clothing', name: 'Clothing & Garments' },
      { id: 'footwear', name: 'Footwear & Shoes' },
      { id: 'jewelry', name: 'Jewelry & Ornaments' },
      { id: 'electronics-store', name: 'Electronics & Mobiles' },
      { id: 'kirana', name: 'Kirana & Supermarket' },
    ],
  },
  {
    id: 'education',
    name: 'Coaching / Home Tuition (ट्यूशन व कोचिंग)',
    icon: '🎓',
    bucketKey: 'educationListings',
    subCategories: [
      { id: 'home-tuitions', name: 'Home Tuition / Personal Tutor' },
      { id: 'coaching-institutes', name: 'Coaching Institute' },
      { id: 'competitive-exams', name: 'Competitive Exam Coaching' },
      { id: 'computer-institutes', name: 'Computer & IT Training' },
    ],
  },
  {
    id: 'construction',
    name: 'Thekedar / Material / JCB (निर्माण कार्य)',
    icon: '🏗️',
    bucketKey: 'constructionListings',
    subCategories: [
      { id: 'building-contractors', name: 'Building Thekedar / Contractor' },
      { id: 'building-material', name: 'Building Material / Sand / Bricks' },
      { id: 'jcb-excavator', name: 'JCB & Earth Movers' },
      { id: 'interior-designers', name: 'Interior & Modular Kitchen' },
    ],
  },
  {
    id: 'shaadi',
    name: 'Wedding Vendor / Halwai / Tent (विवाह सेवा)',
    icon: '💍',
    bucketKey: 'shaadiVendors',
    subCategories: [
      { id: 'marriage-gardens', name: 'Marriage Gardens & Banquets' },
      { id: 'halwai-caterers', name: 'Halwai & Catering' },
      { id: 'tent-light', name: 'Tent & DJ Sound' },
      { id: 'photographers', name: 'Wedding Photography' },
    ],
  },
  {
    id: 'recommerce',
    name: 'Re-commerce (पुराना सामान बेचें)',
    icon: '🛍️',
    bucketKey: 'reCommerceListings',
    subCategories: [
      { id: 'mobile-tablets', name: 'Used Mobiles & Tablets' },
      { id: 'electronics-appliances', name: 'Used Electronics & TV' },
      { id: 'two-wheelers', name: 'Used Bikes & Scooters' },
      { id: 'furniture-home', name: 'Used Furniture & Home' },
    ],
  },
  {
    id: 'vehicles',
    name: 'New Vehicles & Showrooms (नई गाड़ी व शोरूम)',
    icon: '🚗',
    bucketKey: 'listings',
    subCategories: [
      { id: 'car-showrooms', name: 'New Car Showrooms (कार शोरूम)' },
      { id: 'two-wheeler-dealers', name: 'Bike & Scooter Dealerships (बाइक व स्कूटी शोरूम)' },
      { id: 'ev-showrooms', name: 'Electric Vehicles / EV (इलेक्ट्रिक वाहन)' },
      { id: 'commercial-dealers', name: 'Tractors & Commercial Dealerships (ट्रैक्टर व कमर्शियल)' },
    ],
  },
{
    id: 'electronics',
    name: 'Electronics & Gadgets (इलेक्ट्रॉनिक्स व गैजेट्स)',
    icon: '📱',
    bucketKey: 'listings',
    subCategories: [
      { id: 'smartphones-tablets', name: 'Smartphones & Tablets (मोबाइल व टैबलेट)' },
      { id: 'laptops-computers', name: 'Laptops & Computers (लैपटॉप व कंप्यूटर)' },
      { id: 'home-appliances', name: 'TV, AC & Home Appliances (टीवी, फ्रिज व एसी)' },
      { id: 'audio-wearables', name: 'Audio, Earbuds & Smartwatches (ईयरबड्स व घड़ियां)' },
      { id: 'cameras-cctv', name: 'Cameras & CCTV Security (कैमरा व सीसीटीवी)' },
      { id: 'printers-accessories', name: 'Printers & Accessories (प्रिंटर व कंप्यूटर पार्ट्स)' },
      { id: 'service-centers', name: 'Brand Service Centers (ऑथराइज्ड सर्विस सेंटर)' },
    ],
  },
  // Inside TAXONOMY_REGISTRY in src/data/taxonomyRegistry.js
{
  id: 'fashion',
  name: 'Fashion & Lifestyle (फैशन व लाइफस्टाइल)',
  icon: '✨',
  bucketKey: 'listings',
  subCategories: [
    { id: 'womens-ethnic', name: 'Sarees, Suits & Kurtis (साड़ी, सूट व कुर्ती)', icon: '🥻', tag: 'TRENDING' },
    { id: 'mens-ethnic', name: 'Kurta Pajama & Sherwani (कुर्ता पायजामा व शेरवानी)', icon: '🤵', tag: 'ROYAL' },
    { id: 'streetwear-western', name: 'Jeans, Oversized Tees & Western (जींस व वेस्टर्न)', icon: '👕', tag: 'YOUTH' },
    { id: 'footwear-sneakers', name: 'Sneakers, Sports Shoes & Mojaris (जूते व मोजड़ी)', icon: '👟', tag: 'HOT' },
    { id: 'bridal-festive', name: 'Bridal Lehengas & Sherwani Rent (ब्राइडल व रेंट)', icon: '👑', tag: 'WEDDING' },
    { id: 'boutiques-tailoring', name: 'Boutique Tailoring & Stitching (बुटीक व सिलाई)', icon: '✂️', tag: 'CUSTOM' },
    { id: 'accessories-bags', name: 'Watches, Perfumes, Bags & Eyewear (घड़ियां व चश्मे)', icon: '🕶️', tag: 'LUXURY' },
    { id: 'winterwear', name: 'Jackets, Blazers & Hoodies (जैकेट व ब्लेज़र)', icon: '🧥', tag: 'SEASONAL' },
    { id: 'kids-fashion', name: 'Kids Fancy & Daily Wear (बच्चों के कपड़े)', icon: '👶', tag: 'KIDS' },
    { id: 'preloved-thrift', name: 'Pre-Loved & Branded Thrift (थ्रिफ्ट व पुराना फैशन)', icon: '♻️', tag: 'DEALS' },
  ],
},
  {
    id: 'furniture',
    name: 'Furniture & Decor (फर्नीचर व इंटीरियर)',
    icon: '🛋️',
    bucketKey: 'listings',
    subCategories: [
      { id: 'modular-kitchen', name: 'Modular Kitchen & Wardrobes (मॉड्यूलर किचन व काम)' },
      { id: 'interior-decorators', name: 'Interior Decorators & Designers (इंटीरियर डेकोरेटर्स)' },
      { id: 'glass-aluminium', name: 'Glass, Aluminium & UPVC (ग्लास व एल्युमिनियम वर्क)' },
      { id: 'sofas-living', name: 'Sofas, Recliners & Living (सोफा व बैठक)' },
      { id: 'beds-wardrobes', name: 'Beds, Almirah & Woodwork (बेड व अलमारी)' },
      { id: 'dining-tables', name: 'Dining, Study & Office Desks (डाइनिंग व टेबल)' },
      { id: 'home-decor-curtains', name: 'Curtains, Blinds & Wallpaper (पर्दे व वॉलपेपर)' },
    ],
  },
  {
    id: 'market',
    name: 'Market & Retail (लोकल बाज़ार व डील्स)',
    icon: '🛒',
    bucketKey: 'marketProducts',
    subCategories: [
      { id: 'new-openings', name: 'New Openings & Launches (नई दुकानें व उद्घाटन)' },
      { id: 'sales-clearance', name: 'Mega Sales & Clearance (सेल व भारी छूट)' },
      { id: 'special-deals', name: 'Special Deals & Offers (खास ऑफर्स व डील्स)' },
      { id: 'wholesalers', name: 'Wholesalers & Bulk Supply (थोक विक्रेता व मंडी)' },
      { id: 'brand-showrooms', name: 'Brand Showrooms & Outlets (ब्रांडेड शोरूम)' },
      { id: 'miscellaneous', name: 'Miscellaneous Retail (अन्य बाज़ार स्टोर्स)' },
    ],
  },
  {
    id: 'advertising',
    name: 'Printing / Flex / Hoardings (विज्ञापन)',
    icon: '📢',
    bucketKey: 'advertisingProviders',
    subCategories: [
      { id: 'flex-printing', name: 'Flex & Banner Printing' },
      { id: 'hoardings', name: 'Outdoor Hoardings' },
      { id: 'digital-marketing', name: 'Social Media & Promo' },
    ],
  },
  {
    id: 'community',
    name: 'Social Welfare / Seva (समाज सेवा)',
    icon: '🤝',
    bucketKey: 'communityDrives',
    subCategories: [
      { id: 'blood-donation', name: 'Blood Donation Drive' },
      { id: 'food-seva', name: 'Food & Ration Seva' },
      { id: 'animal-welfare', name: 'Gau Seva & Animal Care' },
    ],
  },
];

export function getCategoryById(catId) {
  return TAXONOMY_REGISTRY.find((c) => c.id === catId) || TAXONOMY_REGISTRY[0];
}

// In src/data/taxonomyRegistry.js:
export function sanitizeSubCategoryId(catId, subCatId) {
  const cat = getCategoryById(catId);
  const target = String(subCatId || '').toLowerCase().trim();
  
  // ✅ Keep 'all' or empty subcategories intact instead of forcing them to 'flats'
  if (!target || target === 'all' || target === 'general') {
    return 'all';
  }
  
  const match = cat.subCategories.find(
    (s) => s.id === target || target === s.id || target.includes(s.id)
  );
  
  return match ? match.id : target;
}