import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ProfileController {
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;
      const { name, email } = req.body;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update profile',
      });
    }
  }
}

export const profileController = new ProfileController();
