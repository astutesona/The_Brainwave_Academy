import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Tutorials from './components/Tutorials';
import Courses from './components/Courses';
import QuizArena from './components/QuizArena';
import CodingPractice from './components/CodingPractice';
import AITutor from './components/AITutor';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import Community from './components/Community';
import Blog from './components/Blog';
import Auth from './components/Auth';

const tabToPathMap = {
  'home': '/',
  'login': '/login',
  'signup': '/signup',
  'dashboard': '/dashboard',
  'tutorials': '/tutorials',
  'courses': '/courses',
  'quiz': '/quiz',
  'coding': '/practice',
  'ai-tutor': '/ai-tutor',
  'leaderboard': '/leaderboard',
  'community': '/discuss',
  'blog': '/blog'
};

const pathToTabMap = {
  '/': 'home',
  '/login': 'login',
  '/signup': 'signup',
  '/dashboard': 'dashboard',
  '/tutorials': 'tutorials',
  '/courses': 'courses',
  '/quiz': 'quiz',
  '/practice': 'coding',
  '/ai-tutor': 'ai-tutor',
  '/leaderboard': 'leaderboard',
  '/discuss': 'community',
  '/blog': 'blog'
};

function AppContent() {
  const [activeTab, setActiveTabState] = useState(() => {
    const path = window.location.pathname;
    return pathToTabMap[path] || 'home';
  });

  // Intercept setter to update URL bar
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const targetPath = tabToPathMap[tab] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  };

  // Sync state if user uses browser Back/Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const tab = pathToTabMap[path] || 'home';
      setActiveTabState(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Hero setActiveTab={setActiveTab} />;
      case 'login':
      case 'signup':
        return <Auth activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'tutorials':
        return <Tutorials setActiveTab={setActiveTab} />;
      case 'courses':
        return <Courses />;
      case 'quiz':
        return <QuizArena />;
      case 'coding':
        return <CodingPractice />;
      case 'ai-tutor':
        return <AITutor />;
      case 'dashboard':
        return <Dashboard />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'community':
        return <Community />;
      case 'blog':
        return <Blog />;
      default:
        return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-800 flex flex-col font-sans selection:bg-electric-blue/20 selection:text-slate-900">
      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main View Area */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 space-y-1.5 no-print">
        <p className="font-semibold text-slate-700">© 2026 The BrainWave Academy. All rights reserved.</p>
        <p className="font-mono text-[10px] text-slate-400 tracking-wider">WHERE KNOWLEDGE MEETS INNOVATION</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
