import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeContext';

export interface ZoneColorConfig {
  id: string;
  bg: string;
  surface: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  accent2: string;
  glow: string;
}

// Dark Mode Curated Luxury Palette Zones (Midnight, Emerald, Violet, Amber, Ocean)
export const DARK_ZONES: ZoneColorConfig[] = [
  // 1. Hero: Midnight Luxury (#0A0A0F + Gold & Violet)
  {
    id: 'home',
    bg: '#0A0A0F',
    surface: '#14141C',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#D4AF37',      // Muted Gold
    accent2: '#7C5CFF',     // Electric Violet
    glow: 'rgba(212, 175, 55, 0.22)'
  },
  // 2. About: Charcoal & Soft Violet (#0E0E12 + Violet & Rose)
  {
    id: 'about',
    bg: '#0E0E12',
    surface: '#17171F',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#A78BFA',      // Soft Violet
    accent2: '#FF6B9D',     // Rose Magenta
    glow: 'rgba(167, 139, 250, 0.22)'
  },
  // 3. Skills: Obsidian & Emerald (#0B0F0E + Emerald & Warm Amber)
  {
    id: 'skills',
    bg: '#0B0F0E',
    surface: '#121A18',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#2ED9A0',      // Emerald Green
    accent2: '#FFB86B',     // Warm Amber
    glow: 'rgba(46, 217, 160, 0.22)'
  },
  // 4. Projects: Midnight Sapphire (#080D1A + Ice Cyan & Royal Blue)
  {
    id: 'projects',
    bg: '#080D1A',
    surface: '#101726',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#38BDF8',      // Ice Cyan
    accent2: '#818CF8',     // Royal Indigo
    glow: 'rgba(56, 189, 248, 0.22)'
  },
  // 5. Certificates & Hackathons: Imperial Obsidian (#0F0D15 + Amethyst & Topaz)
  {
    id: 'certifications',
    bg: '#0F0D15',
    surface: '#191524',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#C084FC',      // Amethyst
    accent2: '#FBBF24',     // Warm Gold
    glow: 'rgba(192, 132, 252, 0.22)'
  },
  // 6. Contact: Deep Obsidian Gold (#0A0A0F + Gold & Emerald)
  {
    id: 'contact',
    bg: '#0A0A0F',
    surface: '#14141C',
    textPrimary: '#F8FAFC',
    textMuted: '#94A3B8',
    accent: '#D4AF37',      // Muted Gold
    accent2: '#2ED9A0',     // Emerald
    glow: 'rgba(212, 175, 55, 0.22)'
  }
];

// Light Mode Curated Palette Zones (Porcelain, Terracotta, Sage, Teal)
export const LIGHT_ZONES: ZoneColorConfig[] = [
  // 1. Hero: Soft Porcelain & Terracotta
  {
    id: 'home',
    bg: '#FAF9F6',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#C1502E',      // Terracotta
    accent2: '#0D9488',     // Deep Teal
    glow: 'rgba(193, 80, 46, 0.15)'
  },
  // 2. About: Warm Alabaster
  {
    id: 'about',
    bg: '#F8F6F0',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#B44426',      // Warm Terracotta
    accent2: '#D97706',     // Amber
    glow: 'rgba(180, 68, 38, 0.15)'
  },
  // 3. Skills: Sage Mist
  {
    id: 'skills',
    bg: '#F3F8F5',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#059669',      // Deep Sage Emerald
    accent2: '#D97706',     // Warm Amber
    glow: 'rgba(5, 150, 105, 0.15)'
  },
  // 4. Projects: Nordic Frost
  {
    id: 'projects',
    bg: '#F1F6FA',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#2563EB',      // Royal Blue
    accent2: '#0D9488',     // Deep Teal
    glow: 'rgba(37, 99, 235, 0.15)'
  },
  // 5. Certificates & Hackathons: Warm Linen
  {
    id: 'certifications',
    bg: '#F9F6F0',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#7C3AED',      // Royal Purple
    accent2: '#D97706',     // Warm Gold
    glow: 'rgba(124, 58, 237, 0.15)'
  },
  // 6. Contact: Clean Porcelain
  {
    id: 'contact',
    bg: '#FAF9F6',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textMuted: '#475569',
    accent: '#C1502E',      // Terracotta
    accent2: '#0D9488',     // Deep Teal
    glow: 'rgba(193, 80, 46, 0.15)'
  }
];

