import React, { useState } from 'react';
import { ResearchGap } from '../types/research';
import { AlertCircle, Sparkles, Compass, Lightbulb, Target, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

interface StepGapsProps {
  gaps: ResearchGap[];
  onDeepDive: (title: string, type: 'gap', details: string) => void;
}

export const StepGaps: React.FC<StepGapsProps> = ({ gaps, onDeepDive }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = filterType === 'all'
    ? gaps
    : gaps.filter(g => g.gapType === filterType);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical Open Problem':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High Impact Opportunity':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getGapTypeIcon = (type: string) => {
    switch (type) {
      case 'Robustness & Security':
        return <ShieldAlert className="h-4 w-4 text-rose-600" />;
      case 'Systems & Scalability':
        return <Cpu className="h-4 w-4 text-emerald-600" />;
      case 'Theoretical Bottleneck':
        return <Target className="h-4 w-4 text-purple-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">4</span>
            <span>Step 4 of 4: Research Frontier</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Open Research Gaps & Hypotheses</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Critical bottlenecks where existing literature fails, accompanied by actionable research angles and publication-grade hypotheses.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs">
          {['all', 'Theoretical Bottleneck', 'Systems & Scalability', 'Robustness & Security', 'Evaluation & Benchmark Gap'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                filterType === t
                  ? 'bg-white text-amber-800 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'all' ? 'All Gaps' : t.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Gaps Cards Grid */}
      <div className="space-y-5">
        {filtered.map((gap, idx) => (
          <div
            key={gap.id || idx}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-md transition-all space-y-4"
          >
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-md bg-slate-100">
                  {getGapTypeIcon(gap.gapType)}
                </span>
                <span className="text-xs font-bold text-slate-700">
                  {gap.gapType}
                </span>
                <span className="text-slate-300">•</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getSeverityBadge(gap.severity)}`}>
                  {gap.severity}
                </span>
              </div>

              <span className="text-xs font-mono text-slate-400">
                Gap #{idx + 1}
              </span>
            </div>

            {/* Gap Title */}
            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {gap.title}
            </h3>

            {/* Gap Description */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {gap.description}
            </p>

            {/* Why Existing Methods Fail */}
            <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 text-xs space-y-1">
              <span className="font-bold text-rose-900 flex items-center space-x-1.5 uppercase tracking-wider text-[10px]">
                <AlertCircle className="h-3.5 w-3.5 text-rose-600" />
                <span>Why Existing Methods Fail:</span>
              </span>
              <p className="text-rose-900/90 leading-relaxed">
                {gap.whyExistingMethodsFail}
              </p>
            </div>

            {/* Actionable Research Angle & Hypothesis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100/80 space-y-1">
                <span className="font-bold text-blue-900 flex items-center space-x-1.5 uppercase tracking-wider text-[10px]">
                  <Compass className="h-3.5 w-3.5 text-blue-600" />
                  <span>Actionable Research Angle:</span>
                </span>
                <p className="text-blue-900/90 leading-relaxed">
                  {gap.actionableResearchAngle}
                </p>
              </div>

              <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-100/80 space-y-1">
                <span className="font-bold text-amber-900 flex items-center space-x-1.5 uppercase tracking-wider text-[10px]">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  <span>Recommended Testable Hypothesis:</span>
                </span>
                <p className="text-amber-900/90 leading-relaxed font-serif italic">
                  "{gap.recommendedHypothesis}"
                </p>
              </div>
            </div>

            {/* Proposal Trigger Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Turn this gap into a publication outline or thesis proposal
              </span>
              <button
                type="button"
                onClick={() => onDeepDive(gap.title, 'gap', `${gap.description}\n${gap.actionableResearchAngle}`)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Research Proposal</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
