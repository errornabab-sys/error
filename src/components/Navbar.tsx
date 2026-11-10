import React from 'react';
import { ShieldCheck, Lock, SearchCheck, History, Info, Sparkles } from 'lucide-react';

export type ActiveTab = 'home' | 'zkp' | 'factcheck' | 'history' | 'about';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickVerify?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onQuickVerify }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
          aria-label="VeriTrust Home"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/20 via-indigo-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold font-display tracking-tight text-white whitespace-nowrap">
              Veri<span className="text-cyan-400">Trust</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">
              v1.4
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'home'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveTab('zkp')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeTab === 'zkp'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>ZK Eligibility</span>
          </button>

          <button
            onClick={() => setActiveTab('factcheck')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeTab === 'factcheck'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <SearchCheck className="w-3.5 h-3.5" />
            <span>Fact Checker & Evolution</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeTab === 'history'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition-colors py-1 ${
              activeTab === 'about'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'hover:text-white'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About & ZKP Math</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (onQuickVerify) {
                onQuickVerify();
              } else {
                setActiveTab('zkp');
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all shadow-sm hover:shadow-cyan-500/20 whitespace-nowrap flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Prover</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/95 px-2 py-2 text-xs text-slate-300">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-2 py-1 rounded ${activeTab === 'home' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => setActiveTab('zkp')}
          className={`px-2 py-1 rounded ${activeTab === 'zkp' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          ZK Proof
        </button>
        <button
          onClick={() => setActiveTab('factcheck')}
          className={`px-2 py-1 rounded ${activeTab === 'factcheck' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Truth Tracker
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-2 py-1 rounded ${activeTab === 'history' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Audit
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`px-2 py-1 rounded ${activeTab === 'about' ? 'text-cyan-400 font-semibold' : ''}`}
        >
          Math
        </button>
      </div>
    </header>
  );
};
