import React, { useState, useRef, useEffect } from 'react';
import guideData from '../data/base/guide_script.json';

export default function ChatBot({ onClose }) {
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentCategory, currentQuestion]);

  const handleCategorySelect = (category) => {
    setCurrentCategory(category);
    setCurrentQuestion(null);
  };

  const handleQuestionSelect = (questionId) => {
    // Find question in current category or all categories (for followups)
    let question = currentCategory?.questions.find(q => q.id === questionId);
    if (!question) {
      for (const cat of guideData.categories) {
        question = cat.questions.find(q => q.id === questionId);
        if (question) break;
      }
    }
    setCurrentQuestion(question);
  };

  const resetGuide = () => {
    setCurrentCategory(null);
    setCurrentQuestion(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Lữ Hành Lão Làng</h2>
          </div>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 text-zinc-500 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
          {!currentCategory && !currentQuestion ? (
            <div className="space-y-6">
              <div className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700/50 italic text-zinc-400 text-sm leading-relaxed">
                "Ngươi muốn biết điều gì? Đừng hỏi những câu ngớ ngẩn, ta không có nhiều thời gian đâu."
              </div>
              <div className="grid grid-cols-1 gap-3">
                {guideData.categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="flex items-center gap-4 p-4 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/50 rounded-xl transition-all group text-left"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <span className="font-bold text-zinc-200">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : currentCategory && !currentQuestion ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-bold tracking-tighter">
                <button onClick={resetGuide} className="hover:text-zinc-300">Hướng dẫn</button>
                <span>/</span>
                <span className="text-zinc-300">{currentCategory.label}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {currentCategory.questions.map(q => (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionSelect(q.id)}
                    className="p-3 text-left bg-zinc-800/30 hover:bg-zinc-700/30 border border-zinc-700/30 rounded-lg text-sm text-zinc-300 transition-colors"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
              <button 
                onClick={resetGuide}
                className="w-full py-2 text-xs uppercase font-bold text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Quay lại danh mục
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <div className="text-xs font-bold text-emerald-500/70 uppercase tracking-widest">Câu hỏi:</div>
                <div className="text-lg font-bold text-zinc-100 leading-tight">{currentQuestion.question}</div>
              </div>
              
              <div className="p-5 bg-zinc-800/40 rounded-2xl border border-zinc-700/50 text-zinc-300 text-sm leading-relaxed shadow-inner">
                {currentQuestion.answer}
              </div>

              {currentQuestion.followups && currentQuestion.followups.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Gợi ý hỏi thêm:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentQuestion.followups.map(fId => {
                      // Find question text for followup
                      let fQuestion = null;
                      for (const cat of guideData.categories) {
                        fQuestion = cat.questions.find(q => q.id === fId);
                        if (fQuestion) break;
                      }
                      return fQuestion ? (
                        <button
                          key={fId}
                          onClick={() => handleQuestionSelect(fId)}
                          className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full text-xs text-emerald-400 transition-colors"
                        >
                          {fQuestion.question}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-zinc-800">
                <button 
                  onClick={resetGuide}
                  className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-xs font-bold uppercase tracking-[0.2em] text-emerald-400 transition-all active:scale-95"
                >
                  Hỏi thêm
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
