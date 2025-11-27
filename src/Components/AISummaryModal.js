import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { summarizeArticle, chatWithArticle, isGeminiConfigured } from '../services/geminiService';

const AISummaryModal = ({ article, isOpen, onClose }) => {
  const { darkMode } = useApp();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chatMode, setChatMode] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const handleSummarize = async () => {
    if (!isGeminiConfigured()) {
      setError('Gemini API key not configured. Add REACT_APP_GEMINI_API_KEY to your .env file.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await summarizeArticle(article);
      setSummary(result);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    }
    setLoading(false);
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setChatLoading(true);
    try {
      const response = await chatWithArticle(article, question);
      setChatResponse(response);
    } catch (err) {
      setChatResponse('Sorry, I couldn\'t process your question. Please try again.');
    }
    setChatLoading(false);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500 bg-green-500/10';
      case 'negative': return 'text-red-500 bg-red-500/10';
      default: return 'text-blue-500 bg-blue-500/10';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😟';
      default: return '😐';
    }
  };

  if (!isOpen || !article) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 max-h-[90vh] overflow-hidden">
        <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]`}>
          {/* Header */}
          <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AI Summary
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Powered by Gemini
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setChatMode(false)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  !chatMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : darkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                📝 Summary
              </button>
              <button
                onClick={() => setChatMode(true)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  chatMode
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : darkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}
              >
                💬 Ask AI
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {/* Article Preview */}
            <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {article.title}
              </h3>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {article.source?.name}
              </p>
            </div>

            {!chatMode ? (
              /* Summary Mode */
              <>
                {!summary && !loading && !error && (
                  <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Get an instant AI-powered summary of this article
                    </p>
                    <button
                      onClick={handleSummarize}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/25"
                    >
                      ✨ Generate Summary
                    </button>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      AI is analyzing the article...
                    </p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                      onClick={handleSummarize}
                      className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {summary && (
                  <div className="space-y-4">
                    {/* Summary */}
                    <div>
                      <h4 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Summary
                      </h4>
                      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                        {summary.summary}
                      </p>
                    </div>

                    {/* Key Points */}
                    {summary.keyPoints?.length > 0 && (
                      <div>
                        <h4 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Key Points
                        </h4>
                        <ul className="space-y-2">
                          {summary.keyPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">•</span>
                              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {summary.sentiment && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(summary.sentiment)}`}>
                          {getSentimentIcon(summary.sentiment)} {summary.sentiment}
                        </span>
                      )}
                      {summary.readTime && (
                        <span className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                          ⏱️ {summary.readTime} min read
                        </span>
                      )}
                      {summary.topics?.map((topic, idx) => (
                        <span 
                          key={idx}
                          className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                        >
                          #{topic}
                        </span>
                      ))}
                    </div>

                    {/* Regenerate */}
                    <button
                      onClick={handleSummarize}
                      className={`w-full py-2 rounded-lg text-sm font-medium ${darkMode ? 'bg-slate-800 text-gray-400 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                    >
                      🔄 Regenerate Summary
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Chat Mode */
              <div className="space-y-4">
                <form onSubmit={handleChat}>
                  <div className="relative">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question about this article..."
                      className={`w-full px-4 py-3 pr-12 rounded-xl ${
                        darkMode
                          ? 'bg-slate-800 text-white placeholder-gray-500 border-slate-700'
                          : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <button
                      type="submit"
                      disabled={chatLoading || !question.trim()}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-purple-500 hover:text-purple-600 disabled:opacity-50"
                    >
                      {chatLoading ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>

                {/* Suggested Questions */}
                {!chatResponse && (
                  <div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Try asking:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'What is the main point?',
                        'Who is involved?',
                        'Why is this important?',
                        'What are the implications?',
                      ].map((q, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuestion(q)}
                          className={`px-3 py-1.5 rounded-full text-sm ${
                            darkMode
                              ? 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chat Response */}
                {chatResponse && (
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm">AI</span>
                      </div>
                      <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {chatResponse}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${darkMode ? 'border-slate-700' : 'border-gray-200'} flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                AI-generated summaries may not be 100% accurate
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-500 hover:text-purple-600 font-medium"
              >
                Read Full Article →
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AISummaryModal;
