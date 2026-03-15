import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2, FileText, Upload, Calendar, DollarSign, Calculator } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

interface Rental {
  id: string;
  customerName: string;
  companyName: string;
  phone: string;
  equipment: string;
  assignedOperator: string;
  startDate: string;
  endDate: string;
  rate: number;
  rateType: 'hourly' | 'daily';
  totalHours: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
}

const mockRentals: Rental[] = [
  { id: 'RN-1029', customerName: 'Tariq Al Habtoor', companyName: 'Emirates Contracting', phone: '+971 50 111 2222', equipment: 'Bobcat S450', assignedOperator: 'Ahmed Khan', startDate: '2026-03-10', endDate: '2026-03-20', rate: 150, rateType: 'hourly', totalHours: 80, totalAmount: 12000, paymentStatus: 'Partial' },
  { id: 'RN-1028', customerName: 'Faisal Al Maktoum', companyName: 'Dubai Builders', phone: '+971 55 333 4444', equipment: 'Excavator 320', assignedOperator: 'Muhammad Ali', startDate: '2026-03-15', endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], rate: 2500, rateType: 'daily', totalHours: 5, totalAmount: 12500, paymentStatus: 'Pending' },
  { id: 'RN-1027', customerName: 'Sarah Smith', companyName: 'Al Futtaim', phone: '+971 52 555 6666', equipment: 'Wheel Loader', assignedOperator: 'Sajid Mehmood', startDate: '2026-03-01', endDate: '2026-03-05', rate: 200, rateType: 'hourly', totalHours: 40, totalAmount: 8000, paymentStatus: 'Paid' },
];

export default function Rentals() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [rate, setRate] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);

  const getExpiryStatus = (dateStr: string) => {
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Completed', variant: 'default' as const };
    if (days <= 7) return { label: 'Ending Soon', variant: 'warning' as const };
    return { label: 'Active', variant: 'success' as const };
  };

  const columns = [
    { 
      header: 'Customer / Company', 
      cell: (row: Rental) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.customerName}</span>
          <span className="text-xs text-slate-500">{row.companyName}</span>
        </div>
      )
    },
    { 
      header: 'Equipment', 
      cell: (row: Rental) => (
        <div className="flex flex-col">
          <span className="text-slate-900 dark:text-white font-medium">{row.equipment}</span>
          <span className="text-xs text-slate-500">Op: {row.assignedOperator}</span>
        </div>
      )
    },
    { 
      header: 'Duration', 
      cell: (row: Rental) => {
        const status = getExpiryStatus(row.endDate);
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm">{row.startDate} to {row.endDate}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    { 
      header: 'Total Cost', 
      cell: (row: Rental) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white">AED {row.totalAmount.toLocaleString()}</span>
          <span className="text-xs text-slate-500">{row.totalHours} {row.rateType === 'hourly' ? 'hrs' : 'days'} @ AED {row.rate}</span>
        </div>
      )
    },
    { 
      header: 'Payment Status', 
      cell: (row: Rental) => (
        <Badge variant={row.paymentStatus === 'Paid' ? 'success' : row.paymentStatus === 'Partial' ? 'info' : 'warning'}>
          {row.paymentStatus}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors" title="Invoice">
            <DollarSign className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rentals & Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage equipment rentals, calculate costs, and track contracts.</p>
        </div>
      </div>

      <DataTable 
        data={mockRentals} 
        columns={columns} 
        searchPlaceholder="Search by customer, company, or equipment..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="New Rental Contract"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Rental Contract"
        className="max-w-2xl"
      >
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-orange-500" /> Customer Details
            </h3>
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
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <input type="tel" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 111 2222" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Calendar className="w-4 h-4 text-orange-500" /> Rental Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Equipment</label>
                <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="">Select Equipment...</option>
                  <option value="Bobcat S450">Bobcat S450</option>
                  <option value="Excavator 320">Excavator 320</option>
                  <option value="Wheel Loader 950">Wheel Loader 950</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Operator</label>
                <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="">Select Operator...</option>
                  <option value="Ahmed Khan">Ahmed Khan</option>
                  <option value="Muhammad Ali">Muhammad Ali</option>
                  <option value="Without Operator">Without Operator</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Calculator className="w-4 h-4 text-orange-500" /> Pricing Calculation
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rate Type</label>
                <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rate (AED)</label>
                <input type="number" required min="0" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 150" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Hours/Days</label>
                <input type="number" required min="0" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 80" />
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 flex items-center justify-between">
              <span className="font-medium text-orange-900 dark:text-orange-300">Calculated Total</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">AED {(rate * hours).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Create Contract</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
