import React from 'react';

export default function Logo({ className = "h-10 w-auto", showText = true }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Image Logo */}
      <img 
        src="/logo.jpg" 
        alt="The BrainWave Academy Logo" 
        className="h-full w-auto aspect-square object-contain rounded-full shadow-xs filter drop-shadow-[0_0_6px_rgba(10,132,255,0.15)]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/favicon.svg"; // fallback if missing
        }}
      />
      
      {/* Readable text on the side if requested */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex font-outfit text-base sm:text-lg font-extrabold tracking-wide uppercase">
            <span className="text-slate-800">The Brain</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-orange to-amber-500">Wave</span>
          </div>
          <span className="font-outfit text-[9px] sm:text-[10px] font-semibold tracking-[0.24em] text-electric-blue uppercase">Academy</span>
        </div>
      )}
    </div>
  );
}
