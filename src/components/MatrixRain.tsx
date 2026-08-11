import React, { useEffect, useRef } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { worldStore } from '../context/World3DState';

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEF01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンRAJKAMALPYTHONSQL';
    const fontSize = 15;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const render = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#10b981';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Bright lead character
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#a7f3d0';
        } else {
          ctx.fillStyle = '#059669';
        }

        ctx.fillText(text, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between p-6 bg-black/90 backdrop-blur-sm animate-fadeIn font-mono">
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

      {/* Header Banner */}
      <div className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full glass-panel px-6 py-3 rounded-2xl border border-emerald-500/40 shadow-2xl">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-emerald-400 animate-pulse" size={20} />
          <div>
            <span className="text-xs font-bold text-emerald-400 tracking-widest uppercase">
              NEURAL MATRIX STREAM ACTIVE
            </span>
            <p className="text-[11px] text-emerald-200/70">Connected to Raj Kamal's Knowledge Grid</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => worldStore.setMatrixActive(false)}
          className="p-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 hover:text-emerald-100 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <X size={16} /> Exit Matrix
        </button>
      </div>

      {/* Footer Instructions */}
      <div className="relative z-10 text-center max-w-md mx-auto glass-panel px-5 py-2.5 rounded-full border border-emerald-500/30 text-xs text-emerald-300">
        Press <kbd className="bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700 font-bold">ESC</kbd> or click Exit to return
      </div>
    </div>
  );
};
