import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Truck, CalendarCheck, Briefcase, 
  DollarSign, Receipt, Fuel, Wrench, FileText, FileSpreadsheet, 
  BarChart3, Bell, Settings, ChevronLeft, Menu
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Operators', path: '/operators', icon: Users },
  { name: 'Vehicles', path: '/vehicles', icon: Truck },
  { name: 'Rentals', path: '/rentals', icon: CalendarCheck },
  { name: 'Customers', path: '/customers', icon: Briefcase },
  { name: 'Income', path: '/income', icon: DollarSign },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Fuel Logs', path: '/fuel', icon: Fuel },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Documents', path: '/documents', icon: FileText },
  { name: 'Invoices', path: '/invoices', icon: FileSpreadsheet },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
];

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  return (
    <aside className={clsx(
      "h-full bg-white dark:bg-[#11131e] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col z-20",
      isOpen ? "w-64" : "w-16"
    )}>
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className={clsx("flex items-center gap-3 font-bold text-xl text-orange-500 overflow-hidden", !isOpen && "w-0 opacity-0 hidden")}>
          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5 text-orange-500" />
          </div>
          <span className="whitespace-nowrap">Al Sundas</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mx-auto"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
              isActive 
                ? "bg-orange-500/10 text-orange-600 dark:text-orange-500 font-medium" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
              !isOpen && "justify-center px-0"
            )}
            title={!isOpen ? item.name : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <span className={clsx("whitespace-nowrap transition-all duration-300", !isOpen && "w-0 opacity-0 hidden")}>
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
      
      <div className="p-3 border-t border-slate-200 dark:border-slate-800">
         <NavLink
            to="/settings"
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              isActive 
                ? "bg-orange-500/10 text-orange-600 dark:text-orange-500 font-medium" 
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800",
               !isOpen && "justify-center px-0"
            )}
            title={!isOpen ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className={clsx("whitespace-nowrap", !isOpen && "hidden")}>Settings</span>
          </NavLink>
      </div>
    </aside>
  );
}
