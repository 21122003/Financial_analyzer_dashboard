// File: src/features/dashboard/dashboardSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface DashboardStats {
 totalBalance: number;
 monthlyIncome: number;
 monthlyExpenses: number;
 transactionCount: number;
}

interface ChartData {
 month: string;
 income: number;
 expenses: number;
}

interface DashboardState {
 stats: DashboardStats | null;
 chartData: ChartData[];
 isLoading: boolean;
 error: string | null;
}

const initialState: DashboardState = {
 stats: null,
 chartData: [],
 isLoading: false,
 error: null,
};

export const fetchDashboardData = createAsyncThunk(
 'dashboard/fetchData',
 async (_, { rejectWithValue }) => {
  try {
   // Mock data - replace with actual API call
   return new Promise<{ stats: DashboardStats; chartData: ChartData[] }>((resolve) => {
    setTimeout(() => {
     resolve({
      stats: {
       totalBalance: 125420.50,
       monthlyIncome: 8500.00,
       monthlyExpenses: 3200.00,
       transactionCount: 247,
      },
      chartData: [
       { month: 'Jan', income: 8200, expenses: 3100 },
       { month: 'Feb', income: 8500, expenses: 2800 },
       { month: 'Mar', income: 7800, expenses: 3400 },
       { month: 'Apr', income: 9200, expenses: 3600 },
       { month: 'May', income: 8800, expenses: 3200 },
       { month: 'Jun', income: 8500, expenses: 3200 },
      ],
     });
    }, 1000);
   });
  } catch (error: any) {
   return rejectWithValue(error.message);
  }
 }
);

const dashboardSlice = createSlice({
 name: 'dashboard',
 initialState,
 reducers: {},
 extraReducers: (builder) => {
  builder
   .addCase(fetchDashboardData.pending, (state) => {
    state.isLoading = true;
    state.error = null;
   })
   .addCase(fetchDashboardData.fulfilled, (state, action) => {
    state.isLoading = false;
    state.stats = action.payload.stats;
    state.chartData = action.payload.chartData;
   })
   .addCase(fetchDashboardData.rejected, (state, action) => {
    state.isLoading = false;
    state.error = action.payload as string;
   });
 },
});

export default dashboardSlice.reducer;