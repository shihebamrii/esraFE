import { api } from '@/lib/api';

export interface AdminStats {
  totalRevenue: string;
  activeUsers: number;
  videoCount: number;
  photoCount: number;
  totalDownloads: number;
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
    const response = await api.post('/admin/photos/upload', formData);
    return response.data;
  },
  updatePhoto: async (id: string, formData: FormData) => {
    const response = await api.put(`/admin/photos/${id}`, formData);
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
    const response = await api.post('/admin/content/upload', formData);
    return response.data;
  },
  updateContent: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/${id}`, data);
    return response.data;
  },
  deleteContent: async (id: string) => {
    const response = await api.delete(`/admin/content/${id}`);
    return response.data;
  },

  // Users
  getUsers: async (params?: any) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  updateUser: async (id: string, data: any) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  updateUserStatus: async (id: string, isActive: boolean) => {
    const response = await api.put(`/admin/users/${id}/status`, { isActive });
    return response.data;
  },
  updateUserPackQuota: async (userId: string, userPackId: string, quotas: any) => {
    const response = await api.put(`/admin/users/${userId}/packs/${userPackId}`, { quotas });
    return response.data;
  },

  // Playlists
  getPlaylists: async (params?: any) => {
    const response = await api.get('/admin/playlists', { params });
    return response.data;
  },
  createPlaylist: async (data: any) => {
    const response = await api.post('/admin/playlists', data);
    return response.data;
  },
  updatePlaylist: async (id: string, data: any) => {
    const response = await api.put(`/admin/playlists/${id}`, data);
    return response.data;
  },
  deletePlaylist: async (id: string) => {
    const response = await api.delete(`/admin/playlists/${id}`);
    return response.data;
  },

  // Packs
  getPacks: async (params?: any) => {
    const response = await api.get('/admin/packs', { params });
    return response.data;
  },
  createPack: async (data: any) => {
    const response = await api.post('/admin/packs', data);
    return response.data;
  },
  updatePack: async (id: string, data: any) => {
    const response = await api.put(`/admin/packs/${id}`, data);
    return response.data;
  },
  deletePack: async (id: string) => {
    const response = await api.delete(`/admin/packs/${id}`);
    return response.data;
  },
};
