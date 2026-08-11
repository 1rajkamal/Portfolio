import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  X,
  Maximize2,
  Minimize2,
  Sparkles,
  ArrowRight,
  Download,
  Gamepad2,
  Shield,
  HelpCircle,
  FolderGit2,
  Award,
  Layers,
  Send,
  Hand
} from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { worldStore } from '../context/World3DState';
import { jarvisStore } from '../context/JarvisVisionState';
import { useTheme } from '../context/ThemeContext';
import { SOUNDS } from '../utils/soundEffects';

interface CommandOutput {
  id: string;
  command: string;
  output: React.ReactNode;
  timestamp: string;
  type?: 'success' | 'error' | 'info';
}

const WELCOME_BANNER = `
  ██████╗  █████╗      ██╗██╗  ██╗ █████╗ ███╗   ███╗ █████╗ ██╗     
  ██╔══██╗██╔══██╗     ██║██║ ██╔╝██╔══██╗████╗ ████║██╔══██╗██║     
  ██████╔╝███████║     ██║█████╔╝ ███████║██╔████╔██║███████║██║     
  ██╔══██╗██╔══██║██   ██║██╔═██╗ ██╔══██║██║╚██╔╝██║██╔══██║██║     
  ██║  ██║██║  ██║╚█████╔╝██║  ██╗██║  ██║██║ ╚═╝ ██║██║  ██║███████╗
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝
========================================================================
  🚀 Raj Kamal OS [Version 3.4.0-Cyberpunk]
  💻 Full Stack Developer & Data Analyst
  Type "help" to see available commands or click quick action buttons.
========================================================================
`;

const QUICK_COMMANDS = [
  { label: 'help', icon: HelpCircle, color: '#38bdf8' },
  { label: 'jarvis', icon: Hand, color: '#06b6d4' },
  { label: 'about', icon: Sparkles, color: '#818cf8' },
  { label: 'skills', icon: Layers, color: '#10b981' },
  { label: 'projects', icon: FolderGit2, color: '#ec4899' },
  { label: 'certs', icon: Award, color: '#f59e0b' },
  { label: 'resume', icon: Download, color: '#38bdf8' },
  { label: '3d', icon: Gamepad2, color: '#a855f7' },
  { label: 'matrix', icon: Shield, color: '#22c55e' }
];

