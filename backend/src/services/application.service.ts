import { prisma } from '../lib/prisma';
import { Application, ApplicationStatus, ApplicationType, WorkArrangement } from '@prisma/client';

export class ApplicationService {
  async createApplication(userId: string, data: any): Promise<Application> {
    return prisma.application.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getApplications(userId: string, params: {
    search?: string;
    status?: ApplicationStatus;
    type?: ApplicationType;
    location?: string;
    workArrangement?: WorkArrangement;
    sort?: string;
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      status,
      type,
      location,
      workArrangement,
      sort = 'dateApplied',
      order = 'desc',
      page = 1,
      limit = 10,
    } = params;

    const where: any = { userId };

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) where.status = status;
    if (type) where.applicationType = type;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (workArrangement) where.workArrangement = workArrangement;

    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.application.findMany({
        where,
        orderBy: { [sort]: order },
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getApplicationById(id: string, userId: string) {
    const application = await prisma.application.findFirst({
      where: { id, userId },
      include: { interviews: true },
    });

    if (!application) throw new Error('Application not found');
    return application;
  }

  async updateApplication(id: string, userId: string, data: any) {
    const application = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) throw new Error('Application not found');

    return prisma.application.update({
      where: { id },
      data,
    });
  }

  async deleteApplication(id: string, userId: string) {
    const application = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) throw new Error('Application not found');

    return prisma.application.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, userId: string, status: ApplicationStatus) {
    const application = await prisma.application.findFirst({
      where: { id, userId },
    });

    if (!application) throw new Error('Application not found');

    return prisma.application.update({
      where: { id },
      data: { status },
    });
  }
}

export const applicationService = new ApplicationService();
