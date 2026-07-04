import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { Bell, Flame, ChevronDown, Search, MessageSquare, Award, Trophy, BookOpen, Menu, X, CheckCircle, LogIn } from 'lucide-react';

const SEARCHABLE_ITEMS = [
  { name: 'Singly Linked List', type: 'tutorial', id: 'linked-list' },
  { name: 'Stack Structure', type: 'tutorial', id: 'stack' },
  { name: 'Queue Structure', type: 'tutorial', id: 'queue' },
  { name: 'Binary Tree', type: 'tutorial', id: 'binary-tree' },
  { name: 'Graph Representation', type: 'tutorial', id: 'graph' },
  { name: 'Binary Search', type: 'tutorial', id: 'binary-search' },
  { name: 'Linear Search', type: 'tutorial', id: 'linear-search' },
  { name: 'Bubble Sort', type: 'tutorial', id: 'bubble-sort' },
  { name: 'Merge Sort', type: 'tutorial', id: 'merge-sort' },
  { name: 'Quick Sort', type: 'tutorial', id: 'quick-sort' },
  { name: 'Two Sum', type: 'coding', id: 'p1' },
  { name: 'Reverse Linked List', type: 'coding', id: 'p2' },
  { name: 'Valid Parentheses', type: 'coding', id: 'p3' },
  { name: 'Quiz Arena', type: 'quiz', id: 'quiz' },
  { name: 'Leaderboard', type: 'leaderboard', id: 'leaderboard' },
  { name: 'Blog & Roadmaps', type: 'blog', id: 'blog' },
  { name: 'Community Discussions', type: 'community', id: 'community' },
];

