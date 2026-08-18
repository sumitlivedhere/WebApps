// src/hooks/useGeoFilter.js
import { useMemo } from 'react';
import { filterBy5KmRadius } from '../utils/geoFilter'; // The algorithm from earlier
import { cityZones } from '../data/cityZones';

export function useGeoFilter(items, selectedCityName) {
  return useMemo(() => {
    // 1. Get the coordinates for the user's selected dropdown zone
    const coords = cityZones[selectedCityName];
    
    // 2. Failsafes: If zone isn't mapped or items array is empty, return original data
    if (!coords || !items || items.length === 0) return items;

    // 3. Apply the heavily optimized bounding-box + Haversine algorithm
    return filterBy5KmRadius(coords.lat, coords.lng, items, 5);
    
  }, [items, selectedCityName]); // Only re-calculate if the dataset or user's city changes
}