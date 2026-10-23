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
          className="absolute -left-36 -top-36 h-[26rem] w-[26rem] md:h-[38rem] md:w-[38rem] rounded-full blur-[60px] md:blur-[150px] opacity-10 dark:opacity-10 transition-colors duration-700 ease-out will-change-transform"
          style={{
            backgroundColor: 'var(--accent)',
            transform: `translate3d(0, ${scrollProgress * 40}px, 0)`
          }}
        />

        {/* Center-Right Ambient Orb (Subtle -12% parallax) */}
        <div
          className="absolute -right-36 top-1/3 h-[24rem] w-[24rem] md:h-[34rem] md:w-[34rem] rounded-full blur-[60px] md:blur-[150px] opacity-10 dark:opacity-8 transition-colors duration-700 ease-out will-change-transform"
          style={{
            backgroundColor: 'var(--accent-2)',
            transform: `translate3d(0, ${-scrollProgress * 50}px, 0)`
          }}
        />

        {/* Bottom Ambient Orb */}
        <div
          className="absolute left-1/3 bottom-10 h-[22rem] w-[22rem] md:h-[32rem] md:w-[32rem] rounded-full blur-[60px] md:blur-[160px] opacity-10 dark:opacity-7 transition-colors duration-700 ease-out will-change-transform"
          style={{
            backgroundColor: 'var(--accent)',
            transform: `translate3d(0, ${scrollProgress * 30}px, 0)`
          }}
        />
      </div>
    </>
  );
};
