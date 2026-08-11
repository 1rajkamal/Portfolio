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

// Procedural Ambient Synth Generator
let ambientOscs: OscillatorNode[] = [];
let ambientGain: GainNode | null = null;
let ambientInterval: number | null = null;
let isSynthPlaying = false;

const SYNTH_CHORDS = [
  [130.81, 196.00, 261.63, 329.63], // C maj7
  [110.00, 164.81, 220.00, 261.63], // A min7
  [146.83, 220.00, 293.66, 349.23], // D min7
  [174.61, 261.63, 349.23, 440.00]  // F maj7
];

export function startAmbientSynth(isMuted = false): boolean {
  if (isSynthPlaying) return true;
  const ctx = getAudioContext();
  if (!ctx) return false;

  try {
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    if (!isMuted) {
      ambientGain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 2);
    }
    ambientGain.connect(ctx.destination);

    let chordIdx = 0;
    const playChord = () => {
      // Clear old oscillators
      ambientOscs.forEach(o => {
        try { o.stop(); o.disconnect(); } catch (e) {}
      });
      ambientOscs = [];

      const chord = SYNTH_CHORDS[chordIdx % SYNTH_CHORDS.length];
      chordIdx++;

      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Add subtle detune for warm analog feel
        osc.detune.setValueAtTime((Math.random() - 0.5) * 12, ctx.currentTime);
        if (ambientGain) osc.connect(ambientGain);
        osc.start();
        ambientOscs.push(osc);
      });
    };

    playChord();
    ambientInterval = window.setInterval(playChord, 6000);
    isSynthPlaying = true;
    return true;
  } catch (e) {
    return false;
  }
}

export function stopAmbientSynth() {
  if (!isSynthPlaying) return;
  const ctx = getAudioContext();
  if (ambientGain && ctx) {
    try {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
    } catch (e) {}
  }
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  setTimeout(() => {
    ambientOscs.forEach(o => {
      try { o.stop(); o.disconnect(); } catch (e) {}
    });
    ambientOscs = [];
    isSynthPlaying = false;
  }, 600);
}

export function isAmbientSynthActive(): boolean {
  return isSynthPlaying;
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
  },

  checkpoint(index: number, isMuted: boolean = false) {
    const baseFreq = 587.33 + index * 110;
    playTone({ freq: baseFreq, to: baseFreq * 1.5, dur: 0.18, type: 'sine', gain: 0.06 }, isMuted);
  },

  raceStart(isMuted: boolean = false) {
    playTone({ freq: 440, to: 880, dur: 0.2, type: 'triangle', gain: 0.06 }, isMuted);
  },

  raceWin(isMuted: boolean = false) {
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        playTone({ freq, to: freq * 1.25, dur: 0.25, type: 'triangle', gain: 0.06 }, isMuted);
      }, idx * 120);
    });
  },

  terminalKey(isMuted: boolean = false) {
    playTone({ freq: 1200 + Math.random() * 400, to: 600, dur: 0.03, type: 'sine', gain: 0.015 }, isMuted);
  },

  terminalSuccess(isMuted: boolean = false) {
    playTone({ freq: 659.25, to: 1318.51, dur: 0.15, type: 'sine', gain: 0.04 }, isMuted);
  },

  terminalError(isMuted: boolean = false) {
    playTone({ freq: 220, to: 110, dur: 0.2, type: 'sawtooth', gain: 0.04 }, isMuted);
  },

  jarvisOnline(isMuted: boolean = false) {
    [440, 880, 1320, 1760].forEach((freq, idx) => {
      setTimeout(() => {
        playTone({ freq, to: freq * 1.15, dur: 0.12, type: 'sine', gain: 0.045 }, isMuted);
      }, idx * 65);
    });
  },

  jarvisPinch(isMuted: boolean = false) {
    playTone({ freq: 1760, to: 2640, dur: 0.08, type: 'sine', gain: 0.05 }, isMuted);
    setTimeout(() => {
      playTone({ freq: 2640, to: 3520, dur: 0.06, type: 'triangle', gain: 0.04 }, isMuted);
    }, 40);
  },

  jarvisScroll(isMuted: boolean = false) {
    playTone({ freq: 600, to: 900, dur: 0.05, type: 'sine', gain: 0.02 }, isMuted);
  },

  jarvisFist(isMuted: boolean = false) {
    playTone({ freq: 300, to: 150, dur: 0.18, type: 'triangle', gain: 0.05 }, isMuted);
  }
};
