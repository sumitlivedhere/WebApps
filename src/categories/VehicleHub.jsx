import React from 'react';

export default function VehicleHub({ onSelectVehicleType, onBack }) {
  const vehicleTypes = [
    { id: 'bike', name: 'Bikes', desc: 'Hero Splendor, Pulsar, Bullet & EV bikes', icon: '🏍️', accent: 'from-blue-500/10 to-indigo-500/20 text-indigo-600' },
    { id: 'car', name: 'Cars', desc: 'Maruti, Hyundai, Sedans & SUVs', icon: '🚗', accent: 'from-emerald-500/10 to-teal-500/20 text-emerald-600' },
    { id: 'scooty', name: 'Scooty', desc: 'Activa, Jupiter, Pleasure & Electric Scooters', icon: '🛵', accent: 'from-amber-500/10 to-orange-500/20 text-amber-600' },
    { id: 'cycle', name: 'Cycle', desc: 'Gear cycles, kids cycles & everyday bicycles', icon: '🚲', accent: 'from-cyan-500/10 to-blue-500/20 text-cyan-600' },
    { id: 'jcb', name: 'JCB & Heavy Machinery', desc: 'Excavators, backhoe loaders & cranes', icon: '🏗️', accent: 'from-yellow-500/10 to-amber-600/20 text-yellow-700' },
    { id: 'tractor', name: 'Tractor', desc: 'Mahindra, Swaraj, Farmtrac & trolleys', icon: '🚜', accent: 'from-red-500/10 to-orange-500/20 text-red-600' },
    { id: 'tempo', name: 'Tempo (छोटा हाथी)', desc: '3-wheeler loaders, Ape & luggage carriers', icon: '🛺', accent: 'from-purple-500/10 to-pink-500/20 text-purple-600' },
    { id: 'erickshaw', name: 'E-Rickshaw (टोटो)', desc: 'Passenger & loader electric rickshaws', icon: '⚡🛺', accent: 'from-teal-500/10 to-emerald-500/20 text-teal-600' },
    { id: 'pickup', name: 'Pickup', desc: 'Bolero Pickup, Tata Ace (छोटा हाथी), Dost', icon: '🚚', accent: 'from-blue-600/10 to-slate-500/20 text-blue-700' },
    { id: 'misc', name: 'Miscellaneous', desc: 'Commercial trailers, parts & customized vehicles', icon: '⚙️', accent: 'from-slate-500/10 to-zinc-500/20 text-slate-700' },
  ];

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          Vehicle Hub (गाड़ी बाज़ार)
        </span>
        <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Select Vehicle Category
        </h2>
      </div>

      <div className="space-y-3 pb-6">
        {vehicleTypes.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectVehicleType(tile.id)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[82px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300`}>
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>
                </div>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100/80 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                ➔
              </div>
            </div>
          </div>
        ))}

        <div className="pt-2">
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
          >
            ← Back
          </button>
        </div>
      </div>
    </section>
  );
}