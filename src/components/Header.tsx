import React, { useState } from 'react';
import { BookOpen, Sparkles, Download, History, MessageSquare, FileText, Check, ChevronDown, Printer } from 'lucide-react';
import { ResearchAgentAnalysis } from '../types/research';
import { generateMarkdownReport, generateBibTeX, downloadTextFile } from '../utils/exportUtils';

interface HeaderProps {
  currentAnalysis: ResearchAgentAnalysis | null;
  onOpenHistory: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeStepTab: number;
  onSelectTab: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAnalysis,
  onOpenHistory,
  onToggleChat,
  isChatOpen,
  activeStepTab,
  onSelectTab,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  const handleCopyMarkdown = () => {
    if (!currentAnalysis) return;
    const md = generateMarkdownReport(currentAnalysis);
    navigator.clipboard.writeText(md);
    setCopiedNotification('Markdown copied!');
    setTimeout(() => setCopiedNotification(null), 2500);
    setShowExportMenu(false);
  };

  const handleDownloadMarkdown = () => {
    if (!currentAnalysis) return;
    const md = generateMarkdownReport(currentAnalysis);
    const slug = currentAnalysis.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(`${slug}-literature-review.md`, md, 'text/markdown');
    setShowExportMenu(false);
  };

  const handleDownloadBibTeX = () => {
    if (!currentAnalysis) return;
    const bib = generateBibTeX(currentAnalysis);
    const slug = currentAnalysis.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(`${slug}-citations.bib`, bib, 'application/x-bibtex');
    setShowExportMenu(false);
  };

  const handleDownloadJSON = () => {
    if (!currentAnalysis) return;
    const slug = currentAnalysis.topic.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    downloadTextFile(`${slug}-analysis.json`, JSON.stringify(currentAnalysis, null, 2), 'application/json');
    setShowExportMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowExportMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab(0)}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">ScholarPulse</span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Research Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Step-by-Step Autonomous Literature Deconstruction</p>
            </div>
          </div>

          {/* Stepper Navigation Pills (Visible when analysis is loaded) */}
          {currentAnalysis && (
            <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium">
              <button
                onClick={() => onSelectTab(0)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  activeStepTab === 0
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Overview Map
              </button>
              <button
                onClick={() => onSelectTab(1)}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeStepTab === 1
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Sub-Questions</span>
              </button>
              <button
                onClick={() => onSelectTab(2)}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeStepTab === 2
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Papers & Authors</span>
              </button>
              <button
                onClick={() => onSelectTab(3)}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeStepTab === 3
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>Summary Findings</span>
              </button>
              <button
                onClick={() => onSelectTab(4)}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                  activeStepTab === 4
                    ? 'bg-white text-amber-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Research Gaps</span>
              </button>
            </nav>
          )}

          {/* Action Tools */}
          <div className="flex items-center space-x-2">
            {/* Saved History */}
            <button
              onClick={onOpenHistory}
              title="View Analyzed History"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center text-xs font-medium space-x-1"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </button>

            {/* Export Menu */}
            {currentAnalysis && (
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      Export Dossier
                    </div>
                    <button
                      onClick={handleCopyMarkdown}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                    >
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span>Copy Full Markdown</span>
                    </button>
                    <button
                      onClick={handleDownloadMarkdown}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                    >
                      <Download className="h-4 w-4 text-blue-600" />
                      <span>Download .MD Report</span>
                    </button>
                    <button
                      onClick={handleDownloadBibTeX}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                    >
                      <Download className="h-4 w-4 text-indigo-600" />
                      <span>Download BibTeX (.bib)</span>
                    </button>
                    <button
                      onClick={handleDownloadJSON}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                    >
                      <Download className="h-4 w-4 text-emerald-600" />
                      <span>Download Analysis (.json)</span>
                    </button>
                    <div className="border-t border-slate-100 my-1" />
                    <button
                      onClick={handlePrint}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                    >
                      <Printer className="h-4 w-4 text-slate-500" />
                      <span>Print / PDF Version</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Ask Agent Drawer Toggle */}
            {currentAnalysis && (
              <button
                onClick={onToggleChat}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  isChatOpen
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Ask Agent</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Copy Toast */}
      {copiedNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center space-x-2 text-xs font-medium animate-fade-in">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{copiedNotification}</span>
        </div>
      )}
    </header>
  );
};
