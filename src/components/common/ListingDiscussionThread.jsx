import React, { useState, useRef, memo } from 'react';
import { createPortal } from 'react-dom';
import {
  hyperlocalStore,
  useThreadSlice,
  useInterestSlice,
} from '../../store/hyperlocalStore';

function ListingDiscussionThread({
  listingId,
  sellerPhone,
  sellerName,
  listingTitle,
  initialComments = [],
  interestCount = 0,
  onNewNotification,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [replyText, setReplyText] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [isCurrentUserSeller, setIsCurrentUserSeller] = useState(false);

  // Direct O(1) Atomic Store Slices
  const comments = useThreadSlice(listingId, initialComments);
  const interests = useInterestSlice(listingId, interestCount);

  // Synchronous Input Focus References
  const questionInputRef = useRef(null);
  const replyInputRef = useRef(null);

  const handleOpenDiscussion = (e) => {
    e.stopPropagation();
    setIsOpen(true);
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
      hyperlocalStore.incrementInterest(listingId, interestCount, listingTitle, sellerName);
      setHasExpressedInterest(true);

      const notifPayload = {
        id: Date.now(),
        tag: 'INTEREST REGISTERED',
        title: `Interested in "${listingTitle || 'Listing'}"`,
        message: `${sellerName || 'The seller'} was notified of your interest. Total interested: ${interests + 1}`,
        time: 'Just now',
        type: 'interest',
        targetId: listingId,
      };

      hyperlocalStore.addNotification(notifPayload);
      if (onNewNotification) onNewNotification(notifPayload);
    }
  };

  const handlePostQuestion = (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const questionText = newQuestion.trim();
    const newCommentObj = {
      id: `c-${Date.now()}`,
      userName: 'Town Member',
      userArea: 'Local Area',
      text: questionText,
      timestamp: 'Just now',
      isPublic: true,
      sellerReply: null,
    };

    hyperlocalStore.addThreadComment(listingId, newCommentObj, listingTitle);
    setNewQuestion('');

    const notifPayload = {
      id: Date.now(),
      tag: 'NEW COMMENT',
      title: `Query on "${listingTitle || 'Listing'}"`,
      message: `Buyer asked: "${questionText.slice(0, 45)}..."`,
      time: 'Just now',
      type: 'comment',
      targetId: listingId,
    };

    hyperlocalStore.addNotification(notifPayload);
    if (onNewNotification) onNewNotification(notifPayload);
  };

  const handlePostSellerReply = (commentId) => {
    const reply = replyText[commentId];
    if (!reply || !reply.trim()) return;

    const cleanReply = reply.trim();
    const replyObj = {
      text: cleanReply,
      timestamp: 'Just now',
      sellerName: sellerName || 'Verified Seller',
    };

    hyperlocalStore.addSellerReply(listingId, commentId, replyObj, listingTitle);

    const notifPayload = {
      id: Date.now(),
      tag: 'SELLER REPLIED',
      title: `${sellerName || 'Seller'} replied to your question!`,
      message: `Reply: "${cleanReply.slice(0, 45)}..."`,
      time: 'Just now',
      type: 'reply',
      targetId: listingId,
    };

    hyperlocalStore.addNotification(notifPayload);
    if (onNewNotification) onNewNotification(notifPayload);

    setReplyText((prev) => ({ ...prev, [commentId]: '' }));
    setActiveReplyId(null);
  };

  return (
    <>
      {/* 🌟 1. REELS-STYLE FLOATING RIGHT-RAIL OVERLAY */}
      <div className="absolute right-2.5 bottom-3 z-20 flex flex-col items-center space-y-2">
        <button
          type="button"
          onClick={handleExpressInterest}
          className={`flex flex-col items-center justify-center w-10 h-10 rounded-2xl backdrop-blur-md border shadow-lg active:scale-90 transition cursor-pointer ${
            hasExpressedInterest
              ? 'bg-amber-400 border-amber-300 text-slate-950 scale-105 ring-2 ring-amber-300/50 shadow-amber-400/30'
              : 'bg-slate-950/80 hover:bg-slate-950 border-white/20 text-white'
          }`}
          title="Express Interest"
        >
          <span className="text-sm">⭐</span>
          <span className="text-[8px] font-black leading-none mt-0.5">{interests}</span>
        </button>

        <button
          type="button"
          onClick={handleOpenDiscussion}
          className="flex flex-col items-center justify-center w-10 h-10 rounded-2xl bg-slate-950/80 hover:bg-slate-950 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-90 transition cursor-pointer"
          title="Ask Question / View Q&A"
        >
          <span className="text-sm">💬</span>
          <span className="text-[8px] font-black leading-none mt-0.5">{comments.length}</span>
        </button>
      </div>

      {/* 🌟 2. PORTALED BOTTOM SHEET DRAWER */}
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
              <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between shrink-0 rounded-t-3xl">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">💬</span>
                  <div>
                    <h3 className="text-xs font-black text-white leading-tight">
                      Q&A & Offers ({comments.length})
                    </h3>
                    <p className="text-[10px] text-amber-300 font-bold line-clamp-1">
                      {listingTitle || 'Listing Discussion'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsCurrentUserSeller(!isCurrentUserSeller)}
                    className={`text-[9px] font-black px-2.5 py-1 rounded-xl border transition cursor-pointer ${
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
                    <p className="font-bold text-xs text-slate-700">No questions asked yet.</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Type your question or offer in the box below!</p>
                  </div>
                ) : (
                  comments.map((comm) => (
                    <div
                      key={comm.id}
                      className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-extrabold text-slate-900">{comm.userName}</span>
                          <span className="text-[9px] text-slate-400">• {comm.userArea}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-semibold">{comm.timestamp}</span>
                      </div>

                      <p className="text-slate-800 font-medium text-xs leading-snug">
                        {comm.text}
                      </p>

                      {comm.sellerReply && (
                        <div className="ml-2.5 p-2.5 bg-amber-50/80 border-l-3 border-amber-500 rounded-r-xl space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-amber-950">
                              👑 {comm.sellerReply.sellerName} (Author Reply)
                            </span>
                            <span className="text-[9px] text-amber-600 font-semibold">{comm.sellerReply.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-900 font-semibold leading-snug">
                            {comm.sellerReply.text}
                          </p>
                        </div>
                      )}

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
                                className="flex-1 p-2 bg-white border border-amber-400 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                              className="text-[11px] font-black text-amber-700 hover:text-amber-900 cursor-pointer"
                            >
                              ↳ Reply to this query
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
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
                  placeholder="Ask a question or offer price..."
                  className="flex-1 p-3 bg-slate-100 border border-slate-300 focus:border-amber-500 rounded-2xl font-semibold text-slate-900 focus:outline-none focus:bg-white text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 active:scale-95 rounded-2xl font-black text-xs shrink-0 transition cursor-pointer shadow-md"
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

export default memo(ListingDiscussionThread);