import React, { useState, useRef, useEffect } from 'react';
import { decompressAudioUrl } from '../../utils/audioCompressor';

export default function VoiceNotePlayer({ audioUrl, duration = '0:00', senderName = 'Voice Note' }) {
  const audioRef = useRef(null);
  const [playableSrc, setPlayableSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isDecompressing, setIsDecompressing] = useState(true);

  // 🌟 Auto-Decompress incoming audio payload on mount
  useEffect(() => {
    let active = true;
    let createdBlobUrl = null;

    async function unpackAudio() {
      if (!audioUrl) return;
      setIsDecompressing(true);
      try {
        const resolvedUrl = await decompressAudioUrl(audioUrl);
        if (active) {
          createdBlobUrl = resolvedUrl;
          setPlayableSrc(resolvedUrl);
        }
      } catch (err) {
        console.error('Failed to unpack voice note:', err);
      } finally {
        if (active) setIsDecompressing(false);
      }
    }

    unpackAudio();

    return () => {
      active = false;
      if (createdBlobUrl && createdBlobUrl.startsWith('blob:')) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setTotalDuration(audio.duration);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playableSrc]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !playableSrc) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs === 0) return duration || '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  if (isDecompressing) {
    return (
      <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/60 p-2 rounded-2xl max-w-xs shadow-md animate-pulse">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
          ⏳
        </div>
        <div className="text-[10px] text-slate-400 font-bold">Unpacking audio note...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2.5 bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl max-w-xs shadow-md select-none">
      {playableSrc && <audio ref={audioRef} src={playableSrc} preload="metadata" />}

      {/* Play / Pause Toggle Button */}
      <button
        type="button"
        onClick={togglePlay}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xs active:scale-90 transition cursor-pointer shadow-md shrink-0"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {/* Audio Waveform & Progress */}
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center space-x-0.5 h-4 overflow-hidden">
          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 95, 35, 75, 50, 85, 65, 40].map((height, idx) => {
            const isBarPassed = (idx / 16) * 100 <= progressPercent;
            return (
              <div
                key={idx}
                style={{ height: `${height}%` }}
                className={`w-1 rounded-full transition-all duration-150 ${
                  isBarPassed
                    ? 'bg-emerald-400'
                    : isPlaying
                    ? 'bg-slate-600 animate-pulse'
                    : 'bg-slate-700'
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
          <span>{isPlaying ? formatTime(currentTime) : duration || formatTime(totalDuration)}</span>
          <span className="truncate max-w-[80px] text-[8px] text-slate-500">🎤 {senderName}</span>
        </div>
      </div>
    </div>
  );
}