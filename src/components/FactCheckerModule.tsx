import React, { useState } from 'react';
import { 
  SearchCheck, 
  ExternalLink, 
  GitFork, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  FileText,
  Filter,
  Share2,
  Bookmark
} from 'lucide-react';
import { 
  PRESET_CLAIMS, 
  FactCheckReport, 
  analyzeClaim,
  EvolutionStage 
} from '../utils/fact-checker';

interface FactCheckerModuleProps {
  onReportGenerated?: (report: FactCheckReport) => void;
}

export const FactCheckerModule: React.FC<FactCheckerModuleProps> = ({ onReportGenerated }) => {
  const [claimInput, setClaimInput] = useState<string>('');
  const [activeReport, setActiveReport] = useState<FactCheckReport>(PRESET_CLAIMS[0]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedTimelineStage, setSelectedTimelineStage] = useState<number>(4); // Default to latest viral stage
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Trigger claim analysis
  const handleAnalyzeClaim = (inputOverride?: string) => {
    const textToAnalyze = inputOverride !== undefined ? inputOverride : claimInput;
    if (!textToAnalyze.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const report = analyzeClaim(textToAnalyze);
      setActiveReport(report);
      setSelectedTimelineStage(4);
      setIsAnalyzing(false);
      if (onReportGenerated) onReportGenerated(report);
    }, 300);
  };

  // Quick preset loader
  const handleSelectPreset = (preset: FactCheckReport) => {
    setClaimInput(preset.claimHeadline);
    setActiveReport(preset);
    setSelectedTimelineStage(4);
    if (onReportGenerated) onReportGenerated(preset);
  };

  // Active evolution stage details
  const activeStage = activeReport.evolutionTimeline.find(s => s.stageNumber === selectedTimelineStage) || activeReport.evolutionTimeline[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Section Header */}
      <div className="pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-1">
          <span className="text-cyan-400">MODULE 02</span>
          <span>/</span>
          <span>AUTOMATED FACT-CHECKING & FORENSIC TIMELINE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          Fact Checking & Misinformation Evolution Tracker
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Detect distorted claims, cross-reference trusted verification registries (PIB, WHO, Reuters, BBC Verify), and explore the chronological mutation pipeline that turns legitimate reports into internet panic.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: CLAIM INPUT SECTION */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <SearchCheck className="w-4 h-4 text-cyan-400" />
            <span>Submit Statement, News Headline, or Social Post</span>
          </h3>
          <span className="text-xs text-slate-400">Natural Language Verification</span>
        </div>

        {/* Input Textarea */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={claimInput}
            onChange={(e) => setClaimInput(e.target.value)}
            placeholder="Paste viral rumor, WhatsApp forward, news headline, or policy claim here..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-colors"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Viral Case Studies:</span>
              <button
                onClick={() => handleSelectPreset(PRESET_CLAIMS[0])}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded text-slate-200 transition-colors"
              >
                5G & Oxygen Disruption
              </button>
              <button
                onClick={() => handleSelectPreset(PRESET_CLAIMS[1])}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded text-slate-200 transition-colors"
              >
                RBI Digital Rupee 18% Tax
              </button>
              <button
                onClick={() => handleSelectPreset(PRESET_CLAIMS[2])}
                className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 rounded text-slate-200 transition-colors"
              >
                NASA 6 Days of Darkness
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => handleAnalyzeClaim()}
              disabled={isAnalyzing || (!claimInput.trim() && !activeReport)}
              className="px-6 py-2.5 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAnalyzing ? 'Cross-Referencing Sources...' : 'Track & Verify Claim'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION B: CREDIBILITY ANALYSIS DASHBOARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Credibility Summary & Gauges */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white">Credibility Assessment</h3>
              <span className="text-xs font-mono text-slate-400">{activeReport.claimCategory}</span>
            </div>

            {/* Score Radial / Metric Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 font-medium">VeriTrust Credibility Score</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-4xl font-extrabold font-mono ${
                      activeReport.credibilityScore > 70
                        ? 'text-emerald-400'
                        : activeReport.credibilityScore > 40
                          ? 'text-amber-400'
                          : 'text-rose-400'
                    }`}
                  >
                    {activeReport.credibilityScore}%
                  </span>
                  <span className="text-xs text-slate-400">/ 100%</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                    activeReport.claimStatus === 'Verified'
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : activeReport.claimStatus === 'Misleading'
                        ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                        : activeReport.claimStatus === 'False'
                          ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                          : 'bg-slate-800 border-slate-600 text-slate-300'
                  }`}
                >
                  {activeReport.claimStatus === 'False' && <XCircle className="w-3.5 h-3.5" />}
                  {activeReport.claimStatus === 'Verified' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {activeReport.claimStatus === 'Misleading' && <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{activeReport.claimStatus}</span>
                </span>
                <div className="text-[11px] text-slate-400 mt-1 font-mono">
                  Contradiction: {activeReport.contradictionLevel}
                </div>
              </div>
            </div>

            {/* Visual Indicators & Progress Bars */}
            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Evidence Reliability</span>
                  <span className="font-mono text-cyan-400">{activeReport.evidenceReliabilityScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeReport.evidenceReliabilityScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Source Consistency</span>
                  <span className="font-mono text-emerald-400">{activeReport.sourceConsistencyScore}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeReport.sourceConsistencyScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Linguistic Alarmism Index</span>
                  <span className="font-mono text-amber-400">{activeReport.linguisticMarkers.alarmistFraming}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${activeReport.linguisticMarkers.alarmistFraming}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Verdict Prose */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-1.5 leading-relaxed">
              <span className="font-semibold text-white block">Official Verdict Summary:</span>
              <p>{activeReport.verdictSummary}</p>
            </div>

            {/* Transparency Notice */}
            <div className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                {activeReport.transparencyNotice}
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Claim Headline & Context */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Claim Under Investigation
              </span>
              <span className="text-xs font-mono text-slate-400">
                Audited: {new Date(activeReport.analyzedAt).toLocaleDateString()}
              </span>
            </div>

            <h4 className="text-lg sm:text-xl font-bold font-display text-white leading-snug">
              "{activeReport.claimHeadline}"
            </h4>

            <p className="text-xs sm:text-sm text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-mono">
              <span className="text-slate-400 block mb-1 font-sans text-xs uppercase font-semibold">Submitted Text:</span>
              {activeReport.submittedText}
            </p>

            {/* Forensic Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Attribution Index</div>
                <div className="text-base font-bold font-mono text-cyan-400 mt-0.5">
                  {100 - activeReport.linguisticMarkers.attributionFabrication}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Context Retention</div>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  {100 - activeReport.linguisticMarkers.missingContextIndex}%
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <div className="text-xs text-slate-400">Mutation Stages</div>
                <div className="text-base font-bold font-mono text-white mt-0.5">
                  {activeReport.evolutionTimeline.length} Steps
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION D: MISINFORMATION EVOLUTION TIMELINE (THE CENTERPIECE) */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <GitFork className="w-3.5 h-3.5" />
              <span>FORENSIC MUTATION TIMELINE</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white">
              Misinformation Evolution Tracker
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Follow how authentic reports lose context, get sensationalized by clickbait, and mutate into viral internet hoaxes.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Click any stage node to inspect changes
          </span>
        </div>

        {/* Interactive Step Navigator */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {activeReport.evolutionTimeline.map((stage) => {
            const isSelected = selectedTimelineStage === stage.stageNumber;
            return (
              <button
                key={stage.stageNumber}
                onClick={() => setSelectedTimelineStage(stage.stageNumber)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/30 shadow-md shadow-cyan-950/40'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-mono font-bold text-slate-400">
                    STAGE 0{stage.stageNumber}
                  </span>
                  <span className="text-[11px] text-slate-400">{stage.date}</span>
                </div>
                <div className={`text-xs font-semibold ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                  {stage.badgeLabel}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-1">
                  {stage.platform}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Forensic Detail Box */}
        <div className="p-5 rounded-xl border border-slate-800 bg-slate-950 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {activeStage.stageName}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-300 font-medium">{activeStage.platform}</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>Velocity: <strong className="text-slate-200">{activeStage.viralityVelocity}</strong></span>
              <span>·</span>
              <span>Medium: <strong className="text-slate-200">{activeStage.evidenceType}</strong></span>
            </div>
          </div>

          {/* Active Claim Quote at this Stage */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Circulated Phrasing at this Stage:
            </div>
            <p className="text-sm font-medium text-slate-100 italic leading-relaxed">
              "{activeStage.claimText}"
            </p>
          </div>

          {/* Mutation Delta & Distortion Mechanic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="font-semibold text-amber-400 block">Mutation Delta (What was altered):</span>
              <p className="text-slate-300 leading-relaxed">
                {activeStage.mutationDelta}
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-800/80 space-y-1">
              <span className="font-semibold text-cyan-400 block">Distortion Mechanic:</span>
              <p className="text-slate-300 leading-relaxed">
                {activeStage.distortionMechanic}
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>Primary Reference: <strong>{activeStage.sourceReference}</strong></span>
            <span className="font-mono text-cyan-400">Evolution Step {activeStage.stageNumber} of 4</span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* SECTION C: TRUSTED EVIDENCE ANALYSIS & FACT CHECK SOURCES */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Trusted Evidence Sources & Authoritative Cross-References
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Primary documents, government gazettes, health registries, and peer-reviewed journals.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            {activeReport.evidenceSources.length} Independent Sources
          </span>
        </div>

        {/* Evidence Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeReport.evidenceSources.map((source) => (
            <div
              key={source.id}
              className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-cyan-300">
                    {source.sourceName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      source.stance === 'Refuting'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        : source.stance === 'Supporting'
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                          : 'bg-indigo-950/60 text-indigo-300 border border-indigo-800/60'
                    }`}
                  >
                    {source.stance}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-white leading-snug mb-1.5">
                  {source.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {source.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">
                  Published: {source.publishedDate}
                </span>

                <a
                  href={source.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                >
                  <span>View Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
