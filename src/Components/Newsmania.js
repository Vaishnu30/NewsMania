import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import TechCards from "./Cards";
import ShareModal from "./ShareModal";
import AISummaryModal from "./AISummaryModal";
import { useApp } from "../context/AppContext";
import { useToast } from "./Toast";
import { NewsGridSkeleton, NewsListSkeleton } from "./Skeleton";
import { NEWS_API_KEY } from "../config/api";
import { isGeminiConfigured } from "../services/geminiService";

const TechNews = () => {
  const { darkMode, addBookmark, removeBookmark, isBookmarked, addToHistory, trackArticleRead } = useApp();
  const toast = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("technology");
  const [activeTab, setActiveTab] = useState("technology");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [shareArticle, setShareArticle] = useState(null);
  const [summaryArticle, setSummaryArticle] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [loadingMore, setLoadingMore] = useState(false);

  const api = NEWS_API_KEY;
  const geminiEnabled = isGeminiConfigured();

  const categories = useMemo(() => [
    { id: "technology", label: "All Tech", icon: "💻", description: "Latest technology news" },
    { id: "ai", label: "AI & ML", icon: "🤖", query: "artificial intelligence OR machine learning OR GPT OR neural network" },
    { id: "startups", label: "Startups", icon: "🚀", query: "startup funding OR venture capital OR unicorn startup" },
    { id: "gadgets", label: "Gadgets", icon: "📱", query: "gadgets OR smartphone OR laptop OR wearable" },
    { id: "crypto", label: "Crypto", icon: "₿", query: "cryptocurrency OR bitcoin OR ethereum OR blockchain" },
    { id: "programming", label: "Dev", icon: "👨‍💻", query: "programming OR software development OR javascript OR python" },
    { id: "cybersecurity", label: "Security", icon: "🔒", query: "cybersecurity OR hacking OR data breach OR privacy" },
  ], []);

  const fetchNews = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    if (append) setLoadingMore(true);
    try {
      let url;
      const selectedCategory = categories.find(c => c.id === category);
      
      if (category === "technology") {
        url = `https://newsapi.org/v2/top-headlines?country=us&category=technology&page=${pageNum}&pageSize=12&apiKey=${api}`;
      } else if (selectedCategory?.query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(selectedCategory.query)}&sortBy=publishedAt&language=en&page=${pageNum}&pageSize=12&apiKey=${api}`;
      }
      
      const response = await axios.get(url);
      const newArticles = response.data.articles.filter(article => article.title !== "[Removed]" && article.urlToImage);
      
      if (append) {
        setArticles(prev => [...prev, ...newArticles]);
      } else {
        setArticles(newArticles);
      }
      
      setHasMore(newArticles.length === 12);
      setLoading(false);
      setLoadingMore(false);
      setError(null);
    } catch (err) {
      setError(err);
      setLoading(false);
      setLoadingMore(false);
      toast.error('Failed to fetch news. Please try again.');
    }
  }, [category, categories, api, toast]);

  useEffect(() => {
    setPage(1);
    fetchNews(1, false);
  }, [category, fetchNews]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchNews(nextPage, true);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${searchQuery} AND technology&sortBy=relevancy&language=en&pageSize=12&apiKey=${api}`
      );
      const filteredArticles = response.data.articles.filter(article => article.title !== "[Removed]" && article.urlToImage);
      setArticles(filteredArticles);
      setActiveTab("");
      setLoading(false);
      toast.success(`Found ${filteredArticles.length} articles`);
    } catch (err) {
      setError(err);
      setLoading(false);
      toast.error('Search failed. Please try again.');
    }
  };

  const handleCategoryClick = (categoryId) => {
    setCategory(categoryId);
    setActiveTab(categoryId);
    setSearchQuery("");
    setPage(1);
  };

  const handleArticleClick = (article) => {
    addToHistory(article);
    trackArticleRead(article.source?.name || 'Unknown');
    window.open(article.url, '_blank');
  };

  const handleBookmarkToggle = (article, e) => {
    e.stopPropagation();
    if (isBookmarked(article.url)) {
      removeBookmark(article.url);
      toast.bookmark('Bookmark removed');
    } else {
      addBookmark(article);
      toast.bookmark('Article bookmarked!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const estimateReadTime = (article) => {
    const words = (article.description || '').split(' ').length + (article.title || '').split(' ').length;
    const readTime = Math.ceil(words / 200);
    return Math.max(1, readTime);
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className={`${darkMode ? 'bg-gradient-to-br from-slate-800 via-slate-900 to-cyan-900' : 'bg-gradient-to-br from-blue-50 via-white to-cyan-50'} py-12 px-4`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span className="text-cyan-500 text-sm font-medium">Live Tech Updates</span>
          </div>
          
          <h1 className={`text-4xl md:text-5xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Stay Ahead with <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tech News</span>
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-lg mb-8 max-w-2xl mx-auto`}>
            Your daily dose of technology, AI, startups, and innovation stories from around the world.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <svg className={`absolute left-4 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tech news... (Press ⌘K)"
                className={`w-full pl-12 pr-32 py-4 rounded-xl ${darkMode ? 'bg-slate-700/50 text-white placeholder-gray-400 border-slate-600' : 'bg-white text-gray-900 placeholder-gray-500 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all`}
              />
              <button
                type="submit"
                className="absolute right-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            <div className="text-center">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{articles.length}+</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Articles</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>4</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>API Sources</p>
            </div>
            <div className="text-center">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{categories.length}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categories</p>
            </div>
            {geminiEnabled && (
              <div className="text-center">
                <p className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500`}>AI</p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Summaries</p>
              </div>
            )}
            <div className="text-center">
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>24/7</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Live Updates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cards */}
      <TechCards darkMode={darkMode} />

      {/* Category Tabs & View Toggle */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  activeTab === cat.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                    : darkMode
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-gray-100'}`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? (darkMode ? 'bg-slate-700 text-cyan-500' : 'bg-white text-cyan-600 shadow') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
              title="Grid View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${viewMode === 'list' ? (darkMode ? 'bg-slate-700 text-cyan-500' : 'bg-white text-cyan-600 shadow') : (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
              title="List View"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* News Grid/List */}
        <div className="pb-12">
          {loading && page === 1 ? (
            viewMode === 'grid' ? (
              <NewsGridSkeleton darkMode={darkMode} count={6} />
            ) : (
              <NewsListSkeleton darkMode={darkMode} count={4} />
            )
          ) : error ? (
            <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full ${darkMode ? 'bg-slate-800' : 'bg-gray-100'} flex items-center justify-center`}>
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xl font-medium">Oops! Something went wrong.</p>
              <p className="mt-2">Please try again later or check your connection.</p>
              <button 
                onClick={() => fetchNews(1, false)}
                className="mt-4 px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {/* Grid View */}
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article, index) => (
                    <article
                      key={article.url + index}
                      className={`${darkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:shadow-xl'} rounded-xl overflow-hidden shadow-lg transition-all duration-300 group cursor-pointer`}
                      onClick={() => handleArticleClick(article)}
                    >
                      {/* Article Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800';
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        
                        {/* Top badges */}
                        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                          <span className="bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            {article.source?.name || 'Tech'}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleBookmarkToggle(article, e)}
                              className={`p-2 rounded-full backdrop-blur-sm transition-all ${
                                isBookmarked(article.url)
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-black/30 text-white hover:bg-black/50'
                              }`}
                              title={isBookmarked(article.url) ? 'Remove bookmark' : 'Bookmark'}
                            >
                              <svg className="w-4 h-4" fill={isBookmarked(article.url) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShareArticle(article);
                              }}
                              className="p-2 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm transition-all"
                              title="Share"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                            </button>
                            {geminiEnabled && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSummaryArticle(article);
                                }}
                                className="p-2 rounded-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 text-white hover:from-purple-600 hover:to-pink-600 backdrop-blur-sm transition-all"
                                title="AI Summary"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Read time badge */}
                        <div className="absolute bottom-3 left-3">
                          <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            {estimateReadTime(article)} min read
                          </span>
                        </div>
                      </div>

                      {/* Article Content */}
                      <div className="p-5">
                        <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-cyan-600'} mb-2`}>
                          {formatDate(article.publishedAt)}
                        </p>
                        <h2 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-3 line-clamp-2 group-hover:text-cyan-500 transition-colors`}>
                          {article.title}
                        </h2>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm line-clamp-3 mb-4`}>
                          {article.description || 'Click to read the full article...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center text-cyan-500 hover:text-cyan-400 font-medium text-sm group/link">
                            Read Article
                            <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                          {geminiEnabled && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSummaryArticle(article);
                              }}
                              className="inline-flex items-center gap-1 text-purple-500 hover:text-purple-400 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                              AI Summary
                            </button>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {articles.map((article, index) => (
                    <article
                      key={article.url + index}
                      onClick={() => handleArticleClick(article)}
                      className={`${darkMode ? 'bg-slate-800 hover:bg-slate-750' : 'bg-white hover:shadow-lg'} rounded-xl overflow-hidden shadow-md transition-all duration-300 group cursor-pointer`}
                    >
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="sm:w-48 md:w-64 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={article.urlToImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800'}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800';
                            }}
                            loading="lazy"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="bg-cyan-500/10 text-cyan-500 text-xs font-bold px-2 py-1 rounded-full">
                                {article.source?.name || 'Tech'}
                              </span>
                              <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {formatDate(article.publishedAt)}
                              </span>
                              <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                • {estimateReadTime(article)} min read
                              </span>
                            </div>
                            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 group-hover:text-cyan-500 transition-colors`}>
                              {article.title}
                            </h2>
                            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                              {article.description || 'Click to read the full article...'}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <span className="inline-flex items-center text-cyan-500 font-medium text-sm">
                              Read more →
                            </span>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => handleBookmarkToggle(article, e)}
                                className={`p-2 rounded-lg transition-all ${
                                  isBookmarked(article.url)
                                    ? 'bg-amber-500/10 text-amber-500'
                                    : darkMode ? 'bg-slate-700 text-gray-400 hover:text-amber-500' : 'bg-gray-100 text-gray-500 hover:text-amber-500'
                                }`}
                              >
                                <svg className="w-5 h-5" fill={isBookmarked(article.url) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShareArticle(article);
                                }}
                                className={`p-2 rounded-lg transition-all ${darkMode ? 'bg-slate-700 text-gray-400 hover:text-cyan-500' : 'bg-gray-100 text-gray-500 hover:text-cyan-500'}`}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                              </button>
                              {geminiEnabled && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSummaryArticle(article);
                                  }}
                                  className={`p-2 rounded-lg transition-all bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-500 hover:from-purple-500/20 hover:to-pink-500/20`}
                                  title="AI Summary"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && !loading && (
                <div className="text-center mt-10">
                  <button 
                    onClick={loadMore}
                    disabled={loadingMore}
                    className={`px-8 py-3 rounded-xl font-medium ${darkMode ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loadingMore ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More Articles
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal 
        article={shareArticle}
        isOpen={!!shareArticle}
        onClose={() => setShareArticle(null)}
      />

      {/* AI Summary Modal */}
      <AISummaryModal
        article={summaryArticle}
        isOpen={!!summaryArticle}
        onClose={() => setSummaryArticle(null)}
      />
    </div>
  );
};

export default TechNews;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { ClipLoader } from "react-spinners"; // Import a spinner component

// const Newsmania = () => {
//   const [newsHindu, setnewsHindu] = useState([]);
//   const [newsTII, setnewsTII] = useState([]);
//   const [newsTIC, setnewsTIC] = useState([]);

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const api = "a2154f3ce08a4dc79780ae42d5299f39";

//   const [articles, setArticles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [category, setCategory] = useState("");

//   useEffect(() => {
//     const fetchHeadlines = async () => {
//       try {
//         const response1 = await axios.get(
//           `https://newsapi.org/v2/top-headlines?sources=the-hindu&apiKey=${api}`
//         );
//         setnewsHindu(response1.data.articles);

//         const response2 = await axios.get(
//           `https://newsapi.org/v2/top-headlines?country=in&apiKey=${api}`
//         );
//         setnewsTII(response2.data.articles);

//         const response3 = await axios.get(
//           `https://newsapi.org/v2/everything?q=cricket&apiKey=${api}`
//         );
//         setnewsTIC(response3.data.articles);

//         const response = await axios.get(
//           `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${api}`
//         );
//         setArticles(response.data.articles);

//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//       }
//     };

//     fetchHeadlines();
//   }, [category]);

//   const handleSearch = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${api}`
//       );
//       setArticles(response.data.articles);
//       setLoading(false);
//     } catch (error) {
//       setError(error);
//       setLoading(false);
//     }
//   };


//   // if (loading) return <p>Loading...</p>;
//   // if (error) return <p>Error: {error.message}</p>;

//   return (
//     <div className="font-serif  bg-gradient-to-r from-green-100 via-green-400 to-green-900">

//       <div className=" mt-4 flex flex-row justify-center items-center space-x-4 mb-10">
//         <div className="py-6 w-80 h-96 bg-purple-950 rounded-3xl hover:shadow-purple-950 shadow-2xl">
//           <p className="bg-white text-gray-900 font-bold text-2xl py-2 text-center rounded-t-lg">
//             THE HINDU
//           </p>
//           <div className="overflow-y-auto h-64 px-4 mt-4">
//             <ol className="text-white px-4 space-y-2 list-disc auto-scroll">
//               {newsHindu.map((article, index) => (
//                 <li key={index}>
//                   <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="hover:underline"
//                   >
//                     {article.title}
//                   </a>
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>

//         <div className="py-6 w-80 h-96 bg-red-900 rounded-3xl hover:shadow-red-900 shadow-2xl">
//           <p className="bg-white text-gray-900 font-bold text-2xl py-2 text-center rounded-t-lg">
//             Top In INDIA
//           </p>
//           <div className="overflow-y-auto h-64 px-4 mt-4">
//             <ol className="text-white px-4 space-y-2 list-disc auto-scroll">
//               {newsTII.map((article, index) => (
//                 <li key={index}>
//                   <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="hover:underline"
//                   >
//                     {article.title}
//                   </a>
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>

//         <div className="py-6 w-80 h-96 bg-purple-950 rounded-3xl hover:shadow-purple-950 shadow-2xl">
//           <p className="bg-white text-gray-900 font-bold text-2xl py-2 text-center rounded-t-lg">
//             Top In Cricket
//           </p>
//           <div className="overflow-y-auto h-64 px-4 mt-4">
//             <ol className="text-white px-4 space-y-2 list-disc auto-scroll">
//               {newsTIC.map((article, index) => (
//                 <li key={index}>
//                   <a
//                     href={article.url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="hover:underline"
//                   >
//                     {article.title}
//                   </a>
//                 </li>
//               ))}
//             </ol>
//           </div>
//         </div>
//       </div>

//       <div className="px-9 mb-10 mt-5">
//         <form onSubmit={handleSearch} className="flex justify-center mb-8">
//           <input
//             type="text" value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             placeholder="Search for news..."
//             className="p-2 w-1/2 border border-gray-300 rounded-l-lg focus:outline-none"
//           />
//           <button type="submit" className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600">
//             Search
//           </button>
//         </form>
        
//         <div className="flex justify-center mb-8">
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             className="p-2 border border-gray-300 rounded-lg focus:outline-none"
//           >
//             <option value="">All Categories</option>
//             <option value="business">Business</option>
//             <option value="entertainment">Entertainment</option>
//             <option value="health">Health</option>
//             <option value="science">Science</option>
//             <option value="sports">Sports</option>
//             <option value="technology">Technology</option>
//           </select>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center">
//             <ClipLoader size={50} color={"#123abc"} loading={loading} />
//           </div>
//         ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {articles.map((article, index) => (
//             <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl shadow-zinc-700 transition-shadow duration-30">
//               <p className="text-gray-500 text-sm mb-2">{new Date(article.publishedAt).toLocaleDateString()}</p>
//               <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
//               <p className="text-gray-700 mb-4">{article.description}</p>
//               <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
//                 Read more
//               </a>
//             </div>
//           ))}
//         </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Newsmania;
