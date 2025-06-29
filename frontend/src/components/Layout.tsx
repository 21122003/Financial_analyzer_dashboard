// File: src/components/Layout.tsx

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
 children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
 const { isAuthenticated } = useAuth();

 if (!isAuthenticated) {
  return <>{children}</>;
 }

 return (
  <div className="min-h-screen bg-gray-50 flex">
   <Sidebar />
   <div className="flex-1 flex flex-col overflow-hidden">
    <Header />
    <main className="flex-1 overflow-auto">
     {children}
    </main>
   </div>
  </div>
 );
};