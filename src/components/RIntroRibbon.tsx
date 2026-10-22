import React, { useEffect, useRef, useState, useCallback } from 'react';
import { netflixAudio } from '../utils/netflixAudio';

interface RIntroRibbonProps {
  onComplete: () => void;
}

export const RIntroRibbon: React.FC<RIntroRibbonProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isExploding, setIsExploding] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const hasFinishedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  const handleFinish = useCallback(() => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    setIsExiting(true);
    setTimeout(() => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      onComplete();
    }, 850);
  }, [onComplete]);

  useEffect(() => {
    // Accessibility check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    // 1. Play signature "Ta-dum" sound at 500ms
    const audioTimer = setTimeout(() => {
      netflixAudio.playTaDum();
    }, 500);

    // 2. Trigger spectrum ribbon burst at 2.4s (smooth, elegant duration to appreciate the R logo)
    const explosionTimer = setTimeout(() => {
      setIsExploding(true);
      startRibbonCanvas();
    }, 2400);

    // 3. Complete intro at 5.2s (allowing ribbons to gently dissolve and stream out)
    const masterTimer = setTimeout(() => {
      handleFinish();
    }, 5200);

    // Keyboard shortcuts to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(explosionTimer);
      clearTimeout(masterTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [handleFinish, onComplete]);

  const startRibbonCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const spectrumColors = [
      '#E50914', '#FF1E28', '#B20710', '#E50914',
      '#FF3366', '#C70039', '#900C3F', '#E60067',
      '#7928CA', '#9B51E0', '#6A00FF', '#4A148C',
      '#00DFD8', '#0070F3', '#00C9FF',
      '#FFB800', '#FF3843', '#FF4D4D'
    ];

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    const ribbons = Array.from({ length: 140 }, () => {
      return {
        x: cx + (Math.random() - 0.5) * 200,
        y: cy + (Math.random() - 0.5) * 260,
        z: 420 + Math.random() * 400,
        speed: 6 + Math.random() * 8,
        width: 3 + Math.random() * 6,
        length: 160 + Math.random() * 340,
        color: spectrumColors[Math.floor(Math.random() * spectrumColors.length)],
        alpha: 0,
        targetAlpha: 0.85 + Math.random() * 0.15,
        driftX: (Math.random() - 0.5) * 3.5,
        delay: Math.random() * 300
      };
    });

    const startTime = performance.now();

    const render = (now: number) => {
      if (hasFinishedRef.current || !ctx || !canvas) return;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const fov = 360;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const midX = w / 2;
      const midY = h / 2;

      const speedFactor = Math.min(1.0, 0.4 + (elapsed / 1200) * 0.6);

      for (const r of ribbons) {
        if (elapsed < r.delay) continue;

        r.z -= (r.speed * 1.2) * speedFactor;
        r.x += r.driftX * (340 / Math.max(r.z, 20));

        if (r.z > 8) {
          if (r.z > 140) {
            r.alpha = Math.min(r.targetAlpha, r.alpha + 0.05);
          } else {
            r.alpha = Math.max(0, r.alpha - 0.035);
          }

          const scale = fov / r.z;
          const screenX = midX + (r.x - midX) * scale;
          const screenY = midY + (r.y - midY) * scale;
          const ribbonW = Math.max(1.8, r.width * scale * 0.75);
          const ribbonH = Math.max(50, r.length * scale * 2.4);

          ctx.save();
          ctx.globalAlpha = r.alpha;

          const grad = ctx.createLinearGradient(0, screenY - ribbonH / 2, 0, screenY + ribbonH / 2);
          grad.addColorStop(0, 'rgba(0,0,0,0)');
          grad.addColorStop(0.2, r.color);
          grad.addColorStop(0.5, '#FFFFFF'); // Hot white core
          grad.addColorStop(0.8, r.color);
          grad.addColorStop(1, 'rgba(0,0,0,0)');

          ctx.fillStyle = grad;
          ctx.shadowColor = r.color;
          ctx.shadowBlur = 18 * Math.min(scale, 3);
          ctx.fillRect(screenX - ribbonW / 2, screenY - ribbonH / 2, ribbonW, ribbonH);

          ctx.restore();
        }
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    rafIdRef.current = requestAnimationFrame(render);
  };

  return (
    <div
      role="region"
      aria-label="Cinematic Intro Animation"
      onClick={() => netflixAudio.playTaDum()}
      className={`fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden transition-opacity duration-800 select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Volumetric Glow & Light Flares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#E50914] opacity-25 blur-[140px] animate-pulse" />
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF3843] to-transparent opacity-60 blur-[2px]" />
      </div>

      {/* Ribbon Explosion Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Dimensional Netflix-Style "R" Monogram (Enlarged & Cinematic) */}
      <div
        className={`relative z-20 flex flex-col items-center justify-center transition-all duration-1000 ${
          isExploding ? 'scale-[2.4] opacity-0 blur-lg duration-1200 ease-out' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative w-56 h-72 sm:w-72 sm:h-96 md:w-88 md:h-[440px] filter drop-shadow-[0_0_60px_rgba(229,9,20,0.85)]">
          <svg
            className="w-full h-full"
            viewBox="0 0 200 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="rStemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF3843" />
                <stop offset="25%" stopColor="#E50914" />
                <stop offset="75%" stopColor="#B81D24" />
                <stop offset="100%" stopColor="#660006" />
              </linearGradient>

              <linearGradient id="rLoopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF2B36" />
                <stop offset="40%" stopColor="#E50914" />
                <stop offset="85%" stopColor="#990008" />
                <stop offset="100%" stopColor="#4D0003" />
              </linearGradient>

              <linearGradient id="rKickGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF404B" />
                <stop offset="35%" stopColor="#E50914" />
                <stop offset="80%" stopColor="#B81D24" />
                <stop offset="100%" stopColor="#550005" />
              </linearGradient>

              <linearGradient id="rBevelHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="30%" stopColor="#FF8A90" stopOpacity="0.6" />
                <stop offset="70%" stopColor="#E50914" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#660000" stopOpacity="0" />
              </linearGradient>

              <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Ambient Shadow Facet */}
            <path
              d="M 40 20 L 76 20 L 76 240 L 40 240 Z"
              fill="#220002"
              opacity="0.8"
            />

            {/* Left Vertical Stem with 3D Bevel Edge */}
            <path
              d="M 40 20 L 76 20 L 76 240 L 40 240 Z"
              fill="url(#rStemGrad)"
              filter="url(#crimsonGlow)"
            />
            {/* Bevel Rim on Left Stem */}
            <path
              d="M 40 20 L 45 20 L 45 240 L 40 240 Z"
              fill="url(#rBevelHighlight)"
            />

            {/* Curved Loop of 'R' */}
            <path
              d="M 76 20 
                 L 130 20 
                 C 175 20, 185 55, 185 85 
                 C 185 118, 170 148, 126 148 
                 L 76 148 
                 Z 
                 M 76 56 
                 L 122 56 
                 C 142 56, 149 70, 149 85 
                 C 149 100, 142 112, 122 112 
                 L 76 112 
                 Z"
              fill="url(#rLoopGrad)"
              filter="url(#crimsonGlow)"
            />

            {/* Diagonal Kick Leg of 'R' (Curved & Tapered) */}
            <path
              d="M 106 135 
                 L 142 135 
                 L 188 240 
                 L 150 240 
                 L 112 152 
                 L 90 152 
                 L 106 135 
                 Z"
              fill="url(#rKickGrad)"
              filter="url(#crimsonGlow)"
            />

            {/* Specular Edge Highlights */}
            <path
              d="M 76 20 L 130 20 C 145 20, 160 25, 170 34 L 165 40 C 157 32, 144 26, 130 26 L 76 26 Z"
              fill="url(#rBevelHighlight)"
            />
            <path
              d="M 112 152 L 150 240 L 155 240 L 118 152 Z"
              fill="url(#rBevelHighlight)"
              opacity="0.8"
            />
          </svg>
        </div>

        {/* Cinematic Netflix-style Title Bar (Bigger & Crisp White) */}
        <div className="mt-8 sm:mt-11 flex items-center gap-3">
          <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-r from-transparent to-[#E50914] rounded-full shadow-[0_0_12px_#E50914]" />
          <span className="font-display text-base sm:text-2xl md:text-3xl uppercase tracking-[0.38em] text-white font-black drop-shadow-[0_2px_18px_rgba(255,255,255,0.65)]">
            RAJ KAMAL
          </span>
          <div className="w-8 sm:w-16 h-[2px] bg-gradient-to-l from-transparent to-[#E50914] rounded-full shadow-[0_0_12px_#E50914]" />
        </div>
      </div>

      {/* Skip Intro Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleFinish();
        }}
        className="absolute top-6 right-6 z-30 px-4 py-2 rounded-full border border-white/20 bg-black/60 hover:bg-[#E50914] hover:border-[#E50914] text-white/80 hover:text-white text-xs font-bold tracking-wider uppercase transition-all backdrop-blur-md shadow-lg"
      >
        Skip Intro <span className="opacity-60 ml-1 text-[10px] hidden sm:inline">(ESC)</span>
      </button>
    </div>
  );
};
