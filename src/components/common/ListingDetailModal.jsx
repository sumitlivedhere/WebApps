import React, { useState, useRef } from 'react';
import { useInterestSlice, useThreadSlice, hyperlocalStore } from '../../store/hyperlocalStore';
import ActionButtons from './ActionButtons';

export default function ListingDetailModal({
  item,
  selectedCity = 'Alwar',
  onClose,
  onNewNotification,
}) {
  if (!item) return null;

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef(null);

  // 🎬 Video & Media Tab State
  const rawVideos = item.videos || item.video_urls || [];
  const videos = rawVideos.map((v) =>
    typeof v === 'string' ? { url: v, duration: '0:30' } : v
  );
  const [activeMediaTab, setActiveMediaTab] = useState('photos'); // 'photos' | 'videos'
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // Q&A State
  const [userQuery, setUserQuery] = useState('');
  const [userName, setUserName] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [sellerReplyText, setSellerReplyText] = useState('');
  const [isSellerMode, setIsSellerMode] = useState(false);

  // Gallery resolution
  const gallery =
    item.images && item.images.length > 0
      ? item.images
      : item.image
      ? [item.image]
      : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700'];

  const totalImages = gallery.length;

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    if (clientWidth > 0) {
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeImgIndex && newIndex >= 0 && newIndex < totalImages) {
        setActiveImgIndex(newIndex);
      }
    }
  };

  const scrollToImage = (index) => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: index * carouselRef.current.clientWidth,
        behavior: 'smooth',
      });
      setActiveImgIndex(index);
    }
  };

  // 🌟 Live Reactive Slices
  const interestCount = useInterestSlice(
    item.id,
    Number(item.interestCount || item.interest_count || 0)
  );
  const comments = useThreadSlice(item.id, []);

  const handleIncrementInterest = () => {
    hyperlocalStore.incrementInterest(
      item.id,
      interestCount,
      item.title || item.name,
      item.sellerName || item.driverName || 'Verified Member'
    );
  };

  // 💬 User submits inquiry
  const handlePostQuery = (e) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const sender = userName.trim() || 'Town User';
    const text = userQuery.trim();

    hyperlocalStore.addThreadComment(
      item.id,
      {
        userName: sender,
        text: text,
        isPublic: true,
      },
      item.title || item.name
    );

    if (onNewNotification) {
      onNewNotification({
        tag: 'NEW INQUIRY',
        title: `Question on "${item.title || item.name}"`,
        message: `${sender} asked: "${text}"`,
        time: 'Just now',
        type: 'comment',
        targetId: item.id,
      });
    }

    setUserQuery('');
  };

  // 👑 Seller publishes official reply
  const handlePostSellerReply = (commentId) => {
    if (!sellerReplyText.trim()) return;

    hyperlocalStore.addSellerReply(
      item.id,
      commentId,
      { text: sellerReplyText.trim() },
      item.title || item.name
    );

    setSellerReplyText('');
    setActiveReplyId(null);
  };

  // 📱 Contact & Social URL Resolvers
  const rawPhone = item.phone || item.whatsapp || '9876543201';
  const cleanPhone = String(rawPhone).replace(/\D/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(
    `Namaste ${item.sellerName || item.driverName || ''}, I found your listing "${item.title || item.name}" on TownHub (${item.location || selectedCity}). I want more details.`
  )}`;

  const telegramUrl = item.telegram
    ? String(item.telegram).startsWith('http')
      ? item.telegram
      : `https://t.me/${String(item.telegram).replace('@', '')}`
    : `https://t.me/+${formattedPhone}`;

  const mapUrl =
    item.mapUrl ||
    (item.lat && item.lng
      ? `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((item.location || '') + ' ' + selectedCity)}`);

  const getAvatarColor = (name = 'U') => {
    const colors = ['bg-red-600', 'bg-blue-600', 'bg-emerald-600', 'bg-purple-600', 'bg-amber-600', 'bg-teal-600'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const sellerDisplayName = item.sellerName || item.driverName || 'Verified Member';
  const sellerInitial = sellerDisplayName.charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between max-w-md mx-auto animate-fade-in text-slate-100 overflow-hidden select-none">
      
      {/* 🌟 1. TOP APP BAR */}
      <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center space-x-1.5 text-xs font-black bg-slate-900 hover:bg-slate-800 text-slate-200 px-3 py-1.5 rounded-xl border border-slate-800 transition active:scale-95 cursor-pointer"
        >
          <span>✕</span>
          <span>Close</span>
        </button>

        <span className="text-xs font-black text-amber-400 uppercase tracking-wider truncate max-w-[170px]">
          {item.subCategory || item.category || 'Listing'}
        </span>

        <span className="text-[10px] font-bold text-slate-400">
          📍 {selectedCity}
        </span>
      </header>

      {/* 🌟 2. SCROLLABLE BODY */}
      <main className="flex-1 overflow-y-auto pb-32 space-y-4">
        
        {/* 🎬 DUAL MEDIA SWITCHER TABS (If listing has videos) */}
        {videos.length > 0 && (
          <div className="px-4 pt-2">
            <div className="flex items-center space-x-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveMediaTab('photos')}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  activeMediaTab === 'photos'
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📷</span>
                <span>Photos ({totalImages})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMediaTab('videos')}
                className={`flex-1 py-1.5 rounded-xl transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                  activeMediaTab === 'videos'
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🎬</span>
                <span>Videos ({videos.length})</span>
              </button>
            </div>
          </div>
        )}

        {/* 📸 A. SWIPEABLE PHOTO CANVAS VIEW */}
        {activeMediaTab === 'photos' && (
          <div className="relative h-80 w-full bg-slate-950 overflow-hidden group">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {gallery.map((imgSrc, idx) => (
                <div
                  key={idx}
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-full h-full min-w-full snap-start shrink-0 relative cursor-zoom-in"
                >
                  <img
                    src={imgSrc}
                    alt={`View ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700';
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Photo Counter */}
            {totalImages > 1 && (
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-black flex items-center space-x-1 border border-white/10 shadow-lg pointer-events-none">
                <span>📷</span>
                <span>{activeImgIndex + 1} / {totalImages}</span>
              </div>
            )}

            {/* Price Badge */}
            <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 shadow-lg pointer-events-none">
              <span className="text-base font-black text-amber-400">
                {item.price || item.rent || item.rates || 'Contact for Price'}
              </span>
            </div>

            {/* Chevrons */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(Math.max(0, activeImgIndex - 1));
                  }}
                  disabled={activeImgIndex === 0}
                  className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer shadow-lg backdrop-blur-xs z-10 ${
                    activeImgIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-slate-900'
                  }`}
                >
                  ❮
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToImage(Math.min(totalImages - 1, activeImgIndex + 1));
                  }}
                  disabled={activeImgIndex === totalImages - 1}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/80 text-white flex items-center justify-center text-xs font-bold transition cursor-pointer shadow-lg backdrop-blur-xs z-10 ${
                    activeImgIndex === totalImages - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-slate-900'
                  }`}
                >
                  ❯
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {totalImages > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 bg-slate-950/60 backdrop-blur-xs px-2.5 py-1 rounded-full pointer-events-none">
                {gallery.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      activeImgIndex === idx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🎬 B. VIDEO PLAYER VIEW (Up to 2 videos, max 60s each) */}
        {activeMediaTab === 'videos' && videos.length > 0 && (
          <div className="px-4 space-y-2">
            <div className="relative h-80 w-full rounded-2xl overflow-hidden bg-black border border-cyan-500/40 shadow-xl flex items-center justify-center">
              <video
                key={videos[activeVideoIdx]?.url}
                src={videos[activeVideoIdx]?.url}
                controls
                autoPlay
                playsInline
                muted={isVideoMuted}
                className="w-full h-full object-contain"
              />

              {/* Video Badges */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5 pointer-events-none">
                <span className="bg-cyan-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-lg shadow-md flex items-center space-x-1">
                  <span>🎬</span>
                  <span>Video {activeVideoIdx + 1}/{videos.length}</span>
                </span>
                {videos[activeVideoIdx]?.duration && (
                  <span className="bg-slate-950/90 text-cyan-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-cyan-400/30">
                    ⏱️ {videos[activeVideoIdx].duration}
                  </span>
                )}
              </div>

              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setIsVideoMuted(!isVideoMuted)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-950 text-white text-xs flex items-center justify-center border border-white/20 cursor-pointer shadow-md transition active:scale-90"
                title={isVideoMuted ? 'Unmute video' : 'Mute video'}
              >
                {isVideoMuted ? '🔇' : '🔊'}
              </button>
            </div>

            {/* Video Switcher Buttons */}
            {videos.length > 1 && (
              <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
                {videos.map((vid, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveVideoIdx(idx)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1.5 ${
                      activeVideoIdx === idx
                        ? 'bg-cyan-400 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>🎬 Video {idx + 1}</span>
                    <span className="text-[10px] opacity-80">({vid.duration || '0:30'})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 🌟 3. LISTING INFO */}
        <div className="px-4 space-y-3.5">
          
          {/* Title & Subcategory Pill */}
          <div className="space-y-1">
            <div className="flex items-start justify-between">
              <h1 className="text-lg font-black text-white leading-snug">
                {item.title || item.name}
              </h1>
              <span className="text-[10px] font-black text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg shrink-0 ml-2">
                {String(item.subCategory || 'VERIFIED').toUpperCase()}
              </span>
            </div>
          </div>

          {/* ⭐ Interest Counter Action Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-900/90 border border-slate-800 rounded-2xl">
            <div>
              <div className="text-xs font-black text-white flex items-center space-x-1">
                <span>⭐</span>
                <span>Hyperlocal Interest Score</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {interestCount} people in {selectedCity} showed interest
              </p>
            </div>

            <button
              type="button"
              onClick={handleIncrementInterest}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center space-x-1"
            >
              <span>⭐</span>
              <span>Interest ({interestCount})</span>
            </button>
          </div>

          {/* 🌟 4. VERIFIED SELLER PROFILE & 1-CLICK SOCIAL CONNECT */}
          <div className="p-3.5 bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 rounded-2xl border border-slate-800 space-y-3 shadow-md">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Seller Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 font-black text-base flex items-center justify-center shadow-md shrink-0">
                  {sellerInitial}
                </div>

                {/* Seller Details */}
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h3 className="font-black text-white text-sm truncate">
                      {sellerDisplayName}
                    </h3>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded-md font-bold shrink-0">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 flex items-center space-x-1.5 mt-0.5 truncate">
                    <span>📍 {item.location || selectedCity}</span>
                    <span>•</span>
                    <span className="text-cyan-300 font-mono font-semibold">
                      📱 +91 {cleanPhone.slice(-10)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* 1-Click Direct Action Buttons: WhatsApp • Telegram • Call */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/80">
              
              {/* 1. WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl flex items-center justify-center space-x-1 text-[11px] font-black transition active:scale-95 shadow-sm"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </a>

              {/* 2. Telegram Button */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/40 rounded-xl flex items-center justify-center space-x-1 text-[11px] font-black transition active:scale-95 shadow-sm"
              >
                <span>✈️</span>
                <span>Telegram</span>
              </a>

              {/* 3. Direct Phone Call */}
              <a
                href={`tel:${cleanPhone}`}
                className="py-2 px-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 rounded-xl flex items-center justify-center space-x-1 text-[11px] font-black transition active:scale-95 shadow-sm"
              >
                <span>📞</span>
                <span>Call Now</span>
              </a>
            </div>
          </div>

          {/* 📄 About This Service / Offering */}
          {item.description && (
            <div className="space-y-1.5 p-3.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <h2 className="text-[11px] font-black text-slate-300 uppercase tracking-wider">
                About this Service / Offering
              </h2>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>
          )}

          {/* 📍 Location & Address with Turn-by-Turn Map Navigation */}
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-cyan-300 uppercase tracking-wider flex items-center space-x-1">
                <span>📍</span>
                <span>Location & Address</span>
              </span>
              {item.lat && item.lng && (
                <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  GPS Verified
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-slate-200">
              {item.location || selectedCity}
            </p>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md active:scale-98 transition cursor-pointer"
            >
              <span>🗺️</span>
              <span>Open Turn-by-Turn Navigation</span>
            </a>
          </div>

          {/* 💬 5. PUBLIC QUESTIONS & ANSWERS */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3.5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div>
                <h3 className="text-xs font-black text-white flex items-center space-x-1.5">
                  <span>💬</span>
                  <span>Questions & Answers ({comments.length})</span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  Ask the seller directly. Only the seller can post official replies.
                </p>
              </div>

              {/* Owner Mode Switch */}
              <button
                type="button"
                onClick={() => setIsSellerMode(!isSellerMode)}
                className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border transition cursor-pointer ${
                  isSellerMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title="Toggle Owner Reply Mode"
              >
                {isSellerMode ? '👑 Owner Mode' : '👤 User Mode'}
              </button>
            </div>

            {/* Q&A List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs font-medium">
                  No questions asked yet. Be the first to ask below!
                </div>
              ) : (
                comments.map((c, idx) => {
                  const avatarBg = getAvatarColor(c.userName || 'U');
                  const initial = (c.userName || 'U').charAt(0).toUpperCase();

                  return (
                    <div key={c.id || idx} className="p-3 bg-slate-950/80 border border-slate-850 rounded-xl space-y-2">
                      
                      {/* Town User Question */}
                      <div className="flex items-start space-x-2.5">
                        <div className={`w-7 h-7 rounded-full ${avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0`}>
                          {initial}
                        </div>

                        <div className="flex-1 space-y-0.5 min-w-0">
                          <div className="flex items-center space-x-1.5 text-[10px]">
                            <span className="font-black text-cyan-300 truncate">
                              @{c.userName?.toLowerCase().replace(/\s+/g, '_') || 'town_user'}
                            </span>
                            <span className="text-slate-500">• {c.timestamp || 'Recently'}</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed font-normal">
                            {c.text}
                          </p>

                          {/* Seller Reply Trigger */}
                          {isSellerMode && !c.sellerReply && (
                            <button
                              type="button"
                              onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                              className="text-[10px] font-bold text-amber-400 hover:text-amber-300 pt-0.5 cursor-pointer"
                            >
                              Reply as Seller ↩
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Nested Verified Seller Reply */}
                      {c.sellerReply && (
                        <div className="ml-8 p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-xl space-y-1">
                          <div className="flex items-center space-x-1.5 text-[10px]">
                            <span className="bg-slate-900 text-amber-300 border border-amber-500/40 px-1.5 py-0.2 rounded-md font-black flex items-center space-x-0.5">
                              <span>👑 {sellerDisplayName}</span>
                              <span className="text-amber-400">✓</span>
                            </span>
                            <span className="text-amber-400/60 text-[9px]">• Official Response</span>
                          </div>
                          <p className="text-xs text-amber-100 leading-relaxed pl-1">
                            {c.sellerReply.text}
                          </p>
                        </div>
                      )}

                      {/* Inline Seller Reply Input */}
                      {isSellerMode && activeReplyId === c.id && !c.sellerReply && (
                        <div className="ml-8 pt-1 flex items-center space-x-1.5">
                          <input
                            type="text"
                            autoFocus
                            placeholder={`Reply as ${sellerDisplayName}...`}
                            value={sellerReplyText}
                            onChange={(e) => setSellerReplyText(e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostSellerReply(c.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs cursor-pointer active:scale-95"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Post Query Input Form */}
            <form onSubmit={handlePostQuery} className="pt-2 border-t border-slate-800 space-y-2">
              <input
                type="text"
                placeholder="Your Name (Optional)"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  required
                  placeholder="Ask a question (price, availability, terms)..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!userQuery.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 disabled:opacity-30 text-white font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition shrink-0"
                >
                  Ask
                </button>
              </div>
            </form>
          </div>

        </div>
      </main>

      {/* 🌟 6. STICKY BOTTOM ACTIONS FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3 z-30 shadow-2xl">
        <ActionButtons
          phone={item.phone || '9876543201'}
          whatsapp={item.whatsapp || item.phone || '919876543210'}
          message={`Namaste ${sellerDisplayName}, I found your listing "${item.title || ''}" on TownHub (${item.location || selectedCity}). Is this available?`}
        />
      </footer>

      {/* 🌟 7. FULL-SCREEN LIGHTBOX */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between animate-fade-in p-4">
          <div className="flex items-center justify-between text-white pb-2">
            <span className="text-xs font-black">
              {activeImgIndex + 1} / {totalImages}
            </span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-black text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            <img
              src={gallery[activeImgIndex]}
              alt="Fullscreen Preview"
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = Math.max(0, activeImgIndex - 1);
                    setActiveImgIndex(nextIdx);
                    scrollToImage(nextIdx);
                  }}
                  disabled={activeImgIndex === 0}
                  className="absolute left-2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-sm font-bold disabled:opacity-30 cursor-pointer"
                >
                  ❮
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const nextIdx = Math.min(totalImages - 1, activeImgIndex + 1);
                    setActiveImgIndex(nextIdx);
                    scrollToImage(nextIdx);
                  }}
                  disabled={activeImgIndex === totalImages - 1}
                  className="absolute right-2 w-10 h-10 rounded-full bg-slate-900/80 text-white flex items-center justify-center text-sm font-bold disabled:opacity-30 cursor-pointer"
                >
                  ❯
                </button>
              </>
            )}
          </div>

          {totalImages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-2 overflow-x-auto">
              {gallery.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb}
                  alt={`Thumb ${idx + 1}`}
                  onClick={() => {
                    setActiveImgIndex(idx);
                    scrollToImage(idx);
                  }}
                  className={`w-12 h-12 rounded-lg object-cover cursor-pointer border-2 transition ${
                    activeImgIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}