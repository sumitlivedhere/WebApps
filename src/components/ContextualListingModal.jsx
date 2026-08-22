import React, { useState, useRef, useMemo } from 'react';
import { TAXONOMY_REGISTRY, getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';
import { hyperlocalStore } from '../store/hyperlocalStore';
import { uploadListingImagesToStorage, getCategoryFallback } from '../services/listingService';

export default function ContextualListingModal({
  currentScreen,
  selectedCategory = 'property',
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  onClose,
}) {
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
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // 🖼️ 2. Multi-Image (Up to 10) & Cover Image Selection State
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // Raw File[]
  const [previewUrls, setPreviewUrls] = useState([]);     // Local blob URL[]
  const [coverIndex, setCoverIndex] = useState(0);         // Index of chosen cover photo

  // 📍 Location & Submission State
  const [locationAddress, setLocationAddress] = useState('');
  const [gpsData, setGpsData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 📸 Multi-File Selection Handler (Max 10)
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
    if (!title.trim() || !sellerName.trim() || !locationAddress.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const cleanSub = sanitizeSubCategoryId(category, subCategory);
    const fallbackImg = getCategoryFallback(category);

    // 1. Upload files to storage
    let uploadedUrls = [];
    if (selectedFiles.length > 0) {
      // Re-order files so the selected cover photo is uploaded at index 0
      const orderedFiles = [...selectedFiles];
      const [chosenCoverFile] = orderedFiles.splice(coverIndex, 1);
      orderedFiles.unshift(chosenCoverFile);

      uploadedUrls = await uploadListingImagesToStorage(orderedFiles);
    }

    const finalImages = uploadedUrls.length > 0 ? uploadedUrls : [fallbackImg];

    const newListing = {
      id: `custom-${Date.now()}`,
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
      mapUrl: gpsData ? `https://www.google.com/maps/search/?api=1&query=${gpsData.lat},${gpsData.lng}` : null,
      image: finalImages[0],      // Selected cover image
      images: finalImages,        // All gallery photos
      image_urls: finalImages,
      description: description.trim(),
      badge: gpsData ? '📍 GPS Pinpoint Attached' : 'Verified Listing',
      isNew: true,
      created_at: new Date().toISOString(),
    };

    await hyperlocalStore.insertListing(categoryConfig.bucketKey || 'listings', newListing);
    
    // Trigger town notification
    hyperlocalStore.addNotification({
      id: `notif_${Date.now()}`,
      title: '🎉 Listing Published!',
      message: `"${newListing.title}" is now active in ${categoryConfig.name || category}.`,
      category,
      subCategory: cleanSub,
      targetId: newListing.id,
      timestamp: 'Just now',
      read: false,
    });

    setIsSubmitting(false);
    onClose();
  };

  return (
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
                Photos / Service Proof ({previewUrls.length}/10)
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

                      {/* Cover Photo Badge */}
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

            {/* Upload Button Box */}
            {previewUrls.length < 10 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-20 border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition group p-2 text-center"
              >
                <span className="text-xl group-hover:scale-110 transition">📸</span>
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

          {/* 4. Title */}
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

          {/* 5. Price & Seller Name */}
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

          {/* 6. Phone Number */}
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

          {/* 📍 7. Address & GPS */}
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

          {/* 8. Detailed Description */}
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

          {/* 9. Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Uploading Photos & Saving...' : '🚀 Publish Live to TownHub'}
          </button>
        </form>
      </div>
    </div>
  );
}