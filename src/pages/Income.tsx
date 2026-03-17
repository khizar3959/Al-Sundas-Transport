import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2, Download } from 'lucide-react';

interface Income {
  id: string;
  date: string;
  source: string;
  category: string;
  amount: number;
  created_at: string;
}

export default function Income() {
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('income').select('*').order('date', { ascending: false });

      if (error) throw error;

      setIncomeList(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load income data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
      const { error } = await supabase.from('income').delete().eq('id', id);
      if (error) throw error;
      setIncomeList(incomeList.filter((item: Income) => item.id !== id));
    } catch (error) {
      console.error('Error deleting income:', error);
      alert('Failed to delete record');
    }
  };

  const handleAddIncome = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newIncome = {
      date: formData.get('date') as string,
      source: formData.get('source') as string,
      category: formData.get('category') as string,
      amount: Number(formData.get('amount')),
    };

    try {
      const { data, error } = await supabase.from('income').insert([newIncome]).select();
      if (error) throw error;
      
      if (data) {
        setIncomeList([data[0], ...incomeList]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding income:', error);
      alert('Failed to add income record');
    }
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' as keyof Income, cell: (row: Income) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.date}</span> },
    { header: 'Source', accessorKey: 'source' as keyof Income, cell: (row: Income) => <span className="font-medium text-slate-900 dark:text-white">{row.source}</span> },
    { 
      header: 'Category', 
      cell: (row: Income) => (
        <Badge variant={row.category === 'Rental' ? 'info' : row.category === 'Service' ? 'success' : 'warning'}>
          {row.category}
        </Badge>
      )
    },
    { 
      header: 'Amount', 
      cell: (row: Income) => <span className="font-semibold text-emerald-600 dark:text-emerald-400">AED {row.amount.toLocaleString()}</span> 
    },
    {
      header: 'Actions',
      cell: (row: Income) => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="Download">
            <Download className="w-4 h-4" />
          </button>
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Income Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Log payments received and view income history.</p>
        </div>
      </div>

      <DataTable 
        data={incomeList} 
        columns={columns} 
        isLoading={isLoading}
        searchPlaceholder="Search by source..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Payment"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Income/Payment"
      >
        <form className="space-y-4" onSubmit={handleAddIncome}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Source/Customer</label>
              <input type="text" name="source" required placeholder="e.g. Emirates Contracting" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (AED)</label>
              <input type="number" name="amount" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="0.00" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select name="category" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Rental</option>
                <option>Service</option>
                <option>Sale</option>
                <option>Other</option>
              </select>
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
