import { supabase } from './supabaseClient';

const LOCAL_USER_KEY = 'townhub_user_profile';

/**
 * Retrieves the currently cached local profile or session
 */
export function getCurrentUserProfile() {
  try {
    const saved = localStorage.getItem(LOCAL_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

/**
 * Saves profile data to local storage
 */
export function setLocalUserProfile(profile) {
  if (!profile) {
    localStorage.removeItem(LOCAL_USER_KEY);
  } else {
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
  }
}

/**
 * 1. Sends 6-Digit OTP to Phone via Supabase Auth
 */
export async function sendPhoneOTP(phone) {
  const cleanPhone = String(phone).replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12 
    ? `+${cleanPhone}` 
    : `+91${cleanPhone.slice(-10)}`;

  if (!supabase) {
    // Mock sandbox mode if Supabase credentials are missing
    return { success: true, sandbox: true };
  }

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('OTP Send error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Verifies OTP & Fetches or Creates User Profile
 */
export async function verifyPhoneOTP(phone, token, extraData = {}) {
  const cleanPhone = String(phone).replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('91') && cleanPhone.length === 12 
    ? `+${cleanPhone}` 
    : `+91${cleanPhone.slice(-10)}`;

  if (!supabase) {
    // Sandbox fallback profile
    const fallbackProfile = {
      id: `local_user_${Date.now()}`,
      phone: cleanPhone.slice(-10),
      full_name: extraData.fullName || 'Verified Resident',
      area_name: extraData.areaName || 'Alwar City',
      city: extraData.city || 'Alwar',
      trust_score: 100,
      verification_tier: 'resident',
      is_banned: false,
    };
    setLocalUserProfile(fallbackProfile);
    return { success: true, profile: fallbackProfile };
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token: token.trim(),
      type: 'sms',
    });

    if (authError) throw authError;

    const user = authData.user;
    if (!user) throw new Error('User authentication failed.');

    // Fetch existing public profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    let profile = existingProfile;

    // Create profile if first time
    if (!profile) {
      const newProfilePayload = {
        id: user.id,
        phone: cleanPhone.slice(-10),
        full_name: extraData.fullName || 'Verified Member',
        area_name: extraData.areaName || 'Town Center',
        city: extraData.city || 'Alwar',
        trust_score: 100,
        verification_tier: 'resident',
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('user_profiles')
        .insert([newProfilePayload])
        .select()
        .single();

      if (!createError && createdProfile) {
        profile = createdProfile;
      } else {
        profile = newProfilePayload;
      }
    }

    setLocalUserProfile(profile);
    return { success: true, profile };
  } catch (err) {
    console.error('OTP Verify error:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 3. Logs out user and clears cache
 */
export async function logoutUser() {
  setLocalUserProfile(null);
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * 4. Submit Community Spam Report
 */
export async function submitListingReport({ listingId, reporterPhone, reason }) {
  if (!supabase || !listingId) return { success: true };

  try {
    const { data, error } = await supabase
      .from('listing_reports')
      .insert([
        {
          listing_id: listingId,
          reporter_phone: reporterPhone.slice(-10),
          reason: reason || 'Spam / Inappropriate Content',
        },
      ]);

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: 'You have already reported this listing.' };
      }
      throw error;
    }

    return { success: true, data };
  } catch (err) {
    console.warn('Report submit error:', err.message);
    return { success: false, error: err.message };
  }
}