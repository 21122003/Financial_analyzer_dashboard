// File: src/types/Transaction.ts

import { Document } from 'mongoose';
// import { LeanTransaction } from '../models/Transaction';
export interface ITransaction extends Document {
 _id: string;
 userId: string;
 date: Date;
 description: string;
 category: string;
 amount: number;
 type: 'income' | 'expense';
 status: 'pending' | 'completed' | 'failed';
 account: string;
 tags?: string[];
 notes?: string;
 createdAt: Date;
 updatedAt: Date;
}

export interface TransactionFilters {
 search?: string;
 category?: string;
 type?: 'income' | 'expense';
 status?: 'pending' | 'completed' | 'failed';
 dateFrom?: string;
 dateTo?: string;
 minAmount?: number;
 maxAmount?: number;
}

export interface TransactionQuery {
 page?: number;
 limit?: number;
 sortBy?: string;
 sortOrder?: 'asc' | 'desc';
 filters?: TransactionFilters;
}

export interface PaginatedTransactions {
 transactions: ITransaction[];
 pagination: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
 };
}
export interface DashboardStats {
 totalBalance: number;
 monthlyIncome: number;
 monthlyExpenses: number;
 transactionCount: number;
 monthlyGrowth: number;
 categoryBreakdown: Array<{
  category: string;
  amount: number;
  percentage: number;
 }>;
 recentTransactions: ITransaction[];
}