export const TerminalModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [outputs, setOutputs] = useState<CommandOutput[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      if (outputs.length === 0) {
        setOutputs([
          {
            id: 'init-0',
            command: 'system.boot',
            output: <pre className="text-cyan-400 font-mono text-[11px] sm:text-xs leading-tight whitespace-pre-wrap">{WELCOME_BANNER}</pre>,
            timestamp: new Date().toLocaleTimeString(),
            type: 'info'
          }
        ]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    SOUNDS.terminalKey();
    const cmdId = Date.now().toString();
    const timestamp = new Date().toLocaleTimeString();

    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.toLowerCase().split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    let response: React.ReactNode = null;
    let resType: 'success' | 'error' | 'info' = 'info';

    switch (mainCmd) {
      case 'help':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-cyan-300 font-bold">Available System Commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-slate-300">
              <div><span className="text-emerald-400 font-bold">about</span> : Raj's core bio & headline</div>
              <div><span className="text-emerald-400 font-bold">skills</span> : Technical arsenal & tools</div>
              <div><span className="text-emerald-400 font-bold">projects</span> : Live projects & apps</div>
              <div><span className="text-emerald-400 font-bold">certs</span> : Verified industry certifications</div>
              <div><span className="text-emerald-400 font-bold">hackathons</span> : Innovation competitions</div>
              <div><span className="text-emerald-400 font-bold">experience</span> : Career milestones</div>
              <div><span className="text-emerald-400 font-bold">contact</span> : Transmission links & email</div>
              <div><span className="text-emerald-400 font-bold">resume</span> : Download official PDF resume</div>
              <div><span className="text-pink-400 font-bold">3d</span> / <span className="text-pink-400 font-bold">rover</span> : Launch 3D Cyber World</div>
              <div><span className="text-cyan-400 font-bold">jarvis</span> / <span className="text-cyan-400 font-bold">vision</span> : Hologram Hand Tracking AI Mode</div>
              <div><span className="text-pink-400 font-bold">matrix</span> : Toggle Neural Matrix Stream</div>
              <div><span className="text-amber-400 font-bold">theme [dark|light]</span> : Switch color scheme</div>
              <div><span className="text-amber-400 font-bold">whoami</span> : Explorer identity check</div>
              <div><span className="text-amber-400 font-bold">quote</span> : Random inspiration quote</div>
              <div><span className="text-slate-400 font-bold">clear</span> : Clear terminal buffer</div>
              <div><span className="text-slate-400 font-bold">exit</span> : Close terminal console</div>
            </div>
          </div>
        );
        break;

      case 'about':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-xs font-mono space-y-1.5">
            <p className="text-cyan-400 font-bold text-sm">👤 {PORTFOLIO_DATA.personal.name} — {PORTFOLIO_DATA.personal.title}</p>
            <p className="text-slate-300">💡 <span className="text-amber-300 font-semibold">{PORTFOLIO_DATA.personal.tagline}</span></p>
            <p className="text-slate-300 leading-relaxed">{PORTFOLIO_DATA.personal.bio}</p>
            <p className="text-emerald-400">📍 Location: {PORTFOLIO_DATA.personal.location} · 🌐 {PORTFOLIO_DATA.personal.portfolioUrl}</p>
          </div>
        );
        break;

      case 'skills':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-3 text-xs font-mono">
            {PORTFOLIO_DATA.skills.map((cat, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <p className="text-cyan-300 font-bold mb-1">⚡ {cat.name}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s, si) => (
                    <span key={si} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px]" style={{ borderColor: s.color }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-2 text-xs font-mono">
            <p className="text-pink-400 font-bold">📂 Featured Production Projects:</p>
            <div className="grid gap-2">
              {PORTFOLIO_DATA.projects.map(p => (
                <div key={p.id} className="p-2.5 rounded-lg bg-slate-900/70 border border-pink-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-white font-bold">{p.title}</span>
                    <p className="text-slate-400 text-[11px]">{p.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded text-[10px] hover:bg-pink-500/40">
                        Live ↗
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-1 bg-slate-800 text-slate-200 border border-slate-700 rounded text-[10px] hover:bg-slate-700">
                        Code ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'certs':
      case 'certifications':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="text-amber-400 font-bold">🏆 Verified Credentials ({PORTFOLIO_DATA.certifications.length}):</p>
            {PORTFOLIO_DATA.certifications.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-200">{c.title}</span>
                <span className="text-amber-300 font-bold text-[11px]">[{c.issuer}]</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'hackathons':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-1.5 text-xs font-mono">
            <p className="text-purple-400 font-bold">🚀 Hackathons & Innovation Challenges:</p>
            {PORTFOLIO_DATA.hackathons.map((h, i) => (
              <div key={i} className="p-2 rounded bg-slate-900/60 border border-purple-500/30">
                <span className="text-purple-300 font-bold">{h.title}</span>
                <p className="text-slate-400 text-[11px] mt-0.5">{h.description}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'experience':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="space-y-2 text-xs font-mono">
            {PORTFOLIO_DATA.experience.map((exp, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-900/70 border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-bold">{exp.role}</span>
                  <span className="text-slate-400 text-[11px]">{exp.period}</span>
                </div>
                <p className="text-slate-300 text-[11px] font-semibold mt-0.5">{exp.company}</p>
                <ul className="mt-2 space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                  {exp.points.map((pt, pi) => (
                    <li key={pi}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case 'contact':
        SOUNDS.terminalSuccess();
        resType = 'success';
        response = (
          <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/30 text-xs font-mono space-y-1">
            <p className="text-emerald-400 font-bold">📡 Direct Transmission Channels:</p>
            <p>📧 Email: <a href={`mailto:${PORTFOLIO_DATA.personal.email}`} className="text-cyan-300 underline">{PORTFOLIO_DATA.personal.email}</a></p>
            <p>💼 LinkedIn: <a href={PORTFOLIO_DATA.personal.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">{PORTFOLIO_DATA.personal.linkedinUrl}</a></p>
            <p>🐙 GitHub: <a href={PORTFOLIO_DATA.personal.githubUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">{PORTFOLIO_DATA.personal.githubUrl}</a></p>
            <p>🌐 Web: <a href={PORTFOLIO_DATA.personal.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline">{PORTFOLIO_DATA.personal.portfolioUrl}</a></p>
          </div>
        );
        break;

      case 'resume':
        SOUNDS.terminalSuccess();
        resType = 'success';
        window.open(PORTFOLIO_DATA.personal.resumePdf, '_blank');
        response = (
          <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            📄 Opening official resume in a new tab: <span className="font-bold text-white">Raj_kamal.pdf</span>
          </div>
        );
        break;

      case '3d':
      case 'rover':
      case 'world':
        SOUNDS.terminalSuccess();
        resType = 'success';
        onClose();
        worldStore.setIs3DActive(true);
        response = (
          <div className="text-xs text-purple-300 font-mono">
            🕹️ Initializing 3D Cyber Island Rover Simulation...
          </div>
        );
        break;

      case 'matrix':
        SOUNDS.terminalSuccess();
        resType = 'success';
        worldStore.setMatrixActive(true);
        response = (
          <div className="text-xs text-emerald-400 font-mono">
            🟢 Neural Matrix Stream Launched. Press ESC to return.
          </div>
        );
        break;

      case 'jarvis':
      case 'vision':
      case 'hand':
        SOUNDS.terminalSuccess();
        resType = 'success';
        onClose();
        jarvisStore.setActive(true);
        response = (
          <div className="text-xs text-cyan-300 font-mono">
            🧤 Initializing Jarvis Holographic Vision Interface...
          </div>
        );
        break;

      case 'theme':
        if (arg === 'dark' || arg === 'light') {
          if ((arg === 'dark' && theme !== 'dark') || (arg === 'light' && theme === 'dark')) {
            toggleTheme();
          }
          SOUNDS.terminalSuccess();
          resType = 'success';
          response = <div className="text-xs text-cyan-300 font-mono">✨ Theme updated to {arg} mode.</div>;
        } else {
          SOUNDS.terminalError();
          resType = 'error';
          response = <div className="text-xs text-rose-400 font-mono">Usage: theme dark | theme light</div>;
        }
        break;

      case 'whoami':
        SOUNDS.terminalSuccess();
        response = (
          <div className="text-xs font-mono text-cyan-300">
            Explorer Identity: Distinguished Recruiter / Tech Innovator 🚀<br />
            Session: Authenticated with root access to Raj Kamal's portfolio network.
          </div>
        );
        break;

      case 'quote':
        const quotes = [
          "“No roadmap. No guidance. Just curiosity.” — Raj Kamal",
          "“Talk is cheap. Show me the code.” — Linus Torvalds",
          "“Data is the new oil, but software is the engine that burns it.”",
          "“Curiosity is the engine of achievement.”"
        ];
        SOUNDS.terminalSuccess();
        response = (
          <div className="text-xs font-mono text-amber-300 italic">
            {quotes[Math.floor(Math.random() * quotes.length)]}
          </div>
        );
        break;

      case 'sudo':
      case 'easteregg':
        SOUNDS.terminalSuccess();
        response = (
          <div className="text-xs font-mono text-pink-400 font-bold">
            🎉 [ACCESS GRANTED]: You found the secret terminal backdoor! Raj Kamal welcomes your keen developer curiosity.
          </div>
        );
        break;

      case 'clear':
      case 'cls':
        setOutputs([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        return;

      default:
        SOUNDS.terminalError();
        resType = 'error';
        response = (
          <div className="text-xs font-mono text-rose-400">
            Command not recognized: <span className="font-bold underline">{cmd}</span>. Type <span className="text-cyan-300 font-bold">help</span> to view available operations.
          </div>
        );
    }

    setOutputs(prev => [
      ...prev,
      { id: cmdId, command: rawCmd, output: response, timestamp, type: resType }
    ]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInput(history[nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(nextIdx);
          setInput(history[nextIdx]);
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`w-full bg-slate-950/95 border border-cyan-500/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-scaleUp ${
          isExpanded ? 'h-[92vh] max-w-6xl' : 'h-[620px] max-w-3xl'
        }`}
      >
        {/* Terminal Titlebar */}
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer hover:bg-rose-600" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer hover:bg-amber-600" onClick={() => setIsExpanded(!isExpanded)} />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer hover:bg-emerald-600" onClick={() => handleCommand('help')} />
            <span className="ml-2 text-xs font-mono text-cyan-400 font-bold flex items-center gap-1.5">
              <TerminalIcon size={14} /> rajkamal@cyber-node:~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle expand"
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              aria-label="Close terminal"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Quick Execution Pills */}
        <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] text-slate-400 font-mono font-bold mr-1">QUICK:</span>
          {QUICK_COMMANDS.map(q => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                type="button"
                onClick={() => handleCommand(q.label)}
                className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-200 hover:text-white flex items-center gap-1 transition-all hover:scale-105"
                style={{ borderColor: `${q.color}40` }}
              >
                <Icon size={12} style={{ color: q.color }} />
                <span>{q.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Command Buffer */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 font-mono text-xs scrollbar-thin scrollbar-thumb-slate-800">
          {outputs.map(out => (
            <div key={out.id} className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <span className="text-emerald-400 font-bold">rajkamal@cyber-node</span>
                <span className="text-slate-600">:</span>
                <span className="text-cyan-400">~</span>
                <span className="text-slate-300 font-bold">$ {out.command}</span>
                <span className="text-slate-600 text-[10px] ml-auto">{out.timestamp}</span>
              </div>
              <div className="pl-3 border-l-2 border-slate-800">{out.output}</div>
            </div>
          ))}
        </div>

        {/* Active Command Input Line */}
        <div className="p-3 sm:p-4 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2 font-mono">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold shrink-0">
            <span>rajkamal@node</span>
            <span className="text-slate-600">:</span>
            <span className="text-cyan-400">~</span>
            <span className="text-pink-400">$</span>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type command (e.g. help, skills, projects, resume, 3d)..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono"
            autoFocus
          />
          <button
            type="button"
            onClick={() => handleCommand(input)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 hover:text-cyan-100 text-xs font-bold transition-all flex items-center gap-1"
          >
            <Send size={12} /> Run
          </button>
        </div>
      </div>
    </div>
  );
};
