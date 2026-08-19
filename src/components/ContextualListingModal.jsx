import React, { useState, useEffect, useRef } from 'react';
import { cityZones } from '../data/cityZones';
import { uploadMultipleListingImages, insertListingToDB } from '../services/listingService';
import { hyperlocalStore, normalizeDBListing } from '../store/hyperlocalStore';

// Universal Trade/Sector Catalog
const ALL_TOWN_CATEGORIES = [
  { id: 'property', name: 'Property / Flats / Plots (प्रॉपर्टी)', icon: '🏢', bucket: 'listings' },
  { id: 'recommerce', name: 'Re-commerce (पुराना सामान बेचें)', icon: '🛍️', bucket: 'reCommerceListings' },
  { id: 'kaarigar', name: 'Kaarigar (कारीगर व मिस्त्री)', icon: '🛠️', bucket: 'kaarigarWorkers' },
  { id: 'white-collar', name: 'Doctor / CA / Lawyer / Consultant (प्रोफेशनल्स)', icon: '👔', bucket: 'whiteCollarListings' },
  { id: 'restaurants', name: 'Restaurant / Cafe / Food (रेस्टोरेंट व कैफे)', icon: '🍔', bucket: 'restaurantsList' },
  { id: 'malls', name: 'Showroom / Boutique / Shop (दुकान व शोरूम)', icon: '👗', bucket: 'mallsStores' },
  { id: 'market', name: 'Market / Retail Products (बाज़ार उत्पाद)', icon: '🛒', bucket: 'marketProducts' },
  { id: 'education', name: 'Coaching / Home Tuition (ट्यूशन व कोचिंग)', icon: '🎓', bucket: 'educationListings' },
  { id: 'construction', name: 'Thekedar / Material / JCB (निर्माण कार्य)', icon: '🏗️', bucket: 'constructionListings' },
  { id: 'shaadi', name: 'Wedding Vendor / Halwai / Tent (विवाह सेवा)', icon: '💍', bucket: 'shaadiVendors' },
  { id: 'transporters', name: 'Transporter / Tempo / Loading (ट्रांसपोर्ट)', icon: '🚚', bucket: 'individualTransporters' },
  { id: 'advertising', name: 'Printing / Flex / Hoardings (विज्ञापन)', icon: '📢', bucket: 'advertisingProviders' },
  { id: 'community', name: 'Social Welfare / Blood / Seva (समाज सेवा)', icon: '🤝', bucket: 'communityDrives' },
];

