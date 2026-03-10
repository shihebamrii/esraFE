import { api } from '@/lib/api';

export const NotificationService = {
  getVapidKey: async () => {
    const response = await api.get('/notifications/vapid-key');
    return response.data;
  },

  subscribe: async (subscription: PushSubscription) => {
    const response = await api.post('/notifications/subscribe', subscription);
    return response.data;
  },

  getMyNotifications: async (params?: any) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  }
};
