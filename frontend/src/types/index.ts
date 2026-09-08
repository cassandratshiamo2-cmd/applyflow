export type ApplicationType = 'Internship' | 'WIL' | 'GraduateJob' | 'FullTimeJob';
export type ApplicationStatus = 'Saved' | 'Applied' | 'Assessment' | 'Shortlisted' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
export type WorkArrangement = 'Remote' | 'Hybrid' | 'Onsite';
export type InterviewType = 'Phone' | 'Video' | 'InPerson' | 'Technical' | 'Panel' | 'Other';
export type InterviewStatus = 'Upcoming' | 'Completed' | 'Cancelled';
export type NotificationType = 'InterviewReminder' | 'FollowUpReminder' | 'StatusUpdate' | 'General';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface Application {
  id: string;
  userId: string;
  companyName: string;
  jobTitle: string;
  applicationType: ApplicationType;
  dateApplied: string;
  status: ApplicationStatus;
  location?: string;
  workArrangement?: WorkArrangement;
  jobDescription?: string;
  applicationUrl?: string;
  salaryOrStipend?: string;
  contactPerson?: string;
  contactEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  interviews?: Interview[];
}

export interface Interview {
  id: string;
  applicationId: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: InterviewType;
  locationOrLink?: string;
  notes?: string;
  status: InterviewStatus;
  createdAt: string;
  updatedAt: string;
  application?: {
    companyName: string;
    jobTitle: string;
  };
}

export interface Notification {
  id: string;
  userId: string;
  applicationId?: string;
  type: NotificationType;
  title: string;
  message: string;
  scheduledFor?: string;
  isRead: boolean;
  createdAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  total: number;
  statusCounts: Record<ApplicationStatus, number>;
  metrics: {
    interviewRate: number;
    offerRate: number;
    rejectionRate: number;
  };
}
