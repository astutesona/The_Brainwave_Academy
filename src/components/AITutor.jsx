import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Brain, Send, Sparkles, HelpCircle, Code, ListCollapse, 
  Volume2, VolumeX, Paperclip, Image, Mic, Copy, RefreshCw, 
  ThumbsUp, ThumbsDown, FileText, Bookmark, BookOpen, Star, 
  ArrowRight, Play, CheckCircle2, User, Sparkle, AlertCircle,
  ChevronRight
} from 'lucide-react';

// Math/LaTeX & Code mock templates
const MOCK_AI_RESPONSES = {
  "explain concept": {
    text: "Here is an explanation of **Method Overriding (Polymorphism)**. In object-oriented programming, method overriding allows a subclass to provide a specific implementation of a method that is already defined in its superclass.\n\n### 📐 Mathematical Relation of Execution Complexity:\nFor $N$ polymorphic calls in a virtual dispatch table, the runtime overhead is:\n$$\nT(N) = O(N) \\times \\text{vtable_lookup} = O(N)\n$$\n\nHere is a C++ code demonstration:",
    code: `#include <iostream>
using namespace std;

class Animal {
public:
    virtual void makeSound() {
        cout << "Some generic animal sound" << endl;
    }
};

class Dog : public Animal {
public:
    void makeSound() override {
        cout << "🐶 Woof! Woof!" << endl;
    }
};

int main() {
    Animal* myPet = new Dog();
    myPet->makeSound(); // Output: Woof! Woof!
    delete myPet;
    return 0;
}`,
    output: "🐶 Woof! Woof!",
    card: {
      type: "practice",
      title: "Overriding Challenges",
      problems: 4,
      difficulty: "Medium"
    }
  },
  "generate quiz": {
    text: "I have dynamically generated a quiz on **Encapsulation & Access Modifiers**. Test your understanding of data guarding below:",
    card: {
      type: "quiz",
      title: "Encapsulation & Data Guarding Quiz",
      questions: 5,
      difficulty: "Medium"
    }
  },
  "create notes": {
    text: "I have prepared a comprehensive cheatsheet for **Operating Systems (Process Scheduling)**. Feel free to copy or save this card to your profile.",
    card: {
      type: "notes",
      title: "OS Scheduling Algorithms Cheatsheet",
      size: "1.4 MB",
      format: "PDF Notes"
    }
  },
  "debug code": {
    text: "I have identified the issues in your JavaScript Binary Search implementation. \n\n### 🔍 Issues Found:\n1. Semicolons were omitted in loop bounds.\n2. The mid calculation `(low + high) / 2` could overflow. Use `low + Math.floor((high - low) / 2)` instead.",
    code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    let mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    output: "binarySearch([1, 3, 5, 7, 9], 5) => Output: 2",
  },
  "roadmap": {
    text: "Here is your customized **MERN Stack Web Development Roadmap** outlining your learning paths from Frontend to Deployment:",
    roadmap: [
      { step: "1. Frontend Core", topics: ["HTML5 Semantic Tags", "CSS3 Grid & Flexbox", "Modern ES6+ JS"] },
      { step: "2. React Framework", topics: ["Hooks (State, Context)", "Dynamic Virtual Router", "Vite Bundler"] },
      { step: "3. Node & Express APIs", topics: ["Rest APIs", "JWT Security Middleware", "Postgres Prisma ORM"] },
      { step: "4. Deployment & DevOps", topics: ["Docker Sandboxing", "CI/CD Actions", "Vercel Deployments"] }
    ]
  }
};

