import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Edit, Trash2 } from 'lucide-react';

interface FuelLog {
  id: string;
  vehicle: string;
  date: string;
  quantity: number;
  cost: number;
  operator: string;
}

const initialFuelLogs: FuelLog[] = [
  { id: 'FL-001', vehicle: 'Bobcat S450', date: '2026-03-12', quantity: 60, cost: 180, operator: 'Ahmed Khan' },
  { id: 'FL-002', vehicle: 'Excavator 320', date: '2026-03-14', quantity: 150, cost: 450, operator: 'Muhammad Ali' },
  { id: 'FL-003', vehicle: 'Wheel Loader', date: '2026-03-15', quantity: 100, cost: 300, operator: 'Sajid Mehmood' },
];

export default function Fuel() {
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>(initialFuelLogs);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setFuelLogs(fuelLogs.filter(item => item.id !== id));
  };

  const handleAddFuelLog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLog: FuelLog = {
      id: `FL-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      date: formData.get('date') as string,
      vehicle: formData.get('vehicle') as string,
      quantity: Number(formData.get('quantity')),
      cost: Number(formData.get('cost')),
      operator: formData.get('operator') as string,
    };
    setFuelLogs([newLog, ...fuelLogs]);
    setIsAddModalOpen(false);
  };

  const columns = [
    { header: 'Date', accessorKey: 'date' as keyof FuelLog, cell: (row: FuelLog) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.date}</span> },
    { header: 'Vehicle', accessorKey: 'vehicle' as keyof FuelLog, cell: (row: FuelLog) => <span className="font-medium text-slate-900 dark:text-white">{row.vehicle}</span> },
    { header: 'Quantity (Liters)', accessorKey: 'quantity' as keyof FuelLog, cell: (row: FuelLog) => <span className="text-slate-600 dark:text-slate-400">{row.quantity} L</span> },
    { header: 'Cost (AED)', accessorKey: 'cost' as keyof FuelLog, cell: (row: FuelLog) => <span className="font-semibold text-orange-600 dark:text-orange-400">AED {row.cost}</span> },
    { header: 'Operator', accessorKey: 'operator' as keyof FuelLog },
    {
      header: 'Actions',
      cell: (row: FuelLog) => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-md transition-colors" title="Edit">
            <Edit className="w-4 h-4" />
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel Logs</h1>
          <p className="text-slate-500 dark:text-slate-400">Track fuel consumption and costs per vehicle.</p>
        </div>
      </div>

      <DataTable 
        data={fuelLogs} 
        columns={columns} 
        searchPlaceholder="Search by vehicle or operator..."
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
              <input type="date" name="date" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle</label>
              <select name="vehicle" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Vehicle...</option>
                <option>Bobcat S450</option>
                <option>Excavator 320</option>
                <option>Wheel Loader</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Quantity (Liters)</label>
              <input type="number" name="quantity" required min="0" step="0.1" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Cost (AED)</label>
              <input type="number" name="cost" required min="0" step="0.01" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. 180" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Logged By / Operator</label>
              <select name="operator" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                <option value="">Select Operator...</option>
                <option>Ahmed Khan</option>
                <option>Muhammad Ali</option>
                <option>Management / General</option>
              </select>
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
