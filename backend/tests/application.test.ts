import { app } from '../src/server';
import request from 'supertest';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    application: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Application API', () => {
  const mockUser = { userId: 'user-1' };
  const mockApp = {
    id: 'app-1',
    userId: 'user-1',
    companyName: 'Test Co',
    jobTitle: 'Developer',
    applicationType: 'Internship',
    status: 'Applied',
    dateApplied: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an application', async () => {
    (prisma.application.create as jest.Mock).mockResolvedValue(mockApp);

    const res = await request(app)
      .post('/api/applications')
      .set('Authorization', 'Bearer mock-token')
      .send({
        companyName: 'Test Co',
        jobTitle: 'Developer',
        applicationType: 'Internship',
        dateApplied: '2023-01-01',
        status: 'Applied',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should fetch applications', async () => {
    (prisma.application.findMany as jest.Mock).mockResolvedValue([mockApp]);
    (prisma.application.count as jest.Mock).mockResolvedValue(1);

    const res = await request(app)
      .get('/api/applications')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('should return 404 for non-existent application', async () => {
    (prisma.application.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get('/api/applications/non-existent')
      .set('Authorization', 'Bearer mock-token');

    expect(res.status).toBe(404);
  });
});
