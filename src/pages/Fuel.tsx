import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2 } from 'lucide-react';

interface FuelLog {
  id: string;
  vehicle_id: string;
  date: string;
  liters: number;
  amount: number;
  vehicles?: { name: string };
}

interface Vehicle {
  id: string;
  name: string;
}

export default function Fuel() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [fuelRes, vehiclesRes] = await Promise.all([
        supabase.from('fuel_logs').select('*, vehicles(name)').order('date', { ascending: false }),
        supabase.from('vehicles').select('id, name')
      ]);

      if (fuelRes.error) throw fuelRes.error;
      if (vehiclesRes.error) throw vehiclesRes.error;

      setFuelLogs(fuelRes.data || []);
      setVehicles(vehiclesRes.data || []);
    } catch (error) {
      console.error('Error fetching fuel logs:', error);
      alert('Failed to load fuel data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fuel log?')) return;
    
    try {
      const { error } = await supabase.from('fuel_logs').delete().eq('id', id);
      if (error) throw error;
      setFuelLogs(fuelLogs.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting fuel log:', error);
      alert('Failed to delete record');
    }
  };

  const handleAddFuelLog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog = {
      date: formData.get('date') as string,
      vehicle_id: formData.get('vehicle_id') as string,
      liters: Number(formData.get('liters')),
      amount: Number(formData.get('amount')),
    };

    try {
      const { data, error } = await supabase.from('fuel_logs').insert([newLog]).select('*, vehicles(name)');
      if (error) throw error;
      
      if (data) {
        setFuelLogs([data[0], ...fuelLogs]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding fuel log:', error);
      alert('Failed to add fuel log');
    }
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' as keyof FuelLog, cell: (row: FuelLog) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.date}</span> },
    { header: 'Vehicle', cell: (row: FuelLog) => <span className="font-medium text-slate-900 dark:text-white">{row.vehicles?.name || 'Unknown'}</span> },
    { header: 'Quantity (Liters)', accessorKey: 'liters' as keyof FuelLog, cell: (row: FuelLog) => <span className="text-slate-600 dark:text-slate-400">{row.liters} L</span> },
    { header: 'Cost (AED)', accessorKey: 'amount' as keyof FuelLog, cell: (row: FuelLog) => <span className="font-semibold text-orange-600 dark:text-orange-400">AED {row.amount}</span> },
    {
      header: 'Actions',
      cell: (row: FuelLog) => (
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track fuel consumption and costs per vehicle.</p>
        </div>
      </div>

      <DataTable 
        data={fuelLogs} 
        columns={columns} 
        isLoading={isLoading}
        searchPlaceholder="Search by vehicle..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Fuel"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Fuel Consumption"
      >
        <form className="space-y-4" onSubmit={handleAddFuelLog}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
              <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle</label>
              <select name="vehicle_id" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Vehicle...</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity (Liters)</label>
              <input type="number" name="liters" required min="0" step="0.1" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Cost (AED)</label>
              <input type="number" name="amount" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 180" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Log</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
