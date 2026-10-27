import React, { useState } from 'react';
import { DeepDiveResponse } from '../types/research';
import { X, Sparkles, Download, Copy, Check, Target, Lightbulb, AlertTriangle, BarChart, CheckCircle2 } from 'lucide-react';
import { downloadTextFile } from '../utils/exportUtils';

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  deepDiveData: DeepDiveResponse | null;
  isLoading: boolean;
}

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({
  isOpen,
  onClose,
  deepDiveData,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!deepDiveData) return;
    const text = `# Research Proposal: ${deepDiveData.proposalTitle}
Target: ${deepDiveData.targetTitle} (${deepDiveData.targetType})

## Problem Statement
${deepDiveData.problemStatement}

## Formal Scientific Hypothesis
${deepDiveData.coreHypothesis}

## Proposed Methodology & Experimental Protocol
${deepDiveData.proposedMethodology.map((m, i) => `${i + 1}. ${m}`).join('\n')}

## Expected Challenges & Failure Modes
${deepDiveData.expectedChallenges.map((c, i) => `- ${c}`).join('\n')}

## Evaluation & Benchmark Protocol
${deepDiveData.benchmarkPlan}

## Potential Scientific Impact
${deepDiveData.potentialImpact}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!deepDiveData) return;
    const slug = deepDiveData.proposalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const text = `# Research Proposal: ${deepDiveData.proposalTitle}
Target: ${deepDiveData.targetTitle} (${deepDiveData.targetType})

## Problem Statement
${deepDiveData.problemStatement}

## Formal Scientific Hypothesis
${deepDiveData.coreHypothesis}

## Proposed Methodology & Experimental Protocol
${deepDiveData.proposedMethodology.map((m, i) => `${i + 1}. ${m}`).join('\n')}

## Expected Challenges & Failure Modes
${deepDiveData.expectedChallenges.map((c, i) => `- ${c}`).join('\n')}

## Evaluation & Benchmark Protocol
${deepDiveData.benchmarkPlan}

## Potential Scientific Impact
${deepDiveData.potentialImpact}
`;
    downloadTextFile(`${slug}.md`, text, 'text/markdown');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                Research Proposal Generator
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Deep Dive Research Plan
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {deepDiveData && !isLoading && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center space-x-1"
                  title="Copy Proposal"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors text-xs flex items-center space-x-1"
                  title="Download Markdown"
                >
                  <Download className="h-4 w-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {isLoading ? (
            <div className="py-16 text-center space-y-4">
              <div className="inline-block p-4 rounded-full bg-amber-50 text-amber-600 animate-spin">
                <Sparkles className="h-8 w-8" />
              </div>
              <p className="font-semibold text-slate-700">
                Agent is formulating rigorous hypothesis & experimental protocol...
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Synthesizing problem statement, baseline ablations, statistical significance thresholds, and anticipated failure modes.
              </p>
            </div>
          ) : deepDiveData ? (
            <>
              {/* Proposal Title */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Working Paper / Grant Title
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {deepDiveData.proposalTitle}
                </h2>
              </div>

              {/* Problem Statement */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span>Problem Statement & Scientific Gap</span>
                </span>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed font-serif">
                  {deepDiveData.problemStatement}
                </div>
              </div>

              {/* Core Hypothesis */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <span>Formal Testable Hypothesis</span>
                </span>
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 text-amber-950 font-serif italic leading-relaxed">
                  "{deepDiveData.coreHypothesis}"
                </div>
              </div>

              {/* Proposed Methodology */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Proposed 4-Stage Experimental Methodology</span>
                </span>
                <div className="space-y-2">
                  {deepDiveData.proposedMethodology.map((step, sIdx) => (
                    <div key={sIdx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-start space-x-3 shadow-2xs">
                      <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {sIdx + 1}
                      </span>
                      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Challenges & Mitigations */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  <span>Anticipated Challenges & Failure Modes</span>
                </span>
                <ul className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-1.5 text-xs text-rose-950">
                  {deepDiveData.expectedChallenges.map((ch, cIdx) => (
                    <li key={cIdx} className="flex items-start space-x-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{ch}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benchmark Plan & Impact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                    Benchmark Datasets & Metrics
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{deepDiveData.benchmarkPlan}</p>
                </div>
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200 space-y-1">
                  <span className="font-bold text-blue-900 text-[11px] uppercase tracking-wider block">
                    Expected Scientific Impact
                  </span>
                  <p className="text-xs text-blue-900 leading-relaxed">{deepDiveData.potentialImpact}</p>
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
