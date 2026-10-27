import React, { useState, useRef, useEffect } from 'react';
import { ResearchAgentAnalysis } from '../types/research';
import { X, Send, Sparkles, MessageSquare, Loader2, Bot, User, CornerDownLeft } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

interface FollowUpChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ResearchAgentAnalysis | null;
}

export const FollowUpChatDrawer: React.FC<FollowUpChatDrawerProps> = ({
  isOpen,
  onClose,
  analysis,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting when analysis changes
  useEffect(() => {
    if (analysis) {
      setMessages([
        {
          id: 'welcome',
          sender: 'agent',
          text: `Hello! I have deconstructed **${analysis.topic}** into sub-questions, landmark literature, state-of-the-art findings, and open gaps. How can I assist your investigation further?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [analysis?.topic]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending || !analysis) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const res = await fetch('/api/research/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: analysis.topic,
          message: text.trim(),
          currentAnalysisSummary: {
            topic: analysis.topic,
            subQuestions: analysis.step1SubQuestions.map((q) => q.question),
            landmarkPapers: analysis.step2Papers.map((p) => `${p.title} (${p.year}) - ${p.keyInnovation}`),
            tradeoffs: analysis.step3Findings.tradeoffsMatrix,
            gaps: analysis.step4Gaps.map((g) => `${g.title}: ${g.description}`),
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            sender: 'agent',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(data.error || 'Failed to get agent reply');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: `⚠️ Apologies, could not complete response: ${err.message}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const suggestedQuestions = [
    `How does the top landmark paper differ from prior baselines?`,
    `Which research gap is best suited for an ICML/NeurIPS paper?`,
    `Compare the computational and memory complexity of the key methods.`,
    `Draft a 150-word abstract outline for a new paper addressing Gap #1.`,
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
              <span>ScholarPulse Co-Pilot</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-500 truncate max-w-[260px]">
              Grounded in: {analysis?.topic || 'Current Analysis'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.sender === 'user'
                  ? 'bg-slate-800 text-white'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-900 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <div className="text-xs sm:text-[13px]">{msg.text}</div>
              <span
                className={`block text-[10px] mt-1.5 ${
                  msg.sender === 'user' ? 'text-blue-200 text-right' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
            <span>Agent is consulting literature and formulating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Follow-ups */}
      {messages.length <= 3 && (
        <div className="p-3 bg-slate-50 border-t border-slate-100 space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Suggested Follow-up Inquiries:
          </span>
          <div className="flex flex-col gap-1">
            {suggestedQuestions.map((q, qIdx) => (
              <button
                key={qIdx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="text-left text-[11px] p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50/50 transition-all line-clamp-1"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask agent about proofs, citations, methods..."
            disabled={isSending}
            className="w-full pl-3.5 pr-12 py-2.5 bg-slate-100 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-transparent focus:bg-white"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg transition-colors"
          >
            {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </form>
      </div>
    </div>
  );
};
