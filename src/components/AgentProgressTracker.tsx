import React, { useState } from 'react';
import { CheckCircle2, Loader2, Brain, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';

interface AgentProgressTrackerProps {
  isLoading: boolean;
  currentStep: number;
  thinkingSteps?: {
    step1Reasoning: string;
    step2Reasoning: string;
    step3Reasoning: string;
    step4Reasoning: string;
  };
  activeTab: number;
  onSelectTab: (tab: number) => void;
}

export const AgentProgressTracker: React.FC<AgentProgressTrackerProps> = ({
  isLoading,
  currentStep,
  thinkingSteps,
  activeTab,
  onSelectTab,
}) => {
  const [isReasoningOpen, setIsReasoningOpen] = useState(false);

  const steps = [
    {
      num: 1,
      name: 'Sub-Questions',
      subtitle: 'Deconstruct domain problem space',
      color: 'blue',
      reasoning: thinkingSteps?.step1Reasoning,
    },
    {
      num: 2,
      name: 'Papers & Authors',
      subtitle: 'Identify seminal literature & PIs',
      color: 'indigo',
      reasoning: thinkingSteps?.step2Reasoning,
    },
    {
      num: 3,
      name: 'Summary of Findings',
      subtitle: 'Synthesize consensus & tradeoffs',
      color: 'emerald',
      reasoning: thinkingSteps?.step3Reasoning,
    },
    {
      num: 4,
      name: 'Research Gaps',
      subtitle: 'Detect blind spots & hypotheses',
      color: 'amber',
      reasoning: thinkingSteps?.step4Reasoning,
    },
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
      {/* Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Brain className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <span>Agent Execution Pipeline</span>
              {isLoading && (
                <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Autonomous Reasoning Active</span>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500">
              {isLoading
                ? 'Deconstructing academic domain across 4 sequential analytical phases...'
                : 'Literature synthesis complete. Click any step below to navigate the findings.'}
            </p>
          </div>
        </div>

        {/* Toggle Internal Reasoning */}
        {thinkingSteps && (
          <button
            type="button"
            onClick={() => setIsReasoningOpen(!isReasoningOpen)}
            className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Agent Chain-of-Thought</span>
            {isReasoningOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>

      {/* 4 Interactive Step Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isDone = !isLoading || currentStep > step.num;
          const isCurrent = isLoading && currentStep === step.num;
          const isSelected = activeTab === step.num;

          return (
            <div
              key={step.num}
              onClick={() => {
                if (!isLoading) onSelectTab(step.num);
              }}
              className={`p-3.5 rounded-xl border transition-all text-left ${
                !isLoading ? 'cursor-pointer hover:border-blue-400 hover:shadow-xs' : ''
              } ${
                isSelected
                  ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-100'
                  : 'bg-slate-50/60 border-slate-200/80'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Step 0{step.num}
                </span>
                {isCurrent ? (
                  <span className="flex items-center space-x-1 text-[11px] font-semibold text-blue-600">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Analyzing</span>
                  </span>
                ) : isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-300" />
                )}
              </div>

              <div className="font-semibold text-sm text-slate-900 flex items-center justify-between">
                <span>{step.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{step.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Expandable Chain of Thought Drawer */}
      {isReasoningOpen && thinkingSteps && (
        <div className="mt-3 p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-400 pb-2 border-b border-slate-800 font-sans text-xs font-semibold">
            <Brain className="h-4 w-4 text-sky-400" />
            <span>Agent Internal Reasoning Log (Step-by-Step Chain of Thought):</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-sky-400 font-bold block mb-1">Phase 1: Sub-Question Decomposition</span>
              <p className="text-slate-300 font-sans">{thinkingSteps.step1Reasoning}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">Phase 2: Landmark Papers & PI Attribution</span>
              <p className="text-slate-300 font-sans">{thinkingSteps.step2Reasoning}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-emerald-400 font-bold block mb-1">Phase 3: Cross-Paper Synthesis & Tradeoffs</span>
              <p className="text-slate-300 font-sans">{thinkingSteps.step3Reasoning}</p>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">Phase 4: Open Gaps & Research Formulation</span>
              <p className="text-slate-300 font-sans">{thinkingSteps.step4Reasoning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
