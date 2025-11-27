import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import { useApp } from "../context/AppContext";
import { NEWS_API_KEY } from "../config/api";

const TechCards = memo(() => {
  const { darkMode, addToHistory, trackArticleRead } = useApp();
  const [aiNews, setAiNews] = useState([]);
  const [startupNews, setStartupNews] = useState([]);
  const [cryptoNews, setCryptoNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const api = NEWS_API_KEY;

  useEffect(() => {
    const fetchTrendingNews = async () => {
      try {
        const [aiRes, startupRes, cryptoRes] = await Promise.all([
          axios.get(`https://newsapi.org/v2/everything?q=artificial intelligence&sortBy=publishedAt&pageSize=5&language=en&apiKey=${api}`),
          axios.get(`https://newsapi.org/v2/everything?q=tech startup funding&sortBy=publishedAt&pageSize=5&language=en&apiKey=${api}`),
          axios.get(`https://newsapi.org/v2/everything?q=cryptocurrency bitcoin&sortBy=publishedAt&pageSize=5&language=en&apiKey=${api}`)
        ]);
        
        setAiNews(aiRes.data.articles.filter(a => a.title !== "[Removed]"));
        setStartupNews(startupRes.data.articles.filter(a => a.title !== "[Removed]"));
        setCryptoNews(cryptoRes.data.articles.filter(a => a.title !== "[Removed]"));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching trending news:", error);
        setLoading(false);
      }
    };

    fetchTrendingNews();
  }, [api]);

  const handleArticleClick = (article) => {
    addToHistory(article);
    trackArticleRead(article.source?.name || 'Unknown');
  };

  const TrendingCard = ({ title, icon, gradient, news, shadowColor }) => (
    <div className={`relative overflow-hidden rounded-2xl ${gradient} p-1 shadow-xl ${shadowColor} transition-transform hover:scale-[1.02]`}>
      <div className={`${darkMode ? 'bg-slate-900/95' : 'bg-white/95'} rounded-xl h-full`}>
        {/* Card Header */}
        <div className={`${gradient} px-4 py-3 flex items-center gap-2`}>
          <span className="text-2xl">{icon}</span>
          <h3 className="text-white font-bold text-lg">{title}</h3>
        </div>
        
        {/* Card Content */}
        <div className="h-72 overflow-y-auto px-4 py-3 custom-scrollbar">
          {loading ? (
            <div className="space-y-3 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 animate-pulse">
                  <div className={`w-6 h-6 rounded-full ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-full`}></div>
                    <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded w-3/4`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {news.slice(0, 5).map((article, index) => (
                <li key={index} className="group">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleArticleClick(article)}
                    className={`block ${darkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-700 hover:text-cyan-600'} transition-colors`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full ${gradient} flex items-center justify-center text-white text-xs font-bold`}>
                        {index + 1}
                      </span>
                      <span className="text-sm font-medium line-clamp-2 group-hover:underline">
                        {article.title}
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-6">
      {/* Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
        <h2 className={`${darkMode ? 'text-white' : 'text-gray-900'} text-xl font-bold flex items-center gap-2`}>
          <span className="text-2xl">🔥</span> Trending Now
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"></div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrendingCard 
          title="AI & Machine Learning" 
          icon="🤖" 
          gradient="bg-gradient-to-br from-violet-600 to-purple-700"
          shadowColor="shadow-purple-500/20"
          news={aiNews}
        />
        <TrendingCard 
          title="Startup & Funding" 
          icon="🚀" 
          gradient="bg-gradient-to-br from-orange-500 to-red-600"
          shadowColor="shadow-orange-500/20"
          news={startupNews}
        />
        <TrendingCard 
          title="Crypto & Blockchain" 
          icon="₿" 
          gradient="bg-gradient-to-br from-amber-500 to-yellow-600"
          shadowColor="shadow-amber-500/20"
          news={cryptoNews}
        />
      </div>
    </div>
  );
});

export default TechCards;
