// File: src/utils/downloadCSV.ts

import { saveAs } from 'file-saver';

export const downloadCSV = (data: any[], filename: string) => {
 if (!data || data.length === 0) {
  throw new Error('No data to export');
 }

 // Get all unique keys from the data
 const headers = Array.from(
  new Set(data.flatMap(item => Object.keys(item)))
 );

 // Create CSV header row
 const csvHeader = headers.join(',');

 // Create CSV data rows
 const csvRows = data.map(item => 
  headers.map(header => {
   const value = item[header] || '';
   // Escape values that contain commas, quotes, or newlines
   if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
    return `"${value.replace(/"/g, '""')}"`;
   }
   return value;
  }).join(',')
 );

 // Combine header and rows
 const csvContent = [csvHeader, ...csvRows].join('\n');

 // Create and download the file
 const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
 saveAs(blob, `${filename}.csv`);
};

export const formatCurrency = (amount: number): string => {
 return new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
 }).format(amount);
};

export const formatDate = (date: string): string => {
 return new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
 });
};