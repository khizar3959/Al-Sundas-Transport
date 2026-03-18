import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2 } from 'lucide-react';

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}



export default function Expenses() {
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });

      if (error) throw error;

      setExpensesList(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
      setExpensesList(expensesList.filter((item: Expense) => item.id !== id));
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete record');
    }
  };

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newExpense = {
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      amount: Number(formData.get('amount')),
    };

    try {
      const { data, error } = await supabase.from('expenses').insert([newExpense]).select();
      if (error) throw error;
      
      if (data) {
        setExpensesList([data[0], ...expensesList]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
    }
  };

  const getExpenseColor = (category: string) => {
    switch(category) {
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
      header: 'Category', 
      cell: (row: Expense) => (
        <Badge variant={getExpenseColor(row.category) as any}>{row.category}</Badge>
      )
    },
    { 
      header: 'Amount', 
      cell: (row: Expense) => <span className="font-semibold text-slate-900 dark:text-white">AED {row.amount.toLocaleString()}</span> 
    },
    { header: 'Description', accessorKey: 'description' as keyof Expense, cell: (row: Expense) => <span className="text-slate-600 dark:text-slate-400 truncate max-w-[300px] block" title={row.description}>{row.description}</span> },
    {
      header: 'Actions',
      cell: (row: Expense) => (
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Expenses Tracking</h1>
          <p className="text-slate-500 dark:text-slate-400">Log outgoings categorized by fuel, maintenance, salaries, etc.</p>
        </div>
      </div>

      <DataTable 
        data={expensesList} 
        columns={columns} 
        isLoading={isLoading}
        searchPlaceholder="Search expenses..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Expense"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log New Expense"
      >
        <form className="space-y-4" onSubmit={handleAddExpense}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expense Category</label>
              <select name="category" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Fuel</option>
                <option>Maintenance</option>
                <option>Salary</option>
                <option>Spare Parts</option>
                <option>Rent</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (AED)</label>
              <input type="number" name="amount" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="0.00" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
              <textarea name="description" rows={3} required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Details about this expense..."></textarea>
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
