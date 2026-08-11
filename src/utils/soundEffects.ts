// Web Audio API procedural sound synthesizer (Zero external MP3 dependencies)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

interface ToneOptions {
  freq: number;
  to?: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
}

export function playTone({ freq, to, dur = 0.15, type = 'triangle', gain = 0.05 }: ToneOptions, isMuted: boolean = false) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (to) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, to), now + dur);
    }

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + dur + 0.03);
  } catch (e) {
    // Graceful fallback if Web Audio is blocked
  }
}

export const SOUNDS = {
  discover(isMuted: boolean = false) {
    playTone({ freq: 523.25, to: 783.99, dur: 0.2, gain: 0.05 }, isMuted);
    setTimeout(() => {
      playTone({ freq: 783.99, to: 1046.50, dur: 0.28, gain: 0.045 }, isMuted);
    }, 100);
  },

  orb(isMuted: boolean = false) {
    playTone({ freq: 880, to: 1760, dur: 0.14, type: 'sine', gain: 0.06 }, isMuted);
  },

  pad(isMuted: boolean = false) {
    playTone({ freq: 220, to: 880, dur: 0.25, type: 'sawtooth', gain: 0.045 }, isMuted);
  },

  jump(isMuted: boolean = false) {
    playTone({ freq: 380, to: 720, dur: 0.12, type: 'sine', gain: 0.035 }, isMuted);
  },

  bump(intensity = 1, isMuted: boolean = false) {
    playTone({ freq: 120, to: 50, dur: 0.1, type: 'square', gain: Math.min(0.05, 0.015 * intensity) }, isMuted);
  }
};
