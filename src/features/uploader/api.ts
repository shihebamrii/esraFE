import { api } from '@/lib/api';

export interface DashboardStats {
  content: {
    total: number;
    views: number;
    downloads: number;
    videoCount: number;
    audioCount: number;
  };
  photos: {
    total: number;
    downloads: number;
    sales: number;
    earnings: number;
  };
  totalUploads: number;
  totalViews: number;
}

export interface RecentActivityItem {
  _id: string;
  title: string;
  type: string;
  category: 'content' | 'photo';
  createdAt: string;
  metric: number;
  metricLabel: string;
  status: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: string;
  downloadCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    items: number;
    total: string;
    status: string;
    date: string;
  }[];
}

export interface AdminStats {
  totalRevenue: string;
  activeUsers: number;
  videoCount: number;
  photoCount: number;
}

export const UploaderService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data;
  },

  getRecentActivity: async (): Promise<RecentActivityItem[]> => {
    const response = await api.get('/dashboard/recent');
    return response.data.data;
  },

  getMyContent: async (params?: any) => {
    const response = await api.get('/dashboard/my-content', { params });
    return response.data;
  },

  getMyPhotos: async (params?: any) => {
    const response = await api.get('/dashboard/my-photos', { params });
    return response.data;
  },

  // Upload content (video/audio/documentary) via the admin route (accessible to uploaders)
  uploadContent: async (data: FormData) => {
    const response = await api.post('/admin/content/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Upload photo via the admin route (accessible to uploaders)
  uploadPhoto: async (data: FormData) => {
    const response = await api.post('/admin/photos/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update content
  updateContent: async (id: string, data: any) => {
    const response = await api.put(`/admin/content/${id}`, data);
    return response.data;
  },

  // Update photo
  updatePhoto: async (id: string, data: any) => {
    const response = await api.put(`/admin/photos/${id}`, data);
    return response.data;
  },

  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get('/dashboard/user-stats');
    return response.data.data;
  },

  getAdminStats: async (): Promise<AdminStats> => {
    const response = await api.get('/dashboard/admin-stats');
    return response.data.data;
  },
};
