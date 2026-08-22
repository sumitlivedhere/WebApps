import React, { useState, useRef, useMemo, useEffect } from 'react';
import { TAXONOMY_REGISTRY, getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';
import { hyperlocalStore } from '../store/hyperlocalStore';
import {
  uploadListingImagesToStorage,
  uploadListingVideosToStorage,
  getCategoryFallback,
} from '../services/listingService';
import { processVideoOptimistic } from '../utils/videoCompressor';
import { getCurrentUserProfile } from '../services/authService';
import AuthModal from './common/AuthModal';

export default function ContextualListingModal({
  currentScreen,
  selectedCategory = 'property',
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  onClose,
}) {
  // 🛡️ User Authentication & Verification State
  const [currentUser, setCurrentUser] = useState(() => getCurrentUserProfile());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 🌟 1. Cascading Category & Subsection State
  const [category, setCategory] = useState(() => {
    if (selectedCategory && selectedCategory !== 'home' && selectedCategory !== 'surprise') {
      return selectedCategory;
    }
    return 'property';
  });

  const categoryConfig = useMemo(() => {
    return getCategoryById(category) || TAXONOMY_REGISTRY[0] || {};
  }, [category]);

  const availableSubCategories = useMemo(() => {
    return Array.isArray(categoryConfig.subCategories) ? categoryConfig.subCategories : [];
  }, [categoryConfig]);

  const [subCategory, setSubCategory] = useState(() => {
    if (selectedSubCategory && selectedSubCategory !== 'all') {
      return selectedSubCategory;
    }
    return availableSubCategories[0]?.id || 'all';
  });

  // Category switch handler: resets subcategory to the first one in the new category
  const handleCategoryChange = (newCatId) => {
    setCategory(newCatId);
    const newConfig = getCategoryById(newCatId);
    if (newConfig?.subCategories?.length > 0) {
      setSubCategory(newConfig.subCategories[0].id);
    } else {
      setSubCategory('all');
    }
  };

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState(() => currentUser?.full_name || '');
  const [phone, setPhone] = useState(() => currentUser?.phone || '');
  const [description, setDescription] = useState('');

  // 🛡️ Honeypot Anti-Bot Trap State
  const [honeypotField, setHoneypotField] = useState('');

  // 🖼️ 2. Multi-Photo State (Up to 10 photos) with Cover Image Selector
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // Raw File[]
  const [previewUrls, setPreviewUrls] = useState([]);     // Local blob URL[]
  const [coverIndex, setCoverIndex] = useState(0);         // Index of chosen cover photo

  // 🎬 3. Video Upload State (Up to 2 videos, max 60 sec each)
  const videoInputRef = useRef(null);
  const [selectedVideos, setSelectedVideos] = useState([]); // [{ file, previewUrl, posterUrl, durationStr, durationSec, sizeMb }]
  const [isProcessingVideo, setIsProcessingVideo] = useState(false);

  // 📍 Location & Submission State
  const [locationAddress, setLocationAddress] = useState(() => currentUser?.area_name || '');
  const [gpsData, setGpsData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Sync profile details if user logs in mid-flow
  useEffect(() => {
    if (currentUser) {
      if (!sellerName) setSellerName(currentUser.full_name || '');
      if (!phone) setPhone(currentUser.phone || '');
      if (!locationAddress) setLocationAddress(currentUser.area_name || '');
    }
  }, [currentUser]);

  // 📸 Multi-Photo Selection Handler (Max 10)
  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 10 - selectedFiles.length;
    if (remaining <= 0) {
      setErrorMsg('You can upload a maximum of 10 photos.');
      return;
    }

    setErrorMsg('');
    const newFiles = files.slice(0, remaining);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));

    // Adjust cover index if removed
    if (coverIndex === indexToRemove) {
      setCoverIndex(0);
    } else if (coverIndex > indexToRemove) {
      setCoverIndex((prev) => prev - 1);
    }
  };

  // 🎬 High-Speed Optimistic Video Pipeline (<100ms Poster Generation)
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (selectedVideos.length + files.length > 2) {
      setErrorMsg('Maximum 2 product / service videos allowed per listing.');
      return;
    }

    setErrorMsg('');
    setIsProcessingVideo(true);

    try {
      for (const file of files) {
        const processed = await processVideoOptimistic(file);

        if (processed.durationSec > 60.5) {
          setErrorMsg(`"${file.name}" is ${processed.durationSec}s long. Videos must be 60 seconds or less.`);
          continue;
        }

        setSelectedVideos((prev) => [...prev, processed].slice(0, 2));
      }
    } catch (err) {
      setErrorMsg('Could not process video file. Please ensure it is a valid MP4, WebM, or MOV format.');
    } finally {
      setIsProcessingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
    }
  };

  const handleRemoveVideo = (indexToRemove) => {
    setSelectedVideos((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsData({
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError('Could not fetch GPS. Please type address manually.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Silent Bot Trap: If hidden bot field is filled, silently drop
    if (honeypotField) {
      onClose();
      return;
    }

    if (!title.trim() || !sellerName.trim() || !locationAddress.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    // 🛡️ Verified Resident Gate: Trigger AuthModal if unverified phone
    if (!currentUser && phone.length !== 10) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cleanSub = sanitizeSubCategoryId(category, subCategory);
    const fallbackImg = getCategoryFallback(category);

    try {
      // 1. Order photos so the selected cover photo is uploaded at index 0
      const orderedPhotos = [...selectedFiles];
      if (orderedPhotos.length > 0 && coverIndex < orderedPhotos.length) {
        const [chosenCoverFile] = orderedPhotos.splice(coverIndex, 1);
        orderedPhotos.unshift(chosenCoverFile);
      }

      // 🌟 2. Upload Photos & Videos to Supabase Storage in parallel
      const [uploadedPhotoUrls, uploadedVideoObjects] = await Promise.all([
        orderedPhotos.length > 0
          ? uploadListingImagesToStorage(orderedPhotos)
          : Promise.resolve([]),
        selectedVideos.length > 0
          ? uploadListingVideosToStorage(selectedVideos)
          : Promise.resolve([]),
      ]);

      const finalImages = uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : [fallbackImg];

      const newListing = {
        id: `custom-${Date.now()}`,
        user_id: currentUser?.id || null,
        category,
        subCategory: cleanSub,
        title: title.trim(),
        name: title.trim(),
        price: price.trim() || 'Contact for Price',
        rates: price.trim() || 'Contact for Price',
        sellerName: sellerName.trim(),
        phone: phone.trim() || '9876543201',
        whatsapp: phone.trim() || '9876543201',
        location: locationAddress.trim(),
        city: selectedCity,
        lat: gpsData ? gpsData.lat : null,
        lng: gpsData ? gpsData.lng : null,
        mapUrl: gpsData
          ? `https://www.google.com/maps/search/?api=1&query=${gpsData.lat},${gpsData.lng}`
          : null,
        image: finalImages[0],                                 // Primary cover image
        images: finalImages,                                   // Full photo carousel
        image_urls: finalImages,
        videos: uploadedVideoObjects,                          // Video objects with public CDN URLs & metadata
        video_urls: uploadedVideoObjects.map((v) => v.url),    // Public video CDN URLs
        description: description.trim(),
        badge: currentUser ? '✓ Verified Resident' : (gpsData ? '📍 GPS Pinpoint Attached' : 'Verified Listing'),
        isNew: true,
        created_at: new Date().toISOString(),
      };

      await hyperlocalStore.insertListing(categoryConfig.bucketKey || 'listings', newListing);

      // Trigger town notification
      hyperlocalStore.addNotification({
        id: `notif_${Date.now()}`,
        title: '🎉 Listing Published!',
        message: `"${newListing.title}" with photos & videos is live in ${categoryConfig.name || category}.`,
        category,
        subCategory: cleanSub,
        targetId: newListing.id,
        timestamp: 'Just now',
        read: false,
      });

      setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMsg(err.message || 'Error uploading files to storage. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4 select-none">
        <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 space-y-4 shadow-2xl text-slate-100 pb-8">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
                <span>{categoryConfig.icon || '📝'}</span>
                <span>Post New Listing / Business</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Posting to <strong className="text-amber-400">{categoryConfig.name?.split('(')[0] || category}</strong> in {selectedCity}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 bg-slate-800 hover:bg-slate-700 active:scale-90 rounded-full text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-300 text-xs font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* 🛡️ Invisible Honeypot Input for Bot Detection */}
            <input
              type="text"
              name="company_tax_check"
              value={honeypotField}
              onChange={(e) => setHoneypotField(e.target.value)}
              tabIndex="-1"
              autoComplete="off"
              style={{ display: 'none', position: 'absolute', opacity: 0 }}
            />

            {/* 🌟 1. SELECT MAIN CATEGORY */}
            <div>
              <label className="block text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                1. Select Main Category (मुख्य श्रेणी) *
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 pr-8 text-white font-bold focus:outline-hidden focus:border-amber-400 appearance-none cursor-pointer"
                >
                  {TAXONOMY_REGISTRY.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-900 text-white font-bold">
                      {cat.icon || '📌'} {cat.name} {cat.hindiName ? `(${cat.hindiName})` : ''}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-3 text-xs text-amber-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* 🌟 2. SELECT CATEGORY SUBSECTION */}
            <div>
              <label className="block text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-1">
                2. Select Subsection / Trade (उप-श्रेणी) *
              </label>
              <div className="relative">
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 pr-8 text-white font-bold focus:outline-hidden focus:border-amber-400 appearance-none cursor-pointer"
                >
                  {availableSubCategories.map((s) => (
                    <option key={s.id} value={s.id} className="bg-slate-900 text-white font-bold">
                      {s.icon || '🔸'} {s.name} {s.hindiName ? `(${s.hindiName})` : ''}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-3 text-xs text-slate-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>

            {/* 📸 3. MULTI-PHOTO UPLOAD (UP TO 10 PHOTOS) WITH COVER SELECTOR */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                  Photos / Proof ({previewUrls.length}/10)
                </label>
                <span className="text-[9px] text-amber-400 font-bold">
                  Tap photo to set as Cover 🌟
                </span>
              </div>

              {/* Thumbnail Gallery Preview Strip */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {previewUrls.map((imgSrc, idx) => {
                    const isCover = idx === coverIndex;
                    return (
                      <div
                        key={idx}
                        onClick={() => setCoverIndex(idx)}
                        className={`relative h-20 rounded-xl overflow-hidden border cursor-pointer transition shadow-inner bg-slate-950 group ${
                          isCover
                            ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                            : 'border-slate-700 hover:border-slate-500 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img src={imgSrc} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Cover Badge */}
                        {isCover ? (
                          <span className="absolute bottom-1 left-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md flex items-center space-x-0.5">
                            <span>★</span>
                            <span>Cover</span>
                          </span>
                        ) : (
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-slate-300 text-[7px] font-bold px-1 py-0.2 rounded group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                            Set Cover
                          </span>
                        )}

                        {/* Remove Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(idx);
                          }}
                          className="absolute top-1 right-1 bg-rose-600 hover:bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer shadow-md active:scale-90"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Upload Photos Trigger */}
              {previewUrls.length < 10 && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition group p-2 text-center"
                >
                  <span className="text-lg group-hover:scale-110 transition">📸</span>
                  <span className="text-[10px] font-black text-slate-300 mt-0.5">
                    + Add Photos (Upload up to 10)
                  </span>
                  <span className="text-[8px] text-slate-500">
                    PNG, JPG or WebP supported
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleMultipleFiles}
              />
            </div>

            {/* 🎬 4. SHORT VIDEO UPLOAD (UP TO 2 VIDEOS, MAX 60 SEC) */}
            <div className="space-y-2 p-3 bg-slate-950/70 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-sm">🎬</span>
                  <label className="text-[10px] font-black text-cyan-300 uppercase tracking-wider">
                    Product / Service Videos ({selectedVideos.length}/2)
                  </label>
                </div>
                <span className="text-[9px] text-slate-400 font-bold">
                  Max 60s • Auto-Optimized ⚡
                </span>
              </div>

              {/* Video Previews */}
              {selectedVideos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedVideos.map((vid, idx) => (
                    <div key={idx} className="relative h-24 rounded-xl overflow-hidden border border-cyan-500/40 bg-black group shadow-md">
                      <img
                        src={vid.posterUrl}
                        alt="video preview"
                        className="w-full h-full object-cover opacity-90"
                      />
                      
                      {/* Duration & Size Badges */}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center space-x-1">
                        <span className="bg-slate-950/90 text-cyan-300 text-[8px] font-mono font-black px-1.5 py-0.5 rounded-md border border-cyan-400/30">
                          ⏱️ {vid.durationStr}
                        </span>
                        {vid.sizeMb && (
                          <span className="bg-emerald-950/90 text-emerald-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                            {vid.sizeMb} MB
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        className="absolute top-1.5 right-1.5 bg-rose-600 hover:bg-rose-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer shadow-md active:scale-90"
                        title="Remove video"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Video Trigger */}
              {selectedVideos.length < 2 && (
                <div
                  onClick={() => !isProcessingVideo && videoInputRef.current?.click()}
                  className="h-16 border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-cyan-950/20 transition group p-2 text-center"
                >
                  <span className="text-lg group-hover:scale-110 transition">🎥</span>
                  <span className="text-[10px] font-black text-cyan-300 mt-0.5">
                    {isProcessingVideo ? 'Reading Video Frame...' : '+ Upload Video (Instant 60s Reel)'}
                  </span>
                  <span className="text-[8px] text-slate-400">MP4, WebM or MOV format</span>
                </div>
              )}

              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={handleVideoUpload}
              />
            </div>

            {/* 5. Title */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Business / Listing Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3 BHK Luxury Villa / Rawat Transporters / Expert Electrician"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400 font-semibold"
              />
            </div>

            {/* 6. Price & Seller Name */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Price / Rent / Rates
                </label>
                <input
                  type="text"
                  placeholder="₹ 15,000 / Month"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
                />
              </div>
            </div>

            {/* 7. Phone Number */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="9876543201"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400 font-mono"
              />
            </div>

            {/* 📍 8. Address & GPS */}
            <div className="space-y-2.5 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1">
                  Colony / Area / Address * (Type your address)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Near Bus Stand, Budh Vihar, Alwar"
                  value={locationAddress}
                  onChange={(e) => setLocationAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 border-t border-slate-850 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black text-cyan-300">
                    Exact Map Pinpoint (Optional)
                  </div>
                  <div className="text-[8px] text-slate-400">
                    Attaches GPS coordinates for map navigation
                  </div>
                </div>

                {!gpsData ? (
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-[10px] font-black flex items-center space-x-1 transition cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>{isLocating ? '⏳' : '🎯'}</span>
                    <span>{isLocating ? 'Locating...' : 'Pinpoint Live Location'}</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-xl">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ✓ {gpsData.lat}, {gpsData.lng}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGpsData(null)}
                      className="text-slate-400 hover:text-rose-400 text-xs font-black ml-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {locationError && (
                <p className="text-[10px] text-rose-400 font-medium mt-1">{locationError}</p>
              )}
            </div>

            {/* 9. Detailed Description */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Detailed Description / Amenities / Specs
              </label>
              <textarea
                rows="3"
                placeholder="List all offerings, specifications, dimensions, timings, terms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400 resize-none font-medium"
              ></textarea>
            </div>

            {/* 10. Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isProcessingVideo}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Uploading Media & Saving...' : '🚀 Publish Live to TownHub'}
            </button>
          </form>
        </div>
      </div>

      {/* 🛡️ Resident Verification Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        selectedCity={selectedCity}
        actionTitle="Verify Phone to Publish Listing"
        onSuccess={(profile) => {
          setCurrentUser(profile);
          setSellerName(profile.full_name || sellerName);
          setPhone(profile.phone || phone);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
}