import React from 'react';
import { ShieldCheck, Lock, SearchCheck, ArrowRight, CheckCircle2, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { ActiveTab } from './Navbar';

interface HeroSectionProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div className="w-full">
      {/* Hero Visual Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-800/80">
        {/* Subtle radial ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-emerald-600/10 blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headline and Pitch */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-cyan-400">VeriTrust Architecture</span>
                <span className="text-slate-600">·</span>
                <span>RFC 3526 MODP 2048-bit ZKP</span>
                <span className="text-slate-600">·</span>
                <span className="text-emerald-400">Zero PII Leakage</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                Trust What You Verify.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  Protect What You Share.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                A smarter way to prove eligibility and fight misinformation without compromising privacy. 
                Generate non-interactive Zero-Knowledge proofs for banking and identity, and trace the forensic mutation lifecycle of viral rumors from root facts to viral distortion.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('zkp')}
                  className="px-5 py-3 text-sm font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all shadow-md shadow-cyan-950/40 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>ZK Eligibility Prover</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('factcheck')}
                  className="px-5 py-3 text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 hover:border-slate-600 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <SearchCheck className="w-4 h-4 text-cyan-400" />
                  <span>Misinformation Tracker</span>
                </button>
              </div>

              {/* Quick Trust Strip */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-400">
                <div>
                  <div className="font-semibold text-white font-mono text-base">0 Bytes</div>
                  <div className="text-slate-400">PII Transmitted</div>
                </div>
                <div>
                  <div className="font-semibold text-white font-mono text-base">2048-bit</div>
                  <div className="text-slate-400">MODP Group 14 ZKP</div>
                </div>
                <div>
                  <div className="font-semibold text-white font-mono text-base">4-Stage</div>
                  <div className="text-slate-400">Mutation Timeline</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl border border-slate-800 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-sm overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-emerald-500/10 opacity-70 pointer-events-none" />
                <img
                  src="/src/assets/images/hero_veritrust_shield_1794304973517.jpg"
                  alt="VeriTrust Cryptographic Proof & Truth Architecture"
                  className="w-full h-auto rounded-xl object-cover border border-slate-800/60 transition-transform duration-500 group-hover:scale-[1.01]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Micro overlay card */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-slate-950/90 border border-slate-800 backdrop-blur-md flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300 font-medium">Fiat-Shamir Sigma Engine Active</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-semibold">100% Client-Side</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Two Main Feature Cards Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Two Integrated Intelligence Engines
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Engineered for high-stakes enterprise compliance, verifiable lending, and automated misinformation counter-measures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {/* Feature Card 1: Privacy-Preserving Eligibility Verification */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all p-6 flex flex-col justify-between group">
            <div>
              <div className="overflow-hidden rounded-xl border border-slate-800 mb-5 relative aspect-[4/3] bg-slate-950">
                <img
                  src="/src/assets/images/feature_zkp_vault_1794304973396.jpg"
                  alt="Zero-Knowledge Privacy Vault"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-700/60 text-xs font-mono text-emerald-400">
                  Module 01: ZK Proof Engine
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Pedersen Commitments</span>
                <span>·</span>
                <span>Sigma Protocol</span>
                <span>·</span>
                <span>Non-Interactive ZKP</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Privacy-Preserving Eligibility Verification
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Prove that you meet regulatory thresholds (Age ≥ 18/21, Income ≥ ₹5L, Balance ≥ ₹1L, Credit Score ≥ 700) without ever exposing your birth date, bank statements, or salary slips.
              </p>

              <ul className="space-y-2 text-xs text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Prover runs locally in client RAM — no plaintext data is ever sent to server</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verifier dashboard receives only cryptographic commitment & challenge response</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Mathematical non-forgeability: tampering with thresholds immediately fails verification</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Prover + Verifier Modules</span>
              <button
                onClick={() => onNavigate('zkp')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open ZK Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Feature Card 2: Automated Fact Checking & Misinformation Evolution Tracker */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all p-6 flex flex-col justify-between group">
            <div>
              <div className="overflow-hidden rounded-xl border border-slate-800 mb-5 relative aspect-[4/3] bg-slate-950">
                <img
                  src="/src/assets/images/feature_truth_network_1794304973313.jpg"
                  alt="Truth Network and Mutation Graph"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-slate-950/80 border border-slate-700/60 text-xs font-mono text-cyan-400">
                  Module 02: Truth Intelligence
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>Multi-Source Crosscheck</span>
                <span>·</span>
                <span>4-Stage Evolution</span>
                <span>·</span>
                <span>Linguistic Forensics</span>
              </div>

              <h3 className="text-xl font-bold font-display text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Automated Fact Checking & Evolution Tracker
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Cross-reference viral headlines against authoritative fact-checking desks (PIB Fact Check, WHO, Reuters, BBC Verify) and interactively trace how legitimate reports mutate into internet hoaxes.
              </p>

              <ul className="space-y-2 text-xs text-slate-400 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Real source links to official government, WHO, and news organization archives</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Forensic 4-stage mutation timeline showing exact linguistic deletions and additions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Honest credibility scoring with explicit demonstration transparency tags</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Forensic Evolution Graph</span>
              <button
                onClick={() => onNavigate('factcheck')}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open Fact Checker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Security Principles Banner */}
      <section className="py-12 border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Pedersen Commitment vs. Hashing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlike simple SHA-256 hashes which are vulnerable to rainbow table brute-forcing on small domains (like age or credit score), Pedersen commitments are information-theoretically hiding.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Non-Interactive Sigma Proofs</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Using the Fiat-Shamir heuristic, proofs are generated in a single payload. Verifiers check mathematical group equations without requiring multi-round back-and-forth interactivity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="text-base font-semibold text-white mb-1">Forensic Mutation Auditing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Misinformation does not emerge in a vacuum. VeriTrust maps the semantic transformation from genuine technical whitepapers to viral clickbait forwards across 4 distinct mutation stages.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
