import React, { useState } from 'react';

export default function VoiceSearchBar({ searchQuery, setSearchQuery, onSearchSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState('hi-IN'); // Default Hindi (India)
  const [listeningText, setListeningText] = useState('Sun rahe hain... Boliyega');

  const startVoiceSearch = () => {
    // Native Chrome / Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported on this browser. Please open in Google Chrome on Mobile or PC.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = selectedLang; 
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningText('Sun rahe hain... Boliyega (Listening...)');
    };

    recognition.onresult = (event) => {
      const currentResult = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join('');
      
      setSearchQuery(currentResult);
    };

    recognition.onerror = (event) => {
      console.error("Voice Recognition Error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (searchQuery && onSearchSubmit) {
        onSearchSubmit(searchQuery);
      }
    };

    recognition.start();
  };

  return (
    <div className="w-full relative">
      
      {/* Search Input Box + Language Toggle + Mic */}
      <div className="flex items-center bg-white rounded-2xl shadow-inner px-3 py-1.5 border border-slate-200">
        
        {/* Vernacular Language Selector Toggle */}
        <select 
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="text-xs bg-slate-100 font-bold text-slate-700 rounded-lg px-2 py-1 outline-none mr-2 cursor-pointer"
        >
          <option value="hi-IN">🇮🇳 हिंदी</option>
          <option value="en-IN">🗣️ Hinglish</option>
        </select>

        {/* Text Input */}
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={selectedLang === 'hi-IN' ? "बोल कर खोजें (जैसे: 'बाइक', 'राजू किराना')..." : "Speak to search..."}
          className="w-full text-xs bg-transparent text-slate-900 placeholder-slate-400 focus:outline-none"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button 
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 text-xs px-1 mr-1 font-bold"
          >
            ✕
          </button>
        )}

        {/* Mic Button */}
        <button 
          type="button"
          onClick={startVoiceSearch}
          className={`p-2 rounded-full flex items-center justify-center transition-all ${
            isListening 
              ? 'bg-rose-600 text-white animate-pulse shadow-lg ring-4 ring-rose-200' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
          }`}
          title="Tap & Speak in Vernacular"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
          </svg>
        </button>

      </div>

      {/* Pulsating Banner when User Speaks */}
      {isListening && (
        <div className="absolute left-0 right-0 top-14 bg-rose-700 text-white text-xs font-semibold p-3 rounded-xl shadow-xl flex items-center justify-between z-30 animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></span>
            <span>{listeningText}</span>
          </div>
          <span className="text-[10px] bg-rose-900/60 px-2 py-0.5 rounded-full">Say query now</span>
        </div>
      )}

    </div>
  );
}