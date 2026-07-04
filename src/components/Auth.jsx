import React, { useState, useEffect } from 'react';
import { signJWT } from '../utils/jwt';
import { useApp } from '../context/AppContext';
import Logo from './Logo';
import { LogIn, UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Auth({ activeTab, setActiveTab }) {
  const { changeUserName, addNotification } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bw_registered_users');
    if (!saved) {
      const defaultUsers = [
        { username: 'ScholarDev', email: 'student@brainwave.edu', password: 'password123' }
      ];
      localStorage.setItem('bw_registered_users', JSON.stringify(defaultUsers));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all credentials.');
      return;
    }

    const usersRaw = localStorage.getItem('bw_registered_users');
    const users = usersRaw ? JSON.parse(usersRaw) : [
      { username: 'ScholarDev', email: 'student@brainwave.edu', password: 'password123' }
    ];

    if (!isLogin && !username) {
      setError('Please enter a username.');
      return;
    }

    if (!isLogin && !showOtp) {
      const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        setError('Email already registered. Please sign in instead.');
        return;
      }
      
      setShowOtp(true);
      addNotification('Verification Code Sent', `An OTP code has been sent to ${email}.`, 'warning');
      return;
    }

    if (!isLogin && showOtp) {
      if (otp !== '1234') {
        setError('Invalid OTP code. Please enter "1234" to test.');
        return;
      }
      
      // Save credentials but force sign-in
      const newUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem('bw_registered_users', JSON.stringify(users));

      setIsLogin(true);
      setShowOtp(false);
      setOtp('');
      setPassword('');
      addNotification('Registration Success', 'Account created successfully! Please sign in with your password.', 'success');
      return;
    }

    if (isLogin) {
      const matchUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!matchUser) {
        setError('Invalid email or password. New user? Please click Sign Up to register first.');
        return;
      }

      const tokenPayload = {
        name: matchUser.username,
        email: matchUser.email,
        role: 'STUDENT'
      };
      const signedToken = signJWT(tokenPayload, 'brainwave_secret_key');
      localStorage.setItem('bw_token', signedToken);

      changeUserName(matchUser.username);
      addNotification(
        'Welcome Back!',
        `Logged in successfully as ${matchUser.username}. JWT established.`,
        'success'
      );

      window.history.pushState({}, '', '/dashboard');
      setActiveTab('dashboard');
    }
  };

  const handleOAuth = (provider) => {
    addNotification('OAuth Redirect', `Connecting to ${provider} authentication servers...`, 'info');
    setTimeout(() => {
      const finalName = provider === 'Google' ? 'Google Scholar' : 'Github Developer';
      
      const tokenPayload = {
        name: finalName,
        email: `${finalName.toLowerCase().replace(' ', '')}@brainwave.edu`,
        provider: provider,
        role: 'STUDENT'
      };
      const signedToken = signJWT(tokenPayload, 'brainwave_secret_key');
      localStorage.setItem('bw_token', signedToken);

      changeUserName(finalName);
      addNotification('OAuth Success', `Logged in via ${provider} successfully. JWT established.`, 'success');
      window.history.pushState({}, '', '/dashboard');
      setActiveTab('dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-[calc(100vh-160px)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <Logo showText={true} />
        <h2 className="mt-6 text-center text-2xl font-extrabold text-slate-800 font-outfit">
          {isLogin ? 'Sign in to your account' : 'Create a new account'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Or{' '}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowOtp(false);
            }}
            className="font-bold text-electric-blue hover:text-electric-blue/80 underline cursor-pointer"
          >
            {isLogin ? 'start your 7-day premium trial' : 'sign in to your existing account'}
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-slate-200 shadow-sm rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && !showOtp && (
              <div>
                <label className="block text-xs font-bold text-slate-650 uppercase">Username</label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="FutureDev"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-electric-blue focus:bg-white text-xs px-9 py-2.5 rounded-lg focus:outline-none text-slate-850"
                  />
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            )}

            {!showOtp ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase">Email Address</label>
                  <div className="mt-1 relative rounded-md shadow-xs">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@brainwave.edu"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-electric-blue focus:bg-white text-xs px-9 py-2.5 rounded-lg focus:outline-none text-slate-850"
                    />
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-650 uppercase">Password</label>
                  <div className="mt-1 relative rounded-md shadow-xs">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 focus:border-electric-blue focus:bg-white text-xs px-9 py-2.5 rounded-lg focus:outline-none text-slate-850"
                    />
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-650 uppercase">Verification OTP (Enter 1234)</label>
                <div className="mt-1 relative rounded-md shadow-xs">
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="1234"
                    className="w-full bg-slate-50 border border-slate-250 text-center tracking-widest font-mono text-sm py-2.5 rounded-lg focus:outline-none focus:border-electric-blue text-slate-850 font-bold"
                  />
                </div>
                <p className="text-[10px] text-slate-450 mt-1.5 text-center">Type mock code "1234" to bypass verification check.</p>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-slate-250 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 text-slate-500">
                    Remember me
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => alert('Mock password reset code has been dispatched to your email address!')}
                  className="font-bold text-electric-blue hover:text-electric-blue/80 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-xs font-bold text-white bg-electric-blue hover:bg-electric-blue/90 focus:outline-none transition cursor-pointer"
              >
                {isLogin ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {showOtp ? 'Verify & Continue' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </form>

          {!showOtp && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-slate-400">Or connect with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOAuth('Google')}
                  className="w-full inline-flex justify-center items-center gap-1.5 py-2 px-4 border border-slate-200 rounded-lg bg-white text-xs font-bold text-slate-655 hover:bg-slate-50 shadow-xs cursor-pointer"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.465 0-6.286-2.82-6.286-6.285 0-3.466 2.82-6.286 6.286-6.286 1.525 0 2.923.548 4.01 1.455l3.053-3.053C18.966 2.062 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c5.897 0 10.874-4.237 10.874-11.24 0-.745-.078-1.4-.207-1.955H12.24z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  onClick={() => handleOAuth('GitHub')}
                  className="w-full inline-flex justify-center items-center gap-1.5 py-2 px-4 border border-slate-200 rounded-lg bg-white text-xs font-bold text-slate-655 hover:bg-slate-50 shadow-xs cursor-pointer"
                >
                  <svg className="h-4 w-4 text-slate-800 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
