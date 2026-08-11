import React, { useState } from 'react';
import {
  Mail,
  Linkedin,
  Github,
  Globe,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const ContactSection: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 600);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            Transmission Hub
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Get in <span className="text-accent-gradient">Touch</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            Have an exciting software project, role, or opportunity? My inbox is always open!
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {/* Direct Channels */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-[var(--border-card)] shadow-sm">
            <div>
              <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
                Contact & Profiles
              </h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Reach out directly via email or connect with me on professional platforms.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all hover:scale-[1.01] group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)]">Email Address</p>
                    <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">
                      {personal.email}
                    </p>
                  </div>
                </a>

                <a
                  href={personal.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] hover:border-[var(--accent-2)] transition-all hover:scale-[1.01] group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent-2)] group-hover:scale-110 transition-transform">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)]">Personal Domain</p>
                    <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">
                      rajkamall.me
                    </p>
                  </div>
                </a>

                <a
                  href={personal.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all hover:scale-[1.01] group shadow-sm"
                >
                  <div className="p-3 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] group-hover:scale-110 transition-transform">
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--text-muted)]">LinkedIn Network</p>
                    <p className="text-sm font-extrabold text-[var(--text-primary)] mt-0.5">
                      linkedin.com/in/raj-kamal
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social icons row */}
            <div className="mt-8 pt-6 border-t border-[var(--border-card)] flex items-center gap-3">
              <span className="text-xs font-bold text-[var(--text-muted)] mr-2">Social Channels:</span>
              <a
                href={personal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all border border-[var(--border-card)]"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={personal.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:scale-110 transition-all border border-[var(--border-card)]"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-[var(--border-card)] shadow-sm">
            <h3 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
              Send a Direct Message
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Fill out the form below and I'll get back to you promptly.
            </p>

            {submitted ? (
              <div className="mt-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-fadeIn">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
                <h4 className="text-base font-extrabold text-[var(--text-primary)]">
                  Message Sent Successfully!
                </h4>
                <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                  Thank you for reaching out, {formData.name}. I'll reply to {formData.email} soon.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: '', message: '' });
                  }}
                  className="btn-luxury text-xs py-2 px-5 mt-4"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Raj Kamal"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Project Inquiry / Job Opportunity"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-primary)] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Hi Raj, let's discuss..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/70 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury w-full py-3.5 text-sm font-extrabold justify-center disabled:opacity-50"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
