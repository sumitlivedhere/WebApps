import React, { useState } from 'react';
import ProductDetailModal from './ProductDetailModal';

import {
  vehicleBrandFilters,
  vehicleAgeFilters,
  furnitureMaterialFilters,
  furnitureConditionFilters,
  electronicsBrandFilters,
  electronicsWarrantyFilters,
  fashionSizeFilters,
  fashionConditionFilters,
  priceSortOptions,
  propertyPriceRanges,
} from '../data/mockData';

export default function ListingsFeed({
  listings,
  selectedCategory,
  selectedSubCategory,
  selectedCity,
  searchQuery,
  onBack,
  onSetAlert,
  onSelectListing,
}) {

  const [categoryAlertActive, setCategoryAlertActive] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedElectronicsBrand, setSelectedElectronicsBrand] = useState('all');
  const [selectedWarranty, setSelectedWarranty] = useState('all');
  const [selectedFashionSize, setSelectedFashionSize] = useState('all');
  const [selectedFashionCondition, setSelectedFashionCondition] = useState('all');
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [activeProductModal, setActiveProductModal] = useState(null);

  const isFurnitureType = [
    'furniture', 'bed', 'sofa', 'table', 'mattress', 
    'dining', 'dressing', 'shoerack', 'studytable'
  ].includes(selectedSubCategory);

  const isFashionType = [
    'clothes', 'shirt', 'jeans', 'trouser', 'coat', 
    'jacket', 'summer', 'winter', 'shoes'
  ].includes(selectedSubCategory);

  const isElectronicsType = [
    'electronics', 'ac', 'tv', 'fridge', 'washingmachine', 
    'geyser', 'pc', 'laptop', 'smartphones', 'camera', 'misc-electronics'
  ].includes(selectedSubCategory);
  
  const isVehicleType = [
    'vehicle', 'bike', 'car', 'scooty', 'cycle', 'jcb', 
    'tractor', 'tempo', 'erickshaw', 'pickup', 'misc'
  ].includes(selectedSubCategory);

  const isPropertyType = [
    'property', 'tenancy', 'rent-house', 'rent-shop',
    'flat', 'plot', 'land', 'shop',
    'house-1bhk', 'house-2bhk', 'house-3bhk', 
    'house-large', 'house-1floor', 'house-2floor'
  ].includes(selectedSubCategory);

  const filteredListings = listings
 .filter((item) => {
      if (selectedSubCategory !== 'all') {
        if (isFashionType && (item.subCategory === selectedSubCategory || selectedSubCategory === 'clothes')) return true;
        if (isElectronicsType && (item.subCategory === selectedSubCategory || selectedSubCategory === 'electronics')) return true;
        if (isFurnitureType && (item.subCategory === selectedSubCategory || selectedSubCategory === 'furniture')) return true;
        if (isVehicleType && (item.subCategory === selectedSubCategory || selectedSubCategory === 'vehicle')) return true;
        if (isPropertyType && (item.subCategory === 'property' || selectedSubCategory === 'property')) return true;
        return item.subCategory === selectedSubCategory;
      }
      return true;
    })
    .filter((item) => {
      // Fashion Size Filter
      if (isFashionType && selectedFashionSize !== 'all') {
        return item.size === selectedFashionSize;
      }
      return true;
    })
    .filter((item) => {
      // Fashion Condition Filter
      if (isFashionType && selectedFashionCondition !== 'all') {
        return item.condition === selectedFashionCondition;
      }
      return true;
    })

    .filter((item) => {
      // Electronics Brand Filter
      if (isElectronicsType && selectedElectronicsBrand !== 'all') {
        return item.brand === selectedElectronicsBrand;
      }
      return true;
    })
    .filter((item) => {
      // Electronics Warranty / Condition Filter
      if (isElectronicsType && selectedWarranty !== 'all') {
        return item.condition === selectedWarranty;
      }
      return true;
    })

    .filter((item) => {
      // Furniture Material Filter
      if (isFurnitureType && selectedMaterial !== 'all') {
        return item.material === selectedMaterial;
      }
      return true;
    })
    .filter((item) => {
      // Furniture Condition Filter
      if (isFurnitureType && selectedCondition !== 'all') {
        return item.condition === selectedCondition;
      }
      return true;
    })

    .filter((item) => {
      // Vehicle Brand Filter
      if (isVehicleType && selectedBrand !== 'all') {
        return item.brand === selectedBrand;
      }
      return true;
    })
    .filter((item) => {
      // Vehicle Age Filter
      if (isVehicleType && selectedAge !== 'all' && item.ageYears) {
        if (selectedAge === 'under-2') return item.ageYears <= 2;
        if (selectedAge === '2-5') return item.ageYears > 2 && item.ageYears <= 5;
        if (selectedAge === 'above-5') return item.ageYears > 5;
      }
      return true;
    })
    .filter((item) => {
      // Property Price Range Filter
      if (isPropertyType && selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'under-25l') return item.rawPrice < 2500000;
        if (selectedPriceRange === '25l-50l') return item.rawPrice >= 2500000 && item.rawPrice <= 5000000;
        if (selectedPriceRange === '50l-1cr') return item.rawPrice > 5000000 && item.rawPrice <= 10000000;
        if (selectedPriceRange === 'above-1cr') return item.rawPrice > 10000000;
      }
      return true;
    })
    .filter((item) =>
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location && item.location.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (selectedSort === 'low-to-high') return (a.rawPrice || 0) - (b.rawPrice || 0);
      if (selectedSort === 'high-to-low') return (b.rawPrice || 0) - (a.rawPrice || 0);
      return 0;
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in">
      
      {/* 1. TOP HEADER & FILTER BAR */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
              {selectedSubCategory} Listings
            </h2>
            <p className="text-[10px] text-slate-500">Showing verified items for {selectedCity}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                setCategoryAlertActive(!categoryAlertActive);
                if (onSetAlert) {
                  onSetAlert({
                    targetType: 'category',
                    title: `${selectedSubCategory.toUpperCase()} Arrivals`,
                    subCategory: selectedSubCategory,
                  });
                }
              }}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                categoryAlertActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              <span>{categoryAlertActive ? '✓ Alert Active' : '🔔 Notify Me'}</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl font-bold border border-indigo-100 active:scale-95 transition cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>

       {/* FASHION SMART FILTERS: SIZE, CONDITION, SORT */}
        {isFashionType && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Size / Fit
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {fashionSizeFilters.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setSelectedFashionSize(sz.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedFashionSize === sz.id
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Condition / Tag
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {fashionConditionFilters.map((fc) => (
                  <button
                    key={fc.id}
                    onClick={() => setSelectedFashionCondition(fc.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedFashionCondition === fc.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {fc.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Sort Price Range
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {priceSortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSort(opt.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedSort === opt.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ELECTRONICS SMART FILTERS: BRAND, WARRANTY, SORT */}
        
        {isElectronicsType && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Brand / Manufacturer
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {electronicsBrandFilters.map((eb) => (
                  <button
                    key={eb.id}
                    onClick={() => setSelectedElectronicsBrand(eb.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedElectronicsBrand === eb.id
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {eb.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Condition / Warranty
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {electronicsWarrantyFilters.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWarranty(w.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedWarranty === w.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Sort Price Range
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {priceSortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSort(opt.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedSort === opt.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FURNITURE SMART FILTERS: MATERIAL, CONDITION, SORT */}
        {isFurnitureType && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {/* Material Filter */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Material / Wood Type
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {furnitureMaterialFilters.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMaterial(m.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedMaterial === m.id
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Usage / Condition
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {furnitureConditionFilters.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCondition(c.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedCondition === c.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Sorting */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Sort Price Range
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {priceSortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSort(opt.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedSort === opt.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VEHICLE SMART FILTERS: BRAND, AGE, PRICE SORT */}
        {isVehicleType && (
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {/* Brand Filter */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Company / Brand
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {vehicleBrandFilters.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(b.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedBrand === b.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Filter */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Vehicle Age / Condition
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {vehicleAgeFilters.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedAge === age.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Sorting */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                Sort Price Range
              </span>
              <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {priceSortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSort(opt.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                      selectedSort === opt.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROPERTY PRICE FILTER */}
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
      </div>

      {/* 2. LISTINGS FEED */}
      {filteredListings.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
          <span className="text-3xl">🔍</span>
          <p className="text-slate-600 font-bold text-xs mt-2">
            Selected filters me koi listing nahi mili.
          </p>
          <button
            onClick={() => {
              setSelectedBrand('all');
              setSelectedAge('all');
              setSelectedPriceRange('all');
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
            onClick={() => setActiveProductModal(item)}
            className="group bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 hover:shadow-lg transition duration-200 cursor-pointer"
          >
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <span className="absolute top-3 left-3 text-[10px] uppercase font-bold px-2 py-1 rounded-md text-white shadow bg-indigo-600">
                {item.badge}
              </span>
              {item.price && (
                <span className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-black text-sm px-2.5 py-1 rounded-lg">
                  {item.price}
                </span>
              )}
            </div>

            <div className="p-3.5">
              <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h3>
              
              <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                <span>📍 {item.location}</span>
                {item.distance && <span>• <strong className="text-slate-700">{item.distance}</strong></span>}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${item.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center space-x-1 border border-slate-300/80 py-2 rounded-xl text-xs font-bold text-slate-700 active:bg-slate-50"
                >
                  <span>📞 Call</span>
                </a>
                <a
                  href={`https://wa.me/${item.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center space-x-1 bg-emerald-600 py-2 rounded-xl text-xs font-bold text-white shadow-sm active:bg-emerald-700"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </article>
        ))
      )}

      {/* 3. PRODUCT DETAIL MODAL */}
      {activeProductModal && (
        <ProductDetailModal
          product={activeProductModal}
          onClose={() => setActiveProductModal(null)}
          onSetAlert={onSetAlert}
        />
      )}
    </main>
  );
}