export default function ContextualListingModal({
  currentScreen,
  selectedCategory,
  selectedSubCategory,
  selectedCity = 'Alwar',
  onClose,
  onNewNotification,
  onAddListing,
}) {
  const [activeTab, setActiveTab] = useState('write');

  const getInitialTargetSector = () => {
    if (['property-hub', 'listings'].includes(currentScreen)) return 'property';
    if (['white-collar-hub', 'white-collar-feed'].includes(currentScreen)) return 'white-collar';
    if (['kaarigar-hub', 'kaarigar-feed'].includes(currentScreen)) return 'kaarigar';
    if (['education-hub', 'education-feed'].includes(currentScreen)) return 'education';
    if (['restaurants-hub', 'restaurants-feed'].includes(currentScreen)) return 'restaurants';
    if (['malls-hub', 'malls-feed'].includes(currentScreen)) return 'malls';
    if (['market-hub', 'market-feed'].includes(currentScreen)) return 'market';
    if (['shaadi-hub', 'shaadi-feed'].includes(currentScreen)) return 'shaadi';
    if (['construction-hub', 'construction-feed'].includes(currentScreen)) return 'construction';
    if (['advertising-hub', 'advertising-feed'].includes(currentScreen)) return 'advertising';
    if (['community-hub', 'community-feed'].includes(currentScreen)) return 'community';
    if (['transporter-hub', 'transporter-feed'].includes(currentScreen)) return 'transporters';
    if (['recommerce-feed', 'recommerce-hub', 'buysell-hub'].includes(currentScreen)) return 'recommerce';
    return selectedCategory || 'property';
  };

  const [targetSector, setTargetSector] = useState(getInitialTargetSector);
  const isOpenedFromHub = currentScreen === 'hub';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    location: cityZones && cityZones.length > 0 ? cityZones[0].name : selectedCity,
    feeOrPrice: '',
    specialties: '',
    description: '',
  });

  const [rawFiles, setRawFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [primaryCoverIndex, setPrimaryCoverIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [voiceStep, setVoiceStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const voiceStepsConfig = [
    { id: 'name', title: 'Aapka Shubh Naam Batayein', hindiSub: 'नाम या टाइटल बोलें', icon: '👤', field: 'name', placeholder: 'उदा. "Bolero Maxi Truck"' },
    { id: 'phone', title: 'Aapka Contact Number', hindiSub: 'मोबाइल नंबर बोलें', icon: '📞', field: 'phone', placeholder: '9876543210' },
    { id: 'location', title: 'Aapka Area / Colony', hindiSub: 'इलाके का नाम बताएं', icon: '📍', field: 'location', placeholder: 'स्टेशन रोड' },
    { id: 'feeOrPrice', title: 'Keemat ya Rate (Price/Fee)', hindiSub: 'कीमत या चार्ज बताएं', icon: '💰', field: 'feeOrPrice', placeholder: '₹ 800' },
  ];

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'hi-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        const fieldName = voiceStepsConfig[voiceStep].field;
        setFormData((prev) => ({ ...prev, [fieldName]: text }));
      };
      recognitionRef.current = recognition;
    }
  }, [voiceStep]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setRawFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const handleRemovePhoto = (indexToRemove) => {
    setRawFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (primaryCoverIndex === indexToRemove) {
      setPrimaryCoverIndex(0);
    } else if (primaryCoverIndex > indexToRemove) {
      setPrimaryCoverIndex((prev) => prev - 1);
    }
  };

  const handleFinalPublish = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill at least Title and Phone Number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedSectorObj =
        ALL_TOWN_CATEGORIES.find((c) => c.id === targetSector) ||
        ALL_TOWN_CATEGORIES[0];
      const targetBucket = selectedSectorObj.bucket;
      const fallbackImg =
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';

      // 1. Upload compressed images to Supabase Storage first
      const { coverUrl, allUrls } = await uploadMultipleListingImages(
        rawFiles,
        primaryCoverIndex
      );
      const finalCover = coverUrl || fallbackImg;
      const finalAll = allUrls.length > 0 ? allUrls : [finalCover];

      // 2. Prepare payload for PostgreSQL
      const dbPayload = {
        bucketKey: targetBucket,
        category: targetSector,
        subCategory: selectedSubCategory || 'all',
        title: formData.name.trim(),
        name: formData.name.trim(),
        price: formData.feeOrPrice
          ? `₹ ${formData.feeOrPrice}`
          : 'Contact for Price',
        description: formData.description || formData.specialties || '',
        sellerName: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: formData.whatsapp.trim() || formData.phone.trim(),
        location: formData.location || selectedCity,
        image: finalCover,
        images: finalAll,
        condition: 'Good',
      };

      // 3. Insert into PostgreSQL
      const savedRow = await insertListingToDB(dbPayload);

      // 4. Update the local store once with the confirmed DB row & UUID
      if (savedRow && savedRow.id) {
        const confirmedNormalized = normalizeDBListing(savedRow);
        hyperlocalStore.insertListing(targetBucket, confirmedNormalized);

        if (typeof onAddListing === 'function') {
          onAddListing(confirmedNormalized, targetBucket);
        }
      }

      // 5. Trigger instant local notification beacon
      const notifPayload = {
        tag: 'LIVE',
        title: '🎉 Listing Published Live!',
        message: `"${formData.name}" is now live in ${selectedCity}.`,
        time: 'Just now',
      };
      hyperlocalStore.addNotification(notifPayload);
      if (typeof onNewNotification === 'function') {
        onNewNotification(notifPayload);
      }

      onClose();
    } catch (err) {
      console.error('Publishing failed:', err);
      alert(`Publishing failed: ${err.message || 'Please check your connection.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeSectorName = ALL_TOWN_CATEGORIES.find((c) => c.id === targetSector)?.name || 'Local Service';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border-t border-amber-400">
        
        {/* HEADER */}
        <div className="px-4 pt-3.5 pb-2 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📢</span>
              <div>
                <h2 className="text-sm font-black leading-tight text-amber-300">
                  Apni Seva / Dukaan Jodein
                </h2>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Target: {activeSectorName.split('(')[0]}
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

          {/* DUAL TABS */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 mt-1">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'write'
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>✍️ लिखकर जोड़ें (Write)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('voice')}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🎙️ बोलकर जोड़ें (Speak)</span>
            </button>
          </div>
        </div>

        {/* CATEGORY SELECTOR */}
        {isOpenedFromHub && (
          <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/60">
            <label className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
              Select Category (श्रेणी चुनें)
            </label>
            <select
              value={targetSector}
              onChange={(e) => setTargetSector(e.target.value)}
              className="w-full p-2 bg-white border border-amber-300 rounded-xl font-bold text-slate-900 text-xs focus:outline-none"
            >
              {ALL_TOWN_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* WRITE TAB */}
        {activeTab === 'write' && (
          <form onSubmit={handleFinalPublish} className="p-4 overflow-y-auto space-y-3 text-xs text-slate-800">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">
                Title / Business Name (नाम या टाइटल) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Bolero Maxi Truck / 2 BHK Flat Budh Vihar"
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
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="Same as phone"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
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
                <label className="font-bold text-slate-700 block mb-1">Price / Fee (₹)</label>
                <input
                  type="text"
                  placeholder="e.g. 25 Lakh or 800"
                  value={formData.feeOrPrice}
                  onChange={(e) => setFormData({ ...formData, feeOrPrice: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Description / Key Features (विवरण)
              </label>
              <textarea
                rows="2"
                placeholder="Describe area, amenities, vehicle capacity, condition..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
              ></textarea>
            </div>

            {/* MULTI-PHOTO SELECTOR */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">
                  Upload Photos (Multiple Allowed)
                </label>
                <span className="text-[10px] text-slate-400 font-semibold">
                  Tap photo to set Cover
                </span>
              </div>

              <label className="block p-3 border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-slate-50 rounded-xl text-center cursor-pointer transition">
                <span className="text-xl block">📸</span>
                <span className="text-xs font-bold text-slate-700 block mt-0.5">
                  + Add Photos (फ़ोटो चुनें)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2.5">
                  {imagePreviews.map((src, idx) => {
                    const isCover = primaryCoverIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setPrimaryCoverIndex(idx)}
                        className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition ${
                          isCover ? 'border-amber-400 ring-2 ring-amber-300' : 'border-slate-200 opacity-80'
                        }`}
                      >
                        <img src={src} alt="Upload" className="w-full h-full object-cover" />
                        <span
                          className={`absolute top-1 left-1 text-[8px] font-black px-1.5 py-0.5 rounded-md ${
                            isCover ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-black/60 text-white'
                          }`}
                        >
                          {isCover ? '★ Cover' : 'Set Cover'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemovePhoto(idx);
                          }}
                          className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
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
        )}

        {/* VOICE TAB */}
        {activeTab === 'voice' && (
          <div className="p-4 overflow-y-auto space-y-4 text-slate-800">
            <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4 rounded-2xl border border-amber-200/80 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-2xl mx-auto shadow-md">
                {voiceStepsConfig[voiceStep].icon}
              </div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {voiceStepsConfig[voiceStep].title}
              </h3>
              <p className="text-xs font-bold text-amber-900">
                {voiceStepsConfig[voiceStep].hindiSub}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center py-2">
                <button
                  type="button"
                  onClick={() => {
                    if (recognitionRef.current) {
                      try {
                        recognitionRef.current.start();
                      } catch {
                        recognitionRef.current.stop();
                        setTimeout(() => recognitionRef.current.start(), 200);
                      }
                    }
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-xl transition-all active:scale-95 cursor-pointer ${
                    isListening
                      ? 'bg-rose-600 text-white animate-ping ring-4 ring-rose-300'
                      : 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 ring-4 ring-amber-200'
                  }`}
                >
                  🎙️
                </button>
                <span className="text-xs font-black text-slate-700 mt-2">
                  {isListening ? '🔴 सुन रहे हैं... बोलिए...' : 'माइक दबाएं और बोलें'}
                </span>
              </div>

              <input
                type="text"
                value={formData[voiceStepsConfig[voiceStep].field] || ''}
                onChange={(e) =>
                  setFormData({ ...formData, [voiceStepsConfig[voiceStep].field]: e.target.value })
                }
                placeholder={voiceStepsConfig[voiceStep].placeholder}
                className="w-full p-3 bg-slate-50 border-2 border-slate-200 focus:border-amber-500 rounded-xl font-bold text-slate-900 text-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={voiceStep === 0}
                onClick={() => setVoiceStep((prev) => Math.max(0, prev - 1))}
                className={`py-3 rounded-xl font-bold text-xs ${
                  voiceStep === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-800'
                }`}
              >
                ← पिछला सवाल
              </button>

              {voiceStep < voiceStepsConfig.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setVoiceStep((prev) => prev + 1)}
                  className="py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition cursor-pointer"
                >
                  अगला सवाल →
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalPublish}
                  className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : '🚀 लाइव प्रकाशित करें'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}