'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Interview } from '@/types';

export default function InterviewDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInterview() {
      if (!id) return;

      try {
        const response = await api.interviews.getOne(id);
        setInterview(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load interview');
      } finally {
        setIsLoading(false);
      }
    }

    fetchInterview();
  }, [id]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!interview) return <ErrorState message="Interview not found" />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <Link
            href="/interviews"
            className="shrink-0 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            Back
          </Link>
          <div className="min-w-0">
            <h1 className="break-words text-2xl font-bold text-gray-900 sm:text-3xl">Interview details</h1>
            <p className="break-words text-gray-600">
              {interview.application?.companyName || 'Application'}
              {interview.application?.jobTitle ? ` · ${interview.application.jobTitle}` : ''}
            </p>
          </div>
        </div>
        <Link
          href={`/interviews/new?applicationId=${interview.applicationId}`}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
        >
          Add another interview
        </Link>
      </header>

      <section className="space-y-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-bold text-gray-900">{interview.interviewType} interview</h2>
          <StatusBadge status={interview.status} />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailItem label="Date" value={new Date(interview.interviewDate).toLocaleDateString()} />
          <DetailItem label="Time" value={interview.interviewTime} />
          <DetailItem label="Location or link" value={interview.locationOrLink || 'Not specified'} />
          <DetailItem label="Status" value={interview.status} />
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500">Notes</h3>
          <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-700">
            {interview.notes || 'No notes added yet.'}
          </p>
        </div>
      </section>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="break-words font-medium text-gray-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Interview['status'] }) {
  const colors = {
    Upcoming: 'bg-blue-100 text-blue-700',
    Completed: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700',
  };

  return <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${colors[status]}`}>{status}</span>;
}

function LoadingState() {
  return <div className="flex min-h-[40vh] items-center justify-center text-blue-600">Loading interview...</div>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">{message}</div>
    </div>
  );
}
