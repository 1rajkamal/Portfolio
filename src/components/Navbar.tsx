import React, { useState, useEffect, useRef } from 'react';
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
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              Full Stack & Data Scientist
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

          {/* Three Lines Menu (right after Contact) */}
          <div className="relative ml-1 pl-1 border-l border-[var(--border-card)]" ref={toolsMenuRef}>
            <button
              type="button"
              onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              className={`p-2 rounded-full text-xs font-bold transition-all flex items-center justify-center relative ${
                toolsMenuOpen || isJarvisActive
                  ? 'text-cyan-400 bg-cyan-500/15 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/5'
              }`}
              aria-label="Open Jarvis Vision and Developer Terminal tools"
              title="More Features (Jarvis Vision & Developer Terminal)"
            >
              <Menu size={16} />
              {isJarvisActive && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              )}
            </button>

            {/* Dropdown Menu */}
            {toolsMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 rounded-2xl glass-panel p-2.5 border border-[var(--border-card)] shadow-2xl z-50 animate-fadeIn backdrop-blur-2xl">
                <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] flex items-center justify-between border-b border-[var(--border-card)] pb-2 mb-1.5">
                  <span>Interactive Tools</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-bold">
                    {isJarvisActive ? '1 Active' : 'Ready'}
                  </span>
                </div>

                <div className="space-y-1">
                  {/* Jarvis AI Hand Tracking Option */}
                  <button
                    type="button"
                    onClick={() => {
                      jarvisStore.toggleActive();
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                      isJarvisActive
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                        : 'hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${isJarvisActive ? 'bg-cyan-500/30 text-cyan-300' : 'bg-cyan-500/10 text-cyan-400'}`}>
                        <Hand size={16} className={isJarvisActive ? 'animate-pulse' : ''} />
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Jarvis Vision</span>
                          <span className={`px-1.5 py-0.2 text-[8px] uppercase rounded-full font-extrabold ${
                            isJarvisActive ? 'bg-cyan-400 text-slate-950 animate-pulse' : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            AI
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">
                          {isJarvisActive ? 'Touchless active' : 'Hand tracking mode'}
                        </div>
                      </div>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${isJarvisActive ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-slate-500'}`} />
                  </button>

                  {/* Developer Terminal Option */}
                  <button
                    type="button"
                    onClick={() => {
                      worldStore.setTerminalOpen(true);
                      setToolsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/5 text-[var(--text-primary)] transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                        <Terminal size={16} />
                      </div>
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>Terminal</span>
                          <span className="px-1.5 py-0.2 text-[8px] uppercase rounded-full font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            CLI
                          </span>
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] font-normal">
                          Cyber shell console
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-slate-400 border border-[var(--border-card)]">
                      ⌘K
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-105 transition-all shadow-sm"
            aria-label="Toggle theme"
            title="Toggle Light / Dark mode"
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

            {/* Mobile Tools Section */}
            <div className="mt-2 pt-3 border-t border-[var(--border-card)] flex flex-col gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--text-muted)] px-2">
                Quick Tools
              </span>

              {/* Jarvis Vision Mobile */}
              <button
                type="button"
                onClick={() => {
                  jarvisStore.toggleActive();
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isJarvisActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/40'
                    : 'bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Hand size={16} className="text-cyan-400" />
                  <span>Jarvis Vision AI</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold uppercase">
                  {isJarvisActive ? 'Active' : 'Start'}
                </span>
              </button>

              {/* Terminal Mobile */}
              <button
                type="button"
                onClick={() => {
                  worldStore.setTerminalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-xs font-bold text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-emerald-400" />
                  <span>Developer Terminal</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

