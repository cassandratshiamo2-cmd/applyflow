import { z } from 'zod';

export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  applicationType: z.enum(['Internship', 'WIL', 'GraduateJob', 'FullTimeJob']),
  dateApplied: z.string().pipe(z.coerce.date()),
  status: z.enum(['Saved', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn']),
  location: z.string().optional(),
  workArrangement: z.enum(['Remote', 'Hybrid', 'Onsite']).optional(),
  jobDescription: z.string().optional(),
  applicationUrl: z.string().url('Invalid application URL').optional().or(z.literal('')),
  salaryOrStipend: z.string().optional(),
  contactPerson: z.string().optional(),
  contactEmail: z.string().email('Invalid contact email').optional().or(z.literal('')),
  notes: z.string().optional(),
});

export const updateApplicationSchema = applicationSchema.partial();

export const statusUpdateSchema = z.object({
  status: z.enum(['Saved', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn']),
});
