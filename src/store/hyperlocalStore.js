import { useState, useEffect } from 'react';
import { initialShaadiVendors } from '../data/shaadiData';
import { initialTransportFirms, initialIndividualTransporters } from '../data/transporterData';
import { initialKaarigarWorkers } from '../data/kaarigarData';
import { initialMarketProducts } from '../data/marketData';
import { initialAdvertisingProviders } from '../data/advertisingData';
import { initialEducationListings } from '../data/educationData';
import { initialConstructionListings } from '../data/constructionData';
import { initialMallsStores } from '../data/mallsData';
import { initialRestaurantsList } from '../data/restaurantsData';
import { initialWhiteCollarListings } from '../data/whiteCollarData';
import { initialListings } from '../data/mockData';
import { initialCommunityDrives } from '../data/communityData';
import { initialReCommerceListings } from '../data/reCommerceData';

// Micro reactive store singleton
class HyperlocalStore {
  constructor() {
    this.state = {
      listings: initialListings,
      marketProducts: initialMarketProducts,
      kaarigarWorkers: initialKaarigarWorkers,
      transportFirms: initialTransportFirms,
      individualTransporters: initialIndividualTransporters,
      communityDrives: initialCommunityDrives,
      shaadiVendors: initialShaadiVendors,
      advertisingProviders: initialAdvertisingProviders,
      educationListings: initialEducationListings,
      constructionListings: initialConstructionListings,
      mallsStores: initialMallsStores,
      restaurantsList: initialRestaurantsList,
      whiteCollarListings: initialWhiteCollarListings,
      reCommerceListings: initialReCommerceListings,
    };
    this.listeners = new Set();
  }

  getState(key) {
    return this.state[key];
  }

  insertListing(bucketKey, item) {
    if (this.state[bucketKey]) {
      this.state[bucketKey] = [item, ...this.state[bucketKey]];
      this.notify(bucketKey);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changedKey) {
    this.listeners.forEach((listener) => listener(this.state, changedKey));
  }
}

export const hyperlocalStore = new HyperlocalStore();

// React hook for atomic subscriptions
export function useStoreSlice(bucketKey) {
  const [data, setData] = useState(() => hyperlocalStore.getState(bucketKey));

  useEffect(() => {
    return hyperlocalStore.subscribe((newState, changedKey) => {
      if (!changedKey || changedKey === bucketKey) {
        setData([...newState[bucketKey]]);
      }
    });
  }, [bucketKey]);

  return data;
}