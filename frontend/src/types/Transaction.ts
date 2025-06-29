// File: src/types/Transaction.ts

// src/features/transactions/transactionTypes.ts
export interface Transaction {
 id: number;
 date: string;
 amount: number;
 category: 'Revenue' | 'Expense';
 status: string;
 user_id: string;
 user_profile: string;
 type?: 'income' | 'expense';
}

export interface TransactionFilters {
 search: string;
 category: string;
 type: 'all' | 'income' | 'expense';
 status: 'all' | 'pending' | 'completed' | 'failed';
 dateRange: {
  from: string;
  to: string;
 };
}

export interface TransactionSort {
 field: keyof Transaction;
 direction: 'asc' | 'desc';
}

export interface PaginationState {
 currentPage: number;
 itemsPerPage: number;
 totalItems: number;
 totalPages: number;
}