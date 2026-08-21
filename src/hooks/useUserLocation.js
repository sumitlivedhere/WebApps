import { useState, useEffect, useCallback } from 'react';

const FALLBACK_LOCATION = {
  locality: 'Budh Vihar',
  city: 'Alwar',
  display: 'Budh Vihar, Alwar',
  lat: 27.553,
  lng: 76.6346,
};

export function useUserLocation() {
  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('townhub_user_location');
      return saved ? JSON.parse(saved) : FALLBACK_LOCATION;
    } catch {
      return FALLBACK_LOCATION;
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const resolveLocalityFromCoords = async (lat, lng) => {
    try {
      // Fast reverse geocoding via OpenStreetMap Nominatim
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      const addr = data.address || {};

      const locality =
        addr.suburb ||
        addr.neighbourhood ||
        addr.residential ||
        addr.road ||
        addr.village ||
        'Nearby Area';

      const city =
        addr.city ||
        addr.town ||
        addr.county ||
        addr.state_district ||
        (lat > 26.5 && lat < 27.2 ? 'Jaipur' : 'Alwar');

      const resolved = {
        locality,
        city,
        display: `${locality}, ${city}`,
        lat,
        lng,
      };

      localStorage.setItem('townhub_user_location', JSON.stringify(resolved));
      return resolved;
    } catch {
      // Fallback coordinate proximity resolution
      const isJaipur = Math.abs(lat - 26.9124) < Math.abs(lat - 27.553);
      const fallbackResolved = {
        locality: isJaipur ? 'Vaishali Nagar' : 'Budh Vihar',
        city: isJaipur ? 'Jaipur' : 'Alwar',
        display: isJaipur ? 'Vaishali Nagar, Jaipur' : 'Budh Vihar, Alwar',
        lat,
        lng,
      };
      localStorage.setItem('townhub_user_location', JSON.stringify(fallbackResolved));
      return fallbackResolved;
    }
  };

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const resolved = await resolveLocalityFromCoords(latitude, longitude);
        setLocation(resolved);
        setIsLocating(false);
      },
      (err) => {
        console.warn('GPS notice:', err.message);
        setErrorMsg('Location permission denied or unavailable.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return {
    location,
    isLocating,
    errorMsg,
    detectLocation,
  };
}