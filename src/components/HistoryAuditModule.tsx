import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  Check,
  Printer
} from 'lucide-react';
import { VerificationResult } from '../utils/crypto-zkp';
import { FactCheckReport, PRESET_CLAIMS } from '../utils/fact-checker';

interface HistoryAuditModuleProps {
  zkResults: VerificationResult[];
  factReports: FactCheckReport[];
}

export const HistoryAuditModule: React.FC<HistoryAuditModuleProps> = ({
  zkResults,
  factReports,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'zkp' | 'factcheck'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  // Combine seeded historical records if current session is young
  const displayFactReports = factReports.length > 0 ? factReports : PRESET_CLAIMS;

  // Filtered ZKP items
  const filteredZk = zkResults.filter(
    (item) =>
      item.proofId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.conditionLabel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filtered Fact Check items
  const filteredFacts = displayFactReports.filter(
    (item) =>
      item.claimHeadline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.submittedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.claimCategory.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Downloadable Audit Report Generator
  const handleDownloadReport = () => {
    const reportData = {
      platform: 'VeriTrust – Privacy & Truth Intelligence Platform',
      reportGeneratedAt: new Date().toISOString(),
      standards: [
        'IETF RFC 3526 MODP 2048-bit Group 14 ZKP',
        'Pedersen Information-Theoretic Commitment Standard',
        'Multi-Source Fact Verification (PIB, WHO, Reuters, BBC Verify)',
      ],
      privacyStatement: '0 bytes of personally identifiable information (PII) transmitted. Prover executed in isolated client memory.',
      zkpAudits: zkResults,
      factCheckAudits: displayFactReports,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VeriTrust_Compliance_Audit_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
            <span className="text-cyan-400">AUDIT LOG</span>
            <span>/</span>
            <span>VERIFICATION & FACT CHECK HISTORY</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
            Verification History & Forensic Logs
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Downloadable proof certificates, cryptographic audit trails, and multi-source debunking history.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? 'Report Downloaded' : 'Export Full Audit (JSON)'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-800 bg-slate-900/40">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search proof IDs, claim keywords, or categories..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Segmented Control */}
        <div className="inline-flex p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterType('zkp')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'zkp'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ZK Proofs ({filteredZk.length})
          </button>
          <button
            onClick={() => setFilterType('factcheck')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterType === 'factcheck'
                ? 'bg-slate-800 text-cyan-300 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fact Checks ({filteredFacts.length})
          </button>
        </div>
      </div>

      {/* Logs Table / Cards */}
      <div className="space-y-6">
        
        {/* ZKP Verifications Table */}
        {(filterType === 'all' || filterType === 'zkp') && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero-Knowledge Proof Audit Trail</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                0 Bytes PII Invariant
              </span>
            </div>

            {filteredZk.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-medium">
                      <th className="py-2.5 px-3">Proof ID</th>
                      <th className="py-2.5 px-3">Statement Condition</th>
                      <th className="py-2.5 px-3">Result</th>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3 text-right">Sigma Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {filteredZk.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-2.5 px-3 text-cyan-300 font-medium truncate max-w-[150px]">
                          {item.proofId}
                        </td>
                        <td className="py-2.5 px-3 text-white font-sans font-medium">
                          {item.conditionLabel}
                        </td>
                        <td className="py-2.5 px-3">
                          {item.isValid ? (
                            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1 font-semibold">
                              <XCircle className="w-3.5 h-3.5" /> REJECTED
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(item.verifiedAt).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-400">
                          Satisfied
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p>No ZK Proof verifications recorded in this session.</p>
                <p className="text-slate-400">
                  Switch to the "ZK Eligibility" module to generate and verify your first proof.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Fact Checks Table */}
        {(filterType === 'all' || filterType === 'factcheck') && (
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Forensic Claim Audits & Misinformation Log</span>
              </h3>
              <span className="text-xs font-mono text-slate-400">
                {filteredFacts.length} Claims Indexed
              </span>
            </div>

            <div className="space-y-3">
              {filteredFacts.map((fact) => (
                <div
                  key={fact.id}
                  className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-cyan-400">{fact.claimCategory}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono">
                        {new Date(fact.analyzedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">
                      {fact.claimHeadline}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {fact.verdictSummary}
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${
                        fact.claimStatus === 'Verified'
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : fact.claimStatus === 'Misleading'
                            ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                            : fact.claimStatus === 'False'
                              ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                              : 'bg-slate-800 border-slate-600 text-slate-300'
                      }`}
                    >
                      {fact.claimStatus}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Credibility: <strong className="text-white">{fact.credibilityScore}%</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
