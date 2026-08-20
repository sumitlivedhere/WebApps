import React from 'react';
import { hyperlocalStore } from '../store/hyperlocalStore';

const TAG_COLORS = {
  'LISTING LIVE': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'INTEREST REGISTERED': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'NEW COMMENT': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  'SELLER REPLIED': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'FRESH ARRIVAL': 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  'TOWN UPDATE': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

export default function NotificationCenter({ notifications = [], onClose }) {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    hyperlocalStore.markAllNotificationsRead();
  };

  const handleClearAll = () => {
    hyperlocalStore.clearNotifications();
  };

  const handleItemClick = (id) => {
    hyperlocalStore.markNotificationRead(id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔔</span>
            <div>
              <h2 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                Live Town Alerts
              </h2>
              <p className="text-[10px] text-slate-400 font-semibold">
                {unreadCount} new update{unreadCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 active:scale-95 transition"
                >
                  Mark read
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-[10px] font-bold text-slate-400 hover:text-rose-400 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800 active:scale-95 transition"
                >
                  Clear
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-black text-xs active:scale-95 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <span className="text-4xl block">🔕</span>
              <p className="font-bold text-xs mt-2 text-slate-400">All caught up!</p>
              <p className="text-[10px] text-slate-500">
                You will be notified when buyers express interest or reply to your listings.
              </p>
            </div>
          ) : (
            notifications.map((notif) => {
              const tagStyle = TAG_COLORS[notif.tag] || 'bg-slate-800 text-slate-300 border-slate-700';
              return (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif.id)}
                  className={`p-3 rounded-2xl border transition cursor-pointer relative ${
                    notif.read
                      ? 'bg-slate-900/60 border-slate-800/80 text-slate-400'
                      : 'bg-slate-800/90 border-amber-400/30 text-white shadow-md'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  )}

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${tagStyle}`}
                    >
                      {notif.tag}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold">{notif.time}</span>
                  </div>

                  <h3 className={`text-xs font-black mt-1.5 ${notif.read ? 'text-slate-300' : 'text-amber-300'}`}>
                    {notif.title}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}