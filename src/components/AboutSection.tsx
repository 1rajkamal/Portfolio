import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Download,
  CheckCircle2,
  Target,
  Compass
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { ScrollReveal } from './ScrollReveal';

export const AboutSection: React.FC = () => {
  const { personal, education } = PORTFOLIO_DATA;
  const [choice, setChoice] = useState<'try' | 'giveup' | null>(null);

  const strengths = [
    { title: 'Full Stack Engineering', desc: 'Crafting responsive user interfaces, robust backend APIs, and efficient database architectures.' },
    { title: 'Data Science & Applied ML', desc: 'Transforming raw complex datasets into clean visualizations, predictive models, and actionable insights.' },
    { title: 'AI & Chatbot Engineering', desc: 'Building intelligent text-processing chatbots and sentiment prediction engines with modern LLMs.' },
    { title: 'Persistence & Curiosity', desc: 'No roadmap, no guidance — just self-driven problem solving and real-world execution.' }
  ];

  return (
    <section id="about" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="left" distance={30}>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
              <Sparkles size={13} />
              Background & Journey
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
              About <span className="text-accent-gradient">{personal.name}</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
              A developer's journey driven by curiosity, creativity, and building solutions that matter.
            </p>
          </div>
        </ScrollReveal>

        {/* Origin Story Banner */}
        <ScrollReveal direction="up" distance={30} delay={100}>
          <div className="mt-10 max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl glass-card text-center border border-[var(--border-card)] shadow-xl">
            <div className="flex items-center justify-center gap-2 text-[var(--accent)] mb-2">
              <Compass size={20} />
            <span className="text-xs font-extrabold uppercase tracking-wider font-mono">The Origin Story</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-base sm:text-lg font-display font-black text-[var(--text-primary)] mt-3">
            <span className="px-3.5 py-1 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]">No roadmap.</span>
            <span className="px-3.5 py-1 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]">No guidance.</span>
            <span className="px-3.5 py-1 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]">Just curiosity.</span>
          </div>

          {/* Interactive Mindset Widget */}
          <div className="mt-6 pt-6 border-t border-[var(--border-card)]">
            <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              When things got difficult, what would you do?
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setChoice('try')}
                className={`px-5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  choice === 'try'
                    ? 'btn-luxury shadow-md scale-105'
                    : 'bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-card)] hover:border-[var(--accent)]'
                }`}
              >
                Try Again ✨
              </button>
              <button
                type="button"
                onClick={() => setChoice('giveup')}
                className={`px-5 py-2 rounded-2xl text-xs font-extrabold transition-all ${
                  choice === 'giveup'
                    ? 'bg-black/10 dark:bg-black/40 text-[var(--text-primary)] border border-[var(--border-card)]'
                    : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border-card)] hover:text-[var(--text-primary)]'
                }`}
              >
                Give Up
              </button>
            </div>
            {choice && (
              <p className="mt-4 text-xs sm:text-sm font-bold text-[var(--accent)] animate-fadeIn">
                {choice === 'try'
                  ? '“I chose to continue. Even when it was hard.” — Raj Kamal'
                  : '“I thought about quitting. But this story didn’t end there.” — Raj Kamal'}
              </p>
            )}
          </div>
        </div>
      </ScrollReveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Academic Specialization — Glides from Left */}
        <ScrollReveal direction="left" distance={40} delay={100}>
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[var(--border-card)] h-full">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] shadow-sm">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[var(--text-primary)]">
                    Academic Specialization
                  </h3>
                  <p className="text-xs font-bold text-[var(--accent)]">
                    Computer Science & Data Science
                  </p>
                </div>
              </div>

              {education.map((edu, idx) => (
                <div key={idx} className="mt-6 p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)]">
                  <h4 className="font-extrabold text-sm text-[var(--text-primary)]">
                    {edu.degree}
                  </h4>
                  <p className="text-xs text-[var(--accent)] font-bold mt-1">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    {edu.details}
                  </p>
                </div>
              ))}

              <p className="mt-6 text-sm text-[var(--text-muted)] leading-relaxed">
                {personal.bio}
              </p>
            </div>

            {/* Resume Download */}
            <div className="mt-8 pt-6 border-t border-[var(--border-card)] flex items-center justify-between">
              <span className="text-xs text-[var(--text-muted)] font-bold">Verified CV / Resume</span>
              <a
                href={personal.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                download="Raj_Kamal_Resume.pdf"
                className="btn-luxury text-xs py-2.5 px-5 font-bold inline-flex items-center gap-2"
              >
                <Download size={14} /> Download Resume PDF
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Core Strengths — Glides from Right */}
        <ScrollReveal direction="right" distance={40} delay={100}>
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[var(--border-card)] h-full">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent-2)] shadow-sm">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-extrabold text-[var(--text-primary)]">
                    Core Strengths & Values
                  </h3>
                  <p className="text-xs font-bold text-[var(--accent-2)]">
                    What Drives My Code
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3.5">
                {strengths.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] flex items-start gap-3.5"
                  >
                    <CheckCircle2 size={18} className="text-[var(--accent-2)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">
                        {s.title}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);
};
