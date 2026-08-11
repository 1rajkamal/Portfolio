import { useSyncExternalStore } from 'react';
import { SOUNDS, startAmbientSynth, stopAmbientSynth, isAmbientSynthActive } from '../utils/soundEffects';

export type WeatherMode = 'midnight' | 'sunset' | 'matrix';
export type VehicleSkin = 'cyber-cyan' | 'hyper-pink' | 'phantom-gold';

export interface TimeTrialState {
  active: boolean;
  currentRing: number;
  totalRings: number;
  startTime: number;
  elapsed: number;
  bestTime: number | null;
  finished: boolean;
}

export interface WorldState {
  started: boolean;
  nearZone: string | null;
  openZone: string | null;
  discovered: string[];
  orbs: number[];
  muted: boolean;
  joy: { x: number; y: number };
  jumpTick: number;
  respawnTick: number;
  launch: { tick: number; power: number };
  is3DActive: boolean;
  weatherMode: WeatherMode;
  vehicleSkin: VehicleSkin;
  timeTrial: TimeTrialState;
  terminalOpen: boolean;
  matrixActive: boolean;
  synthAudioPlaying: boolean;
}

type Listener = () => void;

class Store {
  private state: WorldState = {
    started: false,
    nearZone: null,
    openZone: null,
    discovered: [],
    orbs: [],
    muted: false,
    joy: { x: 0, y: 0 },
    jumpTick: 0,
    respawnTick: 0,
    launch: { tick: 0, power: 0 },
    is3DActive: false,
    weatherMode: 'midnight',
    vehicleSkin: 'cyber-cyan',
    timeTrial: {
      active: false,
      currentRing: 0,
      totalRings: 6,
      startTime: 0,
      elapsed: 0,
      bestTime: null,
      finished: false
    },
    terminalOpen: false,
    matrixActive: false,
    synthAudioPlaying: false
  };

  private listeners = new Set<Listener>();

  getState() {
    return this.state;
  }

  setState(partial: Partial<WorldState> | ((prev: WorldState) => Partial<WorldState>)) {
    const next = typeof partial === 'function' ? partial(this.state) : partial;
    this.state = { ...this.state, ...next };
    this.listeners.forEach(listener => listener());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  start() {
    this.setState({ started: true });
  }

  setIs3DActive(active: boolean) {
    this.setState({ is3DActive: active });
    if (active) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  setNearZone(zoneId: string | null) {
    const { nearZone, discovered } = this.state;
    if (nearZone !== zoneId) {
      const nextDiscovered = zoneId && !discovered.includes(zoneId) ? [...discovered, zoneId] : discovered;
      this.setState({
        nearZone: zoneId,
        openZone: zoneId,
        discovered: nextDiscovered
      });
    }
  }

  openPanel(zoneId: string) {
    this.setState({ openZone: zoneId });
  }

  closePanel() {
    this.setState({ openZone: null });
  }

  collectOrb(index: number) {
    const { orbs } = this.state;
    if (!orbs.includes(index)) {
      this.setState({ orbs: [...orbs, index] });
    }
  }

  toggleMute() {
    const nextMuted = !this.state.muted;
    this.setState({ muted: nextMuted });
    if (nextMuted && this.state.synthAudioPlaying) {
      stopAmbientSynth();
    }
  }

  setJoy(x: number, y: number) {
    this.setState({ joy: { x, y } });
  }

  requestJump() {
    this.setState(s => ({ jumpTick: s.jumpTick + 1 }));
  }

  requestRespawn() {
    this.setState(s => ({ respawnTick: s.respawnTick + 1 }));
  }

  requestLaunch(power: number) {
    this.setState(s => ({ launch: { tick: s.launch.tick + 1, power } }));
  }

  setWeatherMode(weatherMode: WeatherMode) {
    this.setState({ weatherMode });
  }

  setVehicleSkin(vehicleSkin: VehicleSkin) {
    this.setState({ vehicleSkin });
  }

  startTimeTrial() {
    SOUNDS.raceStart(this.state.muted);
    this.setState({
      timeTrial: {
        active: true,
        currentRing: 0,
        totalRings: 6,
        startTime: Date.now(),
        elapsed: 0,
        bestTime: this.state.timeTrial.bestTime,
        finished: false
      }
    });
  }

  passCheckpoint(ringIndex: number) {
    const { timeTrial, muted } = this.state;
    if (!timeTrial.active || timeTrial.finished) return;

    if (ringIndex === timeTrial.currentRing) {
      const nextRing = ringIndex + 1;
      SOUNDS.checkpoint(ringIndex, muted);

      if (nextRing >= timeTrial.totalRings) {
        const finalTime = Math.round((Date.now() - timeTrial.startTime) / 10) / 100;
        const newBest = timeTrial.bestTime ? Math.min(timeTrial.bestTime, finalTime) : finalTime;
        SOUNDS.raceWin(muted);
        this.setState({
          timeTrial: {
            ...timeTrial,
            currentRing: nextRing,
            elapsed: finalTime,
            bestTime: newBest,
            finished: true
          }
        });
      } else {
        this.setState({
          timeTrial: {
            ...timeTrial,
            currentRing: nextRing,
            elapsed: Math.round((Date.now() - timeTrial.startTime) / 10) / 100
          }
        });
      }
    }
  }

  stopTimeTrial() {
    this.setState(s => ({
      timeTrial: {
        ...s.timeTrial,
        active: false,
        finished: false
      }
    }));
  }

  setTerminalOpen(open: boolean) {
    this.setState({ terminalOpen: open });
  }

  setMatrixActive(active: boolean) {
    this.setState({ matrixActive: active });
  }

  toggleSynthAudio() {
    const currentlyPlaying = isAmbientSynthActive();
    if (currentlyPlaying) {
      stopAmbientSynth();
      this.setState({ synthAudioPlaying: false });
    } else {
      startAmbientSynth(this.state.muted);
      this.setState({ synthAudioPlaying: true });
    }
  }

  reset() {
    this.setState({
      nearZone: null,
      openZone: null,
      discovered: [],
      orbs: [],
      joy: { x: 0, y: 0 }
    });
  }
}

export const worldStore = new Store();

// Official React 18 store hook with zero tearing and safe concurrent rendering
export function useWorldStore<T>(selector?: (state: WorldState) => T): T {
  return useSyncExternalStore(
    cb => worldStore.subscribe(cb),
    () => (selector ? selector(worldStore.getState()) : (worldStore.getState() as unknown as T))
  );
}

// Global telemetry for speedometer & minimap
export const PLAYER_TELEMETRY = {
  x: 0,
  y: 0,
  z: 0,
  heading: 0,
  speed: 0,
  airborne: false
};

// Smooth section navigation from 3D world into 2D portfolio
export function navigateToSection(target: string) {
  const cleanId = target.replace(/^#/, '');
  worldStore.setIs3DActive(false);
  window.location.hash = cleanId;

  const tryScroll = (attempts = 0) => {
    const el = document.getElementById(cleanId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (attempts < 20) {
      setTimeout(() => tryScroll(attempts + 1), 40);
    }
  };

  setTimeout(() => tryScroll(), 50);
}
