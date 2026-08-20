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
  const catId = (item.category || 'property').toLowerCase().trim();
  const categoryConfig = getCategoryById(catId);
  const rawSub = item.sub_category || item.subCategory || item.propertyType || item.trade || item.vehicleType || item.profession || item.cuisine || '';
  const subCatId = sanitizeSubCategoryId(catId, rawSub);
  const categoryFallback = getCategoryFallback(catId);

  const coverImage =
    item.image_url ||
    (item.image_urls && item.image_urls.length > 0 ? item.image_urls[0] : null) ||
    item.image ||
    item.photo ||
    item.avatar ||
    categoryFallback;

  const priceVal = item.price || item.rates || item.fee || item.visitingCharge || item.consultationFee || item.priceForTwo || 'Contact for Price';
  const nameVal = item.title || item.name || 'Untitled Listing';
  const rawLocation = item.location_name || item.location || 'Alwar';
  const personOrBiz = item.seller_name || item.sellerName || item.driverName || item.providerName || item.name || 'Verified Member';

  return {
    id: item.id,
    title: nameVal,
    name: nameVal,
    category: catId,
    subCategory: subCatId,
    bucketKey: categoryConfig.bucketKey,
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
    city: rawLocation.toLowerCase().includes('jaipur') ? 'Jaipur' : 'Alwar',
    location: rawLocation,
    landmark: item.landmark || rawLocation || 'Main Road',
    distance: item.distance || '0.1 km away',
    image: coverImage,
    images: item.image_urls && item.image_urls.length > 0 ? item.image_urls : [coverImage],
    photo: coverImage,
    avatar: coverImage,
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
      listings: (initialListings || []).map((i) => normalizeDBListing(i)),
      marketProducts: (initialMarketProducts || []).map((i) => normalizeDBListing({ ...i, category: 'market' })),
      kaarigarWorkers: (initialKaarigarWorkers || []).map((i) => normalizeDBListing({ ...i, category: 'kaarigar' })),
      transportFirms: (initialTransportFirms || []).map((i) => normalizeDBListing({ ...i, category: 'transporters' })),
      individualTransporters: (initialIndividualTransporters || []).map((i) => normalizeDBListing({ ...i, category: 'transporters' })),
      communityDrives: (initialCommunityDrives || []).map((i) => normalizeDBListing({ ...i, category: 'community' })),
      shaadiVendors: (initialShaadiVendors || []).map((i) => normalizeDBListing({ ...i, category: 'shaadi' })),
      advertisingProviders: (initialAdvertisingProviders || []).map((i) => normalizeDBListing({ ...i, category: 'advertising' })),
      educationListings: (initialEducationListings || []).map((i) => normalizeDBListing({ ...i, category: 'education' })),
      constructionListings: (initialConstructionListings || []).map((i) => normalizeDBListing({ ...i, category: 'construction' })),
      mallsStores: (initialMallsStores || []).map((i) => normalizeDBListing({ ...i, category: 'malls' })),
      restaurantsList: (initialRestaurantsList || []).map((i) => normalizeDBListing({ ...i, category: 'restaurants' })),
      whiteCollarListings: (initialWhiteCollarListings || []).map((i) => normalizeDBListing({ ...i, category: 'white-collar' })),
      reCommerceListings: (initialReCommerceListings || []).map((i) => normalizeDBListing({ ...i, category: 'recommerce' })),
      threads: {},
      interests: {},
      notifications: [
        {
          id: 1,
          tag: 'TOWN UPDATE',
          title: 'Hyperlocal Network Live',
          message: 'Welcome to your connected city economy engine.',
          time: 'Just now',
          read: false,
          type: 'system',
        },
        {
          id: 2,
          tag: 'FRESH ARRIVAL',
          title: 'New AC listed in Budh Vihar',
          message: 'Voltas 1.5 Ton 5-Star AC available at ₹21,000.',
          time: '5m ago',
          read: false,
          type: 'listing',
        },
      ],
    };
    this.listeners = new Set();
  }

  getState(key) {
    return this.state[key] || [];
  }

  getAllListings() {
    const buckets = [
      this.state.kaarigarWorkers,
      this.state.listings,
      this.state.individualTransporters,
      this.state.transportFirms,
      this.state.whiteCollarListings,
      this.state.restaurantsList,
      this.state.mallsStores,
      this.state.educationListings,
      this.state.constructionListings,
      this.state.shaadiVendors,
      this.state.reCommerceListings,
      this.state.marketProducts,
      this.state.advertisingProviders,
      this.state.communityDrives,
    ];

    const seenIds = new Set();
    const combined = [];

    buckets.forEach((bucket) => {
      if (Array.isArray(bucket)) {
        bucket.forEach((item) => {
          if (item && item.id && !seenIds.has(String(item.id))) {
            seenIds.add(String(item.id));
            combined.push(item);
          }
        });
      }
    });

    return combined;
  }

  insertListing(bucketKey, item) {
    const targetBucket = this.state[bucketKey] ? bucketKey : 'listings';
    const list = this.state[targetBucket] || [];
    const idx = list.findIndex((existing) => String(existing.id) === String(item.id));

    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item };
      this.state[targetBucket] = [...list];
    } else {
      this.state[targetBucket] = [item, ...list];
    }

    // Trigger confirmation notification for the author
    this.addNotification({
      tag: 'LISTING LIVE',
      title: `"${item.title || item.name}" Published!`,
      message: `Your listing is now visible to all town buyers in ${item.location || 'your area'}.`,
      time: 'Just now',
      type: 'listing',
      targetId: item.id,
    });

    this.notify(targetBucket);
    this.notify('all');
  }

  hydrateBulk(items) {
    const touchedBuckets = new Set();

    items.forEach((row) => {
      const normalized = normalizeDBListing(row);
      const bucket = row.bucket_key || normalized.bucketKey || 'listings';
      const list = this.state[bucket] || [];
      const idx = list.findIndex((existing) => String(existing.id) === String(normalized.id));

      if (idx !== -1) {
        list[idx] = { ...list[idx], ...normalized };
      } else {
        list.unshift(normalized);
      }
      this.state[bucket] = list;
      touchedBuckets.add(bucket);
    });

    touchedBuckets.forEach((bucketKey) => this.notify(bucketKey));
    this.notify('all');
  }

  addNotification(notif) {
    const newEntry = {
      id: notif.id || Date.now() + Math.random(),
      tag: notif.tag || 'ALERT',
      title: notif.title || 'New Notification',
      message: notif.message || '',
      time: notif.time || 'Just now',
      read: false,
      type: notif.type || 'general',
      targetId: notif.targetId || null,
      subCategory: notif.subCategory || null,
    };
    this.state.notifications = [newEntry, ...(this.state.notifications || [])];
    this.notify('notifications');
  }

  markNotificationRead(id) {
    this.state.notifications = (this.state.notifications || []).map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notify('notifications');
  }

  markAllNotificationsRead() {
    this.state.notifications = (this.state.notifications || []).map((n) => ({ ...n, read: true }));
    this.notify('notifications');
  }

  clearNotifications() {
    this.state.notifications = [];
    this.notify('notifications');
  }

  getThreadComments(listingId, fallback = []) {
    return this.state.threads[listingId] || fallback;
  }

  addThreadComment(listingId, comment, listingTitle = '') {
    this.state.threads[listingId] = [comment, ...(this.state.threads[listingId] || [])];
    this.notify(`thread:${listingId}`);

    // Ping notification for comment
    this.addNotification({
      tag: 'NEW COMMENT',
      title: `Inquiry on "${listingTitle || 'Listing'}"`,
      message: `${comment.userName || 'A buyer'} asked: "${comment.text}"`,
      time: 'Just now',
      type: 'comment',
      targetId: listingId,
    });
  }

  addSellerReply(listingId, commentId, replyObj, listingTitle = '') {
    this.state.threads[listingId] = (this.state.threads[listingId] || []).map((c) =>
      c.id === commentId ? { ...c, sellerReply: replyObj } : c
    );
    this.notify(`thread:${listingId}`);

    // Ping notification for seller reply
    this.addNotification({
      tag: 'SELLER REPLIED',
      title: `Reply on "${listingTitle || 'Listing'}"`,
      message: `Seller replied: "${replyObj.text}"`,
      time: 'Just now',
      type: 'reply',
      targetId: listingId,
    });
  }

  getInterestCount(listingId, defaultCount = 0) {
    return this.state.interests[listingId] !== undefined ? this.state.interests[listingId] : defaultCount;
  }

  incrementInterest(listingId, defaultCount = 0, listingTitle = '', sellerName = '') {
    const count = this.getInterestCount(listingId, defaultCount) + 1;
    this.state.interests[listingId] = count;
    this.notify(`interest:${listingId}`);

    // Ping notification for interested item
    this.addNotification({
      tag: 'INTEREST REGISTERED',
      title: `You expressed interest in "${listingTitle || 'Listing'}"`,
      message: `${sellerName || 'The seller'} was notified of your interest. Total buyers interested: ${count}`,
      time: 'Just now',
      type: 'interest',
      targetId: listingId,
    });

    return count;
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
      hyperlocalStore.hydrateBulk(data);
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

export function useAllListingsSlice() {
  const [allListings, setAllListings] = useState(() => hyperlocalStore.getAllListings());

  useEffect(() => {
    return hyperlocalStore.subscribe(() => {
      setAllListings([...hyperlocalStore.getAllListings()]);
    });
  }, []);

  return allListings;
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
      }
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'listing_threads' },
      (payload) => {
        const row = payload.new;
        if (payload.eventType === 'INSERT') {
          hyperlocalStore.addThreadComment(
            row.listing_id,
            {
              id: row.id,
              userName: row.user_name,
              userArea: row.user_area,
              text: row.comment_text,
              timestamp: 'Just now',
              isPublic: row.is_public,
              sellerReply: null,
            },
            row.listing_title || 'Listing'
          );
        } else if (payload.eventType === 'UPDATE' && row.seller_reply) {
          hyperlocalStore.addSellerReply(
            row.listing_id,
            row.id,
            {
              text: row.seller_reply,
              timestamp: 'Just now',
              sellerName: 'Author Reply',
            },
            row.listing_title || 'Listing'
          );
        }
      }
    )
    .subscribe();
}