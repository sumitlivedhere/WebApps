// src/data/tradeRegistry.js

export const TRADE_REGISTRY = [
  // Kaarigar / Blue Collar & Driver Workspaces
  {
    id: 'plumber',
    name: 'Plumber / नल कारीगर',
    category: 'kaarigar',
    workspaceType: 'SERVICE_WAGE',
    icon: '🔧',
    keywords: ['plumber', 'nal', 'pipe', 'tap', 'leakage', 'पानी', 'नल'],
    pricingLabel: 'Visiting / Inspection Fee (विजिट शुल्क)',
    defaultRate: '150',
    unit: 'per visit'
  },
  {
    id: 'electrician',
    name: 'Electrician / बिजली कारीगर',
    category: 'kaarigar',
    workspaceType: 'SERVICE_WAGE',
    icon: '⚡',
    keywords: ['electrician', 'bijli', 'wiring', 'inverter', 'fan', 'लाइट', 'बिजली'],
    pricingLabel: 'Visiting / Inspection Fee (विजिट शुल्क)',
    defaultRate: '150',
    unit: 'per visit'
  },
  {
    id: 'loading_driver',
    name: 'Auto / Pickup / Loading Driver',
    category: 'transporters',
    workspaceType: 'SERVICE_WAGE',
    icon: '🛺',
    keywords: ['driver', 'tempo', 'pickup', 'loading', 'tata ace', 'छोटा हाथी', 'गाड़ी'],
    pricingLabel: 'Base Trip Rate (शुरुआती किराया)',
    defaultRate: '350',
    unit: 'per trip'
  },
  {
    id: 'carpenter',
    name: 'Carpenter / बढ़ई',
    category: 'kaarigar',
    workspaceType: 'SERVICE_WAGE',
    icon: '🪚',
    keywords: ['carpenter', 'furniture', 'wood', 'badhai', 'लकड़ी', 'कारीगर'],
    pricingLabel: 'Daily / Inspection Charge',
    defaultRate: '200',
    unit: 'per visit'
  },

  // Retail & Showroom Workspaces
  {
    id: 'clothing_store',
    name: 'Cloth Store / Boutique / Garments',
    category: 'fashion',
    workspaceType: 'RETAIL_CATALOG',
    icon: '👗',
    keywords: ['cloth', 'kapde', 'boutique', 'suit', 'saree', 'garments', 'दुकान'],
    pricingLabel: 'Selling Price (बिक्री मूल्य)',
    hasDiscountCalc: true
  },
  {
    id: 'electronics_retail',
    name: 'Electronics & Mobile Shop',
    category: 'electronics',
    workspaceType: 'RETAIL_CATALOG',
    icon: '📱',
    keywords: ['mobile', 'electronics', 'ac', 'tv', 'fridge', 'फोन', 'इलेक्ट्रॉनिक'],
    pricingLabel: 'Selling Price (बिक्री मूल्य)',
    hasDiscountCalc: true
  },
  {
    id: 'kirana_general',
    name: 'Kirana / General Store',
    category: 'market',
    workspaceType: 'RETAIL_CATALOG',
    icon: '🛒',
    keywords: ['kirana', 'grocery', 'general store', 'rashan', 'राशन', 'किराना'],
    pricingLabel: 'Item Price (मूल्य)',
    hasDiscountCalc: true
  },

  // Firm & Contractor Workspaces
  {
    id: 'wedding_tent_caterer',
    name: 'Tent, Halwai & Shaadi Planner',
    category: 'shaadi',
    workspaceType: 'CONTRACT_FIRM',
    icon: '🎪',
    keywords: ['tent', 'caterer', 'halwai', 'wedding', 'shaadi', 'विवाह', 'टेंट'],
    pricingLabel: 'Package Starting From (पैकेज शुरुआत)',
    hasPortfolioUpload: true
  },
  {
    id: 'building_contractor',
    name: 'Building Contractor / Thekedar',
    category: 'construction',
    workspaceType: 'CONTRACT_FIRM',
    icon: '🏗️',
    keywords: ['contractor', 'builder', 'thekedar', 'construction', 'ठेकेदार', 'मकान'],
    pricingLabel: 'Rate per Sq. Ft. (प्रति वर्ग फुट दर)',
    hasPortfolioUpload: true
  },

  // P2P Quick Seller Workspace
  {
    id: 'p2p_used_item',
    name: 'Sell Used Item / पुराना सामान',
    category: 'listings',
    workspaceType: 'P2P_QUICK',
    icon: '🏷️',
    keywords: ['purana', 'used', 'bike', 'scooty', 'old', 'second hand', 'बेचना'],
    pricingLabel: 'Expected Price (मांग)',
    isQuickListing: true
  }
];