// File: src/features/transactions/TransactionTable.tsx

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
 setSort, 
 setPagination, 
 toggleTransactionSelection, 
 selectAllTransactions, 
 clearSelectedTransactions 
} from './transactionSlice';
import { Transaction } from '../../types/Transaction';
import { ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

interface TransactionTableProps {
 transactions: Transaction[];
 isLoading: boolean;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
 transactions, 
 isLoading 
}) => {
 const dispatch = useDispatch<AppDispatch>();
 const { sort, pagination, selectedTransactions } = useSelector(
  (state: RootState) => state.transactions
 );

 const handleSort = (field: keyof Transaction) => {
  const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
  dispatch(setSort({ field, direction }));
 };

 const handlePageChange = (page: number) => {
  dispatch(setPagination({ currentPage: page }));
 };

 const handleRowsPerPageChange = (itemsPerPage: number) => {
  dispatch(setPagination({ itemsPerPage, currentPage: 1 }));
 };

 const getSortIcon = (field: keyof Transaction) => {
  if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />;
  return sort.direction === 'asc' 
   ? <ChevronUp className="h-4 w-4" />
   : <ChevronDown className="h-4 w-4" />;
 };

 const getStatusBadge = (status: Transaction['status']) => {
  const statusStyles = {
   Paid: 'bg-green-100 text-green-800',
   Pending: 'bg-yellow-100 text-yellow-800',
   Failed: 'bg-red-100 text-red-800',
  };
  const style = statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800';

  return (
   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
    {status}
   </span>
  );
 };

 const formatCurrency = (amount: number) => {
  const absAmount = Math.abs(amount);
  const sign = amount >= 0 ? '+' : '-';
  const color = amount >= 0 ? 'text-green-600' : 'text-red-600';
  return <span className={`font-semibold ${color}`}>{sign}${absAmount.toLocaleString()}</span>;
 };

 if (isLoading) {
  return (
   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="animate-pulse space-y-4">
     {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-200 rounded"></div>
     ))}
    </div>
   </div>
  );
 }

 return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
   {/* Table Header with Bulk Actions */}
   <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
     <div className="flex items-center space-x-3">
      <label className="flex items-center">
       <input
        type="checkbox"
        checked={selectedTransactions.length === transactions.length && transactions.length > 0}
        onChange={(e) => {
         if (e.target.checked) {
          dispatch(selectAllTransactions());
         } else {
          dispatch(clearSelectedTransactions());
         }
        }}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
       />
       <span className="ml-2 text-sm text-gray-700">
        Select All ({selectedTransactions.length} selected)
       </span>
      </label>
     </div>

     <div className="flex items-center space-x-2 text-sm text-gray-600">
      <span>Rows per page:</span>
      <select
       value={pagination.itemsPerPage}
       onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
       className="border border-gray-300 rounded px-2 py-1 text-sm"
      >
       <option value={10}>10</option>
       <option value={25}>25</option>
       <option value={50}>50</option>
      </select>
     </div>
    </div>
   </div>

   {/* Table */}
   <div className="overflow-x-auto">
    <table className="w-full">
     <thead className="bg-gray-50">
      <tr>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
      </tr>
     </thead>
     <tbody className="bg-white divide-y divide-gray-200">
      {transactions.map((tx) => (
       <tr
        key={tx.id}
        className={`hover:bg-gray-50 ${selectedTransactions.includes(tx.id) ? 'bg-blue-50' : ''}`}
       >
        <td className="px-6 py-4 whitespace-nowrap">
         <input
          type="checkbox"
          checked={selectedTransactions.includes(tx.id)}
          onChange={() => dispatch(toggleTransactionSelection(tx.id))}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
         />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
         {new Date(tx.date).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <div className="flex items-center space-x-2">
          <img
           src={tx.user_profile}
           alt={String(tx.user_id)}

           className="w-6 h-6 rounded-full"
          />
          <span className="text-sm font-medium text-gray-900">{tx.user_id}</span>
         </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {tx.category}
         </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm">
         {formatCurrency(tx.amount)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
         {getStatusBadge(tx.status)}
        </td>
       </tr>
      ))}
     </tbody>
    </table>
   </div>

   {/* Pagination */}
   <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
    <div className="flex items-center justify-between">
     <div className="text-sm text-gray-700">
      Showing {Math.min((pagination.currentPage - 1) * pagination.itemsPerPage + 1, pagination.totalItems)} to{' '}
      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
      {pagination.totalItems} results
     </div>

     <div className="flex items-center space-x-2">
      <button
       onClick={() => handlePageChange(pagination.currentPage - 1)}
       disabled={pagination.currentPage === 1}
       className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Previous
      </button>

      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
       const pageNum = Math.max(1, pagination.currentPage - 2) + i;
       if (pageNum > pagination.totalPages) return null;

       return (
        <button
         key={pageNum}
         onClick={() => handlePageChange(pageNum)}
         className={`px-3 py-1 border rounded-md text-sm font-medium ${
          pageNum === pagination.currentPage
           ? 'bg-blue-600 text-white border-blue-600'
           : 'border-gray-300 text-gray-500 hover:text-gray-700'
         }`}
        >
         {pageNum}
        </button>
       );
      })}

      <button
       onClick={() => handlePageChange(pagination.currentPage + 1)}
       disabled={pagination.currentPage === pagination.totalPages}
       className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
       Next
      </button>
     </div>
    </div>
   </div>
  </div>
 );
};