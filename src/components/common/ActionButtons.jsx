import React, { memo } from 'react';

function ActionButtons({ phone, whatsapp, callLabel = 'Call', chatLabel = 'WhatsApp', message }) {
  const cleanPhone = String(phone || '').replace(/[^0-9+]/g, '');
  const cleanWa = String(whatsapp || phone || '').replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(message || 'Namaste, I am interested in your listing.')}`;

  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
      <a
        href={`tel:${cleanPhone}`}
        className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-sm"
      >
        <span>📞 {callLabel}</span>
      </a>
      <a
        href={waUrl}
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