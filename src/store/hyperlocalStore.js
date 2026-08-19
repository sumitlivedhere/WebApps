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

class HyperlocalEngineStore {
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
      threads: {},
      interests: {},
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

  // O(1) Discussion Thread Operations
  getThreadComments(listingId, fallbackComments = []) {
    return this.state.threads[listingId] || fallbackComments;
  }

  addThreadComment(listingId, comment) {
    const existing = this.state.threads[listingId] || [];
    this.state.threads[listingId] = [comment, ...existing];
    this.notify(`thread:${listingId}`);
  }

  addSellerReply(listingId, commentId, replyObj) {
    const existing = this.state.threads[listingId] || [];
    this.state.threads[listingId] = existing.map((c) =>
      c.id === commentId ? { ...c, sellerReply: replyObj } : c
    );
    this.notify(`thread:${listingId}`);
  }

  toggleCommentVisibility(listingId, commentId) {
    const existing = this.state.threads[listingId] || [];
    this.state.threads[listingId] = existing.map((c) =>
      c.id === commentId ? { ...c, isPublic: !c.isPublic } : c
    );
    this.notify(`thread:${listingId}`);
  }

  // O(1) Fast Interest Counter
  getInterestCount(listingId, defaultCount = 0) {
    return this.state.interests[listingId] !== undefined
      ? this.state.interests[listingId]
      : defaultCount;
  }

  incrementInterest(listingId, defaultCount = 0) {
    const current = this.getInterestCount(listingId, defaultCount);
    this.state.interests[listingId] = current + 1;
    this.notify(`interest:${listingId}`);
    return this.state.interests[listingId];
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(changedKey) {
    this.listeners.forEach((listener) => listener(this.state, changedKey));
  }
}

export const hyperlocalStore = new HyperlocalEngineStore();

// Slice hook for category listings
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

// Slice hook for isolated discussion threads
export function useThreadSlice(listingId, defaultComments = []) {
  const [comments, setComments] = useState(() =>
    hyperlocalStore.getThreadComments(listingId, defaultComments)
  );

  useEffect(() => {
    return hyperlocalStore.subscribe((newState, changedKey) => {
      if (!changedKey || changedKey === `thread:${listingId}`) {
        setComments([...hyperlocalStore.getThreadComments(listingId, defaultComments)]);
      }
    });
  }, [listingId]);

  return comments;
}

// Slice hook for isolated interest counter
export function useInterestSlice(listingId, defaultCount = 0) {
  const [count, setCount] = useState(() =>
    hyperlocalStore.getInterestCount(listingId, defaultCount)
  );

  useEffect(() => {
    return hyperlocalStore.subscribe((newState, changedKey) => {
      if (!changedKey || changedKey === `interest:${listingId}`) {
        setCount(hyperlocalStore.getInterestCount(listingId, defaultCount));
      }
    });
  }, [listingId]);

  return count;
}