import React, { useState } from 'react';
import { SubQuestion } from '../types/research';
import { HelpCircle, Sparkles, ArrowRight, Tag, ShieldCheck, Cpu, Database, Network } from 'lucide-react';

interface StepSubQuestionsProps {
  subQuestions: SubQuestion[];
  onDeepDive: (title: string, type: 'sub_question', details: string) => void;
  onFilterPapersForQuestion: (subQuestionId: string) => void;
}

export const StepSubQuestions: React.FC<StepSubQuestionsProps> = ({
  subQuestions,
  onDeepDive,
  onFilterPapersForQuestion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'foundational', label: 'Foundational & Theory' },
    { id: 'algorithmic', label: 'Algorithmic Innovations' },
    { id: 'systems', label: 'Systems & Infrastructure' },
    { id: 'security_privacy', label: 'Security & Privacy' },
    { id: 'frontiers', label: 'Emerging Frontiers' },
  ];

  const filtered = selectedCategory === 'all'
    ? subQuestions
    : subQuestions.filter(q => q.category === selectedCategory);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'foundational':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'algorithmic':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'systems':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'security_privacy':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'frontiers':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'Crucial':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'High':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <span className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">1</span>
            <span>Step 1 of 4: Domain Decomposition</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Core Sub-Questions Breakdown</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            The agent decomposes the broad topic into fundamental sub-questions spanning mathematical formulation, systems bottlenecks, privacy trade-offs, and frontier applications.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedCategory === c.id
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Questions Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sq, idx) => (
          <div
            key={sq.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Priority Row */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getCategoryColor(sq.category)}`}>
                  {sq.category.replace('_', ' ')}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(sq.priority)}`}>
                  {sq.priority} Priority
                </span>
              </div>

              {/* Sub-Question Title */}
              <h3 className="text-base font-bold text-slate-900 leading-snug mb-2.5">
                {sq.question}
              </h3>

              {/* Scientific Rationale */}
              <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Scientific Rationale:
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {sq.rationale}
                </p>
              </div>

              {/* Key Facets */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Key Investigation Facets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {sq.keyFacets.map((facet, fIdx) => (
                    <span
                      key={fIdx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                    >
                      {facet}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => onFilterPapersForQuestion(sq.id)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
              >
                <span>View Linked Papers</span>
                <ArrowRight className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => onDeepDive(sq.question, 'sub_question', sq.rationale)}
                className="text-xs font-semibold px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors flex items-center space-x-1"
              >
                <Sparkles className="h-3 w-3" />
                <span>Deep Dive Proposal</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
