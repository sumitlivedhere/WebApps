import { supabase } from './supabaseClient';
import { getCategoryById } from '../data/taxonomyRegistry';
import { compressMultipleImages } from '../utils/imageCompressor';
import { hyperlocalStore } from '../store/hyperlocalStore';

function isValidDatabaseId(id) {
  if (!id) return false;
  const str = String(id).trim();
  return (
    /^\d+$/.test(str) ||
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
  );
}

/**
 * Uploads an array of image Files to Supabase Storage ('listing-images' bucket)
 * 1. Hardware-accelerated WebP compression via imageCompressor.js (<100KB per image)
 * 2. Uploads compressed blobs to Supabase Storage
 * 3. Returns clean public CDN URLs (or local blob URLs if Supabase is offline)
 */
export async function uploadListingImagesToStorage(files = [], options = {}) {
  if (!files || files.length === 0) return [];

  // Separate already-uploaded string URLs from raw File objects
  const existingUrls = files.filter((f) => typeof f === 'string');
  const rawFiles = files.filter((f) => f && typeof f !== 'string');

  if (rawFiles.length === 0) return existingUrls;

  try {
    // ⚡ 1. Batch compress images with concurrency control
    const compressedFiles = await compressMultipleImages(
      rawFiles,
      {
        maxWidth: options.maxWidth || 1200,
        maxHeight: options.maxHeight || 1200,
        quality: options.quality || 0.75,
      },
      options.onProgress
    );

    // If Supabase client is not configured, fall back to local preview URLs
    if (!supabase) {
      const localUrls = compressedFiles.map((file) => URL.createObjectURL(file));
      return [...existingUrls, ...localUrls];
    }

    // 🌐 2. Upload compressed files to Supabase Storage
    const uploadPromises = compressedFiles.map(async (file, idx) => {
      try {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${idx}.webp`;
        const filePath = `listings/${fileName}`;

        const { error } = await supabase.storage
          .from('listing-images')
          .upload(filePath, file, {
            contentType: 'image/webp',
            upsert: true,
          });

        if (error) {
          console.warn('Supabase storage upload notice:', error.message);
          return URL.createObjectURL(file);
        }

        const { data: publicUrlData } = supabase.storage
          .from('listing-images')
          .getPublicUrl(filePath);

        return publicUrlData?.publicUrl || URL.createObjectURL(file);
      } catch (err) {
        console.warn('Image upload catch notice:', err);
        return URL.createObjectURL(file);
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return [...existingUrls, ...uploadedUrls.filter(Boolean)];
  } catch (error) {
    console.error('Error in multi-image pipeline:', error);
    return [...existingUrls, ...rawFiles.map((f) => URL.createObjectURL(f))];
  }
}

/**
 * Inserts listing directly into Supabase PostgreSQL 'listings' table
 */
export async function createListingInDB(listingData) {
  const catConfig = getCategoryById(listingData.category) || {};
  const bucketKey =
    listingData.bucketKey ||
    listingData.bucket_key ||
    catConfig.bucketKey ||
    'listings';

  const imageUrlsArray =
    Array.isArray(listingData.images) && listingData.images.length > 0
      ? listingData.images
      : Array.isArray(listingData.image_urls) && listingData.image_urls.length > 0
      ? listingData.image_urls
      : listingData.image
      ? [listingData.image]
      : [];

  const primaryCover = imageUrlsArray[0] || listingData.image || null;

  const dbPayload = {
    title: listingData.title || listingData.name,
    description: listingData.description || '',
    category: listingData.category,
    sub_category: listingData.subCategory || listingData.sub_category,
    bucket_key: bucketKey,
    price: listingData.price || listingData.rates || 'Contact for Price',
    seller_name: listingData.sellerName || listingData.seller_name || 'Verified Member',
    phone: listingData.phone || '',
    whatsapp: listingData.whatsapp || listingData.phone || '',
    location_name: listingData.location || listingData.location_name || 'Alwar',
    lat: listingData.lat !== undefined && listingData.lat !== null ? Number(listingData.lat) : null,
    lng: listingData.lng !== undefined && listingData.lng !== null ? Number(listingData.lng) : null,
    image_url: primaryCover,
    image_urls: imageUrlsArray,
    interest_count: Number(listingData.interestCount || listingData.interest_count || 0),
    is_active: true,
    created_at: new Date().toISOString(),
  };

  if (!supabase) {
    return { data: dbPayload, error: null };
  }

  try {
    const { data, error } = await supabase
      .from('listings')
      .insert([dbPayload])
      .select()
      .single();

    if (error) {
      console.error('Supabase DB Insert Error:', error.message);
      return { data: dbPayload, error };
    }

    return { data, error: null };
  } catch (err) {
    console.error('Network error during Supabase insert:', err);
    return { data: dbPayload, error: err };
  }
}

/**
 * Universal Listing Publisher
 * Persists to Supabase DB and updates the local in-memory store slice immediately
 */
export async function publishHyperlocalListing(category, payload) {
  const finalCategory = (category || payload.category || 'property').toLowerCase();

  const imageUrls =
    Array.isArray(payload.images) && payload.images.length > 0
      ? payload.images
      : Array.isArray(payload.image_urls) && payload.image_urls.length > 0
      ? payload.image_urls
      : payload.image
      ? [payload.image]
      : [getCategoryFallback(finalCategory)];

  const formattedItem = {
    id: payload.id || `item_${Date.now()}`,
    ...payload,
    category: finalCategory,
    image: imageUrls[0],
    images: imageUrls,
    image_urls: imageUrls,
    interestCount: Number(payload.interestCount || payload.interest_count || 0),
    interest_count: Number(payload.interestCount || payload.interest_count || 0),
    status: 'ACTIVE',
    createdAt: 'Just now',
  };

  // 1. Sync to Supabase Database
  await createListingInDB(formattedItem);

  // 2. Sync to local state store slice
  const sliceMap = {
    property: 'propertyListings',
    advertising: 'advertisingProviders',
    community: 'communityDrives',
    construction: 'constructionListings',
    creators: 'creatorsListings',
    education: 'educationListings',
    fitness: 'fitnessListings',
    malls: 'mallsStores',
    market: 'marketProducts',
    medical: 'medicalListings',
    restaurants: 'restaurantsList',
    shaadi: 'shaadiVendors',
    'white-collar': 'whiteCollarListings',
    recommerce: 'reCommerceListings',
    transport: 'transportFirms',
  };

  const targetSlice = sliceMap[finalCategory] || 'propertyListings';
  if (hyperlocalStore && typeof hyperlocalStore.addListing === 'function') {
    hyperlocalStore.addListing(targetSlice, formattedItem);
  }

  return formattedItem;
}

export async function saveCommentToDB(listingId, comment, listingTitle = '') {
  if (!supabase || !listingId) return null;
  try {
    const { data, error } = await supabase
      .from('listing_threads')
      .insert([
        {
          listing_id: String(listingId),
          user_name: comment.userName || 'Local Buyer',
          user_area: comment.userArea || 'Nearby',
          comment_text: comment.text,
          is_public: comment.isPublic !== undefined ? comment.isPublic : true,
          listing_title: listingTitle || 'Listing',
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) console.warn('Save comment notice:', error.message);
    return data;
  } catch (err) {
    console.warn('Network notice saving comment:', err);
    return null;
  }
}

export async function saveReplyToDB(commentId, replyText) {
  if (!supabase || !commentId || String(commentId).startsWith('local-')) return null;
  try {
    const { data, error } = await supabase
      .from('listing_threads')
      .update({ seller_reply: replyText })
      .eq('id', commentId)
      .select()
      .single();

    if (error) console.warn('Save reply notice:', error.message);
    return data;
  } catch (err) {
    console.warn('Network notice saving reply:', err);
    return null;
  }
}

export async function updateInterestCountInDB(listingId, newCount) {
  if (!supabase || !listingId || !isValidDatabaseId(listingId)) return;
  try {
    const { error } = await supabase
      .from('listings')
      .update({ interest_count: Number(newCount) })
      .eq('id', listingId);

    if (error) console.warn('Update interest notice:', error.message);
  } catch (err) {
    console.warn('Network notice updating interest:', err);
  }
}

export function getCategoryFallback(catId) {
  const fallbacks = {
    property: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700',
    transporters: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700',
    transport: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700',
    vehicles: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700',
    electronics: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700',
    fashion: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=700',
    furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700',
    kaarigar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700',
    medical: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700',
    restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700',
    advertising: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700',
    community: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=700',
    construction: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=700',
    creators: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=700',
    education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700',
    fitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700',
    malls: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700',
    market: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700',
    shaadi: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700',
    'white-collar': 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=700',
    recommerce: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=700',
  };
  return fallbacks[catId] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
}