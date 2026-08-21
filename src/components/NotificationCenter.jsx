import React, { useState } from 'react';
import { useStoreSlice } from '../store/hyperlocalStore';
import ListingDetailModal from './common/ListingDetailModal';

export default function NotificationFeed({
  notifications = [],
  selectedCity = 'Alwar',
  onClearNotifications,
  onBack,
}) {
  const [selectedListing, setSelectedListing] = useState(null);

  // Grab listings across stores to find matching item for preview
  const propertyListings = useStoreSlice('propertyListings') || [];
  const transportFirms = useStoreSlice('transportFirms') || [];
  const kaarigarWorkers = useStoreSlice('kaarigarWorkers') || [];
  const marketProducts = useStoreSlice('marketProducts') || [];
  const educationListings = useStoreSlice('educationListings') || [];
  const medicalListings = useStoreSlice('medicalListings') || [];
  const whiteCollarListings = useStoreSlice('whiteCollarListings') || [];
  const shaadiVendors = useStoreSlice('shaadiVendors') || [];
  const fitnessListings = useStoreSlice('fitnessListings') || [];
  const creatorsListings = useStoreSlice('creatorsListings') || [];

  const handleNotificationClick = (notif) => {
    if (!notif.targetId) return;

    const allListings = [
      ...propertyListings,
      ...transportFirms,
      ...kaarigarWorkers,
      ...marketProducts,
      ...educationListings,
      ...medicalListings,
      ...whiteCollarListings,
      ...shaadiVendors,
      ...fitnessListings,
      ...creatorsListings,
    ];

    const match = allListings.find((item) => String(item.id) === String(notif.targetId));
    if (match) {
      setSelectedListing(match);
    }
  };

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800 pb-16">
      {/* Header */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900">
            🔔 Activity & Seller Notifications
          </h2>
          <p className="text-[10px] text-slate-500">
            {notifications.length} live activity alerts in {selectedCity}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {notifications.length > 0 && onClearNotifications && (
            <button
              type="button"
              onClick={onClearNotifications}
              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-xl font-bold transition cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onBack}
            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="bg-white/80 rounded-2xl p-8 text-center border border-slate-200 space-y-2">
          <span className="text-3xl">📭</span>
          <h3 className="text-sm font-bold text-slate-800">No New Notifications</h3>
          <p className="text-slate-500 text-xs">
            Inquiries and ⭐ interest actions on your listings will appear here in real-time.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notifications.map((notif, idx) => (
            <article
              key={idx}
              onClick={() => handleNotificationClick(notif)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs hover:shadow-md transition cursor-pointer space-y-1.5 active:scale-99"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                    notif.type === 'interest'
                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                      : notif.type === 'comment'
                      ? 'bg-cyan-100 text-cyan-900 border border-cyan-200'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  {notif.tag || 'ALERT'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">{notif.time || 'Just now'}</span>
              </div>

              <h3 className="text-xs font-black text-slate-900">{notif.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>

              {notif.targetId && (
                <div className="pt-1 text-[10px] font-bold text-cyan-600 flex items-center space-x-1">
                  <span>Tap to view listing & reply</span>
                  <span>→</span>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Listing Preview Modal */}
      {selectedListing && (
        <ListingDetailModal
          item={selectedListing}
          selectedCity={selectedCity}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </main>
  );
}