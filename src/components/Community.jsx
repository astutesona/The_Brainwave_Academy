import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, ArrowUp, Send, CheckCircle, HelpCircle } from 'lucide-react';

export default function Community() {
  const { doubts, addDoubt, upvoteDoubt, answerDoubt } = useApp();
  const [showAskForm, setShowAskForm] = useState(false);
  const [askTitle, setAskTitle] = useState('');
  const [askCategory, setAskCategory] = useState('OOP');
  const [askContent, setAskContent] = useState('');

  const [activeDoubtReplies, setActiveDoubtReplies] = useState({});
  const [replyText, setReplyText] = useState({});

  const handlePostDoubt = (e) => {
    e.preventDefault();
    if (askTitle.trim() && askContent.trim()) {
      addDoubt(askTitle.trim(), askCategory, askContent.trim());
      setAskTitle('');
      setAskContent('');
      setShowAskForm(false);
    }
  };

  const handlePostReply = (doubtId) => {
    const text = replyText[doubtId];
    if (text && text.trim()) {
      answerDoubt(doubtId, text.trim());
      setReplyText(prev => ({ ...prev, [doubtId]: '' }));
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      
      {/* Forum Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <div className="text-center sm:text-left">
          <h2 className="font-outfit text-2xl font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-2">
            <MessageSquare className="h-6 w-6 text-electric-blue" />
            Scholars Discuss
          </h2>
          <p className="text-xs text-slate-500 mt-1">Clarify compilation problems, explore layouts, or answer peer doubts.</p>
        </div>

        <button 
          onClick={() => setShowAskForm(!showAskForm)}
          className="px-4 py-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
        >
          {showAskForm ? 'Show Doubts' : 'Ask a Doubt'}
        </button>
      </div>

      {/* Ask Doubt Form */}
      {showAskForm && (
        <form onSubmit={handlePostDoubt} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 mb-8">
          <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider">Post Your Doubt</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Doubt Title</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Why does my recursive function trigger StackOverflowError?"
                value={askTitle}
                onChange={(e) => setAskTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-850 focus:outline-none focus:border-electric-blue"
              />
            </div>
            <div>
              <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Category</label>
              <select 
                value={askCategory}
                onChange={(e) => setAskCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-655 focus:outline-none focus:border-electric-blue uppercase cursor-pointer"
              >
                <option value="OOP">Object Oriented</option>
                <option value="DSA">DSA / Algorithms</option>
                <option value="DBMS">Database Core</option>
                <option value="OS">Operating Systems</option>
                <option value="CN">Networks</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block mb-1">Describe the Issue</label>
            <textarea 
              required
              rows={4}
              placeholder="Paste console compiler outputs, details of code, or logic bugs."
              value={askContent}
              onChange={(e) => setAskContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-electric-blue resize-none"
            />
          </div>

          <button 
            type="submit"
            className="px-5 py-2.5 bg-golden-orange hover:bg-golden-orange/90 text-black font-bold rounded-lg text-xs transition cursor-pointer"
          >
            Post Question (+10 XP)
          </button>
        </form>
      )}

      {/* Active Doubts */}
      {!showAskForm && (
        <div className="space-y-4">
          {doubts.map((doubt) => (
            <div key={doubt.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex gap-4">
              
              {/* Upvotes */}
              <div className="flex flex-col items-center select-none">
                <button 
                  onClick={() => upvoteDoubt(doubt.id)}
                  className="p-1.5 border border-slate-200 hover:border-electric-blue/40 bg-slate-50 rounded-lg hover:text-electric-blue text-slate-450 transition cursor-pointer"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <span className="font-mono font-bold text-slate-700 text-xs mt-1">{doubt.upvotes}</span>
                <span className="text-[8px] text-slate-400 uppercase font-bold mt-0.5">votes</span>
              </div>

              {/* Doubt details */}
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <span className="text-[9px] bg-electric-blue/10 border border-electric-blue/20 text-electric-blue px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      {doubt.category}
                    </span>
                    <h3 className="font-outfit text-sm font-bold text-slate-850 mt-1.5 leading-snug">{doubt.title}</h3>
                  </div>
                  <span className="text-[9px] text-slate-400 font-mono">By {doubt.author} • {doubt.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans bg-slate-50/50 p-3 rounded-lg border border-slate-150 whitespace-pre-line">
                  {doubt.content}
                </p>

                {/* Answers reply link */}
                <div className="border-t border-slate-100 pt-3">
                  <button 
                    onClick={() => setActiveDoubtReplies(prev => ({ ...prev, [doubt.id]: !prev[doubt.id] }))}
                    className="text-xs font-bold text-electric-blue hover:underline flex items-center gap-1.5"
                  >
                    View Answers ({doubt.answers.length})
                  </button>

                  {/* Reply block */}
                  {activeDoubtReplies[doubt.id] && (
                    <div className="mt-3 pl-3 border-l-2 border-slate-200 space-y-3 pt-1">
                      {doubt.answers.map((ans, idx) => (
                        <div key={idx} className="p-3 bg-slate-50/80 rounded-xl border border-slate-150">
                          <div className="flex justify-between items-start mb-1 text-[9px] font-bold">
                            <span className="text-golden-orange">{ans.author}</span>
                            <span className="text-slate-400 uppercase tracking-widest font-mono">Contributor</span>
                          </div>
                          <p className="text-xs text-slate-655 leading-relaxed">{ans.content}</p>
                        </div>
                      ))}

                      {/* Reply creator */}
                      <div className="flex gap-2 pt-1.5">
                        <input 
                          type="text" 
                          placeholder="Provide a detailed explanation or code solution..."
                          value={replyText[doubt.id] || ''}
                          onChange={(e) => setReplyText(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                          className="flex-grow bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-electric-blue"
                        />
                        <button 
                          onClick={() => handlePostReply(doubt.id)}
                          className="p-2 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg transition cursor-pointer"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
