import { api } from './api';
import type { ApiAddress, ApiCart, ApiOrder, CreateAddressRequest } from '../types/api';

export async function getCart(): Promise<ApiCart> {
  return (await api.get<ApiCart>('/cart')).data;
}

export async function addCartItem(productId: number, quantity = 1): Promise<ApiCart> {
  return (await api.post<ApiCart>('/cart/items', { product_id: productId, quantity })).data;
}

export async function updateCartItem(productId: number, quantity: number): Promise<ApiCart> {
  return (await api.patch<ApiCart>(`/cart/items/${productId}`, { quantity })).data;
}

export async function removeCartItem(productId: number): Promise<void> {
  await api.delete(`/cart/items/${productId}`);
}

export async function getAddresses(): Promise<ApiAddress[]> {
  return (await api.get<ApiAddress[]>('/users/me/addresses')).data;
}

export async function createAddress(payload: CreateAddressRequest): Promise<ApiAddress> {
  return (await api.post<ApiAddress>('/users/me/addresses', payload)).data;
}

export async function checkout(shippingAddressId: number): Promise<ApiOrder> {
  return (
    await api.post<ApiOrder>('/orders', {
      shipping_address_id: shippingAddressId,
      payment_method: 'simulation',
    })
  ).data;
}

export async function getOrders(): Promise<ApiOrder[]> {
  return (await api.get<ApiOrder[]>('/orders')).data;
}

export async function getOrder(id: string): Promise<ApiOrder> {
  return (await api.get<ApiOrder>(`/orders/${id}`)).data;
}
