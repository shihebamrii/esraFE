import { api } from '@/lib/api';

export const AdminService = {
  // Photos
  getPhotos: async (params?: any) => {
    const response = await api.get('/admin/photos', { params });
    return response.data;
  },
  approvePhoto: async (id: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/admin/photos/${id}/approve`, { status });
    return response.data;
  },

  // Content
  getContent: async (params?: any) => {
    const response = await api.get('/admin/content', { params });
    return response.data;
  },
  approveContent: async (id: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/admin/content/${id}/approve`, { status });
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
};
