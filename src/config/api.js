// API Configuration
// Uses environment variable with fallback for development

export const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY || '';

export const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// API Endpoints
export const endpoints = {
  topHeadlines: `${NEWS_API_BASE_URL}/top-headlines`,
  everything: `${NEWS_API_BASE_URL}/everything`,
};

// Category queries for better search results
export const categoryQueries = {
  technology: null, // Use top-headlines with category
  ai: 'artificial intelligence OR machine learning OR GPT OR neural network OR deep learning',
  startups: 'startup funding OR venture capital OR unicorn startup OR YCombinator OR seed funding',
  gadgets: 'gadgets OR smartphone OR iPhone OR Android OR laptop OR wearable tech',
  crypto: 'cryptocurrency OR bitcoin OR ethereum OR blockchain OR web3 OR DeFi',
  programming: 'programming OR software development OR javascript OR python OR React OR coding',
  cybersecurity: 'cybersecurity OR hacking OR data breach OR privacy OR malware OR ransomware',
};

// Fetch helper with error handling
export const fetchNews = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Build URL with params
export const buildUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, value);
    }
  });
  return url.toString();
};

// Check if API key is configured
export const isApiConfigured = () => {
  return !!NEWS_API_KEY && NEWS_API_KEY !== 'your_api_key_here';
};

export default {
  NEWS_API_KEY,
  NEWS_API_BASE_URL,
  endpoints,
  categoryQueries,
  fetchNews,
  buildUrl,
  isApiConfigured,
};
