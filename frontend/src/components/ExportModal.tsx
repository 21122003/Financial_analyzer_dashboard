// File: src/components/ExportModal.tsx

import React, { useState } from 'react';
import { Transaction } from '../types/Transaction';
import { downloadCSV } from '../utils/downloadCSV';
import { X, Download, FileText, Calendar, DollarSign } from 'lucide-react';

interface ExportModalProps {
 isOpen: boolean;
 onClose: () => void;
 selectedTransactionIds: string[];
 transactions: Transaction[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
 isOpen,
 onClose,
 selectedTransactionIds,
 transactions,
}) => {
 const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('csv');
 const [includeFields, setIncludeFields] = useState({
 date: true,
 category: true,
 amount: true,
 status: true,
 user_id: true,
 user_profile: true,
});

 const [isExporting, setIsExporting] = useState(false);

 if (!isOpen) return null;

 const selectedTransactions = transactions.filter(t => 
  selectedTransactionIds.includes(String(t.id))
 );

 const handleExport = async () => {
  setIsExporting(true);
  
  try {
   // Filter transactions based on selected fields
   const filteredData = selectedTransactions.map(transaction => {
    const filtered: any = {};
    
    if (includeFields.date) filtered.date = transaction.date;
    if (includeFields.category) filtered.category = transaction.category;
    if (includeFields.amount) filtered.amount = transaction.amount;
    if (includeFields.status) filtered.status = transaction.status;
    if (includeFields.user_id) filtered.user_id = transaction.user_id;
    if (includeFields.user_profile) filtered.user_profile = transaction.user_profile;

    
    return filtered;
   });

   if (exportFormat === 'csv') {
    downloadCSV(filteredData, `transactions-${new Date().toISOString().split('T')[0]}`);
   } else {
    // JSON export
    const jsonData = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
   }

   // Close modal after successful export
   setTimeout(() => {
    onClose();
   }, 500);
  } catch (error) {
   console.error('Export failed:', error);
  } finally {
   setIsExporting(false);
  }
 };

 const toggleField = (field: keyof typeof includeFields) => {
  setIncludeFields(prev => ({
   ...prev,
   [field]: !prev[field],
  }));
 };

 const totalAmount = selectedTransactions.reduce((sum, t) => sum + t.amount, 0);

 return (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
   <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-gray-200">
     <h2 className="text-xl font-semibold text-gray-900">Export Transactions</h2>
     <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 transition-colors"
     >
      <X className="h-6 w-6" />
     </button>
    </div>

    {/* Content */}
    <div className="p-6 space-y-6">
     {/* Summary */}
     <div className="bg-blue-50 rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
       <FileText className="h-5 w-5 text-blue-600" />
       <span className="font-medium text-blue-900">Export Summary</span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
       <div>
        <span className="text-gray-600">Selected:</span>
        <span className="ml-1 font-semibold">{selectedTransactions.length} transactions</span>
       </div>
       <div>
        <span className="text-gray-600">Total Amount:</span>
        <span className={`ml-1 font-semibold ${
         totalAmount >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
         ${Math.abs(totalAmount).toLocaleString()}
        </span>
       </div>
      </div>
     </div>

     {/* Export Format */}
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
       Export Format
      </label>
      <div className="grid grid-cols-2 gap-3">
       <button
        onClick={() => setExportFormat('csv')}
        className={`p-3 border rounded-lg text-center transition-colors ${
         exportFormat === 'csv'
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-300 hover:border-gray-400'
        }`}
       >
        <FileText className="h-5 w-5 mx-auto mb-1" />
        <span className="text-sm font-medium">CSV</span>
       </button>
       <button
        onClick={() => setExportFormat('json')}
        className={`p-3 border rounded-lg text-center transition-colors ${
         exportFormat === 'json'
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-300 hover:border-gray-400'
        }`}
       >
        <FileText className="h-5 w-5 mx-auto mb-1" />
        <span className="text-sm font-medium">JSON</span>
       </button>
      </div>
     </div>

     {/* Include Fields */}
     <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
       Include Fields
      </label>
      <div className="space-y-2">
       {Object.entries(includeFields).map(([field, included]) => (
        <label key={field} className="flex items-center">
         <input
          type="checkbox"
          checked={included}
          onChange={() => toggleField(field as keyof typeof includeFields)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
         />
         <span className="ml-2 text-sm text-gray-700 capitalize">
          {field === 'date' && <Calendar className="inline h-4 w-4 mr-1" />}
          {field === 'amount' && <DollarSign className="inline h-4 w-4 mr-1" />}
          {field}
         </span>
        </label>
       ))}
      </div>
     </div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
     <button
      onClick={onClose}
      className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
     >
      Cancel
     </button>
     <button
      onClick={handleExport}
      disabled={isExporting || Object.values(includeFields).every(v => !v)}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
     >
      <Download className="h-4 w-4" />
      <span>{isExporting ? 'Exporting...' : 'Export'}</span>
     </button>
    </div>
   </div>
  </div>
 );
};
