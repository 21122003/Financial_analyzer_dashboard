// File: src/components/StatsCard.tsx

import React from 'react';
import type { LucideIcon } from 'lucide-react'; // Correct type for icon props

interface StatsCardProps {
 title: string;
 value: number;
 icon: LucideIcon;
 change: number;
 changeType: 'positive' | 'negative';
 format: 'currency' | 'number' | 'percentage';
}

export const StatsCard: React.FC<StatsCardProps> = ({
 title,
 value,
 icon: Icon,
 change,
 changeType,
 format,
}) => {
 const formatValue = (val: number, fmt: string) => {
  switch (fmt) {
   case 'currency':
    return `$${val.toLocaleString()}`;
   case 'percentage':
    return `${val}%`;
   default:
    return val.toLocaleString();
  }
 };

 return (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
   <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
     <div className="p-3 bg-blue-50 rounded-xl">
      <Icon className="h-6 w-6 text-blue-600" />
     </div>
     <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{formatValue(value, format)}</p>
     </div>
    </div>
   </div>

   <div className="mt-4 flex items-center">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
     changeType === 'positive'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800'
    }`}>
     {changeType === 'positive' ? '+' : ''}{change}%
    </span>
    <span className="ml-2 text-sm text-gray-500">vs last month</span>
   </div>
  </div>
 );
};