// Helper to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

// Cubic-bezier(0.4, 0, 0.2, 1) ease approximation
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Linear interpolate RGB
function lerpColor(c1: string, c2: string, t: number): string {
  const [r1, g1, b1] = hexToRgb(c1);
  const [r2, g2, b2] = hexToRgb(c2);
  const eased = easeInOutCubic(Math.min(1, Math.max(0, t)));
  const r = Math.round(r1 + (r2 - r1) * eased);
  const g = Math.round(g1 + (g2 - g1) * eased);
  const b = Math.round(b1 + (b2 - b1) * eased);
  return `rgb(${r}, ${g}, ${b})`;
}

interface ScrollColorContextType {
  activeZoneId: string;
  scrollProgress: number;
}

const ScrollColorContext = createContext<ScrollColorContextType>({
  activeZoneId: 'home',
  scrollProgress: 0
});

export const useScrollColor = () => useContext(ScrollColorContext);

export const ScrollColorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();
  const [activeZoneId, setActiveZoneId] = useState<string>('home');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const zones = theme === 'light' ? LIGHT_ZONES : DARK_ZONES;

    const updateColors = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
      setScrollProgress(progress);

      // Collect section positions
      const sectionElements = zones.map(z => ({
        zone: z,
        el: document.getElementById(z.id)
      }));

      // Find active zone index and progress between current and next zone
      let currentIdx = 0;
      let blendProgress = 0;

      for (let i = 0; i < sectionElements.length; i++) {
        const item = sectionElements[i];
        if (item.el) {
          const rect = item.el.getBoundingClientRect();
          const top = rect.top;
          const height = rect.height;

          // If this section is currently visible in the viewport
          if (top <= window.innerHeight * 0.45 && top + height > window.innerHeight * 0.45) {
            currentIdx = i;
            // Progress within current section towards next section
            const scrolledInside = window.innerHeight * 0.45 - top;
            blendProgress = Math.min(1, Math.max(0, scrolledInside / Math.max(1, height)));
            break;
          }
        }
      }

      const currentZone = zones[currentIdx];
      const nextZone = zones[Math.min(zones.length - 1, currentIdx + 1)];
      setActiveZoneId(currentZone.id);

      const root = document.documentElement;

      if (prefersReducedMotion) {
        // Snap instantly at boundaries
        root.style.setProperty('--bg', currentZone.bg);
        root.style.setProperty('--surface', currentZone.surface);
        root.style.setProperty('--text-primary', currentZone.textPrimary);
        root.style.setProperty('--text-muted', currentZone.textMuted);
        root.style.setProperty('--accent', currentZone.accent);
        root.style.setProperty('--accent-2', currentZone.accent2);
        root.style.setProperty('--glow', currentZone.glow);
      } else {
        // Smoothly interpolate RGB between zones
        const interpolatedBg = lerpColor(currentZone.bg, nextZone.bg, blendProgress);
        const interpolatedSurface = lerpColor(currentZone.surface, nextZone.surface, blendProgress);
        const interpolatedTextPrimary = lerpColor(currentZone.textPrimary, nextZone.textPrimary, blendProgress);
        const interpolatedTextMuted = lerpColor(currentZone.textMuted, nextZone.textMuted, blendProgress);
        const interpolatedAccent = lerpColor(currentZone.accent, nextZone.accent, blendProgress);
        const interpolatedAccent2 = lerpColor(currentZone.accent2, nextZone.accent2, blendProgress);

        root.style.setProperty('--bg', interpolatedBg);
        root.style.setProperty('--surface', interpolatedSurface);
        root.style.setProperty('--text-primary', interpolatedTextPrimary);
        root.style.setProperty('--text-muted', interpolatedTextMuted);
        root.style.setProperty('--accent', interpolatedAccent);
        root.style.setProperty('--accent-2', interpolatedAccent2);
        root.style.setProperty('--glow', currentZone.glow);
      }
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateColors);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    updateColors();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme]);

  return (
    <ScrollColorContext.Provider value={{ activeZoneId, scrollProgress }}>
      {children}
    </ScrollColorContext.Provider>
  );
};
