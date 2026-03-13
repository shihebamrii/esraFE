import { api } from '@/lib/api';

export interface AdminStats {
  totalRevenue: string;
  activeUsers: number;
  videoCount: number;
  photoCount: number;
}

export const AdminService = {
  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('/dashboard/admin-stats');
    return response.data.data || response.data;
  },
  // Photos
  getPhotos: async (params?: any) => {
    const response = await api.get('/admin/photos', { params });
    return response.data;
  },
  approvePhoto: async (id: string, status: 'approved' | 'rejected') => {
    const response = await api.put(`/admin/photos/${id}/approve`, { status });
    return response.data;
  },
  uploadPhoto: async (formData: FormData) => {
    const response = await api.post('/admin/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  updatePhoto: async (id: string, formData: FormData) => {
    const response = await api.put(`/admin/photos/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  deletePhoto: async (id: string) => {
    const response = await api.delete(`/admin/photos/${id}`);
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
  uploadContent: async (formData: FormData) => {
    const response = await api.post('/admin/content/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
};
