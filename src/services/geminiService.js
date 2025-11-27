// Gemini AI Service for Article Summarization
// Provides instant digest versions of articles using Google's Gemini API

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Check if Gemini is configured
export const isGeminiConfigured = () => {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 10;
};

// Summarize a single article
export const summarizeArticle = async (article) => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `You are a professional news summarizer. Summarize the following news article in a clear, concise way. 

Title: ${article.title}

Content: ${article.description || article.content || 'No content available'}

Source: ${article.source?.name || 'Unknown'}

Provide a response in the following JSON format:
{
  "summary": "A 2-3 sentence summary of the key points",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "sentiment": "positive/negative/neutral",
  "readTime": "estimated read time in minutes for full article",
  "topics": ["topic1", "topic2"]
}

Return ONLY valid JSON, no markdown or extra text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to summarize');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Parse JSON response
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (parseError) {
      // If JSON parsing fails, return a structured response from the text
      return {
        summary: text.slice(0, 500),
        keyPoints: [],
        sentiment: 'neutral',
        readTime: '2-3',
        topics: [],
      };
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

// Generate a digest of multiple articles
export const generateDigest = async (articles, maxArticles = 5) => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  const articlesToSummarize = articles.slice(0, maxArticles);
  
  const articleList = articlesToSummarize.map((a, i) => 
    `${i + 1}. "${a.title}" - ${a.description?.slice(0, 200) || 'No description'}`
  ).join('\n\n');

  const prompt = `You are a tech news editor. Create a brief digest of these top tech news stories:

${articleList}

Provide a response in the following JSON format:
{
  "headline": "A catchy headline summarizing today's tech news",
  "overview": "A 2-3 sentence overview of the major themes",
  "stories": [
    {
      "title": "Brief title",
      "oneLiner": "One line summary"
    }
  ],
  "trendingTopics": ["topic1", "topic2", "topic3"]
}

Return ONLY valid JSON.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate digest');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini');
    }

    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Digest Generation Error:', error);
    throw error;
  }
};

// Analyze article sentiment and topics
export const analyzeArticle = async (article) => {
  if (!isGeminiConfigured()) {
    return {
      sentiment: 'neutral',
      topics: [],
      category: 'technology',
    };
  }

  const prompt = `Analyze this news headline and return JSON with sentiment (positive/negative/neutral), topics array, and primary category:

"${article.title}"

Return format: {"sentiment": "...", "topics": [...], "category": "..."}
Return ONLY valid JSON.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 150,
        },
      }),
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    return {
      sentiment: 'neutral',
      topics: [],
      category: 'technology',
    };
  }
};

// Chat with article - ask questions about the content
export const chatWithArticle = async (article, question) => {
  if (!isGeminiConfigured()) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Based on this news article, answer the user's question:

Article Title: ${article.title}
Article Content: ${article.description || article.content || 'Limited content available'}
Source: ${article.source?.name}

User Question: ${question}

Provide a helpful, concise answer based on the article content. If the answer isn't in the article, say so and provide relevant context if possible.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 300,
        },
      }),
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response';
  } catch (error) {
    console.error('Chat Error:', error);
    throw error;
  }
};

const geminiService = {
  isGeminiConfigured,
  summarizeArticle,
  generateDigest,
  analyzeArticle,
  chatWithArticle,
};

export default geminiService;
