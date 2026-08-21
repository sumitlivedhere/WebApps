import React, { useState, useRef, useEffect } from 'react';
import { useThreadSlice, useInterestSlice, hyperlocalStore } from '../../store/hyperlocalStore';

export default function ListingDiscussionThread({
  listingId,
  listingTitle = 'Listing',
  sellerName = 'Verified Seller',
  sellerPhone = '',
  initialInterestCount = 0,
  variant = 'corner', // 'corner' | 'reels'
  onNewNotification,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSellerMode, setIsSellerMode] = useState(false);

  // 🛡️ Confirmation State before final dispatch
  const [pendingConfirmQuery, setPendingConfirmQuery] = useState(null);

  const comments = useThreadSlice(listingId, []);
  const interestCount = useInterestSlice(listingId, initialInterestCount);
  const inputRef = useRef(null);

  // 🎙️ Web Speech API (Hold or Tap to Speak)
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setNewComment((prev) => {
            const cleanPrev = prev ? prev.trim() + ' ' : '';
            return cleanPrev + transcript.trim();
          });
        }
      };

      rec.onerror = () => setIsRecording(false);
      rec.onend = () => setIsRecording(false);
      recognitionRef.current = rec;
    }
  }, []);

  const startVoice = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported in this browser. Please type.');
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch {}
  };

  const stopVoice = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleIncrementInterest = (e) => {
    e.stopPropagation();
    hyperlocalStore.incrementInterest(listingId, interestCount, listingTitle, sellerName);
  };

  // Step 1: Stage query for review & confirmation
  const handleInitiateSend = (e) => {
    if (e) e.preventDefault();
    if (!newComment.trim()) return;

    stopVoice();
    setPendingConfirmQuery({
      senderName: userName.trim() || 'Town User',
      queryText: newComment.trim(),
    });
  };

  // Step 2: Final dispatch on confirmation
  const handleConfirmAndSend = () => {
    if (!pendingConfirmQuery) return;

    const { senderName, queryText } = pendingConfirmQuery;

    // Persist to store & Supabase
    hyperlocalStore.addThreadComment(
      listingId,
      {
        userName: senderName,
        text: queryText,
        isPublic: true,
      },
      listingTitle
    );

    // Alert the seller
    if (onNewNotification) {
      onNewNotification({
        tag: 'NEW INQUIRY',
        title: `Query on "${listingTitle}"`,
        message: `${senderName} asked: "${queryText}"`,
        time: 'Just now',
        type: 'comment',
        targetId: listingId,
      });
    }

    setNewComment('');
    setPendingConfirmQuery(null);
  };

  // Seller exclusive reply
  const handlePostReply = (commentId) => {
    if (!replyText.trim()) return;

    hyperlocalStore.addSellerReply(
      listingId,
      commentId,
      { text: replyText.trim() },
      listingTitle
    );

    setReplyText('');
    setActiveReplyId(null);
  };

  const getAvatarColor = (name = 'U') => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-purple-500', 'bg-amber-500', 'bg-teal-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <>
      {/* 🌟 1. CARD CORNER BADGES */}
      {variant === 'corner' && (
        <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5 z-10">
          <button
            type="button"
            onClick={handleIncrementInterest}
            className="px-2 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-amber-300 border border-amber-400/30 text-[10px] font-black flex items-center space-x-1 backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md"
          >
            <span>⭐</span>
            <span>{interestCount}</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="px-2 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-950 text-slate-200 border border-white/20 text-[10px] font-black flex items-center space-x-1 backdrop-blur-xs transition active:scale-90 cursor-pointer shadow-md"
          >
            <span>💬</span>
            <span>{comments.length}</span>
          </button>
        </div>
      )}

      {variant === 'reels' && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className="flex flex-col items-center justify-center group active:scale-75 transition cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full bg-slate-950/85 hover:bg-slate-950 backdrop-blur-md border border-slate-700 flex items-center justify-center text-base shadow-xl group-hover:border-cyan-300 transition">
            💬
          </div>
          <span className="text-[10px] font-black text-white drop-shadow-md mt-0.5">
            {comments.length > 0 ? comments.length : 'Ask'}
          </span>
        </button>
      )}

      {/* 🌟 2. BOTTOM TRAY SHEET */}
      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-end justify-center animate-fade-in"
        >
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          <div className="relative z-10 bg-[#121212] border-t border-zinc-800 rounded-t-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl text-zinc-100 animate-slide-up">
            
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mt-2.5 mb-1" />

            {/* Header Bar */}
            <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-white flex items-center space-x-1.5">
                  <span>💬</span>
                  <span>Questions & Inquiries ({comments.length})</span>
                </h2>
                <p className="text-[10px] text-zinc-400 truncate max-w-[220px]">
                  {listingTitle}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSellerMode(!isSellerMode)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                    isSellerMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  {isSellerMode ? '👑 Owner Mode' : '👤 User Mode'}
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Q&A Comments Stream */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 max-h-[46vh]">
              {comments.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <span className="text-3xl text-zinc-600">🔍</span>
                  <p className="text-xs text-zinc-400 font-medium">
                    No inquiries yet. Use the Google-style ask bar below to ask!
                  </p>
                </div>
              ) : (
                comments.map((c, idx) => {
                  const userInitial = (c.userName || 'U').charAt(0).toUpperCase();
                  const avatarBg = getAvatarColor(c.userName || 'U');

                  return (
                    <div key={c.id || idx} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full ${avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                          {userInitial}
                        </div>

                        <div className="flex-1 space-y-0.5 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[11px] font-bold text-zinc-200 truncate">
                              @{c.userName?.toLowerCase().replace(/\s+/g, '_') || 'town_user'}
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              • {c.timestamp || 'Just now'}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-100 leading-relaxed break-words font-normal">
                            {c.text}
                          </p>

                          {isSellerMode && !c.sellerReply && (
                            <div className="pt-1">
                              <button
                                type="button"
                                onClick={() => setActiveReplyId(activeReplyId === c.id ? null : c.id)}
                                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition cursor-pointer"
                              >
                                Reply as Owner ↩
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Nested Seller Reply */}
                      {c.sellerReply && (
                        <div className="ml-11 flex items-start space-x-2.5 pt-1">
                          <div className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px] flex items-center justify-center shrink-0 shadow-md">
                            👑
                          </div>

                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="bg-zinc-800 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full text-[10px] font-black flex items-center space-x-0.5">
                                <span>{sellerName}</span>
                                <span className="text-amber-400">✓</span>
                              </span>
                              <span className="text-[9px] text-zinc-500">• Verified Response</span>
                            </div>

                            <p className="text-xs text-zinc-200 leading-relaxed break-words font-normal">
                              {c.sellerReply.text}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Seller Inline Reply */}
                      {isSellerMode && activeReplyId === c.id && !c.sellerReply && (
                        <div className="ml-11 pt-1.5 flex items-center space-x-2">
                          <input
                            type="text"
                            autoFocus
                            placeholder={`Reply as ${sellerName}...`}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400"
                          />
                          <button
                            type="button"
                            onClick={() => handlePostReply(c.id)}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-xs cursor-pointer active:scale-95"
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

            {/* 🌟 3. GOOGLE-STYLE ASK SEARCH BAR */}
            <div className="p-3.5 border-t border-zinc-800 bg-[#161616] space-y-2.5">
              
              <div className="flex items-center justify-between px-2">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-transparent text-[11px] text-zinc-300 placeholder-zinc-500 focus:outline-hidden"
                />
                {isRecording && (
                  <span className="text-[10px] text-rose-400 font-bold animate-pulse flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>Listening... Release / tap mic to stop</span>
                  </span>
                )}
              </div>

              {/* Google Search Bar Pill */}
              <form onSubmit={handleInitiateSend} className="relative">
                <div className={`flex items-center bg-[#202124] border rounded-full px-4 py-2.5 shadow-xl transition ${
                  isRecording ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-zinc-700/80 focus-within:border-zinc-500'
                }`}>
                  
                  {/* Google-Style Magnifying Search Icon */}
                  <span className="text-zinc-400 text-sm mr-2.5">🔍</span>

                  {/* Input field */}
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={isRecording ? 'Speaking...' : 'Ask about price, availability, timings...'}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-white placeholder-zinc-400 focus:outline-hidden"
                  />

                  {/* Google-Style Mic Button (Hold or Tap) */}
                  <button
                    type="button"
                    onMouseDown={startVoice}
                    onMouseUp={stopVoice}
                    onTouchStart={startVoice}
                    onTouchEnd={stopVoice}
                    onClick={() => {
                      if (isRecording) stopVoice();
                      else startVoice();
                    }}
                    className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center text-sm transition cursor-pointer select-none ${
                      isRecording
                        ? 'bg-rose-600 text-white animate-pulse shadow-lg scale-110'
                        : 'text-zinc-300 hover:text-white hover:bg-zinc-700/60'
                    }`}
                    title="Hold or Tap to speak"
                  >
                    🎙️
                  </button>

                  {/* Ask / Send Button */}
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="ml-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white font-black text-xs rounded-full transition cursor-pointer active:scale-95 shrink-0"
                  >
                    Ask
                  </button>
                </div>
              </form>
            </div>

            {/* 🌟 4. CONFIRMATION SHEET (Before Sending) */}
            {pendingConfirmQuery && (
              <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-sm rounded-t-3xl flex items-center justify-center p-4 animate-fade-in">
                <div className="bg-[#1f1f1f] border border-zinc-700 rounded-2xl p-4 w-full max-w-sm space-y-3.5 shadow-2xl">
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-base">💬</span>
                    <h3 className="text-xs font-black text-white">Confirm Question to Seller</h3>
                  </div>

                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl space-y-1">
                    <div className="text-[10px] text-zinc-400">
                      Sending as: <strong className="text-cyan-300">{pendingConfirmQuery.senderName}</strong>
                    </div>
                    <p className="text-xs text-zinc-100 font-medium leading-relaxed">
                      "{pendingConfirmQuery.queryText}"
                    </p>
                  </div>

                  <p className="text-[10px] text-zinc-400">
                    This question will be sent directly to <strong>{sellerName}</strong> and published publicly on the listing.
                  </p>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={handleConfirmAndSend}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-lg transition cursor-pointer active:scale-95"
                    >
                      ✓ Confirm & Send
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingConfirmQuery(null)}
                      className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      ✎ Edit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}