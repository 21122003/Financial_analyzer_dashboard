import { Router, Request, Response } from 'express';
import { Transaction } from '../models/Transaction';
import { authenticateToken } from '../middleware/authMiddleware';
import { TransactionController } from '../controllers/transactionController';

const router: Router = Router();

// ✅ Middleware to protect all transaction routes
router.use(authenticateToken);

// ✅ GET /api/transactions — filtered transactions list
router.get('/', async (req: Request, res: Response) => {
  try {
    const query: any = {};

    // 🔍 Basic filters
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }
    if (req.query.user_id) {
      query.user_id = req.query.user_id;
    }

    // 🔍 Date range
    if (req.query.from || req.query.to) {
      query.date = {};
      if (req.query.from) query.date.$gte = new Date(req.query.from as string);
      if (req.query.to) query.date.$lte = new Date(req.query.to as string);
    }

    // 🔍 Amount range
    if (req.query.min || req.query.max) {
      query.amount = {};
      if (req.query.min) query.amount.$gte = parseFloat(req.query.min as string);
      if (req.query.max) query.amount.$lte = parseFloat(req.query.max as string);
    }

    // 🔍 Search across fields
    const search = req.query.search as string;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { user_id: regex },
        { status: regex },
        { category: regex }
      ];
    }

    const transactions = await Transaction.find(query).lean();
    res.status(200).json({ success: true, data: { transactions } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching transactions' });
  }
});

// ✅ Export route for CSV/JSON
router.post('/export', TransactionController.exportTransactions);

export default router;
