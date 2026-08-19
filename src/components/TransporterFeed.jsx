import React from 'react';
import ActionButtons from './common/ActionButtons';
import ListingDiscussionThread from './common/ListingDiscussionThread';

export default function TransporterFeed({
  viewMode = 'firms', // 'firms' | 'individual'
  firms = [],
  individualTransporters = [],
  selectedVehicleType = 'all',
  selectedCity = 'Alwar',
  searchQuery = '',
  onBack,
  onNewNotification,
}) {
  // Filter Firms
  const filteredFirms = firms.filter((firm) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      firm.firmName?.toLowerCase().includes(q) ||
      firm.routes?.join(' ').toLowerCase().includes(q) ||
      firm.location?.toLowerCase().includes(q)
    );
  });

  // Filter Individual Vehicles
  const filteredVehicles = individualTransporters
    .filter((v) => {
      if (selectedVehicleType && selectedVehicleType !== 'all' && selectedVehicleType !== 'individual') {
        return v.vehicleType === selectedVehicleType || v.category === selectedVehicleType;
      }
      return true;
    })
    .filter((v) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        v.driverName?.toLowerCase().includes(q) ||
        v.vehicleModel?.toLowerCase().includes(q) ||
        v.location?.toLowerCase().includes(q)
      );
    });

  return (
    <main className="p-3.5 space-y-3.5 relative z-10 animate-fade-in text-slate-800">
      {/* 1. TOP HEADER & NAVIGATION */}
      <div className="bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-sm font-black text-slate-900 capitalize leading-tight">
            {viewMode === 'firms' ? 'Transport Logistics Firms' : `${selectedVehicleType} Loading Transporters`}
          </h2>
          <p className="text-[10px] text-slate-500">Verified goods transport in {selectedCity}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Transport Hub
        </button>
      </div>

      {/* 2. MODE A: LOGISTICS FIRMS */}
      {viewMode === 'firms' && (
        <div className="space-y-3">
          {filteredFirms.map((firm) => (
            <article
              key={firm.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative"
            >
              <div className="relative h-44 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src={firm.image || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=700'}
                  alt={firm.firmName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none"></div>

                <div className="absolute bottom-2.5 left-2.5 z-10 space-y-1">
                  <span className="inline-block text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                    Fleet: {firm.fleetCount || '15+ Trucks'}
                  </span>
                </div>

                <ListingDiscussionThread
                  listingId={firm.id}
                  listingTitle={firm.firmName}
                  sellerName={firm.firmName}
                  sellerPhone={firm.phone || firm.whatsapp}
                  interestCount={firm.interestCount || 12}
                  onNewNotification={onNewNotification}
                />
              </div>

              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{firm.firmName}</h3>
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md ml-2 shrink-0">
                    ★ {firm.rating || '4.9'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 font-medium">
                  🛣️ Key Routes: {firm.routes?.join(', ') || 'All India Permit'}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                  <span>📍 {firm.location || selectedCity}</span>
                  <span className="text-emerald-700 font-bold">{firm.distance || 'Near Transport Nagar'}</span>
                </div>
              </div>

              <ActionButtons
                phone={firm.phone || '9876543210'}
                whatsapp={firm.whatsapp || firm.phone || '919876543210'}
                message={`Namaste, I need commercial transport booking from *${firm.firmName}*.`}
              />
            </article>
          ))}
        </div>
      )}

      {/* 3. MODE B: INDIVIDUAL VEHICLE DRIVERS / LOADERS */}
      {viewMode === 'individual' && (
        <div className="space-y-3">
          {filteredVehicles.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 text-center border border-slate-200">
              <span className="text-3xl">🚚</span>
              <p className="text-slate-600 font-bold text-xs mt-2">
                Is vehicle category me koi driver listed nahi hai.
              </p>
              <button
                type="button"
                onClick={onBack}
                className="mt-3 text-xs bg-slate-900 text-white px-3.5 py-2 rounded-xl font-bold cursor-pointer"
              >
                Explore Other Vehicles
              </button>
            </div>
          ) : (
            filteredVehicles.map((vehicle) => (
              <article
                key={vehicle.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition duration-200 space-y-3 p-3.5 relative"
              >
                <div className="relative h-48 w-full bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                  <img
                    src={vehicle.image || 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700'}
                    alt={vehicle.vehicleModel}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent pointer-events-none"></div>

                  <div className="absolute bottom-2.5 left-2.5 z-10 space-y-1">
                    <span className="inline-block text-xs font-black px-2.5 py-1 rounded-xl text-white bg-slate-950/85 backdrop-blur-md shadow-md border border-white/10">
                      Rate: {vehicle.rate || '₹ 400 Local Base'}
                    </span>
                    <span className="block text-[9px] font-black px-2 py-0.5 rounded-lg text-slate-950 bg-amber-400 shadow-sm w-max">
                      Capacity: {vehicle.capacity || '1.5 Ton'}
                    </span>
                  </div>

                  <ListingDiscussionThread
                    listingId={vehicle.id}
                    listingTitle={`${vehicle.vehicleModel} (${vehicle.driverName})`}
                    sellerName={vehicle.driverName}
                    sellerPhone={vehicle.phone || vehicle.whatsapp}
                    interestCount={vehicle.interestCount || 7}
                    onNewNotification={onNewNotification}
                  />
                </div>

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug">{vehicle.vehicleModel}</h3>
                      <p className="text-xs font-bold text-indigo-700 mt-0.5">👤 Driver: {vehicle.driverName}</p>
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md ml-2 shrink-0">
                      {vehicle.availability || 'Available for Loading'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold mt-2 pt-2 border-t border-slate-100">
                    <span>📍 {vehicle.location || selectedCity}</span>
                    <span className="text-emerald-700 font-bold">{vehicle.distance || '0.5 km away'}</span>
                  </div>
                </div>

                <ActionButtons
                  phone={vehicle.phone || '9876543210'}
                  whatsapp={vehicle.whatsapp || vehicle.phone || '919876543210'}
                  message={`Namaste ${vehicle.driverName}, I need transport loading service for ${vehicle.vehicleModel}.`}
                />
              </article>
            ))
          )}
        </div>
      )}
    </main>
  );
}