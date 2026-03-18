import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, Github } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] flex overflow-hidden">
      {/* Left side: Professional Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-600/20 to-blue-600/20 blur-3xl opacity-50 animate-pulse"></div>
          <img 
            src="C:\Users\Hassan\.gemini\antigravity\brain\3ced0b7e-5567-4159-85cf-a85021784d92\fleet_management_hero_1773863683151.png" 
            alt="Fleet Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay grayscale"
          />
        </div>
        
        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex w-20 h-20 bg-orange-600 rounded-2xl items-center justify-center text-white mb-8 shadow-2xl shadow-orange-600/20 transform hover:rotate-6 transition-transform">
             <Truck className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-6 tracking-tight">
            The Engine of Your <br/> Transport Business
          </h1>
          <p className="text-lg text-slate-400 font-light leading-relaxed">
            Join thousands of operators streamlining their logistics and growing their fleet with FleetFlow.
          </p>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="absolute top-8 left-8 lg:hidden">
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
             <Truck className="w-6 h-6 text-orange-600" />
             <span className="font-bold text-slate-900 dark:text-white">FleetFlow</span>
           </div>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 dark:text-orange-500 font-semibold hover:underline"
              >
                {isLogin ? 'Sign up for free' : 'Sign in here'}
              </button>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth}>
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#11131e] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white text-sm transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-orange-600 dark:text-orange-500 hover:underline">Forgot password?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-[#11131e] border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:text-white text-sm transition-all"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
               size="lg" 
               className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/20 mt-2 h-12 rounded-xl group"
               isLoading={loading}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-50 dark:bg-[#0f111a] text-slate-500 uppercase tracking-widest text-[10px] font-bold">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-slate-500 dark:text-slate-400 font-bold mb-16">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Github className="w-5 h-5" /> GitHub
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
