import React, { useState, useEffect, useRef, memo } from 'react';

function VoiceSearchBar({
  searchQuery = '',
  setSearchQuery,
  onSearchSubmit,
  placeholder = 'Search town services, products & listings...',
}) {
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setVoiceSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'hi-IN'; // Optimized for Tier-2 Indian town accents (Hinglish/Hindi)

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setSearchQuery(transcript);
        if (event.results[0].isFinal && onSearchSubmit) {
          onSearchSubmit(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [setSearchQuery, onSearchSubmit]);

  const toggleVoiceSearch = () => {
    if (!voiceSupported) {
      alert('Voice search is not supported on this browser. Try Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Recognition start conflict:', err);
      }
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearchSubmit) onSearchSubmit('');
  };

  return (
    <div className="relative w-full flex items-center">
      {/* 🔍 SEARCH ICON */}
      <span className="absolute left-3.5 text-slate-400 text-sm pointer-events-none">
        🔍
      </span>

      {/* ⌨️ INPUT FIELD */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit && onSearchSubmit(searchQuery)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 bg-white/95 text-slate-900 placeholder:text-slate-400 font-semibold text-xs rounded-2xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
      />

      {/* RIGHT ACTIONS: CLEAR & VOICE MIC */}
      <div className="absolute right-2 flex items-center space-x-1">
        {searchQuery && (
          <button
            type="button"
            onClick={handleClear}
            className="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold transition cursor-pointer"
            title="Clear search"
          >
            ✕
          </button>
        )}

        <button
          type="button"
          onClick={toggleVoiceSearch}
          className={`p-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-md scale-110'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={isListening ? 'Listening...' : 'Search with voice (बोलकर खोजें)'}
        >
          <span className="text-sm">{isListening ? '🎙️' : '🎤'}</span>
        </button>
      </div>
    </div>
  );
}

export default memo(VoiceSearchBar);