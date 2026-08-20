import React, { useState } from 'react';
import { TAXONOMY_REGISTRY } from '../data/taxonomyRegistry';

const CATEGORY_AUDIO_SCRIPTS = {
  kaarigar: 'कारीगर व मिस्त्री। यहाँ आपके शहर के प्लम्बर, इलेक्ट्रीशियन, पेंटर, बढ़ई और मिस्त्री मिलेंगे।',
  property: 'प्रॉपर्टी और रियल एस्टेट। यहाँ फ्लैट, प्लॉट, किराये के मकान और दुकानें देखें।',
  vehicles: 'नई गाड़ी व शोरूम। यहाँ नई कार, बाइक, स्कूटर और ट्रैक्टर के शोरूम मिलेंगे।',
  electronics: 'इलेक्ट्रॉनिक्स व गैजेट्स। मोबाइल, टीवी, एसी, लैपटॉप और ब्रांडेड सर्विस सेंटर।',
  furniture: 'फर्नीचर व इंटीरियर। सोफा, बेड, मॉड्यूलर किचन और इंटीरियर डेकोरेटर्स।',
  transporters: 'ट्रांसपोर्ट व लोडिंग गाड़ी। पिकअप, छोटा हाथी, लोडिंग ऑटो और भारी ट्रक।',
  'white-collar': 'डॉक्टर, वकील और सीए। जाने-माने डॉक्टर्स, लीगल एडवाइजर और टैक्स कंसल्टेंट्स।',
  education: 'ट्यूशन व कोचिंग। होम ट्यूटर्स, कोचिंग संस्थान और प्रतियोगी परीक्षा तैयारी।',
  restaurants: 'रेस्टोरेंट व कैफे। शुद्ध शाकाहारी भोजनालय, ढाबा, कैफे और बेकरी।',
  malls: 'दुकान व शोरूम। कपड़े, जूते, ज्वेलरी, बुटीक और किराना स्टोर।',
  shaadi: 'शादी व विवाह सेवा। मैरिज गार्डन, हलवाई, कैटरिंग, टेंट और वेडिंग फोटोग्राफी।',
  construction: 'निर्माण कार्य। ठेकेदार, सीमेंट, बजरी, ईंट और जेसीबी खुदाई।',
  advertising: 'विज्ञापन व प्रचार। फ्लैक्स प्रिंटिंग, होर्डिंग्स और डिजिटल मार्केटिंग।',
  community: 'समाज सेवा। रक्तदान शिविर, अन्नदान और सामाजिक सहायता।',
  market: 'लोकल बाज़ार। ताज़े फल, सब्ज़ियाँ, डेयरी और रोज़मर्रा का सामान।',
  recommerce: 'पुराना सामान खरीदें व बेचें। सेकंड-हैंड मोबाइल, बाइक और घरेलू सामान।',
};

const CARD_THEMES = {
  kaarigar: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
  property: 'from-blue-500/20 to-indigo-500/10 border-blue-500/40 text-blue-300',
  vehicles: 'from-sky-500/20 to-cyan-500/10 border-sky-500/40 text-sky-300',
  electronics: 'from-cyan-500/20 to-teal-500/10 border-cyan-500/40 text-cyan-300',
  furniture: 'from-orange-500/20 to-amber-500/10 border-orange-500/40 text-orange-300',
  transporters: 'from-yellow-500/20 to-amber-600/10 border-yellow-500/40 text-yellow-300',
  'white-collar': 'from-indigo-500/20 to-purple-500/10 border-indigo-500/40 text-indigo-300',
  education: 'from-blue-600/20 to-blue-400/10 border-blue-400/40 text-blue-200',
  restaurants: 'from-rose-500/20 to-red-500/10 border-rose-500/40 text-rose-300',
  malls: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300',
  shaadi: 'from-red-500/20 to-amber-500/10 border-red-500/40 text-red-300',
  construction: 'from-amber-600/20 to-orange-600/10 border-amber-600/40 text-amber-200',
  advertising: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-300',
  community: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
  market: 'from-teal-500/20 to-green-500/10 border-teal-500/40 text-teal-300',
  recommerce: 'from-emerald-600/20 to-cyan-600/10 border-emerald-400/40 text-emerald-200',
};

export default function TownHubView({ selectedCity = 'Alwar', onSelectCategory }) {
  const [speakingId, setSpeakingId] = useState(null);

  const handleSpeakCategory = (e, cat) => {
    e.stopPropagation();

    if (!('speechSynthesis' in window)) {
      alert('Voice assistant not supported on this browser.');
      return;
    }

    // Toggle off if already speaking
    if (speakingId === cat.id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const scriptText =
      CATEGORY_AUDIO_SCRIPTS[cat.id] ||
      `${cat.name} in ${selectedCity}. Tap here to see all listings.`;

    const utterance = new SpeechSynthesisUtterance(scriptText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    utterance.onstart = () => setSpeakingId(cat.id);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="space-y-3.5 animate-fade-in text-slate-800 pb-8">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <span className="text-xl">🏛️</span>
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              All Town Categories (सभी श्रेणियां)
            </h2>
            <p className="text-[10px] text-slate-400 font-semibold">
              Tap 🔊 icon on any card to listen
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black text-amber-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-xl">
          17 Categories
        </span>
      </div>

      {/* Floating Card Stack */}
      <div className="space-y-3">
        {TAXONOMY_REGISTRY.map((cat) => {
          const hindiLabel = cat.name.match(/\((.*?)\)/)?.[1] || 'सेवा व काम';
          const englishTitle = cat.name.split('(')[0].trim();
          const theme = CARD_THEMES[cat.id] || 'from-slate-800/40 to-slate-900/40 border-slate-700 text-slate-300';
          const isSpeaking = speakingId === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`relative bg-gradient-to-r ${theme} backdrop-blur-md p-4 rounded-3xl border-2 shadow-lg hover:shadow-2xl hover:scale-[1.015] active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-between group`}
            >
              {/* Left Details */}
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-13 h-13 rounded-2xl bg-slate-950/90 border border-white/15 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 group-hover:rotate-3 transition shrink-0">
                  {cat.icon}
                </div>

                <div className="min-w-0 pr-1">
                  <h3 className="text-sm font-black text-white group-hover:text-amber-300 transition leading-snug truncate">
                    {englishTitle}
                  </h3>
                  <p className="text-xs font-black text-amber-300/95 mt-0.5">
                    {hindiLabel}
                  </p>
                  <p className="text-[10px] text-slate-300 font-medium leading-none mt-1">
                    📍 {selectedCity} • Verified Hub
                  </p>
                </div>
              </div>

              {/* Right Action Center: Speaker Audio Guide & Navigation Arrow */}
              <div className="flex items-center space-x-2 shrink-0">
                {/* 🔊 Pronunciation & Explanation Voice Button */}
                <button
                  type="button"
                  onClick={(e) => handleSpeakCategory(e, cat)}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition active:scale-85 cursor-pointer shadow-md ${
                    isSpeaking
                      ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40 scale-110 animate-bounce'
                      : 'bg-slate-950/90 hover:bg-slate-900 text-amber-300 border border-white/20 hover:border-amber-400'
                  }`}
                  title="बोलकर सुनाएँ (Listen voice guide)"
                >
                  <span className="text-lg">{isSpeaking ? '🔊' : '🔈'}</span>
                </button>

                {/* Forward Chevron */}
                <div className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 flex items-center justify-center font-black text-sm transition">
                  ›
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}