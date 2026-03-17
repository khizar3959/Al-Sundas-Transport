import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2, Edit, Eye, Plus, Search, Truck, Tag, DollarSign } from 'lucide-react';

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

const inputCls = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200";

const statusColor = (s: VehicleStatus) =>
  s === 'Available' ? 'success' : s === 'Rented' ? 'info' : 'warning';

const vehicleTypeIcon: Record<string, string> = {
  Excavator: '🚧', Bobcat: '🛞', 'Wheel Loader': '🏗️', Crane: '🏗️',
  Bulldozer: '🚜', Forklift: '⚙️', Truck: '🚛', Other: '🔧',
};

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [viewVehicle, setViewVehicle] = useState<Vehicle | null>(null);

  useEffect(() => { fetchVehicles(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(vehicles.filter(v =>
      v.name.toLowerCase().includes(q) ||
      v.plate_number?.toLowerCase().includes(q) ||
      v.type?.toLowerCase().includes(q)
    ));
  }, [search, vehicles]);

  const fetchVehicles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (!error) setVehicles(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this vehicle? This cannot be undone.')) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) setVehicles(vehicles.filter(v => v.id !== id));
    else alert('Failed to delete. Vehicle may be used in an active rental.');
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get('name') as string,
      type: f.get('type') as string,
      plate_number: f.get('plateNumber') as string,
      status: f.get('status') as string || 'Available',
      price_per_day: Number(f.get('pricePerDay')),
    };
    const { data, error } = await supabase.from('vehicles').insert([payload]).select();
    if (!error && data) { setVehicles([data[0], ...vehicles]); setIsAddModalOpen(false); }
    else alert('Failed to add vehicle. Plate number may already exist.');
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editVehicle) return;
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get('name') as string,
      type: f.get('type') as string,
      plate_number: f.get('plateNumber') as string,
      status: f.get('status') as VehicleStatus,
      price_per_day: Number(f.get('pricePerDay')),
    };
    const { data, error } = await supabase.from('vehicles').update(payload).eq('id', editVehicle.id).select();
    if (!error && data) {
      setVehicles(vehicles.map(v => v.id === editVehicle.id ? data[0] : v));
      setEditVehicle(null);
    } else alert('Failed to update vehicle.');
  };

  const VehicleForm = ({ v, onSubmit, onClose }: { v?: Vehicle; onSubmit: any; onClose: () => void }) => (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Equipment Name</label>
          <input name="name" required defaultValue={v?.name} className={inputCls} placeholder="e.g. Bobcat S650" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
          <select name="type" defaultValue={v?.type || ''} className={inputCls} required>
            <option value="">Select type...</option>
            {['Excavator','Bobcat','Wheel Loader','Crane','Bulldozer','Forklift','Truck','Other'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Plate / Serial Number</label>
          <input name="plateNumber" required defaultValue={v?.plate_number} className={inputCls} placeholder="e.g. DXB-A-12345" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select name="status" defaultValue={v?.status || 'Available'} className={inputCls}>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Daily Rate (AED)</label>
          <input type="number" name="pricePerDay" required min="0" step="0.01" defaultValue={v?.price_per_day} className={inputCls} placeholder="e.g. 850" />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{v ? 'Save Changes' : 'Add Equipment'}</Button>
      </div>
    </form>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fleet & Equipment</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {vehicles.length} total · {vehicles.filter(v => v.status === 'Available').length} available
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search fleet..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 w-52"
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Equipment
          </Button>
        </div>
      </div>

      {/* Status summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Available', count: vehicles.filter(v=>v.status==='Available').length, color: 'emerald' },
          { label: 'Rented', count: vehicles.filter(v=>v.status==='Rented').length, color: 'blue' },
          { label: 'Maintenance', count: vehicles.filter(v=>v.status==='Maintenance').length, color: 'orange' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.count}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="h-32 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4" />
              <div className="space-y-2">
                <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No equipment found. Add your first vehicle.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(v => (
            <div key={v.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-200 group">
              {/* Top banner */}
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 h-28 flex items-center justify-center relative">
                <span className="text-5xl">{vehicleTypeIcon[v.type] || '🔧'}</span>
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setViewVehicle(v)} className="p-1.5 bg-white/80 dark:bg-slate-900/80 rounded-lg text-slate-600 hover:text-blue-600 transition-colors backdrop-blur-sm" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button onClick={() => setEditVehicle(v)} className="p-1.5 bg-white/80 dark:bg-slate-900/80 rounded-lg text-slate-600 hover:text-orange-600 transition-colors backdrop-blur-sm" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-1.5 bg-white/80 dark:bg-slate-900/80 rounded-lg text-slate-600 hover:text-red-600 transition-colors backdrop-blur-sm" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant={statusColor(v.status)}>{v.status}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">{v.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{v.type}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{v.plate_number}</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600 font-semibold text-sm">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>AED {v.price_per_day?.toLocaleString()}/day</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Equipment">
        <VehicleForm onSubmit={handleAdd} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editVehicle} onClose={() => setEditVehicle(null)} title="Edit Equipment">
        {editVehicle && <VehicleForm v={editVehicle} onSubmit={handleEdit} onClose={() => setEditVehicle(null)} />}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewVehicle} onClose={() => setViewVehicle(null)} title="Equipment Details">
        {viewVehicle && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl h-36 flex items-center justify-center">
              <span className="text-7xl">{vehicleTypeIcon[viewVehicle.type] || '🔧'}</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{viewVehicle.name}</h2>
                <p className="text-slate-500 text-sm">{viewVehicle.type}</p>
              </div>
              <Badge variant={statusColor(viewVehicle.status)}>{viewVehicle.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Plate / Serial', value: viewVehicle.plate_number },
                { label: 'Daily Rate', value: `AED ${viewVehicle.price_per_day?.toLocaleString()}` },
                { label: 'Type', value: viewVehicle.type },
                { label: 'Status', value: viewVehicle.status },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setViewVehicle(null)}>Close</Button>
              <Button onClick={() => { setViewVehicle(null); setEditVehicle(viewVehicle); }}>Edit Equipment</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
