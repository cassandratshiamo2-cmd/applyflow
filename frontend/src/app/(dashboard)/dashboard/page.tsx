'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { DashboardStats } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trends, setTrends] = useState<Record<string, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          api.dashboard.getStats(),
          api.dashboard.getTrends(),
        ]);
        setStats(statsRes.data);
        setTrends(trendsRes.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back! 👋</h1>
        <p className="text-gray-600">Here's a summary of your application progress.</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Applications" value={stats?.total || 0} color="blue" />
        <StatCard title="Interviews" value={stats?.statusCounts.Interview || 0} color="purple" />
        <StatCard title="Offers" value={stats?.statusCounts.Offer || 0} color="green" />
        <StatCard title="Rejected" value={stats?.statusCounts.Rejected || 0} color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application Distribution */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Application Status Distribution</h3>
          <div className="space-y-4">
            {Object.entries(stats?.statusCounts || {}).map(([status, count]) => (
              <div key={status} className="space-y-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{status}</span>
                  <span className="text-gray-500">{count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats ? (count / stats.total) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Metrics */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Success Rates</h3>
          <div className="space-y-6">
            <MetricItem
              label="Interview Rate"
              value={`${stats?.metrics.interviewRate.toFixed(1)}%`}
              color="text-purple-600"
            />
            <MetricItem
              label="Offer Rate"
              value={`${stats?.metrics.offerRate.toFixed(1)}%`}
              color="text-green-600"
            />
            <MetricItem
              label="Rejection Rate"
              value={`${stats?.metrics.rejectionRate.toFixed(1)}%`}
              color="text-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
      <div className={`text-3xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}

function MetricItem({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
      <span className="text-sm text-gray-600 font-medium">{label}</span>
      <span className={`text-lg font-bold ${color}`}>{value}</span>
    </div>
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
