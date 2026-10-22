/**
 * Web Audio API Netflix-Style Signature Chime & UI Micro-Sounds
 * 100% Client-side synthetic sound generation - Zero audio file downloads needed!
 */

class NetflixAudioEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('rk_portfolio_sound');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTaDum() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      // 1. Sub-Bass Thump ("Ta")
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(65, t);
      subOsc.frequency.exponentialRampToValueAtTime(32, t + 0.35);

      subGain.gain.setValueAtTime(0.7, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(t);
      subOsc.stop(t + 0.5);

      // 2. Secondary Impact ("Dum")
      const impactTime = t + 0.12;

      const lowOsc = this.ctx.createOscillator();
      const lowGain = this.ctx.createGain();
      lowOsc.type = 'triangle';
      lowOsc.frequency.setValueAtTime(98, impactTime);
      lowOsc.frequency.exponentialRampToValueAtTime(45, impactTime + 1.2);

      lowGain.gain.setValueAtTime(0.8, impactTime);
      lowGain.gain.exponentialRampToValueAtTime(0.001, impactTime + 1.5);

      lowOsc.connect(lowGain);
      lowGain.connect(this.ctx.destination);
      lowOsc.start(impactTime);
      lowOsc.stop(impactTime + 1.5);

      // 3. Cinematic Harmonic Chord Overtones
      const frequencies = [147.0, 220.0, 293.66, 440.0];
      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, impactTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450 + idx * 250, impactTime);
        filter.frequency.exponentialRampToValueAtTime(100, impactTime + 2.0);

        gain.gain.setValueAtTime(0.12 / (idx + 1), impactTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, impactTime + 2.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(impactTime);
        osc.stop(impactTime + 2.2);
      });
    } catch {
      // Autoplay or audio context permission error gracefully handled
    }
  }

  public playProfileClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.exponentialRampToValueAtTime(520, t + 0.12);

      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.22);
    } catch {}
  }

  public playHover() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);

      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.05);
    } catch {}
  }
}

export const netflixAudio = new NetflixAudioEngine();
