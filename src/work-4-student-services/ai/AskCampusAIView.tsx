import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles, Send, ShieldCheck, Bot, User,
  BookOpen, ChevronRight, Info, Copy, Check,
  RotateCcw, Lightbulb
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  citation?: {
    documentTitle: string;
    section: string;
    pageNumber: number;
    confidence: number;
  };
  timestamp: Date;
}

const SAMPLE_QUESTIONS = [
  { q: "What is the attendance condonation policy if I have 68%?", emoji: "📊" },
  { q: "How do I apply for a hostel room change?", emoji: "🏠" },
  { q: "What is the fine for overdue library books?", emoji: "📚" },
  { q: "What is the procedure to get an NOC for off-campus internships?", emoji: "📋" },
  { q: "How does the overnight hostel leave permission work?", emoji: "🌙" },
  { q: "What are the exam re-evaluation rules?", emoji: "📝" },
];

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color = pct >= 80 ? 'emerald' : pct >= 60 ? 'amber' : 'rose';
  const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
    amber: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
    rose: 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300',
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorMap[color]}`}>
      {pct}% confidence
    </span>
  );
}

export const AskCampusAIView: React.FC = () => {
  const { askCampusAI, showToast } = useApp();
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: "Hello! I'm your **Grounded Campus AI** — powered by Retrieval-Augmented Generation (RAG). I answer questions exclusively using verified university handbooks, academic regulations, library policies, and hostel manuals.\n\n🔒 **Zero hallucinations policy.** Every answer includes exact source citations with page numbers. Ask me anything about campus life!",
      timestamp: new Date(),
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (textToSend?: string) => {
    const q = (textToSend || inputQuery).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    setTimeout(() => {
      const result = askCampusAI(q);
      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: result.answer,
        citation: {
          documentTitle: result.sourceDocument,
          section: result.sourceSection,
          pageNumber: result.pageNumber,
          confidence: result.confidence,
        },
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      setLoading(false);
    }, 500 + Math.random() * 300);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast('Copied to clipboard!');
  };

  const clearChat = () => {
    setMessages([{
      id: 'msg_welcome_' + Date.now(),
      sender: 'ai',
      text: "Chat cleared! I'm ready for your next question about campus regulations, rules, or procedures.",
      timestamp: new Date(),
    }]);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <p key={i} className={line === '' ? 'mt-2' : ''} dangerouslySetInnerHTML={{ __html: boldLine }} />;
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-violet-800 animate-gradient p-6 sm:p-7 text-white shadow-2xl shadow-indigo-900/30">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl pointer-events-none translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
          <div className="flex-1 space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-indigo-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Grounded RAG · Zero Hallucinations · Verified Sources
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ask Campus AI 🤖
            </h1>
            <p className="text-xs text-indigo-200/90 max-w-2xl leading-relaxed">
              Answers retrieved from official college circulars, examination bylaws, and administrative handbooks. Every response includes exact source &amp; page citations.
            </p>
          </div>

          {/* Info pods */}
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center min-w-[90px]">
              <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Sources</div>
              <div className="text-xl font-extrabold mt-1">12+</div>
              <div className="text-[10px] mt-0.5 bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full font-bold">Documents</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-3 rounded-2xl text-center min-w-[90px]">
              <div className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wider">Mode</div>
              <div className="text-xl font-extrabold mt-1">RAG</div>
              <div className="text-[10px] mt-0.5 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">Grounded</div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Quick Questions
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sq.q)}
              disabled={loading}
              className="text-xs px-3.5 py-2 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl hover:bg-white dark:hover:bg-slate-800 border border-white/30 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 transition-all hover:-translate-y-0.5 hover:shadow-md shadow-sm font-medium text-left flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{sq.emoji}</span>
              <span>{sq.q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/40 shadow-xl overflow-hidden">
        
        {/* Chat header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Campus AI Assistant</div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Online · Grounded RAG Mode</span>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-medium px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear
          </button>
        </div>

        {/* Messages */}
        <div className="space-y-4 p-5 overflow-y-auto max-h-[520px] min-h-[300px]">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2.5 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-campus-600 to-campus-700 text-white p-4 rounded-2xl rounded-tr-sm shadow-md shadow-campus-500/20'
                  : 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/40 p-4 rounded-2xl rounded-tl-sm text-slate-800 dark:text-slate-200 shadow-md'
              }`}>
                <div className="text-xs leading-relaxed space-y-1">
                  {formatText(msg.text)}
                </div>

                {/* Citation card */}
                {msg.citation && (
                  <div className="mt-3 pt-3 border-t border-indigo-100 dark:border-indigo-900/40">
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-800/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                          <ShieldCheck className="w-3.5 h-3.5" /> Grounded Source
                        </span>
                        <ConfidenceBadge confidence={msg.citation.confidence} />
                      </div>
                      <div className="flex items-start gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">{msg.citation.documentTitle}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {msg.citation.section} · Page {msg.citation.pageNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Copy button (AI messages only) */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copiedId === msg.id ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-500 text-white flex items-center justify-center shrink-0 shadow-md mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/40 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  <span className="text-xs text-slate-400 ml-2">Searching verified documents...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
          <div className="flex gap-2.5">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask about hostel rules, exam policies, library fines, certificates..."
              className="flex-1 text-xs p-3.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/80 dark:border-slate-700/50 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder-slate-400 outline-none transition"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            🔒 Answers grounded in official university documents only · No hallucinations · Cite exact sources
          </p>
        </div>
      </div>
    </div>
  );
};
