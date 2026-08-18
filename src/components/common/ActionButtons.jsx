import React, { memo } from 'react';

function ActionButtons({ phone, whatsapp, callLabel = 'Call', chatLabel = 'WhatsApp Chat', message }) {
  const whatsappUrl = `https://wa.me/${String(whatsapp).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message || 'Namaste, I found your listing on Town App.')}`;

  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
      <a
        href={`tel:${phone}`}
        className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
      >
        <span>📞 {callLabel}</span>
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center space-x-1.5 bg-emerald-600 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700 transition"
      >
        <span>💬 {chatLabel}</span>
      </a>
    </div>
  );
}

export default memo(ActionButtons);