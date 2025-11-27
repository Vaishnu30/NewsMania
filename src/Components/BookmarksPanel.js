import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from './Toast';

const BookmarksPanel = ({ isOpen, onClose }) => {
  const { darkMode, bookmarks, removeBookmark, addToHistory, trackArticleRead } = useApp();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const panelRef = useRef(null);

  // Focus trap and escape key
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEsc);
      panelRef.current?.focus();
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [isOpen, onClose]);

  const filteredBookmarks = bookmarks
    .filter(bookmark => 
      bookmark.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.source?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.bookmarkedAt) - new Date(b.bookmarkedAt);
      } else if (sortBy === 'alphabetical') {
        return a.title?.localeCompare(b.title);
      }
      return 0;
    });

  const handleRemoveBookmark = (url, e) => {
    e.stopPropagation();
    removeBookmark(url);
    toast.bookmark('Bookmark removed');
  };

  const handleArticleClick = (article) => {
    addToHistory(article);
    trackArticleRead(article.source?.name || 'Unknown');
    window.open(article.url, '_blank');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bookmarks-title"
        tabIndex={-1}
        className={`fixed right-0 top-0 h-full w-full max-w-md ${darkMode ? 'bg-slate-900' : 'bg-white'} shadow-2xl z-50 transform transition-transform duration-300 ease-out focus:outline-none`}
      >
        {/* Header */}
        <div className={`p-4 border-b ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Bookmarks
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {bookmarks.length} saved article{bookmarks.length !== 1 ? 's' : ''}
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

          {/* Search and Sort */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-slate-800 text-white placeholder-gray-500 border-slate-700' : 'bg-gray-100 text-gray-900 placeholder-gray-500 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              <svg className={`w-5 h-5 absolute left-3 top-2.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-cyan-500`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="overflow-y-auto h-[calc(100%-140px)] p-4">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <svg className={`w-8 h-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {searchTerm ? 'No bookmarks match your search' : 'No bookmarks yet'}
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {!searchTerm && 'Click the bookmark icon on any article to save it'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBookmarks.map((bookmark, index) => (
                <div
                  key={bookmark.url + index}
                  className={`group p-4 rounded-xl ${darkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-gray-50 hover:bg-gray-100'} transition-all cursor-pointer`}
                >
                  <div className="flex gap-3">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-cyan-500 to-blue-600">
                      {bookmark.urlToImage ? (
                        <img
                          src={bookmark.urlToImage}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => handleArticleClick(bookmark)}
                          className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2 group-hover:text-cyan-500 transition-colors`}
                        >
                          {bookmark.title}
                        </h3>
                        <button
                          onClick={(e) => handleRemoveBookmark(bookmark.url, e)}
                          className={`flex-shrink-0 p-1.5 rounded-lg ${darkMode ? 'hover:bg-slate-700 text-gray-500 hover:text-red-400' : 'hover:bg-gray-200 text-gray-400 hover:text-red-500'} transition-all opacity-0 group-hover:opacity-100`}
                          title="Remove bookmark"
                          aria-label="Remove bookmark"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <div className={`flex items-center gap-2 mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span className="font-medium text-cyan-500">{bookmark.source?.name || 'Unknown'}</span>
                        <span>•</span>
                        <span>Saved {formatDate(bookmark.bookmarkedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookmarksPanel;
