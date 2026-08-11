import React from 'react';
import { Award, FileText, CheckCircle } from 'lucide-react';
import { PORTFOLIO_DATA, Certification } from '../data/portfolioData';

export const CertificationsSection: React.FC = () => {
  const { certifications } = PORTFOLIO_DATA;

  return (
    <section id="certifications" className="py-16 sm:py-24 relative scroll-mt-10">
      <span id="certificates" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Award size={13} />
            Verified Accreditations
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Industry <span className="text-accent-gradient">Certifications & Honors</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            Globally recognized accreditations in Python, Java, Database Management, and Data Analytics from Cisco, Oracle, Red Hat, Certiport, Infosys, and Udemy.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {certifications.map((cert: Certification, idx: number) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 border border-[var(--border-card)] flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: cert.badgeColor || 'var(--accent)' }}
                  >
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]">
                    Verified
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs font-bold text-[var(--text-muted)] mt-1">
                  {cert.issuer}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-card)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
                  <CheckCircle size={14} />
                  <span>Accredited</span>
                </div>

                {cert.pdfUrl ? (
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
                  >
                    <FileText size={14} /> PDF ↗
                  </a>
                ) : (
                  <span className="text-[10px] text-[var(--text-muted)] font-bold">Certified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
