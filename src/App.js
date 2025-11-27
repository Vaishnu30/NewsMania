import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import TechNews from "./Components/Newsmania";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import BookmarksPanel from "./Components/BookmarksPanel";
import AnalyticsPanel from "./Components/AnalyticsPanel";
import SearchModal from "./Components/SearchModal";
import ErrorBoundary from "./Components/ErrorBoundary";
import { ToastProvider } from "./Components/Toast";
import ScrollToTop from "./Components/ScrollToTop";

// Main App Content (inside provider)
const AppContent = () => {
  const { darkMode, toggleDarkMode } = useApp();
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // CMD/Ctrl + K for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      // CMD/Ctrl + B for bookmarks
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        setBookmarksOpen(prev => !prev);
      }
      // CMD/Ctrl + D for dark mode
      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setBookmarksOpen(false);
        setAnalyticsOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleDarkMode]);

  return (
    <div className={`${darkMode ? 'bg-slate-900' : 'bg-gray-100'} flex flex-col min-h-screen transition-colors duration-300`}>
      <Navbar 
        onBookmarksClick={() => setBookmarksOpen(true)}
        onAnalyticsClick={() => setAnalyticsOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />
      <TechNews />
      <Footer />
      
      {/* Panels */}
      <BookmarksPanel 
        isOpen={bookmarksOpen} 
        onClose={() => setBookmarksOpen(false)} 
      />
      <AnalyticsPanel 
        isOpen={analyticsOpen} 
        onClose={() => setAnalyticsOpen(false)} 
      />
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />

      {/* Scroll to Top */}
      <ScrollToTop />

      {/* Keyboard Shortcuts Help */}
      <div className={`fixed bottom-4 left-4 ${darkMode ? 'bg-slate-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-lg shadow-lg p-3 hidden lg:block border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <p className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Keyboard Shortcuts</p>
        <div className={`space-y-1 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="flex items-center gap-2">
            <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>⌘K</kbd>
            <span>Search</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>⌘B</kbd>
            <span>Bookmarks</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>⌘D</kbd>
            <span>Dark Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// App wrapper with Provider
const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;