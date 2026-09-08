import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

const getParam = (param: string | string[]) => (Array.isArray(param) ? param[0] : param);

export class NotificationController {
  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await notificationService.getNotifications(userId, page, limit);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch notifications',
      });
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      await notificationService.markAsRead(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark notification as read',
      });
    }
  }

  async markAllRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      await notificationService.markAllAsRead(userId);

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to mark all notifications as read',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      await notificationService.deleteNotification(id, userId);

      res.status(200).json({
        success: true,
        message: 'Notification deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Notification not found',
      });
    }
  }

  async getCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const count = await notificationService.getUnreadCount(userId);

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch notification count',
      });
    }
  }
}

export const notificationController = new NotificationController();
