import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, ExperienceItem } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  const { experience } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            Career & Research
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Practical <span className="text-accent-gradient">Experience & Projects</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            Proven track record of engineering predictive systems, generative AI assistants, and high-performance data analytics platforms.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          {experience.map((item: ExperienceItem, idx: number) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.01] transition-all border border-[var(--border-card)]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] shadow-sm">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
                      {item.role}
                    </h3>
                    <p className="text-xs font-bold text-[var(--accent)]">
                      {item.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-bold text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-[var(--accent)]" />
                    {item.period}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-[var(--accent)]" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Responsibilities & Achievements */}
              <div className="mt-6 space-y-3">
                {item.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-primary)]">
                    <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="mt-6 pt-5 border-t border-[var(--border-card)] flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[var(--text-muted)] mr-2">Key Tech:</span>
                {item.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-card)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
