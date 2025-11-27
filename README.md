# TechPulse - Technology News Aggregator

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</div>

<div align="center">
  <h3>🚀 A modern, feature-rich technology news aggregator built with React</h3>
  <p>Real-time tech news • Smart bookmarking • Reading analytics • Keyboard shortcuts</p>
</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Screenshots](#-screenshots)
- [Performance](#-performance)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**TechPulse** is a sophisticated technology news aggregation platform that delivers curated content from the world of AI, startups, cryptocurrency, cybersecurity, and software development. Built with modern React patterns and designed for optimal user experience.

### 🏆 What Makes This Project Stand Out

| Feature | Implementation | Impact |
|---------|----------------|--------|
| **State Management** | Context API with useReducer | Predictable state updates, easy debugging |
| **Data Persistence** | LocalStorage integration | User preferences survive sessions |
| **Performance** | React.memo, useCallback, useMemo | Optimized re-renders, smooth UX |
| **Accessibility** | ARIA labels, keyboard navigation | WCAG compliant, inclusive design |
| **Code Quality** | Clean architecture, DRY principles | Maintainable, scalable codebase |

---

## 🔍 Problem Statement

### The Challenge

In today's rapidly evolving tech landscape, professionals face information overload. Key pain points include:

1. **Fragmented Sources**: Tech news is scattered across multiple platforms
2. **Time Constraints**: Professionals lack time to visit multiple sites
3. **Relevance Filtering**: Hard to find news specific to their interests
4. **No Personalization**: Generic news feeds don't adapt to reading patterns
5. **Context Switching**: Constantly jumping between apps/tabs

### The Solution

TechPulse addresses these challenges by providing:

- ✅ **Centralized Hub**: All tech news in one beautiful interface
- ✅ **Smart Categories**: Filter by AI, Startups, Crypto, Security, Dev
- ✅ **Personalization**: Bookmarks and reading history
- ✅ **Analytics**: Track reading habits and streaks
- ✅ **Efficient UX**: Keyboard shortcuts for power users

---

## ✨ Key Features

### 1. 📰 Real-Time News Aggregation
- Fetches latest news from NewsAPI
- 7 technology categories with smart queries
- Infinite scroll pagination
- Filters out low-quality/removed articles

### 2. 🔖 Smart Bookmarking System
- One-click bookmark saving
- Search through bookmarks
- Sort by date or alphabetically
- Persistent across sessions

### 3. 📊 Reading Analytics Dashboard
- Reading streak tracking
- Articles read counter
- Top sources visualization
- Weekly activity graph
- Complete reading history

### 4. 🔍 Advanced Search
- Real-time search with debouncing
- Keyboard navigation (↑↓ arrows)
- Recent searches display
- Quick article preview

### 5. 📤 Social Sharing
- Share to Twitter, LinkedIn, Facebook
- WhatsApp and Reddit integration
- Email sharing support
- One-click URL copy

### 6. 🌙 Dark/Light Mode
- System preference detection
- Smooth theme transitions
- Persistent preference
- Eye-friendly color schemes

### 7. ⌨️ Keyboard Shortcuts
- `⌘/Ctrl + K` - Open search
- `⌘/Ctrl + B` - Open bookmarks
- `⌘/Ctrl + D` - Toggle dark mode
- `ESC` - Close modals
- Arrow keys for navigation

### 8. 📱 Responsive Design
- Mobile-first approach
- Tablet optimized layouts
- Desktop power features
- Touch-friendly interactions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library with concurrent features |
| **Tailwind CSS 3** | Utility-first styling |
| **Context API** | Global state management |
| **Axios** | HTTP client for API calls |

### Key Patterns Used
- **Custom Hooks** - Reusable stateful logic
- **Compound Components** - Flexible component composition
- **Render Props** - Component logic sharing
- **Higher-Order Components** - Cross-cutting concerns

### APIs
- **NewsAPI** - News data provider

---

## 🏗 Architecture

```
src/
├── context/
│   └── AppContext.js          # Global state management
├── Components/
│   ├── Navbar.js              # Navigation with actions
│   ├── Newsmania.js           # Main news feed
│   ├── Cards.js               # Trending news cards
│   ├── Footer.js              # Site footer
│   ├── BookmarksPanel.js      # Bookmarks slide panel
│   ├── AnalyticsPanel.js      # Reading analytics
│   ├── SearchModal.js         # Global search
│   └── ShareModal.js          # Social sharing
├── App.js                     # Root component
├── index.js                   # Entry point
└── index.css                  # Global styles
```

### State Management Flow

```
┌─────────────────────────────────────────────────┐
│                  AppContext                      │
│  ┌─────────────────────────────────────────┐    │
│  │ State:                                   │    │
│  │  - darkMode, bookmarks, readingHistory  │    │
│  │  - preferences, analytics, ui           │    │
│  └─────────────────────────────────────────┘    │
│                      │                           │
│  ┌─────────────────────────────────────────┐    │
│  │ Actions:                                 │    │
│  │  - toggleDarkMode, addBookmark          │    │
│  │  - addToHistory, trackArticleRead       │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
                       │
     ┌─────────────────┼─────────────────┐
     ▼                 ▼                 ▼
 ┌────────┐      ┌──────────┐      ┌──────────┐
 │ Navbar │      │ TechNews │      │ Panels   │
 └────────┘      └──────────┘      └──────────┘
```

---

## 🚀 Installation

### Prerequisites
- Node.js 16+ 
- npm or yarn
- NewsAPI key (free at newsapi.org)

### Setup

```bash
# Clone the repository
git clone https://github.com/Vaishnu30/NewsMania.git

# Navigate to project directory
cd NewsMania

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Environment Variables (Optional)
Create a `.env` file:
```
REACT_APP_NEWS_API_KEY=your_api_key_here
```

---

## 📖 Usage

### Basic Navigation
1. **Browse Categories** - Click category tabs to filter news
2. **Search** - Press `⌘K` or click search to find articles
3. **Bookmark** - Click the bookmark icon on any article
4. **Share** - Click share icon to share via social media

### Power User Features
1. **Keyboard Navigation** - Use shortcuts for quick actions
2. **View Toggle** - Switch between grid and list views
3. **Analytics** - Track your reading habits in stats panel
4. **Dark Mode** - Toggle with `⌘D` for night reading

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + K` | Open search modal |
| `⌘/Ctrl + B` | Open bookmarks panel |
| `⌘/Ctrl + D` | Toggle dark/light mode |
| `↑` / `↓` | Navigate search results |
| `Enter` | Open selected article |
| `Escape` | Close any open modal |

---

## 📸 Screenshots

### Dark Mode - News Feed
- Modern dark theme with cyan accents
- Card-based article layout
- Category filter tabs
- Live update indicator

### Light Mode - List View
- Clean, professional appearance
- Compact list view option
- High contrast for readability

### Bookmarks Panel
- Slide-in panel design
- Search and sort functionality
- Quick access to saved articles

### Analytics Dashboard
- Reading streak visualization
- Top sources breakdown
- Weekly activity chart

---

## ⚡ Performance

### Optimizations Implemented

1. **Code Splitting** - Lazy loading of modals
2. **Memoization** - useMemo for expensive computations
3. **Debouncing** - Search input optimization
4. **Image Lazy Loading** - Native loading="lazy"
5. **State Batching** - Efficient re-renders

### Lighthouse Scores (Target)
- 🟢 Performance: 90+
- 🟢 Accessibility: 95+
- 🟢 Best Practices: 95+
- 🟢 SEO: 90+

---

## 🔮 Future Enhancements

- [ ] **User Authentication** - Login/signup with OAuth
- [ ] **Push Notifications** - Breaking news alerts
- [ ] **PWA Support** - Offline reading capability
- [ ] **AI Recommendations** - Personalized article suggestions
- [ ] **Reading List Sync** - Cross-device synchronization
- [ ] **Comment System** - User discussions
- [ ] **Custom RSS Feeds** - Add personal sources

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Vaishnu30**

- GitHub: [@Vaishnu30](https://github.com/Vaishnu30)

---

<div align="center">
  <p>⭐ Star this repo if you found it helpful!</p>
  <p>Built with ❤️ using React and Tailwind CSS</p>
</div>
