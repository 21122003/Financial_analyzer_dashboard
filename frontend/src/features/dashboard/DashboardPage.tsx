// File: src/features/dashboard/DashboardPage.tsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { fetchTransactions } from '../transactions/transactionSlice';
import { StatsCard } from '../../components/StatCard';
import { DollarSign, TrendingDown, ListChecks } from 'lucide-react';
import {
 ResponsiveContainer,
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 CartesianGrid,
 PieChart,
 Pie,
 Cell
} from 'recharts';

const DashboardPage: React.FC = () => {
 const dispatch = useDispatch<AppDispatch>();
 const { transactions, isLoading } = useSelector((state: RootState) => state.transactions);

 useEffect(() => {
  dispatch(fetchTransactions());
 }, [dispatch]);

 const totalRevenue = transactions
  .filter((t) => t.category === 'Revenue')
  .reduce((sum: number, t) => sum + t.amount, 0);

 const totalExpense = transactions
  .filter((t) => t.category === 'Expense')
  .reduce((sum: number, t) => sum + t.amount, 0);

 const totalTransactions = transactions.length;

 const monthlyStats = Array.from({ length: 12 }, (_, i) => {
  const month = i;
  const monthRevenue = transactions
   .filter(t => new Date(t.date).getMonth() === month && t.category === 'Revenue')
   .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = transactions
   .filter(t => new Date(t.date).getMonth() === month && t.category === 'Expense')
   .reduce((sum, t) => sum + t.amount, 0);

  return {
   month: new Date(2024, i).toLocaleString('default', { month: 'short' }),
   revenue: monthRevenue,
   expense: monthExpense
  };
 });

 const pieData = Object.entries(
  transactions.reduce((acc, t) => {
   acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
   return acc;
  }, {} as Record<string, number>)
 ).map(([key, value]) => ({ name: key, value }));

 const COLORS = ['#4ade80', '#f87171', '#60a5fa', '#c084fc', '#facc15', '#34d399', '#f472b6', '#a78bfa'];

 return (
  <div className="p-6 space-y-6">
   <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
   <p className="text-gray-600">Overview of your financial activity</p>

   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <StatsCard title="Total Revenue" value={totalRevenue} icon={DollarSign} change={5} changeType="positive" format="currency" />
    <StatsCard title="Total Expense" value={totalExpense} icon={TrendingDown} change={3} changeType="negative" format="currency" />
    <StatsCard title="Total Transactions" value={totalTransactions} icon={ListChecks} change={8} changeType="positive" format="number" />
   </div>

   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue vs Expense</h2>
    <ResponsiveContainer width="100%" height={300}>
     <BarChart data={monthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="revenue" fill="#4ade80" name="Revenue" />
      <Bar dataKey="expense" fill="#f87171" name="Expense" />
     </BarChart>
    </ResponsiveContainer>
   </div>

   <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Category Breakdown</h2>
    <ResponsiveContainer width="100%" height={300}>
     <PieChart>
      <Pie
       data={pieData}
       dataKey="value"
       nameKey="name"
       outerRadius={100}
       label
      >
       {pieData.map((_, i) => (
        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
       ))}
      </Pie>
     </PieChart>
    </ResponsiveContainer>
   </div>

   {isLoading && (
    <div className="text-gray-500">Loading data...</div>
   )}
  </div>
 );
};

export default DashboardPage;