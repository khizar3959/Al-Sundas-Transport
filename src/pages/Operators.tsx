import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Trash2, Edit, Eye, Plus, Search, Phone, Mail } from 'lucide-react';
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

const inputCls = "w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200";

export default function Operators() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [filtered, setFiltered] = useState<Operator[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editOperator, setEditOperator] = useState<Operator | null>(null);
  const [viewOperator, setViewOperator] = useState<Operator | null>(null);

  useEffect(() => { fetchOperators(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(operators.filter(op =>
      op.name.toLowerCase().includes(q) ||
      op.email.toLowerCase().includes(q) ||
      op.phone?.toLowerCase().includes(q)
    ));
  }, [search, operators]);

  const fetchOperators = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('operators').select('*').order('created_at', { ascending: false });
    if (!error) setOperators(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this operator?')) return;
    const { error } = await supabase.from('operators').delete().eq('id', id);
    if (!error) setOperators(operators.filter(op => op.id !== id));
    else alert('Failed to delete. Operator may be assigned to a rental.');
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = f.get('name') as string;
    const payload = {
      name,
      email: f.get('email') as string || `${name.replace(/\s+/g,'').toLowerCase()}@alsundas.ae`,
      phone: f.get('phone') as string,
      license_number: f.get('licenseNumber') as string,
      license_expiry: f.get('licenseExpiry') as string,
      status: f.get('status') as string || 'Active',
    };
    const { data, error } = await supabase.from('operators').insert([payload]).select();
    if (!error && data) { setOperators([data[0], ...operators]); setIsAddModalOpen(false); }
    else alert('Failed to add operator.');
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editOperator) return;
    const f = new FormData(e.currentTarget);
    const payload = {
      name: f.get('name') as string,
      email: f.get('email') as string,
      phone: f.get('phone') as string,
      license_number: f.get('licenseNumber') as string,
      license_expiry: f.get('licenseExpiry') as string,
      status: f.get('status') as OperatorStatus,
    };
    const { data, error } = await supabase.from('operators').update(payload).eq('id', editOperator.id).select();
    if (!error && data) {
      setOperators(operators.map(op => op.id === editOperator.id ? data[0] : op));
      setEditOperator(null);
    } else alert('Failed to update operator.');
  };

  const getExpiryStatus = (dateStr: string) => {
    if (!dateStr) return { label: 'Unknown', variant: 'default' as const };
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Expired', variant: 'danger' as const };
    if (days <= 30) return { label: 'Expiring Soon', variant: 'warning' as const };
    return { label: 'Valid', variant: 'success' as const };
  };

  const statusColor = (s: OperatorStatus) =>
    s === 'Active' ? 'success' : s === 'On Leave' ? 'warning' : 'default';

  const OperatorForm = ({ op, onSubmit, onClose }: { op?: Operator; onSubmit: any; onClose: () => void }) => (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
          <input name="name" required defaultValue={op?.name} className={inputCls} placeholder="Ahmed Khan" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
          <input name="phone" required defaultValue={op?.phone} className={inputCls} placeholder="+971 50 000 0000" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
          <input type="email" name="email" required defaultValue={op?.email} className={inputCls} placeholder="operator@example.com" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
          <select name="status" defaultValue={op?.status || 'Active'} className={inputCls}>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Number</label>
          <input name="licenseNumber" required defaultValue={op?.license_number} className={inputCls} placeholder="License Number" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">License Expiry</label>
          <input type="date" name="licenseExpiry" required defaultValue={op?.license_expiry} className={inputCls} />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{op ? 'Save Changes' : 'Add Operator'}</Button>
      </div>
    </form>
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Operators</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {operators.length} total · {operators.filter(o => o.status === 'Active').length} active
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search operators..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 w-56"
            />
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Operator
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                  <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">No operators found. Add your first operator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(op => {
            const expiry = getExpiryStatus(op.license_expiry);
            const initials = op.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div key={op.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-500/30 transition-all duration-200 group">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                      {initials}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{op.name}</h3>
                      <Badge variant={statusColor(op.status)}>{op.status}</Badge>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setViewOperator(op)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => setEditOperator(op)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(op.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{op.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{op.email}</span>
                  </div>
                </div>

                {/* License */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wide">License Expiry</p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">{op.license_expiry || 'N/A'}</p>
                  </div>
                  <Badge variant={expiry.variant}>{expiry.label}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Operator">
        <OperatorForm onSubmit={handleAdd} onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editOperator} onClose={() => setEditOperator(null)} title="Edit Operator">
        {editOperator && <OperatorForm op={editOperator} onSubmit={handleEdit} onClose={() => setEditOperator(null)} />}
      </Modal>

      {/* View Modal */}
      <Modal isOpen={!!viewOperator} onClose={() => setViewOperator(null)} title="Operator Details">
        {viewOperator && (() => {
          const expiry = getExpiryStatus(viewOperator.license_expiry);
          const initials = viewOperator.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl shadow">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{viewOperator.name}</h2>
                  <Badge variant={statusColor(viewOperator.status)}>{viewOperator.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Phone', value: viewOperator.phone },
                  { label: 'Email', value: viewOperator.email },
                  { label: 'License Number', value: viewOperator.license_number },
                  { label: 'License Expiry', value: viewOperator.license_expiry },
                ].map(f => (
                  <div key={f.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                    <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">{f.label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{f.value || '—'}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">License Status</span>
                <Badge variant={expiry.variant}>{expiry.label}</Badge>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setViewOperator(null)}>Close</Button>
                <Button onClick={() => { setViewOperator(null); setEditOperator(viewOperator); }}>Edit Operator</Button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
