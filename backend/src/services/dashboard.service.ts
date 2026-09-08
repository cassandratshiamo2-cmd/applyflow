import { prisma } from '../lib/prisma';
import { ApplicationStatus } from '@prisma/client';

export class DashboardService {
  async getStats(userId: string) {
    const total = await prisma.application.count({ where: { userId } });

    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const statusMap: Record<string, number> = {
      Saved: 0,
      Applied: 0,
      Assessment: 0,
      Shortlisted: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
      Withdrawn: 0,
    };

    statusCounts.forEach(item => {
      statusMap[item.status] = item._count.id;
    });

    const interviewCount = statusMap['Interview'];
    const offerCount = statusMap['Offer'];
    const rejectedCount = statusMap['Rejected'];

    return {
      total,
      statusCounts: statusMap,
      metrics: {
        interviewRate: total > 0 ? (interviewCount / total) * 100 : 0,
        offerRate: total > 0 ? (offerCount / total) * 100 : 0,
        rejectionRate: total > 0 ? (rejectedCount / total) * 100 : 0,
      },
    };
  }

  async getApplicationTrends(userId: string) {
    const applications = await prisma.application.findMany({
      where: { userId },
      select: { dateApplied: true },
      orderBy: { dateApplied: 'asc' },
    });

    const trends: Record<string, number> = {};
    applications.forEach(app => {
      const date = app.dateApplied.toISOString().split('T')[0];
      trends[date] = (trends[date] || 0) + 1;
    });

    return trends;
  }
}

export const dashboardService = new DashboardService();
