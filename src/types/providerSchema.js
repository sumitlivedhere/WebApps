// src/types/providerSchema.js

/**
 * Persona Types:
 * - 'DAILY_WAGE' : Blue-collar trades, drivers, mechanics
 * - 'RETAIL'     : Kirana, clothing, electronics, local shops
 * - 'FIRM'       : Contractors, banquet halls, wedding planners, consultants
 * - 'P2P'        : Individuals selling used items
 */

export const INITIAL_PROVIDER_PROFILE = {
  id: 'prov_alwar_001',
  phone: '',
  name: '',
  persona: 'RETAIL',
  tradeCategory: 'electronics',
  
  // Geolocation & Coverage
  location: {
    zone: 'Alwar - Central',
    landmark: '',
    lat: 27.5530,
    lng: 76.6346,
    operatingRadiusKm: 5
  },

  // Live Operations & Availability (O(1) toggle)
  status: {
    isOpen: true,
    customNote: 'Open till 9 PM',
    lastActiveTimestamp: Date.now()
  },

  // Trust & Badging
  verification: {
    status: 'PENDING', // 'VERIFIED' | 'PENDING' | 'REJECTED'
    docType: 'GSTIN',  // 'GSTIN' | 'TRADE_LICENSE' | 'SHOP_ACT'
    shieldBadgeActive: false
  },

  // Metrics Cache
  metrics: {
    totalViews: 0,
    callClicks: 0,
    whatsappClicks: 0
  }
};