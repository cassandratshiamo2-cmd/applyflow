import { Request, Response } from 'express';
import { applicationService } from '../services/application.service';
import { applicationSchema, updateApplicationSchema, statusUpdateSchema } from '../validators/application.validator';

const getParam = (param: string | string[]) => (Array.isArray(param) ? param[0] : param);

export class ApplicationController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const validatedData = applicationSchema.parse(req.body);
      const application = await applicationService.createApplication(userId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: application,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create application',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const params = {
        search: req.query.search as string,
        status: req.query.status as any,
        type: req.query.type as any,
        location: req.query.location as string,
        workArrangement: req.query.workArrangement as any,
        sort: req.query.sort as string,
        order: req.query.order as any,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
      };

      const result = await applicationService.getApplications(userId, params);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch applications',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      const application = await applicationService.getApplicationById(id, userId);

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Application not found',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      const validatedData = updateApplicationSchema.parse(req.body);
      const application = await applicationService.updateApplication(id, userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: application,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update application',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      await applicationService.deleteApplication(id, userId);

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Application not found',
      });
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      const { status } = statusUpdateSchema.parse(req.body);
      const application = await applicationService.updateStatus(id, userId, status);

      res.status(200).json({
        success: true,
        message: 'Application status updated successfully',
        data: application,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update status',
      });
    }
  }
}

export const applicationController = new ApplicationController();
