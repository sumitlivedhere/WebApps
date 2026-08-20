import React, { useState } from 'react';
import { cityZones } from '../data/cityZones';
import { uploadMultipleListingImages, insertListingToDB } from '../services/listingService';
import { hyperlocalStore, normalizeDBListing } from '../store/hyperlocalStore';
import { TAXONOMY_REGISTRY, getCategoryById, sanitizeSubCategoryId } from '../data/taxonomyRegistry';

export default function ContextualListingModal({
  currentScreen,
  selectedCategory,
  selectedSubCategory,
  selectedCity = 'Alwar',
  onClose,
  onNewNotification,
  onAddListing,
}) {
  const getInitialTargetSector = () => {
    if (['kaarigar-hub', 'kaarigar-feed'].includes(currentScreen)) return 'kaarigar';
    if (['property-hub', 'listings'].includes(currentScreen)) return 'property';
    if (['transporter-hub', 'transporter-feed'].includes(currentScreen)) return 'transporters';
    if (['white-collar-hub', 'white-collar-feed'].includes(currentScreen)) return 'white-collar';
    if (['restaurants-hub', 'restaurants-feed'].includes(currentScreen)) return 'restaurants';
    if (['malls-hub', 'malls-feed'].includes(currentScreen)) return 'malls';
    if (['education-hub', 'education-feed'].includes(currentScreen)) return 'education';
    if (['construction-hub', 'construction-feed'].includes(currentScreen)) return 'construction';
    if (['shaadi-hub', 'shaadi-feed'].includes(currentScreen)) return 'shaadi';
    if (['recommerce-feed', 'recommerce-hub', 'buysell-hub'].includes(currentScreen)) return 'recommerce';
    return selectedCategory || 'kaarigar';
  };

  const [targetSector, setTargetSector] = useState(getInitialTargetSector);

  const getInitialSubCategory = () => {
    const cat = getCategoryById(getInitialTargetSector());
    if (selectedSubCategory && selectedSubCategory !== 'all') {
      return sanitizeSubCategoryId(cat.id, selectedSubCategory);
    }
    return cat.subCategories[0].id;
  };

  const [targetSubCategory, setTargetSubCategory] = useState(getInitialSubCategory);
  const activeSector = getCategoryById(targetSector);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    location: cityZones && cityZones.length > 0 ? cityZones[0].name : selectedCity,
    feeOrPrice: '',
    description: '',
  });

  const [rawFiles, setRawFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryCoverIndex, setPrimaryCoverIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setRawFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleFinalPublish = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill at least Name and Phone Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const targetBucket = activeSector.bucketKey;
      const fallbackImg = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';

      const { coverUrl, allUrls } = await uploadMultipleListingImages(
        rawFiles,
        primaryCoverIndex,
        targetSector
      );
      const finalCover = coverUrl || fallbackImg;
      const finalAll = allUrls.length > 0 ? allUrls : [finalCover];

      const dbPayload = {
        bucketKey: targetBucket,
        category: targetSector,
        subCategory: targetSubCategory, // Strictly saved according to master taxonomy ID
        title: formData.name.trim(),
        name: formData.name.trim(),
        price: formData.feeOrPrice ? `₹ ${formData.feeOrPrice}` : 'Contact for Price',
        description: formData.description || '',
        sellerName: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        location: formData.location || selectedCity,
        image: finalCover,
        images: finalAll,
        condition: 'Good',
      };

      const savedRow = await insertListingToDB(dbPayload);

      if (savedRow && savedRow.id) {
        const confirmedNormalized = normalizeDBListing(savedRow);
        hyperlocalStore.insertListing(targetBucket, confirmedNormalized);

        if (typeof onAddListing === 'function') {
          onAddListing(confirmedNormalized, targetBucket);
        }
      }

      const notifPayload = {
        tag: 'LIVE',
        title: '🎉 Listing Live!',
        message: `"${formData.name}" is now live under ${targetSubCategory.toUpperCase()} in ${selectedCity}.`,
        time: 'Just now',
      };
      hyperlocalStore.addNotification(notifPayload);
      if (typeof onNewNotification === 'function') {
        onNewNotification(notifPayload);
      }

      onClose();
    } catch (err) {
      console.error('Publish error:', err);
      alert(`Publishing failed: ${err.message || 'Check network connection'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border-t border-amber-400">
        
        {/* HEADER */}
        <div className="px-4 pt-3.5 pb-2 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{activeSector.icon}</span>
              <div>
                <h2 className="text-sm font-black leading-tight text-amber-300">
                  Apni Seva / Dukaan Jodein
                </h2>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Sector: {activeSector.name.split('(')[0]}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 2-LEVEL TAXONOMY SELECTORS */}
        <div className="p-3 bg-amber-50/80 border-b border-amber-200 grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
              1. Main Category
            </label>
            <select
              value={targetSector}
              onChange={(e) => {
                const newCat = e.target.value;
                setTargetSector(newCat);
                const catObj = getCategoryById(newCat);
                setTargetSubCategory(catObj.subCategories[0].id);
              }}
              className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none"
            >
              {TAXONOMY_REGISTRY.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
              2. Sub-Category *
            </label>
            <select
              value={targetSubCategory}
              onChange={(e) => setTargetSubCategory(e.target.value)}
              className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none"
            >
              {activeSector.subCategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleFinalPublish} className="p-4 overflow-y-auto space-y-3 text-xs text-slate-800">
          <div>
            <label className="font-extrabold text-slate-800 block mb-1">
              Title / Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Plumber / Bolero Maxi Truck / 2 BHK Flat"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Calling Number *</label>
              <input
                type="tel"
                required
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Price / Fee (₹)</label>
              <input
                type="text"
                placeholder="e.g. 200 or 25 Lakh"
                value={formData.feeOrPrice}
                onChange={(e) => setFormData({ ...formData, feeOrPrice: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Area / Colony *</label>
            <input
              type="text"
              required
              placeholder="e.g. Budh Vihar, Alwar"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="2"
              placeholder="Details about experience, rates, timings, condition..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
            ></textarea>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Upload Photos</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-amber-100 file:text-amber-900 file:font-bold cursor-pointer"
            />
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {imagePreviews.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPrimaryCoverIndex(idx)}
                    className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${
                      primaryCoverIndex === idx ? 'border-amber-400' : 'border-slate-200'
                    }`}
                  >
                    <img src={src} alt="Upload" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 text-white rounded-2xl font-black text-sm shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : '🚀 Publish Listing Live'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}