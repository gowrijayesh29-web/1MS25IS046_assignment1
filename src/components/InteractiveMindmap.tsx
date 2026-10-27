import React from 'react';
import { ResearchAgentAnalysis } from '../types/research';
import { Layers, ArrowDown, BookOpen, Users, BarChart3, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

interface InteractiveMindmapProps {
  analysis: ResearchAgentAnalysis;
  onSelectTab: (tab: number) => void;
  onDeepDive: (title: string, type: 'sub_question' | 'gap' | 'paper', details: string) => void;
}

export const InteractiveMindmap: React.FC<InteractiveMindmapProps> = ({
  analysis,
  onSelectTab,
  onDeepDive,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
            Deconstructed Conceptual Flow
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(analysis.timestamp).toLocaleDateString()} • {analysis.lens}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {analysis.topic}
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed font-serif">
          {analysis.step3Findings.executiveSynthesis.slice(0, 280)}...
        </p>

        {/* Quick Stats Banner */}
        <div className="mt-6 pt-5 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => onSelectTab(1)}>
            <span className="block text-xl font-bold text-sky-400">{analysis.step1SubQuestions.length}</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Sub-Questions</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => onSelectTab(2)}>
            <span className="block text-xl font-bold text-indigo-400">{analysis.step2Papers.length}</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Landmark Papers</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => onSelectTab(2)}>
            <span className="block text-xl font-bold text-purple-400">{analysis.step2KeyAuthors.length}</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Seminal Authors</span>
          </div>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 cursor-pointer hover:bg-slate-800 transition-colors" onClick={() => onSelectTab(4)}>
            <span className="block text-xl font-bold text-amber-400">{analysis.step4Gaps.length}</span>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Identified Gaps</span>
          </div>
        </div>
      </div>

      {/* Interactive 4-Stage Mindmap Canvas */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Interactive 4-Step Literature Pipeline</span>
          </h2>
          <span className="text-xs text-slate-400">Click any card to explore the full step section</span>
        </div>

        {/* Phase 1: Sub-Questions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
              <h3 className="text-sm font-bold text-slate-800">Phase 1: Sub-Question Decomposition</h3>
            </div>
            <button
              onClick={() => onSelectTab(1)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
            >
              <span>Explore All ({analysis.step1SubQuestions.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.step1SubQuestions.slice(0, 3).map((sq) => (
              <div
                key={sq.id}
                onClick={() => onSelectTab(1)}
                className="p-3.5 bg-blue-50/40 hover:bg-blue-50/80 border border-blue-200/80 rounded-xl cursor-pointer transition-all hover:shadow-xs group"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  {sq.category.replace('_', ' ')}
                </span>
                <p className="text-xs font-semibold text-slate-900 mt-2 line-clamp-2 group-hover:text-blue-900">
                  {sq.question}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-100/60 text-[11px] text-slate-500">
                  <span>Priority: {sq.priority}</span>
                  <span className="text-blue-600 font-medium">View details →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Connector arrow */}
        <div className="flex justify-center text-slate-300">
          <ArrowDown className="h-5 w-5" />
        </div>

        {/* Phase 2: Papers & Authors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
              <h3 className="text-sm font-bold text-slate-800">Phase 2: Landmark Literature & Key Authors</h3>
            </div>
            <button
              onClick={() => onSelectTab(2)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <span>View All Papers & Authors</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Top 2 papers */}
            {analysis.step2Papers.slice(0, 2).map((paper) => (
              <div
                key={paper.id}
                onClick={() => onSelectTab(2)}
                className="p-3.5 bg-indigo-50/30 hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl cursor-pointer transition-all hover:shadow-xs group"
              >
                <div className="flex items-center justify-between text-[11px] mb-1 text-slate-500">
                  <span className="font-semibold text-indigo-700">{paper.venue} ({paper.year})</span>
                  <span>{paper.paperType}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                  {paper.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                  {paper.authors.join(', ')}
                </p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-serif bg-white/70 p-2 rounded-lg border border-indigo-100">
                  {paper.abstractSummary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Connector arrow */}
        <div className="flex justify-center text-slate-300">
          <ArrowDown className="h-5 w-5" />
        </div>

        {/* Phase 3: SOTA Findings & Tradeoffs */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">3</span>
              <h3 className="text-sm font-bold text-slate-800">Phase 3: SOTA Consensus & Comparative Tradeoffs</h3>
            </div>
            <button
              onClick={() => onSelectTab(3)}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>View Full Matrix</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="p-4 bg-emerald-50/30 border border-emerald-200/80 rounded-xl space-y-3">
            <div className="flex flex-wrap gap-2 text-xs">
              {analysis.step3Findings.tradeoffsMatrix.map((m, idx) => (
                <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs font-medium text-slate-800">
                  <span className="font-bold text-emerald-800">{m.methodName}</span>: {m.tradeoffs}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Connector arrow */}
        <div className="flex justify-center text-slate-300">
          <ArrowDown className="h-5 w-5" />
        </div>

        {/* Phase 4: Research Gaps */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="h-6 w-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">4</span>
              <h3 className="text-sm font-bold text-slate-800">Phase 4: Open Gaps & Research Proposals</h3>
            </div>
            <button
              onClick={() => onSelectTab(4)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 flex items-center space-x-1"
            >
              <span>Explore All Gaps ({analysis.step4Gaps.length})</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.step4Gaps.slice(0, 2).map((gap) => (
              <div
                key={gap.id}
                className="p-4 bg-amber-50/40 border border-amber-200/80 rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {gap.gapType}
                  </span>
                  <span className="text-xs font-semibold text-amber-700">{gap.severity}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{gap.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{gap.description}</p>
                <button
                  type="button"
                  onClick={() => onDeepDive(gap.title, 'gap', gap.description)}
                  className="w-full mt-2 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Proposal</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
