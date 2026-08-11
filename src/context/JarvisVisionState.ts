import { useState, useEffect } from 'react';
import { SOUNDS } from '../utils/soundEffects';

export type JarvisGesture = 'none' | 'pointer' | 'pinch' | 'scroll-up' | 'scroll-down' | 'fist' | 'rover-drive';
export type JarvisTrackingStatus = 'off' | 'loading' | 'active' | 'no-hand' | 'permission-denied' | 'error';

export interface JarvisVisionState {
  isActive: boolean;
  isMinimized: boolean;
  trackingStatus: JarvisTrackingStatus;
  gesture: JarvisGesture;
  cursorPos: { x: number; y: number };
  rawHandPos: { x: number; y: number; z: number };
  pinchProgress: number;
  isPinching: boolean;
  fps: number;
  errorMessage: string | null;
}

type Listener = () => void;

class JarvisVisionStore {
  private state: JarvisVisionState = {
    isActive: false,
    isMinimized: false,
    trackingStatus: 'off',
    gesture: 'none',
    cursorPos: { x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 },
    rawHandPos: { x: 0.5, y: 0.5, z: 0 },
    pinchProgress: 0,
    isPinching: false,
    fps: 0,
    errorMessage: null
  };

  private listeners = new Set<Listener>();

  getState() {
    return this.state;
  }

  setState(partial: Partial<JarvisVisionState> | ((prev: JarvisVisionState) => Partial<JarvisVisionState>)) {
    const next = typeof partial === 'function' ? partial(this.state) : partial;
    this.state = { ...this.state, ...next };
    this.listeners.forEach(l => l());
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  setActive(active: boolean) {
    if (active) {
      SOUNDS.jarvisOnline();
      this.setState({
        isActive: true,
        trackingStatus: 'loading',
        errorMessage: null
      });
    } else {
      this.setState({
        isActive: false,
        trackingStatus: 'off',
        gesture: 'none',
        isPinching: false,
        pinchProgress: 0
      });
    }
  }

  toggleActive() {
    this.setActive(!this.state.isActive);
  }

  setMinimized(minimized: boolean) {
    this.setState({ isMinimized: minimized });
  }

  toggleMinimized() {
    this.setState(s => ({ isMinimized: !s.isMinimized }));
  }

  setTrackingStatus(status: JarvisTrackingStatus, errorMessage: string | null = null) {
    this.setState({ trackingStatus: status, errorMessage });
  }

  updateHand(
    cursorPos: { x: number; y: number },
    rawHandPos: { x: number; y: number; z: number },
    gesture: JarvisGesture,
    isPinching: boolean,
    pinchProgress: number,
    fps: number
  ) {
    this.setState({
      cursorPos,
      rawHandPos,
      gesture,
      isPinching,
      pinchProgress,
      fps,
      trackingStatus: 'active'
    });
  }
}

export const jarvisStore = new JarvisVisionStore();

export function useJarvisStore<T>(selector?: (state: JarvisVisionState) => T): T {
  const [slice, setSlice] = useState(() =>
    selector ? selector(jarvisStore.getState()) : (jarvisStore.getState() as unknown as T)
  );

  useEffect(() => {
    const unsubscribe = jarvisStore.subscribe(() => {
      const current = selector ? selector(jarvisStore.getState()) : (jarvisStore.getState() as unknown as T);
      setSlice(current);
    });
    return unsubscribe;
  }, [selector]);

  return slice;
}
