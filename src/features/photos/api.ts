import { api } from '@/lib/api';

export interface Photo {
  _id: string;
  title: string;
  description: string;
  governorate: string;
  landscapeType: string;
  priceTND: number;
  previewUrl: string;
  tags: string[];
  createdAt: string;
}

export const PhotoService = {
  getPhotos: async (params?: any) => {
    const response = await api.get('/photos', { params });
    return response.data;
  },

  getPhoto: async (id: string) => {
    const response = await api.get(`/photos/${id}`);
    return response.data;
  },

  getGovernorates: async () => {
    const response = await api.get('/photos/governorates');
    return response.data;
  },

  getLandscapeTypes: async () => {
    const response = await api.get('/photos/landscape-types');
    return response.data;
  },

  getPacks: async (params?: any) => {
    const response = await api.get('/photos/packs', { params });
    return response.data;
  },

  uploadPhoto: async (formData: FormData) => {
    const response = await api.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
