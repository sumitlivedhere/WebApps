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
    name: 'Vehicles / Motors (गाड़ी व बाइक)',
    icon: '🚗',
    bucketKey: 'listings',
    subCategories: [
      { id: 'cars', name: 'Used Cars' },
      { id: 'bikes', name: 'Bikes & Scooters' },
      { id: 'commercial-vehicles', name: 'Commercial & Tractors' },
    ],
  },
  {
    id: 'electronics',
    name: 'Electronics / Gadgets (इलेक्ट्रॉनिक्स)',
    icon: '📱',
    bucketKey: 'listings',
    subCategories: [
      { id: 'smartphones', name: 'Smartphones' },
      { id: 'laptops', name: 'Laptops & Computers' },
      { id: 'appliances', name: 'Home Appliances' },
    ],
  },
  {
    id: 'fashion',
    name: 'Fashion / Lifestyle (फैशन)',
    icon: '👕',
    bucketKey: 'listings',
    subCategories: [
      { id: 'mens-wear', name: "Men's Wear" },
      { id: 'womens-wear', name: "Women's Wear" },
      { id: 'kids-wear', name: "Kids & Baby Wear" },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture / Decor (फर्नीचर)',
    icon: '🛋️',
    bucketKey: 'listings',
    subCategories: [
      { id: 'sofas', name: 'Sofas & Couches' },
      { id: 'beds', name: 'Beds & Mattresses' },
      { id: 'tables', name: 'Dining & Office Tables' },
    ],
  },
  {
    id: 'market',
    name: 'Market / Retail Products (बाज़ार उत्पाद)',
    icon: '🛒',
    bucketKey: 'marketProducts',
    subCategories: [
      { id: 'groceries', name: 'Groceries & Kirana' },
      { id: 'fruits-veg', name: 'Fresh Fruits & Vegetables' },
      { id: 'dairy', name: 'Dairy & Milk Products' },
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

export function sanitizeSubCategoryId(catId, subCatId) {
  const cat = getCategoryById(catId);
  const target = String(subCatId || '').toLowerCase().trim();
  const match = cat.subCategories.find((s) => s.id === target || target.includes(s.id));
  return match ? match.id : cat.subCategories[0].id;
}