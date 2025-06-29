import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticateToken } from '../middleware/authMiddleware';

const router: Router = Router();

// ✅ Apply JWT auth middleware to all routes
router.use(authenticateToken);

// ✅ GET /api/dashboard/summary — Main dashboard stats
router.get('/summary', DashboardController.getDashboardStats);

// ✅ GET /api/dashboard/chart-data — Income/expense chart
router.get('/chart-data', DashboardController.getChartData);

export const dashboardRoutes = router;
