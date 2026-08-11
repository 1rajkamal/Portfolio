import React, { useState } from 'react';
import {
  ExternalLink,
  Github,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import { PORTFOLIO_DATA, Project } from '../data/portfolioData';

export const ProjectsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai-ml' | 'data-science' | 'web-dev'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PORTFOLIO_DATA.projects.filter(p => {
    if (activeTab === 'all') return true;
    return p.category === activeTab;
  });

  return (
    <section id="projects" className="py-16 sm:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[var(--surface)] border border-[var(--border-card)] text-[var(--accent)] text-xs font-extrabold uppercase tracking-wider">
            <Sparkles size={13} />
            Real-World Products
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black font-display text-[var(--text-primary)]">
            Featured <span className="text-accent-gradient">Projects & Live Apps</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)]">
            Chatbots, predictive machine learning models, mood detection tools, finance trackers, and responsive web platforms built from scratch.
          </p>

          {/* Filter Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl glass-panel border border-[var(--border-card)] shadow-sm">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'ai-ml', label: 'AI & ML' },
              { id: 'data-science', label: 'Data Science' },
              { id: 'web-dev', label: 'Web & Games' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                  activeTab === tab.id
                    ? 'btn-luxury shadow-md scale-105'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => (
            <div
              key={project.id}
              className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group border border-[var(--border-card)]"
            >
              {/* Image Preview */}
              <div>
                <div className="relative h-52 sm:h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/alpha.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Category Pill */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black bg-slate-900/90 backdrop-blur-md border border-white/20 text-white shadow-md">
                      {project.category === 'ai-ml'
                        ? 'AI & ML'
                        : project.category === 'data-science'
                        ? 'Data Science'
                        : 'Web & Games'}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs font-bold text-[var(--accent)] mt-1">
                    {project.subtitle}
                  </p>
                  <p className="mt-3 text-xs sm:text-sm text-[var(--text-muted)] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--border-card)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-2.5">
                <div className="flex items-center gap-2">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury flex-1 py-2.5 px-3 text-xs justify-center"
                    >
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3.5 rounded-full font-bold text-xs text-[var(--text-primary)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border-card)] hover:border-[var(--accent)] transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm"
                      title="GitHub Repository"
                    >
                      <Github size={14} /> Repo
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedProject(project)}
                  className="w-full text-center text-xs font-bold text-[var(--text-muted)] hover:text-[var(--accent)] py-1 transition-colors"
                >
                  View Details & Architecture ↗
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="relative max-w-2xl w-full rounded-3xl bg-[var(--surface)] p-6 sm:p-8 text-[var(--text-primary)] border border-[var(--border-card)] shadow-2xl animate-scaleUp">
            <button
              type="button"
              onClick={() => setSelectedProject(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[var(--surface)] border border-[var(--accent)] text-[var(--accent)] uppercase tracking-wider">
              {selectedProject.subtitle}
            </span>

            <h3 className="text-2xl sm:text-3xl font-display font-extrabold text-[var(--text-primary)] mt-2">
              {selectedProject.title}
            </h3>

            <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed">
              {selectedProject.description}
            </p>

            {/* Key Technical Highlights */}
            <div className="mt-5 space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-[var(--text-muted)]">
                Key Technical Highlights:
              </h4>
              {selectedProject.points.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-primary)]">
                  <CheckCircle2 size={16} className="text-[var(--accent)] shrink-0 mt-0.5" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {selectedProject.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-xl text-xs font-bold bg-[var(--surface)] border border-[var(--border-card)] text-[var(--text-primary)]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-5 border-t border-[var(--border-card)] flex flex-wrap items-center justify-end gap-3">
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold bg-[var(--surface)] border border-[var(--border-card)] hover:border-[var(--accent)] text-[var(--text-primary)] inline-flex items-center gap-1.5 transition-all"
                >
                  <Github size={15} /> GitHub Repository
                </a>
              )}
              {selectedProject.liveUrl && (
                <a
                  href={selectedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-luxury text-xs py-2.5 px-6 font-bold inline-flex items-center gap-1.5"
                >
                  <ExternalLink size={15} /> Open Live Platform ↗
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
