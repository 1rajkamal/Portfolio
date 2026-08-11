import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Volume2,
  VolumeX,
  Compass,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
  X,
  Zap,
  Flame,
  Gamepad2
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolioData';
import { worldStore, useWorldStore, PLAYER_TELEMETRY, navigateToSection } from '../../context/World3DState';

const ZONES = PORTFOLIO_DATA.world3d.zones;
const TOTAL_ORBS = PORTFOLIO_DATA.world3d.dataOrbLocations.length;

// 1. Cyber Radar Minimap
const RadarMinimap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nearZoneId = useWorldStore(s => s.nearZone);
  const discovered = useWorldStore(s => s.discovered);
  const orbs = useWorldStore(s => s.orbs);

  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 150;
    canvas.width = size;
    canvas.height = size;
    const center = size / 2;
    const scale = size / 130;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // Radar Outer Ring
      ctx.beginPath();
      ctx.arc(center, center, center - 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Range Concentric Rings
      [0.35, 0.7, 0.95].forEach(r => {
        ctx.beginPath();
        ctx.arc(center, center, (center - 4) * r, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
        ctx.stroke();
      });

      // Rotating Radar Sweep Line
      const sweepAngle = (Date.now() / 1000) * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.lineTo(center + Math.cos(sweepAngle) * (center - 4), center + Math.sin(sweepAngle) * (center - 4));
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
      ctx.stroke();

      // Landmark Blips
      for (const zone of ZONES) {
        const zx = center + zone.position[0] * scale;
        const zy = center + zone.position[2] * scale;
        const isDiscovered = discovered.includes(zone.id);

        ctx.beginPath();
        ctx.arc(zx, zy, isDiscovered ? 5 : 3.5, 0, Math.PI * 2);
        ctx.fillStyle = zone.color;
        ctx.shadowColor = zone.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Player Blip & Heading Arrow
      const px = center + PLAYER_TELEMETRY.x * scale;
      const py = center + PLAYER_TELEMETRY.z * scale;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(PLAYER_TELEMETRY.heading);

      // Cyber Sports Car Arrow
      ctx.beginPath();
      ctx.moveTo(0, -7);
      ctx.lineTo(4, 5);
      ctx.lineTo(0, 3);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fillStyle = '#00f5ff';
      ctx.shadowColor = '#00f5ff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [discovered, nearZoneId, orbs]);

  return (
    <div className="relative rounded-full p-1 bg-slate-950/80 border border-cyan-500/30 backdrop-blur-md shadow-2xl">
      <canvas ref={canvasRef} className="rounded-full w-28 h-28 sm:w-36 sm:h-36 block" />
      <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono text-cyan-400 tracking-wider font-bold">
        CYBER-RADAR
      </span>
    </div>
  );
};

// 2. Cyber Digital Speedometer
const Speedometer: React.FC = () => {
  const [speed, setSpeed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSpeed(Math.round(PLAYER_TELEMETRY.speed * 4.2));
    }, 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-3 border border-cyan-500/30">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Velocity</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black font-mono text-cyan-400">{speed}</span>
          <span className="text-[10px] text-slate-500 font-bold">KM/H</span>
        </div>
      </div>
      <div className="w-1.5 h-10 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
        <div
          className="w-full bg-gradient-to-t from-cyan-400 to-pink-500 rounded-full transition-all duration-100"
          style={{ height: `${Math.min(100, (speed / 120) * 100)}%` }}
        />
      </div>
    </div>
  );
};

// 3. Touch Virtual Joystick
const TouchJoystick: React.FC = () => {
  const [active, setActive] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setActive(true);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!active || !baseRef.current || !knobRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const maxR = rect.width / 2;

    let dx = e.clientX - cx;
    let dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist > maxR) {
      dx = (dx / dist) * maxR;
      dy = (dy / dist) * maxR;
    }

    knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    worldStore.setJoy(dx / maxR, dy / maxR);
  };

  const handlePointerUp = () => {
    setActive(false);
    if (knobRef.current) knobRef.current.style.transform = 'translate(0px, 0px)';
    worldStore.setJoy(0, 0);
  };

  return (
    <div className="w3d-touch">
      <div
        ref={baseRef}
        className="w3d-joy"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div ref={knobRef} className="w3d-joy-knob" />
      </div>

      <button
        type="button"
        className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-cyan-500 font-black text-xs text-white shadow-xl active:scale-95 flex items-center justify-center border-2 border-white/40"
        onPointerDown={e => {
          e.preventDefault();
          worldStore.requestJump();
        }}
      >
        JUMP
      </button>
    </div>
  );
};

