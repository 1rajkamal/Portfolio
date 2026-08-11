import React from 'react';
import { useScrollColor } from '../context/ScrollColorContext';

export const ScrollColorBackdrop: React.FC = () => {
  const { scrollProgress } = useScrollColor();

  return (
    <>
      {/* Top Dynamic Scroll Progress Indicator Line */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-black/10 dark:bg-white/5">
        <div
          className="h-full transition-all duration-150 ease-out shadow-lg"
          style={{
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, var(--accent), var(--accent-2))`,
            boxShadow: `0 0 14px var(--accent)`
          }}
        />
      </div>

      {/* Atmospheric Ambient Lighting Mesh with Scroll Parallax */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise-overlay"
      >
        {/* Top-Left Ambient Orb (Subtle 10% parallax) */}
        <div
          className="absolute -left-36 -top-36 h-[38rem] w-[38rem] rounded-full blur-[150px] opacity-25 dark:opacity-30 transition-all duration-700 ease-out"
          style={{
            backgroundColor: 'var(--accent)',
            transform: `translateY(${scrollProgress * 40}px)`
          }}
        />

        {/* Center-Right Ambient Orb (Subtle -12% parallax) */}
        <div
          className="absolute -right-36 top-1/3 h-[34rem] w-[34rem] rounded-full blur-[150px] opacity-20 dark:opacity-25 transition-all duration-700 ease-out"
          style={{
            backgroundColor: 'var(--accent-2)',
            transform: `translateY(${-scrollProgress * 50}px)`
          }}
        />

        {/* Bottom Ambient Orb */}
        <div
          className="absolute left-1/3 bottom-10 h-[32rem] w-[32rem] rounded-full blur-[160px] opacity-15 dark:opacity-20 transition-all duration-700 ease-out"
          style={{
            backgroundColor: 'var(--accent)',
            transform: `translateY(${scrollProgress * 30}px)`
          }}
        />
      </div>
    </>
  );
};
