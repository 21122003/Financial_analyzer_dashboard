// File: src/services/csvService.ts

import { Parser } from 'json2csv';
import { ITransaction } from '../types/Transaction';

export class CSVService {
 static generateCSV(
  transactions: ITransaction[],
  selectedFields?: string[]
 ): string {
  if (!transactions || transactions.length === 0) {
   throw new Error('No transactions to export');
  }

  // Default fields to include
  const defaultFields = [
   { label: 'Date', value: 'date' },
   { label: 'Description', value: 'description' },
   { label: 'Category', value: 'category' },
   { label: 'Amount', value: 'amount' },
   { label: 'Type', value: 'type' },
   { label: 'Status', value: 'status' },
   { label: 'Account', value: 'account' },
   { label: 'Notes', value: 'notes' }
  ];

  // Filter fields based on selection
  let fields = defaultFields;
  if (selectedFields && selectedFields.length > 0) {
   fields = defaultFields.filter(field => 
    selectedFields.includes(field.value)
   );
  }

  // Transform data for CSV
  const transformedData = transactions.map(transaction => ({
   date: new Date(transaction.date).toLocaleDateString(),
   description: transaction.description,
   category: transaction.category,
   amount: transaction.amount,
   type: transaction.type,
   status: transaction.status,
   account: transaction.account,
   notes: transaction.notes || ''
  }));

  try {
   const parser = new Parser({ fields });
   return parser.parse(transformedData);
  } catch (error) {
   throw new Error('Failed to generate CSV');
  }
 }

 static generateJSON(
  transactions: ITransaction[],
  selectedFields?: string[]
 ): string {
  if (!transactions || transactions.length === 0) {
   throw new Error('No transactions to export');
  }

  let data = transactions;

  // Filter fields if specified
  if (selectedFields && selectedFields.length > 0) {
   data = transactions.map(transaction => {
    const filtered: any = {};
    selectedFields.forEach(field => {
     if (field === 'date') {
      filtered[field] = new Date(transaction.date).toLocaleDateString();
     } else {
      filtered[field] = (transaction as any)[field];
     }
    });
    return filtered;
   });
  }

  return JSON.stringify(data, null, 2);
 }
}