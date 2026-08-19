import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ListingDiscussionThread({
  listingId,
  sellerPhone,
  sellerName,
  listingTitle,
  initialComments = [],
  interestCount = 0,
  onNewNotification,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState(initialComments);
  const [interests, setInterests] = useState(interestCount);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState(false);

  // Focus references
  const questionInputRef = useRef(null);
  const replyInputRef = useRef(null);

  // 1. Direct tap triggers focus synchronously to force virtual keyboard open
  const handleOpenDiscussion = (e) => {
    e.stopPropagation();
    setIsOpen(true);
    // Force focus in the event tick for mobile soft keyboard popup
    setTimeout(() => {
      if (questionInputRef.current) {
        questionInputRef.current.focus();
      }
    }, 50);
  };

  const handleOpenReplyBox = (commentId) => {
    setActiveReplyId(commentId);
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus();
      }
    }, 50);
  };

  const handleExpressInterest = (e) => {
    e.stopPropagation();
    if (!hasExpressedInterest) {
      setInterests((prev) => prev + 1);
      setHasExpressedInterest(true);

      if (onNewNotification) {
        onNewNotification({
          id: Date.now(),
          tag: '🔥 New Interest',
          title: `Someone is interested in "${listingTitle || 'your item'}"`,
          message: 'A local buyer has saved and shown interest in this item.',
          time: 'Just now',
          isRead: false,
        });
      }
    }
  };

  // 2. Buyer submits a question
  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const questionText = newQuestion.trim();
    const newCommentObj = {
      id: `c-${Date.now()}`,
      userName: 'Alwar Local Buyer',
      userArea: 'Town Area',
      text: questionText,
      timestamp: 'Just now',
      isPublic: true,
      sellerReply: null,
    };

    setComments((prev) => [newCommentObj, ...prev]);
    setNewQuestion('');

    if (onNewNotification) {
      onNewNotification({
        id: Date.now(),
        tag: '💬 New Query Received',
        title: `Question on "${listingTitle || 'your listing'}"`,
        message: `A buyer asked: "${questionText.slice(0, 45)}..."`,
        time: 'Just now',
        isRead: false,
      });
    }
  };

  // 3. Seller posts official reply
  const handlePostSellerReply = (commentId) => {
    const reply = replyText[commentId];
    if (!reply || !reply.trim()) return;

    const cleanReply = reply.trim();
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              sellerReply: {
                text: cleanReply,
                timestamp: 'Just now',
                sellerName: sellerName || 'Verified Seller',
              },
            }
          : c
      )
    );

    if (onNewNotification) {
      onNewNotification({
        id: Date.now(),
        tag: '👑 Seller Replied',
        title: `${sellerName || 'Seller'} replied to your question!`,
        message: `Reply: "${cleanReply.slice(0, 45)}..."`,
        time: 'Just now',
        isRead: false,
      });
    }

    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  const handleToggleVisibility = (commentId) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, isPublic: !c.isPublic } : c))
    );
  };

  return (
    <>
      {/* 🌟 1. REELS-STYLE FLOATING RIGHT-RAIL OVERLAY */}
      <div className="absolute right-2.5 bottom-3 z-20 flex flex-col items-center space-y-2.5">
        {/* FIRE / INTEREST BUTTON */}
        <button
          type="button"
          onClick={handleExpressInterest}
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full backdrop-blur-md border shadow-lg active:scale-90 transition-all cursor-pointer ${
            hasExpressedInterest
              ? 'bg-amber-400 border-amber-300 text-slate-950 scale-105 ring-2 ring-amber-300/50'
              : 'bg-slate-950/75 hover:bg-slate-950/90 border-white/20 text-white'
          }`}
          title="I'm Interested"
        >
          <span className="text-base">🔥</span>
          <span className="text-[9px] font-black leading-none mt-0.5">{interests}</span>
        </button>

        {/* DISCUSSION / Q&A BUTTON */}
        <button
          type="button"
          onClick={handleOpenDiscussion}
          className="flex flex-col items-center justify-center w-11 h-11 rounded-full bg-slate-950/75 hover:bg-slate-950/90 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-90 transition-all cursor-pointer"
          title="Ask Question / View Discussions"
        >
          <span className="text-base">💬</span>
          <span className="text-[9px] font-black leading-none mt-0.5">{comments.length}</span>
        </button>
      </div>

      {/* 🌟 2. PORTALED BOTTOM SHEET DRAWER (Rendered into document.body for zero layout conflicts) */}
      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex flex-col justify-end max-w-md mx-auto animate-fade-in"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="bg-white rounded-t-3xl max-h-[85vh] h-auto flex flex-col shadow-2xl border-t border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* DRAWER TOP BAR */}
              <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💬</span>
                  <div>
                    <h3 className="text-xs font-black text-white leading-tight">
                      Sawal-Jawab & Offers ({comments.length})
                    </h3>
                    <p className="text-[10px] text-amber-300 font-bold">
                      {listingTitle ? listingTitle.slice(0, 30) : 'Item Q&A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCurrentUserSeller(!isCurrentUserSeller)}
                    className={`text-[9px] font-black px-2.5 py-1 rounded-xl border transition ${
                      isCurrentUserSeller
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                        : 'bg-white/10 text-slate-300 border-white/20'
                    }`}
                  >
                    {isCurrentUserSeller ? '👑 Seller Mode' : '👤 Buyer Mode'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* COMMENTS & REPLIES SCROLLABLE CONTAINER */}
              <div className="p-3.5 space-y-3 overflow-y-auto max-h-[50vh] flex-1 text-xs">
                {comments.length === 0 ? (
                  <div className="text-center py-10 text-slate-400">
                    <span className="text-3xl block mb-1">🗨️</span>
                    <p className="font-bold text-xs text-slate-700">Abhi tak koi sawal nahi hai.</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Niche box me apna sawal ya offer type karein!</p>
                  </div>
                ) : (
                  comments.map((comm) => {
                    if (!comm.isPublic && !isCurrentUserSeller) return null;

                    return (
                      <div
                        key={comm.id}
                        className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-slate-900">{comm.userName}</span>
                            <span className="text-[9px] text-slate-400">• {comm.userArea}</span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[9px] text-slate-400 font-semibold">{comm.timestamp}</span>
                            {isCurrentUserSeller && (
                              <button
                                type="button"
                                onClick={() => handleToggleVisibility(comm.id)}
                                className="text-[9px] font-black px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md"
                              >
                                {comm.isPublic ? '🌐 Public' : '🔒 Private'}
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="text-slate-800 font-medium text-xs leading-snug">
                          {comm.text}
                        </p>

                        {/* SELLER OFFICIAL REPLY (IF PRESENT) */}
                        {comm.sellerReply && (
                          <div className="ml-2.5 p-2.5 bg-indigo-50/80 border-l-3 border-indigo-600 rounded-r-xl space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-indigo-900">
                                👑 {comm.sellerReply.sellerName} (Author Reply)
                              </span>
                              <span className="text-[9px] text-indigo-400">{comm.sellerReply.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-800 font-semibold leading-snug">
                              {comm.sellerReply.text}
                            </p>
                          </div>
                        )}

                        {/* SELLER REPLY COMPONENT */}
                        {isCurrentUserSeller && !comm.sellerReply && (
                          <div className="pt-1 border-t border-slate-200/60 mt-1">
                            {activeReplyId === comm.id ? (
                              <div className="flex space-x-1.5 mt-1.5">
                                <input
                                  ref={replyInputRef}
                                  type="text"
                                  value={replyText[comm.id] || ''}
                                  onChange={(e) =>
                                    setReplyText({ ...replyText, [comm.id]: e.target.value })
                                  }
                                  placeholder="Type your official reply..."
                                  className="flex-1 p-2 bg-white border border-indigo-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => handlePostSellerReply(comm.id)}
                                  className="px-3.5 py-2 bg-slate-950 text-white rounded-xl font-bold text-xs shrink-0 active:scale-95 transition cursor-pointer"
                                >
                                  Reply
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenReplyBox(comm.id)}
                                className="text-[11px] font-black text-indigo-700 hover:text-indigo-900 cursor-pointer"
                              >
                                ↳ Reply to this query
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* 🌟 3. SYNCHRONOUSLY FOCUSED TYPING BAR */}
              <form
                onSubmit={handlePostQuestion}
                className="p-3 bg-white border-t border-slate-200 flex space-x-2 shrink-0 shadow-lg"
              >
                <input
                  ref={questionInputRef}
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Apna sawal ya deal offer yahan likhein..."
                  className="flex-1 p-3 bg-slate-100 border border-slate-300 focus:border-indigo-600 rounded-xl font-semibold text-slate-900 focus:outline-none focus:bg-white text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white rounded-xl font-black text-xs shrink-0 transition cursor-pointer"
                >
                  Send
                </button>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}