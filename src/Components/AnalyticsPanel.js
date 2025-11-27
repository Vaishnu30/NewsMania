import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const AnalyticsPanel = ({ isOpen, onClose }) => {
  const { darkMode, analytics, readingHistory, bookmarks, clearHistory } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTopCategories = () => {
    const categories = analytics.topCategories || {};
    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
  };

  const getReadingStats = () => {
    const today = new Date().toDateString();
    const thisWeek = new Date(Date.now() - 7 * 86400000);
    
    const todayCount = readingHistory.filter(h => 
      new Date(h.readAt).toDateString() === today
    ).length;
    
    const weekCount = readingHistory.filter(h => 
      new Date(h.readAt) >= thisWeek
    ).length;

    return { todayCount, weekCount };
  };

  const stats = getReadingStats();
  const topCategories = getTopCategories();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-lg ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl z-50`}>
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Reading Analytics
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Your reading insights
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {['overview', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                    : darkMode
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-160px)] p-4">
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔥</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.readingStreak || 0}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Day Streak</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {analytics.articlesRead || 0}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Read</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stats.todayCount}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🔖</span>
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {bookmarks.length}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Bookmarks</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Sources */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Top Sources
                </h3>
                {topCategories.length > 0 ? (
                  <div className="space-y-3">
                    {topCategories.map(([source, count], index) => (
                      <div key={source} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800' :
                          index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          darkMode ? 'bg-slate-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {source}
                            </span>
                            <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              {count} articles
                            </span>
                          </div>
                          <div className={`h-2 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} overflow-hidden`}>
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                              style={{ width: `${(count / topCategories[0][1]) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Start reading to see your top sources
                  </p>
                )}
              </div>

              {/* Weekly Activity */}
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                <h3 className={`font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  This Week
                </h3>
                <div className="flex items-center justify-center gap-2">
                  {[...Array(7)].map((_, i) => {
                    const date = new Date(Date.now() - (6 - i) * 86400000);
                    const dayArticles = readingHistory.filter(h => 
                      new Date(h.readAt).toDateString() === date.toDateString()
                    ).length;
                    const height = Math.max(8, Math.min(64, dayArticles * 16));
                    
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div 
                          className={`w-8 rounded-full bg-gradient-to-t from-cyan-500 to-blue-600 transition-all`}
                          style={{ height: `${height}px` }}
                          title={`${dayArticles} articles`}
                        />
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* History Tab */
            <div>
              <div className="flex justify-between items-center mb-4">
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {readingHistory.length} articles in history
                </p>
                {readingHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className={`text-sm px-3 py-1 rounded-lg ${darkMode ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' : 'bg-red-50 text-red-600 hover:bg-red-100'} transition-colors`}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {readingHistory.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <svg className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No reading history yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {readingHistory.map((item, index) => (
                    <a
                      key={item.url + index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all group`}
                    >
                      <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-1 group-hover:text-cyan-500 transition-colors`}>
                        {item.title}
                      </h4>
                      <div className={`flex items-center gap-2 mt-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span>{item.source?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>{formatDate(item.readAt)}</span>
                        {item.readCount > 1 && (
                          <>
                            <span>•</span>
                            <span>Read {item.readCount}x</span>
                          </>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AnalyticsPanel;
