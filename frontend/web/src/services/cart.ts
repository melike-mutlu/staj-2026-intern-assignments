import { api } from './api';
import type { ApiCart, AddCartItemRequest, UpdateCartItemRequest } from '../types/api';

export async function getCart(): Promise<ApiCart> {
  const response = await api.get<ApiCart>('/cart');
  return response.data;
}

export async function addCartItem(productId: number, quantity: number): Promise<ApiCart> {
  const payload: AddCartItemRequest = { product_id: productId, quantity };
  const response = await api.post<ApiCart>('/cart/items', payload);
  return response.data;
}

export async function updateCartItem(productId: number, quantity: number): Promise<ApiCart> {
  const payload: UpdateCartItemRequest = { quantity };
  const response = await api.patch<ApiCart>(`/cart/items/${productId}`, payload);
  return response.data;
}

export async function removeCartItem(productId: number): Promise<void> {
  await api.delete(`/cart/items/${productId}`);
}

export async function clearServerCart(): Promise<void> {
  await api.delete('/cart');
}
