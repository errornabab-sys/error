/**
 * VeriTrust – Privacy & Truth Intelligence Platform
 * Tagline: Privacy in Proof. Truth in Information.
 * 
 * Main Application Orchestrator
 */

import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ZkEligibilityModule } from './components/ZkEligibilityModule';
import { FactCheckerModule } from './components/FactCheckerModule';
import { HistoryAuditModule } from './components/HistoryAuditModule';
import { AboutModule } from './components/AboutModule';
import { VerificationResult } from './utils/crypto-zkp';
import { FactCheckReport, PRESET_CLAIMS } from './utils/fact-checker';
import { ShieldCheck, Lock, SearchCheck, Github, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [zkResults, setZkResults] = useState<VerificationResult[]>([]);
  const [factReports, setFactReports] = useState<FactCheckReport[]>(PRESET_CLAIMS);

  const handleProofVerified = (result: VerificationResult) => {
    setZkResults(prev => [result, ...prev]);
  };

  const handleReportGenerated = (report: FactCheckReport) => {
    setFactReports(prev => {
      const exists = prev.some(r => r.id === report.id);
      if (exists) return prev;
      return [report, ...prev];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickVerify={() => setActiveTab('zkp')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            <HeroSection onNavigate={(tab) => setActiveTab(tab)} />
          </div>
        )}

        {activeTab === 'zkp' && (
          <ZkEligibilityModule
            onProofVerified={handleProofVerified}
          />
        )}

        {activeTab === 'factcheck' && (
          <FactCheckerModule
            onReportGenerated={handleReportGenerated}
          />
        )}

        {activeTab === 'history' && (
          <HistoryAuditModule
            zkResults={zkResults}
            factReports={factReports}
          />
        )}

        {activeTab === 'about' && (
          <AboutModule />
        )}
      </main>

      {/* Global SaaS Footer */}
      <footer className="w-full border-t border-slate-900 bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white font-display">VeriTrust</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-400">Privacy in Proof. Truth in Information.</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <button
              onClick={() => setActiveTab('home')}
              className="hover:text-slate-200 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => setActiveTab('zkp')}
              className="hover:text-slate-200 transition-colors"
            >
              ZK Eligibility
            </button>
            <button
              onClick={() => setActiveTab('factcheck')}
              className="hover:text-slate-200 transition-colors"
            >
              Fact Checker
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="hover:text-slate-200 transition-colors"
            >
              Audit Trail
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className="hover:text-slate-200 transition-colors"
            >
              Architecture
            </button>
          </div>

          <div className="font-mono text-[11px] text-slate-400">
            RFC 3526 MODP 2048-bit ZKP Engine
          </div>
        </div>
      </footer>

    </div>
  );
}
