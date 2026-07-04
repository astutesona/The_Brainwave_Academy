import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Flame } from 'lucide-react';

const MOCK_LEADERS = [
  { rank: 1, name: 'NikolaTesla_Coder', xp: 2450, streak: 42, badge: '⚡', level: 8 },
  { rank: 2, name: 'Ada_Lovelace_DSA', xp: 1980, streak: 28, badge: '💻', level: 6 },
  { rank: 3, name: 'Turing_Complete', xp: 1650, streak: 19, badge: '🧠', level: 5 },
  { rank: 4, name: 'ByteCommander', xp: 1200, streak: 12, badge: '🛠️', level: 4 },
  { rank: 5, name: 'AlgoNinja', xp: 950, streak: 8, badge: '🥷', level: 3 },
];

export default function Leaderboard() {
  const { user } = useApp();

  const allScholars = [
    ...MOCK_LEADERS,
    { rank: 6, name: `${user.name} (You)`, xp: user.xp + (user.level - 1) * 500, streak: user.streak, badge: '🎓', level: user.level }
  ].sort((a, b) => b.xp - a.xp);

  const sortedScholars = allScholars.map((s, idx) => ({ ...s, rank: idx + 1 }));

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      
      <div className="text-center mb-6">
        <h2 className="font-outfit text-2xl font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
          <Trophy className="h-6 w-6 text-golden-orange animate-bounce" />
          Global Leaderboard
        </h2>
        <p className="text-xs text-slate-500 mt-1">Scholars with the highest accumulated XP points this week.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 bg-slate-50 p-3.5 border-b border-slate-200 font-mono text-[9px] text-slate-500 font-bold uppercase">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Scholar</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-3 text-right">XP Points</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100">
          {sortedScholars.map((scholar, idx) => {
            const isSelf = scholar.name.includes('(You)');
            
            return (
              <div 
                key={idx} 
                className={`grid grid-cols-12 gap-2 p-3.5 items-center transition ${
                  isSelf ? 'bg-electric-blue/5 border-y border-electric-blue/15 font-bold' : 'hover:bg-slate-50/40'
                }`}
              >
                
                {/* Rank */}
                <div className="col-span-2 flex justify-center">
                  {scholar.rank === 1 ? (
                    <Medal className="h-5 w-5 text-golden-orange fill-golden-orange/5" />
                  ) : scholar.rank === 2 ? (
                    <Medal className="h-5 w-5 text-slate-400 fill-slate-100" />
                  ) : scholar.rank === 3 ? (
                    <Medal className="h-5 w-5 text-amber-600 fill-amber-50" />
                  ) : (
                    <span className="font-mono text-xs text-slate-450 font-bold">{scholar.rank}</span>
                  )}
                </div>

                {/* Name */}
                <div className="col-span-5 flex items-center gap-2">
                  <span className="text-sm select-none">{scholar.badge}</span>
                  <div className="truncate">
                    <span className={`text-xs block truncate ${isSelf ? 'text-slate-800 font-extrabold' : 'text-slate-700'}`}>
                      {scholar.name}
                    </span>
                    <span className="text-[10px] text-slate-450 font-mono flex items-center gap-0.5 mt-0.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 stroke-none" />
                      {scholar.streak}d streak
                    </span>
                  </div>
                </div>

                {/* Level */}
                <div className="col-span-2 text-center">
                  <span className={`text-xs font-semibold ${isSelf ? 'text-electric-blue font-bold' : 'text-slate-500'}`}>
                    Lvl {scholar.level}
                  </span>
                </div>

                {/* XP */}
                <div className="col-span-3 text-right">
                  <span className={`font-mono text-xs ${isSelf ? 'text-electric-blue font-bold' : 'text-slate-655'}`}>
                    {scholar.xp.toLocaleString()} XP
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
