const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result as any;
}

export const api = {
  auth: {
    register: (data: any) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: any) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request('/auth/me'),
  },
  applications: {
    getAll: (params: any) => {
      const query = new URLSearchParams(params).toString();
      return request(`/applications?${query}`);
    },
    getOne: (id: string) => request(`/applications/${id}`),
    create: (data: any) => request('/applications', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/applications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/applications/${id}`, { method: 'DELETE' }),
    updateStatus: (id: string, status: string) => request(`/applications/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  },
  interviews: {
    getAll: () => request('/interviews'),
    getOne: (id: string) => request(`/interviews/${id}`),
    create: (data: any) => request('/interviews', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/interviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => request(`/interviews/${id}`, { method: 'DELETE' }),
  },
  notifications: {
    getAll: (params: any) => {
      const query = new URLSearchParams(params).toString();
      return request(`/notifications?${query}`);
    },
    getCount: () => request('/notifications/count'),
    markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
    delete: (id: string) => request(`/notifications/${id}`, { method: 'DELETE' }),
  },
  dashboard: {
    getStats: () => request('/dashboard/stats'),
    getTrends: () => request('/dashboard/trends'),
  },
};
