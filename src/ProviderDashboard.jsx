import React, { useState } from 'react';

export default function ProviderDashboard({ onBackToUserMode, onAddListing }) {
  const [providerType, setProviderType] = useState('used-goods'); // 'used-goods' | 'service' | 'driver' | 'shop'
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    phone: '',
    whatsapp: '',
    location: '',
    experience: '',
    vehicleModel: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.phone) {
      alert('Please fill in the title/name and phone number!');
      return;
    }

    const newListing = {
      id: Date.now(),
      type: providerType === 'used-goods' ? 'classified' : 'shop',
      subCategory: formData.category || 'misc',
      title: formData.title,
      price: formData.price ? `₹ ${formData.price}` : 'Contact for Price',
      category: `${providerType.toUpperCase()} • ${formData.category || 'General'}`,
      location: formData.location || 'Local Area',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500',
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      badge: providerType === 'used-goods' ? 'Used Item' : 'Service Provider',
    };

    if (onAddListing) onAddListing(newListing);
    setSubmitted(true);
  };

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* HEADER WITH RETURN BUTTON */}
      <div className="flex items-center justify-between mb-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            Provider & Seller Portal
          </span>
          <h2 className="text-base font-black text-slate-900 mt-1 leading-tight">
            Grow Your Local Earnings
          </h2>
        </div>
        <button
          type="button"
          onClick={onBackToUserMode}
          className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 active:scale-95"
        >
          ← User View
        </button>
      </div>

      {submitted ? (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 text-center border border-emerald-200 shadow-md">
          <span className="text-4xl">🎉</span>
          <h3 className="text-base font-black text-slate-900 mt-2">Aapka Listing Live Ho Gaya!</h3>
          <p className="text-xs text-slate-500 mt-1">
            Town customers can now call or WhatsApp you directly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              onBackToUserMode();
            }}
            className="mt-4 w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-95"
          >
            Check Live Listing in Feed
          </button>
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-slate-200/80 shadow-sm">
          
          {/* STEP 1: SELECT WHAT YOU WANT TO REGISTER/SELL */}
          <div className="mb-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
              Select Registration Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'used-goods', label: 'Sell Used Item', icon: '🪑' },
                { id: 'service', label: 'Kaarigar / Expert', icon: '🛠️' },
                { id: 'driver', label: 'Driver / Transport', icon: '🚚' },
                { id: 'shop', label: 'Local Business', icon: '🏪' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setProviderType(t.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition-all ${
                    providerType === t.id
                      ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 text-indigo-700 font-extrabold'
                      : 'border-slate-200 bg-slate-50 text-slate-600 font-medium'
                  }`}
                >
                  <span className="text-lg">{t.icon}</span>
                  <span className="text-xs leading-tight">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: DYNAMIC FORM */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {providerType === 'used-goods' && 'Item Title (e.g. Wooden Bed 6x6)'}
                {providerType === 'service' && 'Skill / Service Name (e.g. Ramesh Electrician)'}
                {providerType === 'driver' && 'Vehicle Type (e.g. Bolero Pickup / Eeco)'}
                {providerType === 'shop' && 'Shop or Business Name'}
              </label>
              <input
                type="text"
                required
                placeholder="Enter title or name..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category / Trade</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
                >
                  <option value="furniture">Furniture</option>
                  <option value="vehicle">Vehicles</option>
                  <option value="electronics">Electronics</option>
                  <option value="property">Property</option>
                  <option value="kaarigar">Kaarigar / Electrician</option>
                  <option value="transport">Transport</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Price / Daily Rate (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Calling Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  placeholder="WhatsApp no."
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Your Locality / Ward</label>
              <input
                type="text"
                placeholder="e.g. Near Bus Stand, Alwar"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/20 active:scale-95 transition"
            >
              🚀 Publish Listing / Profile
            </button>
          </form>
        </div>
      )}
    </section>
  );
}