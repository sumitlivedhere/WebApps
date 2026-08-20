import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  hyperlocalStore,
  useAllListingsSlice,
} from './store/hyperlocalStore';

export default function ProviderDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [replyInputs, setReplyInputs] = useState({});
  
  // 🌟 Voice Mode Accessibility Switch
  const [isVoiceMode, setIsVoiceMode] = useState(() => {
    return localStorage.getItem('townhub_voice_mode') === 'true';
  });
  
  // Speech Synthesis & Recognition States
  const [speakingId, setSpeakingId] = useState(null);
  const [listeningId, setListeningId] = useState(null);
  const recognitionRef = useRef(null);

  const allListings = useAllListingsSlice();

  // Save voice preference
  const toggleVoiceMode = () => {
    const nextVal = !isVoiceMode;
    setIsVoiceMode(nextVal);
    localStorage.setItem('townhub_voice_mode', String(nextVal));

    if (nextVal) {
      speakText('आवाज़ मोड चालू हो गया है। अब आप सारे संदेश सुन सकते हैं और बोलकर जवाब दे सकते हैं।', 'mode-toggle');
    } else {
      stopSpeaking();
    }
  };

  // 1. Listings portfolio
  const myListings = useMemo(() => {
    return (allListings || []).slice(0, 4);
  }, [allListings]);

  // 2. Aggregated customer questions/threads
  const userInquiries = useMemo(() => {
    const threadMap = hyperlocalStore.state.threads || {};
    const inquiries = [];

    myListings.forEach((listing) => {
      const listingComments = threadMap[listing.id] || [
        {
          id: `demo-${listing.id}-1`,
          userName: 'Ramesh Gurjar (Moti Dungri)',
          userArea: 'Alwar',
          text: 'Kya yeh abhi available hai? Thoda price kam ho sakta hai kya?',
          timestamp: '15m ago',
          isPublic: true,
          sellerReply: null,
        },
      ];

      listingComments.forEach((comm) => {
        inquiries.push({
          ...comm,
          listingId: listing.id,
          listingTitle: listing.title || listing.name,
          listingPrice: listing.price || listing.rates,
          listingImage: listing.image || (listing.images && listing.images[0]),
        });
      });
    });

    return inquiries;
  }, [myListings, allListings]);

  // 3. Computed Metrics
  const totalInterests = useMemo(() => {
    const interestMap = hyperlocalStore.state.interests || {};
    return myListings.reduce((sum, item) => sum + (interestMap[item.id] || item.interestCount || 4), 0);
  }, [myListings]);

  const pendingInquiriesCount = useMemo(() => {
    return userInquiries.filter((q) => !q.sellerReply).length;
  }, [userInquiries]);

  // Text-To-Speech (TTS) Engine
  const speakText = (text, id) => {
    if (!('speechSynthesis' in window)) {
      alert('Audio narration not supported on this browser.');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.90;
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeakingId(id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);
  };

  // Speech-To-Text (Voice Dictation) Engine
  const handleStartVoiceDictation = (commentId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Voice dictation is not supported on this browser. Please type your reply.');
      return;
    }

    if (listeningId === commentId) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setListeningId(null);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Supports Hindi and Indian English mix
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListeningId(commentId);
      };

      recognition.onresult = (event) => {
        const spokenTranscript = event.results[0][0].transcript;
        setReplyInputs((prev) => ({
          ...prev,
          [commentId]: prev[commentId] ? `${prev[commentId]} ${spokenTranscript}` : spokenTranscript,
        }));
        setListeningId(null);
      };

      recognition.onerror = () => {
        setListeningId(null);
      };

      recognition.onend = () => {
        setListeningId(null);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setListeningId(null);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Audio Summary for Dashboard Overview
  const handleReadFullSummary = () => {
    const summaryScript = `आपके कुल ${myListings.length} विज्ञापन चालू हैं। ${totalInterests} ग्राहकों ने रुचि दिखाई है। और ${pendingInquiriesCount} नए सवालों का जवाब देना बाकी है।`;
    speakText(summaryScript, 'dashboard-summary');
  };

  // Direct Reply Dispatcher
  const handleSendReply = (listingId, commentId, listingTitle) => {
    const text = (replyInputs[commentId] || '').trim();
    if (!text) return;

    const replyObj = {
      text,
      timestamp: 'Just now',
      sellerName: 'You (Owner)',
    };

    hyperlocalStore.addSellerReply(listingId, commentId, replyObj, listingTitle);
    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));

    if (isVoiceMode) {
      speakText('आपका जवाब ग्राहक को भेज दिया गया है।', `sent-${commentId}`);
    }
  };

  const handleQuickPreset = (commentId, presetText) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: presetText }));
    if (isVoiceMode) {
      speakText(presetText, `preset-${commentId}`);
    }
  };

  return (
    <main className="p-3.5 space-y-3.5 animate-fade-in text-slate-800 pb-28">
      {/* 🌟 1. HEADER WITH VOICE MODE ACCESSIBILITY SWITCH */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-4 rounded-3xl text-white shadow-xl flex items-center justify-between border border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-xl font-black shadow-md">
            📊
          </div>
          <div>
            <h1 className="text-sm font-black text-white leading-tight">
              Business Hub (ग्राहक बातचीत)
            </h1>
            <p className="text-[10px] text-amber-300 font-bold">
              Inquiries, Buyer Leads & Voice Assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      {/* 🌟 2. VOICE MODE ACCESSIBILITY CONTROLLER SWITCH */}
      <div className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-lg ${
        isVoiceMode
          ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border-amber-400/80 ring-2 ring-amber-400/30'
          : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black transition ${
            isVoiceMode ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse' : 'bg-slate-800 text-slate-400'
          }`}>
            🎙️
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white">
                आवाज़ मोड (Voice Assistant)
              </span>
              {isVoiceMode && (
                <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase">
                  Active
                </span>
              )}
            </div>
            <p className="text-[10px] text-slate-300 font-medium">
              संदेश बोलकर सुनें और बोलकर जवाब दें
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          onClick={toggleVoiceMode}
          className={`w-12 h-6.5 rounded-full p-0.5 transition duration-300 cursor-pointer flex items-center ${
            isVoiceMode ? 'bg-amber-400 justify-end' : 'bg-slate-700 justify-start'
          }`}
          title="Toggle Voice Mode"
        >
          <div className="w-5.5 h-5.5 rounded-full bg-slate-950 shadow-md"></div>
        </button>
      </div>

      {/* 🌟 3. VOICE-GUIDED SUMMARY & METRICS TILES */}
      <div className="space-y-2">
        {isVoiceMode && (
          <button
            type="button"
            onClick={handleReadFullSummary}
            className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 rounded-2xl font-black text-xs shadow-md active:scale-98 transition flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>{speakingId === 'dashboard-summary' ? '🔊 बोल रहा है...' : '🔈 पूरा हिसाब बोलकर सुनें'}</span>
          </button>
        )}

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5 shadow-md">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
              Active Ads
            </span>
            <span className="text-lg font-black text-amber-400">{myListings.length}</span>
            <span className="text-[9px] text-emerald-400 font-bold block">● Live</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5 shadow-md">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
              Interested
            </span>
            <span className="text-lg font-black text-cyan-400">🔥 {totalInterests}</span>
            <span className="text-[9px] text-cyan-300 font-bold block">Buyers</span>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5 shadow-md">
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
              Questions
            </span>
            <span className="text-lg font-black text-rose-400">💬 {pendingInquiriesCount}</span>
            <span className="text-[9px] text-rose-300 font-bold block">Need Reply</span>
          </div>
        </div>
      </div>

      {/* 🌟 4. NAVIGATION TABS */}
      <div className="flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800 shadow-inner">
        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'inquiries'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>💬 Customer Queries</span>
          {pendingInquiriesCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
              {pendingInquiriesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`flex-1 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center space-x-1.5 ${
            activeTab === 'listings'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>📦 My Listings ({myListings.length})</span>
        </button>
      </div>

      {/* 🌟 5. TAB CONTENT: CUSTOMER INQUIRIES WITH AUDIO & MIC CAPABILITIES */}
      {activeTab === 'inquiries' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Buyer Questions & Offers (ग्राहक के सवाल)
            </h2>
            <span className="text-[10px] text-slate-500">
              {isVoiceMode ? 'Tap 🔊 to listen' : 'Instant direct reply'}
            </span>
          </div>

          {userInquiries.length === 0 ? (
            <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-1">
              <span className="text-3xl block">📭</span>
              <p className="text-xs font-bold text-slate-300">No customer questions yet.</p>
              <p className="text-[10px]">When local buyers ask about your items, they appear here.</p>
            </div>
          ) : (
            userInquiries.map((inq) => {
              const isSpeakingThis = speakingId === inq.id;
              const isListeningThis = listeningId === inq.id;

              return (
                <div
                  key={inq.id}
                  className={`bg-white rounded-2xl border p-3.5 space-y-3 shadow-md transition ${
                    isSpeakingThis ? 'ring-2 ring-amber-400 border-amber-400' : 'border-slate-200'
                  }`}
                >
                  {/* Context Item Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <img
                        src={inq.listingImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                        alt={inq.listingTitle}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-black text-slate-900 truncate">
                          {inq.listingTitle}
                        </h3>
                        <span className="text-[10px] font-bold text-amber-600 block">
                          {inq.listingPrice}
                        </span>
                      </div>
                    </div>

                    {/* 🔊 Audio Play Button for Question */}
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `ग्राहक ${inq.userName} ने पूछा है: ${inq.text}`,
                          inq.id
                        )
                      }
                      className={`px-2.5 py-1.5 rounded-xl font-black text-[10px] flex items-center space-x-1 shrink-0 transition active:scale-90 cursor-pointer ${
                        isSpeakingThis
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/40 animate-bounce'
                          : 'bg-slate-100 hover:bg-amber-100 text-slate-800 border border-slate-200'
                      }`}
                      title="बोलकर सुनें (Listen aloud)"
                    >
                      <span>{isSpeakingThis ? '🔊' : '🔈'}</span>
                      <span>{isSpeakingThis ? 'सुन रहे हैं' : 'सुनाएँ'}</span>
                    </button>
                  </div>

                  {/* Buyer Query Message */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-slate-900">👤 {inq.userName}</span>
                      <span className="text-slate-400 font-semibold">{inq.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">"{inq.text}"</p>
                  </div>

                  {/* Existing Reply */}
                  {inq.sellerReply ? (
                    <div className="bg-amber-50 border-l-3 border-amber-500 p-2.5 rounded-r-xl space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-amber-900">
                          👑 Your Reply ({inq.sellerReply.timestamp}):
                        </span>
                        <button
                          type="button"
                          onClick={() => speakText(`आपने जवाब दिया: ${inq.sellerReply.text}`, `reply-${inq.id}`)}
                          className="text-[9px] text-amber-700 font-bold hover:underline cursor-pointer"
                        >
                          🔈 सुनें
                        </button>
                      </div>
                      <p className="text-xs text-slate-900 font-semibold">{inq.sellerReply.text}</p>
                    </div>
                  ) : (
                    /* Reply Section with Voice Dictation (Mic) */
                    <div className="space-y-2 pt-1">
                      {/* Quick Response Chips */}
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
                        {['हाँ, उपलब्ध है', 'दुकान पर देख सकते हैं', 'कीमत फिक्स है', 'WhatsApp करें'].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => handleQuickPreset(inq.id, chip)}
                            className="text-[10px] bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 px-2 py-1 rounded-lg font-bold shrink-0 transition border border-slate-200 cursor-pointer flex items-center space-x-1"
                          >
                            <span>+</span>
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>

                      {/* Reply Input + Mic Button + Send */}
                      <div className="flex items-center space-x-1.5">
                        {/* 🎙️ Big Tactile Mic Button for Dictation */}
                        <button
                          type="button"
                          onClick={() => handleStartVoiceDictation(inq.id)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-base font-black transition active:scale-90 cursor-pointer shrink-0 shadow-sm ${
                            isListeningThis
                              ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-ping'
                              : isVoiceMode
                              ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                          title="बोलकर लिखें (Speak to reply)"
                        >
                          {isListeningThis ? '⏹️' : '🎙️'}
                        </button>

                        <input
                          type="text"
                          value={replyInputs[inq.id] || ''}
                          onChange={(e) =>
                            setReplyInputs({ ...replyInputs, [inq.id]: e.target.value })
                          }
                          placeholder={isListeningThis ? 'बोलिए, आवाज़ रिकॉर्ड हो रही है...' : 'Type or use 🎙️ mic to speak...'}
                          className={`flex-1 px-3 py-2 border rounded-xl text-xs font-semibold focus:outline-none transition ${
                            isListeningThis
                              ? 'bg-rose-50 border-rose-400 text-rose-950 placeholder-rose-400'
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500 focus:bg-white'
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() => handleSendReply(inq.listingId, inq.id, inq.listingTitle)}
                          className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black text-xs active:scale-95 transition cursor-pointer shrink-0 shadow-md"
                        >
                          Send
                        </button>
                      </div>

                      {isListeningThis && (
                        <p className="text-[10px] text-rose-600 font-bold text-center animate-pulse">
                          ● माइक चालू है: साफ़ आवाज़ में अपना जवाब बोलें...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {/* 🌟 6. TAB CONTENT: MANAGE ACTIVE LISTINGS WITH AUDIO LABELS */}
      {activeTab === 'listings' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Manage Your Listings (आपकी लिस्टिंग्स)
            </h2>
            <span className="text-[10px] text-amber-400 font-bold">● All Active</span>
          </div>

          <div className="space-y-2.5">
            {myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-3 flex items-center justify-between shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.image || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200'}
                    alt={item.title || item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded-md inline-block">
                      {item.category} • {item.subCategory}
                    </span>
                    <h3 className="text-xs font-black text-slate-900 truncate mt-0.5">
                      {item.title || item.name}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-600">
                      {item.price || item.rates || 'Rate on Request'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1.5 shrink-0 pl-2">
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    🟢 Active
                  </span>

                  {/* 🔊 Audio Item Details */}
                  {isVoiceMode && (
                    <button
                      type="button"
                      onClick={() =>
                        speakText(
                          `विज्ञापन: ${item.title || item.name}, कीमत: ${item.price || 'उपलब्ध'}, ${item.interestCount || 4} लोगों ने रुचि दिखाई है।`,
                          `item-${item.id}`
                        )
                      }
                      className="text-[9px] bg-slate-100 hover:bg-amber-100 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 font-bold"
                    >
                      🔈 विवरण सुनें
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}