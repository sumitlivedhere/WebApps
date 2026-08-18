import React, { useState } from 'react';

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationClick,
  onClearAll,
}) {
  const [filterType, setFilterType] = useState('all');

  if (!isOpen) return null;

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'alerts') return n.tag?.toLowerCase().includes('alert') || n.tag?.toLowerCase().includes('price');
    if (filterType === 'fresh') return n.tag?.toLowerCase().includes('fresh') || n.tag?.toLowerCase().includes('live');
    if (filterType === 'urgent') return n.tag?.toLowerCase().includes('urgent') || n.tag?.toLowerCase().includes('blood');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end max-w-md mx-auto animate-fade-in">
      <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border-t border-indigo-200">
        
        {/* HEADER */}
        <div className="px-4 py-3.5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shadow-md">
              🔔
            </div>
            <div>
              <h2 className="text-sm font-black text-white leading-tight">
                Town Live Alerts (शहर की ताज़ा हलचल)
              </h2>
              <p className="text-[10px] text-indigo-200">
                Fresh listings, price drops & community notices in Alwar
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* PILL FILTERS */}
        <div className="flex space-x-1.5 px-4 py-2 bg-slate-50 border-b border-slate-200/80 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Alerts (सभी)' },
            { id: 'fresh', label: '⚡ New Nearby (नया सामान)' },
            { id: 'alerts', label: '📉 Price Drops' },
            { id: 'urgent', label: '🚨 Urgent / Seva' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1 rounded-xl text-[10px] font-black whitespace-nowrap transition cursor-pointer ${
                filterType === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NOTIFICATION FEED LIST */}
        <div className="p-3.5 overflow-y-auto space-y-2.5 flex-1">
          {filteredNotifs.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-3xl block mb-1">📭</span>
              <p className="text-xs font-bold text-slate-600">Koi naya alert nahi hai.</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Jaise hi koi naya option aayega, yahan dikhega.</p>
            </div>
          ) : (
            filteredNotifs.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onNotificationClick(notif)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  notif.isRead
                    ? 'bg-white border-slate-200/70 text-slate-700'
                    : 'bg-gradient-to-r from-amber-50/70 via-indigo-50/40 to-white border-amber-300/80 shadow-xs'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                  notif.tag?.includes('Price') ? 'bg-emerald-100 text-emerald-700' :
                  notif.tag?.includes('Fresh') ? 'bg-amber-100 text-amber-800' :
                  'bg-indigo-100 text-indigo-800'
                }`}>
                  {notif.tag?.includes('Price') ? '📉' : notif.tag?.includes('Fresh') ? '⚡' : '📢'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-md">
                      {notif.tag || 'Town Update'}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold">{notif.time}</span>
                  </div>

                  <h3 className="text-xs font-black text-slate-900 mt-1 leading-snug truncate">
                    {notif.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5 leading-snug line-clamp-2">
                    {notif.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* BOTTOM ACTION BAR */}
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <span className="text-[10px] text-slate-500 font-bold">
              {notifications.length} Total Alerts
            </span>
            <button
              type="button"
              onClick={onClearAll}
              className="text-[10px] font-extrabold text-rose-600 hover:text-rose-700 active:scale-95 transition"
            >
              Clear All Alerts
            </button>
          </div>
        )}

      </div>
    </div>
  );
}