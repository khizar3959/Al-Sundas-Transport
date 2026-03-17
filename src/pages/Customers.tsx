import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Mail, Phone, Trash2 } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address?: string;
  total_rentals?: number;
  total_payments?: number;
  outstanding_balance?: number;
  created_at?: string;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching customers:', error);
    } else {
      setCustomers(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. They might have active rentals.');
    } else {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Create random dummy email if missing
    const name = formData.get('name') as string;
    const email = formData.get('email') as string || `${name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    const newCustomer = {
      name,
      company: formData.get('company') as string,
      phone: formData.get('phone') as string,
      email,
      status: 'Active',
    };

    const { data, error } = await supabase
      .from('customers')
      .insert([newCustomer])
      .select();

    if (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer.');
    } else if (data) {
      setCustomers([data[0], ...customers]);
      setIsAddModalOpen(false);
    }
  };

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
          {row.total_rentals || 0}
        </span>
      )
    },
    { 
      header: 'Total Payments', 
      cell: (row: Customer) => (
         <span className="text-emerald-600 dark:text-emerald-400 font-medium">AED {(row.total_payments || 0).toLocaleString()}</span>
      )
    },
    { 
      header: 'Outstanding Balance', 
      cell: (row: Customer) => {
        const balance = row.outstanding_balance || 0;
        return (
          <Badge variant={balance > 0 ? 'danger' : 'success'}>
            {balance > 0 ? `AED ${balance.toLocaleString()}` : 'Settled'}
          </Badge>
        )
      }
    },
    {
      header: 'Actions',
      cell: (row: Customer) => (
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Customers Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage client directory, view balances, and track rental history.</p>
        </div>
      </div>

      <DataTable 
        data={customers} 
        columns={columns} 
        searchPlaceholder="Search customers by name, company, or phone..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Customer"
        isLoading={isLoading}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
      >
        <form className="space-y-4" onSubmit={handleAddCustomer}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Name</label>
              <input type="text" name="name" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Tariq Al Habtoor" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
              <input type="text" name="company" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Emirates Contracting" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
              <input type="tel" name="phone" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 111 2222" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" name="email" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="email@company.ae" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Billing Address</label>
              <textarea name="address" rows={2} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Full address..."></textarea>
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
