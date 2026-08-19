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
import { supabase } from '../services/supabaseClient';

export function normalizeDBListing(item) {
  const coverImage =
    item.image_url ||
    (item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : null) ||
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';

  const allImages =
    item.image_urls && item.image_urls.length > 0
      ? item.image_urls
      : [coverImage];

  return {
    id: item.id,
    title: item.title || item.name || 'Untitled Listing',
    name: item.title || item.name || 'Untitled Listing',
    category: item.category || 'general',
    subCategory: item.sub_category || item.subCategory || 'all',
    price: item.price || 'Contact for Price',
    fee: item.price || 'Contact for Price',
    rates: item.price || 'Contact for Price',
    visitingCharge: item.price || 'Contact for Price',
    description: item.description || '',
    sellerName: item.seller_name || item.sellerName || 'Verified Member',
    phone: item.phone || '9876543210',
    whatsapp: item.whatsapp || item.phone || '9876543210',
    location: item.location_name || item.location || 'Alwar',
    landmark: item.landmark || item.location_name || 'Main Road',
    distance: item.distance || '0.1 km away',
    image: coverImage,
    images: allImages,
    condition: item.condition || 'Good',
    interestCount: item.interest_count || item.interestCount || 0,
    rating: item.rating || 5.0,
    verified: item.verified !== undefined ? item.verified : true,
    badge: '🟢 Verified Listing',
    specialties: item.specialties || ['General Service'],
    subjects: item.subjects || ['All Topics'],
    experience: item.experience || 'Experienced',
    freeTimeSlot: 'Available Today',
    isAvailableNow: true,
  };
}

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
      notifications: [
        {
          id: 1,
          tag: 'TOWN UPDATE',
          title: 'Hyperlocal Network Live',
          message: 'Welcome to your connected city platform.',
          time: 'Just now',
          read: false,
        },
      ],
    };
    this.listeners = new Set();
  }

  getState(key) {
    return this.state[key] || [];
  }

  insertListing(bucketKey, item) {
    const targetBucket = this.state[bucketKey] ? bucketKey : 'listings';
    const currentList = this.state[targetBucket] || [];

    const existsIdx = currentList.findIndex(
      (existing) => String(existing.id) === String(item.id)
    );

    if (existsIdx !== -1) {
      currentList[existsIdx] = { ...currentList[existsIdx], ...item };
      this.state[targetBucket] = [...currentList];
    } else {
      this.state[targetBucket] = [item, ...currentList];
    }

    this.notify(targetBucket);
  }

  addNotification(notif) {
    const newEntry = {
      id: Date.now(),
      tag: notif.tag || 'ALERT',
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      read: false,
    };
    this.state.notifications = [newEntry, ...(this.state.notifications || [])];
    this.notify('notifications');
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

  // O(1) Fast Interest Counter Operations
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

/**
 * Hydrates store slices with active listings from Supabase
 */
export async function hydrateFromDB() {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('DB Hydration notice:', error.message);
      return;
    }

    if (data && data.length > 0) {
      data.forEach((row) => {
        const bucket = row.bucket_key || 'listings';
        const normalized = normalizeDBListing(row);
        hyperlocalStore.insertListing(bucket, normalized);
      });
      console.log(`✅ Loaded ${data.length} live listings from Supabase.`);
    }
  } catch (err) {
    console.error('Hydration error:', err);
  }
}

// Slice hook for category listings
export function useStoreSlice(bucketKey) {
  const [data, setData] = useState(() => hyperlocalStore.getState(bucketKey));

  useEffect(() => {
    return hyperlocalStore.subscribe((newState, changedKey) => {
      if (!changedKey || changedKey === bucketKey) {
        setData([...(newState[bucketKey] || [])]);
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
  }, [listingId, defaultComments]);

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
  }, [listingId, defaultCount]);

  return count;
}

// Slice hook for user notifications
export function useNotificationSlice() {
  const [notifs, setNotifs] = useState(() => hyperlocalStore.getState('notifications'));

  useEffect(() => {
    return hyperlocalStore.subscribe((newState, changedKey) => {
      if (!changedKey || changedKey === 'notifications') {
        setNotifs([...(newState.notifications || [])]);
      }
    });
  }, []);

  return notifs;
}

// Real-time WebSocket singleton
let realtimeChannel = null;

export function initRealtimeSubscriptions() {
  if (realtimeChannel) return;

  realtimeChannel = supabase
    .channel('hyperlocal-realtime-sync')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'listings' },
      (payload) => {
        const item = payload.new;
        const normalized = normalizeDBListing(item);
        hyperlocalStore.insertListing(item.bucket_key || 'listings', normalized);

        hyperlocalStore.addNotification({
          tag: 'NEW LISTING',
          title: `New in ${normalized.category.toUpperCase()}`,
          message: `"${normalized.title}" was just listed in ${normalized.location}.`,
          time: 'Just now',
        });
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'listing_threads' },
      (payload) => {
        const row = payload.new;
        if (payload.eventType === 'INSERT') {
          const commentObj = {
            id: row.id,
            userName: row.user_name,
            userArea: row.user_area,
            text: row.comment_text,
            timestamp: 'Just now',
            isPublic: row.is_public,
            sellerReply: null,
          };
          hyperlocalStore.addThreadComment(row.listing_id, commentObj);
        } else if (payload.eventType === 'UPDATE' && row.seller_reply) {
          hyperlocalStore.addSellerReply(row.listing_id, row.id, {
            text: row.seller_reply,
            timestamp: 'Just now',
            sellerName: 'Author Reply',
          });
        }
      }
    )
    .subscribe();
}