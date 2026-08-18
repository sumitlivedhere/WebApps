import React, { useState } from 'react';
import { RE_COMMERCE_SUB_CATEGORIES, RE_COMMERCE_CONDITIONS } from '../../data/reCommerceData';
import { compressListingImage } from '../../utils/imageCompressor';

export default function ReCommerceSellerDashboard({ myListings, onAddNewListing, onToggleStatus, onBackToHub }) {
  const [viewTab, setViewTab] = useState('add'); // 'add' | 'manage'
  const [compressing, setCompressing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [subCategory, setSubCategory] = useState('mobiles');
  const [condition, setCondition] = useState('good');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [ageMonths, setAgeMonths] = useState('');
  const [hasBillOrBox, setHasBillOrBox] = useState(true);
  const [landmark, setLandmark] = useState('Budh Vihar, Alwar');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [images, setImages] = useState([]);

  // Camera Handler
  const handlePhotoCapture = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setCompressing(true);
    try {
      const compressedList = await Promise.all(
        files.map((file) => compressListingImage(file, 800, 0.72))
      );
      setImages((prev) => [...prev, ...compressedList].slice(0, 3));
    } catch (err) {
      console.error('Image compression failed:', err);
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !phone) return;

    const newListing = {
      id: `rc_${Date.now()}`,
      title,
      subCategory,
      rawPrice: Number(price),
      price: `₹${Number(price).toLocaleString('en-IN')}`,
      isNegotiable,
      condition,
      ageMonths: Number(ageMonths) || 6,
      hasBillOrBox,
      description: description || 'Used item in clean working condition.',
      location: landmark,
      zone: 'Alwar - Central',
      lat: 27.5530,
      lng: 76.6346,
      images: images.length ? images : ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=60'],
      seller: {
        name: sellerName || 'Local Seller',
        phone,
        isVerified: true
      },
      status: 'ACTIVE',
      createdAt: 'Just now'
    };

    onAddNewListing(newListing);
    setViewTab('manage');
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto text-slate-800 animate-fadeIn pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
            Re-Commerce Console
          </span>
          <h2 className="text-base font-black text-slate-900 mt-0.5">पुराना सामान बेचें व मैनेज करें</h2>
        </div>
        <button
          type="button"
          onClick={onBackToHub}
          className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl active:scale-95 transition"
        >
          ← Exit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-200/70 p-1 rounded-2xl">
        <button
          type="button"
          onClick={() => setViewTab('add')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            viewTab === 'add' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          ➕ Post New Item
        </button>
        <button
          type="button"
          onClick={() => setViewTab('manage')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition ${
            viewTab === 'manage' ? 'bg-white text-indigo-900 shadow-sm' : 'text-slate-600'
          }`}
        >
          📋 My Listings ({myListings.length})
        </button>
      </div>

      {/* VIEW A: CREATE LISTING */}
      {viewTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
          {/* Subcategory */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Category</label>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none"
            >
              <option value="mobiles">📱 Mobiles & Gadgets</option>
              <option value="vehicles">🛵 Bikes & Scooters</option>
              <option value="appliances">❄️ Appliances (AC, TV, Cooler)</option>
              <option value="furniture">🪑 Furniture (Beds, Sofa, Almirah)</option>
              <option value="others">📦 Other Household</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Item Title & Model</label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung Galaxy M31 (6GB / 128GB)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-indigo-600"
            />
          </div>

          {/* Price & Age */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Price (₹)</label>
              <input
                type="number"
                required
                placeholder="₹ 9,500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Age (Months Old)</label>
              <input
                type="number"
                placeholder="10"
                value={ageMonths}
                onChange={(e) => setAgeMonths(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold outline-none"
              />
            </div>
          </div>

          {/* Condition Pills */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1.5">Condition</label>
            <div className="grid grid-cols-3 gap-1.5">
              {RE_COMMERCE_CONDITIONS.map((cond) => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => setCondition(cond.id)}
                  className={`p-2 rounded-xl text-center border text-[10px] font-black transition ${
                    condition === cond.id
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  {cond.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNegotiable}
                onChange={(e) => setIsNegotiable(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span className="text-xs font-bold text-slate-700">Negotiable Price</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBillOrBox}
                onChange={(e) => setHasBillOrBox(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
              <span className="text-xs font-bold text-slate-700">Bill / Box Available</span>
            </label>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Your Name</label>
              <input
                type="text"
                placeholder="Vikram Singh"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">WhatsApp Number</label>
              <input
                type="tel"
                required
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
              />
            </div>
          </div>

          {/* Landmark */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Local Area / Landmark</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
            />
          </div>

          {/* Camera Upload */}
          <div>
            <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">
              Photos (Max 3, WebP auto-compressed)
            </label>
            <label className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/20 rounded-2xl p-3 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 transition">
              <span className="text-base">📸</span>
              <span className="text-xs font-bold text-indigo-700">Take Photo / Upload</span>
              <input
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </label>

            {compressing && (
              <p className="text-[10px] text-amber-600 font-bold mt-1 animate-pulse">
                ⚡ Compressing photo on device...
              </p>
            )}

            {images.length > 0 && (
              <div className="flex space-x-2 mt-2">
                {images.map((src, i) => (
                  <div key={i} className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                    <img src={src} alt="Thumb" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-2xl text-xs uppercase tracking-wider shadow-lg active:scale-95 transition"
          >
            Publish in Town 5 km Feed
          </button>
        </form>
      )}

      {/* VIEW B: MANAGE MY LISTINGS */}
      {viewTab === 'manage' && (
        <div className="space-y-3">
          {myListings.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm">
              <div className="text-3xl mb-2">🏷️</div>
              <h4 className="text-sm font-black text-slate-800">No active listings yet</h4>
              <button
                type="button"
                onClick={() => setViewTab('add')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-black shadow-sm active:scale-95"
              >
                Post Your First Item
              </button>
            </div>
          ) : (
            myListings.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&auto=format&fit=crop&q=60'}
                    alt={item.title}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-100"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 line-clamp-1">{item.title}</h4>
                    <div className="text-xs font-black text-emerald-600 mt-0.5">{item.price}</div>
                    <span
                      className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                        item.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.status === 'ACTIVE' ? '🟢 Active' : '⚪ Sold Out'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleStatus(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition active:scale-95 ${
                    item.status === 'ACTIVE'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {item.status === 'ACTIVE' ? 'Mark Sold' : 'Relist'}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}