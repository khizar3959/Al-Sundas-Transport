import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Download, Filter, FileSpreadsheet, FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate and export financial and operational reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Financial Reports */}
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
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none">
                 <option>Last 30 Days</option>
                 <option>This Quarter</option>
                 <option>Year to Date</option>
                 <option>Custom Range</option>
               </select>
               <Button className="w-full gap-2"><Download className="w-4 h-4" /> Export CSV</Button>
            </div>
          </CardContent>
        </Card>

        {/* Expenses Reports */}
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
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none">
                 <option>Last 30 Days</option>
                 <option>This Quarter</option>
                 <option>Year to Date</option>
                 <option>Custom Range</option>
               </select>
               <Button className="w-full gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-white dark:text-slate-900"><Download className="w-4 h-4" /> Export PDF</Button>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Utilization Reports */}
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
               <select className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none">
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
