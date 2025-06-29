import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import transactionReducer from '../features/transactions/transactionSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
 reducer: {
  auth: authReducer,
  transactions: transactionReducer,
  dashboard: dashboardReducer,
 },
 middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
   serializableCheck: {
    ignoredActions: ['persist/PERSIST'],
   },
  }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
