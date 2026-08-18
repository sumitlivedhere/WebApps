import React, { useState, useEffect, useRef } from 'react';
import { compressImage } from '../utils/imageCompressor';
import { cityZones } from '../data/cityZones';

// Universal Trade/Sector Catalog for Homepage selection
const ALL_TOWN_CATEGORIES = [
  { id: 'kaarigar', name: 'Kaarigar (कारीगर व मिस्त्री)', icon: '🛠️', bucket: 'kaarigarWorkers' },
  { id: 'recommerce', name: 'Re-commerce (पुराना सामान बेचें)', icon: '🛍️', bucket: 'reCommerceListings' },
  { id: 'white-collar', name: 'Doctor / CA / Lawyer / Consultant (प्रोफेशनल्स)', icon: '👔', bucket: 'whiteCollarListings' },
  { id: 'restaurants', name: 'Restaurant / Cafe / Food (रेस्टोरेंट व कैफे)', icon: '🍔', bucket: 'restaurantsList' },
  { id: 'malls', name: 'Showroom / Boutique / Shop (दुकान व शोरूम)', icon: '👗', bucket: 'mallsStores' },
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
  selectedCity,
  onClose,
  onAddListing,
}) {
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'write'

  // Determine Auto-Locked Category
  const getInitialTargetSector = () => {
    if (['white-collar-hub', 'white-collar-feed'].includes(currentScreen)) return 'white-collar';
    if (['kaarigar-hub', 'kaarigar-feed'].includes(currentScreen)) return 'kaarigar';
    if (['education-hub', 'education-feed'].includes(currentScreen)) return 'education';
    if (['restaurants-hub', 'restaurants-feed'].includes(currentScreen)) return 'restaurants';
    if (['malls-hub', 'malls-feed'].includes(currentScreen)) return 'malls';
    if (['market-hub', 'market-feed'].includes(currentScreen)) return 'malls';
    if (['shaadi-hub', 'shaadi-feed'].includes(currentScreen)) return 'shaadi';
    if (['construction-hub', 'construction-feed'].includes(currentScreen)) return 'construction';
    if (['advertising-hub', 'advertising-feed'].includes(currentScreen)) return 'advertising';
    if (['community-hub', 'community-feed'].includes(currentScreen)) return 'community';
    if (['transporter-hub', 'transporter-feed'].includes(currentScreen)) return 'transporters';
    if (['recommerce-feed', 'recommerce-hub', 'buysell-hub'].includes(currentScreen)) return 'recommerce';
    return 'kaarigar'; // default fallback if opened from homepage
  };

  const [targetSector, setTargetSector] = useState(getInitialTargetSector);
  const isOpenedFromHub = currentScreen === 'hub';

  // Core Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    location: cityZones && cityZones.length > 0 ? cityZones[0].name : 'Hope Circus, Alwar',
    landmark: '',
    feeOrPrice: '',
    specialties: '',
    qualifications: '',
    regNumber: '',
    experience: 'Experienced (अनुभवी)',
    images: [],
  });

  const [isCompressing, setIsCompressing] = useState(false);

  // Voice state machine
  const [voiceStep, setVoiceStep] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const recognitionRef = useRef(null);

  const voiceStepsConfig = [
    {
      id: 'name',
      title: 'Aapka Shubh Naam Batayein',
      hindiSub: 'अपना नाम या दुकान/क्लिनिक/फर्म का नाम बोलें',
      icon: '👤',
      field: 'name',
      placeholder: 'उदा. "डॉ. विवेक शर्मा" या "राजू इलेक्ट्रिशियन"',
      speechPrompt: 'कृपया अपना नाम या अपनी दुकान का नाम बोलें',
    },
    {
      id: 'phone',
      title: 'Aapka Contact Number',
      hindiSub: 'ग्राहक आपको किस नंबर पर कॉल या व्हाट्सएप करें?',
      icon: '📞',
      field: 'phone',
      placeholder: 'उदा. "9876543210"',
      speechPrompt: 'अपना मोबाइल नंबर बोलें',
    },
    {
      id: 'location',
      title: 'Aapka Area / Colony',
      hindiSub: 'आपकी दुकान या सर्विस किस इलाके में स्थित है?',
      icon: '📍',
      field: 'location',
      placeholder: 'उदा. "बुध विहार" या "स्टेशन रोड"',
      speechPrompt: 'अपनी कॉलोनी या क्षेत्र का नाम बताएं',
    },
    {
      id: 'feeOrPrice',
      title: 'Seva Shulk / Keemat (Rate/Fee)',
      hindiSub: 'आपकी फीस, विजिट चार्ज या सामान की कीमत क्या है?',
      icon: '💰',
      field: 'feeOrPrice',
      placeholder: 'उदा. "300 रुपये" या "500"',
      speechPrompt: 'अपनी सर्विस फीस या कीमत बताएं',
    },
    {
      id: 'specialties',
      title: 'Aapke Mukhya Kaam / Specialization',
      hindiSub: 'आप क्या-क्या मुख्य काम या सेवाएँ देते हैं?',
      icon: '🛠️',
      field: 'specialties',
      placeholder: 'उदा. "वायरिंग, मोटर रिपेयरिंग, इनवर्टर"',
      speechPrompt: 'अपने मुख्य काम और विशेषज्ञता के बारे में बताएं',
    },
    {
      id: 'photos',
      title: 'Photo Chunein (Upload Photos)',
      hindiSub: 'अपने काम, दुकान, क्लिनिक या सर्टिफिकेट की फ़ोटो चुनें',
      icon: '📸',
      field: 'images',
      placeholder: 'कैमरा या गैलरी से फ़ोटो चुनें',
      speechPrompt: 'कृपया अपने काम की फ़ोटो चुनें',
    },
  ];

  // Speech Recognition Listener
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.error('Speech error:', e);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setVoiceTranscript(text);
        applyVoiceResult(voiceStep, text);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceStep]);

  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    setVoiceTranscript('');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 200);
      }
    } else {
      alert('Aapke browser me voice support nahi hai. Niche likhkar fill karein.');
    }
  };

  const applyVoiceResult = (stepIdx, text) => {
    const fieldName = voiceStepsConfig[stepIdx].field;
    if (fieldName === 'phone') {
      const clean = text.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, phone: clean || text, whatsapp: clean || text }));
    } else if (fieldName === 'feeOrPrice') {
      const clean = text.replace(/[^0-9]/g, '');
      setFormData((prev) => ({ ...prev, feeOrPrice: clean || text }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: text }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setIsCompressing(true);
    try {
      const list = [];
      for (const f of files) {
        const compressed = await compressImage(f, { maxWidth: 1080, quality: 0.75, format: 'image/webp' });
        list.push(compressed);
      }
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...list] }));
    } catch (err) {
      console.error('Compression failed', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFinalPublish = (e) => {
    if (e) e.preventDefault();

    const selectedSectorObj = ALL_TOWN_CATEGORIES.find((c) => c.id === targetSector) || ALL_TOWN_CATEGORIES[0];

    const newEntry = {
      id: `live-${Date.now()}`,
      targetSector: targetSector,
      targetBucket: selectedSectorObj.bucket,
      name: formData.name || 'Apna Vyapar (Verified)',
      title: formData.name || 'Apna Vyapar (Verified)',
      phone: formData.phone || '+919876543210',
      whatsapp: formData.whatsapp || formData.phone || '919876543210',
      location: formData.location || selectedCity,
      landmark: formData.landmark || 'Main Road',
      distance: '0.1 km away (Near You)',
      rating: 5.0,
      verified: true,
      badge: '🟢 Just Listed by You',
      image: formData.images[0] || 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=700',
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=700'],
      experience: formData.experience || 'Experienced',
      freeTimeSlot: 'Available Today (उपलब्ध)',
      visitingCharge: formData.feeOrPrice ? `₹ ${formData.feeOrPrice}` : 'Free Quote',
      price: formData.feeOrPrice ? `₹ ${formData.feeOrPrice}` : 'On Request',
      fee: formData.feeOrPrice ? `₹ ${formData.feeOrPrice}` : 'Affordable',
      consultationFee: formData.feeOrPrice ? `₹ ${formData.feeOrPrice}` : '₹ 300',
      qualifications: formData.qualifications || 'Certified Professional',
      regNumber: formData.regNumber || 'Verified Practitioner',
      specialties: formData.specialties ? formData.specialties.split(',').map((s) => s.trim()) : ['General Service', 'Instant Response'],
      subjects: formData.specialties ? formData.specialties.split(',').map((s) => s.trim()) : ['General Syllabus'],
      achievements: 'Verified Local Service / Shop in Town',
      ratings: { overall: 5.0, punctuality: 5.0, costEffective: 5.0, quality: 5.0, behavior: 5.0, availability: 5.0 },
      isAvailableNow: true,
    };

    onAddListing(newEntry, selectedSectorObj.bucket);
    onClose();
  };

  const activeSectorName = ALL_TOWN_CATEGORIES.find((c) => c.id === targetSector)?.name || 'Local Service';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border-t border-amber-400">
        
        {/* MODAL HEADER */}
        <div className="px-4 pt-3.5 pb-2 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">📢</span>
              <div>
                <h2 className="text-sm font-black leading-tight text-amber-300">
                  Apni Seva / Dukaan Jodein
                </h2>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  🎯 Target: {activeSectorName.split('(')[0]}
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

          {/* DUAL MODE TABS (SPEAK VS WRITE) */}
          <div className="grid grid-cols-2 gap-1.5 bg-black/40 p-1 rounded-2xl border border-white/10 mt-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab('voice');
                speakPrompt(voiceStepsConfig[voiceStep].speechPrompt);
              }}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'voice'
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🎙️ बोलकर जोड़ें (Speak)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`py-2 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
                activeTab === 'write'
                  ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>✍️ लिखकर जोड़ें (Write)</span>
            </button>
          </div>
        </div>

        {/* CATEGORY SELECTOR (IF OPENED FROM HOMEPAGE) */}
        {isOpenedFromHub && (
          <div className="px-4 py-2 bg-amber-50/70 border-b border-amber-200/60">
            <label className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
              Select Your Business Category (श्रेणी चुनें)
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

        {/* MODE A: VOICE GUIDED STEP-BY-STEP */}
        {activeTab === 'voice' && (
          <div className="p-4 overflow-y-auto space-y-4 text-slate-800">
            <div className="flex items-center justify-between text-[10px] font-extrabold text-slate-500 mb-1">
              <span>Step {voiceStep + 1} of {voiceStepsConfig.length}</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {voiceStepsConfig[voiceStep].id.toUpperCase()}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full transition-all duration-300"
                style={{ width: `${((voiceStep + 1) / voiceStepsConfig.length) * 100}%` }}
              ></div>
            </div>

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

            {voiceStep === 5 ? (
              <div className="space-y-3">
                <label className="block p-4 border-2 border-dashed border-amber-400 bg-amber-50/30 rounded-2xl text-center cursor-pointer hover:bg-amber-50">
                  <span className="text-3xl block mb-1">📸</span>
                  <span className="text-xs font-black text-slate-900 block">फ़ोन से फ़ोटो चुनें या कैमरा खोलें</span>
                  <span className="text-[10px] text-slate-500 font-semibold mt-0.5 block">
                    (Auto-compressed WebP format)
                  </span>
                  <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                </label>
                {isCompressing && (
                  <p className="text-center text-xs text-amber-800 font-bold animate-pulse">
                    ⚡ फोटो कंप्रेस हो रही है...
                  </p>
                )}
                {formData.images.length > 0 && (
                  <div className="flex space-x-2 overflow-x-auto pb-1">
                    {formData.images.map((src, i) => (
                      <img key={i} src={src} alt="Uploaded" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs" />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-col items-center justify-center py-2">
                  <button
                    type="button"
                    onClick={startVoiceInput}
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

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Aapka Jawab (Your Spoken Answer)
                  </label>
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
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={voiceStep === 0}
                onClick={() => {
                  const prev = Math.max(0, voiceStep - 1);
                  setVoiceStep(prev);
                  speakPrompt(voiceStepsConfig[prev].speechPrompt);
                }}
                className={`py-3 rounded-xl font-bold text-xs ${
                  voiceStep === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 text-slate-800'
                }`}
              >
                ← पिछला सवाल
              </button>

              {voiceStep < voiceStepsConfig.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    const next = voiceStep + 1;
                    setVoiceStep(next);
                    speakPrompt(voiceStepsConfig[next].speechPrompt);
                  }}
                  className="py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition"
                >
                  अगला सवाल →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalPublish}
                  className="py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white rounded-xl font-black text-xs shadow-md active:scale-95 transition cursor-pointer"
                >
                  🚀 लाइव प्रकाशित करें
                </button>
              )}
            </div>
          </div>
        )}

        {/* MODE B: FAST WRITTEN FORM */}
        {activeTab === 'write' && (
          <form onSubmit={handleFinalPublish} className="p-4 overflow-y-auto space-y-3 text-xs text-slate-800">
            <div>
              <label className="font-extrabold text-slate-800 block mb-1">
                Name / Business Title (नाम या दुकान का नाम) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Electricals / Dr. Vivek Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Area / Colony *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Budh Vihar, Scheme 1"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Rate / Visiting Fee (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 300"
                  value={formData.feeOrPrice}
                  onChange={(e) => setFormData({ ...formData, feeOrPrice: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Specialties / Key Services (मुख्य काम / सेवाएँ)
              </label>
              <input
                type="text"
                placeholder="e.g. Wiring, Inverter Repair, AC Fitting"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Photo Upload</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-amber-100 file:text-amber-900 file:font-bold" />
              {isCompressing && <p className="text-[10px] text-amber-700 font-bold mt-1">⚡ Compressing...</p>}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white rounded-2xl font-black text-sm shadow-md active:scale-95 transition"
              >
                🚀 तुरंत प्रकाशित करें (Publish Now)
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}