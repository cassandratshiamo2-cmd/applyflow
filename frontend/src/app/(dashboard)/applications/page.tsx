'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Application, ApplicationStatus, ApplicationType, WorkArrangement } from '@/types';
import Link from 'next/link';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
    location: '',
    workArrangement: '',
    sort: 'dateApplied',
    order: 'desc',
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    async function fetchApplications() {
      setIsLoading(true);
      try {
        const response = await api.applications.getAll(filters);
        setApplications(response.data);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600">Manage and track your job hunt</p>
        </div>
        <Link
          href="/applications/new"
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          + Add Application
        </Link>
      </header>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            placeholder="Search company, title, or person..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Statuses</option>
          {['Saved', 'Applied', 'Assessment', 'Shortlisted', 'Interview', 'Offer', 'Rejected', 'Withdrawn'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          {['Internship', 'WIL', 'GraduateJob', 'FullTimeJob'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          value={filters.sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
        >
          <option value="dateApplied">Date Applied</option>
          <option value="companyName">Company Name</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : applications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Company</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Position</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date Applied</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{app.companyName}</td>
                    <td className="px-6 py-4 text-gray-600">{app.jobTitle}</td>
                    <td className="px-6 py-4 text-gray-600">{app.applicationType}</td>
                    <td className="px-6 py-4 text-gray-600">{new Date(app.dateApplied).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/applications/${app.id}`} className="text-blue-600 hover:underline text-sm font-medium">View</Link>
                      <Link href={`/applications/edit/${app.id}`} className="text-gray-600 hover:underline text-sm font-medium">Edit</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{app.companyName}</h3>
                    <p className="text-sm text-gray-600">{app.jobTitle}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{app.applicationType}</span>
                  <span>{new Date(app.dateApplied).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-4 pt-2">
                  <Link href={`/applications/${app.id}`} className="flex-1 text-center py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700">View</Link>
                  <Link href={`/applications/edit/${app.id}`} className="flex-1 text-center py-2 bg-blue-50 rounded-lg text-sm font-medium text-blue-600">Edit</Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
            <div className="flex space-x-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handleFilterChange('page', pagination.page - 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handleFilterChange('page', pagination.page + 1)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
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
      <div className="text-5xl mb-4">📁</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No applications yet</h3>
      <p className="text-gray-600 mb-6 max-w-xs">
        Start tracking your job search by adding your first application.
      </p>
      <Link
        href="/applications/new"
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Application
      </Link>
    </div>
  );
}
