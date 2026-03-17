import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, FileSpreadsheet, FileText, Filter, TrendingUp, TrendingDown, Truck, Users } from 'lucide-react';

interface Summary {
  totalIncome: number;
  totalExpenses: number;
  activeRentals: number;
  totalVehicles: number;
  totalCustomers: number;
}

export default function Reports() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    setIsLoading(true);
    try {
      const [incomeRes, expensesRes, rentalsRes, vehiclesRes, customersRes] = await Promise.all([
        supabase.from('income').select('amount'),
        supabase.from('expenses').select('amount'),
        supabase.from('rentals').select('id').eq('status', 'Active'),
        supabase.from('vehicles').select('id'),
        supabase.from('customers').select('id'),
      ]);

      const totalIncome = (incomeRes.data || []).reduce((sum, r) => sum + (r.amount || 0), 0);
      const totalExpenses = (expensesRes.data || []).reduce((sum, r) => sum + (r.amount || 0), 0);

      setSummary({
        totalIncome,
        totalExpenses,
        activeRentals: rentalsRes.data?.length || 0,
        totalVehicles: vehiclesRes.data?.length || 0,
        totalCustomers: customersRes.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching report summary:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const profit = (summary?.totalIncome || 0) - (summary?.totalExpenses || 0);

  const kpiCards = [
    { label: 'Total Income', value: `AED ${(summary?.totalIncome || 0).toLocaleString()}`, icon: TrendingUp, color: 'emerald' },
    { label: 'Total Expenses', value: `AED ${(summary?.totalExpenses || 0).toLocaleString()}`, icon: TrendingDown, color: 'red' },
    { label: 'Net Profit / Loss', value: `AED ${profit.toLocaleString()}`, icon: FileSpreadsheet, color: profit >= 0 ? 'blue' : 'orange' },
    { label: 'Active Rentals', value: summary?.activeRentals || 0, icon: Truck, color: 'orange' },
    { label: 'Fleet Size', value: summary?.totalVehicles || 0, icon: Truck, color: 'slate' },
    { label: 'Total Customers', value: summary?.totalCustomers || 0, icon: Users, color: 'purple' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and export financial and operational reports.</p>
        </div>
      </div>

      {/* Live KPI Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-2">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{card.label}</p>
            {isLoading ? (
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
            ) : (
              <p className="text-lg font-bold text-slate-900 dark:text-white">{card.value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Export Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Income & Revenue</h3>
              <p className="text-sm text-slate-500">Monthly breakdown</p>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Detailed ledger of all income sources, rentals, and payments received across selected timeframes.</p>
            <div className="flex flex-col gap-3">
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none dark:text-slate-200">
                 <option>Last 30 Days</option>
                 <option>This Quarter</option>
                 <option>Year to Date</option>
               </select>
               <Button className="w-full gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Expense Summary</h3>
              <p className="text-sm text-slate-500">Categorized outgoings</p>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Aggregate view of fuel, maintenance, salaries, and other operational expenses.</p>
            <div className="flex flex-col gap-3">
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none dark:text-slate-200">
                 <option>Last 30 Days</option>
                 <option>This Quarter</option>
                 <option>Year to Date</option>
               </select>
               <Button className="w-full gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-white dark:text-slate-900"><Download className="w-4 h-4" /> Export PDF</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Fleet Utilization</h3>
              <p className="text-sm text-slate-500">Rental hours & uptime</p>
            </div>
          </div>
          <CardContent className="p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Metrics on equipment usage, dormant days, and maintenance downtime analysis.</p>
            <div className="flex flex-col gap-3">
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none dark:text-slate-200">
                 <option>All Equipment</option>
                 <option>Excavators Only</option>
                 <option>Bobcats Only</option>
               </select>
               <Button variant="outline" className="w-full gap-2"><Download className="w-4 h-4" /> Export Excel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
