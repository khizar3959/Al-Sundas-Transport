import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2, CalendarClock } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface MaintenanceLog {
  id: string;
  vehicle_id: string;
  service_type: string;
  date: string;
  cost: number;
  provider: string;
  description: string;
  next_due_date: string;
  vehicles?: { name: string };
}

interface Vehicle {
  id: string;
  name: string;
}

export default function Maintenance() {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [mntRes, vehiclesRes] = await Promise.all([
        supabase.from('maintenance_logs').select('*, vehicles(name)').order('date', { ascending: false }),
        supabase.from('vehicles').select('id, name')
      ]);

      if (mntRes.error) throw mntRes.error;
      if (vehiclesRes.error) throw vehiclesRes.error;

      setMaintenanceLogs(mntRes.data || []);
      setVehicles(vehiclesRes.data || []);
    } catch (error) {
      console.error('Error fetching maintenance logs:', error);
      alert('Failed to load maintenance data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;
    
    try {
      const { error } = await supabase.from('maintenance_logs').delete().eq('id', id);
      if (error) throw error;
      setMaintenanceLogs(maintenanceLogs.filter((item: MaintenanceLog) => item.id !== id));
    } catch (error) {
      console.error('Error deleting maintenance log:', error);
      alert('Failed to delete record');
    }
  };

  const handleAddMaintenance = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog = {
      date: formData.get('date') as string,
      vehicle_id: formData.get('vehicle_id') as string,
      service_type: formData.get('service_type') as string,
      cost: Number(formData.get('cost')),
      provider: formData.get('provider') as string,
      description: formData.get('description') as string,
      next_due_date: formData.get('next_due_date') as string,
    };

    try {
      const { data, error } = await supabase.from('maintenance_logs').insert([newLog]).select('*, vehicles(name)');
      if (error) throw error;
      
      if (data) {
        setMaintenanceLogs([data[0], ...maintenanceLogs]);
      }
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding maintenance log:', error);
      alert('Failed to add record');
    }
  };

  const getExpiryStatus = (dateStr: string) => {
    if (!dateStr) return { label: 'Not Set', variant: 'default' as const };
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Overdue', variant: 'danger' as const };
    if (days <= 14) return { label: 'Due Soon', variant: 'warning' as const };
    return { label: 'Scheduled', variant: 'success' as const };
  };

  const columns = [
    { header: 'Vehicle', cell: (row: MaintenanceLog) => <span className="font-medium text-slate-900 dark:text-white">{row.vehicles?.name || 'Unknown'}</span> },
    { 
      header: 'Type & Service', 
      cell: (row: MaintenanceLog) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.service_type === 'Repair' ? 'danger' : row.service_type === 'Preventive' ? 'info' : 'default'}>{row.service_type}</Badge>
          <span className="text-xs text-slate-500 truncate max-w-[150px]" title={row.description}>{row.description}</span>
        </div>
      )
    },
    { header: 'Date', accessorKey: 'date' as keyof MaintenanceLog },
    { header: 'Cost', cell: (row: MaintenanceLog) => <span className="font-medium">AED {row.cost}</span> },
    { header: 'Mechanic', accessorKey: 'provider' as keyof MaintenanceLog },
    { 
      header: 'Next Due', 
      cell: (row: MaintenanceLog) => {
        const status = getExpiryStatus(row.next_due_date);
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm font-medium">{row.next_due_date || 'N/A'}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        )
      }
    },
    {
      header: 'Actions',
      cell: (row: MaintenanceLog) => (
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track equipment repairs, routine services, and next due dates.</p>
        </div>
      </div>

      <DataTable 
        data={maintenanceLogs} 
        columns={columns} 
        isLoading={isLoading}
        searchPlaceholder="Search by vehicle or maintenance type..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Maintenance"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Maintenance Record"
      >
        <form className="space-y-4" onSubmit={handleAddMaintenance}>
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Type</label>
              <select name="service_type" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Preventive</option>
                <option>Repair</option>
                <option>Inspection</option>
                <option>Component Replacement</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Service</label>
              <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Cost (AED)</label>
              <input type="number" name="cost" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 1200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mechanic / Service Center</label>
              <input type="text" name="provider" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Ali Garage" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Next Due Date</label>
              <div className="relative">
                <input type="date" name="next_due_date" required className="w-full px-3 py-2 pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
                <CalendarClock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description of Work</label>
              <textarea name="description" rows={2} required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Changed hydraulic fluid, replaced 2 hoses..."></textarea>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Maintenance Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
