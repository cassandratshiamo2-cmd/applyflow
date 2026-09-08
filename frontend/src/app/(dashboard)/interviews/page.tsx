'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Interview } from '@/types';
import Link from 'next/link';

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchInterviews() {
      try {
        const response = await api.interviews.getAll();
        setInterviews(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch interviews');
      } finally {
        setIsLoading(false);
      }
    }
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews</h1>
          <p className="text-gray-600">Your upcoming and past interview schedule</p>
        </div>
        <Link
          href="/interviews/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          + Add Interview
        </Link>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : interviews.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((int) => (
            <div key={int.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{int.application?.companyName}</h3>
                  <p className="text-sm text-gray-600">{int.application?.jobTitle}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  int.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' :
                  int.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {int.status}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">📅</span>
                  <span>{new Date(int.interviewDate).toLocaleDateString()} at {int.interviewTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">🎧</span>
                  <span>{int.interviewType}</span>
                </div>
                {int.locationOrLink && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">📍</span>
                    <span className="truncate">{int.locationOrLink}</span>
                  </div>
                )}
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <Link href={`/interviews/${int.id}`} className="text-sm font-medium text-blue-600 hover:underline">Details</Link>
                <button
                  onClick={async () => {
                    if (confirm('Delete this interview?')) {
                      try {
                        await api.interviews.delete(int.id);
                        // Refresh page or state
                        window.location.reload();
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }
                  }}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg">
        {message}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border-2 border-dashed border-gray-200">
      <div className="text-5xl mb-4">📅</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No interviews scheduled</h3>
      <p className="text-gray-600 mb-6 max-w-xs">
        Your upcoming interviews will appear here. Keep applying!
      </p>
      <Link
        href="/interviews/new"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Interview
      </Link>
    </div>
  );
}
