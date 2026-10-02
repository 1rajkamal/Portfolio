import React from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Gamepad2,
  ArrowRight,
  Download,
  Sparkles,
  Terminal
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { worldStore } from '../context/World3DState';
import { ScrollReveal } from './ScrollReveal';
import { CountUp } from './CountUp';

export const HeroSection: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;

  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          {/* Left Hero Content — Glides from Left */}
          <ScrollReveal direction="left" distance={45} duration={950}>
            {/* Status Pulse Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold tracking-wide shadow-sm backdrop-blur-md mb-3.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Full-Time Roles & High-Impact Projects</span>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles size={13} className="text-[var(--accent)]" />
                <span>Full Stack Developer & Data Scientist</span>
              </div>
            </div>

            <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.08]">
              Hi all, I'm <span className="text-accent-gradient">{personal.name}</span>{' '}
              <span className="inline-block origin-[70%_70%] animate-wave">👋</span>
            </h1>

            <p className="mt-3.5 font-display font-bold text-lg sm:text-2xl text-[var(--text-primary)] tracking-tight">
              {personal.headline}
            </p>

            <p className="mt-3.5 text-sm sm:text-base text-[var(--text-muted)] max-w-xl leading-relaxed">
              {personal.bio}
            </p>

            {/* Philosophy Pill */}
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-xs sm:text-sm font-mono text-[var(--text-primary)] shadow-sm">
              <Terminal size={15} className="text-[var(--accent)]" />
              <span>"{personal.tagline}"</span>
            </div>

            {/* Social Channels */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={personal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-3 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all shadow-sm"
              >
                <Github size={18} />
              </a>
              <a
                href={personal.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-3 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all shadow-sm"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${personal.email}`}
                aria-label="Email Raj Kamal"
                className="p-3 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all shadow-sm"
              >
                <Mail size={18} />
              </a>
            </div>

            {/* Streamlined CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a href="#projects" className="btn-luxury py-3 px-6 text-sm">
                Explore Projects <ArrowRight size={16} />
              </a>
              <a
                href={personal.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                download="Raj_Kamal_Resume.pdf"
                className="px-5 py-3 rounded-full font-extrabold text-sm text-[var(--text-primary)] glass-card hover:bg-[var(--surface-hover)] transition-all hover:scale-105 border border-[var(--border-card)] inline-flex items-center gap-2 shadow-sm"
              >
                <Download size={16} className="text-[var(--accent)]" />
                <span>Resume</span>
              </a>
              <button
                type="button"
                onClick={() => worldStore.setIs3DActive(true)}
                className="px-4 py-3 rounded-full font-bold text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] glass-panel hover:bg-[var(--surface-hover)] transition-all hover:scale-105 border border-[var(--border-card)] inline-flex items-center gap-2 shadow-sm"
              >
                <Gamepad2 size={16} className="text-[var(--accent)]" />
                <span>3D Rover</span>
              </button>
            </div>
          </ScrollReveal>

          {/* Right Hero Section — Glides from Right */}
          <ScrollReveal direction="right" distance={45} duration={1000} delay={150} className="w-full">
            <div className="relative flex items-end justify-center lg:justify-end w-full select-none">
              <img
                src="/rajkamal_hero.png"
                alt={personal.name}
                className="hero-silhouette-img relative z-10 w-auto h-auto max-h-[480px] sm:max-h-[550px] lg:max-h-[620px] object-contain object-bottom pointer-events-auto"
              />
            </div>
          </ScrollReveal>
        </div>

        {/* Stats Grid — Staggered Entrance */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {personal.stats.map((stat, idx) => (
            <ScrollReveal
              key={stat.label}
              direction={idx % 2 === 0 ? 'left' : 'right'}
              distance={25}
              duration={800}
              delay={idx * 100}
            >
              <div className="glass-card rounded-2xl p-5 text-center border border-[var(--border-card)] group h-full">
                <CountUp
                  value={stat.value}
                  className="font-display text-2xl sm:text-4xl font-black text-accent-gradient"
                />
                <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--text-muted)]">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
