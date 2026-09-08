import { prisma } from '../lib/prisma';
import { Interview, InterviewStatus } from '@prisma/client';

export class InterviewService {
  async createInterview(applicationId: string, userId: string, data: any): Promise<Interview> {
    // Verify application belongs to user
    const application = await prisma.application.findFirst({
      where: { id: applicationId, userId },
    });

    if (!application) {
      throw new Error('Application not found or unauthorized');
    }

    return prisma.interview.create({
      data: {
        ...data,
        applicationId,
      },
    });
  }

  async getInterviews(userId: string) {
    return prisma.interview.findMany({
      where: {
        application: { userId },
      },
      include: {
        application: {
          select: {
            companyName: true,
            jobTitle: true,
          },
        },
      },
      orderBy: { interviewDate: 'asc' },
    });
  }

  async getInterviewById(id: string, userId: string) {
    const interview = await prisma.interview.findFirst({
      where: {
        id,
        application: { userId },
      },
      include: {
        application: true,
      },
    });

    if (!interview) throw new Error('Interview not found or unauthorized');
    return interview;
  }

  async updateInterview(id: string, userId: string, data: any) {
    const interview = await prisma.interview.findFirst({
      where: {
        id,
        application: { userId },
      },
    });

    if (!interview) throw new Error('Interview not found or unauthorized');

    return prisma.interview.update({
      where: { id },
      data,
    });
  }

  async deleteInterview(id: string, userId: string) {
    const interview = await prisma.interview.findFirst({
      where: {
        id,
        application: { userId },
      },
    });

    if (!interview) throw new Error('Interview not found or unauthorized');

    return prisma.interview.delete({
      where: { id },
    });
  }
}

export const interviewService = new InterviewService();