// 4. Interactive Landmark Popover Panel
const LandmarkPanel: React.FC = () => {
  const openZoneId = useWorldStore(s => s.openZone);
  const close = useCallback(() => worldStore.closePanel(), []);

  if (!openZoneId) return null;
  const zone = ZONES.find(z => z.id === openZoneId);
  if (!zone) return null;

  const { panel } = zone;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative max-w-lg w-full rounded-3xl glass-panel p-6 sm:p-8 text-white border shadow-2xl animate-scaleUp"
        style={{ borderColor: zone.color }}
      >
        <button
          type="button"
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          aria-label="Close panel"
        >
          <X size={18} />
        </button>

        <span className="text-xs font-black uppercase tracking-wider" style={{ color: zone.color }}>
          {panel.eyebrow}
        </span>
        <h2 className="text-2xl font-black mt-1 text-white font-display">{panel.title}</h2>

        <div className="mt-4 space-y-2 text-slate-300 text-sm leading-relaxed">
          {panel.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {panel.chips && (
          <div className="mt-5 flex flex-wrap gap-2">
            {panel.chips.map(chip => (
              <span
                key={chip}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700 text-slate-200"
              >
                {chip}
              </span>
            ))}
          </div>
        )}

        {panel.cta && (
          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
            <span className="text-xs text-slate-400">Press ESC or click close to continue driving</span>
            {panel.cta.external ? (
              <a
                href={panel.cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-cyber text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                {panel.cta.label} <ExternalLink size={14} />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => {
                  navigateToSection(panel.cta.href);
                }}
                className="btn-cyber text-xs py-2 px-4 inline-flex items-center gap-1.5"
              >
                {panel.cta.label} <ChevronRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 5. Intro Instructions Modal
const IntroModal: React.FC = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleStart = () => {
    worldStore.start();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative max-w-md w-full rounded-3xl glass-panel p-6 sm:p-8 text-white border border-cyan-500/40 shadow-2xl text-center animate-scaleUp">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 size={32} />
        </div>

        <h2 className="text-2xl font-black font-display text-white">
          Welcome to <span className="text-cyber-cyan">Raj's 3D Cyber Island</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Drive the Cyber Rover, smash physics skill blocks, explore interactive project pods, and collect data orbs!
        </p>

        {/* Controls */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
          {!isTouch ? (
            <>
              <div className="flex items-center justify-between">
                <span>Steer & Accelerate</span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-800 px-2 py-0.5 rounded">W A S D / Arrows</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Jump Hover</span>
                <span className="font-mono text-cyan-400 font-bold bg-slate-800 px-2 py-0.5 rounded">SPACE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Turbo Jet Boost</span>
                <span className="font-mono text-pink-400 font-bold bg-slate-800 px-2 py-0.5 rounded">SHIFT</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Respawn Rover</span>
                <span className="font-mono text-amber-400 font-bold bg-slate-800 px-2 py-0.5 rounded">R</span>
              </div>
            </>
          ) : (
            <div className="text-center py-1 text-cyan-400 font-medium">
              Use on-screen joystick to steer and the Jump button to hover.
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleStart}
          className="btn-cyber w-full justify-center py-3 mt-6 text-sm font-black tracking-wide"
        >
          START EXPLORING <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
};

export const WorldHUD: React.FC = () => {
  const started = useWorldStore(s => s.started);
  const muted = useWorldStore(s => s.muted);
  const nearZoneId = useWorldStore(s => s.nearZone);
  const discovered = useWorldStore(s => s.discovered);
  const orbs = useWorldStore(s => s.orbs);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const nearZone = ZONES.find(z => z.id === nearZoneId);
  const isCompleted = discovered.length === ZONES.length && orbs.length >= TOTAL_ORBS;

  return (
    <>
      {!started && <IntroModal />}

      {/* Top Header Bar */}
      <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none">
        {/* Left: Exit & Sound controls */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            type="button"
            onClick={() => worldStore.setIs3DActive(false)}
            className="glass-panel px-4 py-2 rounded-xl text-xs font-black text-white hover:bg-slate-800 transition-all flex items-center gap-1.5 border border-white/20 hover:scale-105"
          >
            ← Classic View
          </button>
          <button
            type="button"
            onClick={() => worldStore.toggleMute()}
            className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white transition-all border border-white/20"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Center: Mission Progress Bar */}
        <div className="hidden sm:flex items-center gap-4 glass-panel px-5 py-2 rounded-full border border-cyan-500/30">
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Compass size={14} className="text-cyan-400" />
            <span>Landmarks:</span>
            <span className="font-bold font-mono text-cyan-400">
              {discovered.length}/{ZONES.length}
            </span>
          </div>
          <div className="w-px h-3 bg-slate-700" />
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <Zap size={14} className="text-pink-400" />
            <span>Data Orbs:</span>
            <span className="font-bold font-mono text-pink-400">
              {orbs.length}/{TOTAL_ORBS}
            </span>
          </div>
        </div>

        {/* Right: Radar Minimap */}
        <div className="pointer-events-auto">
          <RadarMinimap />
        </div>
      </header>

      {/* Near Landmark Action Prompt */}
      {nearZone && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-bounce">
          <button
            type="button"
            onClick={() => worldStore.openPanel(nearZone.id)}
            className="btn-cyber py-2.5 px-6 text-sm font-black shadow-2xl"
          >
            <Sparkles size={16} /> Press Enter to Inspect {nearZone.label}
          </button>
        </div>
      )}

      {/* Bottom Left: Speedometer & Hint */}
      <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
        <Speedometer />
        {!isTouch && (
          <span className="hidden md:inline-block text-[11px] text-slate-400 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-800">
            <kbd className="font-mono text-cyan-400 font-bold">WASD</kbd> drive · <kbd className="font-mono text-cyan-400 font-bold">Space</kbd> jump · <kbd className="font-mono text-pink-400 font-bold">Shift</kbd> boost · <kbd className="font-mono text-amber-400 font-bold">R</kbd> reset
          </span>
        )}
      </div>

      {/* Mobile Touch Controls */}
      {isTouch && <TouchJoystick />}

      {/* Landmark Popup Panel */}
      <LandmarkPanel />

      {/* Whole Island Explored Toast */}
      {isCompleted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-5 rounded-3xl glass-panel border border-cyan-400 text-center shadow-2xl text-white max-w-sm">
          <p className="font-black text-sm text-cyan-400">🎉 Whole Cyber Island Explored!</p>
          <p className="text-xs text-slate-300 mt-1">You've visited every landmark and collected all data orbs.</p>
          <button
            type="button"
            onClick={() => navigateToSection('contact')}
            className="btn-cyber text-xs py-2 px-4 mt-3 inline-flex items-center gap-1 cursor-pointer"
          >
            Connect with Raj <ExternalLink size={13} />
          </button>
        </div>
      )}
    </>
  );
};
