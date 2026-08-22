import React, { useState, useMemo, useEffect, useRef } from 'react';
import { hyperlocalStore, useAllListingsSlice } from './store/hyperlocalStore';
import VoiceNotePlayer from './components/common/VoiceNotePlayer';
import {
  getOptimizedVoiceStream,
  createOptimizedMediaRecorder,
  compressAudioBlob,
} from './utils/audioCompressor';

export default function ProviderDashboard({ onBack }) {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [replyInputs, setReplyInputs] = useState({});

  // 🎙️ Pure Audio Recording State
  const [recordingId, setRecordingId] = useState(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isCompressingAudio, setIsCompressingAudio] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  const allListings = useAllListingsSlice();

  // 1. Provider's Active Listings Portfolio
  const myListings = useMemo(() => {
    return (allListings || []).slice(0, 4);
  }, [allListings]);

  // 2. Aggregated customer questions & audio voice inquiries
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
          audioUrl: null,
          audioDuration: null,
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

  // 3. Metrics Calculation
  const totalInterests = useMemo(() => {
    const interestMap = hyperlocalStore.state.interests || {};
    return myListings.reduce(
      (sum, item) => sum + (interestMap[item.id] || item.interestCount || 4),
      0
    );
  }, [myListings]);

  const pendingInquiriesCount = useMemo(() => {
    return userInquiries.filter((q) => !q.sellerReply).length;
  }, [userInquiries]);

  // 🎙️ 1. Start Voice Recording (16kHz Mono Stream)
  const handleStartRecording = async (commentId) => {
    try {
      const stream = await getOptimizedVoiceStream();
      audioChunksRef.current = [];

      const mediaRecorder = createOptimizedMediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start(100);
      setRecordingId(commentId);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied. Please allow microphone access in your browser settings.');
    }
  };

  // 🎙️ 2. Stop Recording & Compress Voice Note with Gzip
  const handleStopAndSendAudio = (listingId, commentId, listingTitle) => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.onstop = async () => {
      clearInterval(timerRef.current);
      setIsCompressingAudio(true);

      try {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });

        // Compress audio payload
        const compressedAudioString = await compressAudioBlob(audioBlob);
        const durationStr = `0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`;

        const replyObj = {
          type: 'audio',
          audioUrl: compressedAudioString,
          duration: durationStr,
          timestamp: 'Just now',
          sellerName: 'You (Owner)',
        };

        hyperlocalStore.addSellerReply(listingId, commentId, replyObj, listingTitle);
      } catch (err) {
        console.error('Audio compression failed:', err);
      } finally {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
        setRecordingId(null);
        setRecordingSeconds(0);
        setIsCompressingAudio(false);
      }
    };

    mediaRecorder.stop();
  };

  // 🎙️ 3. Cancel Recording
  const handleCancelRecording = () => {
    if (mediaRecorderRef.current) {
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      setRecordingId(null);
      setRecordingSeconds(0);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ✍️ Send Text Reply
  const handleSendTextReply = (listingId, commentId, listingTitle) => {
    const text = (replyInputs[commentId] || '').trim();
    if (!text) return;

    const replyObj = {
      type: 'text',
      text,
      timestamp: 'Just now',
      sellerName: 'You (Owner)',
    };

    hyperlocalStore.addSellerReply(listingId, commentId, replyObj, listingTitle);
    setReplyInputs((prev) => ({ ...prev, [commentId]: '' }));
  };

  const handleQuickPreset = (commentId, presetText) => {
    setReplyInputs((prev) => ({ ...prev, [commentId]: presetText }));
  };

  return (
    <main className="p-3.5 space-y-3.5 animate-fade-in text-slate-800 pb-28 select-none">
      {/* 🌟 1. HEADER */}
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
              Compressed Voice Notes & Buyer Inquiries
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

      {/* 🌟 2. METRICS TILES */}
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
            Inquiries
          </span>
          <span className="text-lg font-black text-rose-400">💬 {pendingInquiriesCount}</span>
          <span className="text-[9px] text-rose-300 font-bold block">Need Reply</span>
        </div>
      </div>

      {/* 🌟 3. NAVIGATION TABS */}
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

      {/* 🌟 4. CUSTOMER INQUIRIES WITH COMPRESSED REAL VOICE NOTES */}
      {activeTab === 'inquiries' && (
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider">
              Buyer Questions & Voice Notes ({userInquiries.length})
            </h2>
            <span className="text-[10px] text-amber-400 font-bold">
              🎙️ Tap mic to record voice note
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
              const isRecordingThis = recordingId === inq.id;

              return (
                <div
                  key={inq.id}
                  className="bg-white rounded-2xl border border-slate-200 p-3.5 space-y-3 shadow-md transition"
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

                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
                      {inq.timestamp}
                    </span>
                  </div>

                  {/* Buyer Inquiry: Pure Voice Note OR Text */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-extrabold text-slate-900">👤 {inq.userName}</span>
                      <span className="text-slate-400 text-[9px]">Customer Inquiry</span>
                    </div>

                    {inq.audioUrl ? (
                      <VoiceNotePlayer
                        audioUrl={inq.audioUrl}
                        duration={inq.audioDuration}
                        senderName={inq.userName.split(' ')[0]}
                      />
                    ) : (
                      <p className="text-xs text-slate-800 font-medium italic">"{inq.text}"</p>
                    )}
                  </div>

                  {/* Seller Reply Box */}
                  {inq.sellerReply ? (
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-2.5 rounded-r-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-emerald-900">
                          👑 Your Reply ({inq.sellerReply.timestamp}):
                        </span>
                      </div>

                      {inq.sellerReply.type === 'audio' ? (
                        <VoiceNotePlayer
                          audioUrl={inq.sellerReply.audioUrl}
                          duration={inq.sellerReply.duration}
                          senderName="Your Voice Note"
                        />
                      ) : (
                        <p className="text-xs text-slate-900 font-semibold">{inq.sellerReply.text}</p>
                      )}
                    </div>
                  ) : (
                    /* Interactive Reply Bar */
                    <div className="space-y-2 pt-1">
                      {/* Quick Response Chips */}
                      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
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

                      {/* Active Recording State vs. Normal Input */}
                      {isRecordingThis ? (
                        <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-300 rounded-2xl animate-pulse">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                            <span className="text-xs font-black text-rose-700">
                              {isCompressingAudio
                                ? 'Compressing Voice Note...'
                                : `Recording: 0:${recordingSeconds < 10 ? '0' : ''}${recordingSeconds}`}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <button
                              type="button"
                              onClick={handleCancelRecording}
                              disabled={isCompressingAudio}
                              className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStopAndSendAudio(inq.listingId, inq.id, inq.listingTitle)}
                              disabled={isCompressingAudio}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95"
                            >
                              {isCompressingAudio ? 'Sending...' : 'Send Audio ➔'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1.5">
                          <button
                            type="button"
                            onClick={() => handleStartRecording(inq.id)}
                            title="Record Pure Audio Voice Note"
                            className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center text-base font-black shadow-md transition active:scale-90 cursor-pointer shrink-0"
                          >
                            🎙️
                          </button>

                          <input
                            type="text"
                            value={replyInputs[inq.id] || ''}
                            onChange={(e) =>
                              setReplyInputs({ ...replyInputs, [inq.id]: e.target.value })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSendTextReply(inq.listingId, inq.id, inq.listingTitle);
                              }
                            }}
                            placeholder="Type reply or tap mic for voice note..."
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => handleSendTextReply(inq.listingId, inq.id, inq.listingTitle)}
                            className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-black text-xs active:scale-95 transition cursor-pointer shrink-0 shadow-md"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      )}

      {/* 🌟 5. MANAGE ACTIVE LISTINGS */}
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

                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  🟢 Active
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}