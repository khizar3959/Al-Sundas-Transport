import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Upload, Trash2 } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

type OperatorStatus = 'Active' | 'On Leave' | 'Inactive';

interface Operator {
  id: string;
  name: string;
  email: string;
  phone: string;
  license_number: string;
  license_expiry: string;
  status: OperatorStatus;
}

export default function Operators() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOperators();
  }, []);

  const fetchOperators = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('operators')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching operators:', error);
    } else {
      setOperators(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this operator?')) return;
    
    const { error } = await supabase
      .from('operators')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting operator:', error);
      alert('Failed to delete operator. It might clearly be assigned to a rental.');
    } else {
      setOperators(operators.filter(op => op.id !== id));
    }
  };

  const handleAddOperator = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Default dummy email if omitted from form since it's required in DB
    const name = formData.get('name') as string;
    const email = formData.get('email') as string || `${name.replace(/\s+/g, '').toLowerCase()}@example.com`;

    const newOperator = {
      name,
      email,
      phone: formData.get('phone') as string,
      license_number: formData.get('licenseNumber') as string,
      license_expiry: formData.get('licenseExpiry') as string,
      status: formData.get('status') as string || 'Active',
    };

    const { data, error } = await supabase
      .from('operators')
      .insert([newOperator])
      .select();

    if (error) {
      console.error('Error adding operator:', error);
      alert('Failed to add operator.');
    } else if (data) {
      setOperators([data[0], ...operators]);
      setIsAddModalOpen(false);
    }
  };

  // Helper to determine expiry status
  const getExpiryStatus = (dateStr: string) => {
    if (!dateStr) return { label: 'Unknown', variant: 'default' as const };
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Expired', variant: 'danger' as const };
    if (days <= 30) return { label: 'Expiring Soon', variant: 'warning' as const };
    return { label: 'Valid', variant: 'success' as const };
  };

  const columns = [
    { header: 'Name', accessorKey: 'name' as keyof Operator, cell: (row: Operator) => <span className="font-medium text-slate-900 dark:text-white">{row.name}</span> },
    { header: 'Email', accessorKey: 'email' as keyof Operator, cell: (row: Operator) => <span className="text-slate-500 dark:text-slate-400">{row.email}</span> },
    { header: 'Phone', accessorKey: 'phone' as keyof Operator },
    { 
      header: 'License Expiry', 
      cell: (row: Operator) => {
        const status = getExpiryStatus(row.license_expiry);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">{row.license_expiry || 'N/A'}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    { 
      header: 'Status', 
      cell: (row: Operator) => (
        <Badge variant={row.status === 'Active' ? 'success' : row.status === 'On Leave' ? 'warning' : 'default'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (row: Operator) => (
        <div className="flex items-center gap-2">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operators</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all equipment operators and their documents.</p>
        </div>
      </div>

      <DataTable 
        data={operators} 
        columns={columns} 
        searchPlaceholder="Search operators by name or email..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Operator"
        isLoading={isLoading}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Operator"
      >
        <form className="space-y-4" onSubmit={handleAddOperator}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
              <input type="text" name="name" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Ahmed Khan" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
              <input type="tel" name="phone" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="+971 50 000 0000" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input type="email" name="email" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="operator@example.com" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select name="status" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Number</label>
              <input type="text" name="licenseNumber" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="License Number" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Expiry Date</label>
              <input type="date" name="licenseExpiry" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>

          </div>
          
          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Upload Documents</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                  <span className="relative cursor-pointer bg-transparent rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none">
                    Upload a file
                  </span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Operator</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
