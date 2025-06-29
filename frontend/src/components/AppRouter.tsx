// File: Loopr_Ai/project/frontend/src/components/AppRouter.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../features/auth/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import TransactionPage from '../features/transactions/TransactionPage';
import { MainLayout } from './MainLayout';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('[AppRouter] isLoading:', isLoading);
  console.log('[AppRouter] isAuthenticated:', isAuthenticated);

  if (isLoading) {
    console.log('[AppRouter] Showing loading screen');
    return <div className="p-6 text-gray-600">Loading authentication...</div>;
  }

  console.log('[AppRouter] Rendering routes');
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}
      {isAuthenticated ? (
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/analytics" element={<div>Analytics page coming soon...</div>} />
          <Route path="/settings" element={<div>Settings page coming soon...</div>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};
