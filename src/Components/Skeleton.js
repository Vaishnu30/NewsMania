import React from 'react';

// Base skeleton with shimmer animation
const SkeletonBase = ({ className = '', darkMode = true }) => (
  <div 
    className={`animate-pulse ${darkMode ? 'bg-slate-700' : 'bg-gray-200'} rounded ${className}`}
    style={{
      background: darkMode 
        ? 'linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)'
        : 'linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }}
  />
);

// Article Card Skeleton
export const ArticleCardSkeleton = ({ darkMode = true }) => (
  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg`}>
    {/* Image */}
    <SkeletonBase darkMode={darkMode} className="h-48 w-full rounded-none" />
    
    {/* Content */}
    <div className="p-5">
      {/* Date */}
      <SkeletonBase darkMode={darkMode} className="h-4 w-24 mb-3" />
      
      {/* Title */}
      <SkeletonBase darkMode={darkMode} className="h-6 w-full mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-6 w-3/4 mb-4" />
      
      {/* Description */}
      <SkeletonBase darkMode={darkMode} className="h-4 w-full mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-4 w-full mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-4 w-2/3 mb-4" />
      
      {/* Button */}
      <SkeletonBase darkMode={darkMode} className="h-5 w-28" />
    </div>
  </div>
);

// Article List Item Skeleton
export const ArticleListSkeleton = ({ darkMode = true }) => (
  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl overflow-hidden shadow-md`}>
    <div className="flex flex-col sm:flex-row">
      {/* Image */}
      <div className="sm:w-48 md:w-64 h-40 sm:h-auto flex-shrink-0">
        <SkeletonBase darkMode={darkMode} className="w-full h-full rounded-none" />
      </div>
      
      {/* Content */}
      <div className="flex-1 p-5">
        {/* Tags */}
        <div className="flex items-center gap-3 mb-3">
          <SkeletonBase darkMode={darkMode} className="h-6 w-20 rounded-full" />
          <SkeletonBase darkMode={darkMode} className="h-4 w-16" />
          <SkeletonBase darkMode={darkMode} className="h-4 w-20" />
        </div>
        
        {/* Title */}
        <SkeletonBase darkMode={darkMode} className="h-7 w-full mb-2" />
        <SkeletonBase darkMode={darkMode} className="h-7 w-2/3 mb-3" />
        
        {/* Description */}
        <SkeletonBase darkMode={darkMode} className="h-4 w-full mb-2" />
        <SkeletonBase darkMode={darkMode} className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

// Trending Card Skeleton
export const TrendingCardSkeleton = ({ darkMode = true }) => (
  <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl overflow-hidden shadow-lg min-w-[300px]`}>
    {/* Image */}
    <SkeletonBase darkMode={darkMode} className="h-40 w-full rounded-none" />
    
    {/* Content */}
    <div className="p-4">
      {/* Source badge */}
      <SkeletonBase darkMode={darkMode} className="h-5 w-16 rounded-full mb-3" />
      
      {/* Title */}
      <SkeletonBase darkMode={darkMode} className="h-5 w-full mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-5 w-4/5 mb-3" />
      
      {/* Date */}
      <SkeletonBase darkMode={darkMode} className="h-4 w-24" />
    </div>
  </div>
);

// News Grid Skeleton
export const NewsGridSkeleton = ({ darkMode = true, count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(count)].map((_, i) => (
      <ArticleCardSkeleton key={i} darkMode={darkMode} />
    ))}
  </div>
);

// News List Skeleton
export const NewsListSkeleton = ({ darkMode = true, count = 4 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <ArticleListSkeleton key={i} darkMode={darkMode} />
    ))}
  </div>
);

// Trending Row Skeleton
export const TrendingRowSkeleton = ({ darkMode = true }) => (
  <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
    {[...Array(4)].map((_, i) => (
      <TrendingCardSkeleton key={i} darkMode={darkMode} />
    ))}
  </div>
);

// Search Result Skeleton
export const SearchResultSkeleton = ({ darkMode = true }) => (
  <div className="flex items-start gap-3 p-3">
    <SkeletonBase darkMode={darkMode} className="w-16 h-16 rounded-lg flex-shrink-0" />
    <div className="flex-1">
      <SkeletonBase darkMode={darkMode} className="h-5 w-full mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-5 w-3/4 mb-2" />
      <SkeletonBase darkMode={darkMode} className="h-4 w-32" />
    </div>
  </div>
);

// Bookmark Item Skeleton
export const BookmarkSkeleton = ({ darkMode = true }) => (
  <div className={`p-4 rounded-xl ${darkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
    <div className="flex gap-3">
      <SkeletonBase darkMode={darkMode} className="w-20 h-20 rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <SkeletonBase darkMode={darkMode} className="h-5 w-full mb-2" />
        <SkeletonBase darkMode={darkMode} className="h-5 w-2/3 mb-2" />
        <SkeletonBase darkMode={darkMode} className="h-4 w-24" />
      </div>
    </div>
  </div>
);

// CSS for shimmer animation (add to index.css)
export const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

export default SkeletonBase;
