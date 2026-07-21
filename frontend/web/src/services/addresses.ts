import { api } from './api';
import type { ApiAddress, CreateAddressRequest, UpdateAddressRequest } from '../types/api';

export const getAddresses = async (): Promise<ApiAddress[]> => {
  const { data } = await api.get<ApiAddress[]>('/users/me/addresses');
  return data;
};

export const createAddress = async (payload: CreateAddressRequest): Promise<ApiAddress> => {
  const { data } = await api.post<ApiAddress>('/users/me/addresses', payload);
  return data;
};

export const updateAddress = async (addressId: number, payload: UpdateAddressRequest): Promise<ApiAddress> => {
  const { data } = await api.patch<ApiAddress>(`/users/me/addresses/${addressId}`, payload);
  return data;
};

export const deleteAddress = async (addressId: number): Promise<void> => {
  await api.delete(`/users/me/addresses/${addressId}`);
};
