import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FileText, Download, Eye, Upload, Trash2 } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Document {
  id: string;
  title: string;
  category: string;
  related_entity: string;
  expiry_date?: string;
  created_at: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setDocuments(documents.filter((d: Document) => d.id !== id));
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleAddDocument = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const fileName = fileInput.files?.[0]?.name || 'Uploaded Document.pdf';

    const newDoc = {
      title: fileName,
      category: formData.get('category') as string,
      related_entity: formData.get('related_entity') as string,
      expiry_date: (formData.get('expiry_date') as string) || null,
    };

    try {
      const { data, error } = await supabase.from('documents').insert([newDoc]).select();
      if (error) throw error;
      if (data) setDocuments([data[0], ...documents]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to add document record');
    }
  };

  const getExpiryStatus = (dateStr?: string) => {
    if (!dateStr) return null;
    const days = differenceInDays(parseISO(dateStr), new Date());
    if (days < 0) return { label: 'Expired', variant: 'danger' as const };
    if (days <= 30) return { label: 'Expiring Soon', variant: 'warning' as const };
    return { label: 'Valid', variant: 'success' as const };
  };

  const columns = [
    {
      header: 'Document Name',
      cell: (row: Document) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <span className="font-medium text-slate-900 dark:text-white">{row.title}</span>
        </div>
      )
    },
    {
      header: 'Category',
      cell: (row: Document) => <Badge variant="default">{row.category}</Badge>
    },
    { header: 'Related To', accessorKey: 'related_entity' as keyof Document, cell: (row: Document) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.related_entity || '—'}</span> },
    {
      header: 'Expiry Status',
      cell: (row: Document) => {
        const status = getExpiryStatus(row.expiry_date);
        if (!status) return <span className="text-slate-400 text-sm">No Expiry</span>;
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm font-medium">{row.expiry_date}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      cell: (row: Document) => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors" title="Download">
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Centralized storage for corporate, vehicle, and operator documents.</p>
        </div>
      </div>

      <DataTable
        data={documents}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Search documents..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Upload Document"
      />

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Upload New Document">
        <form className="space-y-4" onSubmit={handleAddDocument}>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-orange-600 font-medium hover:text-orange-700">Click to upload</span>
                <span className="text-slate-500"> or drag and drop</span>
                <input id="file-upload" type="file" className="hidden" required />
              </label>
              <p className="text-xs text-slate-400 mt-1">PDF, DOCX, JPG or PNG (max 10MB)</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <select name="category" required className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200">
                  <option value="">Select Category...</option>
                  <option>Corporate</option>
                  <option>Vehicle</option>
                  <option>Operator</option>
                  <option>Contract</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Related Entity (Optional)</label>
                <input type="text" name="related_entity" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Bobcat S450 or Ahmed Khan" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date (Optional)</label>
                <input type="date" name="expiry_date" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Document Record</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
