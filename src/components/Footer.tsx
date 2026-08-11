import React from 'react';
import { Github, Linkedin, Mail, Gamepad2 } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { worldStore } from '../context/World3DState';

export const Footer: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;

  return (
    <footer className="border-t border-[var(--border-card)] bg-[var(--surface)]/90 backdrop-blur-xl py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="text-center md:text-left">
            <a href="#home" className="font-display font-extrabold text-xl tracking-tight text-[var(--text-primary)]">
              <span className="text-[var(--accent)]">&lt;</span>
              <span>{personal.name}</span>
              <span className="text-[var(--accent-2)]">/&gt;</span>
            </a>
            <p className="mt-1 text-xs text-[var(--text-muted)] font-medium">
              {personal.title} · Building solutions that matter
            </p>
          </div>

          {/* Social Links & 3D Rover Trigger */}
          <div className="flex items-center gap-3">
            <a
              href={personal.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors shadow-sm"
              aria-label="GitHub"
            >
              <Github size={16} />
            </a>
            <a
              href={personal.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={`mailto:${personal.email}`}
              className="p-2.5 rounded-2xl glass-card text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors shadow-sm"
              aria-label="Email"
            >
              <Mail size={16} />
            </a>
            <button
              type="button"
              onClick={() => worldStore.setIs3DActive(true)}
              className="btn-luxury text-xs py-2 px-4 font-extrabold flex items-center gap-1.5"
            >
              <Gamepad2 size={15} /> 3D Rover
            </button>
          </div>
        </div>

        {/* Bottom Tagline with Clickable GitHub Link */}
        <div className="mt-8 pt-6 border-t border-[var(--border-card)] text-center text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          <span>Made with ❤️ by </span>
          <a
            href="https://github.com/1rajkamal"
            target="_blank"
            rel="noopener noreferrer"
            className="font-extrabold text-[var(--accent)] hover:underline transition-colors inline-flex items-center gap-1"
          >
            RajKamal ↗
          </a>
        </div>
      </div>
    </footer>
  );
};
