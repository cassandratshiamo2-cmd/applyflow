'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Notification } from '@/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.notifications.getAll({ page: 1, limit: 50 });
        setNotifications(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch notifications');
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.notifications.markRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.notifications.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.notifications.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with your application alerts</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Mark all as read
        </button>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error} />
      ) : notifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all ${
                n.isRead ? 'bg-white border-gray-100 opacity-75' : 'bg-blue-50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    n.isRead ? 'bg-gray-100' : 'bg-blue-600 text-white'
                  }`}>
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className={`font-bold ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getNotificationIcon(type: string) {
  switch (type) {
    case 'InterviewReminder': return '📅';
    case 'FollowUpReminder': return '✉️';
    case 'StatusUpdate': return '🔄';
    default: return '🔔';
  }
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
      <div className="text-5xl mb-4">🎉</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">You're all caught up!</h3>
      <p className="text-gray-600 mb-6 max-w-xs">
        No new notifications. Great job staying on top of your applications.
      </p>
    </div>
  );
}
