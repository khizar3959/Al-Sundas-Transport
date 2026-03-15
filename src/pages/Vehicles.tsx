import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2, FileText, Upload, Settings } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

type VehicleStatus = 'Available' | 'Rented' | 'Maintenance';

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plateNumber: string;
  status: VehicleStatus;
  assignedOperator: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  nextMaintenanceDate: string;
}

const mockVehicles: Vehicle[] = [
  { id: 'EQ-001', name: 'Bobcat S450', type: 'Skid Steer Loader', plateNumber: 'A-12345', status: 'Rented', assignedOperator: 'Ahmed Khan', insuranceExpiry: '2026-10-15', registrationExpiry: '2026-12-01', nextMaintenanceDate: '2026-06-20' },
  { id: 'EQ-002', name: 'Excavator 320', type: 'Crawler Excavator', plateNumber: 'B-98765', status: 'Available', assignedOperator: 'Muhammad Ali', insuranceExpiry: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], registrationExpiry: '2026-08-11', nextMaintenanceDate: '2026-05-15' }, // Expiring in 5 days
  { id: 'EQ-003', name: 'Wheel Loader 950', type: 'Wheel Loader', plateNumber: 'C-45678', status: 'Maintenance', assignedOperator: 'Unassigned', insuranceExpiry: '2025-01-10', registrationExpiry: '2025-01-15', nextMaintenanceDate: '2026-03-10' }, // Expired
];

export default function Vehicles() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getExpiryStatus = (dateStr: string) => {
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Expired', variant: 'danger' as const };
    if (days <= 7) return { label: 'Expiring Soon', variant: 'warning' as const };
    return { label: 'Valid', variant: 'success' as const };
  };

  const columns = [
    { 
      header: 'Equipment', 
      cell: (row: Vehicle) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
          <span className="text-xs text-slate-500">{row.id} &middot; {row.type}</span>
        </div>
      )
    },
    { header: 'Plate / Serial', accessorKey: 'plateNumber' as keyof Vehicle },
    { 
      header: 'Status', 
      cell: (row: Vehicle) => (
        <Badge variant={row.status === 'Available' ? 'success' : row.status === 'Rented' ? 'info' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Operator', accessorKey: 'assignedOperator' as keyof Vehicle, cell: (row: Vehicle) => <span className="text-slate-500 dark:text-slate-400">{row.assignedOperator}</span> },
    { 
      header: 'Insurance', 
      cell: (row: Vehicle) => {
        const status = getExpiryStatus(row.insuranceExpiry);
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm">{row.insuranceExpiry}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    { 
      header: 'Maintenance Due', 
      cell: (row: Vehicle) => {
        const mStatus = getExpiryStatus(row.nextMaintenanceDate);
        return (
          <div className="flex flex-col gap-1 text-sm">
             <span className={mStatus.variant === 'danger' ? 'text-red-500 font-medium' : ''}>{row.nextMaintenanceDate}</span>
          </div>
        )
      }
    },
    {
      header: 'Actions',
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="View Documents">
            <FileText className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors" title="Maintenance Log">
            <Settings className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicles & Equipment</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage heavy equipment, track status, and maintenance schedules.</p>
        </div>
      </div>

      <DataTable 
        data={mockVehicles} 
        columns={columns} 
        searchPlaceholder="Search by name, type, or plate number..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Add Equipment"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Equipment"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Equipment Name / Model</label>
              <input type="text" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Bobcat S450" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
              <select className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
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
              <input type="text" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="A-12345" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Serial/VIN Number</label>
              <input type="text" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="VIN..." />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Insurance Expiry</label>
              <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Registration Expiry</label>
              <input type="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
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
