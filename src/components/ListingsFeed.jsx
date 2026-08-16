import React, { useState } from 'react';
import {
  vehicleSubTypes,
  propertyPriceRanges,
  vehiclePriceRanges,
  vehicleBrands,
} from '../data/mockData';

export default function ListingsFeed({
  listings,
  selectedCategory,
  selectedSubCategory,
  selectedCity,
  searchQuery,
  onBack,
}) {
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState('all');

const isPropertyType = [
  'property', 'tenancy', 'rent-house', 'rent-shop', 
  'flat', 'plot', 'land', 'shop', 
  'house-1bhk', 'house-2bhk', 'house-3bhk', 'house-large', 'house-1floor', 'house-2floor'
].includes(selectedSubCategory);

const filteredListings = listings
    .filter((item) => {
      if (selectedSubCategory !== 'all') {
        if (isPropertyType && item.subCategory === 'property') return true;
        return item.subCategory === selectedSubCategory;
      }
      return true;
    })

    .filter((item) => {
      if (selectedSubCategory === 'vehicle') {
        if (selectedVehicleType !== 'all' && item.vehicleType && item.vehicleType !== selectedVehicleType) {
          return false;
        }
        if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
          return false;
        }
      }
      return true;
    })
    .filter((item) => {
      if (selectedPriceRange === 'all') return true;

      if (selectedSubCategory === 'property') {
        if (selectedPriceRange === 'under-25l') return item.rawPrice < 2500000;
        if (selectedPriceRange === '25l-50l') return item.rawPrice >= 2500000 && item.rawPrice <= 5000000;
        if (selectedPriceRange === '50l-1cr') return item.rawPrice > 5000000 && item.rawPrice <= 10000000;
        if (selectedPriceRange === 'above-1cr') return item.rawPrice > 10000000;
      }

      if (selectedSubCategory === 'vehicle') {
        if (selectedPriceRange === 'under-30k') return item.rawPrice < 30000;
        if (selectedPriceRange === '30k-50k') return item.rawPrice >= 30000 && item.rawPrice <= 50000;
        if (selectedPriceRange === '50k-80k') return item.rawPrice > 50000 && item.rawPrice <= 80000;
        if (selectedPriceRange === 'above-80k') return item.rawPrice > 80000;
      }
      return true;
    })
    .filter(
      (item) =>
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in">
      {/* Vehicle Type Selection View */}
      {selectedSubCategory === 'vehicle' && selectedVehicleType === 'all' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-slate-200/80">
            <div>
              <h2 className="text-sm font-black text-slate-900">Select Vehicle Category</h2>
              <p className="text-[10px] text-slate-500">Choose vehicle type to view options</p>
            </div>
            <button
              onClick={onBack}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100"
            >
              ← Back
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {vehicleSubTypes.map((vType) => (
              <button
                key={vType.id}
                onClick={() => setSelectedVehicleType(vType.id)}
                className="flex flex-col items-center justify-center p-3.5 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all text-center"
              >
                <span className="text-3xl mb-1">{vType.icon}</span>
                <span className="text-xs font-bold text-slate-800 leading-tight">{vType.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Header & Filter Bar for Selected Subcategory */}
      {(selectedSubCategory !== 'vehicle' || selectedVehicleType !== 'all') && (
        <div className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
                {selectedSubCategory === 'vehicle'
                  ? vehicleSubTypes.find((v) => v.id === selectedVehicleType)?.name
                  : `${selectedSubCategory} Listings`}
              </h2>
              <p className="text-[10px] text-slate-500">Filtered for {selectedCity}</p>
            </div>
            <button
              onClick={() => {
                if (selectedSubCategory === 'vehicle' && selectedVehicleType !== 'all') {
                  setSelectedVehicleType('all');
                } else {
                  onBack();
                }
              }}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100 active:scale-95 transition cursor-pointer"
            >
              ← Back
            </button>
          </div>

          {/* Property Price Filters */}
          {isPropertyType && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Filter by Price Range
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                {propertyPriceRanges.map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedPriceRange === range.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vehicle Brand and Price Filters */}
          {selectedSubCategory === 'vehicle' && (
            <div className="space-y-2 pt-1 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Popular Companies / Models
                </span>
                <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                  {vehicleBrands.map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedBrand === brand.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Budget Bracket
                </span>
                <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                  {vehiclePriceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => setSelectedPriceRange(range.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                        selectedPriceRange === range.id
                          ? 'bg-slate-900 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Listing Cards */}
      {(selectedSubCategory !== 'vehicle' || selectedVehicleType !== 'all') && (
        <>
          {filteredListings.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
              <span className="text-3xl">🔍</span>
              <p className="text-slate-600 font-bold text-xs mt-2">
                Selected price filter me koi listing nahi mili.
              </p>
              <button
                onClick={() => {
                  setSelectedPriceRange('all');
                  setSelectedBrand('all');
                }}
                className="mt-3 text-xs bg-indigo-600 text-white px-3.5 py-2 rounded-xl font-bold shadow-md"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredListings.map((item) => (
              <article
                key={item.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg transition duration-200"
              >
                <div className="relative h-44 w-full bg-slate-100">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-1 rounded-md text-white shadow ${
                      item.type === 'shop' ? 'bg-blue-600' : 'bg-emerald-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                  {item.price && (
                    <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-black text-sm px-2.5 py-1 rounded-lg">
                      {item.price}
                    </span>
                  )}
                </div>

                <div className="p-3.5">
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                  <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                    <span>{item.category}</span>
                    <span>•</span>
                    <span>📍 {item.location}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${item.phone}`}
                      className="flex items-center justify-center space-x-1 border border-slate-300/80 py-2 rounded-xl text-xs font-bold text-slate-700 active:bg-slate-50"
                    >
                      <span>📞 Call Seller</span>
                    </a>
                    <a
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-1 bg-emerald-600 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700"
                    >
                      <span>💬 WhatsApp</span>
                    </a>
                  </div>
                </div>
              </article>
            ))
          )}
        </>
      )}
    </main>
  );
}