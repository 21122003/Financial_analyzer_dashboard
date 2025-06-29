import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  date: Date;
  description?: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  account?: string;
  tags?: string[];
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// models/Transaction.ts

const transactionSchema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  category: String,
  amount: Number,
  type: { type: String, enum: ['income', 'expense'] },
  status: { type: String, enum: ['paid', 'pending', 'failed'] },
  account: String,
  description: String,
  notes: String,
  tags: [String],
});

// 🔍 Add text index for full-text search
transactionSchema.index({
  description: 'text',
  category: 'text',
  account: 'text',
  notes: 'text',
});

export const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
