import React, { useState } from 'react';
import { localVehicleTypes } from '../data/transporterData';

export default function TransporterHub({
  onSelectFirms,
  onSelectIndividualVehicle,
  onBack,
}) {
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      
      {/* 1. NESTED VEHICLE PICKER (FOR INDIVIDUAL VEHICLE OWNERS) */}
      {showVehiclePicker ? (
        <div className="space-y-3.5 pb-6">
          <div className="flex items-center justify-between bg-white/85 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Local Vehicle Choice (गाड़ी चुनें)
              </span>
              <h2 className="text-sm font-black text-slate-900 mt-1 leading-tight">
                Select Vehicle Size or Load Type
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setShowVehiclePicker(false)}
              className="text-xs bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-xl border border-slate-200 active:scale-95 transition cursor-pointer"
            >
              ← Back
            </button>
          </div>

          <div className="space-y-2.5">
            {localVehicleTypes.map((v) => (
              <div
                key={v.id}
                onClick={() => onSelectIndividualVehicle(v.id)}
                className="group bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl mt-0.5">{v.icon}</span>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                      {v.name}
                    </h3>
                    <p className="text-[10px] font-extrabold text-emerald-700 mt-0.5">
                      ⚖️ Capacity: {v.capacity}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {v.idealFor}
                    </p>
                    <span className="inline-block mt-1 text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Est: {v.baseRate}
                    </span>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-xs font-bold transition ml-2 shrink-0">
                  ➔
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* 2. ROOT TRANSPORTERS SELECTION (FIRMS VS PERSONAL OWNERS) */
        <div>
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
              Transporter Hub (ट्रांसपोर्ट व माल ढुलाई)
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
              Select Transport Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hire local tempos for city shifting or book professional logistics for all-India cargo.
            </p>
          </div>

          <div className="space-y-3.5 pb-6">
            
            {/* TILE 1: INDIVIDUAL VEHICLE OWNERS & LOADERS */}
            <div
              onClick={() => setShowVehiclePicker(true)}
              className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[95px] flex items-center"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
              <div className="flex items-center justify-between pl-2 w-full">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/20 text-indigo-600 flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300">
                    🚚
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      Local Vehicle Owners & Loaders (लोकल गाड़ी मालिक)
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                      E-Rickshaw, 3-Wheeler Tempo, Bolero Pickup, Tractor & Mini Trucks for city goods shifting.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                  ➔
                </div>
              </div>
            </div>

            {/* TILE 2: TRANSPORT COMPANIES & COMMERCIAL FLEETS */}
            <div
              onClick={onSelectFirms}
              className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-4 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(16,185,129,0.15)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[95px] flex items-center"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>
              <div className="flex items-center justify-between pl-2 w-full">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-emerald-600 flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      Transport Firms & Logistics (ट्रांसपोर्ट कंपनियाँ)
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5 leading-snug">
                      Professional logistics companies for inter-state cargo, full/part truck loads, GST bilty & long-distance shifting.
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100/80 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-400 text-sm font-bold transition-all duration-300 shadow-sm ml-2 shrink-0">
                  ➔
                </div>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onBack}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-800 rounded-2xl border border-slate-200 text-xs font-black shadow-sm active:scale-95 transition cursor-pointer"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}