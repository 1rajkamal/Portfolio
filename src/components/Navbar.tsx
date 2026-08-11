import React, { useState, useEffect } from 'react';
import { Moon, Sun, Gamepad2, Menu, X, Terminal, Hand } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { worldStore } from '../context/World3DState';
import { jarvisStore, useJarvisStore } from '../context/JarvisVisionState';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isJarvisActive = useJarvisStore(s => s.isActive);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certificates', href: '#certifications' },
    { label: 'Hackathons', href: '#hackathons' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-[var(--surface)]/90 backdrop-blur-xl border-b border-[var(--border-card)] shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#home" className="flex items-center gap-2.5 group">
          <div
            className="w-10 h-10 rounded-2xl p-0.5 shadow-md group-hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
          >
            <div className="w-full h-full bg-[var(--surface)] rounded-[14px] flex items-center justify-center font-black text-sm text-[var(--accent)]">
              RK
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
              {PORTFOLIO_DATA.personal.name}
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-medium -mt-1">
              Full Stack & Data Analyst
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 glass-panel px-4 py-1.5 rounded-full border border-[var(--border-card)] shadow-md">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Jarvis AI Hologram Mode Button */}
          <button
            type="button"
            onClick={() => jarvisStore.toggleActive()}
            className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
              isJarvisActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105'
                : 'bg-[var(--surface)] border-[var(--border-card)] text-[var(--text-muted)] hover:text-cyan-400 hover:scale-105'
            }`}
            aria-label="Toggle Jarvis Hand Tracking AI Mode"
            title="Toggle Jarvis AI Hand Tracking Mode (Touchless Gestures)"
          >
            <Hand size={15} className={isJarvisActive ? 'animate-pulse text-cyan-400' : 'text-cyan-400'} />
            <span className="hidden sm:inline">Jarvis</span>
            <span className={`px-1.5 py-0.5 text-[9px] uppercase rounded-full font-extrabold ${
              isJarvisActive ? 'bg-cyan-400 text-slate-950 animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
            }`}>
              Vision
            </span>
          </button>

          {/* Terminal Console Button */}
          <button
            type="button"
            onClick={() => worldStore.setTerminalOpen(true)}
            className="p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-cyan-400 hover:scale-105 transition-all shadow-sm flex items-center gap-1.5"
            aria-label="Open developer terminal"
            title="Open Developer Terminal (Ctrl+K or ~)"
          >
            <Terminal size={17} />
            <span className="hidden lg:inline text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-slate-400">
              ⌘K
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-105 transition-all shadow-sm"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* 3D World Button */}
          <button
            type="button"
            onClick={() => worldStore.setIs3DActive(true)}
            className="btn-luxury py-2 px-4 text-xs"
          >
            <Gamepad2 size={15} />
            <span className="hidden sm:inline">3D World</span>
            <span className="px-1.5 py-0.5 text-[9px] uppercase bg-black/20 dark:bg-black/40 text-white rounded-full font-extrabold">
              Rover
            </span>
          </button>

          {/* Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel mx-4 mt-3 rounded-3xl p-5 border border-[var(--border-card)] shadow-2xl animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2.5 rounded-2xl text-sm font-bold text-[var(--text-primary)] hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
