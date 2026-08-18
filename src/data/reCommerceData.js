// src/data/reCommerceData.js

export const RE_COMMERCE_SUB_CATEGORIES = [
  { id: 'all', label: 'All Items (सभी सामान)', icon: '🛍️' },
  { id: 'mobiles', label: 'Mobiles & Tablets', icon: '📱' },
  { id: 'vehicles', label: 'Bikes & Scooters', icon: '🛵' },
  { id: 'appliances', label: 'Appliances (AC, Cooler, TV)', icon: '❄️' },
  { id: 'furniture', label: 'Furniture (अलमारी, सोफा, बेड)', icon: '🪑' },
  { id: 'others', label: 'Other Household Items', icon: '📦' }
];

export const RE_COMMERCE_CONDITIONS = [
  { id: 'like_new', label: 'Like New (नए जैसा)', badge: 'bg-emerald-100 text-emerald-800' },
  { id: 'good', label: 'Good (अच्छी हालत)', badge: 'bg-blue-100 text-blue-800' },
  { id: 'fair', label: 'Fair (काम चालू)', badge: 'bg-amber-100 text-amber-800' }
];

export const initialReCommerceListings = [
  {
    id: 'rc_1',
    title: 'OnePlus Nord CE 2 5G (8GB / 128GB)',
    subCategory: 'mobiles',
    rawPrice: 12500,
    price: '₹12,500',
    isNegotiable: true,
    condition: 'like_new',
    ageMonths: 10,
    hasBillOrBox: true,
    description: 'No scratches, tempered glass applied, with original 65W charger and box.',
    location: 'Budh Vihar, Alwar',
    zone: 'Alwar - Central',
    lat: 27.5530,
    lng: 76.6346,
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60'],
    seller: {
      name: 'Rahul Sharma',
      phone: '9829012345',
      isVerified: true
    },
    status: 'ACTIVE',
    createdAt: '2 hours ago'
  },
  {
    id: 'rc_2',
    title: 'Hero Splendor Plus (BS6 - Self Start)',
    subCategory: 'vehicles',
    rawPrice: 48000,
    price: '₹48,000',
    isNegotiable: false,
    condition: 'good',
    ageMonths: 24,
    hasBillOrBox: true,
    description: 'Single hand used, all papers complete, valid insurance till late 2026.',
    location: 'Station Road, Alwar',
    zone: 'Alwar - Station Rd',
    lat: 27.5684,
    lng: 76.6231,
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600&auto=format&fit=crop&q=60'],
    seller: {
      name: 'Mukesh Yadav',
      phone: '9414012345',
      isVerified: true
    },
    status: 'ACTIVE',
    createdAt: '5 hours ago'
  },
  {
    id: 'rc_3',
    title: 'Voltas 1.5 Ton Split Inverter AC',
    subCategory: 'appliances',
    rawPrice: 19500,
    price: '₹19,500',
    isNegotiable: true,
    condition: 'good',
    ageMonths: 14,
    hasBillOrBox: false,
    description: '100% copper condenser, cooling perfectly, remote included.',
    location: 'Moti Nagar, Alwar',
    zone: 'Alwar - Moti Nagar',
    lat: 27.5450,
    lng: 76.6110,
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=60'],
    seller: {
      name: 'Sunil Kumar',
      phone: '9828012345',
      isVerified: false
    },
    status: 'ACTIVE',
    createdAt: '1 day ago'
  },
  {
    id: 'rc_4',
    title: 'Solid Sheesham Wood 6-Seater Dining Table',
    subCategory: 'furniture',
    rawPrice: 14000,
    price: '₹14,000',
    isNegotiable: true,
    condition: 'like_new',
    ageMonths: 8,
    hasBillOrBox: true,
    description: 'Pure rosewood dining set with glass top and 6 cushioned chairs.',
    location: 'Budh Vihar, Alwar',
    zone: 'Alwar - Central',
    lat: 27.5530,
    lng: 76.6346,
    images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&auto=format&fit=crop&q=60'],
    seller: {
      name: 'Pooja Verma',
      phone: '9785012345',
      isVerified: true
    },
    status: 'ACTIVE',
    createdAt: '2 days ago'
  }
];