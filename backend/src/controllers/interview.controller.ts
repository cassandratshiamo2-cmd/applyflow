import { Request, Response } from 'express';
import { interviewService } from '../services/interview.service';
import { interviewSchema, updateInterviewSchema } from '../validators/interview.validator';

const getParam = (param: string | string[]) => (Array.isArray(param) ? param[0] : param);

export class InterviewController {
  async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { applicationId } = req.body;
      if (!applicationId) {
        return res.status(400).json({ success: false, message: 'applicationId is required' });
      }
      const validatedData = interviewSchema.parse(req.body);

      const interview = await interviewService.createInterview(applicationId, userId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Interview created successfully',
        data: interview,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create interview',
      });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const interviews = await interviewService.getInterviews(userId);

      res.status(200).json({
        success: true,
        data: interviews,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch interviews',
      });
    }
  }

  async getOne(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      const interview = await interviewService.getInterviewById(id, userId);

      res.status(200).json({
        success: true,
        data: interview,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Interview not found',
      });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      const validatedData = updateInterviewSchema.parse(req.body);
      const interview = await interviewService.updateInterview(id, userId, validatedData);

      res.status(200).json({
        success: true,
        message: 'Interview updated successfully',
        data: interview,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update interview',
      });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const id = getParam(req.params.id);
      await interviewService.deleteInterview(id, userId);

      res.status(200).json({
        success: true,
        message: 'Interview deleted successfully',
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Interview not found',
      });
    }
  }
}

export const interviewController = new InterviewController();
