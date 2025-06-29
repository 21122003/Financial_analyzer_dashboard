// File: src/features/transactions/TransactionPage.tsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { 
 fetchTransactions, 
 setFilters, 
 setSort, 
 setPagination,
 toggleTransactionSelection,
 selectAllTransactions,
 clearSelectedTransactions 
} from './transactionSlice';
import { TransactionTable } from './TransactionTable';
import TransactionFilters from './TransactionFileter'; // fix import name
import { ExportModal } from '../../components/ExportModal';
import { Download, RefreshCw } from 'lucide-react';

const TransactionPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    filteredTransactions,
    pagination,
    selectedTransactions,
    isLoading,
    error,
    filters // <-- get filters from state
  } = useSelector((state: RootState) => state.transactions);

  const [showExportModal, setShowExportModal] = useState(false);

  // Fetch transactions and re-apply filters on refresh
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch, filters.category, filters.status, filters.dateRange?.from, filters.dateRange?.to]);

  const handleRefresh = () => {
    dispatch(clearSelectedTransactions());
    dispatch(fetchTransactions());
  };

  const handleExport = () => {
    if (selectedTransactions.length > 0) {
      setShowExportModal(true);
    }
  };

  // Get paginated transactions
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + pagination.itemsPerPage
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar Filters */}
      <aside className="w-full lg:w-1/4 bg-white border-r border-gray-200 p-6 flex-shrink-0">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <TransactionFilters />
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-1">
              Manage and analyze your financial transactions
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              disabled={selectedTransactions.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export ({selectedTransactions.length})</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">Error loading transactions: {error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-4">
          <TransactionTable
            transactions={paginatedTransactions}
            isLoading={isLoading}
          />
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            selectedTransactionIds={selectedTransactions.map(String)}
            transactions={filteredTransactions}
          />
        )}
      </main>
    </div>
  );
};

export default TransactionPage;