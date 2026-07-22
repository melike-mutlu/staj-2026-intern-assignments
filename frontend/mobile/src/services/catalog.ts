import { api } from './api';
import type { ApiProduct, Category, ProductListResponse } from '../types/api';

export interface ProductFilters {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
  const response = await api.get<ProductListResponse>('/products', { params: filters });
  return response.data;
}

export async function getProduct(id: string): Promise<ApiProduct> {
  const response = await api.get<ApiProduct>(`/products/${id}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}
