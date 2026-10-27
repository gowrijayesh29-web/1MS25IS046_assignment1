import React, { useState } from 'react';
import { Search, Sparkles, SlidersHorizontal, ArrowRight, Loader2, BookOpen, Layers } from 'lucide-react';

interface TopicSearchBarProps {
  onSearch: (topic: string, lens: string, timeHorizon: string) => void;
  isLoading: boolean;
  currentTopic?: string;
}

const CURATED_TOPICS = [
  {
    title: 'Federated Learning',
    badge: 'Example Prompt',
    lens: 'Comprehensive Academic Review',
    desc: 'Decentralized optimization, non-IID data skew, differential privacy, FedAvg/FedProx.'
  },
  {
    title: 'Mechanistic Interpretability in LLMs',
    badge: 'Hot Frontier',
    lens: 'Theoretical Foundations & Proofs',
    desc: 'Induction heads, superposition, circuit discovery, sparse autoencoders (SAEs).'
  },
  {
    title: 'Diffusion Models for Protein Design',
    badge: 'Bio-AI',
    lens: 'Systems & Scalability Engineering',
    desc: 'De novo backbone generation, RFdiffusion, equivariant SE(3) representations.'
  },
  {
    title: 'Retrieval-Augmented Generation (RAG) Hallucination Mitigation',
    badge: 'Systems',
    lens: 'Comprehensive Academic Review',
    desc: 'Faithfulness metrics, dense retrieval indexing, iterative self-correction.'
  },
  {
    title: 'Post-Quantum Cryptography',
    badge: 'Security',
    lens: 'Theoretical Foundations & Proofs',
    desc: 'Lattice-based cryptography, Learning With Errors (LWE), Kyber, Dilithium.'
  }
];

export const TopicSearchBar: React.FC<TopicSearchBarProps> = ({
  onSearch,
  isLoading,
  currentTopic = '',
}) => {
  const [topicInput, setTopicInput] = useState(currentTopic);
  const [selectedLens, setSelectedLens] = useState('Comprehensive Academic Review');
  const [timeHorizon, setTimeHorizon] = useState('all_time');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicInput.trim() || isLoading) return;
    onSearch(topicInput.trim(), selectedLens, timeHorizon);
  };

  const handleSelectCurated = (topic: string, lens: string) => {
    setTopicInput(topic);
    setSelectedLens(lens);
    onSearch(topic, lens, timeHorizon);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step-by-Step Agent Workflow Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-slate-500">
          <div className="flex items-center space-x-1.5 font-medium text-slate-700">
            <Layers className="h-4 w-4 text-blue-600" />
            <span>Agent 4-Step Pipeline:</span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
            <span className="text-blue-700 font-semibold">(1) Sub-questions</span>
            <span>→</span>
            <span className="text-indigo-700 font-semibold">(2) Papers & Authors</span>
            <span>→</span>
            <span className="text-emerald-700 font-semibold">(3) Summary</span>
            <span>→</span>
            <span className="text-amber-700 font-semibold">(4) Gaps</span>
          </div>
        </div>

        {/* Search Bar Input */}
        <div className="relative flex items-center">
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter any research field or concept (e.g. 'Federated Learning', 'State Space Models (Mamba)', 'Quantum Error Correction')..."
            disabled={isLoading}
            className="w-full pl-12 pr-32 py-3.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                showAdvanced ? 'bg-slate-200 text-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Configure Research Lens"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
            <button
              type="submit"
              disabled={!topicInput.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition-all flex items-center space-x-1.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </>
              ) : (
                <>
                  <span>Run Agent</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Advanced Configuration Panel */}
        {showAdvanced && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Research Analysis Lens:
              </label>
              <select
                value={selectedLens}
                onChange={(e) => setSelectedLens(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Comprehensive Academic Review">Comprehensive Academic Review (All Dimensions)</option>
                <option value="Dissertation & Thesis Gaps">Dissertation & Thesis Gaps (Focus on High-Impact Unsolved Problems)</option>
                <option value="Theoretical Foundations & Proofs">Theoretical Foundations & Algorithmic Bounds</option>
                <option value="Systems & Scalability Engineering">Systems, Memory & Hardware Scalability</option>
                <option value="Security, Privacy & Robustness">Security, Privacy & Adversarial Robustness</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Literature Horizon:
              </label>
              <select
                value={timeHorizon}
                onChange={(e) => setTimeHorizon(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all_time">All-Time Milestones (Seminal Pioneers to Present)</option>
                <option value="recent_breakthroughs">Recent Frontiers (Last 3-4 Years)</option>
                <option value="foundations_only">Historical Seminal Foundations Only</option>
              </select>
            </div>
          </div>
        )}

        {/* Curated Pre-loaded Topics */}
        <div className="pt-2">
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span className="font-semibold text-slate-700">Quick-Try Benchmark Topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {CURATED_TOPICS.map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => handleSelectCurated(item.title, item.lens)}
                disabled={isLoading}
                className="group text-left px-3 py-2 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                    {item.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-200/80 text-slate-700 group-hover:bg-blue-100 group-hover:text-blue-800">
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
