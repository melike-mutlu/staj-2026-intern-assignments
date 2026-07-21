import { api } from './api';
import type { ApiProduct, ProductListResponse, Category } from '../types/api';
import type { Product } from '../types/product';

// --- Mapper ---

export function mapApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    id: String(apiProduct.id),
    name: apiProduct.name,
    description: apiProduct.description,
    price: apiProduct.price,
    image: apiProduct.image_url,
    category: apiProduct.category?.name ?? '',
    slug: apiProduct.slug,
    stock: apiProduct.stock,
    rating: apiProduct.rating,
  };
}

// --- Query params ---

export interface GetProductsParams {
  page?: number;
  size?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// --- Service functions ---

export async function getProducts(params: GetProductsParams = {}): Promise<ProductListResponse> {
  const cleanParams: Record<string, string | number> = {};

  if (params.page !== undefined) cleanParams.page = params.page;
  if (params.size !== undefined) cleanParams.size = params.size;
  if (params.q && params.q.length >= 2) cleanParams.q = params.q;
  if (params.category) cleanParams.category = params.category;
  if (params.minPrice !== undefined) cleanParams.minPrice = params.minPrice;
  if (params.maxPrice !== undefined) cleanParams.maxPrice = params.maxPrice;

  const response = await api.get<ProductListResponse>('/products', { params: cleanParams });
  return response.data;
}

export async function getProduct(identifier: string): Promise<ApiProduct> {
  const response = await api.get<ApiProduct>(`/products/${identifier}`);
  return response.data;
}

export async function getCategories(): Promise<Category[]> {
  const response = await api.get<Category[]>('/categories');
  return response.data;
}
