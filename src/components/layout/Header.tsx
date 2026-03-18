import { useState, useEffect, useRef } from 'react';
import { Search, Bell, Moon, Sun, Menu, Settings, LogOut, Shield, Mail, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../auth/AuthContext';
import clsx from 'clsx';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    }
  };

  return (
    <header className="h-20 bg-[#f8fafc]/80 dark:bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 z-10 sticky top-0 transition-all duration-300">
      <div className="flex items-center gap-6 flex-1">
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-11 pr-4 py-2.5 w-full bg-slate-200/50 dark:bg-slate-800/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-slate-200 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            
            <button className="p-2.5 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all relative">
              <Mail className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8fafc] dark:border-[#0f172a]"></span>
            </button>

            <button className="p-2.5 rounded-xl text-slate-500 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#f8fafc] dark:border-[#0f172a]"></span>
            </button>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden md:block"></div>

        <div className="relative" ref={userMenuRef}>
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner overflow-hidden">
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.email || 'Admin'}&background=2563eb&color=fff&bold=true`} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
            </div>
            <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">Alex Thompson</span>
                <span className="text-[11px] text-slate-500 font-medium">Fleet manager</span>
            </div>
            <ChevronDown className={clsx("w-4 h-4 text-slate-400 transition-transform hidden md:block", userMenuOpen && "rotate-180")} />
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#11131e] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                <p className="text-sm text-slate-900 dark:text-white font-bold">Administrator</p>
                <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || 'admin@alsundas.com'}</p>
              </div>
              <div className="p-2">
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all w-full text-left" onClick={() => setUserMenuOpen(false)}>
                  <Shield className="w-4 h-4 text-blue-500" /> Admin Panel
                </Link>
                <Link to="/settings" className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all w-full text-left" onClick={() => setUserMenuOpen(false)}>
                  <Settings className="w-4 h-4 text-slate-400" /> Settings
                </Link>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-2"></div>
                <button 
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all w-full text-left font-medium" 
                  onClick={() => {
                    setUserMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
