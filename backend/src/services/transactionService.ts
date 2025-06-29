// File: src/services/transactionService.ts
import { Transaction } from '../models/Transaction';
import { Types } from 'mongoose';

export class TransactionService {
  static async getTransactionById(userId: string, transactionId: string) {
    return await Transaction.findOne({
      _id: transactionId,
      userId: new Types.ObjectId(userId),
    }).lean();
  }

  static async createTransaction(userId: string, data: any) {
    return await Transaction.create({ ...data, userId });
  }

  static async updateTransaction(userId: string, transactionId: string, updates: any) {
    return await Transaction.findOneAndUpdate(
      { _id: transactionId, userId },
      updates,
      { new: true }
    ).lean();
  }

  static async deleteTransaction(userId: string, transactionId: string) {
    return await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: new Types.ObjectId(userId),
    });
  }

  static async getCategories(userId: string) {
    return await Transaction.aggregate([
      { $match: { userId: new Types.ObjectId(userId) } },
      { $group: { _id: '$category' } },
      { $project: { category: '$_id', _id: 0 } }
    ]);
  }

  static async getTransactionsForExport(
    userId: string,
    filters: any,
    selectedIds?: string[]
  ) {
    const query: any = { userId: new Types.ObjectId(userId) };

    if (selectedIds && selectedIds.length > 0) {
      query._id = { $in: selectedIds.map(id => new Types.ObjectId(id)) };
    }

    // Add filters like date, category, etc.
    if (filters.dateFrom || filters.dateTo) {
      query.date = {};
      if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
      if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
    }

    if (filters.category) query.category = filters.category;
    if (filters.type) query.type = filters.type;
    if (filters.status) query.status = filters.status;

    return await Transaction.find(query).lean();
  }
}
