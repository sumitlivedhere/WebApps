import React from 'react';

export default function NotificationCenter({
  isOpen,
  notifications = [],
  onClose,
  onMarkAllRead,
  onSelectNotification,
}) {
  if (isOpen === false) return null;

  const getTagMeta = (tag = 'ALERT') => {
    const cleanTag = String(tag).toUpperCase();

    if (cleanTag.includes('VOICE')) {
      return {
        icon: '🎙️',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      };
    }
    if (cleanTag.includes('REPLIED') || cleanTag.includes('SELLER')) {
      return {
        icon: '👑',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      };
    }
    if (cleanTag.includes('INTEREST')) {
      return {
        icon: '⭐',
        badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      };
    }
    if (cleanTag.includes('LIVE') || cleanTag.includes('PUBLISHED')) {
      return {
        icon: '🚀',
        badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      };
    }
    if (cleanTag.includes('INQUIRY') || cleanTag.includes('COMMENT')) {
      return {
        icon: '💬',
        badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
      };
    }

    return {
      icon: '🔔',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
    };
  };

  const formatTimestamp = (item) => {
    if (item.time && typeof item.time === 'string' && item.time !== 'Just now') {
      return item.time;
    }
    if (item.created_at) {
      try {
        return new Date(item.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });
      } catch {
        return 'Just now';
      }
    }
    return 'Just now';
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-end justify-center animate-fade-in select-none"
    >
      <style>{`
        @keyframes slideUpDrawer {
          from { transform: translateY(100%); opacity: 0.7; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-drawer {
          animation: slideUpDrawer 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Bottom Sheet Drawer Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border-t border-x border-slate-800 w-full max-w-md rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100 animate-slide-up-drawer pb-6"
      >
        {/* Grab Pill */}
        <div className="pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80"></div>
        </div>

        {/* Drawer Header */}
        <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md">
              🔔
            </span>
            <div>
              <h2 className="text-sm font-black text-white leading-none">
                Town Alerts & Activity
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {notifications.length} updates • Voice & inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {notifications.length > 0 && onMarkAllRead && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 border border-amber-400/30 px-2 py-1 rounded-lg cursor-pointer active:scale-95 transition"
              >
                Mark all read
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-black text-xs flex items-center justify-center cursor-pointer active:scale-95 transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Alerts List */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <span className="text-3xl block">🔕</span>
              <p className="text-xs font-bold text-slate-300">
                No notifications yet
              </p>
              <p className="text-[10px] text-slate-500 max-w-[220px] mx-auto">
                Buyer voice inquiries, seller responses, and interest triggers will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const meta = getTagMeta(n.tag);
              const isUnread = !n.read && !n.is_read;

              return (
                <div
                  key={n.id}
                  onClick={() => onSelectNotification && onSelectNotification(n)}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-3 active:scale-98 ${
                    isUnread
                      ? 'bg-slate-950/90 border-amber-400/40 shadow-md ring-1 ring-amber-400/20'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-75 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sm shrink-0 shadow-inner">
                    {meta.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md border ${meta.badge}`}>
                        {n.tag || 'ALERT'}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {formatTimestamp(n)}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-snug truncate pt-0.5">
                      {n.title}
                    </h3>

                    {n.message && (
                      <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    )}
                  </div>

                  {isUnread && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1 shadow-sm animate-pulse"></span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Expiration Note Footer */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/30 text-center">
          <p className="text-[9px] text-slate-500">
            🔒 Inquiries and voice responses auto-expire after 5 days to keep your feed clean.
          </p>
        </div>
      </div>
    </div>
  );
}