import React from 'react';

// Source badge colors
const sourceColors = {
  NewsAPI: 'from-blue-500 to-blue-600',
  GNews: 'from-green-500 to-green-600',
  Currents: 'from-orange-500 to-orange-600',
  NewsData: 'from-purple-500 to-purple-600',
  default: 'from-gray-500 to-gray-600',
};

// Source icons
const sourceIcons = {
  NewsAPI: '📰',
  GNews: '🌐',
  Currents: '⚡',
  NewsData: '📊',
};

export const SourceBadge = ({ source, size = 'sm' }) => {
  const color = sourceColors[source] || sourceColors.default;
  const icon = sourceIcons[source] || '📰';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${color} text-white font-medium ${sizeClasses[size]}`}>
      <span>{icon}</span>
      <span>{source}</span>
    </span>
  );
};

export const SourceIndicator = ({ sources, darkMode }) => {
  if (!sources || sources.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <span>Sources:</span>
      <div className="flex items-center gap-1">
        {sources.map((source, idx) => (
          <SourceBadge key={idx} source={source} size="sm" />
        ))}
      </div>
    </div>
  );
};

export const MultiSourceStats = ({ stats, darkMode }) => {
  if (!stats) return null;

  const totalArticles = Object.values(stats).reduce((a, b) => a + b, 0);
  const activeSources = Object.entries(stats).filter(([, count]) => count > 0);

  return (
    <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Multi-Source Aggregation
        </h3>
        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {totalArticles} articles from {activeSources.length} sources
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(stats).map(([source, count]) => (
          <div 
            key={source}
            className={`p-3 rounded-lg ${
              count > 0 
                ? darkMode ? 'bg-slate-700' : 'bg-white shadow-sm'
                : darkMode ? 'bg-slate-800 opacity-50' : 'bg-gray-100 opacity-50'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span>{sourceIcons[source] || '📰'}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {source}
              </span>
            </div>
            <p className={`text-2xl font-bold ${
              count > 0 
                ? 'text-cyan-500' 
                : darkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {count}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              articles
            </p>
          </div>
        ))}
      </div>

      {activeSources.length < 4 && (
        <p className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          💡 Add more API keys in .env to enable more sources
        </p>
      )}
    </div>
  );
};

export const LiveUpdateIndicator = ({ darkMode, lastUpdate }) => {
  const timeSinceUpdate = lastUpdate 
    ? Math.floor((new Date() - new Date(lastUpdate)) / 1000 / 60)
    : null;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
      darkMode ? 'bg-slate-800' : 'bg-gray-100'
    }`}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        Live Updates
      </span>
      {timeSinceUpdate !== null && timeSinceUpdate < 60 && (
        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          • {timeSinceUpdate === 0 ? 'Just now' : `${timeSinceUpdate}m ago`}
        </span>
      )}
    </div>
  );
};

const SourceIndicatorExports = {
  SourceBadge,
  SourceIndicator,
  MultiSourceStats,
  LiveUpdateIndicator,
};

export default SourceIndicatorExports;
