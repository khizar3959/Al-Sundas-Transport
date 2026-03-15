import React, { useState } from 'react';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
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

const mockDocuments: Document[] = [
  { id: 'DOC-001', name: 'Trade License 2026.pdf', category: 'Corporate', relatedEntity: 'Al Sundas Transport', uploadDate: '2025-12-01', expiryDate: '2026-12-31', size: '2.4 MB' },
  { id: 'DOC-002', name: 'Vehicle Registration - S450.pdf', category: 'Vehicle', relatedEntity: 'Bobcat S450', uploadDate: '2026-01-15', expiryDate: '2027-01-14', size: '1.1 MB' },
  { id: 'DOC-003', name: 'Operator License - Ahmed.pdf', category: 'Operator', relatedEntity: 'Ahmed Khan', uploadDate: '2025-06-20', expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], size: '800 KB' }, // Expires in 5 days
  { id: 'DOC-004', name: 'Insurance Policy 2026.pdf', category: 'Vehicle', relatedEntity: 'Excavator 320', uploadDate: '2026-02-01', expiryDate: '2027-01-31', size: '4.5 MB' },
];

export default function Documents() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
      cell: () => (
        <div className="flex flex-row items-center gap-2">
          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-md transition-colors" title="View">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-md transition-colors" title="Download">
            <Download className="w-4 h-4" />
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
        data={mockDocuments} 
        columns={columns} 
        searchPlaceholder="Search documents..."
        onAddClick={() => setIsAddModalOpen(true)}
        addLabel="Upload Document"
      />
    </div>
  );
}
