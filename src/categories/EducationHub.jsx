import React from 'react';
import { getCategoryById } from '../data/taxonomyRegistry';

export default function EducationHub({ selectedCity = 'Alwar', onSelectSubCategory, onBack }) {
  const categoryConfig = getCategoryById('education');

  return (
    <div className="p-3.5 space-y-4 animate-fade-in text-slate-800">
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 p-4 rounded-3xl text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-2xl block">🎓</span>
          <h2 className="text-base font-black leading-tight mt-1 text-yellow-300">
            Education & Coaching (ट्यूशन व कोचिंग)
          </h2>
          <p className="text-[11px] font-semibold text-blue-100">
            Home Tutors, Institutes & Exam Coaching in {selectedCity}
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold active:scale-95 transition cursor-pointer"
        >
          ← Back
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectSubCategory('all')}
          className="p-3.5 bg-slate-900 text-white rounded-2xl text-left font-black shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-800"
        >
          <span className="text-xl">🌟</span>
          <div>
            <div className="text-xs font-black">All Education</div>
            <div className="text-[9px] text-slate-400 font-normal">All coaching & tuitions</div>
          </div>
        </button>

        {categoryConfig.subCategories.map((sub) => (
          <button
            key={sub.id}
            type="button"
            onClick={() => onSelectSubCategory(sub.id)}
            className="p-3.5 bg-white text-slate-900 rounded-2xl text-left font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer flex flex-col justify-between h-24 border border-slate-200"
          >
            <span className="text-xl">📚</span>
            <div>
              <div className="text-xs font-black leading-tight">{sub.name.split('(')[0]}</div>
              <div className="text-[9px] text-slate-500 font-semibold">{sub.name.match(/\((.*?)\)/)?.[1] || 'शिक्षा'}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}