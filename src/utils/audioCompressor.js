/**
 * TownHub Hyperlocal Voice Compressor & Decompressor
 * - Hardware Voice Optimization: 16kHz mono, echo cancellation & noise suppression
 * - Ultra-Low Bitrate Encoding: 16 kbps Opus (~2 KB per second of speech)
 * - Native Gzip Stream Compression: Gzips base64 payloads before store persistence
 * - Client Decompressor: Auto-decompresses gzipped voice notes into playable Object URLs
 */

/**
 * 1. Request Voice-Optimized Audio Stream (Noise Canceled, Mono 16kHz)
 */
export async function getOptimizedVoiceStream() {
  const constraints = {
    audio: {
      channelCount: 1,
      sampleRate: 16000,
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  };
  return await navigator.mediaDevices.getUserMedia(constraints);
}

/**
 * 2. Create Voice-Optimized MediaRecorder with 16 kbps Bitrate
 */
export function createOptimizedMediaRecorder(stream) {
  const mimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/aac',
  ];

  let selectedMime = '';
  for (const mime of mimeTypes) {
    if (MediaRecorder.isTypeSupported(mime)) {
      selectedMime = mime;
      break;
    }
  }

  const options = {
    audioBitsPerSecond: 16000, // 16 kbps voice profile (reduces 10s voice note to ~20KB)
  };
  if (selectedMime) options.mimeType = selectedMime;

  return new MediaRecorder(stream, options);
}

/**
 * 3. Compress Audio Blob to Compact Base64 using Gzip Streams
 */
export async function compressAudioBlob(audioBlob) {
  try {
    const arrayBuffer = await audioBlob.arrayBuffer();

    // Check if browser supports native CompressionStream
    if ('CompressionStream' in window) {
      const stream = new Response(arrayBuffer).body.pipeThrough(new CompressionStream('gzip'));
      const compressedBuffer = await new Response(stream).arrayBuffer();
      const base64String = arrayBufferToBase64(compressedBuffer);
      return `gzip_audio:${audioBlob.type || 'audio/webm'}:${base64String}`;
    }

    // Fallback: standard base64 if compression stream is unavailable
    const fallbackBase64 = arrayBufferToBase64(arrayBuffer);
    return `raw_audio:${audioBlob.type || 'audio/webm'}:${fallbackBase64}`;
  } catch (err) {
    console.warn('Audio compression fallback triggered:', err);
    const arrayBuffer = await audioBlob.arrayBuffer();
    return `raw_audio:${audioBlob.type || 'audio/webm'}:${arrayBufferToBase64(arrayBuffer)}`;
  }
}

/**
 * 4. Decompress Audio Base64 to Playable Blob URL
 */
export async function decompressAudioUrl(audioPayload) {
  if (!audioPayload) return null;

  // Already a standard playable URL or Blob URL
  if (audioPayload.startsWith('blob:') || audioPayload.startsWith('http')) {
    return audioPayload;
  }

  // Decompress Gzipped Payload
  if (audioPayload.startsWith('gzip_audio:')) {
    try {
      const [, mimeType, base64Data] = audioPayload.split(':');
      const compressedBuffer = base64ToArrayBuffer(base64Data);

      if ('DecompressionStream' in window) {
        const stream = new Response(compressedBuffer).body.pipeThrough(new DecompressionStream('gzip'));
        const decompressedBuffer = await new Response(stream).arrayBuffer();
        const blob = new Blob([decompressedBuffer], { type: mimeType || 'audio/webm' });
        return URL.createObjectURL(blob);
      }
    } catch (err) {
      console.warn('Gzip audio decompression error:', err);
    }
  }

  // Raw Audio Payload
  if (audioPayload.startsWith('raw_audio:')) {
    const [, mimeType, base64Data] = audioPayload.split(':');
    const buffer = base64ToArrayBuffer(base64Data);
    const blob = new Blob([buffer], { type: mimeType || 'audio/webm' });
    return URL.createObjectURL(blob);
  }

  // Standard data URL (e.g. data:audio/webm;base64,...)
  return audioPayload;
}

// Helper: ArrayBuffer to Base64 String
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper: Base64 String to ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}