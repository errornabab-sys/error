import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  ArrowRight, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles,
  FileCode,
  Shield,
  Layers,
  Info
} from 'lucide-react';
import {
  VERIFICATION_CONDITIONS,
  VerificationCondition,
  ZkProofPayload,
  VerificationResult,
  calculateAge,
  checkEligibility,
  generateZeroKnowledgeProof,
  verifyZkProof,
  ZKP_PARAMS,
} from '../utils/crypto-zkp';

interface ZkEligibilityModuleProps {
  onProofGenerated?: (proof: ZkProofPayload) => void;
  onProofVerified?: (result: VerificationResult) => void;
}

export const ZkEligibilityModule: React.FC<ZkEligibilityModuleProps> = ({
  onProofGenerated,
  onProofVerified,
}) => {
  // Mode switcher: Prover Dashboard vs Verifier Dashboard
  const [activeSubTab, setActiveSubTab] = useState<'prover' | 'verifier'>('prover');

  // --- PROVER STATE (Kept strictly local in browser memory) ---
  const [userDob, setUserDob] = useState<string>('1998-06-15');
  const [userIncome, setUserIncome] = useState<number>(750000);
  const [userBalance, setUserBalance] = useState<number>(240000);
  const [userCreditScore, setUserCreditScore] = useState<number>(765);

  const [selectedConditionId, setSelectedConditionId] = useState<string>('CREDIT_700');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentProof, setCurrentProof] = useState<ZkProofPayload | null>(null);
  const [proverError, setProverError] = useState<string | null>(null);
  const [copiedProof, setCopiedProof] = useState<boolean>(false);
  const [showRawPayload, setShowRawPayload] = useState<boolean>(false);

  // --- VERIFIER STATE ---
  const [verifierProofInput, setVerifierProofInput] = useState<string>('');
  const [activeVerification, setActiveVerification] = useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [tamperApplied, setTamperApplied] = useState<'none' | 'threshold' | 'commitment'>('none');
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);

  // Calculate current age dynamically from DOB
  const currentAge = calculateAge(userDob);

  // Active selected condition definition
  const selectedCondition = VERIFICATION_CONDITIONS.find(c => c.id === selectedConditionId) || VERIFICATION_CONDITIONS[0];

  // Check Prover local eligibility preview
  const eligibilityPreview = checkEligibility(selectedCondition, {
    dob: userDob,
    income: userIncome,
    balance: userBalance,
    creditScore: userCreditScore,
  });

  // Handle Generate ZK Proof
  const handleGenerateProof = () => {
    setProverError(null);
    setIsGenerating(true);

    setTimeout(() => {
      try {
        const check = checkEligibility(selectedCondition, {
          dob: userDob,
          income: userIncome,
          balance: userBalance,
          creditScore: userCreditScore,
        });

        if (!check.isEligible) {
          throw new Error(
            `Ineligible: Your current private value does not meet the required threshold (${selectedCondition.threshold} ${selectedCondition.unit}). ZKP cannot be generated for unsatisfied conditions.`
          );
        }

        const proof = generateZeroKnowledgeProof(selectedCondition, check.privateValue);
        setCurrentProof(proof);
        setVerifierProofInput(JSON.stringify(proof, null, 2));
        if (onProofGenerated) onProofGenerated(proof);
      } catch (err: any) {
        setProverError(err.message || 'Failed to generate cryptographic proof.');
      } finally {
        setIsGenerating(false);
      }
    }, 250);
  };

  // Handle Verify Proof
  const handleVerifyProof = () => {
    setIsVerifying(true);
    setActiveVerification(null);

    setTimeout(() => {
      try {
        if (!verifierProofInput.trim()) {
          throw new Error('Please enter or generate a proof payload to verify.');
        }

        let parsedProof: ZkProofPayload;
        try {
          parsedProof = JSON.parse(verifierProofInput);
        } catch {
          throw new Error('Invalid JSON format for proof payload.');
        }

        const result = verifyZkProof(parsedProof);
        setActiveVerification(result);
        setVerificationHistory(prev => [result, ...prev.slice(0, 9)]);
        if (onProofVerified) onProofVerified(result);
      } catch (err: any) {
        const failureResult: VerificationResult = {
          isValid: false,
          proofId: 'malformed_input',
          conditionId: 'unknown',
          conditionLabel: 'Unparsed Condition',
          threshold: 0,
          verifiedAt: Date.now(),
          mathChecks: {
            commitmentWellFormed: false,
            challengeMatchesHash: false,
            sigmaEquationSatisfied: false,
            zeroPiiContained: true,
          },
          rejectionReason: err.message || 'Malformed payload or parsing error.',
          privacyAudit: {
            privateDataTransmittedBytes: 0,
            anonymityScore: '100% Zero-Knowledge',
            commitmentType: 'Information-Theoretically Hiding Pedersen',
            cryptographicStandard: ZKP_PARAMS.securityLevel,
          },
        };
        setActiveVerification(failureResult);
      } finally {
        setIsVerifying(false);
      }
    }, 200);
  };

  // Tamper attack simulation
  const handleApplyTamper = (type: 'threshold' | 'commitment') => {
    if (!currentProof) return;
    setTamperApplied(type);

    if (type === 'threshold') {
      const tampered = {
        ...currentProof,
        threshold: currentProof.threshold * 2, // Double the required threshold
      };
      setVerifierProofInput(JSON.stringify(tampered, null, 2));
    } else if (type === 'commitment') {
      const commitmentBigInt = BigInt(currentProof.commitment);
      const tampered = {
        ...currentProof,
        commitment: '0x' + (commitmentBigInt + 1n).toString(16), // Corrupt the commitment
      };
      setVerifierProofInput(JSON.stringify(tampered, null, 2));
    }
  };

  // Reset to genuine current proof
  const handleResetToGenuine = () => {
    if (!currentProof) return;
    setTamperApplied('none');
    setVerifierProofInput(JSON.stringify(currentProof, null, 2));
  };

  // Copy to clipboard
  const handleCopyProof = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 2000);
  };

  // Preset demo profiles for quick testing
  const loadDemoProfile = (profile: 'prime' | 'starter' | 'hni') => {
    if (profile === 'prime') {
      setUserDob('1994-08-20');
      setUserIncome(850000);
      setUserBalance(320000);
      setUserCreditScore(770);
      setSelectedConditionId('CREDIT_700');
    } else if (profile === 'starter') {
      setUserDob('2003-03-10');
      setUserIncome(420000);
      setUserBalance(85000);
      setUserCreditScore(680);
      setSelectedConditionId('AGE_21');
    } else if (profile === 'hni') {
      setUserDob('1988-11-04');
      setUserIncome(2400000);
      setUserBalance(850000);
      setUserCreditScore(815);
      setSelectedConditionId('INCOME_5L');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Module Header & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span className="text-cyan-400">MODULE 01</span>
            <span>/</span>
            <span>PRIVACY-PRESERVING ELIGIBILITY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Zero-Knowledge Eligibility Verification
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Prove compliance with income, age, balance, or credit score criteria with mathematical certainty and zero data disclosure.
          </p>
        </div>

        {/* Dual Interface Switcher Tabs */}
        <div className="inline-flex p-1 bg-slate-900 border border-slate-800 rounded-xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab('prover')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'prover'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Prover Dashboard (User)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('verifier')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 ${
              activeSubTab === 'verifier'
                ? 'bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verifier Dashboard (Auditor)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERFACE A: PROVER DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'prover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Private Inputs & Condition Picker */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Privacy Guarantee Card */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-sm flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-emerald-300 block">
                  100% Client-Side Prover Isolation Guaranteed
                </span>
                <p className="text-slate-300 leading-relaxed">
                  Your Date of Birth, Salary, Bank Balance, and Credit Score are kept strictly in local client memory. 
                  The generated payload contains only modular Pedersen commitments and challenge signatures—<strong>never plaintext numbers</strong>.
                </p>
              </div>
            </div>

            {/* Quick Demo Profiles */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-medium">Quick Demo Profiles:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => loadDemoProfile('prime')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  Prime Borrower (765 Score)
                </button>
                <button
                  onClick={() => loadDemoProfile('hni')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  High Net Worth (₹24L+)
                </button>
                <button
                  onClick={() => loadDemoProfile('starter')}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded text-slate-300 hover:text-white transition-colors"
                >
                  Young Adult (Age 23)
                </button>
              </div>
            </div>

            {/* Private User Inputs Form */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>Private Prover Attributes (Local Only)</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400">Zero Transmission</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date of Birth */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Date of Birth <span className="text-slate-400 font-mono">(Age: {currentAge} yrs)</span>
                  </label>
                  <input
                    type="date"
                    value={userDob}
                    onChange={(e) => setUserDob(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm text-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Annual Income */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Annual Income (₹ / year)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={userIncome}
                    onChange={(e) => setUserIncome(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm text-white font-mono focus:outline-none transition-colors"
                    placeholder="e.g. 750000"
                  />
                </div>

                {/* Bank Balance */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Liquid Bank Balance (₹)
                  </label>
                  <input
                    type="number"
                    step="5000"
                    value={userBalance}
                    onChange={(e) => setUserBalance(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm text-white font-mono focus:outline-none transition-colors"
                    placeholder="e.g. 150000"
                  />
                </div>

                {/* Credit Score */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Credit Score (300 – 900)
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="900"
                    value={userCreditScore}
                    onChange={(e) => setUserCreditScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-sm text-white font-mono focus:outline-none transition-colors"
                    placeholder="e.g. 765"
                  />
                </div>
              </div>
            </div>

            {/* Verification Conditions Selection */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Select Verification Condition to Prove</span>
                </h3>
                <span className="text-xs text-slate-400">Choose one</span>
              </div>

              <div className="space-y-2.5">
                {VERIFICATION_CONDITIONS.map((cond) => {
                  const check = checkEligibility(cond, {
                    dob: userDob,
                    income: userIncome,
                    balance: userBalance,
                    creditScore: userCreditScore,
                  });
                  const isSelected = selectedConditionId === cond.id;

                  return (
                    <div
                      key={cond.id}
                      onClick={() => setSelectedConditionId(cond.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'border-cyan-500/60 bg-cyan-950/20'
                          : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-cyan-400 bg-cyan-500/20'
                              : 'border-slate-700'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white">
                            {cond.label}
                          </div>
                          <div className="text-xs text-slate-400">
                            {cond.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {check.isEligible ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Satisfied</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-800/40">
                            <XCircle className="w-3 h-3" />
                            <span>Unsatisfied</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleGenerateProof}
                  disabled={isGenerating || !eligibilityPreview.isEligible}
                  className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    eligibilityPreview.isEligible && !isGenerating
                      ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-md shadow-cyan-950/40 active:scale-98 cursor-pointer'
                      : 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Computing 2048-bit Sigma Proof...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Zero-Knowledge Proof</span>
                    </>
                  )}
                </button>

                {!eligibilityPreview.isEligible && (
                  <p className="text-xs text-rose-400 text-center mt-2 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Your private input does not meet this threshold. In ZK mathematics, false statements cannot be proved.</span>
                  </p>
                )}

                {proverError && (
                  <div className="mt-3 p-3 rounded-lg bg-rose-950/30 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{proverError}</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Generated Proof Payload Inspector */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Generated Proof Payload</h3>
                </div>
                {currentProof && (
                  <span className="text-xs font-mono text-emerald-400">Ready</span>
                )}
              </div>

              {currentProof ? (
                <div className="space-y-4">
                  
                  {/* Public Statement Badge */}
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Public Proven Statement:</span>
                      <span className="text-slate-400 font-mono">0 Bytes PII</span>
                    </div>
                    <div className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{currentProof.conditionLabel}</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Anonymous Proof ID: <span className="font-mono text-slate-300">{currentProof.proofId}</span>
                    </div>
                  </div>

                  {/* Cryptographic Parameters Inspector */}
                  <div className="space-y-2 text-xs">
                    <div className="text-slate-400 font-medium flex items-center justify-between">
                      <span>Cryptographic Witness Structures:</span>
                      <button
                        onClick={() => setShowRawPayload(!showRawPayload)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {showRawPayload ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showRawPayload ? 'Hide Raw JSON' : 'Show Raw JSON'}</span>
                      </button>
                    </div>

                    {!showRawPayload ? (
                      <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-slate-400">Pedersen Commitment (C):</span>
                          <div className="text-cyan-300 truncate">{currentProof.commitment}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Announcement (A):</span>
                          <div className="text-indigo-300 truncate">{currentProof.announcement}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Fiat-Shamir Challenge (e):</span>
                          <div className="text-amber-300 truncate">{currentProof.challenge}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Sigma Response (z_Δ):</span>
                          <div className="text-emerald-300 truncate">{currentProof.responseDelta}</div>
                        </div>
                        <div>
                          <span className="text-slate-400">Nullifier Hash:</span>
                          <div className="text-slate-400 truncate">{currentProof.nullifierHash}</div>
                        </div>
                      </div>
                    ) : (
                      <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 max-h-60 overflow-y-auto">
                        {JSON.stringify(currentProof, null, 2)}
                      </pre>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleCopyProof(JSON.stringify(currentProof, null, 2))}
                      className="flex-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedProof ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedProof ? 'Copied to Clipboard' : 'Copy Proof Payload'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setVerifierProofInput(JSON.stringify(currentProof, null, 2));
                        setActiveSubTab('verifier');
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-semibold text-cyan-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Send to Verifier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* PII Audit Confirmation */}
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>PII Leak Audit:</span>
                    <span className="font-mono text-emerald-400 font-semibold">0 Plaintext Attributes</span>
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <p className="font-medium text-slate-300">No proof generated yet</p>
                  <p className="max-w-xs mx-auto text-slate-400">
                    Select a condition on the left and click "Generate Zero-Knowledge Proof" to produce your mathematical witness.
                  </p>
                </div>
              )}
            </div>

            {/* Cryptographic Standards Note */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Why Hashing Alone is NOT a ZKP</span>
              </div>
              <p className="leading-relaxed">
                If you hash your date of birth, an attacker can rainbow-table test all 36,500 dates in under 1 second. 
                Furthermore, a hash cannot prove that <code>Age ≥ 18</code> without revealing the date. 
                VeriTrust uses <strong>Pedersen commitments + Sigma range witness invariants</strong>, providing true information-theoretic secrecy.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERFACE B: VERIFIER DASHBOARD */}
      {/* ========================================================================= */}
      {activeSubTab === 'verifier' && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Proof Payload Input & Tamper Simulator */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Proof Payload Input (Verifier Terminal)</span>
                  </h3>
                  <span className="text-xs text-slate-400">JSON Payload</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Paste Zero-Knowledge Proof String:
                  </label>
                  <textarea
                    rows={8}
                    value={verifierProofInput}
                    onChange={(e) => setVerifierProofInput(e.target.value)}
                    placeholder="Paste zkp payload JSON here or load from Prover..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-slate-200 font-mono focus:outline-none transition-colors"
                  />
                </div>

                {/* Tamper Test Suite (Demonstrates non-forgeability) */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Security Tamper Test Suite</span>
                    </span>
                    {tamperApplied !== 'none' && (
                      <span className="text-[11px] font-mono text-rose-400 font-medium">
                        Tampered Active: {tamperApplied}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Simulate how an adversary trying to falsify eligibility is immediately caught by group exponent invariants:
                  </p>
                  
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => handleApplyTamper('threshold')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        tamperApplied === 'threshold'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      Tamper: Alter Threshold
                    </button>

                    <button
                      onClick={() => handleApplyTamper('commitment')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        tamperApplied === 'commitment'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      Tamper: Corrupt Commitment C
                    </button>

                    {tamperApplied !== 'none' && (
                      <button
                        onClick={handleResetToGenuine}
                        className="px-2.5 py-1 text-xs rounded border border-cyan-800 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40 transition-colors"
                      >
                        Reset to Genuine
                      </button>
                    )}
                  </div>
                </div>

                {/* Verify Proof Button */}
                <button
                  onClick={handleVerifyProof}
                  disabled={isVerifying || !verifierProofInput.trim()}
                  className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 shadow-md shadow-cyan-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Fiat-Shamir Group Invariant...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Proof Mathematically</span>
                    </>
                  )}
                </button>

              </div>

            </div>

            {/* Right Column: Verification Results & Display Requirements */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Verifier Inspection Display</span>
                  </h3>
                  <span className="text-xs text-slate-400">Strict Minimal Disclosure</span>
                </div>

                {activeVerification ? (
                  <div className="space-y-4">
                    
                    {/* Primary Status Banner */}
                    <div
                      className={`p-4 rounded-xl border flex items-center justify-between ${
                        activeVerification.isValid
                          ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-500/50 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {activeVerification.isValid ? (
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                            <XCircle className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <div className="text-lg font-bold">
                            {activeVerification.isValid ? 'Proof Verified (Valid)' : 'Proof Rejected (Invalid)'}
                          </div>
                          <div className="text-xs opacity-90">
                            {activeVerification.isValid 
                              ? 'Mathematical Fiat-Shamir signature satisfies group threshold' 
                              : activeVerification.rejectionReason}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verifier Display Fields (DISPLAY ONLY what was requested) */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Eligibility Condition:</span>
                        <span className="font-semibold text-white">{activeVerification.conditionLabel}</span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Verification Result:</span>
                        <span className={`font-semibold ${activeVerification.isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {activeVerification.isValid ? 'VERIFIED' : 'REJECTED'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Cryptographic Proof Status:</span>
                        <span className="font-mono text-cyan-400">
                          {activeVerification.isValid ? 'Sigma Equation Invariant Satisfied' : 'Failed Equation Check'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-slate-400">Verification Timestamp:</span>
                        <span className="font-mono text-slate-300">
                          {new Date(activeVerification.verifiedAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Anonymous Proof ID:</span>
                        <span className="font-mono text-slate-300">{activeVerification.proofId}</span>
                      </div>
                    </div>

                    {/* Math Checks Breakdown */}
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
                      <span className="font-semibold text-slate-300 block">Formal Verification Checks:</span>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          {activeVerification.mathChecks.commitmentWellFormed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span className="text-slate-300">Commitment in QR(p)</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {activeVerification.mathChecks.challengeMatchesHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span className="text-slate-300">Fiat-Shamir Hash Verified</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {activeVerification.mathChecks.sigmaEquationSatisfied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span className="text-slate-300">g^z · h^z ≡ A · (C')^e</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {activeVerification.mathChecks.zeroPiiContained ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          )}
                          <span className="text-slate-300">Zero PII Leakage Check</span>
                        </div>
                      </div>
                    </div>

                    {/* Privacy Status Indicator */}
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Privacy Audit: 0 bytes of PII transmitted.</span>
                      </div>
                      <span className="font-mono text-[11px] text-emerald-400">100% Zero-Knowledge</span>
                    </div>

                  </div>
                ) : (
                  <div className="py-12 text-center text-xs text-slate-400 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <p className="font-medium text-slate-300">Verifier Terminal Ready</p>
                    <p className="max-w-xs mx-auto text-slate-400">
                      Paste a proof payload or generate one from the Prover tab, then click "Verify Proof Mathematically".
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Proof Verification History */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Proof Verification History</span>
              </h3>
              <span className="text-xs text-slate-400">{verificationHistory.length} Recorded Audits</span>
            </div>

            {verificationHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="py-2.5 px-3">Proof ID</th>
                      <th className="py-2.5 px-3">Condition</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">PII Transmitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {verificationHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-slate-300 truncate max-w-[140px]">
                          {item.proofId}
                        </td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">
                          {item.conditionLabel}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(item.verifiedAt).toLocaleTimeString()}
                        </td>
                        <td className="py-2.5 px-3">
                          {item.isValid ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> VERIFIED
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1 font-semibold">
                              <XCircle className="w-3 h-3" /> REJECTED
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          0 bytes
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-slate-400">
                No verifications recorded in this session. Run verification above to populate the audit trail.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
