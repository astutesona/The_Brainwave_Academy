import React, { useRef } from 'react';
import { ArrowRight, Trophy, Brain } from 'lucide-react';

export default function Hero({ setActiveTab }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.log("Play interrupted:", err));
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const stats = [
    { value: '50,000+', label: 'Active Students' },
    { value: '500+', label: 'Visually Explained Lessons' },
    { value: '10,000+', label: 'Practice Quizzes' },
    { value: '100+', label: 'Coding Challenges' },
  ];

  return (
    <div className="relative overflow-hidden py-12 lg:py-16 min-h-[calc(100vh-70px)] flex flex-col justify-center bg-slate-50 font-sans">
      
      {/* Subtle background radial glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-96 w-96 rounded-full bg-electric-blue/5 blur-[128px]" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-golden-orange/5 blur-[128px]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-electric-blue/20 bg-electric-blue/5 text-electric-blue text-xs font-bold tracking-wider uppercase">
              <span className="h-2 w-2 rounded-full bg-electric-blue animate-pulse" />
              Visual Learning Pipeline
            </div>

            <div className="space-y-2">
              <h1 className="font-outfit text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                THE BRAINWAVE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-golden-orange">
                  ACADEMY
                </span>
              </h1>
              <h3 className="font-outfit text-lg sm:text-xl font-bold text-slate-700">
                Learn Today. Lead Tomorrow.
              </h3>
            </div>

            <p className="text-slate-650 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Master Object Oriented Programming, Data Structures & Algorithms, and Core Computer Science subjects visually. Practice with sandboxed live JavaScript compilers, gamified quiz arenas, and verified certificates.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => setActiveTab('tutorials')}
                className="group flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold bg-electric-blue hover:bg-electric-blue/90 text-white shadow-md hover:shadow-lg shadow-electric-blue/10 hover:scale-[1.01] transition-all cursor-pointer"
              >
                Start Learning
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => setActiveTab('quiz')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
              >
                <Trophy className="h-4 w-4 text-golden-orange" />
                Quiz Arena
              </button>

              <button 
                onClick={() => setActiveTab('ai-tutor')}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:scale-[1.01] transition-all cursor-pointer shadow-sm"
              >
                <Brain className="h-4 w-4 text-cyan-550" />
                Ask AI Tutor
              </button>
            </div>
          </div>

          {/* Right Hologram Video Visual Container */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-sm aspect-square rounded-2xl border border-slate-200 bg-white p-3 shadow-md glow-blue animate-float cursor-pointer overflow-hidden group"
            >
              {/* Dynamic Video Loop with Poster Fallback */}
              <video 
                ref={videoRef}
                src="/brain_wave_cinematic.mp4" 
                poster="/hero_brain_hologram.png"
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover rounded-xl border border-slate-100 shadow-inner"
              />
            </div>
          </div>

        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-350 hover:shadow-sm transition duration-200 flex flex-col items-center justify-center text-center group"
            >
              <span className="font-outfit text-2xl font-extrabold text-slate-800 tracking-tight group-hover:text-electric-blue transition-colors">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500 font-semibold mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
