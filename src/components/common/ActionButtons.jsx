import React, { memo } from 'react';

function ActionButtons({
  phone,
  whatsapp,
  callLabel = 'Call',
  chatLabel = 'WhatsApp',
  message,
}) {
  const rawPhone = String(phone || whatsapp || '9876543201');
  const cleanPhone = rawPhone.replace(/[^0-9+]/g, '');

  const rawWa = String(whatsapp || phone || '9876543201').replace(/[^0-9]/g, '');
  const formattedWa = rawWa.length === 10 ? `91${rawWa}` : rawWa;

  const waUrl = `https://wa.me/${formattedWa}?text=${encodeURIComponent(
    message || 'Namaste, I am interested in your listing on TownHub.'
  )}`;

  return (
    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
      <a
        href={`tel:${cleanPhone}`}
        className="flex items-center justify-center space-x-1.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold active:scale-95 transition shadow-xs cursor-pointer"
      >
        <span>📞</span>
        <span>{callLabel}</span>
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs active:scale-95 transition cursor-pointer"
      >
        <span>💬</span>
        <span>{chatLabel}</span>
      </a>
    </div>
  );
}

export default memo(ActionButtons);