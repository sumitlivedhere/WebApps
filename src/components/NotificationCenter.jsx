import React from 'react';

export default function NotificationCenter({
  notifications = [],
  onClose,
  onMarkAllRead,
  onSelectNotification,
}) {
  const getTagBadge = (tag = 'ALERT') => {
    const cleanTag = tag.toUpperCase();
    if (cleanTag.includes('INTEREST')) {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
    if (cleanTag.includes('INQUIRY') || cleanTag.includes('COMMENT')) {
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
    if (cleanTag.includes('REPLIED') || cleanTag.includes('SELLER')) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
    return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
  };

  const getTagIcon = (tag = '') => {
    const clean = tag.toUpperCase();
    if (clean.includes('INTEREST')) return '⭐';
    if (clean.includes('INQUIRY') || clean.includes('COMMENT')) return '💬';
    if (clean.includes('REPLIED')) return '👑';
    return '🔔';
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
          animation: slideUpDrawer 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Bottom Sheet Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border-t border-x border-slate-800 w-full max-w-md rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100 animate-slide-up-drawer pb-6"
      >
        {/* Visual Grab Handle / Drag Pill */}
        <div className="pt-2.5 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 rounded-full bg-slate-700/80"></div>
        </div>

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center space-x-2">
            <span className="text-base">🔔</span>
            <div>
              <h2 className="text-sm font-black text-white leading-none">
                Town Alerts & Activity
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {notifications.length} total updates
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
              <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto">
                Inquiries, seller replies, and interest triggers will show here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNotification && onSelectNotification(n)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-3 active:scale-98 ${
                  n.read
                    ? 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
                    : 'bg-slate-800/80 border-slate-700 shadow-md hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm shrink-0">
                  {getTagIcon(n.tag)}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md border ${getTagBadge(
                        n.tag
                      )}`}
                    >
                      {n.tag || 'ALERT'}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono">
                      {n.time || 'Just now'}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug truncate">
                    {n.title}
                  </h3>

                  {n.message && (
                    <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                      {n.message}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}