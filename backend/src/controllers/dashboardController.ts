import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  // ✅ GET /api/dashboard/summary
  static async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const stats = await DashboardService.getDashboardStats(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Dashboard stats retrieved successfully',
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve dashboard stats',
      });
    }
  }

  // ✅ GET /api/dashboard/chart-data?months=6
  static async getChartData(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
        return;
      }

      const { months = 6 } = req.query;
      const monthsNumber =
        typeof months === 'string' ? parseInt(months, 10) : 6;

      const chartData = await DashboardService.getMonthlyChartData(
        req.user.id,
        monthsNumber
      );

      res.status(200).json({
        success: true,
        message: 'Chart data retrieved successfully',
        data: chartData,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve chart data',
      });
    }
  }
}
