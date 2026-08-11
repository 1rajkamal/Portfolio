import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Minimize2,
  Maximize2,
  Eye,
  Hand,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  Compass
} from 'lucide-react';
import { jarvisStore, useJarvisStore, JarvisGesture } from '../context/JarvisVisionState';
import { worldStore, useWorldStore } from '../context/World3DState';
import { SOUNDS } from '../utils/soundEffects';

// MediaPipe Hands Landmark Connection Pairs
const HAND_CONNECTIONS = [
  // Thumb
  [0, 1], [1, 2], [2, 3], [3, 4],
  // Index
  [0, 5], [5, 6], [6, 7], [7, 8],
  // Middle
  [0, 9], [9, 10], [10, 11], [11, 12],
  // Ring
  [0, 13], [13, 14], [14, 15], [15, 16],
  // Pinky
  [0, 17], [17, 18], [18, 19], [19, 20],
  // Palm Base
  [5, 9], [9, 13], [13, 17]
];

const MEDIAPIPE_HANDS_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';
const MEDIAPIPE_CAMERA_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';

// Load script utility
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.crossOrigin = 'anonymous';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

const JarvisHoloHUDInner: React.FC = () => {
  const isActive = useJarvisStore(s => s.isActive);
  const isMinimized = useJarvisStore(s => s.isMinimized);
  const trackingStatus = useJarvisStore(s => s.trackingStatus);
  const gesture = useJarvisStore(s => s.gesture);
  const cursorPos = useJarvisStore(s => s.cursorPos);
  const isPinching = useJarvisStore(s => s.isPinching);
  const pinchProgress = useJarvisStore(s => s.pinchProgress);
  const fps = useJarvisStore(s => s.fps);
  const errorMessage = useJarvisStore(s => s.errorMessage);
  const is3DActive = useWorldStore(s => s.is3DActive);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInstanceRef = useRef<any>(null);
  const handsInstanceRef = useRef<any>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  // Smooth cursor smoothing state
  const smoothCursor = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastScrollTime = useRef<number>(0);
  const lastPinchState = useRef<boolean>(false);
  const lastFistTime = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastFpsTimeRef = useRef<number>(Date.now());

  // Trigger speech announcement on activation
  useEffect(() => {
    if (
      isActive &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof (window as any).SpeechSynthesisUtterance !== 'undefined'
    ) {
      try {
        const UtteranceClass = (window as any).SpeechSynthesisUtterance;
        const utterance = new UtteranceClass('Jarvis vision interface initialized.');
        utterance.rate = 1.1;
        utterance.pitch = 0.95;
        utterance.volume = 0.6;
        window.speechSynthesis.speak(utterance);
      } catch (e) {}
    }
  }, [isActive]);

  // Main Hand Tracking Initialization
  useEffect(() => {
    if (!isActive) {
      // Clean up camera & model
      if (cameraInstanceRef.current) {
        try { cameraInstanceRef.current.stop(); } catch (e) {}
        cameraInstanceRef.current = null;
      }
      if (handsInstanceRef.current) {
        try { handsInstanceRef.current.close(); } catch (e) {}
        handsInstanceRef.current = null;
      }
      return;
    }

    let isMounted = true;

    async function initMediaPipe() {
      try {
        jarvisStore.setTrackingStatus('loading');
        // Load MediaPipe scripts dynamically
        await Promise.all([
          loadScript(MEDIAPIPE_HANDS_CDN),
          loadScript(MEDIAPIPE_CAMERA_CDN)
        ]);

        if (!isMounted) return;

        const mpHands = (window as any).Hands;
        const mpCamera = (window as any).Camera;

        if (!mpHands || !mpCamera) {
          throw new Error('MediaPipe libraries unavailable.');
        }

        const hands = new mpHands({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.55,
          minTrackingConfidence: 0.5
        });

        hands.onResults((results: any) => {
          if (!isMounted) return;
          handleHandResults(results);
        });

        handsInstanceRef.current = hands;

        if (videoRef.current) {
          const camera = new mpCamera(videoRef.current, {
            onFrame: async () => {
              if (handsInstanceRef.current && videoRef.current) {
                await handsInstanceRef.current.send({ image: videoRef.current });
              }
            },
            width: 320,
            height: 240
          });

          await camera.start();
          cameraInstanceRef.current = camera;
          jarvisStore.setTrackingStatus('active');
        }
      } catch (err: any) {
        console.error('Jarvis Vision Error:', err);
        if (isMounted) {
          jarvisStore.setTrackingStatus(
            err.name === 'NotAllowedError' ? 'permission-denied' : 'error',
            err.message || 'Unable to access camera or load AI models'
          );
        }
      }
    }

    initMediaPipe();

    return () => {
      isMounted = false;
      if (cameraInstanceRef.current) {
        try { cameraInstanceRef.current.stop(); } catch (e) {}
      }
      if (handsInstanceRef.current) {
        try { handsInstanceRef.current.close(); } catch (e) {}
      }
    };
  }, [isActive]);

  // Process Hand Landmarks and Detect Gestures
  const handleHandResults = (results: any) => {
    // FPS calculation
    frameCountRef.current++;
    const now = Date.now();
    if (now - lastFpsTimeRef.current >= 1000) {
      const currentFps = Math.round((frameCountRef.current * 1000) / (now - lastFpsTimeRef.current));
      frameCountRef.current = 0;
      lastFpsTimeRef.current = now;
      jarvisStore.setState({ fps: currentFps });
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      jarvisStore.setState({ gesture: 'none', trackingStatus: 'no-hand' });
      return;
    }

    const landmarks = results.multiHandLandmarks[0];

    // Draw futuristic holographic laser bones
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#06B6D4'; // Cyberpunk Cyan
    ctx.shadowColor = '#06B6D4';
    ctx.shadowBlur = 10;

    HAND_CONNECTIONS.forEach(([start, end]) => {
      const p1 = landmarks[start];
      const p2 = landmarks[end];
      ctx.beginPath();
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    });

    // Draw glowing joint nodes
    landmarks.forEach((p: any, idx: number) => {
      ctx.beginPath();
      const isTip = [4, 8, 12, 16, 20].includes(idx);
      ctx.arc(p.x * canvas.width, p.y * canvas.height, isTip ? 5 : 3, 0, 2 * Math.PI);
      ctx.fillStyle = isTip ? '#F59E0B' : '#38BDF8';
      ctx.shadowColor = isTip ? '#F59E0B' : '#38BDF8';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    // Calculate Key Joints
    const indexTip = landmarks[8];
    const thumbTip = landmarks[4];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const wrist = landmarks[0];
    const middleKnuckle = landmarks[9];

    // Distance/camera invariant hand scale
    const palmScale = Math.max(0.05, Math.hypot(middleKnuckle.x - wrist.x, middleKnuckle.y - wrist.y));

    // Mirror X coordinates and expand active range [0.10, 0.90] -> [0, 1] for effortless screen reach
    const mirroredX = 1 - indexTip.x;
    const clampedX = Math.max(0, Math.min(1, (mirroredX - 0.10) / 0.80));
    const clampedY = Math.max(0, Math.min(1, (indexTip.y - 0.08) / 0.82));

    const targetScreenX = clampedX * window.innerWidth;
    const targetScreenY = clampedY * window.innerHeight;

    // Smooth cursor interpolation (Lerp factor = 0.35 for snappy & fluid control)
    smoothCursor.current.x += (targetScreenX - smoothCursor.current.x) * 0.35;
    smoothCursor.current.y += (targetScreenY - smoothCursor.current.y) * 0.35;

    const curX = Math.round(smoothCursor.current.x);
    const curY = Math.round(smoothCursor.current.y);

    // 1. Calculate Palm-Normalized Scale-Invariant Pinch Distance
    const thumbIndexRawDist = Math.hypot(thumbTip.x - indexTip.x, thumbTip.y - indexTip.y);
    const thumbMiddleRawDist = Math.hypot(thumbTip.x - middleTip.x, thumbTip.y - middleTip.y);
    const rawPinchDist = Math.min(thumbIndexRawDist, thumbMiddleRawDist);

    const normalizedPinchRatio = rawPinchDist / palmScale;

    // Scale-invariant threshold (0.36 ratio) + absolute fallback (0.09)
    const isPinchingNow = normalizedPinchRatio < 0.36 || rawPinchDist < 0.09;
    const progress = Math.max(0, Math.min(1, 1 - (normalizedPinchRatio - 0.20) / 0.35));

    // 2. Calculate Fist (all tips close to wrist)
    const avgTipDistToWrist =
      (Math.hypot(indexTip.x - wrist.x, indexTip.y - wrist.y) +
        Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y) +
        Math.hypot(ringTip.x - wrist.x, ringTip.y - wrist.y) +
        Math.hypot(pinkyTip.x - wrist.y, pinkyTip.y - wrist.y)) /
      4;
    const isFist = avgTipDistToWrist < 0.24;

    // 3. Calculate Gestures
    let activeGesture: JarvisGesture = 'pointer';

    if (isFist) {
      activeGesture = 'fist';
      if (now - lastFistTime.current > 1800) {
        lastFistTime.current = now;
        SOUNDS.jarvisFist(!soundEnabled);
        // Toggle 3D Rover mode or close modal
        if (is3DActive) {
          worldStore.setIs3DActive(false);
        } else {
          worldStore.setTerminalOpen(false);
        }
      }
    } else if (isPinchingNow) {
      activeGesture = 'pinch';
      // Trigger click on initial pinch down edge
      if (!lastPinchState.current) {
        SOUNDS.jarvisPinch(!soundEnabled);
        triggerHolographicClick(curX, curY);
        // Spawn holographic shockwave ripple
        setRipples(r => [...r.slice(-5), { id: Date.now(), x: curX, y: curY }]);
      }
    } else if (indexTip.y < 0.18) {
      activeGesture = 'scroll-up';
      if (now - lastScrollTime.current > 45) {
        window.scrollBy({ top: -55, behavior: 'smooth' });
        lastScrollTime.current = now;
      }
    } else if (indexTip.y > 0.82) {
      activeGesture = 'scroll-down';
      if (now - lastScrollTime.current > 45) {
        window.scrollBy({ top: 55, behavior: 'smooth' });
        lastScrollTime.current = now;
      }
    }

    // If inside 3D Rover World, use hand tilt for driving
    if (is3DActive) {
      activeGesture = 'rover-drive';
      const steer = (mirroredX - 0.5) * 2.2;
      const throttle = -(indexTip.y - 0.5) * 2.2;
      worldStore.setJoy(
        Math.max(-1, Math.min(1, steer)),
        Math.max(-1, Math.min(1, throttle))
      );

      if (isPinchingNow && !lastPinchState.current) {
        worldStore.requestJump();
      }
    }

    lastPinchState.current = isPinchingNow;

    jarvisStore.updateHand(
      { x: curX, y: curY },
      { x: mirroredX, y: indexTip.y, z: indexTip.z || 0 },
      activeGesture,
      isPinchingNow,
      progress,
      jarvisStore.getState().fps
    );
  };

  // Deep Z-Stack Holographic Element Click Dispatcher
  const triggerHolographicClick = (x: number, y: number) => {
    try {
      const elements = document.elementsFromPoint(x, y);
      if (!elements || elements.length === 0) return;

      // Filter out all HUD elements
      const nonHudElements = elements.filter(el => el && !el.closest('[data-jarvis-hud]'));
      if (nonHudElements.length === 0) return;

      // Priority 1: Search the full element z-stack for specific interactive controls first
      let clickTarget: HTMLElement | null = null;

      for (const el of nonHudElements) {
        const directInteractive = (el as Element).closest(
          'button, a, input, textarea, select, [role="button"], [role="link"], [role="tab"], label, summary, [onclick], .btn-luxury, .btn-primary'
        ) as HTMLElement | null;

        if (directInteractive) {
          clickTarget = directInteractive;
          break;
        }
      }

      // Priority 2: Custom clickable card wrappers
      if (!clickTarget) {
        for (const el of nonHudElements) {
          const customClickable = (el as Element).closest(
            '[tabindex], .cursor-pointer'
          ) as HTMLElement | null;

          if (customClickable) {
            clickTarget = customClickable;
            break;
          }
        }
      }

      // Priority 3: Fallback to the topmost non-HUD element
      if (!clickTarget) {
        clickTarget = nonHudElements[0] as HTMLElement;
      }

      const eventOptions: MouseEventInit = {
        bubbles: true,
        cancelable: true,
        view: window,
        detail: 1,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        button: 0,
        buttons: 1
      };

      // 1. Dispatch full pointer down & mouse down sequence
      clickTarget.dispatchEvent(new PointerEvent('pointerdown', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
      clickTarget.dispatchEvent(new MouseEvent('mousedown', eventOptions));

      // 2. Focus element if applicable
      if (typeof clickTarget.focus === 'function') {
        try { clickTarget.focus(); } catch {}
      }

      // 3. Dispatch pointer up & mouse up
      clickTarget.dispatchEvent(new PointerEvent('pointerup', { ...eventOptions, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
      clickTarget.dispatchEvent(new MouseEvent('mouseup', eventOptions));

      // 4. Dispatch native click event
      clickTarget.dispatchEvent(new MouseEvent('click', eventOptions));

      // 5. Invoke native .click() method
      if (typeof clickTarget.click === 'function') {
        clickTarget.click();
      }

      // 6. Handle link href navigation
      const anchor = clickTarget.closest('a') as HTMLAnchorElement | null;
      if (anchor) {
        if (anchor.hash && anchor.hash.startsWith('#')) {
          const targetId = anchor.hash.slice(1);
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (anchor.href && !anchor.href.includes('#')) {
          if (anchor.target === '_blank') {
            window.open(anchor.href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = anchor.href;
          }
        }
      }
    } catch (err) {
      console.warn('Jarvis click dispatch error:', err);
    }
  };

  if (!isActive) return null;

  return (
    <>
      {/* 1. Holographic Floating Laser Reticle on Screen */}
      <div
        data-jarvis-hud
        className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Concentric Rotating Hologram Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer Ring with Ticks */}
          <div
            className={`w-14 h-14 rounded-full border border-dashed transition-all duration-300 ${
              isPinching
                ? 'border-amber-400 scale-75 rotate-90 shadow-[0_0_20px_rgba(245,158,11,0.9)]'
                : 'border-cyan-400/80 animate-spin-slow shadow-[0_0_15px_rgba(6,182,212,0.6)]'
            }`}
          />

          {/* Inner Target Crosshair */}
          <div
            className={`absolute w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              isPinching
                ? 'border-amber-300 bg-amber-400/30 scale-125'
                : 'border-cyan-300 bg-cyan-400/10'
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isPinching ? 'bg-amber-300 shadow-[0_0_10px_#F59E0B]' : 'bg-cyan-300 shadow-[0_0_8px_#06B6D4]'
              }`}
            />
          </div>

          {/* Hologram Coordinate & Status Readout */}
          <div className="absolute top-8 left-8 whitespace-nowrap px-2 py-0.5 rounded bg-black/85 border border-cyan-500/40 text-[9px] font-mono font-bold text-cyan-300 backdrop-blur-sm shadow-md flex items-center gap-1.5">
            <span>JARVIS [X:{cursorPos.x} Y:{cursorPos.y}]</span>
            {isPinching ? (
              <span className="text-amber-300 font-extrabold uppercase animate-pulse">⚡ CLICK</span>
            ) : gesture !== 'none' ? (
              <span className="text-cyan-400 uppercase">· {gesture}</span>
            ) : null}
          </div>
        </div>
      </div>

      {/* 2. Holographic Ripple Shockwaves on Pinch Click */}
      {ripples.map(r => (
        <div
          key={r.id}
          data-jarvis-hud
          className="fixed pointer-events-none z-[9998] rounded-full border-2 border-amber-400 animate-ping"
          style={{
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: '60px',
            height: '60px',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}

      {/* 3. Floating Holographic PiP Corner HUD */}
      <div data-jarvis-hud className="fixed bottom-6 right-6 z-[9990] flex flex-col items-end gap-3 pointer-events-auto">
        {/* Sci-Fi Instructions Banner */}
        {showInstructions && !isMinimized && (
          <div className="glass-panel p-3.5 rounded-2xl border border-cyan-500/40 max-w-xs shadow-2xl backdrop-blur-2xl text-xs font-mono animate-fadeIn relative">
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1.5">
              <Zap size={14} className="animate-pulse" />
              <span>JARVIS AI GESTURES</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              <li>🖐️ <b className="text-cyan-300">Move Hand</b>: Aim holographic laser</li>
              <li>🤏 <b className="text-amber-300">Pinch Finger</b>: Click buttons & cards</li>
              <li>☝️ <b className="text-emerald-300">Hand Top/Bottom</b>: Auto-scroll</li>
              <li>✊ <b className="text-rose-300">Fist</b>: Toggle 3D Rover mode</li>
            </ul>
          </div>
        )}

        {/* Main Camera HUD Glass Panel */}
        <div className="glass-panel rounded-3xl border border-cyan-500/50 shadow-[0_0_35px_rgba(6,182,212,0.25)] overflow-hidden transition-all duration-300 backdrop-blur-2xl">
          {/* Header Bar */}
          <div className="px-4 py-2.5 bg-cyan-950/80 border-b border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-extrabold text-cyan-300 tracking-wider">JARVIS VISION</span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-[9px] text-cyan-200 border border-cyan-500/30">
                {fps} FPS
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                title={soundEnabled ? 'Mute AI Audio' : 'Unmute AI Audio'}
              >
                {soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
              </button>

              <button
                type="button"
                onClick={() => jarvisStore.toggleMinimized()}
                className="p-1 rounded text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
                title={isMinimized ? 'Expand HUD' : 'Minimize HUD'}
              >
                {isMinimized ? <Maximize2 size={13} /> : <Minimize2 size={13} />}
              </button>

              <button
                type="button"
                onClick={() => jarvisStore.setActive(false)}
                className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition-colors"
                title="Shutdown Jarvis Vision"
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Camera Viewport (Hidden if Minimized) */}
          {!isMinimized && (
            <div className="p-3 bg-black/90">
              <div className="relative w-64 h-48 rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-950 flex items-center justify-center">
                {/* Hidden Real Video Tag */}
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover opacity-25 scale-x-[-1]"
                />

                {/* Laser Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  width={320}
                  height={240}
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />

                {/* Cyberpunk Grid Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(#06B6D4 1px, transparent 1px), linear-gradient(90deg, #06B6D4 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Status Indicator Overlays */}
                {trackingStatus === 'loading' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-cyan-400 text-xs font-mono gap-2">
                    <Sparkles size={20} className="animate-spin" />
                    <span>SYNCHRONIZING AI...</span>
                  </div>
                )}

                {trackingStatus === 'permission-denied' && (
                  <div className="absolute inset-0 p-4 flex flex-col items-center justify-center bg-black/90 text-rose-400 text-center text-xs font-mono gap-1.5">
                    <span>Camera Permission Blocked</span>
                    <span className="text-[10px] text-slate-400">Please enable webcam access to use touchless gestures.</span>
                  </div>
                )}

                {trackingStatus === 'no-hand' && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/70 border border-amber-500/40 text-[9px] font-mono text-amber-400 animate-pulse">
                    SEARCHING FOR HAND...
                  </div>
                )}

                {/* Telemetry Corner Badges */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-cyan-400 bg-black/80 px-2 py-1 rounded-lg border border-cyan-500/20 backdrop-blur-md">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-400" />
                    100% ON-DEVICE
                  </span>
                  <span className="font-extrabold uppercase text-amber-300">
                    {gesture.replace('-', ' ')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// --- Isolated Error Boundary so Jarvis crash never white-pages the portfolio ---
class JarvisErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  componentDidCatch(e: Error) { console.warn('JarvisHoloHUD caught error:', e.message); }
  render() {
    if (this.state.crashed) return null;
    return this.props.children;
  }
}

export const JarvisHoloHUD: React.FC = () => (
  <JarvisErrorBoundary>
    <JarvisHoloHUDInner />
  </JarvisErrorBoundary>
);

