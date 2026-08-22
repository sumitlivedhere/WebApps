import React, { useState } from 'react';
import { submitListingReport } from '../../services/authService';

export default function ReportModal({
  isOpen,
  listing,
  reporterPhone = '9876543210',
  onClose,
  onSuccess,
}) {
  if (!isOpen || !listing) return null;

  const [reason, setReason] = useState('Spam / Repetitive Posting');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const reportReasons = [
    'Spam / Repetitive Posting',
    'Fake Price or Rates',
    'Wrong Category / Irrelevant',
    'Suspected Scam / Fraud',
    'Inappropriate Image / Video',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMsg('');

    const res = await submitListingReport({
      listingId: listing.id,
      reporterPhone,
      reason,
    });

    setIsSubmitting(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      alert('Report submitted. If 3 verified residents flag this item, it will be automatically removed.');
      onClose();
    } else {
      setStatusMsg(res.error || 'Failed to submit report.');
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-4 space-y-3.5 shadow-2xl text-slate-100">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-1.5">
            <span>🚩</span>
            <h3 className="text-xs font-black text-white">Report Listing</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
          <p className="text-xs font-bold text-white truncate">{listing.title || listing.name}</p>
          <span className="text-[10px] text-slate-400">{listing.sellerName} • {listing.location}</span>
        </div>

        {statusMsg && (
          <div className="p-2 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-[10px] font-bold text-center">
            {statusMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Reason (कारण चुनें)
          </label>
          <div className="space-y-1.5">
            {reportReasons.map((r) => (
              <label
                key={r}
                className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer transition ${
                  reason === r
                    ? 'bg-rose-500/10 border-rose-500/50 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="reportReason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-rose-500"
                />
                <span className="text-[11px] font-semibold">{r}</span>
              </label>
            ))}
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black text-xs shadow-md cursor-pointer"
            >
              {isSubmitting ? 'Reporting...' : 'Submit Flag 🚩'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}