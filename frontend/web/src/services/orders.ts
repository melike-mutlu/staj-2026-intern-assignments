import { api } from './api';
import type { ApiOrder, CheckoutRequest } from '../types/api';

export const createOrder = async (payload: CheckoutRequest): Promise<ApiOrder> => {
  const { data } = await api.post<ApiOrder>('/orders', payload);
  return data;
};

export const getOrders = async (): Promise<ApiOrder[]> => {
  const { data } = await api.get<ApiOrder[]>('/orders');
  return data;
};

export const getOrder = async (orderId: number): Promise<ApiOrder> => {
  const { data } = await api.get<ApiOrder>(`/orders/${orderId}`);
  return data;
};