export default function Header({ activeTab, setActiveTab }) {
  const { user, notifications, setActiveTutorialTopic } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // GFG dropdown hover/click states
  const [activeDropdown, setActiveDropdown] = useState(null); // 'tutorials' | 'practice' | null
  
  // Search bar states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update suggestions on search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim()) {
      const matched = SEARCHABLE_ITEMS.filter(item => 
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchSuggestions(matched);
    } else {
      setSearchSuggestions([]);
    }
  };

  // Click on a search item suggestion
  const handleSelectSuggestion = (item) => {
    setSearchQuery('');
    setSearchSuggestions([]);
    
    if (item.type === 'tutorial') {
      setActiveTutorialTopic(item.id);
      setActiveTab('tutorials');
    } else if (item.type === 'coding') {
      // In coding practice tab, activeProb state handles it. But we can redirect to coding tab
      setActiveTab('coding');
    } else {
      setActiveTab(item.type);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchSuggestions.length > 0) {
      handleSelectSuggestion(searchSuggestions[0]);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white no-print shadow-xs font-sans">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo + GFG Search Bar */}
        <div className="flex items-center space-x-6 flex-1">
          {/* Circular Emblem Logo */}
          <div className="cursor-pointer shrink-0" onClick={() => { setActiveTab('home'); setActiveDropdown(null); }}>
            <Logo showText={true} />
          </div>

          {/* GFG Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            ref={searchRef}
            className="hidden md:block relative max-w-md w-72 lg:w-96"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search tutorials, topics, coding problems..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#f3f4f6] border border-slate-250 focus:border-[#2f8d46] focus:bg-white text-xs px-9 py-2.5 rounded-md focus:outline-none transition-all duration-200 text-slate-800"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>

            {/* Suggestions list drop */}
            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-50 divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSuggestion(item)}
                    className="px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-550 border px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Center: GFG Dropdowns & Links */}
        <nav className="hidden lg:flex items-center space-x-1.5 pr-6">
          
          {/* Home Link */}
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'home' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            Home
          </button>
          
          {/* Tutorials Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('tutorials')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold transition-all ${
                activeTab === 'tutorials' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
              }`}
            >
              Tutorials
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {activeDropdown === 'tutorials' && (
              <div className="absolute left-0 mt-0 w-56 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 max-h-96 overflow-y-auto shadow-xl">
                <div className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Data Structures</div>
                <button
                  onClick={() => { setActiveTutorialTopic('linked-list'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Singly Linked List
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('stack'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Stack Structure
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('queue'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Queue Structure
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('binary-tree'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Binary Tree
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('graph'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Graph Representation
                </button>
                <div className="h-px bg-slate-100 my-1.5" />
                <div className="px-3.5 py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">Algorithms</div>
                <button
                  onClick={() => { setActiveTutorialTopic('binary-search'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Binary Search
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('linear-search'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Linear Search
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('bubble-sort'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Bubble Sort
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('merge-sort'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Merge Sort
                </button>
                <button
                  onClick={() => { setActiveTutorialTopic('quick-sort'); setActiveTab('tutorials'); }}
                  className="w-full text-left px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Quick Sort
                </button>
              </div>
            )}
          </div>

          {/* Courses */}
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'courses' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            Courses
          </button>

          {/* Practice Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('practice')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button 
              className={`flex items-center gap-1 px-3 py-2 text-xs font-bold transition-all ${
                ['coding', 'quiz', 'leaderboard'].includes(activeTab) ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
              }`}
            >
              Practice
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            {activeDropdown === 'practice' && (
              <div className="absolute left-0 mt-0 w-48 bg-white border border-slate-200 rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => setActiveTab('coding')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Coding Problems
                </button>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Quiz Arena
                </button>
                <button
                  onClick={() => setActiveTab('leaderboard')}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#2f8d46]"
                >
                  Leaderboard
                </button>
              </div>
            )}
          </div>

          {/* AI Tutor */}
          <button
            onClick={() => setActiveTab('ai-tutor')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'ai-tutor' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            AI Tutor
          </button>

          {/* Community */}
          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'community' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            Discuss
          </button>

          {/* Blog & Roadmaps */}
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'blog' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            Blog
          </button>

          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 text-xs font-bold transition-all ${
              activeTab === 'dashboard' ? 'text-[#2f8d46]' : 'text-slate-700 hover:text-[#2f8d46]'
            }`}
          >
            Dashboard
          </button>

        </nav>

        {/* Right Side: Stats, Notifications, Mobile controls */}
        <div className="flex items-center space-x-3">
          
          {/* Daily Streak */}
          <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-amber-600 font-bold text-[10px]" title="Streak">
            <Flame className="h-3.5 w-3.5 fill-amber-500 stroke-none" />
            <span>{user.streak}d</span>
          </div>

          {/* User badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 border border-slate-200 bg-slate-50 text-[10px] rounded text-slate-655 font-semibold">
            <span>Lvl</span>
            <span className="text-[#2f8d46] font-bold">{user.level}</span>
          </div>

          {/* Login Icon Button */}
          <button 
            onClick={() => setActiveTab('login')}
            className={`p-2 border rounded-lg transition cursor-pointer flex items-center justify-center ${
              ['login', 'signup'].includes(activeTab) 
                ? 'bg-[#2f8d46] border-[#2f8d46] text-white shadow-xs' 
                : 'border-slate-200 text-slate-550 hover:border-slate-350 hover:bg-slate-50'
            }`}
            title="Account Access (Login / Register)"
          >
            <LogIn className="h-4.5 w-4.5" />
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-golden-orange" />
            </button>

            {/* Dropdown notifications */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-xl border border-slate-200 bg-white shadow-lg p-3 z-50">
                <div className="flex items-center justify-between border-b pb-1.5 mb-2.5 text-xs">
                  <span className="font-bold text-slate-700">Notifications</span>
                  <span className="text-[10px] text-slate-400 font-bold">{notifications.length} Unread</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-100 hover:bg-slate-100/50 transition">
                      <div className="flex justify-between items-start">
                        <span className={`font-semibold ${n.type === 'success' ? 'text-emerald-600' : 'text-slate-700'}`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{n.time}</span>
                      </div>
                      <p className="text-slate-550 mt-0.5">{n.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-700 rounded-lg"
          >
            {mobileMenuOpen ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1.5 shadow-inner">
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded text-xs font-bold ${activeTab === 'home' ? 'text-[#2f8d46] bg-slate-50' : 'text-slate-655'}`}
          >
            Home
          </button>
          
          <div className="h-px bg-slate-100 my-1" />
          <div className="px-3 text-[9px] font-bold text-slate-450 uppercase tracking-widest">Tutorials</div>
          <div className="max-h-60 overflow-y-auto space-y-1">
            <button
              onClick={() => { setActiveTutorialTopic('linked-list'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Singly Linked List
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('stack'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Stack Structure
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('queue'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Queue Structure
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('binary-tree'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Binary Tree
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('graph'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Graph Representation
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('binary-search'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Binary Search
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('linear-search'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Linear Search
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('bubble-sort'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Bubble Sort
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('merge-sort'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Merge Sort
            </button>
            <button
              onClick={() => { setActiveTutorialTopic('quick-sort'); setActiveTab('tutorials'); setMobileMenuOpen(false); }}
              className="w-full text-left pl-6 py-1 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
            >
              Quick Sort
            </button>
          </div>
          
          <div className="h-px bg-slate-100 my-1" />
          <div className="px-3 text-[9px] font-bold text-slate-455 uppercase tracking-widest">Practice</div>
          <button
            onClick={() => { setActiveTab('coding'); setMobileMenuOpen(false); }}
            className="w-full text-left pl-6 py-1.5 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
          >
            Coding Platform
          </button>
          <button
            onClick={() => { setActiveTab('quiz'); setMobileMenuOpen(false); }}
            className="w-full text-left pl-6 py-1.5 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
          >
            Quiz Arena
          </button>
          <button
            onClick={() => { setActiveTab('leaderboard'); setMobileMenuOpen(false); }}
            className="w-full text-left pl-6 py-1.5 rounded text-xs font-semibold text-slate-600 hover:text-[#2f8d46]"
          >
            Leaderboard
          </button>

          <div className="h-px bg-slate-100 my-1" />
          <button
            onClick={() => { setActiveTab('ai-tutor'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded text-xs font-bold ${activeTab === 'ai-tutor' ? 'text-[#2f8d46] bg-slate-50' : 'text-slate-655'}`}
          >
            AI Tutor
          </button>
          <button
            onClick={() => { setActiveTab('community'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded text-xs font-bold ${activeTab === 'community' ? 'text-[#2f8d46] bg-slate-50' : 'text-slate-655'}`}
          >
            Discuss Forum
          </button>
          <button
            onClick={() => { setActiveTab('blog'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded text-xs font-bold ${activeTab === 'blog' ? 'text-[#2f8d46] bg-slate-50' : 'text-slate-655'}`}
          >
            Blog
          </button>
          <button
            onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded text-xs font-bold ${activeTab === 'dashboard' ? 'text-[#2f8d46] bg-slate-50' : 'text-slate-655'}`}
          >
            Student Profile
          </button>
        </div>
      )}
    </header>
  );
}
