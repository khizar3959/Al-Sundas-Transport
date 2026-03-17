import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FileText, Download, Eye, Upload } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Document {
  id: string;
  name: string;
  category: string;
  relatedEntity: string;
  uploadDate: string;
  expiryDate?: string;
  size: string;
}

const initialDocuments: Document[] = [
  { id: 'DOC-001', name: 'Trade License 2026.pdf', category: 'Corporate', relatedEntity: 'Al Sundas Transport', uploadDate: '2025-12-01', expiryDate: '2026-12-31', size: '2.4 MB' },
  { id: 'DOC-002', name: 'Vehicle Registration - S450.pdf', category: 'Vehicle', relatedEntity: 'Bobcat S450', uploadDate: '2026-01-15', expiryDate: '2027-01-14', size: '1.1 MB' },
  { id: 'DOC-003', name: 'Operator License - Ahmed.pdf', category: 'Operator', relatedEntity: 'Ahmed Khan', uploadDate: '2025-06-20', expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], size: '800 KB' }, // Expires in 5 days
  { id: 'DOC-004', name: 'Insurance Policy 2026.pdf', category: 'Vehicle', relatedEntity: 'Excavator 320', uploadDate: '2026-02-01', expiryDate: '2027-01-31', size: '4.5 MB' },
];

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleAddDocument = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Simulate file upload by getting the file name
    const fileInput = e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    const fileName = fileInput.files?.[0]?.name || 'Uploaded Document.pdf';
    const fileSize = fileInput.files?.[0]?.size 
      ? `${(fileInput.files[0].size / (1024 * 1024)).toFixed(1)} MB` 
      : '1.5 MB';

    const newDoc: Document = {
      id: `DOC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: fileName,
      category: formData.get('category') as string,
      relatedEntity: formData.get('relatedEntity') as string,
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.get('expiryDate') as string || undefined,
      size: fileSize,
    };
    
    setDocuments([newDoc, ...documents]);
    setIsAddModalOpen(false);
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
          <span className="font-medium text-slate-900 dark:text-white">{row.name}</span>
        </div>
      )
    },
    { 
      header: 'Category', 
      cell: (row: Document) => (
        <Badge variant="default">{row.category}</Badge>
      )
    },
    { header: 'Related To', accessorKey: 'relatedEntity' as keyof Document, cell: (row: Document) => <span className="text-slate-600 dark:text-slate-400 font-medium">{row.relatedEntity}</span> },
    { 
      header: 'Expiry Status', 
      cell: (row: Document) => {
        const status = getExpiryStatus(row.expiryDate);
        if (!status) return <span className="text-slate-400 text-sm">No Expiry</span>;
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-sm font-medium">{row.expiryDate}</span>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
        )
      }
    },
    { header: 'Size', accessorKey: 'size' as keyof Document, cell: (row: Document) => <span className="text-slate-500 text-sm">{row.size}</span> },
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
            <span className="text-red-500 font-bold">X</span>
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
        searchPlaceholder="Search documents..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Upload Document"
      />

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload New Document"
      >
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
                <input type="text" name="relatedEntity" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" placeholder="e.g. Bobcat S450 or Ahmed Khan" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Expiry Date (Optional)</label>
                <input type="date" name="expiryDate" className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200" />
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-800 mt-6">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
