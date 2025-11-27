import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { NEWS_API_KEY } from '../config/api';
import { SearchResultSkeleton } from './Skeleton';

const SearchModal = ({ isOpen, onClose }) => {
  const { darkMode, readingHistory, addToHistory, trackArticleRead } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const api = NEWS_API_KEY;

  // Search function
  const searchNews = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&language=en&pageSize=10&apiKey=${api}`
      );
      const data = await response.json();
      const filtered = data.articles?.filter(a => a.title !== '[Removed]') || [];
      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    }
    setLoading(false);
  }, [api]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) searchNews(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchNews]);

  // Handle result click
  const handleResultClick = useCallback((article) => {
    addToHistory(article);
    trackArticleRead(article.source?.name || 'Unknown');
    window.open(article.url, '_blank');
    onClose();
  }, [addToHistory, trackArticleRead, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) {
            handleResultClick(results[activeIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, activeIndex, onClose, handleResultClick]);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setActiveIndex(0);
    }
  }, [isOpen]);

  const getRecentSearches = () => {
    return readingHistory.slice(0, 5);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-x-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50">
        <div className={`${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl shadow-2xl border overflow-hidden`}>
          {/* Search Input */}
          <div className={`flex items-center gap-3 p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
            <svg className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tech news..."
              autoFocus
              className={`flex-1 bg-transparent ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'} text-lg focus:outline-none`}
            />
            {loading && (
              <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            )}
            <kbd className={`hidden md:inline-flex px-2 py-1 rounded text-xs ${darkMode ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && query ? (
              <div className="p-2">
                {[...Array(4)].map((_, i) => (
                  <SearchResultSkeleton key={i} darkMode={darkMode} />
                ))}
              </div>
            ) : query && results.length > 0 ? (
              <div className="p-2">
                {results.map((article, index) => (
                  <div
                    key={article.url}
                    onClick={() => handleResultClick(article)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      index === activeIndex
                        ? darkMode ? 'bg-slate-800' : 'bg-gray-100'
                        : darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                      {article.urlToImage && (
                        <img
                          src={article.urlToImage}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                        {article.title}
                      </h3>
                      <div className={`flex items-center gap-2 mt-1 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        <span className="text-cyan-500">{article.source?.name}</span>
                        <span>•</span>
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>
            ) : query && !loading ? (
              <div className="p-8 text-center">
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No results found for "{query}"</p>
              </div>
            ) : !query && getRecentSearches().length > 0 ? (
              <div className="p-4">
                <p className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Recently Read
                </p>
                {getRecentSearches().map((article, index) => (
                  <div
                    key={article.url + index}
                    onClick={() => handleResultClick(article)}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-50'} transition-colors`}
                  >
                    <svg className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`flex-1 truncate ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {article.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : !query ? (
              <div className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center`}>
                  <svg className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Search for any tech topic
                </p>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  Try "AI", "React", "Startup funding"
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className={`p-3 border-t ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className={`flex items-center justify-center gap-4 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>↑</kbd>
                <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>↓</kbd>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>↵</kbd>
                to open
              </span>
              <span className="flex items-center gap-1">
                <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>esc</kbd>
                to close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchModal;
