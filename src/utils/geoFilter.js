// src/utils/geoFilter.js

// 1 Degree of Latitude is approximately 111 km everywhere.
const LAT_KM = 111; 
// 1 Degree of Longitude varies based on how far north/south you are.
// Alwar's latitude is roughly 27.56°. We pre-calculate this for high performance.
const ALWAR_LAT_RAD = 27.56 * (Math.PI / 180);
const LNG_KM = 111 * Math.cos(ALWAR_LAT_RAD); 

export function filterBy5KmRadius(userLat, userLng, items, maxRadiusKm = 5) {
  if (!items || items.length === 0) return [];

  // ==========================================
  // PHASE 1: THE BOUNDING BOX PRE-FILTER O(N)
  // Super fast addition/subtraction. No Trigonometry.
  // ==========================================
  const latDelta = maxRadiusKm / LAT_KM;
  const lngDelta = maxRadiusKm / LNG_KM;

  const minLat = userLat - latDelta;
  const maxLat = userLat + latDelta;
  const minLng = userLng - lngDelta;
  const maxLng = userLng + lngDelta;

  const boxedItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // If the item doesn't have coordinates, we assume it's city-wide
    if (!item.lat || !item.lng) {
      boxedItems.push(item);
      continue;
    }
    
    // Check if inside the rough square
    if (
      item.lat >= minLat && item.lat <= maxLat &&
      item.lng >= minLng && item.lng <= maxLng
    ) {
      boxedItems.push(item);
    }
  }

  // ==========================================
  // PHASE 2: PRECISE HAVERSINE FILTER O(K)
  // Run heavy math ONLY on the tiny subset (K) that passed Phase 1
  // ==========================================
  return boxedItems.filter(item => {
    if (!item.lat || !item.lng) return true;

    const dLat = (item.lat - userLat) * (Math.PI / 180);
    const dLng = (item.lng - userLng) * (Math.PI / 180);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLat * (Math.PI/180)) * Math.cos(item.lat * (Math.PI/180)) * Math.sin(dLng/2) * Math.sin(dLng/2);
      
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = 6371 * c; // Earth's radius is 6371 km

    return distance <= maxRadiusKm;
  });
}