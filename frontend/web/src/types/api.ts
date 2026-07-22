import type { components } from './openapi';

type Schemas = components['schemas'];

export type Category = Schemas['CategoryRead'];
export type ApiProduct = Schemas['ProductRead'];
export type ProductListResponse = Schemas['ProductList'];
export type FavoriteListResponse = Schemas['FavoriteList'];
export type ApiProblemDetails = Schemas['ProblemDetails'];

export type ApiUser = Schemas['UserRead'];
export type LoginRequest = Schemas['UserLogin'];
export type RegisterRequest = Schemas['UserCreate'];
export type RefreshTokenRequest = Schemas['TokenRefresh'];
export type AuthResponse = Schemas['AuthResponse'];

export type ApiCartItem = Schemas['CartItemRead'];
export type ApiCart = Schemas['CartRead'];
export type AddCartItemRequest = Schemas['CartItemCreate'];
export type UpdateCartItemRequest = Schemas['CartItemUpdate'];

export type ApiAddress = Schemas['AddressRead'];
export type CreateAddressRequest = Schemas['AddressCreate'];
export type UpdateAddressRequest = Schemas['AddressUpdate'];

export type CheckoutRequest = Omit<Schemas['CheckoutRequest'], 'payment_method'> & {
  payment_method: 'simulation';
};
export type OrderStatus = Schemas['OrderStatus'];
export type PaymentStatus = Schemas['PaymentStatus'];
export type ApiOrderItem = Schemas['OrderItemRead'];
export type ApiOrder = Schemas['OrderRead'];
