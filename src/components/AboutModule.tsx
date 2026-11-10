import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  SearchCheck, 
  GitFork, 
  Cpu, 
  Terminal, 
  CheckCircle2, 
  FileCode, 
  Key, 
  Database,
  ArrowRight
} from 'lucide-react';
import { ZKP_PARAMS } from '../utils/crypto-zkp';

export const AboutModule: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
          <span className="text-cyan-400">CRYPTOGRAPHIC SPECIFICATION & ABOUT</span>
          <span>/</span>
          <span>SYSTEM ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          VeriTrust Architecture & Cryptographic Foundations
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          VeriTrust – Privacy & Truth Intelligence Platform: Privacy in Proof. Truth in Information. 
          Bridging zero-knowledge proof theory with practical real-world eligibility verification and forensic rumor mutation analysis.
        </p>
      </div>

      {/* Core Cryptographic Deep-Dive: Hashes vs Commitments vs ZKPs */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-display text-white">
            Crucial Distinction: Hashes vs. Commitments vs. Zero-Knowledge Proofs
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Why common shortcuts fail and how VeriTrust implements genuine mathematical proofs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Hashing */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">1. Hashing (e.g. SHA-256)</h4>
            <div className="text-xs font-mono text-rose-400 font-semibold">NOT a Zero-Knowledge Proof</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              A hash function is deterministic: H(x) always yields the same digest. 
              For small input domains (such as dates of birth with only ~36,500 possibilities, or credit scores from 300 to 900), an adversary can precompute all values in seconds and reveal x. 
              Crucially, <strong>a hash cannot prove that x ≥ threshold without exposing x</strong>.
            </p>
          </div>

          {/* Card 2: Pedersen Commitment */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">2. Pedersen Commitment</h4>
            <div className="text-xs font-mono text-indigo-400 font-semibold">Hiding + Binding Primitive</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates C = g^v · h^r mod p, where v is the secret value and r is a 2048-bit random blinding factor. 
              Pedersen commitments are <strong>information-theoretically hiding</strong>: given C, even an entity with infinite computing power cannot deduce v. 
              However, a commitment alone still requires a proof to verify relations.
            </p>
          </div>

          {/* Card 3: Genuine ZKP */}
          <div className="p-5 rounded-2xl border border-cyan-500/40 bg-cyan-950/20 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-base font-bold text-white">3. Genuine Sigma ZKP</h4>
            <div className="text-xs font-mono text-cyan-300 font-semibold">Complete, Sound, Zero-Knowledge</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              VeriTrust implements a non-interactive Sigma protocol using the <strong>Fiat-Shamir heuristic</strong>. 
              The prover demonstrates knowledge of (v, r) such that C = g^v · h^r mod p and (v − threshold) ≥ 0. 
              The verifier checks g^(z_Δ) · h^(z_r) ≡ A · (C / g^T)^e mod p. 
              <strong>0 bytes of PII are transmitted</strong>.
            </p>
          </div>

        </div>
      </section>

      {/* Mathematical Formulation Display */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h3 className="text-lg font-bold font-display text-white">
          Formal Mathematical Protocol (IETF RFC 3526 MODP Group 14)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-semibold block font-sans">Prover Steps (Client-Side Only):</span>
            <div className="space-y-1.5 text-slate-300">
              <div>1. Δ = v − Threshold ≥ 0</div>
              <div>2. Pick random blinding nonces: r, k_Δ, k_r ∈ Z_q</div>
              <div>3. Commitment: C = g^v · h^r mod p</div>
              <div>4. Announcement: A = g^(k_Δ) · h^(k_r) mod p</div>
              <div>5. Challenge: e = H(transcript) mod q</div>
              <div>6. Response: z_Δ = (k_Δ + e · Δ) mod q</div>
              <div>7. Response: z_r = (k_r + e · r) mod q</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-semibold block font-sans">Verifier Steps (Public Audit):</span>
            <div className="space-y-1.5 text-slate-300">
              <div>1. Receive (C, A, e, z_Δ, z_r, Threshold)</div>
              <div>2. Verify C, A ∈ [2, p − 1]</div>
              <div>3. Verify e ≡ H(transcript) mod q</div>
              <div>4. Compute C' = C · (g^T)^(-1) mod p</div>
              <div>5. Check: g^(z_Δ) · h^(z_r) ≡ A · (C')^e mod p</div>
              <div className="text-emerald-300 font-semibold pt-1">
                ✓ If equation holds: Prover possesses valid witness with zero PII disclosed.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Module 2 Architecture: The Misinformation Evolution Engine */}
      <section className="space-y-6">
        <div>
          <h3 className="text-xl font-bold font-display text-white">
            Module 02 Architecture: Forensic Misinformation Evolution
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Understanding the 4-stage pipeline of digital rumors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="text-xs font-mono text-cyan-400 font-semibold">STAGE 01</div>
            <h4 className="text-sm font-bold text-white">Original Information</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authentic scientific research, government regulatory circular, or primary incident report containing precise caveats, limitations, and control groups.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="text-xs font-mono text-indigo-400 font-semibold">STAGE 02</div>
            <h4 className="text-sm font-bold text-white">Context Removal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secondary aggregators and forums strip out vital qualifiers (e.g. sample size, laboratory environment, commercial applicability) to simplify the reading.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="text-xs font-mono text-amber-400 font-semibold">STAGE 03</div>
            <h4 className="text-sm font-bold text-white">Misinterpretation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clickbait portals and social feeds reframe the stripped context with high-arousal emotional vocabulary and false correlations to concurrent news events.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 space-y-2">
            <div className="text-xs font-mono text-rose-400 font-semibold">STAGE 04</div>
            <h4 className="text-sm font-bold text-white">Viral Distortion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Encrypted messaging chains and meme loops append fabricated authority endorsements ("NASA declared", "Cabinet order leaked") with urgent calls to forward.
            </p>
          </div>
        </div>
      </section>

      {/* Presentation & Startup Readiness */}
      <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
        <h3 className="text-lg font-bold font-display text-white">
          Startup & Presentation Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-2">
            <span className="font-semibold text-white block">Key Differentiators:</span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>Genuine 2048-bit safe prime Sigma non-interactive ZKP running in client memory</li>
              <li>Rejects false proofs mathematically via group exponent invariants (not UI flags)</li>
              <li>Integrated Tamper Simulation Suite to demonstrate cryptographic fraud prevention</li>
              <li>Forensic 4-stage mutation timeline linking real news archives (PIB, WHO, Reuters)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <span className="font-semibold text-white block">Tech Stack:</span>
            <ul className="space-y-1.5 list-disc list-inside text-slate-400">
              <li>React 19 + TypeScript 5.8 + Vite 8</li>
              <li>Tailwind CSS v4 with custom dark cyber theme & glassmorphic styling</li>
              <li>Native Node built-in test runner (<code className="text-cyan-400">node:test</code>) verifying all cryptographic invariants</li>
              <li>Modular component architecture with strict zero-PII leak isolation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="text-center pt-8 border-t border-slate-800 text-xs text-slate-400 space-y-1">
        <div className="font-semibold text-white">VeriTrust – Privacy & Truth Intelligence Platform</div>
        <div>Tagline: <em>Privacy in Proof. Truth in Information.</em></div>
        <div className="font-mono text-[11px] text-slate-400">Built for production verification and academic cybersecurity rigor.</div>
      </div>

    </div>
  );
};
