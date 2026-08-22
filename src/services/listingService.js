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
 * 1. Upload Photos to Supabase Storage ('listing-images' bucket)
 */
export async function uploadListingImagesToStorage(files = [], options = {}) {
  if (!files || files.length === 0) return [];

  const existingUrls = files.filter((f) => typeof f === 'string');
  const rawFiles = files.filter((f) => f && typeof f !== 'string');

  if (rawFiles.length === 0) return existingUrls;

  try {
    const compressedFiles = await compressMultipleImages(
      rawFiles,
      {
        maxWidth: options.maxWidth || 1200,
        maxHeight: options.maxHeight || 1200,
        quality: options.quality || 0.75,
      },
      options.onProgress
    );

    if (!supabase) {
      const localUrls = compressedFiles.map((file) => URL.createObjectURL(file));
      return [...existingUrls, ...localUrls];
    }

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
 * 2. Upload Videos to Supabase Storage ('listing-images' bucket under /videos/)
 */
export async function uploadListingVideosToStorage(videoItems = []) {
  if (!videoItems || videoItems.length === 0) return [];
  const uploadedVideos = [];

  for (let i = 0; i < videoItems.length; i++) {
    const item = videoItems[i];
    const file = item.file || (item instanceof File ? item : null);

    // If item is already a public URL or plain object without a raw file
    if (!file) {
      if (typeof item === 'string') {
        uploadedVideos.push({ url: item, duration: '0:30', durationSec: 30 });
      } else if (item.url) {
        uploadedVideos.push(item);
      }
      continue;
    }

    if (!supabase) {
      uploadedVideos.push({
        url: item.previewUrl || URL.createObjectURL(file),
        poster: item.posterUrl || '',
        duration: item.durationStr || '0:30',
        durationSec: item.durationSec || 30,
        sizeMb: item.sizeMb || (file.size / (1024 * 1024)).toFixed(1),
      });
      continue;
    }

    try {
      const fileExt = file.name ? file.name.split('.').pop() : 'webm';
      const fileName = `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${i}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, file, {
          contentType: file.type || 'video/webm',
          cacheControl: '31536000',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase video upload notice:', uploadError.message);
        uploadedVideos.push({
          url: item.previewUrl || URL.createObjectURL(file),
          poster: item.posterUrl || '',
          duration: item.durationStr || '0:30',
          durationSec: item.durationSec || 30,
          sizeMb: item.sizeMb || '5.0',
        });
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      const publicVideoUrl = publicUrlData?.publicUrl || item.previewUrl || URL.createObjectURL(file);

      uploadedVideos.push({
        url: publicVideoUrl,
        poster: item.posterUrl || '',
        duration: item.durationStr || '0:30',
        durationSec: item.durationSec || 30,
        sizeMb: item.sizeMb || (file.size / (1024 * 1024)).toFixed(1),
      });
    } catch (err) {
      console.warn('Video upload catch notice:', err);
      uploadedVideos.push({
        url: item.previewUrl || URL.createObjectURL(file),
        poster: item.posterUrl || '',
        duration: item.durationStr || '0:30',
      });
    }
  }

  return uploadedVideos;
}

/**
 * 3. Inserts listing directly into Supabase PostgreSQL 'listings' table
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

  // 🌟 Clean extraction of video objects and string URLs
  const videoObjects = Array.isArray(listingData.videos) ? listingData.videos : [];
  const videoUrlsArray =
    Array.isArray(listingData.video_urls) && listingData.video_urls.length > 0
      ? listingData.video_urls
      : videoObjects
          .map((v) => (typeof v === 'string' ? v : v?.url))
          .filter(Boolean);

  const dbPayload = {
    title: listingData.title || listingData.name,
    description: listingData.description || '',
    category: listingData.category,
    sub_category: listingData.subCategory || listingData.sub_category || 'all',
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
    video_urls: videoUrlsArray,
    videos: videoObjects,
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
 * 4. Fetch Live Listings with Video & PostGIS Hydration
 */
export async function fetchLiveListingsFromSupabase(selectedCity = 'Alwar') {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((row) => {
      const rowImages =
        row.image_urls && row.image_urls.length > 0
          ? row.image_urls
          : row.image_url
          ? [row.image_url]
          : [getCategoryFallback(row.category)];

      const rowVideos = Array.isArray(row.videos) ? row.videos : [];
      const rowVideoUrls = Array.isArray(row.video_urls) ? row.video_urls : [];

      return {
        id: row.id,
        category: row.category,
        subCategory: row.sub_category,
        bucketKey: row.bucket_key,
        title: row.title,
        name: row.title,
        description: row.description,
        price: row.price,
        rates: row.price,
        sellerName: row.seller_name,
        phone: row.phone,
        whatsapp: row.whatsapp,
        location: row.location_name,
        city: selectedCity,
        lat: row.lat,
        lng: row.lng,
        image: rowImages[0],
        images: rowImages,
        image_urls: rowImages,
        videos: rowVideos,
        video_urls: rowVideoUrls.length > 0 ? rowVideoUrls : rowVideos.map((v) => v.url).filter(Boolean),
        interestCount: row.interest_count || 0,
        interest_count: row.interest_count || 0,
        createdAt: row.created_at,
      };
    });
  } catch (err) {
    console.warn('Supabase fetch error, using local offline store:', err);
    return null;
  }
}

/**
 * 5. Universal Listing Publisher
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

  const videoObjects = Array.isArray(payload.videos) ? payload.videos : [];
  const videoUrls =
    Array.isArray(payload.video_urls) && payload.video_urls.length > 0
      ? payload.video_urls
      : videoObjects.map((v) => (typeof v === 'string' ? v : v.url)).filter(Boolean);

  const formattedItem = {
    id: payload.id || `item_${Date.now()}`,
    ...payload,
    category: finalCategory,
    image: imageUrls[0],
    images: imageUrls,
    image_urls: imageUrls,
    videos: videoObjects,
    video_urls: videoUrls,
    interestCount: Number(payload.interestCount || payload.interest_count || 0),
    interest_count: Number(payload.interestCount || payload.interest_count || 0),
    status: 'ACTIVE',
    createdAt: 'Just now',
  };

  await createListingInDB(formattedItem);

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
    transporters: 'transportFirms',
    vehicles: 'vehiclesListings',
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
    construction: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700',
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