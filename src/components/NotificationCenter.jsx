import React from 'react';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onClearAll,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t border-slate-200">
        
        {/* HEADER */}
        <div className="px-4 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🔔</span>
            <div>
              <h2 className="text-sm font-black text-slate-900 leading-tight">Town Alerts & Updates</h2>
              <p className="text-[10px] text-slate-500 font-medium">New arrivals & price drop alerts</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[10px] font-bold text-slate-500 hover:text-rose-600 px-2 py-1 bg-white rounded-lg border border-slate-200"
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center font-black text-xs"
            >
              ✕
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="p-4 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-12 text-center">
              <span className="text-4xl">🔕</span>
              <h3 className="text-xs font-bold text-slate-700 mt-2">No active notifications yet</h3>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                Tap <strong>"🔔 Notify Me"</strong> on any product or category to get live town updates here.
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => onNotificationClick(item)}
                className={`pt-3 first:pt-0 cursor-pointer group transition-all`}
              >
                <div className={`p-3 rounded-2xl border transition-all ${
                  item.isRead 
                    ? 'bg-slate-50/70 border-slate-200/70' 
                    : 'bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-500/10'
                }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-100">
                      {item.tag || 'Town Update'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {item.message}
                  </p>

                  <div className="mt-2 flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px]">
                    <span className="text-emerald-700 font-bold">{item.price ? `₹ ${item.price}` : 'Check Listing'}</span>
                    <span className="text-indigo-600 font-black flex items-center group-hover:translate-x-0.5 transition-transform">
                      View Item ➔
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}