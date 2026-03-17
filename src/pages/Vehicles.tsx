import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2 } from 'lucide-react';

type VehicleStatus = 'Available' | 'Rented' | 'Maintenance';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate_number: string;
  status: VehicleStatus;
  price_per_day: number;
  created_at?: string;
}

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching vehicles:', error);
    } else {
      setVehicles(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this equipment?')) return;
    
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete equipment. It might be assigned to a rental.');
    } else {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  const handleAddVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newVehicle = {
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      plate_number: formData.get('plateNumber') as string,
      status: 'Available',
      price_per_day: parseFloat(formData.get('pricePerDay') as string) || 0,
    };

    const { data, error } = await supabase
      .from('vehicles')
      .insert([newVehicle])
      .select();

    if (error) {
      console.error('Error adding equipment:', error);
      alert('Failed to add equipment.');
    } else if (data) {
      setVehicles([data[0], ...vehicles]);
      setIsAddModalOpen(false);
    }
  };

  const columns = [
    { 
      header: 'Equipment', 
      cell: (row: Vehicle) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-slate-500">{row.type}</span>
        </div>
      )
    },
    { header: 'Plate Number', accessorKey: 'plate_number' as keyof Vehicle },
    { 
      header: 'Daily Rate', 
      cell: (row: Vehicle) => (
        <span className="font-medium">AED {row.price_per_day}</span>
      )
    },
    { 
      header: 'Status', 
      cell: (row: Vehicle) => (
        <Badge variant={row.status === 'Available' ? 'success' : row.status === 'Rented' ? 'info' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Actions',
      cell: (row: Vehicle) => (
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicles & Equipment</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage heavy equipment, track status, and maintenance schedules.</p>
        </div>
      </div>

      <DataTable 
        data={vehicles} 
        columns={columns} 
        searchPlaceholder="Search by name, type, or plate number..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Equipment"
        isLoading={isLoading}
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Equipment"
      >
        <form className="space-y-4" onSubmit={handleAddVehicle}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Equipment Name / Model</label>
              <input type="text" name="name" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Bobcat S450" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <select name="type" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Skid Steer Loader (Bobcat)</option>
                <option>Excavator</option>
                <option>Wheel Loader</option>
                <option>Bulldozer</option>
                <option>Crane</option>
                <option>Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plate Number</label>
              <input type="text" name="plateNumber" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="A-12345" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Rental Rate (AED)</label>
              <input type="number" name="pricePerDay" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="150" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Equipment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
