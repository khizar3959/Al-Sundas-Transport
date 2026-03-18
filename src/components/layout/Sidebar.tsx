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
      "h-full transition-all duration-300 flex flex-col z-20 print:hidden",
      "bg-[#0f172a] text-slate-400 border-r border-slate-800", // Dark Navy Sidebar
      isOpen ? "w-64" : "w-20"
    )}>
      <div className="h-20 flex items-center justify-between px-6">
        <div className={clsx("flex items-center gap-2 overflow-hidden", !isOpen && "w-0 opacity-0 hidden")}>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
             <div className="relative">
                <Truck className="w-5 h-5 text-white" />
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-blue-400 rounded-full border-2 border-[#0f172a]"></div>
             </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-sm tracking-tight leading-tight">Al Sundas</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Transport</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-md text-slate-500 hover:bg-slate-800 transition-colors mx-auto"
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "hover:bg-slate-800/50 hover:text-slate-200",
              !isOpen && "justify-center px-0"
            )}
            title={!isOpen ? item.name : undefined}
          >
            <item.icon className={clsx("w-5 h-5 shrink-0", !isOpen && "mx-auto")} />
            <span className={clsx("font-medium text-[13px] whitespace-nowrap transition-all duration-300", !isOpen && "hidden")}>
              {item.name}
            </span>
            {/* Active indicator dot/bar if needed - image shows a solid background for active */}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-slate-800">
         <NavLink
            to="/settings"
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
              isActive 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "hover:bg-slate-800/50 hover:text-slate-200",
               !isOpen && "justify-center px-0"
            )}
            title={!isOpen ? "Settings" : undefined}
          >
            <Settings className="w-5 h-5 shrink-0" />
            <span className={clsx("font-medium text-[13px] whitespace-nowrap", !isOpen && "hidden")}>Settings</span>
          </NavLink>
      </div>
    </aside>
  );
}
