import { useState, useEffect } from 'react';

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
    is3DActive: false
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
    this.setState(s => ({ muted: !s.muted }));
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

// React hook to access world state in components
export function useWorldStore<T>(selector?: (state: WorldState) => T): T {
  const [slice, setSlice] = useState(() => (selector ? selector(worldStore.getState()) : (worldStore.getState() as unknown as T)));

  useEffect(() => {
    const unsubscribe = worldStore.subscribe(() => {
      const current = selector ? selector(worldStore.getState()) : (worldStore.getState() as unknown as T);
      setSlice(current);
    });
    return unsubscribe;
  }, [selector]);

  return slice;
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

