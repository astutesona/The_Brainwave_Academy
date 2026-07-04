import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Flame, Award, Calendar, Share2, Printer, ChevronRight, Edit2, CheckCircle, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

export default function Dashboard() {
  const { user, courses, solvedProblems, badges, certificates, changeUserName, addNotification, logout } = useApp();
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [activeCert, setActiveCert] = useState(null);
  const [activeBadge, setActiveBadge] = useState(null);

  // Premium Subscription payment states
  const [isPremium, setIsPremium] = useState(() => localStorage.getItem('bw_premium') === 'true');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [invoice, setInvoice] = useState(() => {
    const saved = localStorage.getItem('bw_invoice');
    return saved ? JSON.parse(saved) : null;
  });

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'BRAINWAVE50') {
      setDiscount(50);
      alert('Coupon code BRAINWAVE50 applied! 50% discount activated.');
    } else {
      alert('Invalid coupon code. Try "BRAINWAVE50"!');
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cardNumber.length < 16) {
      alert('Please enter a valid 16-digit card number.');
      return;
    }
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setIsPremium(true);
      localStorage.setItem('bw_premium', 'true');
      
      const newInvoice = {
        invoiceId: 'INV-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        txId: 'TXN-' + Math.random().toString(36).substr(2, 12).toUpperCase(),
        date: new Date().toLocaleDateString(),
        amount: discount === 50 ? '$7.50' : '$15.00',
        plan: 'Premium Pro Annual'
      };
      setInvoice(newInvoice);
      localStorage.setItem('bw_invoice', JSON.stringify(newInvoice));
      setShowPaymentModal(false);
      addNotification('Subscription Active', 'Welcome to BrainWave Premium! All AI Tutors and exams unlocked.', 'success');
    }, 1500);
  };


  const handleSaveName = () => {
    if (newName.trim()) {
      changeUserName(newName.trim());
      setEditingName(false);
    }
  };

  const handlePrintCert = () => {
    window.print();
  };

  const completedCoursesCount = courses.filter(c => c.progress === 100).length;
  const totalLessonsChecked = courses.reduce((acc, curr) => {
    return acc + curr.lessons.filter(l => l.completed).length;
  }, 0);
  const unlockedBadgesCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Profile Overview Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50/50 to-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        
        {/* Subtly glowing overlay */}
        <div className="absolute top-0 right-0 h-40 w-40 bg-electric-blue/5 rounded-full blur-[64px]" />

        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          {/* Avatar sphere */}
          <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-electric-blue to-cyan-400 p-1 shadow-md animate-float">
            <div className="h-full w-full bg-white rounded-full flex items-center justify-center text-2xl font-black text-slate-800 select-none">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              {editingName ? (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    className="bg-white border border-slate-300 text-xs px-2.5 py-1 rounded text-slate-800 focus:outline-none focus:border-electric-blue"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-1 rounded text-[10px] cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-outfit text-lg font-extrabold text-slate-800">{user.name}</h2>
                  <button 
                    onClick={() => setEditingName(true)}
                    className="text-slate-400 hover:text-slate-650"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
            
            <p className="text-xs text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
              <Calendar className="h-3.5 w-3.5 text-electric-blue" />
              Member Since July 2026
            </p>
            <div className="flex items-center gap-1.5 justify-center sm:justify-start mt-2">
              <span className="text-[9px] bg-electric-blue/10 text-electric-blue border border-electric-blue/20 px-2.5 py-0.5 rounded-full font-bold uppercase">
                LVL {user.level} Scholar
              </span>
            </div>
          </div>
        </div>

        {/* Stats columns */}
        <div className="grid grid-cols-3 gap-6 text-center border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Level</span>
            <div className="text-lg font-extrabold text-slate-800 mt-0.5">{user.level}</div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Streak</span>
            <div className="text-lg font-extrabold text-amber-600 mt-0.5 flex items-center justify-center gap-0.5">
              <Flame className="h-4.5 w-4.5 fill-amber-500 stroke-none" />
              {user.streak}d
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Badges</span>
            <div className="text-lg font-extrabold text-golden-orange mt-0.5">{unlockedBadgesCount}</div>
          </div>
        </div>

      </div>

      {/* Grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Badge Showcase */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="h-4 w-4 text-golden-orange" />
              Badges Earned
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
               {badges.map((badge) => (
                <div 
                  key={badge.id}
                  onClick={() => setActiveBadge(badge)}
                  className={`p-4 rounded-xl border text-center relative transition duration-200 cursor-pointer ${
                    badge.unlocked 
                      ? 'bg-slate-50 border-slate-200 hover:border-golden-orange/40 shadow-sm hover:scale-[1.02]' 
                      : 'bg-slate-50/20 border-slate-100 opacity-55 hover:border-slate-300'
                  }`}
                  title={badge.unlocked ? `Click to view ${badge.name}` : `Locked: ${badge.desc}`}
                >
                  <div className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
                    {badge.imageUrl ? (
                      <img 
                        src={badge.imageUrl} 
                        alt={badge.name} 
                        className="h-10 w-10 mx-auto rounded-full object-cover border border-slate-200"
                      />
                    ) : badge.icon}
                  </div>
                  <h4 className="font-outfit text-xs font-bold text-slate-850 mt-2">{badge.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] mx-auto leading-relaxed">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats metrics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              Learning Analytics
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-450 uppercase font-bold">Lessons Checked</span>
                <div className="text-lg font-extrabold text-slate-800 mt-1">{totalLessonsChecked}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-450 uppercase font-bold">Courses Done</span>
                <div className="text-lg font-extrabold text-slate-800 mt-1">{completedCoursesCount}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-450 uppercase font-bold">Problems Solved</span>
                <div className="text-lg font-extrabold text-slate-800 mt-1">{solvedProblems.length}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[9px] text-slate-450 uppercase font-bold">Certificates</span>
                <div className="text-lg font-extrabold text-slate-800 mt-1">{certificates.length}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Premium Subscription Panel */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 relative overflow-hidden ${
            isPremium ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 bg-white'
          }`}>
            <div className="absolute top-0 right-0 h-24 w-24 bg-golden-orange/5 rounded-full blur-[32px] pointer-events-none" />
            
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="h-4 w-4 text-golden-orange" />
              Membership Plan
            </h3>

            {isPremium ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Tier Status:</span>
                  <span className="text-[10px] bg-amber-100 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded uppercase">Premium Active</span>
                </div>
                {invoice && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-500 font-mono space-y-1">
                    <div className="font-sans font-bold text-slate-700 text-[10px] mb-1">Invoice Receipt</div>
                    <div>Receipt: {invoice.invoiceId}</div>
                    <div>TX ID: {invoice.txId}</div>
                    <div>Date: {invoice.date}</div>
                    <div>Amount Paid: {invoice.amount}</div>
                  </div>
                )}
                <button 
                  onClick={() => {
                    setIsPremium(false);
                    localStorage.removeItem('bw_premium');
                    localStorage.removeItem('bw_invoice');
                    setInvoice(null);
                    addNotification('Subscription Terminated', 'Premium membership downgraded back to free basic tier.', 'warning');
                  }}
                  className="w-full py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-550 text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Cancel Subscription
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Tier Status:</span>
                  <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-500 font-bold px-2 py-0.5 rounded uppercase">Free Tier</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-sans">Unlock unlimited AI Tutor suggestions, certification credentials, premium badges, and placement roadmaps.</p>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2 bg-golden-orange hover:bg-golden-orange/90 text-black text-xs font-bold rounded-lg transition cursor-pointer text-center"
                >
                  Upgrade to Premium ($15/mo)
                </button>
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
              Certifications
            </h3>

            {certificates.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <Award className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">No credentials earned yet. Complete 100% of a course syllabus to generate certificates.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div 
                    key={cert.id}
                    onClick={() => setActiveCert(cert)}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-slate-50 hover:border-electric-blue/30 transition flex items-center justify-between cursor-pointer select-none group"
                  >
                    <div>
                      <h4 className="font-outfit text-xs font-bold text-slate-800 group-hover:text-electric-blue transition-colors leading-tight">{cert.courseTitle}</h4>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">ID: {cert.id}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-electric-blue transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* JWT Session Debugger */}
          {localStorage.getItem('bw_token') && (() => {
            const token = localStorage.getItem('bw_token');
            const parts = token.split('.');
            if (parts.length !== 3) return null;
            const [headerB64, payloadB64, signatureB64] = parts;
            
            let decodedHeader = '{}';
            let decodedPayload = '{}';
            try {
              decodedHeader = JSON.stringify(JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
              decodedPayload = JSON.stringify(JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
            } catch(e) {}

            return (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-outfit text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-3">
                  <ShieldAlert className="h-4 w-4 text-electric-blue" />
                  JWT Session Debugger
                </h3>
                
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your browser holds a cryptographically signed JSON Web Token for the current session.
                </p>

                {/* Color-coded parts */}
                <div className="p-3 bg-slate-900 rounded-lg text-[9px] font-mono break-all leading-normal">
                  <span className="text-red-400" title="Header (Algorithm & Token Type)">{headerB64}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-amber-400" title="Payload (User Claims)">{payloadB64}</span>
                  <span className="text-slate-500">.</span>
                  <span className="text-emerald-400" title="Signature">{signatureB64}</span>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Header</span>
                    <pre className="p-2.5 bg-slate-50 border border-slate-150 rounded text-[9px] font-mono text-red-500 overflow-x-auto">
                      {decodedHeader}
                    </pre>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">Payload (Decoded)</span>
                    <pre className="p-2.5 bg-slate-50 border border-slate-150 rounded text-[9px] font-mono text-amber-600 overflow-x-auto">
                      {decodedPayload}
                    </pre>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    logout();
                    window.history.pushState(null, '', '/');
                  }}
                  className="w-full py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-700 text-[10px] font-bold rounded-lg transition cursor-pointer text-center font-sans"
                >
                  Clear JWT (Logout)
                </button>
              </div>
            );
          })()}

        </div>

      </div>

      {/* Certificate Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl border border-slate-250 bg-white overflow-hidden shadow-2xl relative animate-float">
            
            <div className="flex justify-between items-center bg-slate-50 p-4 border-b border-slate-150 no-print">
              <span className="text-xs font-bold text-slate-500">Verified Certificate Credential</span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrintCert}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-electric-blue hover:bg-electric-blue/90 text-white rounded text-xs font-bold transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print / Save PDF
                </button>
                <button 
                  onClick={() => setActiveCert(null)}
                  className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Premium Parchment Certificate Frame */}
            <div className="p-8 sm:p-12 border-8 border-double border-[#FF9F0A]/40 bg-[#020817] text-center space-y-8 relative overflow-hidden print-padding text-white">
              
              <div className="flex justify-center">
                <Logo showText={true} className="h-14 w-auto" />
              </div>

              <div className="space-y-1">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#0A84FF]">Certificate of Achievement</span>
                <div className="h-0.5 w-32 bg-gradient-to-r from-transparent via-[#0A84FF] to-transparent mx-auto mt-2" />
              </div>

              <div className="space-y-4">
                <p className="font-serif text-sm italic text-slate-400">This is to certify that</p>
                <h2 className="font-outfit text-2xl sm:text-3xl font-extrabold text-white tracking-wide underline decoration-[#FF9F0A] underline-offset-8">
                  {activeCert.studentName}
                </h2>
                <p className="font-serif text-sm italic text-slate-450 mt-2">has successfully completed all curricular tracks for</p>
                <h3 className="font-outfit text-base sm:text-lg font-bold text-[#0A84FF] uppercase tracking-wide">
                  {activeCert.courseTitle}
                </h3>
              </div>

              <p className="text-[11px] text-slate-450 max-w-md mx-auto leading-relaxed">
                By fulfilling requirements of the visual syllabus, compiling dynamic code checks, completing Arena quizzes, and consultations with the BrainWave AI Tutor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-850/40 max-w-xl mx-auto items-center">
                <div className="flex flex-col items-center">
                  <span className="font-mono text-[8px] text-slate-500">VERIFICATION ID</span>
                  <span className="font-mono text-xs font-bold text-slate-300 mt-1">{activeCert.id}</span>
                </div>
                
                <div className="flex justify-center">
                  <div className="h-14 w-14 bg-white p-1 rounded border border-slate-200 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      <path d="M10 10h20v20H10zm0 50h20v20H10zm50 0h20v20H60zm0-50h20v20H60z" fill="#020817" />
                      <path d="M15 15h10v10H15zm0 50h10v10H15zm50 0h10v10H65zm0-50h10v10H65z" fill="#ffffff" />
                      <path d="M40 40h20v20H40zm5 5h10v10H45z" fill="#020817" />
                      <rect x="25" y="35" width="10" height="15" fill="#020817" />
                      <rect x="35" y="25" width="15" height="10" fill="#020817" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span className="text-xs font-bold italic text-slate-300 font-serif">BrainWave Faculty</span>
                  <div className="h-px w-20 bg-slate-700 my-1" />
                  <span className="text-[8px] text-slate-500 uppercase tracking-widest font-mono">Board of Directors</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full uppercase">
                  <CheckCircle className="h-3 w-3" />
                  Verified Credential
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Badge View & Download Modal */}
      {activeBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 relative text-center space-y-4 animate-float">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-slate-500">Badge Earned Details</span>
              <button 
                onClick={() => setActiveBadge(null)}
                className="text-slate-450 hover:text-slate-700 text-xs font-bold font-sans cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* High-res Badge Image */}
            <div className="flex justify-center py-2">
              <div className="h-44 w-44 rounded-full p-1 bg-gradient-to-tr from-golden-orange to-amber-500 shadow-md">
                <img 
                  src={activeBadge.imageUrl} 
                  alt={activeBadge.name} 
                  className="h-full w-full rounded-full object-cover border border-slate-100 shadow-inner"
                />
              </div>
            </div>

            {/* Badge Info */}
            <div className="space-y-1">
              <div className="flex justify-center">
                <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  activeBadge.unlocked 
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {activeBadge.unlocked ? 'Unlocked & Active' : 'Locked (Goal Incomplete)'}
                </span>
              </div>
              <h3 className="font-outfit text-base font-extrabold text-slate-800 tracking-wide mt-2">{activeBadge.name}</h3>
              <p className="text-xs text-slate-500 px-4 leading-relaxed">{activeBadge.desc}</p>
            </div>

            {/* Download Button */}
            <div className="pt-2">
              <a 
                href={activeBadge.imageUrl}
                download={`${activeBadge.name.toLowerCase().replace(' ', '_')}_badge.jpg`}
                onClick={() => {
                  addXP(25);
                  addNotification('Badge Saved', `Downloaded ${activeBadge.name} badge asset. Earned +25 XP!`, 'success');
                }}
                className="w-full inline-flex justify-center items-center gap-1.5 py-2 px-4 bg-electric-blue hover:bg-electric-blue/90 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer"
              >
                Download Badge Image
              </a>
            </div>

          </div>
        </div>
      )}
      
      {/* Stripe / Razorpay Mock Payment Checkout Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 relative">
            <h3 className="font-outfit text-base font-extrabold text-slate-800 flex items-center gap-2 border-b pb-3 mb-4">
              Premium Checkout Gateway
            </h3>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Card Number</label>
                <input 
                  type="text" 
                  required
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="4111 2222 3333 4444"
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs mt-1 focus:outline-none focus:border-electric-blue text-slate-850 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Expiry Date</label>
                  <input 
                    type="text" 
                    required
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs mt-1 focus:outline-none focus:border-electric-blue text-slate-850 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">CVV Code</label>
                  <input 
                    type="password" 
                    required
                    maxLength={3}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="•••"
                    className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs mt-1 focus:outline-none focus:border-electric-blue text-slate-850 font-mono"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Have a Promo Coupon? (Enter "BRAINWAVE50")</label>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="BRAINWAVE50"
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-electric-blue text-slate-850 uppercase font-bold"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500">Order Summary:</span>
                <span className="text-slate-800 text-sm">
                  {discount === 50 ? (
                    <>
                      <span className="line-through text-slate-400 mr-1.5">$15.00</span>
                      <span className="text-[#2f8d46]">$7.50 / year</span>
                    </>
                  ) : '$15.00 / year'}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit"
                  disabled={paymentProcessing}
                  className="flex-1 py-2 bg-[#2f8d46] hover:bg-[#287b3d] text-white rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer flex justify-center items-center gap-1.5"
                >
                  {paymentProcessing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : 'Pay & Subscribe'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-655 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
