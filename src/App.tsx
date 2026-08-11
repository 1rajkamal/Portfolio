import React, { useEffect } from 'react';
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
import { WorldCanvas } from './components/3d/WorldCanvas';
import { TerminalModal } from './components/TerminalModal';
import { MatrixRain } from './components/MatrixRain';
import { JarvisHoloHUD } from './components/JarvisHoloHUD';
import { ErrorBoundary } from './components/ErrorBoundary';
import { worldStore, useWorldStore } from './context/World3DState';

export const AppContent: React.FC = () => {
  const is3DActive = useWorldStore(s => s.is3DActive);
  const terminalOpen = useWorldStore(s => s.terminalOpen);
  const matrixActive = useWorldStore(s => s.matrixActive);

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

  // When switching from 3D back to 2D portfolio, auto-scroll to the requested hash target
  useEffect(() => {
    if (!is3DActive && window.location.hash && window.location.hash !== '#3d') {
      const targetId = window.location.hash.replace('#', '');
      const scrollAttempt = (count = 0) => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <WorldCanvas />
      ) : (
        <div className="min-h-screen flex flex-col transition-colors duration-300 relative overflow-x-hidden">
          <ScrollColorBackdrop />
          <Navbar />
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

      {/* Global Developer Terminal Console */}
      <TerminalModal
        isOpen={terminalOpen}
        onClose={() => worldStore.setTerminalOpen(false)}
      />

      {/* Fullscreen Neural Matrix Rain Mode */}
      {matrixActive && <MatrixRain />}

      {/* Jarvis AI Holographic Vision Hand Tracking Engine */}
      <JarvisHoloHUD />
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
