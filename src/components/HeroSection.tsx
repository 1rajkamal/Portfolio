import React from 'react';
import {
  Github,
  Linkedin,
  Mail,
  Gamepad2,
  ArrowRight,
  Sparkles,
  Database,
  BrainCircuit,
  FileCode2,
  Code2,
  Terminal
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { worldStore } from '../context/World3DState';

export const HeroSection: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;

  return (
    <section id="home" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left Hero Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider shadow-sm">
              <Sparkles size={13} className="text-[var(--accent)]" />
              <span>Full Stack Developer & Data Analyst</span>
            </div>

            <h1 className="mt-4 font-display text-4xl sm:text-6xl lg:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.1]">
              Hi all, I'm <span className="text-accent-gradient">{personal.name}</span>{' '}
              <span className="inline-block origin-[70%_70%] animate-wave">👋</span>
            </h1>

            <p className="mt-3.5 font-display font-bold text-lg sm:text-2xl text-[var(--text-primary)]">
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

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <a href="#projects" className="btn-luxury py-3 px-6 text-sm">
                Explore Projects <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={() => worldStore.setIs3DActive(true)}
                className="px-5 py-3 rounded-full font-extrabold text-sm text-[var(--text-primary)] glass-panel hover:bg-[var(--surface-hover)] transition-all hover:scale-105 border border-[var(--border-card)] inline-flex items-center gap-2 shadow-sm"
              >
                <Gamepad2 size={18} className="text-[var(--accent)]" />
                <span>Drive 3D Rover</span>
              </button>
            </div>
          </div>

          {/* Right Profile Hub */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Subtle Ambient Glow */}
              <div
                className="absolute -inset-2 rounded-3xl opacity-30 blur-2xl animate-pulse transition-colors duration-700"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              />

              {/* Frosted Glass Profile Card */}
              <div className="relative glass-card rounded-3xl p-6 sm:p-7 border border-[var(--border-card)] overflow-hidden shadow-2xl">
                <div className="flex items-center gap-4">
                  <div
                    className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 shadow-md shrink-0 transition-colors"
                    style={{ borderColor: 'var(--accent)' }}
                  >
                    <img
                      src={personal.profileImage}
                      alt={personal.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-2xl text-[var(--text-primary)]">
                      {personal.name}
                    </h3>
                    <p className="text-xs font-bold text-[var(--accent)]">
                      {personal.title}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 font-medium">
                      Problem Solver · Full Stack · ML
                    </p>
                  </div>
                </div>

                {/* Tech Matrix Badges */}
                <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs font-bold">
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-primary)]">
                    <FileCode2 size={16} className="text-[var(--accent)] shrink-0" />
                    <span>Python & Full Stack</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-primary)]">
                    <BrainCircuit size={16} className="text-[var(--accent-2)] shrink-0" />
                    <span>Chatbots & NLP</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-primary)]">
                    <Database size={16} className="text-[var(--accent)] shrink-0" />
                    <span>Data Science & SQL</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] flex items-center gap-2 text-[var(--text-primary)]">
                    <Code2 size={16} className="text-[var(--accent-2)] shrink-0" />
                    <span>Java & C++ Logic</span>
                  </div>
                </div>

                {/* Code Terminal Snippet */}
                <div className="mt-5 p-4 rounded-2xl bg-[#09090D] text-slate-200 text-xs font-mono border border-white/10 shadow-inner">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-slate-400 ml-2">mindset.config.ts</span>
                  </div>
                  <p className="text-[#C084FC]">const passion = <span className="text-[var(--accent)]">"Solving real-world problems"</span>;</p>
                  <p className="text-[#FB7185]">while (learning) buildSoftware();</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5">
          {personal.stats.map(stat => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-5 text-center border border-[var(--border-card)] group"
            >
              <span className="font-display text-2xl sm:text-4xl font-black text-accent-gradient">
                {stat.value}
              </span>
              <p className="mt-1 text-xs sm:text-sm font-bold text-[var(--text-muted)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
