export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ApiProduct {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  rating: number;
  image_url: string;
  is_active: boolean;
  category: Category | null;
}

export interface ProductListResponse {
  page: number;
  size: number;
  total: number;
  items: ApiProduct[];
}

export interface FavoriteListResponse {
  total: number;
  items: ApiProduct[];
}

export interface ApiProblemDetails {
  detail: string;
  status?: number;
  title?: string;
  type?: string;
  instance?: string;
}

// --- Auth types ---

export interface ApiUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: ApiUser;
}

// --- Cart types ---

export interface ApiCartItem {
  product_id: number;
  product_name: string;
  slug: string;
  image_url: string;
  unit_price: number;
  quantity: number;
  line_total: number;
  stock: number;
}

export interface ApiCart {
  items: ApiCartItem[];
  subtotal: number;
}

export interface AddCartItemRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

// --- Address types ---

export interface ApiAddress {
  id: number;
  title: string;
  city: string;
  district: string;
  line1: string;
  postal_code?: string | null;
}

export interface CreateAddressRequest {
  title: string;
  city: string;
  district: string;
  line1: string;
  postal_code?: string | null;
}

export interface UpdateAddressRequest {
  title?: string;
  city?: string;
  district?: string;
  line1?: string;
  postal_code?: string | null;
}

// --- Order types ---

export interface CheckoutRequest {
  shipping_address_id: number;
  payment_method: 'simulation';
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'cancelled';
export type PaymentStatus = 'simulated' | 'failed';

export interface ApiOrderItem {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface ApiOrder {
  id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  shipping_address: string;
  created_at: string;
  items: ApiOrderItem[];
}
