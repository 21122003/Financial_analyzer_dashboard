// File: src/components/Sidebar.tsx

import React from 'react';
import { useLocation } from '../hooks/useLocation';
import { mainNavigation } from '../config/navigation';
import { TrendingUp, LogOut, X } from 'lucide-react';

interface SidebarProps {
 isOpen?: boolean;
 onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
 const currentPath = useLocation();

 const handleNavigation = (href: string) => {
  window.location.href = href;
  if (onClose) onClose();
 };

 return (
  <>
   {/* Mobile overlay */}
   {isOpen && (
    <div 
     className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
     onClick={onClose}
    />
   )}

   {/* Sidebar */}
   <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:inset-0
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
   `}>
    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
     <div className="flex items-center space-x-2">
      <TrendingUp className="h-8 w-8 text-blue-600" />
      <span className="text-xl font-bold text-gray-900">FinanceHub</span>
     </div>
     <button
      onClick={onClose}
      className="lg:hidden text-gray-400 hover:text-gray-600"
     >
      <X className="h-6 w-6" />
     </button>
    </div>

    <nav className="mt-8 px-4">
     <ul className="space-y-2">
      {mainNavigation.map((item) => {
       const isActive = currentPath === item.href;
       return (
        <li key={item.name}>
         <button
          onClick={() => handleNavigation(item.href)}
          className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
           ${isActive
            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
           }
          `}
         >
          <item.icon className="mr-3 h-5 w-5" />
          {item.name}
         </button>
        </li>
       );
      })}
     </ul>
    </nav>

    <div className="absolute bottom-4 left-4 right-4">
     <button
      onClick={() => {
       localStorage.removeItem('auth_token');
       window.location.href = '/login';
      }}
      className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
     >
      <LogOut className="mr-3 h-5 w-5" />
      Sign Out
     </button>
    </div>
   </div>
  </>
 );
};
