import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Shield, BarChart3, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0f111a]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                FleetFlow
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
              <a href="#features" className="hover:text-orange-600 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-orange-600 transition-colors">Pricing</a>
              <a href="#about" className="hover:text-orange-600 transition-colors">About</a>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-sm" onClick={() => navigate('/login')}>Sign In</Button>
              <Button className="text-sm bg-orange-600 hover:bg-orange-700 text-white" onClick={() => navigate('/login')}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/3 animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-6 border border-orange-200 dark:border-orange-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            Now supporting multi-fleet tracking
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-[1.1]">
            Manage Your Fleet with <br/>
            <span className="text-orange-600">Precision & Power</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-light">
            The all-in-one platform for transport companies to track rentals, optimize expenses, and generate professional invoices in seconds.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white text-base h-12 px-8 shadow-xl shadow-orange-600/20 group" onClick={() => navigate('/login')}>
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-base h-12 px-8">
              Watch Demo
            </Button>
          </div>

          {/* Dashboard Preview Overlay */}
          <div className="relative mx-auto mt-20 max-w-5xl">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#0f111a] via-transparent to-transparent z-10 h-[100px] bottom-0"></div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#11131e] p-2 shadow-2xl relative group overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <img 
                 src="C:\Users\Hassan\.gemini\antigravity\brain\3ced0b7e-5567-4159-85cf-a85021784d92\fleet_management_hero_1773863683151.png" 
                 alt="Dashboard Preview" 
                 className="rounded-xl w-full h-auto shadow-inner border border-slate-100 dark:border-slate-800/50 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
               />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white dark:bg-[#0c0e16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to grow
            </h2>
            <p className="text-slate-500 dark:text-slate-400">Streamlined tools designed specifically for transport operators.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Smart Analytics', desc: 'Real-time insights into your fleet utilization and financial health.' },
              { icon: Shield, title: 'Secure Operations', desc: 'Keep your business data safe with enterprise-grade encryption and RLS.' },
              { icon: CreditCard, title: 'Automated Billing', desc: 'Generate and send professional VAT invoices in a single click.' },
              { icon: Truck, title: 'Fleet Tracking', desc: 'Monitor vehicle maintenance, fuel logs, and operator assignments.' },
              { icon: BarChart3, title: 'Expense Control', desc: 'Categorize spending and identify cost-saving opportunities easily.' },
              { icon: CheckCircle2, title: 'Document Vault', desc: 'All your vehicle registrations and permits in one accessible place.' }
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-[#11131e] hover:border-orange-500/50 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section id="pricing" className="py-24 bg-slate-50 dark:bg-[#0f111a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-16 dark:text-white">Simple, transparent pricing</h2>
          <div className="max-w-lg mx-auto p-8 rounded-3xl bg-white dark:bg-[#11131e] border-2 border-orange-600 shadow-2xl relative">
            <div className="absolute top-0 right-12 -translate-y-1/2 px-4 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">MOST POPULAR</div>
            <p className="text-slate-500 uppercase tracking-widest text-sm font-bold mb-4">Professional</p>
            <div className="flex items-baseline justify-center gap-1 mb-6">
              <span className="text-5xl font-extrabold text-slate-900 dark:text-white">AED 499</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="text-left space-y-4 mb-10">
              {['Unlimited Vehicles', 'Real-time Analytics', 'VAT Invoice Generation', 'Priority Support', 'Daily Backups'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-orange-500" /> {item}
                </li>
              ))}
            </ul>
            <Button size="lg" className="w-full bg-slate-900 dark:bg-orange-600 hover:bg-orange-700 text-white h-14" onClick={() => navigate('/login')}>
              Start 14-Day Free Trial
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f111a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-600 rounded flex items-center justify-center text-white">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 dark:text-white text-lg">FleetFlow</span>
           </div>
           <p className="text-slate-500 text-sm">© 2026 FleetFlow. All rights reserved.</p>
           <div className="flex gap-6 text-sm text-slate-500">
             <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
             <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
             <a href="#" className="hover:text-orange-600 transition-colors">Contact</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
