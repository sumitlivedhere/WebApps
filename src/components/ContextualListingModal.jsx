import React, { useState, useRef } from 'react';
import { getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';
import { hyperlocalStore } from '../store/hyperlocalStore';
import { uploadListingImagesToStorage, getCategoryFallback } from '../services/listingService';

export default function ContextualListingModal({
  currentScreen,
  selectedCategory = 'property',
  selectedSubCategory = 'all',
  selectedCity = 'Alwar',
  onClose,
}) {
  const categoryConfig = getCategoryById(selectedCategory) || {};
  const subCategories = Array.isArray(categoryConfig.subCategories) ? categoryConfig.subCategories : [];

  const defaultSub =
    selectedSubCategory && selectedSubCategory !== 'all'
      ? selectedSubCategory
      : subCategories[0]?.id || 'all';

  const [subCategory, setSubCategory] = useState(defaultSub);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // 🖼️ Multi-Image Files & Previews State
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]); // Raw File[] objects
  const [previewUrls, setPreviewUrls] = useState([]);     // Local object URLs

  // 📍 Location State
  const [locationAddress, setLocationAddress] = useState('');
  const [gpsData, setGpsData] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 📸 Multi-File Selection Handler
  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remaining = 5 - selectedFiles.length;
    if (remaining <= 0) {
      alert('You can upload a maximum of 5 photos.');
      return;
    }

    const newFiles = files.slice(0, remaining);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

    setSelectedFiles((prev) => [...prev, ...newFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported.');
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
        setLocationError('Could not fetch GPS.');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !sellerName.trim() || !locationAddress.trim()) return;

    setIsSubmitting(true);

    const cleanSub = sanitizeSubCategoryId(selectedCategory, subCategory);
    const fallbackImg = getCategoryFallback(selectedCategory);

    // 1. Upload all selected files to Supabase Storage & get short clean URLs
    let uploadedUrls = [];
    if (selectedFiles.length > 0) {
      uploadedUrls = await uploadListingImagesToStorage(selectedFiles);
    }

    const finalImages = uploadedUrls.length > 0 ? uploadedUrls : [fallbackImg];

    const newListing = {
      id: `custom-${Date.now()}`,
      category: selectedCategory,
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
      image: finalImages[0],      // Clean URL for primary cover
      images: finalImages,         // Array of clean URLs for full carousel
      image_urls: finalImages,
      description: description.trim(),
      badge: gpsData ? '📍 GPS Pinpoint Attached' : 'Verified Listing',
      isNew: true,
      created_at: new Date().toISOString(),
    };

    await hyperlocalStore.insertListing(categoryConfig.bucketKey || 'listings', newListing);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto p-4 space-y-4 shadow-2xl text-slate-100 pb-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-1.5">
              <span>{categoryConfig.icon || '📝'}</span>
              <span>Post New Listing / Business</span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Posting to <strong className="text-amber-400">{categoryConfig.name?.split('(')[0]}</strong> in {selectedCity}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 font-bold text-xs flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* 📸 1. MULTI-PHOTO UPLOAD (UP TO 5 PHOTOS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-400">
                Photos / Service Proof ({previewUrls.length}/5)
              </label>
              <span className="text-[9px] text-slate-500 font-medium">Select multiple images</span>
            </div>

            {/* Thumbnail Gallery Preview Strip */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {previewUrls.map((imgSrc, idx) => (
                  <div key={idx} className="relative h-20 rounded-xl overflow-hidden border border-slate-700 group shadow-inner bg-slate-950">
                    <img src={imgSrc} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-md">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-rose-600/90 hover:bg-rose-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black cursor-pointer shadow-md"
                      title="Remove photo"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button Box */}
            {previewUrls.length < 5 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="h-20 border-2 border-dashed border-slate-700 hover:border-amber-400/80 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-950/60 transition group p-2 text-center"
              >
                <span className="text-xl group-hover:scale-110 transition">📸</span>
                <span className="text-[10px] font-black text-slate-300 mt-0.5">
                  + Add Photos (Select Multiple)
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

          {/* 2. Subcategory */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Select Category Subsection
            </label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold focus:outline-hidden focus:border-amber-400"
            >
              {subCategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Title */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Business / Listing Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3 BHK Luxury Villa / Rawat Transporters"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* 4. Price & Seller Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Price / Rent / Charges
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

          {/* 5. Phone Number */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="9876543201"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
            />
          </div>

          {/* 📍 6. Address & GPS */}
          <div className="space-y-2.5 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                Colony / Area / Address * (Type your address)
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Near Bus Stand, Budh Vihar"
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
                  Attaches coordinates for map features
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

          {/* 7. Detailed Description */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              Detailed Description / Amenities / Specs
            </label>
            <textarea
              rows="3"
              placeholder="List all offerings, specifications, dimensions, timings, terms..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-hidden focus:border-amber-400"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-xs rounded-2xl shadow-lg active:scale-95 transition cursor-pointer"
          >
            {isSubmitting ? 'Uploading Photos & Saving...' : '🚀 Publish Live to TownHub'}
          </button>
        </form>
      </div>
    </div>
  );
}