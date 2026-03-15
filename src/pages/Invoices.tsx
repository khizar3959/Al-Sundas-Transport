import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Printer, Download, FileText, Truck } from 'lucide-react';

export default function Invoices() {
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: 'INV-2026-042',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: 'Tariq Al Habtoor',
    companyName: 'Emirates Contracting',
    address: 'Business Bay, Dubai, UAE',
    equipment: 'Bobcat S450',
    startDate: '2026-03-10',
    endDate: '2026-03-20',
    rate: 150,
    rateType: 'Hourly',
    totalHours: 80,
    vatRate: 5,
  });

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const subtotal = invoiceData.rate * invoiceData.totalHours;
  const vatAmount = subtotal * (invoiceData.vatRate / 100);
  const totalAmount = subtotal + vatAmount;

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoice Generator</h1>
          <p className="text-slate-500 dark:text-slate-400">Generate, print, and save professional invoices.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> PDF</Button>
          <Button onClick={handlePrint} className="gap-2"><Printer className="w-4 h-4" /> Print Invoice</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Sidebar */}
        <div className="lg:col-span-1 space-y-4 print:hidden">
           <Card>
             <div className="p-4 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
               Invoice Details
             </div>
             <CardContent className="space-y-4 p-4">
               <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Invoice #</label>
                  <input type="text" value={invoiceData.invoiceNumber} onChange={e => setInvoiceData({...invoiceData, invoiceNumber: e.target.value})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Customer Name</label>
                  <input type="text" value={invoiceData.customerName} onChange={e => setInvoiceData({...invoiceData, customerName: e.target.value})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Company</label>
                  <input type="text" value={invoiceData.companyName} onChange={e => setInvoiceData({...invoiceData, companyName: e.target.value})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
               </div>
               <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Equipment</label>
                  <input type="text" value={invoiceData.equipment} onChange={e => setInvoiceData({...invoiceData, equipment: e.target.value})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
               </div>
               <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rate</label>
                    <input type="number" value={invoiceData.rate} onChange={e => setInvoiceData({...invoiceData, rate: Number(e.target.value)})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
                 </div>
                 <div>
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Hours/Days</label>
                    <input type="number" value={invoiceData.totalHours} onChange={e => setInvoiceData({...invoiceData, totalHours: Number(e.target.value)})} className="mt-1 w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none" />
                 </div>
               </div>
             </CardContent>
           </Card>
        </div>

        {/* Invoice Preview */}
        <div className="lg:col-span-2">
          <div ref={printRef} className="bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 print:shadow-none print:border-none print:p-0 dark:bg-white dark:text-slate-900 mx-auto">
             {/* Header */}
             <div className="flex justify-between items-start border-b border-orange-500 pb-8">
               <div className="flex items-center gap-3 text-orange-600">
                  <div className="w-12 h-12 rounded bg-orange-100 flex items-center justify-center print:bg-orange-600 print:text-white">
                    <Truck className="w-8 h-8 print:text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">AL SUNDAS</h2>
                    <p className="text-sm font-semibold tracking-widest uppercase text-slate-500">Transport & Equipment</p>
                  </div>
               </div>
               <div className="text-right">
                  <h1 className="text-3xl font-light text-slate-400 uppercase tracking-widest mb-2">Invoice</h1>
                  <p className="font-semibold text-slate-800">{invoiceData.invoiceNumber}</p>
               </div>
             </div>

             {/* Addresses */}
             <div className="grid grid-cols-2 gap-8 mt-8">
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">From</p>
                 <p className="font-bold text-slate-800">Al Sundas Transport LLC</p>
                 <p className="text-slate-500 text-sm mt-1">Al Quoz Industrial Area 3<br/>Dubai, United Arab Emirates<br/>TRN: 100234567800003</p>
               </div>
               <div className="text-right">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                 <p className="font-bold text-slate-800">{invoiceData.companyName}</p>
                 <p className="text-slate-500 text-sm mt-1">Attn: {invoiceData.customerName}<br/>{invoiceData.address}</p>
               </div>
             </div>

             {/* Dates */}
             <div className="grid grid-cols-2 gap-8 mt-8 bg-slate-50 p-4 rounded-lg">
               <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Invoice Date</p>
                  <p className="font-medium mt-1">{invoiceData.date}</p>
               </div>
               <div className="text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">Payment Due By</p>
                  <p className="font-medium mt-1">{invoiceData.dueDate}</p>
               </div>
             </div>

             {/* Line Items */}
             <div className="mt-8">
               <table className="w-full text-left bg-white">
                 <thead>
                   <tr className="border-b-2 border-slate-200 text-sm font-semibold text-slate-600">
                     <th className="py-3 px-2">Description / Equipment Rented</th>
                     <th className="py-3 px-2 text-center">Period</th>
                     <th className="py-3 px-2 text-right">Qty/Hrs</th>
                     <th className="py-3 px-2 text-right">Rate</th>
                     <th className="py-3 px-2 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm">
                   <tr className="border-b border-slate-100">
                     <td className="py-4 px-2">
                       <p className="font-medium text-slate-800">{invoiceData.equipment} Rental</p>
                       <p className="text-slate-500 text-xs mt-1">Includes operator & maintenance</p>
                     </td>
                     <td className="py-4 px-2 text-center text-slate-600 text-xs">{invoiceData.startDate} to {invoiceData.endDate}</td>
                     <td className="py-4 px-2 text-right text-slate-800">{invoiceData.totalHours}</td>
                     <td className="py-4 px-2 text-right text-slate-800">AED {invoiceData.rate}</td>
                     <td className="py-4 px-2 text-right font-medium text-slate-800">AED {subtotal.toLocaleString()}</td>
                   </tr>
                 </tbody>
               </table>
             </div>

             {/* Totals */}
             <div className="flex justify-end mt-8">
               <div className="w-1/2 min-w-[250px] space-y-3 text-sm">
                 <div className="flex justify-between text-slate-600">
                   <span>Subtotal</span>
                   <span>AED {subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-slate-600">
                   <span>VAT ({invoiceData.vatRate}%)</span>
                   <span>AED {vatAmount.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center border-t-2 border-slate-200 pt-3 text-lg font-bold text-slate-900 text-orange-600">
                   <span>Total Due</span>
                   <span>AED {totalAmount.toLocaleString()}</span>
                 </div>
               </div>
             </div>

             {/* Footer */}
             <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 text-center">
               <p>Make all checks payable to Al Sundas Transport LLC.</p>
               <p className="mt-1">Bank: Emirates NBD | Account: 1234567890 | IBAN: AE0000000001234567890</p>
               <p className="mt-4 font-medium text-slate-500">Thank you for your business!</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
