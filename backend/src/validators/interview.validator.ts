import { z } from 'zod';

export const interviewSchema = z.object({
  interviewDate: z.string().pipe(z.coerce.date()),
  interviewTime: z.string().min(1, 'Interview time is required'),
  interviewType: z.enum(['Phone', 'Video', 'InPerson', 'Technical', 'Panel', 'Other']),
  locationOrLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['Upcoming', 'Completed', 'Cancelled']).optional(),
});

export const updateInterviewSchema = interviewSchema.partial();
