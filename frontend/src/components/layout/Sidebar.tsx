'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Applications', href: '/applications', icon: '📝' },
  { name: 'Interviews', href: '/interviews', icon: '📅' },
  { name: 'Notifications', href: '/notifications', icon: '🔔' },
  { name: 'Profile', href: '/profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sticky top-0 z-10 flex h-auto w-full shrink-0 flex-col bg-gray-900 text-white md:h-screen md:w-64">
      <div className="p-4 sm:p-6">
        <div className="text-2xl font-bold text-blue-400">ApplyTrack</div>
      </div>

      <nav className="flex flex-grow gap-2 overflow-x-auto px-3 pb-3 md:block md:space-y-2 md:overflow-visible md:px-4 md:pb-0">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors sm:px-4 sm:py-3 md:text-base ${
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center space-x-3 px-4 py-3 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-400 hover:bg-red-900/20 hover:text-red-400 rounded-lg transition-colors"
        >
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
