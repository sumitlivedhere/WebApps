import React, { useState, useMemo } from 'react';
import { TRADE_REGISTRY } from './data/tradeRegistry';
import { compressListingImage } from './utils/imageCompressor';

export default function ProviderDashboard({ onBackToUserMode, onAddListing }) {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeSearch, setTradeSearch] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Operational State
  const [isAvailableToday, setIsAvailableToday] = useState(true);
  const [compressing, setCompressing] = useState(false);

  // Form Field State
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [phone, setPhone] = useState('');
  const [locationArea, setLocationArea] = useState('Budh Vihar, Alwar');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  // Voice Search Handler (Web Speech API)
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTradeSearch(transcript);
    };

    recognition.start();
  };

  // Instant Token-Matching Filter
  const matchedTrades = useMemo(() => {
    const query = tradeSearch.trim().toLowerCase();
    if (!query) return TRADE_REGISTRY;

    return TRADE_REGISTRY.filter((t) => {
      const inName = t.name.toLowerCase().includes(query);
      const inKeywords = t.keywords.some((k) => k.toLowerCase().includes(query));
      return inName || inKeywords;
    });
  }, [tradeSearch]);

  // Image Upload Processor
  const handlePhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setCompressing(true);
    try {
      const compressedList = await Promise.all(
        files.map((file) => compressListingImage(file, 800, 0.72))
      );
      setImages((prev) => [...prev, ...compressedList].slice(0, 3));
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setCompressing(false);
    }
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title || !price) return;

    const newListing = {
      id: `item_${Date.now()}`,
      title,
      category: selectedTrade.category,
      subCategory: selectedTrade.id,
      rawPrice: Number(price),
      price: `₹${Number(price).toLocaleString('en-IN')}`,
      mrp: mrp ? `₹${Number(mrp).toLocaleString('en-IN')}` : null,
      location: locationArea,
      phone: phone || '9876543210',
      images: images.length ? images : ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&auto=format&fit=crop&q=60'],
      isOpenToday: isAvailableToday,
      tradeId: selectedTrade.id,
      workspaceType: selectedTrade.workspaceType,
      createdAt: 'Just now',
    };

    onAddListing(newListing);
  };

  // ==========================================
  // VIEW 1: SMART TRADE SELECTOR (ENTRY SCREEN)
  // ==========================================
  if (!selectedTrade) {
    return (
      <div className="p-4 space-y-4 max-w-md mx-auto text-slate-800 animate-fadeIn">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
            व्यापारी व कारीगर पोर्टल
          </span>
          <button
            type="button"
            onClick={onBackToUserMode}
            className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition active:scale-95"
          >
            ← User App
          </button>
        </div>

        {/* Hero Prompt */}
        <div>
          <h2 className="text-xl font-black text-slate-900 leading-tight">
            आप क्या काम या व्यापार करते हैं?
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            बोलकर या लिखकर अपना पेशा चुनें और सीधा अपना डैशबोर्ड पाएँ।
          </p>
        </div>

        {/* Voice & Search Input Bar */}
        <div className="relative flex items-center shadow-sm">
          <input
            type="text"
            value={tradeSearch}
            onChange={(e) => setTradeSearch(e.target.value)}
            placeholder="उदा. Plumber, कपड़े की दुकान, ड्राइवर..."
            className="w-full bg-white border-2 border-indigo-100 focus:border-indigo-600 rounded-2xl pl-4 pr-12 py-3 text-xs font-bold outline-none transition"
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`absolute right-2 p-2 rounded-xl border transition active:scale-90 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse border-rose-600'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title="Speak your trade"
          >
            <span className="text-sm">🎙️</span>
          </button>
        </div>

        {/* Direct-Match Cards (1-Tap Selection) */}
        <div>
          <div className="text-[11px] font-black uppercase text-slate-400 mb-2">
            {tradeSearch ? `Matching Trades (${matchedTrades.length})` : 'Popular Local Trades'}
          </div>

          <div className="grid grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
            {matchedTrades.map((trade) => (
              <button
                key={trade.id}
                type="button"
                onClick={() => {
                  setSelectedTrade(trade);
                  setPrice(trade.defaultRate || '');
                }}
                className="bg-white p-3.5 rounded-2xl border border-slate-200/80 hover:border-indigo-600 shadow-sm text-left flex flex-col justify-between active:scale-95 transition group"
              >
                <div className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                  {trade.icon}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 leading-tight">
                    {trade.name}
                  </div>
                  <span className="inline-block text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded mt-1.5">
                    {trade.workspaceType.replace('_', ' ')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: DEDICATED TRADE WORKSPACE
  // ==========================================
  return (
    <div className="p-4 space-y-4 max-w-md mx-auto text-slate-800 animate-fadeIn">
      {/* Dynamic Header */}
      <div className="bg-indigo-700 text-white p-4 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl bg-white/10 p-2 rounded-2xl">{selectedTrade.icon}</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-indigo-200 font-black">
                Active Workspace
              </div>
              <h2 className="text-sm font-black text-white">{selectedTrade.name}</h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedTrade(null)}
            className="text-[10px] font-black bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-xl transition"
          >
            बदलें (Change)
          </button>
        </div>
      </div>

      {/* Real-Time Operational Availability Toggle */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <span className={`w-3 h-3 rounded-full ${isAvailableToday ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
          <div>
            <span className="text-xs font-black text-slate-900 block">
              {isAvailableToday ? '🟢 Open / Available Today' : '🔴 Closed / Busy'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {isAvailableToday ? 'Nearby users can call you' : 'Hidden from active searches'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsAvailableToday(!isAvailableToday)}
          className={`px-3 py-1 text-xs font-bold rounded-xl transition ${
            isAvailableToday ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
          }`}
        >
          {isAvailableToday ? 'Go Busy' : 'Go Online'}
        </button>
      </div>

      {/* Tailored Form Inputs */}
      <form onSubmit={handlePublish} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            {selectedTrade.workspaceType === 'SERVICE_WAGE' && 'सेवा या हुनर का नाम (Service / Skill Title)'}
            {selectedTrade.workspaceType === 'RETAIL_CATALOG' && 'प्रोडक्ट का नाम (Product Name)'}
            {selectedTrade.workspaceType === 'CONTRACT_FIRM' && 'फ़र्म / पैकेज नाम (Firm / Package Name)'}
            {selectedTrade.workspaceType === 'P2P_QUICK' && 'सामान का नाम (Item Title)'}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              selectedTrade.workspaceType === 'SERVICE_WAGE'
                ? 'उदा. Single Tap Repair & Pipe Fitting'
                : 'उदा. Pure Cotton Saree - New Arrival'
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-indigo-600"
          />
        </div>

        {/* Pricing Layout */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
              {selectedTrade.pricingLabel}
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₹ 150"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600"
            />
          </div>

          {selectedTrade.hasDiscountCalc ? (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                MRP (छूट दिखाने के लिए)
              </label>
              <input
                type="number"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                placeholder="₹ 299"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              />
            </div>
          ) : (
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              />
            </div>
          )}
        </div>

        {/* Location Landmark */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            Stand / Area / Landmark
          </label>
          <input
            type="text"
            value={locationArea}
            onChange={(e) => setLocationArea(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
          />
        </div>

        {/* Camera Upload Section */}
        <div>
          <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
            फ़ोटो जोड़ें (Camera Photos - Auto Compressed)
          </label>
          <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 rounded-2xl p-3 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition">
            <span className="text-base">📸</span>
            <span className="text-xs font-bold text-indigo-700">फ़ोटो खींचें या अपलोड करें</span>
            <input
              type="file"
              accept="image/*"
              multiple
              capture="environment"
              onChange={handlePhotoCapture}
              className="hidden"
            />
          </label>

          {compressing && (
            <p className="text-[10px] text-amber-600 font-bold mt-1.5 animate-pulse">
              ⚡ Compressing image on-device...
            </p>
          )}

          {images.length > 0 && (
            <div className="flex space-x-2 mt-2">
              {images.map((src, i) => (
                <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200">
                  <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publish Action */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-indigo-600/20 active:scale-95 transition"
        >
          तुरंत लाइव करें (Publish Now)
        </button>
      </form>
    </div>
  );
}