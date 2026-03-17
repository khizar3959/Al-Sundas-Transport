import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2, FileText, Calendar, Calculator } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

type PaymentStatus = 'Paid' | 'Partial' | 'Pending';

interface Rental {
  id: string;
  customerName?: string;
  companyName?: string;
  phone?: string;
  equipment?: string;
  assignedOperator?: string;
  start_date: string;
  end_date: string;
  rate?: number;
  rateType?: 'hourly' | 'daily';
  totalHours?: number;
  total_amount: number;
  payment_status: PaymentStatus;
}

export default function Rentals() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dummy form state
  const [rate, setRate] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    setIsLoading(true);
    // Since we don't have full joins yet, we'll fetch raw rentals
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching rentals:', error);
    } else {
      // Map to UI friendly format
      const formatted = (data || []).map(r => ({
        ...r,
        customerName: 'Customer ID: ' + String(r.customer_id).substring(0,8),
        companyName: 'Company Name',
        equipment: 'Vehicle ID: ' + String(r.vehicle_id).substring(0,8),
        assignedOperator: r.operator_id ? 'Assigned' : 'Unassigned',
        rateType: 'daily',
        totalHours: differenceInDays(parseISO(r.end_date), parseISO(r.start_date)) || 1,
        rate: r.total_amount / (differenceInDays(parseISO(r.end_date), parseISO(r.start_date)) || 1)
      }));
      setRentals(formatted);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rental contract?')) return;
    
    const { error } = await supabase
      .from('rentals')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rental:', error);
      alert('Failed to delete rental.');
    } else {
      setRentals(rentals.filter(r => r.id !== id));
    }
  };

  const handleAddRental = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // NOTE: In a real app we'd attach actual UUIDs here. 
    // For this UI demo we'll use placeholder or null UUIDs to satisfy the schema DB constraint
    const newRental = {
      start_date: formData.get('startDate') as string,
      end_date: formData.get('endDate') as string,
      total_amount: Number(formData.get('rate')) * Number(formData.get('totalHours')),
      payment_status: 'Pending',
    };

    const { data, error } = await supabase
      .from('rentals')
      .insert([newRental])
      .select();

    if (error) {
      console.error('Error creating rental:', error);
      alert('Failed to create rental contract.');
    } else if (data) {
      // Re-fetch to get correct mapping
      fetchRentals();
      setIsAddModalOpen(false);
      // reset form
      setRate(0);
      setHours(0);
    }
  };

  const getExpiryStatus = (dateStr: string) => {
    if (!dateStr) return { label: 'Unknown', variant: 'default' as const };
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
        const status = getExpiryStatus(row.end_date);
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm">{row.start_date} to {row.end_date}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    { 
      header: 'Total Cost', 
      cell: (row: Rental) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white">AED {(row.total_amount || 0).toLocaleString()}</span>
          <span className="text-xs text-slate-500">{row.totalHours} {row.rateType === 'hourly' ? 'hrs' : 'days'} @ AED {row.rate}</span>
        </div>
      )
    },
    { 
      header: 'Payment Status', 
      cell: (row: Rental) => (
        <Badge variant={row.payment_status === 'Paid' ? 'success' : row.payment_status === 'Partial' ? 'info' : 'warning'}>
          {row.payment_status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (row: Rental) => (
        <div className="flex flex-row items-center gap-2">
          <button 
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors" 
            title="Delete"
            onClick={() => handleDelete(row.id)}
          >
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rentals & Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage equipment rentals, calculate costs, and track contracts.</p>
        </div>
      </div>

      <DataTable 
        data={rentals} 
        columns={columns} 
        searchPlaceholder="Search by customer, company, or equipment..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="New Rental Contract"
        isLoading={isLoading}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create Rental Contract"
        className="max-w-2xl"
      >
        <form className="space-y-6" onSubmit={handleAddRental}>
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <FileText className="w-4 h-4 text-orange-500" /> Customer Details
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
                <input type="text" name="customerName" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Tariq Al Habtoor" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                <input type="text" name="companyName" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Emirates Contracting" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
                <input type="tel" name="phone" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 111 2222" />
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
                <select name="equipment" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="">Select Equipment...</option>
                  <option value="Bobcat S450">Bobcat S450</option>
                  <option value="Excavator 320">Excavator 320</option>
                  <option value="Wheel Loader 950">Wheel Loader 950</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Assigned Operator</label>
                <select name="assignedOperator" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="">Select Operator...</option>
                  <option value="Ahmed Khan">Ahmed Khan</option>
                  <option value="Muhammad Ali">Muhammad Ali</option>
                  <option value="Without Operator">Without Operator</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                <input type="date" name="startDate" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">End Date</label>
                <input type="date" name="endDate" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
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
                <select name="rateType" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Rate (AED)</label>
                <input type="number" name="rate" required min="0" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 150" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Hours/Days</label>
                <input type="number" name="totalHours" required min="0" value={hours} onChange={(e) => setHours(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 80" />
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
