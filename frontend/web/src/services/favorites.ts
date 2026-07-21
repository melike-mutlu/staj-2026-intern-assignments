import { api } from './api';
import type { FavoriteListResponse } from '../types/api';

export const getFavorites = async (): Promise<FavoriteListResponse> => {
  const response = await api.get<FavoriteListResponse>('/favorites');
  return response.data;
};

export const addFavorite = async (productId: number): Promise<FavoriteListResponse> => {
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error('Geçersiz ürün IDsi');
  }
  const response = await api.post<FavoriteListResponse>(`/favorites/${productId}`);
  return response.data;
};

export const removeFavorite = async (productId: number): Promise<void> => {
  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error('Geçersiz ürün IDsi');
  }
  await api.delete(`/favorites/${productId}`);
};
