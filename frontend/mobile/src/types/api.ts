import type { components } from './openapi';

type Schemas = components['schemas'];

export type Category = Schemas['CategoryRead'];
export type ApiProduct = Schemas['ProductRead'];
export type ProductListResponse = Schemas['ProductList'];
export type ApiUser = Schemas['UserRead'];
export type AuthResponse = Schemas['AuthResponse'];
export type ApiCartItem = Schemas['CartItemRead'];
export type ApiCart = Schemas['CartRead'];
export type ApiAddress = Schemas['AddressRead'];
export type CreateAddressRequest = Schemas['AddressCreate'];
export type ApiOrderItem = Schemas['OrderItemRead'];
export type ApiOrder = Schemas['OrderRead'];
export type ApiProblemDetails = Schemas['ProblemDetails'];
