import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getCurrentHighAccuracyGPS,
  reverseGeocodeCoordinates,
  LOCAL_LANDMARK_CENTROIDS,
} from '../utils/geoUtils';

const STORAGE_KEY = 'townhub_user_precise_location';

const DEFAULT_LOCATION = {
  colony: 'Budh Vihar',
  landmark: 'Budh Vihar (Sector 1 & 2)',
  city: 'Alwar',
  lat: 27.5682,
  lng: 76.6215,
  radiusKm: 5, // Default 5 km radial window
  accuracyMeters: null,
  isGPSActive: false,
};

const LocationContext = createContext(null);

export function LocationProvider({ children, defaultCity = 'Alwar' }) {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_LOCATION, ...parsed };
      }
      return { ...DEFAULT_LOCATION, city: defaultCity };
    } catch {
      return { ...DEFAULT_LOCATION, city: defaultCity };
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Sync state when default town switches (e.g. Alwar <-> Jaipur)
  useEffect(() => {
    if (location.city.toLowerCase() !== defaultCity.toLowerCase()) {
      const cityCentroids =
        (LOCAL_LANDMARK_CENTROIDS && LOCAL_LANDMARK_CENTROIDS[defaultCity]) ||
        (LOCAL_LANDMARK_CENTROIDS && LOCAL_LANDMARK_CENTROIDS.Alwar) ||
        [];

      const initialColony = cityCentroids[0] || {
        name: `${defaultCity} Central`,
        landmark: `${defaultCity} Center`,
        lat: 27.553,
        lng: 76.6346,
      };

      const updated = {
        colony: initialColony.name,
        landmark: initialColony.landmark || initialColony.name,
        city: defaultCity,
        lat: initialColony.lat,
        lng: initialColony.lng,
        radiusKm: location.radiusKm || 5,
        accuracyMeters: null,
        isGPSActive: false,
      };

      setLocation(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  }, [defaultCity, location.city, location.radiusKm]);

  // Pinpoint GPS location within meters
  const detectLiveGPS = useCallback(async () => {
    setIsLocating(true);
    setLocationError(null);

    try {
      const coords = await getCurrentHighAccuracyGPS();
      const resolved = await reverseGeocodeCoordinates(coords.lat, coords.lng, location.city);

      const finalLocation = {
        ...resolved,
        lat: coords.lat,
        lng: coords.lng,
        accuracyMeters: coords.accuracyMeters,
        radiusKm: location.radiusKm || 5,
        isGPSActive: true,
      };

      setLocation(finalLocation);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(finalLocation));
      } catch {}
      return finalLocation;
    } catch (err) {
      console.warn('GPS detection note:', err?.message || err);
      setLocationError('Could not detect GPS. Please pick a colony manually.');
      return null;
    } finally {
      setIsLocating(false);
    }
  }, [location.city, location.radiusKm]);

  // Set colony manually from landmark centroids
  const setColony = useCallback(
    (colonyObj, cityName = location.city) => {
      if (!colonyObj) return;

      const updated = {
        colony: colonyObj.name,
        landmark: colonyObj.landmark || colonyObj.name,
        city: cityName,
        lat: colonyObj.lat,
        lng: colonyObj.lng,
        radiusKm: location.radiusKm || 5,
        accuracyMeters: null,
        isGPSActive: false,
      };

      setLocation(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      setLocationError(null);
    },
    [location.city, location.radiusKm]
  );

  // Set radial match distance (e.g. 1 km to 25 km)
  const setRadiusKm = useCallback(
    (newRadius) => {
      const radiusNum = Number(newRadius) || 5;
      setLocation((prev) => {
        const updated = { ...prev, radiusKm: radiusNum };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      location,
      isLocating,
      locationError,
      detectLiveGPS,
      setColony,
      setRadiusKm,
    }),
    [location, isLocating, locationError, detectLiveGPS, setColony, setRadiusKm]
  );

  return (
    <LocationContext.Provider value={contextValue}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
}