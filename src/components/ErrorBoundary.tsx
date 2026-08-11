import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Portfolio Error Caught:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      localStorage.clear();
      window.location.hash = '';
      window.location.reload();
    } catch (e) {
      window.location.href = '/';
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0F] text-slate-100 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-8 rounded-3xl bg-[#14141C] border border-cyan-500/30 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 mb-4">
              <AlertTriangle size={28} />
            </div>
            <h1 className="text-xl font-bold font-display text-white">Interface Restoring</h1>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              An unexpected render issue was safely intercepted. Click below to restore the interactive portfolio.
            </p>
            {this.state.error && (
              <p className="mt-3 p-2.5 rounded-xl bg-black/60 text-[11px] font-mono text-cyan-300 text-left overflow-x-auto border border-white/5">
                {this.state.error.message}
              </p>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-luxury mt-6 py-2.5 px-6 text-xs w-full justify-center"
            >
              <RotateCcw size={14} /> Restore Portfolio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
