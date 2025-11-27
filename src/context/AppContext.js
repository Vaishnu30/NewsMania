import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial State
const initialState = {
  darkMode: true,
  bookmarks: [],
  readingHistory: [],
  preferences: {
    categories: ['technology'],
    notifications: true,
    readingSpeed: 200, // words per minute
  },
  analytics: {
    articlesRead: 0,
    totalReadingTime: 0,
    topCategories: {},
    readingStreak: 0,
    lastReadDate: null,
  },
  ui: {
    sidebarOpen: false,
    searchOpen: false,
    modalOpen: null,
  }
};

// Action Types
const ACTIONS = {
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  ADD_BOOKMARK: 'ADD_BOOKMARK',
  REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  TOGGLE_SEARCH: 'TOGGLE_SEARCH',
  SET_MODAL: 'SET_MODAL',
  LOAD_STATE: 'LOAD_STATE',
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };

    case ACTIONS.ADD_BOOKMARK:
      if (state.bookmarks.find(b => b.url === action.payload.url)) {
        return state;
      }
      return {
        ...state,
        bookmarks: [{ ...action.payload, bookmarkedAt: new Date().toISOString() }, ...state.bookmarks]
      };

    case ACTIONS.REMOVE_BOOKMARK:
      return {
        ...state,
        bookmarks: state.bookmarks.filter(b => b.url !== action.payload)
      };

    case ACTIONS.ADD_TO_HISTORY:
      const existingIndex = state.readingHistory.findIndex(h => h.url === action.payload.url);
      let newHistory;
      if (existingIndex > -1) {
        newHistory = [
          { ...action.payload, readAt: new Date().toISOString(), readCount: (state.readingHistory[existingIndex].readCount || 1) + 1 },
          ...state.readingHistory.filter(h => h.url !== action.payload.url)
        ];
      } else {
        newHistory = [
          { ...action.payload, readAt: new Date().toISOString(), readCount: 1 },
          ...state.readingHistory
        ].slice(0, 100); // Keep last 100 articles
      }
      return { ...state, readingHistory: newHistory };

    case ACTIONS.CLEAR_HISTORY:
      return { ...state, readingHistory: [] };

    case ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case ACTIONS.UPDATE_ANALYTICS:
      const today = new Date().toDateString();
      const lastRead = state.analytics.lastReadDate;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      
      let streak = state.analytics.readingStreak;
      if (lastRead !== today) {
        if (lastRead === yesterday) {
          streak += 1;
        } else if (lastRead !== today) {
          streak = 1;
        }
      }

      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload,
          articlesRead: state.analytics.articlesRead + 1,
          readingStreak: streak,
          lastReadDate: today,
        }
      };

    case ACTIONS.TOGGLE_SIDEBAR:
      return { ...state, ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen } };

    case ACTIONS.TOGGLE_SEARCH:
      return { ...state, ui: { ...state.ui, searchOpen: !state.ui.searchOpen } };

    case ACTIONS.SET_MODAL:
      return { ...state, ui: { ...state.ui, modalOpen: action.payload } };

    case ACTIONS.LOAD_STATE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('techpulse_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: ACTIONS.LOAD_STATE, payload: parsed });
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    try {
      const toSave = {
        darkMode: state.darkMode,
        bookmarks: state.bookmarks,
        readingHistory: state.readingHistory,
        preferences: state.preferences,
        analytics: state.analytics,
      };
      localStorage.setItem('techpulse_state', JSON.stringify(toSave));
    } catch (e) {
      console.error('Error saving state:', e);
    }
  }, [state.darkMode, state.bookmarks, state.readingHistory, state.preferences, state.analytics]);

  // Actions
  const toggleDarkMode = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_DARK_MODE });
  }, []);

  const addBookmark = useCallback((article) => {
    dispatch({ type: ACTIONS.ADD_BOOKMARK, payload: article });
  }, []);

  const removeBookmark = useCallback((url) => {
    dispatch({ type: ACTIONS.REMOVE_BOOKMARK, payload: url });
  }, []);

  const isBookmarked = useCallback((url) => {
    return state.bookmarks.some(b => b.url === url);
  }, [state.bookmarks]);

  const addToHistory = useCallback((article) => {
    dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: article });
  }, []);

  const clearHistory = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_HISTORY });
  }, []);

  const updatePreferences = useCallback((prefs) => {
    dispatch({ type: ACTIONS.UPDATE_PREFERENCES, payload: prefs });
  }, []);

  const trackArticleRead = useCallback((category) => {
    dispatch({
      type: ACTIONS.UPDATE_ANALYTICS,
      payload: {
        topCategories: {
          ...state.analytics.topCategories,
          [category]: (state.analytics.topCategories[category] || 0) + 1
        }
      }
    });
  }, [state.analytics.topCategories]);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_SIDEBAR });
  }, []);

  const toggleSearch = useCallback(() => {
    dispatch({ type: ACTIONS.TOGGLE_SEARCH });
  }, []);

  const setModal = useCallback((modal) => {
    dispatch({ type: ACTIONS.SET_MODAL, payload: modal });
  }, []);

  const value = {
    ...state,
    toggleDarkMode,
    addBookmark,
    removeBookmark,
    isBookmarked,
    addToHistory,
    clearHistory,
    updatePreferences,
    trackArticleRead,
    toggleSidebar,
    toggleSearch,
    setModal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

export default AppContext;
