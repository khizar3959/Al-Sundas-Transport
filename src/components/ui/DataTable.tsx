import React, { useState } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onAddClick?: () => void;
  addLabel?: string;
  isLoading?: boolean;
}

export function DataTable<T>({ data, columns, searchPlaceholder = 'Search...', onAddClick, addLabel, isLoading = false }: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white dark:bg-[#11131e] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 dark:text-slate-200 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-100 transition-colors dark:bg-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          {onAddClick && (
            <button 
              onClick={onAddClick}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
            >
              <span>{addLabel || 'Add New'}</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-3">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                    <span>Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] as any) : ''}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div>Showing 1 to {Math.min(data.length, 10)} of {data.length} entries</div>
        <div className="flex items-center gap-2">
          <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-medium">1</button>
          <button className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>
    </div>
  );
}
