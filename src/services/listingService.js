import { supabase } from './supabaseClient';
import { compressImage } from '../utils/imageCompressor';

const BUCKET_NAME = 'listing-images';

const CATEGORY_FALLBACKS = {
  property: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700',
  transporters: 'https://images.unsplash.com/photo-1586191582152-bfd77b8f972b?w=700',
  kaarigar: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700',
  'white-collar': 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=700',
  restaurants: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=700',
  malls: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700',
  market: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=700',
  education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700',
  construction: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=700',
  shaadi: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=700',
  advertising: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=700',
  community: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=700',
  recommerce: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=700',
};

export function getCategoryFallback(category = 'property') {
  return CATEGORY_FALLBACKS[category.toLowerCase()] || CATEGORY_FALLBACKS.property;
}

/**
 * 1. Upload Multiple Images Concurrently
 */
export async function uploadMultipleListingImages(files, primaryIndex = 0, category = 'property') {
  const defaultFallback = getCategoryFallback(category);

  if (!files || files.length === 0) {
    return { coverUrl: defaultFallback, allUrls: [defaultFallback] };
  }

  try {
    const uploadPromises = Array.from(files).map(async (file, idx) => {
      try {
        const compressedBlob = await compressImage(file, {
          maxWidth: 1200,
          quality: 0.8,
          format: 'image/webp',
        });

        const isWebP = compressedBlob.type === 'image/webp';
        const fileExt = isWebP ? 'webp' : (file.name ? file.name.split('.').pop() : 'jpg');
        // Clean single-level file path
        const fileName = `${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(fileName, compressedBlob, {
            contentType: compressedBlob.type || 'image/webp',
            upsert: true,
          });

        if (uploadError) {
          console.error(`Supabase Storage upload error on file ${idx}:`, uploadError);
          return null;
        }

        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(fileName);

        return urlData?.publicUrl || null;
      } catch (err) {
        console.error(`Upload error on file ${idx}:`, err);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter(Boolean);

    if (validUrls.length === 0) {
      return { coverUrl: defaultFallback, allUrls: [defaultFallback] };
    }

    const selectedCover = validUrls[primaryIndex] || validUrls[0] || defaultFallback;
    return {
      coverUrl: selectedCover,
      allUrls: validUrls,
    };
  } catch (err) {
    console.error('Multi-image upload pipeline failed:', err);
    return { coverUrl: defaultFallback, allUrls: [defaultFallback] };
  }
}

export async function uploadListingImage(file, category = 'property') {
  const res = await uploadMultipleListingImages([file], 0, category);
  return res.coverUrl;
}

/**
 * 2. Save Listing to PostgreSQL
 */
export async function insertListingToDB(listingPayload) {
  const fallback = getCategoryFallback(listingPayload.category);
  const primaryImg = listingPayload.image || fallback;
  const galleryImgs = Array.isArray(listingPayload.images) && listingPayload.images.length > 0
    ? listingPayload.images
    : [primaryImg];

  const { data, error } = await supabase
    .from('listings')
    .insert([
      {
        bucket_key: listingPayload.bucketKey || 'listings',
        category: (listingPayload.category || 'property').toLowerCase(),
        sub_category: (listingPayload.subCategory || 'all').toLowerCase(),
        title: listingPayload.title || listingPayload.name || 'Untitled Listing',
        description: listingPayload.description || '',
        price: listingPayload.price || 'Contact for Price',
        seller_name: listingPayload.sellerName || 'Verified Member',
        phone: listingPayload.phone || '9876543210',
        whatsapp: listingPayload.whatsapp || listingPayload.phone || '9876543210',
        location_name: listingPayload.location || 'Alwar',
        image_url: primaryImg,
        image_urls: galleryImgs,
        condition: listingPayload.condition || 'Good',
        interest_count: 0,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Supabase DB Insert Error:', error);
    throw error;
  }
  return data;
}

/**
 * 3. Discussion Threads DB Operations
 */
export async function insertThreadCommentToDB({ listingId, userName, userArea, text, isPublic = true }) {
  const { data, error } = await supabase
    .from('listing_threads')
    .insert([
      {
        listing_id: String(listingId),
        user_name: userName || 'Local Resident',
        user_area: userArea || 'Alwar',
        comment_text: text,
        is_public: isPublic,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertSellerReplyToDB({ threadId, replyText }) {
  const { data, error } = await supabase
    .from('listing_threads')
    .update({ seller_reply: replyText, updated_at: new Date().toISOString() })
    .eq('id', threadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}