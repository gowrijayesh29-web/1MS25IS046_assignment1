import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TopicSearchBar } from './components/TopicSearchBar';
import { AgentProgressTracker } from './components/AgentProgressTracker';
import { InteractiveMindmap } from './components/InteractiveMindmap';
import { StepSubQuestions } from './components/StepSubQuestions';
import { StepPapersAuthors } from './components/StepPapersAuthors';
import { StepFindings } from './components/StepFindings';
import { StepGaps } from './components/StepGaps';
import { DeepDiveModal } from './components/DeepDiveModal';
import { FollowUpChatDrawer } from './components/FollowUpChatDrawer';
import { SavedHistoryModal } from './components/SavedHistoryModal';
import { ResearchAgentAnalysis, DeepDiveResponse } from './types/research';
import { AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react';

const STORAGE_KEY = 'scholarpulse_history_v1';

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<ResearchAgentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRunningStep, setCurrentRunningStep] = useState(1);
  const [activeTab, setActiveTab] = useState(0); // 0: Overview, 1: SubQuestions, 2: Papers, 3: Findings, 4: Gaps
  const [selectedSubQuestionFilter, setSelectedSubQuestionFilter] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Deep Dive State
  const [deepDiveState, setDeepDiveState] = useState<{
    isOpen: boolean;
    data: DeepDiveResponse | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    data: null,
    isLoading: false,
  });

  // Saved Analyses in LocalStorage
  const [savedAnalyses, setSavedAnalyses] = useState<ResearchAgentAnalysis[]>([]);

  // Load initial history and default example
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAnalyses(parsed);
          setCurrentAnalysis(parsed[0]);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse localStorage history:', e);
    }

    // Default: fetch the benchmark "Federated Learning" example from backend
    handleRunAnalysis('Federated Learning', 'Comprehensive Academic Review', 'all_time');
  }, []);

  const saveAnalysisToHistory = (analysis: ResearchAgentAnalysis) => {
    setSavedAnalyses((prev) => {
      const filtered = prev.filter((item) => item.topic.toLowerCase() !== analysis.topic.toLowerCase());
      const updated = [analysis, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      return updated;
    });
  };

  const handleRunAnalysis = async (topic: string, lens: string, timeHorizon: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setCurrentRunningStep(1);

    // Step simulation ticker for visual feedback while LLM generates
    const interval = setInterval(() => {
      setCurrentRunningStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch('/api/research/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, lens, timeHorizon }),
      });

      const data = await res.json();
      clearInterval(interval);

      if (data.success && data.data) {
        const analysis: ResearchAgentAnalysis = data.data;
        setCurrentAnalysis(analysis);
        saveAnalysisToHistory(analysis);
        setCurrentRunningStep(4);
      } else {
        throw new Error(data.error || 'Failed to complete literature analysis.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while running the Research Paper Agent.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggerDeepDive = async (
    targetTitle: string,
    targetType: 'sub_question' | 'gap' | 'paper',
    extraDetails: string
  ) => {
    if (!currentAnalysis) return;

    setDeepDiveState({
      isOpen: true,
      data: null,
      isLoading: true,
    });

    try {
      const res = await fetch('/api/research/deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetTitle,
          targetType,
          contextTopic: currentAnalysis.topic,
          extraDetails,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setDeepDiveState({
          isOpen: true,
          data: data.data,
          isLoading: false,
        });
      } else {
        throw new Error(data.error || 'Failed to formulate deep dive proposal.');
      }
    } catch (err: any) {
      console.error('Deep dive error:', err);
      setDeepDiveState({
        isOpen: true,
        data: null,
        isLoading: false,
      });
      alert(`Could not generate proposal: ${err.message}`);
    }
  };

  const handleFilterPapersForQuestion = (subQuestionId: string) => {
    setSelectedSubQuestionFilter(subQuestionId);
    setActiveTab(2); // Switch to Papers tab
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedAnalyses((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setSavedAnalyses([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Header */}
      <Header
        currentAnalysis={currentAnalysis}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeStepTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 2) setSelectedSubQuestionFilter(null);
        }}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-rose-800 text-xs sm:text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="font-semibold text-rose-900 hover:underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Search / Topic Formulation Bar */}
        <TopicSearchBar
          onSearch={handleRunAnalysis}
          isLoading={isLoading}
          currentTopic={currentAnalysis?.topic}
        />

        {/* Agent Execution Pipeline Tracker */}
        <AgentProgressTracker
          isLoading={isLoading}
          currentStep={currentRunningStep}
          thinkingSteps={currentAnalysis?.thinkingSteps}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 2) setSelectedSubQuestionFilter(null);
          }}
        />

        {/* Tab Navigation (Responsive Bar) */}
        {currentAnalysis && (
          <div className="flex items-center space-x-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab(0)}
              className={`py-2 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                activeTab === 0
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Overview Map
            </button>
            <button
              onClick={() => {
                setActiveTab(1);
                setSelectedSubQuestionFilter(null);
              }}
              className={`py-2 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 1
                  ? 'border-blue-600 text-blue-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">1</span>
              <span>Sub-Questions ({currentAnalysis.step1SubQuestions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab(2)}
              className={`py-2 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 2
                  ? 'border-indigo-600 text-indigo-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px]">2</span>
              <span>Papers & Authors ({currentAnalysis.step2Papers.length} / {currentAnalysis.step2KeyAuthors.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab(3);
                setSelectedSubQuestionFilter(null);
              }}
              className={`py-2 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 3
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px]">3</span>
              <span>Findings & Tradeoffs</span>
            </button>
            <button
              onClick={() => {
                setActiveTab(4);
                setSelectedSubQuestionFilter(null);
              }}
              className={`py-2 px-3.5 border-b-2 transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                activeTab === 4
                  ? 'border-amber-600 text-amber-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="h-4 w-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px]">4</span>
              <span>Research Gaps ({currentAnalysis.step4Gaps.length})</span>
            </button>
          </div>
        )}

        {/* Content by Active Tab */}
        {currentAnalysis && (
          <div>
            {activeTab === 0 && (
              <InteractiveMindmap
                analysis={currentAnalysis}
                onSelectTab={setActiveTab}
                onDeepDive={handleTriggerDeepDive}
              />
            )}

            {activeTab === 1 && (
              <StepSubQuestions
                subQuestions={currentAnalysis.step1SubQuestions}
                onDeepDive={handleTriggerDeepDive}
                onFilterPapersForQuestion={handleFilterPapersForQuestion}
              />
            )}

            {activeTab === 2 && (
              <StepPapersAuthors
                papers={currentAnalysis.step2Papers}
                authors={currentAnalysis.step2KeyAuthors}
                selectedSubQuestionId={selectedSubQuestionFilter}
                onClearSubQuestionFilter={() => setSelectedSubQuestionFilter(null)}
                onDeepDive={handleTriggerDeepDive}
              />
            )}

            {activeTab === 3 && (
              <StepFindings
                findings={currentAnalysis.step3Findings}
                topic={currentAnalysis.topic}
              />
            )}

            {activeTab === 4 && (
              <StepGaps
                gaps={currentAnalysis.step4Gaps}
                onDeepDive={handleTriggerDeepDive}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-medium text-slate-700">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <span>ScholarPulse • Autonomous Step-by-Step Research Paper Agent</span>
          </div>
          <p className="text-slate-400">
            Empowered by Gemini 3.8 Flash • Real-time synthesis, arXiv & DOI links, BibTeX exports
          </p>
        </div>
      </footer>

      {/* Deep Dive Modal */}
      <DeepDiveModal
        isOpen={deepDiveState.isOpen}
        onClose={() => setDeepDiveState({ ...deepDiveState, isOpen: false })}
        deepDiveData={deepDiveState.data}
        isLoading={deepDiveState.isLoading}
      />

      {/* Follow Up Grounded Chat Drawer */}
      <FollowUpChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        analysis={currentAnalysis}
      />

      {/* Saved History Modal */}
      <SavedHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedAnalyses={savedAnalyses}
        onSelectAnalysis={(item) => {
          setCurrentAnalysis(item);
          setActiveTab(0);
        }}
        onDeleteAnalysis={handleDeleteHistoryItem}
        onClearAll={handleClearAllHistory}
      />
    </div>
  );
}
