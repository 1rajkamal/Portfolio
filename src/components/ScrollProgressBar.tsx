import React, { useEffect, useState } from 'react';

export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none origin-left transition-transform duration-75 ease-out"
      style={{
        transform: `scaleX(${progress / 100})`,
        background: 'linear-gradient(90deg, var(--accent, #6366f1), var(--accent-2, #8b5cf6), #06b6d4)',
        boxShadow: '0 0 10px rgba(6, 182, 212, 0.7), 0 0 5px var(--accent, #6366f1)',
      }}
      aria-hidden="true"
    />
  );
};
