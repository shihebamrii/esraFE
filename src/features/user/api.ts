import { api } from '@/lib/api';

export interface OrderItem {
  id: string;
  orderNumber: string;
  items: { title: string; type: string }[];
  total: string;
  status: string;
  date: string;
}

export interface DownloadItem {
  id: string;
  itemId: string;
  title: string;
  type: string;
  purchaseDate: string;
  size: string;
  format: string;
  orderId: string;
  downloadToken: string | null;
  downloadUrl?: string;
  thumbnail: string | null;
}

export interface FavoriteItem {
  _id: string;
  itemId: {
    _id: string;
    title: string;
    priceTND?: number;
    price?: number;
    location?: string;
    governorate?: string;
    type?: string;
    thumbnailUrl?: string;
    watermarkedUrl?: string;
    previewUrl?: string;
    imageUrl?: string;
    mediaType?: 'photo' | 'video';
  };
  itemType: string;
  createdAt: string;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: string;
  downloadCount: number;
  recentOrders: {
    orderNumber: string;
    items: number;
    date: string;
    total: string;
    status: string;
  }[];
}

export const UserService = {
  getUserStats: async (): Promise<UserStats> => {
    const response = await api.get('/dashboard/user-stats');
    return response.data.data || response.data;
  },
  getMyOrders: async (params?: any) => {
    const response = await api.get('/checkout/orders', { params });
    return response.data;
  },

  getMyDownloads: async (): Promise<DownloadItem[]> => {
    const response = await api.get('/dashboard/downloads');
    return response.data.data;
  },

  getFavorites: async (): Promise<FavoriteItem[]> => {
    const response = await api.get('/favorites');
    return response.data.data;
  },

  toggleFavorite: async (itemType: string, itemId: string) => {
    const response = await api.post('/favorites/toggle', { itemType, itemId });
    return response.data;
  },

  getUserPacks: async () => {
    const response = await api.get('/dashboard/packs');
    return response.data;
  },

  trackDownload: async (itemId: string, itemType: 'photo' | 'content' | 'pack') => {
    try {
      await api.post('/dashboard/track-download', { itemId, itemType });
    } catch {
      // Non-blocking — don't fail the download if tracking fails
    }
  },
};
