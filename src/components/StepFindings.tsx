import React, { useState } from 'react';
import { ResearchFindings } from '../types/research';
import { BarChart3, Scale, Code2, Check, Copy, Sparkles, BookOpen, Layers } from 'lucide-react';

interface StepFindingsProps {
  findings: ResearchFindings;
  topic: string;
}

export const StepFindings: React.FC<StepFindingsProps> = ({ findings, topic }) => {
  const [copiedMath, setCopiedMath] = useState(false);

  const handleCopyMath = () => {
    if (!findings.theoreticalFormulation) return;
    navigator.clipboard.writeText(findings.theoreticalFormulation);
    setCopiedMath(true);
    setTimeout(() => setCopiedMath(false), 2000);
  };

  const getMaturityColor = (mat: string) => {
    switch (mat) {
      case 'Consolidated Foundations with Application Bottlenecks':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Maturing with Open Hard Problems':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</span>
            <span>Step 3 of 4: Synthesis of Literature</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Summary of Findings & Tradeoffs</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            State-of-the-art consensus, core mathematical formulation, empirical benchmarks, and comparative method trade-offs matrix.
          </p>
        </div>

        {findings.stateOfArtMaturity && (
          <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold self-start md:self-auto ${getMaturityColor(findings.stateOfArtMaturity)}`}>
            <span>Maturity: {findings.stateOfArtMaturity}</span>
          </div>
        )}
      </div>

      {/* Executive Synthesis Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Executive Synthesis</h3>
        </div>
        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-serif">
          {findings.executiveSynthesis}
        </p>
      </div>

      {/* Theoretical / Mathematical Formulation */}
      {findings.theoreticalFormulation && (
        <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 font-mono uppercase tracking-wider">
              <Code2 className="h-4 w-4" />
              <span>Core Mathematical / Algorithmic Formulation</span>
            </div>
            <button
              onClick={handleCopyMath}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors font-sans"
            >
              {copiedMath ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Formulation</span>
                </>
              )}
            </button>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs sm:text-sm text-sky-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {findings.theoreticalFormulation}
          </div>
        </div>
      )}

      {/* Thematic Findings Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
          <Layers className="h-4 w-4 text-emerald-600" />
          <span>Thematic Consensus & Empirical Validation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {findings.thematicFindings.map((tf, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Theme 0{idx + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 mb-2 leading-snug">
                  {tf.topic}
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-0.5">Scientific Consensus:</span>
                    <p className="text-slate-600 leading-relaxed">{tf.consensus}</p>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-100/60">
                    <span className="font-bold text-blue-800 block mb-0.5">Key Mechanisms:</span>
                    <p className="text-blue-900/90 leading-relaxed">{tf.keyMechanisms}</p>
                  </div>

                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
                    <span className="font-bold text-emerald-800 block mb-0.5">Empirical Evidence:</span>
                    <p className="text-emerald-900/90 leading-relaxed">{tf.empiricalEvidence}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparative Trade-offs Matrix Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center space-x-2">
          <Scale className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Comparative Methods & Trade-offs Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3.5 rounded-l-lg">Algorithm / Method</th>
                <th className="py-3 px-3.5">Core Strengths</th>
                <th className="py-3 px-3.5">Known Limitations</th>
                <th className="py-3 px-3.5">Trade-off Dynamics</th>
                <th className="py-3 px-3.5 rounded-r-lg">Ideal Application Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {findings.tradeoffsMatrix.map((item, mIdx) => (
                <tr key={mIdx} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-3.5 font-bold text-slate-900 align-top whitespace-nowrap">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                      {item.methodName}
                    </span>
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-700 align-top leading-relaxed">
                    <span className="text-emerald-700 font-semibold">• </span>
                    {item.strengths}
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-600 align-top leading-relaxed">
                    <span className="text-rose-600 font-semibold">• </span>
                    {item.limitations}
                  </td>
                  <td className="py-3.5 px-3.5 text-slate-700 align-top leading-relaxed">
                    {item.tradeoffs}
                  </td>
                  <td className="py-3.5 px-3.5 text-blue-900 font-medium align-top leading-relaxed bg-blue-50/30 rounded-r-lg">
                    {item.idealUseCase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
