import React, { useState } from 'react';
import { examCategories, educationFormats } from '../data/educationData';

export default function EducationHub({ onSelectExamCategory, onBack }) {
  const [selectedFormat, setSelectedFormat] = useState('all');

  return (
    <section className="px-4 py-4 relative z-10 animate-fade-in text-slate-800">
      {/* 1. HEADER */}
      <div className="mb-4">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
          Education & Coaching Hub (कोचिंग व ट्यूशन)
        </span>
        <h1 className="text-lg font-black text-slate-900 mt-1.5 leading-tight">
          Select Your Target Exam
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Find top coaching centers, verified 1-on-1 home tutors & small batch tuitions in Alwar.
        </p>
      </div>

      {/* 2. LEARNING FORMAT FILTER */}
      <div className="mb-3.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
          Select Preferred Learning Mode
        </span>
        <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
          {educationFormats.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setSelectedFormat(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedFormat === f.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white/85 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 6 EXAM TILES */}
      <div className="space-y-3 pb-6">
        <span className="text-xs font-black text-slate-900 uppercase tracking-wider block px-1">
          Exams & Board Prep
        </span>

        {examCategories.map((tile) => (
          <div
            key={tile.id}
            onClick={() => onSelectExamCategory(tile.id, tile.name, selectedFormat)}
            className="group relative bg-white/85 backdrop-blur-xl border border-white/90 rounded-2xl p-3.5 shadow-[0_8px_25px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(99,102,241,0.15)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden min-h-[88px] flex items-center"
          >
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-l-2xl opacity-80 group-hover:w-2 transition-all"></div>

            <div className="flex items-center justify-between pl-2 w-full">
              <div className="flex items-center space-x-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tile.accent} flex items-center justify-center text-2xl shadow-inner border border-white/60 group-hover:scale-110 transition-transform duration-300 shrink-0`}
                >
                  {tile.icon}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors leading-tight">
                    {tile.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5 leading-tight">
                    {tile.desc}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {tile.popularSubjects.slice(0, 2).map((sub, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100"
                      >
                        {sub}
                      </span>
                    ))}
                    <span className="text-[9px] font-bold text-slate-400">+more</span>
                  </div>
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