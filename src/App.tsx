import React, { useEffect, useState, Suspense, lazy } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ScrollColorProvider } from './context/ScrollColorContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { CertificationsSection } from './components/CertificationsSection';
import { HackathonsSection } from './components/HackathonsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ScrollColorBackdrop } from './components/ScrollColorBackdrop';
import { TerminalModal } from './components/TerminalModal';
import { MatrixRain } from './components/MatrixRain';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { AmbientSpotlight } from './components/AmbientSpotlight';
import { worldStore, useWorldStore } from './context/World3DState';
import { RIntroRibbon } from './components/RIntroRibbon';
import { WhoIsWatching, NETFLIX_PROFILES, NetflixProfile } from './components/WhoIsWatching';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Code-split heavy 3D engine and MediaPipe AI models for instantaneous 2D portfolio load
const WorldCanvas = lazy(() => import('./components/3d/WorldCanvas').then(m => ({ default: m.WorldCanvas })));
const JarvisHoloHUD = lazy(() => import('./components/JarvisHoloHUD').then(m => ({ default: m.JarvisHoloHUD })));

export const AppContent: React.FC = () => {
  const is3DActive = useWorldStore(s => s.is3DActive);
  const terminalOpen = useWorldStore(s => s.terminalOpen);
  const matrixActive = useWorldStore(s => s.matrixActive);

  // Check if user navigated directly to a specific section anchor (e.g. #projects, #contact)
  const isDirectSection = typeof window !== 'undefined' && Boolean(window.location.hash && window.location.hash !== '#3d');
  const [introActive, setIntroActive] = useState<boolean>(() => !isDirectSection);
  const [profileActive, setProfileActive] = useState<boolean>(() => !isDirectSection);
  const [hasEnteredPortfolio, setHasEnteredPortfolio] = useState<boolean>(() => isDirectSection);

  const [currentProfile, setCurrentProfile] = useState<NetflixProfile>(() => {
    try {
      const saved = localStorage.getItem('rk_selected_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = NETFLIX_PROFILES.find(p => p.id === parsed.id);
        if (match) return match;
      }
    } catch {}
    return NETFLIX_PROFILES[0];
  });

  useEffect(() => {
    // Strict hash/pathname check for 3D world on initial load
    if (window.location.hash === '#3d' || window.location.pathname === '/3d') {
      worldStore.setIs3DActive(true);
    }

    // Global keyboard shortcut listener
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on `~`, `Ctrl+K`, `Cmd+K`, or `Alt+T`
      if (
        e.key === '`' ||
        e.key === '~' ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') ||
        (e.altKey && e.key.toLowerCase() === 't')
      ) {
        // Prevent opening if typing in input or textarea (unless it was Ctrl+K)
        const target = e.target as HTMLElement;
        const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (e.key === '`' && isInputField) return;

        e.preventDefault();
        worldStore.setTerminalOpen(!worldStore.getState().terminalOpen);
      }

      // Exit Matrix Rain on Escape
      if (e.key === 'Escape' && worldStore.getState().matrixActive) {
        worldStore.setMatrixActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initialize Lenis for silky-smooth momentum scrolling on desktop and mobile phones
  useEffect(() => {
    if (is3DActive) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      touchInertiaExponent: 1.6,
      touchMultiplier: 1.15,
      autoRaf: true,
      anchors: { offset: -75 }
    });

    (window as any).__lenis = lenis;

    // Prevent background scrolling while modal intro / profile selector is active
    if (introActive || profileActive || terminalOpen || !hasEnteredPortfolio) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => {
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, [is3DActive, introActive, profileActive, terminalOpen, hasEnteredPortfolio]);

  // When switching from 3D back to 2D portfolio, auto-scroll to the requested hash target
  useEffect(() => {
    if (!is3DActive && window.location.hash && window.location.hash !== '#3d') {
      const targetId = window.location.hash.replace('#', '');
      const scrollAttempt = (count = 0) => {
        const el = document.getElementById(targetId);
        if (el) {
          const lenis = (window as any).__lenis;
          if (lenis) {
            lenis.scrollTo(el, { offset: -75, duration: 1.1 });
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else if (count < 20) {
          setTimeout(() => scrollAttempt(count + 1), 40);
        }
      };
      setTimeout(() => scrollAttempt(), 60);
    }
  }, [is3DActive]);

  return (
    <>
      {is3DActive ? (
        <Suspense fallback={<div className="w3d-root flex items-center justify-center bg-black text-cyan-400 font-mono text-xs">INITIALIZING 3D WORLD...</div>}>
          <WorldCanvas />
        </Suspense>
      ) : (
        <div
          className={`min-h-screen flex flex-col transition-opacity duration-700 relative overflow-x-clip ${
            !hasEnteredPortfolio ? 'opacity-0 pointer-events-none invisible h-0 overflow-hidden' : 'opacity-100 visible'
          }`}
        >
          <ScrollProgressBar />
          <AmbientSpotlight />
          <ScrollColorBackdrop />
          <Navbar
            onOpenProfiles={() => setProfileActive(true)}
            onReplayIntro={() => setIntroActive(true)}
            activeProfileAvatar={currentProfile.avatar}
            activeProfileName={currentProfile.name}
          />
          <main className="flex-1">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ProjectsSection />
            <CertificationsSection />
            <HackathonsSection />
            <ExperienceSection />
            <ContactSection />
          </main>
          <Footer />
        </div>
      )}

      {/* Cinematic Red "R" Ribbon Intro Animation (Layered on top at z-[99999]) */}
      {introActive && (
        <RIntroRibbon
          onComplete={() => {
            setIntroActive(false);
            if (!hasEnteredPortfolio) {
              setProfileActive(true);
            }
          }}
        />
      )}

      {/* Netflix-Style "Who's Watching?" Profile Selector (Positioned directly under Intro at z-[99990]) */}
      <WhoIsWatching
        isOpen={profileActive}
        isIntroActive={introActive}
        onSelectProfile={(profile) => {
          setCurrentProfile(profile);
          try {
            localStorage.setItem('rk_selected_profile', JSON.stringify(profile));
          } catch {}
          setProfileActive(false);
          setHasEnteredPortfolio(true);
        }}
        onClose={() => {
          setProfileActive(false);
          setHasEnteredPortfolio(true);
        }}
      />

      {/* Global Developer Terminal Console */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => worldStore.setTerminalOpen(false)}
      />

      {/* Fullscreen Neural Matrix Rain Mode */}
      {matrixActive && <MatrixRain />}

      {/* Jarvis AI Holographic Vision Hand Tracking Engine */}
      <Suspense fallback={null}>
        <JarvisHoloHUD />
      </Suspense>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ScrollColorProvider>
          <AppContent />
        </ScrollColorProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
