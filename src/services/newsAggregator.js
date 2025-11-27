// Multi-Source News Aggregator Service
// Aggregates news from multiple APIs for comprehensive coverage

const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || '';
const GNEWS_API_KEY = process.env.REACT_APP_GNEWS_API_KEY || '';
const CURRENTS_API_KEY = process.env.REACT_APP_CURRENTS_API_KEY || '';
const NEWSDATA_API_KEY = process.env.REACT_APP_NEWSDATA_API_KEY || '';

// API Sources Configuration
const API_SOURCES = {
  newsapi: {
    name: 'NewsAPI',
    baseUrl: 'https://newsapi.org/v2',
    enabled: !!NEWS_API_KEY,
  },
  gnews: {
    name: 'GNews',
    baseUrl: 'https://gnews.io/api/v4',
    enabled: !!GNEWS_API_KEY,
  },
  currents: {
    name: 'Currents API',
    baseUrl: 'https://api.currentsapi.services/v1',
    enabled: !!CURRENTS_API_KEY,
  },
  newsdata: {
    name: 'NewsData.io',
    baseUrl: 'https://newsdata.io/api/1',
    enabled: !!NEWSDATA_API_KEY,
  },
};

// Category mapping for different APIs
const categoryMapping = {
  technology: {
    newsapi: 'technology',
    gnews: 'technology',
    currents: 'technology',
    newsdata: 'technology',
  },
  ai: {
    query: 'artificial intelligence OR machine learning OR GPT OR ChatGPT',
  },
  startups: {
    query: 'startup funding OR venture capital OR unicorn',
  },
  crypto: {
    query: 'cryptocurrency OR bitcoin OR ethereum OR blockchain',
  },
  programming: {
    query: 'programming OR software development OR javascript OR python',
  },
  cybersecurity: {
    query: 'cybersecurity OR hacking OR data breach',
  },
  gadgets: {
    query: 'gadgets OR smartphone OR iPhone OR laptop',
  },
};

// Normalize articles from different sources to a common format
const normalizeArticle = (article, source) => {
  const baseArticle = {
    id: `${source}-${article.url || Math.random().toString(36).substr(2, 9)}`,
    apiSource: source,
    fetchedAt: new Date().toISOString(),
  };

  switch (source) {
    case 'newsapi':
      return {
        ...baseArticle,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          name: article.source?.name || 'NewsAPI',
          id: article.source?.id,
        },
        author: article.author,
      };

    case 'gnews':
      return {
        ...baseArticle,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.image,
        publishedAt: article.publishedAt,
        source: {
          name: article.source?.name || 'GNews',
          url: article.source?.url,
        },
        author: null,
      };

    case 'currents':
      return {
        ...baseArticle,
        title: article.title,
        description: article.description,
        content: article.description,
        url: article.url,
        urlToImage: article.image !== 'None' ? article.image : null,
        publishedAt: article.published,
        source: {
          name: article.author || 'Currents',
        },
        author: article.author,
        category: article.category,
      };

    case 'newsdata':
      return {
        ...baseArticle,
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.link,
        urlToImage: article.image_url,
        publishedAt: article.pubDate,
        source: {
          name: article.source_id || 'NewsData',
        },
        author: article.creator?.[0] || null,
        keywords: article.keywords,
      };

    default:
      return { ...baseArticle, ...article };
  }
};

