import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import { TransactionService } from '../services/transactionService';
import { CSVService } from '../services/csvService';

export class TransactionController {
  // ✅ Validation for creating a transaction
  static createValidation = [
    body('date').isISO8601().withMessage('Please provide a valid date'),
    body('description').trim().isLength({ min: 1, max: 200 }).withMessage('Description is required and must be under 200 characters'),
    body('category').notEmpty().withMessage('Category is required'),
    body('amount').isNumeric().custom(val => val !== 0).withMessage('Amount must be a non-zero number'),
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('status').optional().isIn(['completed', 'pending', 'failed']).withMessage('Invalid status'),
    body('account').notEmpty().withMessage('Account is required'),
  ];

  // ✅ Validation for updating a transaction
  static updateValidation = [
    body('date').optional().isISO8601().withMessage('Please provide a valid date'),
    body('description').optional().trim().isLength({ min: 1, max: 200 }),
    body('category').optional().notEmpty(),
    body('amount').optional().isNumeric().custom(val => val !== 0),
    body('type').optional().isIn(['income', 'expense']),
    body('status').optional().isIn(['completed', 'pending', 'failed']),
    body('account').optional().notEmpty()
  ];

  // ✅ GET /api/transactions/:id
  static async getTransaction(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const transaction = await TransactionService.getTransactionById(req.user.id, req.params.id);
      res.status(200).json({ success: true, message: 'Transaction retrieved', data: transaction });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message || 'Transaction not found' });
    }
  }

  // ✅ POST /api/transactions
  static async createTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const transaction = await TransactionService.createTransaction(req.user.id, req.body);
      res.status(201).json({ success: true, message: 'Transaction created', data: transaction });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ✅ PUT /api/transactions/:id
  static async updateTransaction(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const updated = await TransactionService.updateTransaction(req.user.id, req.params.id, req.body);
      res.status(200).json({ success: true, message: 'Transaction updated', data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ✅ DELETE /api/transactions/:id
  static async deleteTransaction(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      await TransactionService.deleteTransaction(req.user.id, req.params.id);
      res.status(200).json({ success: true, message: 'Transaction deleted' });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // ✅ POST /api/transactions/export
  static async exportTransactions(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const { format = 'csv', selectedIds, fields, ...filters } = req.body;

      const transactions = await TransactionService.getTransactionsForExport(req.user.id, filters, selectedIds);

      if (transactions.length === 0) {
        return res.status(400).json({ success: false, message: 'No transactions found for export' });
      }

      let exportData: string;
      let contentType: string;
      let filename: string;

      if (format === 'json') {
        // Convert _id to string for each transaction
        const plainTransactions = transactions.map((t: any) => ({
          ...t,
          _id: t._id?.toString ? t._id.toString() : t._id
        }));
        exportData = CSVService.generateJSON(plainTransactions, fields);
        contentType = 'application/json';
        filename = `transactions-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        const plainTransactions = transactions.map((t: any) => ({
          ...t,
          _id: t._id?.toString ? t._id.toString() : t._id
        }));
        exportData = CSVService.generateCSV(plainTransactions, fields);
        contentType = 'text/csv';
        filename = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(exportData);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to export transactions' });
    }
  }

  // ✅ GET /api/transactions/categories
  static async getCategories(req: Request, res: Response) {
    try {
      if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });

      const categories = await TransactionService.getCategories(req.user.id);
      res.status(200).json({ success: true, data: categories });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Failed to retrieve categories' });
    }
  }
}
