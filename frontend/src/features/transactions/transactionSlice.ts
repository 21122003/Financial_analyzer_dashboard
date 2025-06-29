// File: src/features/transactions/transactionSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionFilters, TransactionSort, PaginationState } from '../../types/Transaction';

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  filters: TransactionFilters;
  sort: TransactionSort;
  pagination: PaginationState;
  isLoading: boolean;
  error: string | null;
  selectedTransactions: (string | number)[];
}

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  filters: {
    category: 'All',
    status: 'all',
    type: 'all',
    search: '',
    dateRange: { from: '', to: '' }
  },
  sort: {
    field: 'date',
    direction: 'desc'
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0
  },
  isLoading: false,
  error: null,
  selectedTransactions: []
};

export const fetchTransactions = createAsyncThunk<Transaction[]>(
  'transactions/fetchTransactions',
  async () => {
    const response = await fetch('/api/transactions');
    const json = await response.json();

    if (!json.success) {
      throw new Error('Failed to fetch transactions');
    }

    return json.data.transactions;
  }
);

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    setSort: (state, action: PayloadAction<TransactionSort>) => {
      state.sort = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<PaginationState>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    toggleTransactionSelection: (state, action: PayloadAction<string | number>) => {
      const transactionId = action.payload;
      const index = state.selectedTransactions.indexOf(transactionId);
      if (index === -1) {
        state.selectedTransactions.push(transactionId);
      } else {
        state.selectedTransactions.splice(index, 1);
      }
    },
    selectAllTransactions: (state) => {
      const currentPageTransactions = state.filteredTransactions
        .slice(
          (state.pagination.currentPage - 1) * state.pagination.itemsPerPage,
          state.pagination.currentPage * state.pagination.itemsPerPage
        )
        .map(t => t.id);
      state.selectedTransactions = [...new Set([...state.selectedTransactions, ...currentPageTransactions])];
    },
    clearSelectedTransactions: (state) => {
      state.selectedTransactions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
        state.filteredTransactions = applyFiltersAndSort(action.payload, state.filters, state.sort);
        state.pagination.totalItems = state.filteredTransactions.length;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.itemsPerPage);
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

const applyFiltersAndSort = (
  transactions: Transaction[],
  filters: TransactionFilters,
  sort: TransactionSort
): Transaction[] => {
  let filtered = [...transactions];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(t =>
      t.user_id.toLowerCase().includes(searchLower) ||
      t.category.toLowerCase().includes(searchLower) ||
      t.status.toLowerCase().includes(searchLower)
    );
  }

  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(t => t.category === filters.category);
  }

  if (filters.type && filters.type !== 'all') {
    filtered = filtered.filter(t => t.type === filters.type);
  }

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(t => t.status === filters.status);
  }

  if (filters.dateRange?.from) {
    filtered = filtered.filter(t => new Date(t.date) >= new Date(filters.dateRange.from!));
  }

  if (filters.dateRange?.to) {
    filtered = filtered.filter(t => new Date(t.date) <= new Date(filters.dateRange.to!));
  }

  // Sort logic
  filtered.sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sort.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    if (
      sort.field === 'date' &&
      typeof aValue === 'string' &&
      typeof bValue === 'string'
    ) {
      return sort.direction === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
    }

    return 0;
  });

  return filtered;
};

export const {
  setFilters,
  setSort,
  setPagination,
  toggleTransactionSelection,
  selectAllTransactions,
  clearSelectedTransactions
} = transactionSlice.actions;

export default transactionSlice.reducer;
