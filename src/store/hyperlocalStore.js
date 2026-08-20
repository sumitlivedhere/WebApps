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
import { getCategoryFallback } from '../services/listingService';
import { getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';

export function normalizeDBListing(item) {
  const catId = (item.category || 'kaarigar').toLowerCase().trim();
  const categoryConfig = getCategoryById(catId);
  const rawSub = item.sub_category || item.subCategory || item.trade || item.vehicleType || item.profession || item.cuisine || '';
  
  // Exact deterministic subcategory assignment
  const subCatId = sanitizeSubCategoryId(catId, rawSub);
  const categoryFallback = getCategoryFallback(catId);

  const coverImage =
    item.image_url ||
    (item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : null) ||
    item.image ||
    item.photo ||
    item.avatar ||
    item.banner ||
    item.logo ||
    categoryFallback;

  const allImages =
    item.image_urls && item.image_urls.length > 0
      ? item.image_urls
      : (item.images && item.images.length > 0 ? item.images : [coverImage]);

  const priceVal =
    item.price ||
    item.rates ||
    item.fee ||
    item.visitingCharge ||
    item.consultationFee ||
    item.priceForTwo ||
    'Contact for Price';

  const nameVal = item.title || item.name || 'Untitled Listing';
  const rawLocation = item.location_name || item.location || 'Alwar';
  const personOrBiz = item.seller_name || item.sellerName || item.driverName || item.providerName || item.name || 'Verified Member';
  const cityName = rawLocation.toLowerCase().includes('jaipur') ? 'Jaipur' : 'Alwar';

  return {
    id: item.id,
    title: nameVal,
    name: nameVal,
    category: catId,
    subCategory: subCatId,
    bucketKey: categoryConfig.bucketKey,
    
    // Strict schema aliases matching exact subCatId
    trade: subCatId,
    profession: subCatId,
    vehicleType: subCatId,
    cuisine: subCatId,
    tuitionType: subCatId,
    shopType: subCatId,
    workType: subCatId,
    vendorType: subCatId,
    itemType: subCatId,

    price: priceVal,
    fee: priceVal,
    rates: priceVal,
    visitingCharge: priceVal,
    consultationFee: priceVal,
    priceForTwo: priceVal,

    sellerName: personOrBiz,
    driverName: personOrBiz,
    providerName: personOrBiz,
    doctorName: personOrBiz,

    phone: item.phone || '9876543210',
    whatsapp: item.whatsapp || item.phone || '9876543210',
    city: cityName,
    location: rawLocation,
    landmark: item.landmark || rawLocation || 'Main Road',
    distance: item.distance || '0.1 km away',

    image: coverImage,
    images: allImages,
    photo: coverImage,
    avatar: coverImage,
    banner: coverImage,

    description: item.description || '',
    condition: item.condition || 'Good',
    interestCount: item.interest_count || item.interestCount || 0,
    rating: item.rating || 5.0,
    verified: item.verified !== undefined ? item.verified : true,
    badge: item.badge || '🟢 Verified Listing',
    experience: item.experience || '5+ Years Exp',
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
      id: notif.id || Date.now(),
      tag: notif.tag || 'ALERT',
      title: notif.title || 'Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      read: false,
    };
    this.state.notifications = [newEntry, ...(this.state.notifications || [])];
    this.notify('notifications');
  }

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
        const catConfig = getCategoryById(row.category);
        const bucket = row.bucket_key || catConfig.bucketKey || 'listings';
        const normalized = normalizeDBListing(row);
        hyperlocalStore.insertListing(bucket, normalized);
      });
      console.log(`✅ Loaded ${data.length} live listings from Supabase.`);
    }
  } catch (err) {
    console.error('Hydration error:', err);
  }
}

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
        const catConfig = getCategoryById(item.category);
        hyperlocalStore.insertListing(item.bucket_key || catConfig.bucketKey || 'listings', normalized);

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