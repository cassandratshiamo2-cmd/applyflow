import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';

export class DashboardController {
  async getStats(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const stats = await dashboardService.getStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard stats',
      });
    }
  }

  async getTrends(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const trends = await dashboardService.getApplicationTrends(userId);

      res.status(200).json({
        success: true,
        data: trends,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch application trends',
      });
    }
  }
}

export const dashboardController = new DashboardController();
