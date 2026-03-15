import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2, Printer, Download } from 'lucide-react';

interface Income {
  id: string;
  date: string;
  customer: string;
  equipment: string;
  amount: number;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Cheque';
  invoiceNumber: string;
}

const mockIncome: Income[] = [
  { id: 'INC-001', date: '2026-03-10', customer: 'Emirates Contracting', equipment: 'Bobcat S450', amount: 5000, paymentMethod: 'Bank Transfer', invoiceNumber: 'INV-2026-001' },
  { id: 'INC-002', date: '2026-03-12', customer: 'Dubai Builders', equipment: 'Excavator 320', amount: 3500, paymentMethod: 'Cheque', invoiceNumber: 'INV-2026-002' },
  { id: 'INC-003', date: '2026-03-15', customer: 'Al Futtaim', equipment: 'Wheel Loader', amount: 1200, paymentMethod: 'Cash', invoiceNumber: 'INV-2026-003' },
];

export default function Income() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const columns = [
    { header: 'Date', accessorKey: 'date' as keyof Income, cell: (row: Income) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.date}</span> },
    { header: 'Invoice #', accessorKey: 'invoiceNumber' as keyof Income, cell: (row: Income) => <span className="font-medium text-slate-900 dark:text-white">{row.invoiceNumber}</span> },
    { header: 'Customer', accessorKey: 'customer' as keyof Income },
    { header: 'Equipment', accessorKey: 'equipment' as keyof Income, cell: (row: Income) => <span className="text-slate-500">{row.equipment}</span> },
    { 
      header: 'Amount', 
      cell: (row: Income) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">AED {row.amount.toLocaleString()}</span> 
    },
    { 
      header: 'Payment Method', 
      cell: (row: Income) => (
        <Badge variant={row.paymentMethod === 'Bank Transfer' ? 'info' : row.paymentMethod === 'Cheque' ? 'warning' : 'success'}>
          {row.paymentMethod}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="Download Print">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Income Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Log payments received and view income history.</p>
        </div>
      </div>

      <DataTable 
        data={mockIncome} 
        columns={columns} 
        searchPlaceholder="Search by customer or invoice..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Payment"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Income/Payment"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer</label>
              <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Customer...</option>
                <option>Emirates Contracting</option>
                <option>Dubai Builders</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (AED)</label>
              <input type="number" required min="0" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="0" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Payment Method</label>
              <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Bank Transfer</option>
                <option>Cheque</option>
                <option>Cash</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Equipment</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Equipment...</option>
                <option>Bobcat S450</option>
                <option>Excavator 320</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Invoice Reference</label>
              <input type="text" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="INV-..." />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
