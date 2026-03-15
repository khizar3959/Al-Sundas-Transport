import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2, CalendarClock } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface MaintenanceLog {
  id: string;
  vehicle: string;
  type: string;
  date: string;
  cost: number;
  mechanic: string;
  description: string;
  nextDate: string;
}

const mockMaintenance: MaintenanceLog[] = [
  { id: 'MNT-001', vehicle: 'Excavator 320', type: 'Preventive', date: '2026-02-15', cost: 1200, mechanic: 'Ali Garage', description: 'Oil and filter change', nextDate: '2026-05-15' },
  { id: 'MNT-002', vehicle: 'Bobcat S450', type: 'Repair', date: '2026-03-01', cost: 4500, mechanic: 'In-house', description: 'Hydraulic pump repair', nextDate: '2026-06-20' },
  { id: 'MNT-003', vehicle: 'Wheel Loader 950', type: 'Inspection', date: '2025-10-10', cost: 500, mechanic: 'Al Quoz Auto', description: 'General checkup', nextDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }, // Due in 4 days
];

export default function Maintenance() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getExpiryStatus = (dateStr: string) => {
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Overdue', variant: 'danger' as const };
    if (days <= 14) return { label: 'Due Soon', variant: 'warning' as const };
    return { label: 'Scheduled', variant: 'success' as const };
  };

  const columns = [
    { header: 'Vehicle', accessorKey: 'vehicle' as keyof MaintenanceLog, cell: (row: MaintenanceLog) => <span className="font-medium text-slate-900 dark:text-white">{row.vehicle}</span> },
    { 
      header: 'Type & Service', 
      cell: (row: MaintenanceLog) => (
        <div className="flex flex-col gap-1">
          <Badge variant={row.type === 'Repair' ? 'danger' : row.type === 'Preventive' ? 'info' : 'default'}>{row.type}</Badge>
          <span className="text-xs text-slate-500 truncate max-w-[150px]" title={row.description}>{row.description}</span>
        </div>
      )
    },
    { header: 'Date', accessorKey: 'date' as keyof MaintenanceLog },
    { header: 'Cost', accessorKey: 'cost' as keyof MaintenanceLog, cell: (row: MaintenanceLog) => <span className="font-medium">AED {row.cost}</span> },
    { header: 'Mechanic', accessorKey: 'mechanic' as keyof MaintenanceLog },
    { 
      header: 'Next Due', 
      cell: (row: MaintenanceLog) => {
        const status = getExpiryStatus(row.nextDate);
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm font-medium">{row.nextDate}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        )
      }
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track equipment repairs, routine services, and next due dates.</p>
        </div>
      </div>

      <DataTable 
        data={mockMaintenance} 
        columns={columns} 
        searchPlaceholder="Search by vehicle or maintenance type..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Log Maintenance"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Log Maintenance Record"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle</label>
              <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Vehicle...</option>
                <option>Bobcat S450</option>
                <option>Excavator 320</option>
                <option>Wheel Loader</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Maintenance Type</label>
              <select required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option>Preventive</option>
                <option>Repair</option>
                <option>Inspection</option>
                <option>Component Replacement</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date of Service</label>
              <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Cost (AED)</label>
              <input type="number" required min="0" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 1200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Mechanic / Service Center</label>
              <input type="text" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Ali Garage" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Next Due Date</label>
              <div className="relative">
                <input type="date" required className="w-full px-3 py-2 pl-9 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
                <CalendarClock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description of Work</label>
              <textarea rows={2} required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="Changed hydraulic fluid, replaced 2 hoses..."></textarea>
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