export default function AITutor() {
  const { user, addXP, addNotification } = useApp();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your BrainWave AI Tutor. I can help you explain computer science concepts, debug code syntax, generate interactive quizzes, or design learning roadmaps.\n\nType a command below or click one of the quick learning actions!",
      timestamp: "10:54 AM"
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [runningCodeId, setRunningCodeId] = useState(null);
  const [codeOutput, setCodeOutput] = useState({});
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (textToSend = inputVal) => {
    if (!textToSend.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsgId = Date.now();
    
    // Append user message
    setMessages(prev => [...prev, {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: time
    }]);

    setInputVal('');
    setLoading(true);

    const query = textToSend.toLowerCase();
    
    // Simulate AI response synthesis
    setTimeout(() => {
      let aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: "I've analyzed your question. I am currently trained on OOP, Data Structures, DBMS normalizations, and Operating Systems. Try selecting 'Explain Concept' or 'Generate Quiz' above to preview advanced cards!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (query.includes('concept') || query.includes('polymorphism')) {
        aiResponse = { ...aiResponse, ...MOCK_AI_RESPONSES["explain concept"] };
      } else if (query.includes('quiz') || query.includes('mcq')) {
        aiResponse = { ...aiResponse, ...MOCK_AI_RESPONSES["generate quiz"] };
      } else if (query.includes('note') || query.includes('cheat')) {
        aiResponse = { ...aiResponse, ...MOCK_AI_RESPONSES["create notes"] };
      } else if (query.includes('debug') || query.includes('code') || query.includes('search')) {
        aiResponse = { ...aiResponse, ...MOCK_AI_RESPONSES["debug code"] };
      } else if (query.includes('roadmap') || query.includes('path')) {
        aiResponse = { ...aiResponse, ...MOCK_AI_RESPONSES["roadmap"] };
      }

      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
      addXP(15);
      addNotification('AI Response Synthesized', 'Earned +15 XP for studying with AI Tutor.', 'success');
    }, 1200);
  };

  const handleQuickAction = (actionKey, label) => {
    addNotification('AI Prompt Selected', `Requesting: ${label}`, 'info');
    handleSend(label);
  };

  const handleRunCode = (msgId, code, expectedOutput) => {
    setRunningCodeId(msgId);
    setTimeout(() => {
      setRunningCodeId(null);
      setCodeOutput(prev => ({
        ...prev,
        [msgId]: expectedOutput || "Code executed successfully. Exit status: 0."
      }));
    }, 1000);
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    addNotification('Copied to Clipboard', 'Text copied successfully.', 'success');
  };

  const quickActions = [
    { label: "Explain Concept", icon: Brain, key: "explain concept", desc: "Explain abstraction/polymorphism" },
    { label: "Generate Quiz", icon: HelpCircle, key: "generate quiz", desc: "Create interactive custom MCQ quiz" },
    { label: "Create Notes", icon: FileText, key: "create notes", desc: "Generate cheatsheet & PDF roadmap" },
    { label: "Debug Code", icon: Code, key: "debug code", desc: "Scan and resolve code syntax bugs" },
    { label: "Roadmap", icon: Sparkles, key: "roadmap", desc: "Create visual EdTech roadmap" }
  ];

  const sidebarStats = {
    level: user.level,
    xp: 540,
    streak: user.streak,
    rank: "#452",
    skills: [
      { name: "DSA / Algorithms", progress: 68 },
      { name: "OOP Principles", progress: 85 },
      { name: "DBMS / SQL", progress: 40 },
      { name: "Operating Systems", progress: 25 },
      { name: "Networks / TCP", progress: 10 }
    ],
    recentTopics: [
      "Polymorphism",
      "Binary Trees",
      "Normalization",
      "TCP/IP Layer",
      "Process Scheduling"
    ]
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 font-sans bg-slate-50 text-slate-800">
      
      {/* AI Assistant Hero Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-electric-blue/5 rounded-full blur-[64px]" />
        
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-electric-blue to-cyan-450 p-0.5 flex items-center justify-center shadow-sm">
            <div className="h-full w-full bg-white rounded-2xl flex items-center justify-center text-electric-blue">
              <Brain className="h-8 w-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="font-outfit text-xl font-extrabold text-slate-900 flex items-center justify-center sm:justify-start gap-2">
              🧠 BrainWave AI Tutor
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs font-mono font-bold text-slate-400">MODEL: GPT-SIMULATOR V4 (ONLINE)</p>
            <p className="text-xs text-slate-500 max-w-md">
              Ask queries, solve assignments, debug C++/Java code, generate quizzes, and receive study guides instantly.
            </p>
          </div>
        </div>

        {/* Stats columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t md:border-t-0 md:border-l border-slate-150 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Students</span>
            <div className="text-sm font-extrabold text-slate-800">100K+</div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CS Topics</span>
            <div className="text-sm font-extrabold text-slate-800">5000+</div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Accuracy</span>
            <div className="text-sm font-extrabold text-slate-800">95%</div>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Support</span>
            <div className="text-sm font-extrabold text-[#2f8d46]">24/7</div>
          </div>
        </div>
      </div>

      {/* Quick Action Button Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {quickActions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              onClick={() => handleQuickAction(act.key, act.desc)}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-electric-blue hover:shadow-md transition duration-300 text-left group flex flex-col justify-between h-28 cursor-pointer relative overflow-hidden"
            >
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-150 text-electric-blue group-hover:bg-electric-blue group-hover:text-white transition-colors duration-200 w-fit">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-outfit text-xs font-bold text-slate-850 group-hover:text-electric-blue transition-colors duration-200">{act.label}</h4>
                <p className="text-[9px] text-slate-450 mt-0.5 line-clamp-1">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: ChatGPT Chat Area */}
        <div className="lg:col-span-8 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col overflow-hidden min-h-[500px] max-h-[650px]">
            
            {/* Messages Display */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/20">
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div 
                    key={m.id}
                    className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Avatar */}
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs ${
                      isUser 
                        ? 'bg-gradient-to-tr from-amber-500 to-golden-orange text-black' 
                        : 'bg-electric-blue/10 border border-electric-blue/20 text-electric-blue'
                    }`}>
                      {isUser ? <User className="h-4.5 w-4.5" /> : <Brain className="h-4.5 w-4.5" />}
                    </div>

                    {/* Chat Bubble */}
                    <div className="space-y-2">
                      <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                        isUser
                          ? 'bg-gradient-to-r from-electric-blue to-blue-600 border-electric-blue text-white rounded-tr-none shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 rounded-tl-none shadow-xs'
                      }`}>
                        
                        {/* Render text with simple markdown formatting */}
                        <div className="whitespace-pre-line font-sans">
                          {m.text}
                        </div>

                        {/* Simulated Code Editor Block inside Chat Bubble */}
                        {m.code && (
                          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden bg-slate-900 text-slate-200">
                            <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
                              <span className="text-[10px] font-mono text-slate-400">C++ Implementation</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => handleCopyText(m.code)}
                                  className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer"
                                  title="Copy Code"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                                <button 
                                  onClick={() => handleRunCode(m.id, m.code, m.output)}
                                  className="text-emerald-400 hover:text-emerald-300 p-1 rounded transition flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                                >
                                  <Play className="h-3.5 w-3.5" />
                                  Run
                                </button>
                              </div>
                            </div>
                            <pre className="p-4 text-[10px] font-mono overflow-x-auto leading-relaxed max-h-56">
                              <code>{m.code}</code>
                            </pre>
                            
                            {/* Run code terminal output */}
                            {(codeOutput[m.id] || runningCodeId === m.id) && (
                              <div className="bg-black/90 p-3 border-t border-slate-800 text-[10px] font-mono text-emerald-400">
                                {runningCodeId === m.id ? (
                                  <span className="flex items-center gap-1.5 animate-pulse">
                                    <svg className="animate-spin h-3 w-3 text-emerald-400" viewBox="0 0 24 24" fill="none">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Compiling and executing on sandbox kernel...
                                  </span>
                                ) : (
                                  <>
                                    <div className="text-slate-500 select-none pb-0.5">// Terminal Output:</div>
                                    <div>{codeOutput[m.id]}</div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Roadmaps */}
                        {m.roadmap && (
                          <div className="mt-4 space-y-2 border-t pt-3">
                            <h4 className="font-bold text-slate-800 text-[11px] mb-2">Roadmap Steps:</h4>
                            {m.roadmap.map((rm, idx) => (
                              <div key={idx} className="flex gap-2 items-start text-[10px] p-2 bg-slate-50 rounded-lg border border-slate-150">
                                <span className="h-5 w-5 rounded bg-electric-blue/10 text-electric-blue font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
                                <div>
                                  <div className="font-bold text-slate-850">{rm.step}</div>
                                  <div className="text-slate-450 mt-0.5">{rm.topics.join(' • ')}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Content Cards Injected */}
                      {m.card && (
                        <div className="border border-slate-200 bg-white p-4 rounded-2xl shadow-xs space-y-3 w-72">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-amber-50 text-golden-orange">
                              {m.card.type === 'quiz' ? <HelpCircle className="h-4 w-4" /> : m.card.type === 'notes' ? <FileText className="h-4 w-4" /> : <Code className="h-4 w-4" />}
                            </div>
                            <div>
                              <h4 className="font-outfit text-xs font-bold text-slate-800 leading-tight">{m.card.title}</h4>
                              <span className="text-[9px] text-slate-400 capitalize">{m.card.type} Card</span>
                            </div>
                          </div>
                          
                          {m.card.type === 'quiz' && (
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span>Questions: {m.card.questions}</span>
                              <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">{m.card.difficulty}</span>
                            </div>
                          )}
                          {m.card.type === 'notes' && (
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span>Format: {m.card.format}</span>
                              <span>Size: {m.card.size}</span>
                            </div>
                          )}
                          {m.card.type === 'practice' && (
                            <div className="flex justify-between items-center text-[10px] text-slate-500">
                              <span>Challenges: {m.card.problems}</span>
                              <span className="bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded font-bold">{m.card.difficulty}</span>
                            </div>
                          )}

                          <button 
                            onClick={() => addNotification('Module Triggered', `${m.card.title} has been initialized.`, 'success')}
                            className="w-full py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-350 hover:bg-slate-100 text-slate-700 text-[10px] font-bold rounded-lg transition cursor-pointer flex justify-center items-center gap-1"
                          >
                            <span>Open Module</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Bubble Action Controls (Copy, Refresh, Like, Dislike) */}
                      {!isUser && (
                        <div className="flex items-center gap-2 text-slate-400 pl-1">
                          <button 
                            onClick={() => handleCopyText(m.text)}
                            className="hover:text-slate-650 p-1 transition cursor-pointer"
                            title="Copy Answer"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => handleSend(m.text)}
                            className="hover:text-slate-650 p-1 transition cursor-pointer"
                            title="Regenerate"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => addNotification('Feedback Saved', 'Thank you for liking the AI answer!', 'success')}
                            className="hover:text-slate-650 p-1 transition cursor-pointer"
                          >
                            <ThumbsUp className="h-3.5 w-3.5" />
                          </button>
                          <button 
                            onClick={() => addNotification('Feedback Logged', 'AI model flagged to review feedback.', 'warning')}
                            className="hover:text-slate-650 p-1 transition cursor-pointer"
                          >
                            <ThumbsDown className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-[9px] font-mono text-slate-400 ml-2">{m.timestamp}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex gap-4 max-w-[85%] mr-auto animate-pulse">
                  <div className="h-9 w-9 rounded-xl bg-electric-blue/10 border border-electric-blue/20 text-electric-blue flex items-center justify-center shrink-0">
                    <Brain className="h-4.5 w-4.5" />
                  </div>
                  <div className="space-y-2">
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-400">
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-3.5 w-3.5 text-electric-blue" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Synthesizing AI study guide...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Voice Wave Visualizer when Active */}
            {isVoiceActive && (
              <div className="bg-electric-blue/5 border-t border-slate-200/50 p-3 flex items-center justify-center gap-3">
                <span className="text-[10px] text-electric-blue font-bold tracking-wider animate-pulse">VOICE MODULE ACTIVE (LISTENING)</span>
                <div className="flex items-center gap-0.5 h-4">
                  <span className="w-0.5 bg-electric-blue animate-bounce h-2" style={{ animationDelay: '0.1s' }} />
                  <span className="w-0.5 bg-electric-blue animate-bounce h-4" style={{ animationDelay: '0.3s' }} />
                  <span className="w-0.5 bg-electric-blue animate-bounce h-3" style={{ animationDelay: '0.5s' }} />
                  <span className="w-0.5 bg-electric-blue animate-bounce h-1" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            )}

            {/* Input Form Bar */}
            <div className="p-4 bg-slate-50 border-t border-slate-150">
              <div className="relative flex items-center rounded-xl bg-white border border-slate-200 shadow-inner p-1 pl-3 focus-within:border-electric-blue transition-colors duration-200">
                
                {/* Textarea */}
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask anything... (e.g. 'Explain polymorphism', 'Generate quiz')"
                  className="flex-grow bg-transparent border-none text-xs text-slate-800 focus:outline-none py-2 pr-3"
                />

                {/* Toolbar Buttons */}
                <div className="flex items-center gap-1.5 pr-1 text-slate-400">
                  <button 
                    onClick={() => alert('Attachments limit: 5MB maximum.')}
                    className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                    title="Attach File"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => alert('Image Analyzer configured for JPG and PNG.')}
                    className="p-1.5 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                    title="Upload Image"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setIsVoiceActive(!isVoiceActive);
                      addNotification('Voice Mode', isVoiceActive ? 'Voice compiler paused.' : 'Voice recognition active.', 'info');
                    }}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      isVoiceActive 
                        ? 'bg-electric-blue/10 text-electric-blue' 
                        : 'hover:text-slate-650 hover:bg-slate-50'
                    }`}
                    title="Toggle Voice input"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleSend()}
                    className="p-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Learning Analytics Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* User Stats Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-20 w-20 bg-electric-blue/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Star className="h-4 w-4 text-golden-orange" />
              Student Progress
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Rank</span>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">{sidebarStats.rank}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Total XP</span>
                <div className="text-sm font-extrabold text-slate-800 mt-0.5">{sidebarStats.xp}</div>
              </div>
            </div>

            {/* Progress Bars for Subjects */}
            <div className="space-y-3 pt-2">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Subject Masteries</span>
              {sidebarStats.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-655">
                    <span>{skill.name}</span>
                    <span className="text-electric-blue">{skill.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div 
                      className="h-full bg-gradient-to-r from-electric-blue to-cyan-400 transition-all duration-500" 
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Topics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="h-4 w-4 text-golden-orange" />
              Recent Study Topics
            </h3>

            <div className="space-y-2">
              {sidebarStats.recentTopics.map((topic, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition text-[10px] text-slate-700 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f8d46]" />
                    {topic}
                  </span>
                  <span className="text-slate-400 text-[9px]">Verified</span>
                </div>
              ))}
            </div>

            {/* Recommended Next Topic Card */}
            <div className="p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/10 space-y-2.5 mt-2">
              <div>
                <span className="text-[8px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Recommended Next</span>
                <h4 className="font-outfit text-xs font-bold text-slate-800 mt-1.5">Virtual Functions in C++</h4>
                <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">Required for Advanced Dynamic Dispatch masteries.</p>
              </div>
              <button 
                onClick={() => addNotification('Recommended Module loaded', 'Opening Virtual Functions lesson.', 'success')}
                className="w-full py-1.5 bg-[#2f8d46] hover:bg-[#287b3d] text-white text-[10px] font-bold rounded-lg transition cursor-pointer flex justify-center items-center gap-1"
              >
                <span>Start Learning</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
