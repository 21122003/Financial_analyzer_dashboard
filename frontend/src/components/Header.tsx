import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Menu, Bell, User, Search } from 'lucide-react';

interface HeaderProps {
 onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
 const { user } = useAuth();
 const [showUserMenu, setShowUserMenu] = useState(false);

 return (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
   <div className="flex items-center justify-between">
    <div className="flex items-center space-x-4">
     <button
      onClick={onMenuClick}
      className="lg:hidden text-gray-500 hover:text-gray-700"
     >
      <Menu className="h-6 w-6" />
     </button>

     <div className="hidden md:block relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
       <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
       type="text"
       placeholder="Search..."
       className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
     </div>
    </div>

    <div className="flex items-center space-x-4">
     <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
      <Bell className="h-6 w-6" />
      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
       3
      </span>
     </button>

     <div className="relative">
      <button
       onClick={() => setShowUserMenu(!showUserMenu)}
       className="flex items-center space-x-3 text-gray-700 hover:text-gray-900 transition-colors"
      >
       <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
        <User className="h-5 w-5 text-blue-600" />
       </div>
       <div className="hidden md:block text-left">
        <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-gray-500">{user?.email}</p>
       </div>
      </button>

      {showUserMenu && (
       <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
        <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
         Profile
        </a>
        <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
         Settings
        </a>
        <hr className="my-1" />
        <button
         onClick={() => {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
         }}
         className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
         Sign Out
        </button>
       </div>
      )}
     </div>
    </div>
   </div>
  </header>
 );
};
