// File: src/features/auth/LoginPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginCredentials } from '../../types/User';
import { Eye, EyeOff, TrendingUp, Shield, BarChart3 } from 'lucide-react';

const LoginPage: React.FC = () => {
 const { login, isLoading, error, isAuthenticated } = useAuth();
 const [formData, setFormData] = useState<LoginCredentials>({
  email: '',
  password: '',
 });
 const [showPassword, setShowPassword] = useState(false);

 useEffect(() => {
  if (isAuthenticated) {
   window.location.href = '/dashboard';
  }
 }, [isAuthenticated]);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await login(formData);
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
   <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
    {/* Left side - Branding */}
    <div className="hidden lg:flex flex-col justify-center space-y-8">
     <div className="space-y-6">
      <div className="flex items-center space-x-3">
       <div className="p-3 bg-blue-600 rounded-xl">
        <TrendingUp className="h-8 w-8 text-white" />
       </div>
       <h1 className="text-4xl font-bold text-gray-900">FinanceHub</h1>
      </div>
      
      <h2 className="text-3xl font-bold text-gray-900 leading-tight">
       Your Financial Analytics
       <span className="block text-blue-600">Dashboard</span>
      </h2>
      
      <p className="text-lg text-gray-600 leading-relaxed">
       Get comprehensive insights into your financial data with real-time analytics, 
       interactive charts, and powerful reporting tools.
      </p>
     </div>

     <div className="space-y-4">
      <div className="flex items-center space-x-3">
       <Shield className="h-6 w-6 text-blue-600" />
       <span className="text-gray-700">Bank-level security</span>
      </div>
      <div className="flex items-center space-x-3">
       <BarChart3 className="h-6 w-6 text-blue-600" />
       <span className="text-gray-700">Real-time analytics</span>
      </div>
      <div className="flex items-center space-x-3">
       <TrendingUp className="h-6 w-6 text-blue-600" />
       <span className="text-gray-700">Advanced reporting</span>
      </div>
     </div>
    </div>

    {/* Right side - Login form */}
    <div className="flex items-center justify-center">
     <div className="w-full max-w-md space-y-8">
      <div className="lg:hidden text-center">
       <div className="flex items-center justify-center space-x-2 mb-4">
        <TrendingUp className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">FinanceHub</h1>
       </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
       <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
       </div>

       {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
         <p className="text-red-600 text-sm">{error}</p>
        </div>
       )}

       <form onSubmit={handleSubmit} className="space-y-6">
        <div>
         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email address
         </label>
         <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="Enter your email"
         />
        </div>

        <div>
         <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Password
         </label>
         <div className="relative">
          <input
           type={showPassword ? 'text' : 'password'}
           id="password"
           name="password"
           value={formData.password}
           onChange={handleInputChange}
           required
           className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
           placeholder="Enter your password"
          />
          <button
           type="button"
           onClick={() => setShowPassword(!showPassword)}
           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          >
           {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
         </div>
        </div>

        <button
         type="submit"
         disabled={isLoading}
         className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
         {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
       </form>

       <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
        <p className="text-sm font-mono text-gray-800">Email: admin@example.com</p>
        <p className="text-sm font-mono text-gray-800">Password: password123</p>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default LoginPage;
