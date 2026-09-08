'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Application, ApplicationStatus } from '@/types';
import Link from 'next/link';

export default function ApplicationDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

      useEffect(() => {
        async function fetchApplication() {
          if (!id) return;
          try {
            const response = await api.applications.getOne(id) as any;
            setApplication(response.data);
          } catch (err: any) {
            setError(err.message || 'Failed to load application');
          } finally {
            setIsLoading(false);
          }
        }
        fetchApplication();
      }, [id]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!application) return <ErrorState message="Application not found" />;

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/applications"
            className="p-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Back
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{application.companyName}</h1>
            <p className="text-lg text-gray-600">{application.jobTitle}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/applications/edit/${application.id}`}
            className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={async () => {
              if (confirm('Are you sure you want to delete this application?')) {
                try {
                  await api.applications.delete(application.id);
                  router.push('/applications');
                } catch (err: any) {
                  alert(err.message);
                }
              }
            }}
            className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            Delete
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Application Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label="Status" value={<StatusBadge status={application.status} />} />
              <DetailItem label="Type" value={application.applicationType} />
              <DetailItem label="Date Applied" value={new Date(application.dateApplied).toLocaleDateString()} />
              <DetailItem label="Location" value={application.location || 'Not specified'} />
              <DetailItem label="Work Arrangement" value={application.workArrangement || 'Not specified'} />
              <DetailItem label="Salary/Stipend" value={application.salaryOrStipend || 'Not specified'} />
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Job Description</h3>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {application.jobDescription || 'No description provided.'}
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Personal Notes</h3>
            <p className="text-gray-600 whitespace-pre-wrap italic">
              {application.notes || 'No notes added yet.'}
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Contact Info</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Contact Person</p>
                <p className="text-gray-900 font-medium">{application.contactPerson || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase">Email Address</p>
                {application.contactEmail ? (
                  <p className="text-blue-600 hover:underline cursor-pointer">
                    <a href={`mailto:${application.contactEmail}`}>{application.contactEmail}</a>
                  </p>
                ) : (
                  <p className="text-gray-500">Not provided</p>
                )}
              </div>
              {application.applicationUrl && (
                <div className="pt-4">
                  <Link
                    href={application.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Visit Job Page
                  </Link>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Interviews</h3>
              <Link
                href={`/interviews/new?applicationId=${application.id}`}
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                + Add
              </Link>
            </div>
            {application.interviews && application.interviews.length > 0 ? (
              <div className="space-y-3">
                {application.interviews.map((int: any) => (
                  <div key={int.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-bold text-gray-900">{int.interviewType}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        int.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                        int.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {int.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {new Date(int.interviewDate).toLocaleDateString()} at {int.interviewTime}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No interviews scheduled yet.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-gray-500 uppercase">{label}</p>
      <p className="text-gray-900 font-medium">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const colors: Record<ApplicationStatus, string> = {
    Saved: 'bg-gray-100 text-gray-700',
    Applied: 'bg-blue-100 text-blue-700',
    Assessment: 'bg-yellow-100 text-yellow-700',
    Shortlisted: 'bg-indigo-100 text-indigo-700',
    Interview: 'bg-purple-100 text-purple-700',
    Offer: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-700',
    Withdrawn: 'bg-gray-200 text-gray-600',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
      {status}
    </span>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
        {message}
      </div>
    </div>
  );
}
