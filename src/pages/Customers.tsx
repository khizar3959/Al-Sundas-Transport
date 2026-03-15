import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Mail, Phone, ExternalLink } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  totalRentals: number;
  totalPayments: number;
  outstandingBalance: number;
}

const mockCustomers: Customer[] = [
  { id: 'CUS-001', name: 'Tariq Al Habtoor', company: 'Emirates Contracting', phone: '+971 50 111 2222', email: 'tariq@emirates-contracting.ae', address: 'Business Bay, Dubai', totalRentals: 15, totalPayments: 245000, outstandingBalance: 12000 },
  { id: 'CUS-002', name: 'Faisal Al Maktoum', company: 'Dubai Builders', phone: '+971 55 333 4444', email: 'faisal@dubaibuilders.ae', address: 'Al Quoz Ind 2, Dubai', totalRentals: 4, totalPayments: 45000, outstandingBalance: 0 },
  { id: 'CUS-003', name: 'Sarah Smith', company: 'Al Futtaim', phone: '+971 52 555 6666', email: 'procurement@alfuttaim.ae', address: 'Dubai Festival City', totalRentals: 32, totalPayments: 1250000, outstandingBalance: 45000 },
];

export default function Customers() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const columns = [
    { 
      header: 'Customer / Company', 
      cell: (row: Customer) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-slate-500 font-medium">{row.company}</span>
        </div>
      )
    },
    { 
      header: 'Contact Info', 
      cell: (row: Customer) => (
        <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {row.phone}</div>
          <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {row.email}</div>
        </div>
      )
    },
    { 
      header: 'Total Rentals', 
      cell: (row: Customer) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-sm">
          {row.totalRentals}
        </span>
      )
    },
    { 
      header: 'Total Payments', 
      cell: (row: Customer) => (
         <span className="text-emerald-600 dark:text-emerald-400 font-medium">AED {row.totalPayments.toLocaleString()}</span>
      )
    },
    { 
      header: 'Outstanding Balance', 
      cell: (row: Customer) => (
        <Badge variant={row.outstandingBalance > 0 ? 'danger' : 'success'}>
          {row.outstandingBalance > 0 ? `AED ${row.outstandingBalance.toLocaleString()}` : 'Settled'}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="View Details">
            <ExternalLink className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage client directory, view balances, and track rental history.</p>
        </div>
      </div>

      <DataTable 
        data={mockCustomers} 
        columns={columns} 
        searchPlaceholder="Search customers by name, company, or phone..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Customer"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
              <input type="text" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Tariq Al Habtoor" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
              <input type="text" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Emirates Contracting" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
              <input type="tel" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 111 2222" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="email@company.ae" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing Address</label>
              <textarea rows={2} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Full address..."></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Customer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