// Fetch from NewsAPI
const fetchFromNewsAPI = async (category, query, page = 1) => {
  if (!NEWS_API_KEY) return { articles: [], total: 0 };

  try {
    let url;
    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&language=en&pageSize=15&page=${page}&apiKey=${NEWS_API_KEY}`;
    } else {
      url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&pageSize=15&page=${page}&apiKey=${NEWS_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok') {
      return {
        articles: data.articles
          .filter(a => a.title !== '[Removed]' && a.urlToImage)
          .map(a => normalizeArticle(a, 'newsapi')),
        total: data.totalResults,
      };
    }
    return { articles: [], total: 0 };
  } catch (error) {
    console.error('NewsAPI Error:', error);
    return { articles: [], total: 0 };
  }
};

// Fetch from GNews
const fetchFromGNews = async (category, query, page = 1) => {
  if (!GNEWS_API_KEY) return { articles: [], total: 0 };

  try {
    let url;
    if (query) {
      url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
    } else {
      url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&max=10&apikey=${GNEWS_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.articles) {
      return {
        articles: data.articles.map(a => normalizeArticle(a, 'gnews')),
        total: data.totalArticles || data.articles.length,
      };
    }
    return { articles: [], total: 0 };
  } catch (error) {
    console.error('GNews Error:', error);
    return { articles: [], total: 0 };
  }
};

// Fetch from Currents API
const fetchFromCurrents = async (category, query) => {
  if (!CURRENTS_API_KEY) return { articles: [], total: 0 };

  try {
    let url;
    if (query) {
      url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query)}&language=en&apiKey=${CURRENTS_API_KEY}`;
    } else {
      url = `https://api.currentsapi.services/v1/latest-news?category=${category}&language=en&apiKey=${CURRENTS_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'ok' && data.news) {
      return {
        articles: data.news
          .filter(a => a.image && a.image !== 'None')
          .map(a => normalizeArticle(a, 'currents')),
        total: data.news.length,
      };
    }
    return { articles: [], total: 0 };
  } catch (error) {
    console.error('Currents API Error:', error);
    return { articles: [], total: 0 };
  }
};

// Fetch from NewsData.io
const fetchFromNewsData = async (category, query) => {
  if (!NEWSDATA_API_KEY) return { articles: [], total: 0 };

  try {
    let url;
    if (query) {
      url = `https://newsdata.io/api/1/news?q=${encodeURIComponent(query)}&language=en&apikey=${NEWSDATA_API_KEY}`;
    } else {
      url = `https://newsdata.io/api/1/news?category=${category}&language=en&apikey=${NEWSDATA_API_KEY}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'success' && data.results) {
      return {
        articles: data.results
          .filter(a => a.image_url)
          .map(a => normalizeArticle(a, 'newsdata')),
        total: data.totalResults || data.results.length,
      };
    }
    return { articles: [], total: 0 };
  } catch (error) {
    console.error('NewsData Error:', error);
    return { articles: [], total: 0 };
  }
};

// Main aggregation function - fetches from all available sources
export const aggregateNews = async (categoryId, page = 1) => {
  const categoryConfig = categoryMapping[categoryId] || categoryMapping.technology;
  const category = categoryConfig[categoryId] || 'technology';
  const query = categoryConfig.query || null;

  // Fetch from all sources in parallel
  const results = await Promise.allSettled([
    fetchFromNewsAPI(category, query, page),
    fetchFromGNews(category, query, page),
    fetchFromCurrents(category, query),
    fetchFromNewsData(category, query),
  ]);

  // Collect all articles
  let allArticles = [];
  let totalArticles = 0;
  const sourceStats = {};

  results.forEach((result, index) => {
    const sourceName = ['NewsAPI', 'GNews', 'Currents', 'NewsData'][index];
    if (result.status === 'fulfilled' && result.value.articles.length > 0) {
      allArticles = [...allArticles, ...result.value.articles];
      totalArticles += result.value.total;
      sourceStats[sourceName] = result.value.articles.length;
    } else {
      sourceStats[sourceName] = 0;
    }
  });

  // Remove duplicates based on title similarity
  const uniqueArticles = removeDuplicates(allArticles);

  // Sort by published date
  uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return {
    articles: uniqueArticles,
    totalArticles,
    sourceStats,
    sourcesUsed: Object.keys(sourceStats).filter(s => sourceStats[s] > 0),
  };
};

// Remove duplicate articles based on title similarity
const removeDuplicates = (articles) => {
  const seen = new Map();
  
  return articles.filter(article => {
    // Create a simplified title for comparison
    const simplifiedTitle = article.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 50);
    
    if (!simplifiedTitle || seen.has(simplifiedTitle)) {
      return false;
    }
    
    seen.set(simplifiedTitle, true);
    return true;
  });
};

// Search across all sources
export const searchAllSources = async (query, page = 1) => {
  const results = await Promise.allSettled([
    fetchFromNewsAPI(null, query, page),
    fetchFromGNews(null, query, page),
    fetchFromCurrents(null, query),
    fetchFromNewsData(null, query),
  ]);

  let allArticles = [];
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      allArticles = [...allArticles, ...result.value.articles];
    }
  });

  const uniqueArticles = removeDuplicates(allArticles);
  uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  return uniqueArticles;
};

// Get active API sources
export const getActiveSources = () => {
  return Object.entries(API_SOURCES)
    .filter(([, config]) => config.enabled)
    .map(([key, config]) => ({
      id: key,
      name: config.name,
      enabled: config.enabled,
    }));
};

// Check if multi-source is available
export const isMultiSourceEnabled = () => {
  const activeSources = getActiveSources();
  return activeSources.length > 1;
};

export default {
  aggregateNews,
  searchAllSources,
  getActiveSources,
  isMultiSourceEnabled,
};
