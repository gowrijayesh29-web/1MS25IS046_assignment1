import React from 'react';
import { ResearchAgentAnalysis } from '../types/research';
import { X, Trash2, ArrowRight, History, Calendar, Layers } from 'lucide-react';

interface SavedHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedAnalyses: ResearchAgentAnalysis[];
  onSelectAnalysis: (analysis: ResearchAgentAnalysis) => void;
  onDeleteAnalysis: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const SavedHistoryModal: React.FC<SavedHistoryModalProps> = ({
  isOpen,
  onClose,
  savedAnalyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Research History & Saved Dossiers</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1 text-xs sm:text-sm">
          {savedAnalyses.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History className="h-8 w-8 mx-auto text-slate-300" />
              <p>No past research dossiers stored yet.</p>
              <p className="text-xs text-slate-400">Run an analysis on any topic to save it to your local library.</p>
            </div>
          ) : (
            savedAnalyses.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectAnalysis(item);
                  onClose();
                }}
                className="p-4 bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 rounded-xl cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 group-hover:text-blue-700 text-sm">
                      {item.topic}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {item.lens.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>
                    <span>•</span>
                    <span>{item.step2Papers.length} papers</span>
                    <span>•</span>
                    <span>{item.step4Gaps.length} gaps</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={(e) => onDeleteAnalysis(item.id, e)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {savedAnalyses.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-medium"
            >
              Clear All Saved Dossiers
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
