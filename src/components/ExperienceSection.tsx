import React from 'react';
import { Briefcase, Calendar, MapPin, CheckCircle2, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA, ExperienceItem } from '../data/portfolioData';

export const ExperienceSection: React.FC = () => {
  const { experience } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            Career & Research
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">
            Practical <span className="text-gradient">Experience & Projects</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Proven track record of engineering predictive systems, generative AI assistants, and high-performance data analytics platforms.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="mt-12 max-w-4xl mx-auto space-y-8">
          {experience.map((item: ExperienceItem, idx: number) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:scale-[1.01] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-cyan-600 text-white shadow-md">
                    <Briefcase size={22} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                      {item.role}
                    </h3>
                    <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      {item.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-cyan-500" />
                    {item.period}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} className="text-cyan-500" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Responsibilities & Achievements */}
              <div className="mt-6 space-y-3">
                {item.points.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <CheckCircle2 size={16} className="text-cyan-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              {/* Technologies */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 mr-2">Key Tech:</span>
                {item.technologies.map(tech => (
                  <span
                    key={tech}
                    className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
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
