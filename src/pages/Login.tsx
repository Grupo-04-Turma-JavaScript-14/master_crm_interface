import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PointillismAnimation from '../components/PointillismAnimation';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('token', 'fake-jwt-token');
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white font-sans text-slate-900">
      {/* Left side - Animation */}
      <div className="hidden md:block w-1/2 bg-slate-100 relative overflow-hidden">
        <PointillismAnimation />
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col relative p-8">
        <div className="flex-1 flex items-center justify-center w-full max-w-[420px] mx-auto">
          <div className="w-full flex flex-col">
            {/* Logo */}
            <div className="flex justify-center mb-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-2xl tracking-tighter">M</span>
              </div>
            </div>

            {/* Headers */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Welcome back!</h2>
              <p className="text-slate-500 text-sm">Your work, your team, your flow — all in one place.</p>
            </div>

            {/* Social Logins */}
            <div className="flex gap-4 mb-6">
              <button type="button" className="flex-1 py-2.5 px-4 border border-slate-200 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Sign In with Google
              </button>
              <button type="button" className="flex-1 py-2.5 px-4 border border-slate-200 rounded-full flex items-center justify-center text-sm font-semibold hover:bg-slate-50 transition-colors">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.09 2.31-.83 3.63-.78 1.25.04 2.24.47 2.92 1.34-2.5 1.4-2.05 4.91.42 5.92-.56 1.58-1.55 3.06-2.05 5.69zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Sign In with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-4 text-slate-400">Or</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm placeholder-slate-400 transition-shadow"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-black hover:bg-slate-900 text-white font-semibold rounded-xl transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                Sign in with email
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <a href="#" className="font-semibold text-slate-900 hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex gap-6 justify-center mt-auto text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition-colors">Help</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
        </div>
      </div>
    </div>
  );
}
