// File: src/features/dashboard/ChartPanel.tsx

import React from 'react';
import {
 LineChart,
 Line,
 XAxis,
 YAxis,
 CartesianGrid,
 Tooltip,
 ResponsiveContainer,
 BarChart,
 Bar,
} from 'recharts';

interface ChartData {
 month: string;
 income: number;
 expenses: number;
}

interface ChartPanelProps {
 data: ChartData[];
}

export const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
 return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
   <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses</h3>
    <div className="flex items-center space-x-4">
     <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      <span className="text-sm text-gray-600">Income</span>
     </div>
     <div className="flex items-center space-x-2">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <span className="text-sm text-gray-600">Expenses</span>
     </div>
    </div>
   </div>

   <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
     <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis 
       dataKey="month" 
       stroke="#6b7280"
       fontSize={12}
      />
      <YAxis 
       stroke="#6b7280"
       fontSize={12}
       tickFormatter={(value) => `$${value.toLocaleString()}`}
      />
      <Tooltip
       formatter={(value: number, name: string) => [
        `$${value.toLocaleString()}`,
        name.charAt(0).toUpperCase() + name.slice(1)
       ]}
       labelStyle={{ color: '#374151' }}
       contentStyle={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
       }}
      />
      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
      <Bar dataKey="expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
     </BarChart>
    </ResponsiveContainer>
   </div>
  </div>
 );
};