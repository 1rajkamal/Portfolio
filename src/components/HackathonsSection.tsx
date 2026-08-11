import React from 'react';
import { Trophy } from 'lucide-react';
import { PORTFOLIO_DATA, Hackathon } from '../data/portfolioData';

export const HackathonsSection: React.FC = () => {
  const { hackathons } = PORTFOLIO_DATA;

  return (
    <section id="hackathons" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Trophy size={13} />
            Innovation Tournaments
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Hackathons & <span className="text-accent-gradient">Innovation Challenges</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            Participated in competitive innovation and problem-solving events
          </p>
        </div>

        {/* 3 Hackathon Cards Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {hackathons.map((hack: Hackathon, idx: number) => (
            <div
              key={idx}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-[var(--border-card)] shadow-sm"
            >
              <div>
                {/* Certificate Frame */}
                <div className="relative h-52 sm:h-56 bg-black/80 p-3 overflow-hidden flex items-center justify-center">
                  <img
                    src={hack.image}
                    alt={hack.title}
                    className="w-full h-full object-contain rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-md"
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/alpha.png';
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {hack.title}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {hack.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[var(--surface)] text-[var(--accent)] border border-[var(--border-card)] shadow-sm">
                  {hack.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
