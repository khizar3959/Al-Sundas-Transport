import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2 } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  type: string;
  amount: number;
  vehicle: string;
  description: string;
}

const mockExpenses: Expense[] = [
  { id: 'EXP-001', date: '2026-03-08', type: 'Fuel', amount: 450, vehicle: 'Bobcat S450', description: 'Diesel refill' },
  { id: 'EXP-002', date: '2026-03-09', type: 'Maintenance', amount: 1200, vehicle: 'Excavator 320', description: 'Hydraulic oil change and filter' },
  { id: 'EXP-003', date: '2026-03-11', type: 'Salary', amount: 3500, vehicle: 'N/A', description: 'Ahmed Khan monthly salary advance' },
  { id: 'EXP-004', date: '2026-03-14', type: 'Spare Parts', amount: 800, vehicle: 'Wheel Loader', description: 'Tire replacement' },
];

export default function Expenses() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getExpenseColor = (type: string) => {
    switch(type) {
      case 'Fuel': return 'info';
      case 'Maintenance': return 'warning';
      case 'Salary': return 'success';
      case 'Spare Parts': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' as keyof Expense, cell: (row: Expense) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.date}</span> },
    { 
      header: 'Type', 
      cell: (row: Expense) => (
        <Badge variant={getExpenseColor(row.type) as any}>{row.type}</Badge>
      )
    },
    { 
      header: 'Amount', 
      cell: (row: Expense) => <span className="font-semibold text-slate-900 dark:text-white">AED {row.amount.toLocaleString()}</span> 
    },
    { header: 'Vehicle', accessorKey: 'vehicle' as keyof Expense, cell: (row: Expense) => <span className="text-slate-500">{row.vehicle}</span> },
    { header: 'Description', accessorKey: 'description' as keyof Expense, cell: (row: Expense) => <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px] block" title={row.description}>{row.description}</span> },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Log outgoings categorized by fuel, maintenance, salaries, etc.</p>
        </div>
      </div>

      <DataTable 
        data={mockExpenses} 
        columns={columns} 
        searchPlaceholder="Search expenses..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Expense"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log New Expense"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expense Type</label>
              <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Type...</option>
                <option>Fuel</option>
                <option>Maintenance</option>
                <option>Salary</option>
                <option>Spare Parts</option>
                <option>Transport</option>
                <option>Others</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (AED)</label>
              <input type="number" required min="0" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Vehicle (Optional)</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">None / General</option>
                <option>Bobcat S450</option>
                <option>Excavator 320</option>
              </select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea rows={2} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Details about this expense..."></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Expense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
