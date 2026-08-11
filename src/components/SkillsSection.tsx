import React from 'react';
import {
  Code2,
  BarChart3,
  BrainCircuit,
  Layers,
  Wrench,
  Sparkles
} from 'lucide-react';
import { PORTFOLIO_DATA, SkillCategory } from '../data/portfolioData';

const iconMap: { [key: string]: React.ElementType } = {
  Code2,
  BarChart3,
  BrainCircuit,
  Layers,
  Wrench
};

export const SkillsSection: React.FC = () => {
  const { skills } = PORTFOLIO_DATA;

  return (
    <section id="skills" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            Technical Arsenal
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Skills & <span className="text-accent-gradient">Tech Stack</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            A comprehensive overview of programming languages, frameworks, data science libraries, and tools I use to build robust software.
          </p>
        </div>

        {/* Skill Category Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category: SkillCategory) => {
            const Icon = iconMap[category.iconName] || Code2;
            return (
              <div
                key={category.name}
                className="glass-card rounded-3xl p-6 sm:p-7 border border-[var(--border-card)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5 mb-5">
                    <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display font-extrabold text-lg text-[var(--text-primary)]">
                      {category.name}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map(skill => (
                      <div
                        key={skill.name}
                        className="px-3.5 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-card)] hover:border-[var(--accent)] text-xs font-bold text-[var(--text-primary)] transition-all hover:scale-105 flex items-center gap-2 shadow-sm"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: skill.color || 'var(--accent)' }}
                        />
                        <span>{skill.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
