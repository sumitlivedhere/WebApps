import { supabase } from './supabaseClient';
import { compressImage } from '../utils/imageCompressor';

/**
 * 1. Compress & Upload Multiple Images Concurrently
 */
export async function uploadMultipleListingImages(files, primaryIndex = 0) {
  if (!files || files.length === 0) return { coverUrl: null, allUrls: [] };

  try {
    const uploadPromises = Array.from(files).map(async (file, idx) => {
      // Compress client-side
      const compressedBlob = await compressImage(file, { maxWidth: 1080, quality: 0.78, format: 'image/webp' });
      const fileName = `${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}.webp`;
      const filePath = `listings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, compressedBlob, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload error on photo ${idx}:`, uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('listing-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    });

    const results = await Promise.all(uploadPromises);
    const validUrls = results.filter(Boolean);

    return {
      coverUrl: validUrls[primaryIndex] || validUrls[0] || null,
      allUrls: validUrls,
    };
  } catch (err) {
    console.error('Multi-image upload pipeline failed:', err);
    return { coverUrl: null, allUrls: [] };
  }
}

/**
 * 2. Fetch Listings by Bucket and Category (O(1) Indexed)
 */
export async function fetchListingsFromDB(bucketKey, subCategory = 'all') {
  try {
    let query = supabase
      .from('listings')
      .select('*')
      .eq('bucket_key', bucketKey)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (subCategory && subCategory !== 'all') {
      query = query.or(`category.eq.${subCategory},sub_category.eq.${subCategory}`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching listings:', err);
    return [];
  }
}

/**
 * 3. Create a New Listing in PostgreSQL
 */
export async function insertListingToDB(listingPayload) {
  const { data, error } = await supabase
    .from('listings')
    .insert([
      {
        bucket_key: listingPayload.bucketKey || 'listings',
        category: listingPayload.category || 'general',
        sub_category: listingPayload.subCategory || 'all',
        title: listingPayload.title || listingPayload.name,
        description: listingPayload.description || listingPayload.desc || '',
        price: listingPayload.price || listingPayload.rates || listingPayload.fee || 'Contact for Price',
        seller_name: listingPayload.sellerName || 'Verified Member',
        phone: listingPayload.phone,
        whatsapp: listingPayload.whatsapp || listingPayload.phone,
        location_name: listingPayload.location || 'Alwar',
        image_url: listingPayload.image, // Primary cover photo
        image_urls: listingPayload.images || (listingPayload.image ? [listingPayload.image] : []), // All gallery photos
        condition: listingPayload.condition || null,
        interest_count: 0,
        is_active: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 4. Post Q&A / Deal Discussion Question
 */
export async function postQuestionToDB(listingId, { userName, userArea, text }) {
  const { data, error } = await supabase
    .from('listing_threads')
    .insert([
      {
        listing_id: listingId,
        user_name: userName,
        user_area: userArea,
        comment_text: text,
        is_public: true,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 5. Post Author/Seller Reply
 */
export async function postSellerReplyToDB(threadId, replyText) {
  const { data, error } = await supabase
    .from('listing_threads')
    .update({
      seller_reply: replyText,
      seller_replied_at: new Date().toISOString(),
    })
    .eq('id', threadId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * 6. Increment Interest Counter
 */
export async function incrementInterestInDB(listingId) {
  const { data, error } = await supabase.rpc('increment_interest', { row_id: listingId });
  if (error) {
    // Fallback direct update if RPC is not configured
    const { data: current } = await supabase
      .from('listings')
      .select('interest_count')
      .eq('id', listingId)
      .single();
    if (current) {
      await supabase
        .from('listings')
        .update({ interest_count: (current.interest_count || 0) + 1 })
        .eq('id', listingId);
    }
  }
  return data;
}