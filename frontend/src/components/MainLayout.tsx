// File: src/components/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout: React.FC = () => {
 return (
  <div className="min-h-screen bg-gray-50 flex">
   <Sidebar />
   <div className="flex-1 flex flex-col overflow-hidden">
    <Header />
    <main className="flex-1 overflow-auto p-6">
     <Outlet />
    </main>
   </div>
  </div>
 );
};
