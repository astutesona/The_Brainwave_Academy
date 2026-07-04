import React, { useState } from 'react';
import { BookOpen, Map, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const ROADMAPS = {
  'java': [
    { step: 1, title: 'Procedural Basics', topic: 'Variables, loops, and primitive types in Java.', difficulty: 'Easy', status: 'done' },
    { step: 2, title: 'Classes & Objects', topic: 'Instantiating custom object components.', difficulty: 'Easy', status: 'done' },
    { step: 3, title: 'Object Oriented Principles', topic: 'Encapsulation, inheritance, polymorphism, and abstraction.', difficulty: 'Medium', status: 'in-progress' },
    { step: 4, title: 'Java Collections Framework', topic: 'ArrayList, LinkedList, Set, Map, HashMap, and Sorts.', difficulty: 'Medium', status: 'locked' },
    { step: 5, title: 'Threading & Concurrency', topic: 'Creating runnable instances, locks, and synchronized blocks.', difficulty: 'Hard', status: 'locked' },
  ],
  'dsa': [
    { step: 1, title: 'Big O Notation', topic: 'Time and space complexity growth math constraints.', difficulty: 'Easy', status: 'done' },
    { step: 2, title: 'Arrays & Strings', topic: 'Pointers, sliding windows, and hashing.', difficulty: 'Easy', status: 'done' },
    { step: 3, title: 'Stacks & Queues', topic: 'LIFO and FIFO operations, expression parsing.', difficulty: 'Medium', status: 'in-progress' },
    { step: 4, title: 'Trees & BSTs', topic: 'Left/Right rotations, traversals (pre, in, post order).', difficulty: 'Medium', status: 'locked' },
    { step: 5, title: 'Graphs & BFS/DFS', topic: 'Adjacency list matrix, search cycles, path optimizations.', difficulty: 'Hard', status: 'locked' },
    { step: 6, title: 'Dynamic Programming', topic: 'Memoization, tabulations, knapsack algorithms.', difficulty: 'Hard', status: 'locked' }
  ]
};

const BLOG_ARTICLES = [
  {
    id: 1,
    title: 'Top 50 Java OOP Interview Questions',
    category: 'Placement Prep',
    summary: 'A curation of the most repeated object-oriented questions by FAANG interviewers. Covers abstract class differences, final keywords, and dynamic dispatch.',
    date: 'July 1, 2026',
    readTime: '8 min read'
  },
  {
    id: 2,
    title: 'Unlocking Time Complexities: The Complete Guide to Big O',
    category: 'Algorithms',
    summary: 'Analyze your code growth rate mathematically. Learn about log N, quadratic operations, and why recursive calls impact space limits.',
    date: 'June 28, 2026',
    readTime: '12 min read'
  },
  {
    id: 3,
    title: 'Visualizing process state charts in OS',
    category: 'Computer Science',
    summary: 'Understand Process Control Blocks, ready queues, CPU scheduling context switches, and process death termination visuals.',
    date: 'June 25, 2026',
    readTime: '6 min read'
  }
];

export default function Blog() {
  const [activeSection, setActiveSection] = useState('roadmaps');
  const [activeRoadmap, setActiveRoadmap] = useState('dsa');
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      
      {/* Switcher Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-200 pb-4 mb-8 gap-4">
        <div>
          <h2 className="font-outfit text-2xl font-extrabold text-slate-800">Resource Center</h2>
          <p className="text-xs text-slate-500 mt-1">Read placement guides or follow visual learning roadmaps.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button 
            onClick={() => {
              setActiveSection('roadmaps');
              setSelectedArticle(null);
            }}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeSection === 'roadmaps' ? 'bg-electric-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Map className="h-4 w-4" />
            Roadmaps
          </button>
          <button 
            onClick={() => setActiveSection('articles')}
            className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeSection === 'articles' ? 'bg-electric-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <BookOpen className="h-4 w-4" />
            Articles
          </button>
        </div>
      </div>

      {/* ROADMAPS */}
      {activeSection === 'roadmaps' && (
        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setActiveRoadmap('dsa')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeRoadmap === 'dsa' ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20' : 'bg-slate-100 text-slate-500'}`}
            >
              DSA Roadmap
            </button>
            <button 
              onClick={() => setActiveRoadmap('java')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${activeRoadmap === 'java' ? 'bg-electric-blue/10 text-electric-blue border border-electric-blue/20' : 'bg-slate-100 text-slate-500'}`}
            >
              Java Path
            </button>
          </div>

          <div className="relative border-l border-slate-200 ml-4 pl-8 py-3 space-y-6 max-w-md mx-auto">
            {ROADMAPS[activeRoadmap].map((node) => {
              const done = node.status === 'done';
              const progress = node.status === 'in-progress';

              return (
                <div key={node.step} className="relative">
                  
                  {/* Timeline bullet */}
                  <span className={`absolute -left-12.5 top-0.5 h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                    done 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm' 
                      : progress 
                      ? 'bg-electric-blue border-electric-blue text-white shadow animate-pulse' 
                      : 'bg-white border-slate-250 text-slate-400'
                  }`}>
                    {done ? '✓' : node.step}
                  </span>

                  <div className={`p-4 rounded-xl border transition-all ${
                    progress ? 'border-electric-blue bg-white shadow-sm glow-blue' : 'border-slate-200 bg-white/70 hover:border-slate-350 shadow-xs'
                  }`}>
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-outfit text-xs font-bold text-slate-800">{node.title}</h4>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                        node.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' : 'bg-amber-50 text-amber-600 border border-amber-150'
                      }`}>
                        {node.difficulty}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{node.topic}</p>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* BLOG ARTICLES */}
      {activeSection === 'articles' && !selectedArticle && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BLOG_ARTICLES.map((article) => (
            <div 
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-electric-blue/30 transition duration-200 flex flex-col justify-between cursor-pointer shadow-sm hover:scale-[1.01] group"
            >
              <div className="space-y-1.5">
                <span className="text-[9px] text-electric-blue font-bold uppercase tracking-wider">{article.category}</span>
                <h3 className="font-outfit text-sm font-bold text-slate-800 group-hover:text-electric-blue transition-colors leading-snug">{article.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed truncate">{article.summary}</p>
              </div>

              <div className="mt-5 flex justify-between items-center border-t border-slate-100 pt-3 text-[9px] text-slate-450 font-mono">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail */}
      {activeSection === 'articles' && selectedArticle && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="text-xs text-slate-400 hover:text-slate-650 font-bold block mb-2 cursor-pointer"
          >
            ← Back to Articles
          </button>
          
          <div>
            <span className="text-[10px] text-electric-blue font-bold uppercase tracking-widest">{selectedArticle.category}</span>
            <h2 className="font-outfit text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 leading-tight">{selectedArticle.title}</h2>
            <div className="flex gap-3 text-[9px] text-slate-450 font-mono mt-1.5 border-b border-slate-100 pb-3">
              <span>Published: {selectedArticle.date}</span>
              <span>•</span>
              <span>{selectedArticle.readTime}</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed space-y-3 pt-1 font-sans">
            <p className="font-semibold text-slate-800">{selectedArticle.summary}</p>
            <p>Placement preparation requires practicing coding layouts, verifying algorithms runtime bounds, and structuring Object-oriented encapsulation limits. Our visual simulators assist in clarifying these parameters.</p>
            <h4 className="font-bold text-slate-850 pt-1">Resources & Roadmap steps:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Review asymptotic Big O analysis parameters.</li>
              <li>Practice compiler assertions using JavaScript sandbox runs.</li>
              <li>Consult dynamic AI Tutors on doubt threads.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}
